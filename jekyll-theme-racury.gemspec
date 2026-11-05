# frozen_string_literal: true

# Racury as a reusable Jekyll theme gem (layouts, includes, Sass, assets and the
# plugin in lib/). Install from this repository with Bundler; see README.md.
Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-racury"
  spec.version       = "1.0.0"
  spec.authors       = ["Siguning"]
  spec.summary       = "Jekyll blog theme with three swappable skins: sci-fi HUD, Valve-style amber, Backrooms retro."
  spec.homepage      = "https://github.com/Siguning/siguning.github.io"
  spec.required_ruby_version = ">= 3.0"

  spec.files = Dir.glob("{_layouts,_includes,_sass,lib}/**/*") +
               Dir.glob("assets/{css/main.scss,js/*.js,data/*.json,img/*}") +
               %w[README.md]

  spec.add_runtime_dependency "jekyll", ">= 4.3", "< 5.0"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.18"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.9"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "kramdown-parser-gfm", "~> 1.1"
end
