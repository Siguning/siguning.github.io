/* Racury theme — fuzzy search palette (Ctrl/⌘+K or "/").
 * Index: /search.json (built by Jekyll). Engine: Fuse.js, loaded on first use.
 * Query syntax:  #tag  @category  plus free text (Fuse extended search: 'exact  ^prefix  !not).
 */
(function () {
  "use strict";

  var FUSE_URL = "https://cdn.jsdelivr.net/npm/fuse.js@7.5.0/dist/fuse.min.mjs";
  var root = document.querySelector("[data-search]");
  if (!root) return;

  var input = root.querySelector(".search__input");
  var list = root.querySelector(".search__results");
  var status = root.querySelector(".search__status");
  var docs = null;
  var fuse = null;
  var loading = null;
  var active = 0;
  var lastFocus = null;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function load() {
    if (loading) return loading;
    status.textContent = "INDEX LOADING…";
    loading = Promise.all([
      fetch(window.SITE.search).then(function (r) { return r.json(); }),
      import(FUSE_URL).then(function (m) { return m.default; })
    ]).then(function (res) {
      docs = res[0];
      fuse = new res[1](docs, {
        keys: [
          { name: "title", weight: 0.45 },
          { name: "tags", weight: 0.2 },
          { name: "categoryName", weight: 0.08 },
          { name: "series", weight: 0.07 },
          { name: "content", weight: 0.2 }
        ],
        includeMatches: true,
        includeScore: true,
        ignoreLocation: true,
        useExtendedSearch: true,
        threshold: 0.38,
        minMatchCharLength: 2
      });
      status.textContent = docs.length + " DOCUMENTS INDEXED";
      return fuse;
    }).catch(function (err) {
      loading = null;
      status.textContent = "INDEX OFFLINE — " + err.message;
      throw err;
    });
    return loading;
  }

  function open() {
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.style.overflow = "hidden";
    input.focus();
    input.select();
    load().then(run, function () {});
  }

  function close() {
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function parse(q) {
    var tags = [];
    var cats = [];
    var text = q.replace(/(^|\s)([#@])([^\s#@]+)/g, function (_, sp, sigil, word) {
      (sigil === "#" ? tags : cats).push(word.toLowerCase());
      return " ";
    }).trim();
    return { text: text, tags: tags, cats: cats };
  }

  function passesFilters(d, f) {
    var tags = (d.tags || []).map(function (t) { return String(t).toLowerCase(); });
    var tagOk = f.tags.every(function (t) { return tags.some(function (x) { return x.indexOf(t) === 0; }); });
    var cat = (d.category || "").toLowerCase();
    var catName = (d.categoryName || "").toLowerCase();
    var catOk = f.cats.every(function (c) { return cat.indexOf(c) === 0 || catName.indexOf(c) === 0; });
    return tagOk && catOk;
  }

  // Wrap Fuse match ranges (only ranges ≥ 2 chars, to avoid noisy single letters).
  function markRanges(text, ranges) {
    if (!ranges || !ranges.length) return escapeHtml(text);
    var out = "";
    var last = 0;
    ranges.filter(function (r) { return r[1] - r[0] >= 1; })
      .sort(function (a, b) { return a[0] - b[0]; })
      .forEach(function (r) {
        if (r[0] < last) return;
        out += escapeHtml(text.slice(last, r[0])) + "<mark>" + escapeHtml(text.slice(r[0], r[1] + 1)) + "</mark>";
        last = r[1] + 1;
      });
    return out + escapeHtml(text.slice(last));
  }

  function markTerms(text, terms) {
    var html = escapeHtml(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp("(" + escapeHtml(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      html = html.replace(re, "<mark>$1</mark>");
    });
    return html;
  }

  function snippet(d, text, matches) {
    var content = d.content || "";
    var terms = text.toLowerCase().split(/\s+/).map(function (t) { return t.replace(/^['^!=]|\$$/g, ""); }).filter(Boolean);
    var lower = content.toLowerCase();
    var at = -1;
    terms.some(function (t) { at = lower.indexOf(t); return at >= 0; });
    if (at < 0 && matches) {
      var m = matches.filter(function (x) { return x.key === "content"; })[0];
      if (m) {
        var best = m.indices.reduce(function (a, b) { return b[1] - b[0] > a[1] - a[0] ? b : a; });
        at = best[0];
      }
    }
    if (at < 0) return escapeHtml(content.slice(0, 140));
    var start = Math.max(0, at - 50);
    var piece = (start > 0 ? "…" : "") + content.slice(start, at + 110) + "…";
    return markTerms(piece, terms);
  }

  function render(results, f) {
    active = 0;
    if (!results.length) {
      list.innerHTML = "";
      status.textContent = input.value.trim() ? "NO SIGNAL — 결과 없음" : docs.length + " DOCUMENTS INDEXED";
      return;
    }
    status.textContent = results.length + " MATCH" + (results.length > 1 ? "ES" : "");
    list.innerHTML = results.slice(0, 12).map(function (r, i) {
      var d = r.item;
      var titleMatch = r.matches && r.matches.filter(function (m) { return m.key === "title"; })[0];
      var tags = (d.tags || []).map(function (t) { return "#" + escapeHtml(t); }).join(" ");
      return '<li class="search__item' + (i === 0 ? " is-active" : "") + '" role="option" style="--i:' + i + "; --h:" + d.hue + '">' +
        '<a href="' + escapeHtml(d.url) + '">' +
        '<div class="search__meta"><b>' + escapeHtml(d.categoryName || d.category || "") + "</b><span>" + escapeHtml(d.date) + "</span><span>" + tags + "</span></div>" +
        '<div class="search__title">' + markRanges(d.title, titleMatch && titleMatch.indices) + "</div>" +
        '<p class="search__snippet">' + snippet(d, f.text, r.matches) + "</p>" +
        "</a></li>";
    }).join("");
  }

  function run() {
    if (!fuse) return;
    var f = parse(input.value);
    var results;
    if (f.text) {
      results = fuse.search(f.text).filter(function (r) { return passesFilters(r.item, f); });
    } else if (f.tags.length || f.cats.length) {
      results = docs.filter(function (d) { return passesFilters(d, f); }).map(function (d) { return { item: d }; });
    } else {
      results = [];
    }
    render(results, f);
  }

  function move(delta) {
    var items = list.querySelectorAll(".search__item");
    if (!items.length) return;
    items[active].classList.remove("is-active");
    active = (active + delta + items.length) % items.length;
    items[active].classList.add("is-active");
    items[active].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", run);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") {
      var a = list.querySelector(".search__item.is-active a");
      if (a) { e.preventDefault(); window.location.href = a.href; }
    }
  });
  root.querySelectorAll("[data-search-close]").forEach(function (el) { el.addEventListener("click", close); });
  document.querySelectorAll("[data-search-open]").forEach(function (el) {
    el.addEventListener("click", open);
    el.addEventListener("mouseenter", function () { load().catch(function () {}); }, { once: true });
  });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (root.hidden) open(); else close();
    } else if (e.key === "/" && !typing && root.hidden) {
      e.preventDefault();
      open();
    } else if (e.key === "Escape" && !root.hidden) {
      close();
    }
  });

  // Show ⌘ on Apple devices.
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    document.querySelectorAll(".search-trigger__kbd").forEach(function (k) { k.textContent = "⌘ K"; });
  }
})();
