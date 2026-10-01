# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Racury Works" — a Korean-language game-dev tech blog (lectures, devlogs, game design) on GitHub Pages at siguning.github.io. Jekyll 4 site with a **custom in-repo theme** ("Racury", Star Citizen–style sci-fi HUD, blue palette). No tests or linters.

## Commands

```
bundle install                          # gems go to vendor/bundle (.bundle/config)
bundle exec jekyll serve                # http://localhost:4000
bundle exec jekyll serve --drafts       # also renders _drafts/theme-showcase.markdown (feature reference)
bundle exec jekyll build                # → _site/
```

- `_config.yml` is NOT hot-reloaded by `jekyll serve`; restart after editing it. Same for `_plugins/`.
- Deploy: push to `main` → `.github/workflows/jekyll.yml` (Ruby 3.4, `JEKYLL_ENV=production`, actions pinned to SHAs). PRs only build. The legacy `github-pages` gem is intentionally NOT used, so custom `_plugins/` work.
- `Gemfile.lock` is committed.

## Architecture

- **`_plugins/racury.rb`** (Jekyll Generator, runs before render) is the core of the linking system:
  - Rewrites Obsidian wiki-links in post *source* — `[[title|slug|basename|alias]]`, `[[x|label]]`, `[[x#Heading]]` — into `<a class="wikilink">`, skipping fenced/inline code and `{% raw %}` blocks. Unresolved → `span.wikilink--missing`. Heading anchors use the same id algorithm as kramdown-parser-gfm (Korean-safe).
  - Also counts `{% post_url %}` and markdown links to `/…` post URLs as edges.
  - Sets per-post `backlinks`, `outlinks`, `related` (scored by shared tags/links/series/category), `series_posts`, `series_index`.
  - Sets `site.data.graph` (nodes: posts + `category:x` + `tag:x`; links typed `link|category|tag`) → rendered to `/assets/data/graph.json`; and `site.data.series`.
  - Liquid filter `hue`: category name → hue (190–235, blue range), overridable via `hue:` in `_data/categories.yml`. All category colors flow from CSS `--h` set inline (`style="--h: {{ cat | hue }}"`), from which `--cat`, `--cat-soft`, `--cat-line` derive (see `_sass/_tokens.scss`).
- **Layouts**: `default` → `home` (index), `post`, `page`. Pages: `archive.html`, `categories.html`, `tags.html`, `series.html`, `graph.html`, `about.markdown`, `404.html`, `search.json` (search index).
- **`_data/categories.yml`**: display name / description per category slug (unknown slugs fall back to the raw slug). Note Liquid can't do nested lookups like `site.data.categories[cat[0]]` — assign the key to a variable first.
- **CSS**: `assets/css/main.scss` `@use`s partials in `_sass/` (tokens, base, layout, components, prose, syntax, pages). Theme via `html[data-theme=dark|light]` set by an inline script in `_includes/head.html` (localStorage → OS preference). `.hud` = translucent chamfered panel with corner brackets; `.reveal` = scroll-in animation (needs `html.js`). Respect `prefers-reduced-motion`.
- **JS** (vanilla, no build): `assets/js/main.js` (theme toggle w/ View Transition, header/progress/to-top, reveal, code-block copy bar, callouts `> [!NOTE]`, heading anchors, TOC + scrollspy, lightbox, lazy MathJax/Mermaid, giscus), `search.js` (Fuse.js fuzzy search modal, Ctrl/⌘K or `/`, `#tag` `@category` filters), `graph.js` (d3-force graph; `data-graph="full"` page and `"local"` post sidebar), `filters.js` (home category chips, `/tags/` multi-tag AND/OR, state in URL hash). `head.html` loads `graph.js`/d3 only for posts or pages with `graph: true`, and `filters.js` only with `filters: true`.
- External libs come from jsdelivr npm URLs with pinned versions (d3, fuse.js ESM, mathjax, mermaid); versions are constants in the JS / `head.html`.
- Comments (giscus) are off until `giscus.repo_id`/`category_id` are filled in `_config.yml`.

## Writing posts

`_posts/YYYY-MM-DD-slug.markdown` (Korean). Layout defaults to `post`. Keep the default permalink (`/:categories/:year/:month/:day/:title.html`) — existing URLs depend on it.

```yaml
title: "제목"
date: 2025-10-17 16:00:00 +0900
categories: godot            # one category: godot, cs, lang, game-design, devlog, lecture, algorithm, dessert
tags: [gdscript, godot4]
series: "GDScript 입문"      # optional; groups posts into /series/ + in-post series box
# optional: subtitle, description, aliases, pinned, cover, last_modified_at, math, toc: false, comments: false, hidden
```

Full syntax reference (callouts, math, mermaid, wiki-links, youtube include): `_drafts/theme-showcase.markdown`.
