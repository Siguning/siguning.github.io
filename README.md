# Racury — Jekyll theme with swappable skins

The theme behind [siguning.github.io](https://siguning.github.io). A Jekyll 4 blog theme for game-dev / tech devlogs with
Obsidian-style wiki-links, backlinks, a knowledge graph, series, fuzzy search, and **three skins** that visitors can
switch between at runtime. Every skin has light and dark modes.

| Skin id     | Look |
|-------------|------|
| `hud`       | Sci-fi cockpit HUD: chamfered translucent panels, corner brackets, starfield, blue hologram palette, glitch titles. |
| `valve`     | Valve / Source-engine inspired: warm industrial concrete, amber holo-HUD accents, rounded HUD boxes, condensed type, "chapter title" headers. |
| `backrooms` | Backrooms / late-90s homepage: yellow wallpaper, flickering fluorescent light, VHS grain and scanlines, camcorder REC overlay, Win9x bevelled windows, pixel font (Galmuri), marquee. Dark mode turns the lights off and the pointer becomes a flashlight. |

## Use it on another GitHub Pages site

The theme ships a Ruby plugin, so the site must be built by **GitHub Actions** (the legacy `github-pages` gem
doesn't allow custom plugins). Copy `.github/workflows/jekyll.yml` from this repo, then in
*Settings → Pages* set **Source: GitHub Actions**.

**Gemfile**

```ruby
source "https://rubygems.org"
gem "jekyll-theme-racury", git: "https://github.com/Siguning/siguning.github.io"
gem "webrick" # for `jekyll serve` on Ruby 3+
```

**_config.yml**

```yaml
title: My Blog                 # first word and the rest are styled separately in the logo
tagline: "Game Dev · Devlog"
description: What this blog is about.
lang: ko
url: "https://you.github.io"

theme: jekyll-theme-racury
plugins: [jekyll-theme-racury, jekyll-feed, jekyll-seo-tag, jekyll-sitemap]

markdown: kramdown
kramdown: { input: GFM, syntax_highlighter: rouge, math_engine: null }

racury:
  skin: valve                      # default skin: hud | valve | backrooms
  skin_switcher: true              # header picker; the visitor's choice is saved in their browser
  skins: [valve, hud, backrooms]   # skins offered (only these skins' fonts are loaded)
  # generate_pages: false          # see "Pages" below

nav:
  - { title: Posts, url: /archive/ }
  - { title: Categories, url: /categories/ }
  - { title: Tags, url: /tags/ }
  - { title: Series, url: /series/ }
  - { title: Graph, url: /graph/ }

author: { name: You, bio: "One-line bio" }
social: { github: you, twitter: you }   # footer links; both optional

defaults:
  - scope: { path: "", type: posts }
    values: { layout: post, toc: true, comments: true }
  - scope: { path: "" }
    values: { layout: page }
```

**index.md**

```markdown
---
layout: home
title: Home
---
```

That's all that's required: write posts in `_posts/`.

To lock a site to one skin, set `skin_switcher: false` (or list a single skin in `skins`).

### Pages

`/archive/`, `/categories/`, `/tags/`, `/series/`, `/graph/` and `/404.html` are generated automatically. To change
a title or subtitle, create your own page with the same permalink and the matching layout, e.g.:

```yaml
---
layout: archive     # archive | categories | tags | series | graph | 404
title: Archive
kicker: MISSION LOG
subtitle: 모든 글을 시간순으로
permalink: /archive/
---
```

### Optional data and settings

- `_data/categories.yml`: display name, description and `hue` per category slug.
- `giscus:` in `_config.yml` (`repo`, `repo_id`, `category`, `category_id`, `mapping`): comments, off until the IDs are set.
- `webmaster_verifications:`: search-console meta tags (via jekyll-seo-tag).
- Per-post front matter: `series`, `subtitle`, `description`, `aliases`, `pinned`, `cover`, `last_modified_at`, `math`,
  `toc: false`, `comments: false`, `hidden`. See `_drafts/theme-showcase.markdown` for the full writing syntax
  (callouts, math, mermaid, wiki-links).

## Writing your own skin

A skin is a Sass partial that overrides tokens under `:root[data-skin="name"]`:

1. Copy `_sass/skins/_valve.scss` to `_sass/skins/_myskin.scss`; change the color tokens (dark and light mixins),
   fonts, the decoration tokens (`--kicker`, `--h2-mark`, `--hr-mark`, `--cut`, `--hue-shift`, …), and any rules.
2. `@use "skins/myskin";` in `assets/css/main.scss`, and add the id to `$skins` in `_sass/_skins.scss`.
3. Add the id to `Racury::SKINS` in `lib/jekyll-theme-racury.rb`, a label in `_includes/skin-switcher.html`, swatch
   colors in `_sass/_skins.scss`, and its web fonts in `_includes/head.html`.

Skin-specific wording goes through `{% include skin-text.html hud="…" valve="…" backrooms="…" %}`, and whole
elements can be limited to one skin with `data-skin-only="name"`.
