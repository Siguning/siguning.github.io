source "https://rubygems.org"

# The site is built by GitHub Actions (.github/workflows/jekyll.yml), not by the
# legacy github-pages gem, so any Jekyll version and custom _plugins can be used.
gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.18"
  gem "jekyll-seo-tag", "~> 2.9"
  gem "jekyll-sitemap", "~> 1.4"
end

gem "kramdown-parser-gfm", "~> 1.1"
# Needed by `jekyll serve` on Ruby 3+.
gem "webrick", "~> 1.9"

# Windows and JRuby do not include zoneinfo files.
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.2", platforms: [:windows]
