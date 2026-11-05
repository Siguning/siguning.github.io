# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Racury Works" — a Korean-language game-dev tech blog (lectures, devlogs, game design) on GitHub Pages at siguning.github.io. Jekyll 4 site with a **custom in-repo theme** ("Racury") that has three runtime-switchable **skins**: `hud` (Star Citizen–style sci-fi HUD, blue; the default and the base CSS), `valve` (Valve/Source-style industrial amber) and `backrooms` (liminal yellow + 90s retro web). The repo doubles as the `jekyll-theme-racury` gem (`jekyll-theme-racury.gemspec`, usage in `README.md`) so other sites can install it from git. No tests or linters.

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

- **`lib/jekyll-theme-racury.rb`** (loaded here via the one-line `_plugins/racury.rb`; gem users list it under `plugins:`) is the core of the linking system:
  - Rewrites Obsidian wiki-links in post *source* — `[[title|slug|basename|alias]]`, `[[x|label]]`, `[[x#Heading]]` — into `<a class="wikilink">`, skipping fenced/inline code and `{% raw %}` blocks. Unresolved → `span.wikilink--missing`. Heading anchors use the same id algorithm as kramdown-parser-gfm (Korean-safe).
  - Also counts `{% post_url %}` and markdown links to `/…` post URLs as edges.
  - Sets per-post `backlinks`, `outlinks`, `related` (scored by shared tags/links/series/category), `series_posts`, `series_index`.
  - Sets `site.data.graph` (nodes: posts + `category:x` + `tag:x`; links typed `link|category|tag`) → rendered to `/assets/data/graph.json`; and `site.data.series`.
  - Liquid filter `hue`: category name → hue (190–235, blue range), overridable via `hue:` in `_data/categories.yml`. All category colors flow from CSS `--h` set inline (`style="--h: {{ cat | hue }}"`), from which `--cat`, `--cat-soft`, `--cat-line` derive (see `_sass/_tokens.scss`); each skin rotates them with `--hue-shift`. Never hard-code `hsl(var(--h) …)` — use `var(--cat)`.
  - `PageGenerator` creates `/archive/ /categories/ /tags/ /series/ /graph/ /404.html` from the same-named layouts when the site has no page at that URL (this repo has thin stub pages for its Korean titles). A `:post_read` hook normalises `racury:` config (`skin`, `skin_switcher`, `skins`, `generate_pages`) → `site.racury.*`.
- **Layouts**: `default` → `home` (index), `post`, `page` → `archive`/`categories`/`tags`/`series`/`graph`; `404`. Root `archive.html` etc. are front-matter-only stubs. Layout front-matter flags (`plain`, `wide`, `graph`, `filters`) are read as `page.x or layout.x`. Search index: `assets/data/search.json`.
- **Skins**: `html[data-skin]` is set by the inline script in `head.html` (localStorage `skin` if allowed → `racury.skin`), alongside `data-theme` (light/dark). Picker: `_includes/skin-switcher.html` + main.js. Each skin has `_sass/skins/_x.scss` (look) and `_x-layout.scss` (structure: valve = fixed left menu rail ≥961px, title-screen hero, chapter-tile grid using `post.number` from the plugin, chapter title-card posts; backrooms = body is a CSS grid and the header is flattened with `display: contents` into banner / left windows / page window, plus `_includes/retro-side.html`). Markup is shared by all skins, so structure changes must be CSS (plus small `data-skin-only` elements). Skin partials override tokens/rules under `:root[data-skin="…"]` (light mode needs `[data-theme="light"]` for specificity). Decorations are tokens (`--kicker`, `--h2-mark`, `--h3-mark`, `--hr-mark`, `--code-mark`, `--cut`, `--btn-cut`, `--glitch-a/b`). Per-skin wording: `{% include skin-text.html hud=… valve=… backrooms=… %}`; per-skin elements: `data-skin-only="x"` (`_sass/_skins.scss`). Section labels use class `kicker` instead of a literal `// `. Adding a skin: see README "Writing your own skin".
- **`_data/categories.yml`**: display name / description per category slug (unknown slugs fall back to the raw slug). Note Liquid can't do nested lookups like `site.data.categories[cat[0]]` — assign the key to a variable first.
- **CSS**: `assets/css/main.scss` `@use`s partials in `_sass/` (tokens, base, layout, components, prose, syntax, pages). Theme via `html[data-theme=dark|light]` set by an inline script in `_includes/head.html` (localStorage → OS preference). `.hud` = translucent chamfered panel with corner brackets; `.reveal` = scroll-in animation (needs `html.js`). Respect `prefers-reduced-motion`.
- **JS** (vanilla, no build): `assets/js/main.js` (theme toggle w/ View Transition, header/progress/to-top, reveal, code-block copy bar, callouts `> [!NOTE]`, heading anchors, TOC + scrollspy, lightbox, lazy MathJax/Mermaid, giscus), `search.js` (Fuse.js fuzzy search modal, Ctrl/⌘K or `/`, `#tag` `@category` filters), `graph.js` (d3-force graph; `data-graph="full"` page and `"local"` post sidebar), `filters.js` (home category chips, `/tags/` multi-tag AND/OR, state in URL hash). `head.html` loads `graph.js`/d3 only for posts or pages with `graph: true`, and `filters.js` only with `filters: true`.
- External libs come from jsdelivr npm URLs with pinned versions (d3, fuse.js ESM, mathjax, mermaid, galmuri font); versions are constants in the JS / `head.html`. Mermaid colors are read from the active skin's CSS tokens, so keep `--panel-solid`, `--bg`, `--bg-2`, `--accent*`, `--text` solid colors.
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
