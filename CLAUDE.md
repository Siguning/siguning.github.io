# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Racury Works" — a Korean-language tech blog (mainly game dev: Godot/GDScript, Unreal, C/C++, etc.) published to GitHub Pages at siguning.github.io. It is a Jekyll site with no tests or linters; content is Markdown posts.

## Commands

```
bundle install                 # install gems (Gemfile.lock is gitignored)
bundle exec jekyll serve       # local dev server at http://localhost:4000
bundle exec jekyll build       # build to _site/
```

- `_config.yml` is NOT hot-reloaded by `jekyll serve`; restart after editing it.
- Deploy: pushing to `main` triggers `.github/workflows/jekyll.yml` (Ruby 3.1, `JEKYLL_ENV=production`, then GitHub Pages deploy). No manual deploy step.

## Architecture

- **Theme is remote**: `remote_theme: sharadcodes/jekyll-theme-serial-programmer` (via `jekyll-remote-theme`). Layouts (`blog`, `post`), most CSS/JS (`assets/css/blog.css`, `post.css`, `common.css`, `syntax.css`, `assets/js/categories.js`, `copy-code.js`, `lbox.js`) and other includes live in the theme, not in this repo. To change them, override by creating a same-named file locally (e.g. `_layouts/post.html`, `assets/css/...`).
- **Local overrides/additions**:
  - `_includes/head.html` overrides the theme's head: picks CSS/JS by `page.layout == "post"`, applies saved `localStorage` theme (`data-theme`), configures MathJax (`$...$` inline, `$$...$$` display), loads Pretendard font (CDN + `assets/css/pretendard.css` for the font stack).
  - `index.markdown` (layout `blog`) is the home page listing posts; `about.markdown`, `404.html` are standalone pages.
- **Gemfile quirk**: includes `github-pages` and `minima` although the site actually uses the remote theme; `_config.yml` has `minima` commented out.
- `_config.yml` has empty `url` and `baseurl`; CI passes `--baseurl` from the Pages action.

## Writing posts

Files go in `_posts/` named `YYYY-MM-DD-slug.markdown`, with front matter:

```
---
layout: post
title:  "제목"
date:   2025-10-17 16:00:00 +0900
categories: godot
---
```

`categories` drives the theme's category filtering (`categories.js`); existing values: `godot`, `cs`, `lang`, `game-design`, `dessert`. Check existing posts for category names before inventing new ones. Posts are written in Korean.
