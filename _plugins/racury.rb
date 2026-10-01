# frozen_string_literal: true

# Racury theme plugin.
#
# - Obsidian-style wiki-links in posts: [[target]], [[target|label]], [[target#heading]]
#   `target` may be a post title, its slug, its file basename or one of its `aliases`.
# - Backlinks: every post gets `backlinks` / `outlinks` (arrays of {title, url}).
# - Graph data: site.data["graph"] = { nodes, links } consumed by /assets/data/graph.json.
# - Series: site.data["series"] = { name => [posts sorted by date] }, and
#   each post in a series gets `series_posts` and `series_index`.
# - Liquid filter `hue`: maps a string to a stable hue in the blue range.

require "digest"

module Racury
  WIKILINK_RE = /(!?)\[\[([^\[\]\n|#]+)(#[^\[\]\n|]+)?(?:\|([^\[\]\n]+))?\]\]/
  # Fenced code blocks, inline code and Liquid raw blocks are never rewritten.
  CODE_RE = /(^ {0,3}(`{3,}|~{3,})[^\n]*\n.*?^ {0,3}\2[ \t]*$|`+[^`\n]+`+|\{%-?\s*raw\s*-?%\}.*?\{%-?\s*endraw\s*-?%\})/m
  POST_URL_RE = /\{%-?\s*post_url\s+(\S+)\s*-?%\}/
  MD_LINK_RE = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/
  NON_WORD_RE = /[^\p{Word}\- \t]/

  module_function

  def key(str)
    str.to_s.strip.downcase.gsub(/\s+/, " ")
  end

  # Same algorithm as kramdown-parser-gfm, so [[post#Heading]] matches the rendered id.
  def heading_id(text)
    text.downcase.gsub(NON_WORD_RE, "").tr(" \t", "-")
  end

  # Yields only the parts of `content` that are outside code; returns the rebuilt string.
  def map_text(content)
    out = +""
    last = 0
    content.to_enum(:scan, CODE_RE).each do
      m = Regexp.last_match
      out << yield(content[last...m.begin(0)])
      out << m[0]
      last = m.end(0)
    end
    out << yield(content[last..])
    out
  end

  # `hue` from _data/categories.yml if set, else a stable hash in 190..235 (cyan → azure → cobalt).
  def hue(input, site = nil)
    custom = site&.data&.dig("categories", input.to_s, "hue")
    return custom.to_i if custom

    190 + (Digest::MD5.hexdigest(input.to_s).to_i(16) % 46)
  end

  module Filters
    def hue(input)
      Racury.hue(input, @context.registers[:site])
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      @site = site
      @baseurl = site.config["baseurl"].to_s.chomp("/")
      posts = site.posts.docs.reject { |p| p.data["published"] == false }

      index = build_index(posts)
      edges = Hash.new { |h, k| h[k] = [] }

      posts.each do |post|
        targets = rewrite_and_collect(post, index)
        targets.each { |t| edges[post] << t unless t.equal?(post) || edges[post].include?(t) }
      end

      posts.each do |post|
        post.data["outlinks"] = edges[post].map { |t| ref(t) }
        post.data["backlinks"] = posts.select { |p| edges[p].include?(post) }.map { |p| ref(p) }
      end

      posts.each { |post| post.data["related"] = related(post, posts, edges) }
      build_series(site, posts)
      site.data["graph"] = build_graph(posts, edges)
    end

    private

    def ref(doc)
      { "title" => doc.data["title"], "url" => doc.url, "date" => doc.date,
        "category" => Array(doc.data["categories"]).first.to_s }
    end

    def build_index(posts)
      index = {}
      posts.each do |p|
        keys = [p.data["title"], p.data["slug"], p.basename_without_ext, *Array(p.data["aliases"])]
        keys.compact.each { |k| index[Racury.key(k)] ||= p }
      end
      @by_url = posts.to_h { |p| [p.url.sub(/\.html\z/, ""), p] }
      @by_basename = posts.to_h { |p| [p.basename_without_ext, p] }
      index
    end

    def rewrite_and_collect(post, index)
      found = []
      post.content = Racury.map_text(post.content) do |text|
        text.scan(POST_URL_RE) { found << @by_basename[File.basename(Regexp.last_match(1), ".*")] }
        text.scan(MD_LINK_RE) do
          url = Regexp.last_match(1).sub(/\A\{\{\s*site\.baseurl\s*\}\}/, "").sub(/\A#{Regexp.escape(@baseurl)}/, "")
          next unless url.start_with?("/")

          found << @by_url[url.sub(/[#?].*\z/, "").sub(/\.html\z/, "").chomp("/")]
        end
        text.gsub(WIKILINK_RE) { wikilink(Regexp.last_match, index, found) }
      end
      found.compact
    end

    def wikilink(match, index, found)
      _embed, target, heading, label = match.captures
      heading = heading&.delete_prefix("#")&.strip
      doc = index[Racury.key(target)]
      label = (label || (heading && doc.nil? ? "#{target}##{heading}" : target)).strip
      label = label.gsub("|", "&#124;")
      unless doc
        return %(<span class="wikilink wikilink--missing" title="문서 없음: #{target.strip}">#{label}</span>)
      end

      found << doc
      href = "#{@baseurl}#{doc.url}"
      href += "##{Racury.heading_id(heading)}" if heading && !heading.empty?
      %(<a class="wikilink" href="#{href}" data-wikilink="#{doc.url}">#{label}</a>)
    end

    # Up to 3 posts scored by shared tags, links, series and category.
    def related(post, posts, edges)
      tags = Array(post.data["tags"])
      cats = Array(post.data["categories"])
      posts.filter_map do |other|
        next if other.equal?(post)

        score = (Array(other.data["tags"]) & tags).size * 3
        score += 3 if edges[post].include?(other) || edges[other].include?(post)
        score += 2 if post.data["series"] && other.data["series"] == post.data["series"]
        score += 1 unless (Array(other.data["categories"]) & cats).empty?
        [score, other] if score.positive?
      end.sort_by { |score, other| [-score, -other.date.to_i] }.first(3).map { |_, other| ref(other) }
    end

    def build_series(site, posts)
      groups = posts.select { |p| p.data["series"] }.group_by { |p| p.data["series"].to_s }
      site.data["series"] = groups.transform_values { |list| list.sort_by(&:date) }
      site.data["series"].each_value do |list|
        list.each_with_index do |p, i|
          p.data["series_posts"] = list.map { |q| ref(q) }
          p.data["series_index"] = i + 1
        end
      end
    end

    def build_graph(posts, edges)
      nodes = []
      links = []
      posts.each do |p|
        nodes << {
          "id" => p.url, "type" => "post", "title" => p.data["title"].to_s,
          "url" => "#{@baseurl}#{p.url}", "date" => p.date.strftime("%Y-%m-%d"),
          "category" => Array(p.data["categories"]).first.to_s,
          "tags" => Array(p.data["tags"]).map(&:to_s),
          "hue" => Racury.hue(Array(p.data["categories"]).first.to_s, @site)
        }
        edges[p].each { |t| links << { "source" => p.url, "target" => t.url, "type" => "link" } }
      end

      { "category" => "categories", "tag" => "tags" }.each do |type, field|
        posts.flat_map { |p| Array(p.data[field]).map(&:to_s) }.uniq.each do |name|
          id = "#{type}:#{name}"
          url = "#{@baseurl}/#{field}/##{name}"
          nodes << { "id" => id, "type" => type, "title" => (type == "tag" ? "##{name}" : name),
                     "url" => url, "hue" => Racury.hue(name, @site) }
          posts.each do |p|
            links << { "source" => p.url, "target" => id, "type" => type } if Array(p.data[field]).map(&:to_s).include?(name)
          end
        end
      end

      { "nodes" => nodes, "links" => links }
    end
  end
end

Liquid::Template.register_filter(Racury::Filters)
