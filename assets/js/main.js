/* Racury theme — UI behaviour (no build step, no dependencies). */
(function () {
  "use strict";

  var doc = document.documentElement;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CDN = {
    mathjax: "https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-mml-chtml.js",
    mermaid: "https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.min.js",
    giscus: "https://giscus.app/client.js"
  };

  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function icon(name) {
    return '<svg class="icon"><use href="#i-' + name + '"/></svg>';
  }

  // ───── Theme ─────
  function currentTheme() { return doc.getAttribute("data-theme") || "dark"; }
  function setTheme(theme) {
    doc.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }
  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      // Circular wipe from the button when the View Transitions API is available.
      if (document.startViewTransition && !reduceMotion) {
        var r = btn.getBoundingClientRect();
        doc.style.setProperty("--vt-x", r.left + r.width / 2 + "px");
        doc.style.setProperty("--vt-y", r.top + r.height / 2 + "px");
        document.startViewTransition(function () { setTheme(next); });
      } else {
        setTheme(next);
      }
    });
  });
  // Follow the OS setting until the user picks one explicitly.
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) {
      doc.setAttribute("data-theme", e.matches ? "light" : "dark");
      document.dispatchEvent(new CustomEvent("themechange", { detail: currentTheme() }));
    }
  });

  // ───── Mobile nav ─────
  var navToggle = $("[data-nav-toggle]");
  var nav = $("#site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ───── Header hide-on-scroll, progress bar, back-to-top ─────
  var header = $("[data-header]");
  var progress = $("[data-progress]");
  var toTop = $("[data-to-top]");
  var prose = $("[data-prose]");
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-hidden", y > lastY && y > 240 && !(nav && nav.classList.contains("is-open")));
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    if (progress) {
      var p = 0;
      if (prose) {
        var rect = prose.getBoundingClientRect();
        var total = rect.height - window.innerHeight * 0.6;
        p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      } else {
        var max = doc.scrollHeight - window.innerHeight;
        p = max > 0 ? y / max : 0;
      }
      progress.style.setProperty("--progress", p.toFixed(4));
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  // ───── Scroll reveal with stagger ─────
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--delay", Math.min(i++ * 0.06, 0.4) + "s");
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ───── Hero: count-up stats, typewriter, glitch ─────
  $$("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion || target === 0) return;
    var start = null;
    el.textContent = "0";
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 300);
  });

  $$("[data-typewriter]").forEach(function (el) {
    if (reduceMotion) return;
    var text = el.textContent.trim();
    el.textContent = "";
    el.classList.add("typewriter-caret");
    var i = 0;
    (function type() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 18 + Math.random() * 30);
      else setTimeout(function () { el.classList.remove("typewriter-caret"); }, 2400);
    })();
  });

  $$(".glitch").forEach(function (el) {
    if (reduceMotion) return;
    setTimeout(function () {
      el.classList.add("is-glitching");
      setTimeout(function () { el.classList.remove("is-glitching"); }, 600);
    }, 500);
  });

  // ───── Markdown enhancements ─────
  function slugify(text) {
    return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s+/g, "-");
  }

  function enhanceCodeBlocks(root) {
    $$("div.highlighter-rouge, figure.highlight", root).forEach(function (block) {
      if (block.closest(".code-block") || block.parentElement.closest("div.highlighter-rouge")) return;
      if (/language-mermaid/.test(block.className)) return;
      var m = (block.className.match(/language-([\w+#-]+)/) || [])[1];
      var lang = m && m !== "plaintext" ? m : "text";
      block.classList.add("code-block");
      var bar = document.createElement("div");
      bar.className = "code-block__bar";
      bar.innerHTML = '<span class="code-block__lang">' + lang + "</span>" +
        '<button class="code-block__copy" type="button" aria-label="Copy code">' + icon("copy") + "<span>Copy</span></button>";
      block.insertBefore(bar, block.firstChild);
      var btn = bar.querySelector("button");
      btn.addEventListener("click", function () {
        var code = block.querySelector("pre code") || block.querySelector("pre");
        var text = code ? code.innerText.replace(/\n$/, "") : "";
        var done = function () {
          btn.classList.add("is-copied");
          btn.innerHTML = icon("check") + "<span>Copied</span>";
          setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.innerHTML = icon("copy") + "<span>Copy</span>";
          }, 1600);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      });
    });
  }

  function enhanceTables(root) {
    $$("table", root).forEach(function (table) {
      if (table.parentElement.classList.contains("table-wrap")) return;
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function enhanceHeadings(root) {
    $$("h1, h2, h3, h4", root).forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent) || "section";
      var a = document.createElement("a");
      a.className = "heading-anchor";
      a.href = "#" + encodeURIComponent(h.id);
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";
      h.appendChild(a);
    });
  }

  // GitHub / Obsidian style callouts:  > [!TIP] Optional title   (append + or - to make it foldable)
  function enhanceCallouts(root) {
    $$("blockquote", root).forEach(function (bq) {
      var first = bq.firstElementChild;
      if (!first || first.tagName !== "P") return;
      var m = first.innerHTML.match(/^\s*\[!([A-Za-z]+)\]([+-]?)[ \t]*([^\n<]*)(?:\n|<br\s*\/?>)?/);
      if (!m) return;
      var type = m[1].toLowerCase();
      var fold = m[2];
      var title = m[3].trim() || type.charAt(0).toUpperCase() + type.slice(1);
      var box = document.createElement(fold ? "details" : "div");
      box.className = "callout callout--" + type;
      if (fold === "+") box.open = true;
      var head = document.createElement(fold ? "summary" : "p");
      head.className = "callout__title";
      head.textContent = title;
      box.appendChild(head);
      first.innerHTML = first.innerHTML.slice(m[0].length);
      if (!first.textContent.trim() && !first.querySelector("img")) first.remove();
      while (bq.firstChild) box.appendChild(bq.firstChild);
      bq.replaceWith(box);
    });
  }

  function enhanceLinks(root) {
    $$("a[href^='http']", root).forEach(function (a) {
      if (a.hostname !== location.hostname) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }

  // ───── Lightbox ─────
  var lightbox = $("[data-lightbox]");
  function openLightbox(img) {
    if (!lightbox) return;
    var big = lightbox.querySelector("img");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    lightbox.querySelector(".lightbox__caption").textContent = img.alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  if (lightbox) lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  // ───── Table of contents + scroll spy ─────
  function buildToc(root) {
    var heads = $$("h1, h2, h3", root).filter(function (h) { return h.id; });
    var panel = $("[data-toc-panel]");
    var mobile = $("[data-toc-mobile]");
    if (heads.length < 2 || root.hasAttribute("data-no-toc")) return;
    var top = Math.min.apply(null, heads.map(function (h) { return +h.tagName[1]; }));
    var html = "<ul>";
    var depth = top;
    heads.forEach(function (h, i) {
      var level = +h.tagName[1];
      while (depth < level) { html += "<ul>"; depth++; }
      while (depth > level) { html += "</ul>"; depth--; }
      var label = h.cloneNode(true);
      $$(".heading-anchor", label).forEach(function (a) { a.remove(); });
      html += '<li><a href="#' + encodeURIComponent(h.id) + '" data-toc-id="' + i + '">' +
        label.textContent.replace(/</g, "&lt;") + "</a></li>";
    });
    while (depth-- > top) html += "</ul>";
    html += "</ul>";

    var desktop = $("[data-toc]");
    if (desktop && panel) { desktop.innerHTML = html; panel.hidden = false; }
    var mobileTarget = $("[data-toc-target]");
    if (mobile && mobileTarget) { mobileTarget.innerHTML = '<div class="toc">' + html + "</div>"; mobile.hidden = false; }

    var links = $$("[data-toc-id]");
    var active = -1;
    function spy() {
      var y = (header ? header.offsetHeight : 0) + 40;
      var idx = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top - y <= 0) idx = i; else break;
      }
      if (idx === active) return;
      active = idx;
      links.forEach(function (a) {
        var on = +a.getAttribute("data-toc-id") === idx;
        a.classList.toggle("is-active", on);
        if (on && desktop && desktop.contains(a)) {
          var box = desktop.getBoundingClientRect();
          var r = a.getBoundingClientRect();
          if (r.top < box.top || r.bottom > box.bottom) desktop.scrollTop += r.top - box.top - box.height / 2;
        }
      });
    }
    window.addEventListener("scroll", function () { requestAnimationFrame(spy); }, { passive: true });
    spy();
  }

  // ───── Lazy-loaded renderers ─────
  function renderMath(root) {
    var candidates = $$(".kdmath, p, li, td, th, blockquote, h1, h2, h3, h4, .callout, dd", root);
    var hasMath = candidates.some(function (el) { return /\$\$[\s\S]+?\$\$|\$[^$\s][^$]*?\$|\\\(|\\\[/.test(el.textContent); });
    if (!hasMath && !root.hasAttribute("data-math")) return;
    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEscapes: true
      },
      options: { ignoreHtmlClass: "code-block|highlighter-rouge" }
    };
    loadScript(CDN.mathjax).catch(function () {});
  }

  function mermaidConfig() {
    var dark = currentTheme() === "dark";
    return {
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: "Pretendard, sans-serif",
      themeVariables: dark ? {
        darkMode: true, background: "transparent", primaryColor: "#0d2035", primaryBorderColor: "#3fb4ff",
        primaryTextColor: "#d7e5f6", lineColor: "#3fb4ff", secondaryColor: "#0a2a3f", tertiaryColor: "#08101c",
        noteBkgColor: "#10243a", noteTextColor: "#d7e5f6", noteBorderColor: "#7ddcff",
        edgeLabelBackground: "#0a1422"
      } : {
        background: "transparent", primaryColor: "#e6f1ff", primaryBorderColor: "#0a6fe0", edgeLabelBackground: "#ffffff",
        primaryTextColor: "#0c1a2c", lineColor: "#0a6fe0", secondaryColor: "#dff5ff", tertiaryColor: "#f4f8fd"
      }
    };
  }

  function renderMermaid(root) {
    // Rouge has no mermaid lexer, so it emits either div.language-mermaid or a bare pre > code.language-mermaid.
    var blocks = $$(".language-mermaid", root).map(function (el) {
      return el.tagName === "CODE" && el.parentElement.tagName === "PRE" ? el.parentElement : el;
    }).filter(function (el) { return !el.parentElement.closest(".language-mermaid"); });
    if (!blocks.length) return;
    var sources = blocks.map(function (block) {
      var code = block.querySelector("code") || block;
      var holder = document.createElement("div");
      holder.className = "mermaid";
      holder.setAttribute("data-source", code.textContent);
      holder.textContent = code.textContent;
      block.replaceWith(holder);
      return holder;
    });
    function draw() {
      window.mermaid.initialize(mermaidConfig());
      sources.forEach(function (el) {
        el.removeAttribute("data-processed");
        el.textContent = el.getAttribute("data-source");
      });
      window.mermaid.run({ nodes: sources }).catch(function () {});
    }
    loadScript(CDN.mermaid).then(function () {
      draw();
      document.addEventListener("themechange", draw);
    }).catch(function () {});
  }

  // ───── Comments (giscus) ─────
  function giscusTheme() { return currentTheme() === "dark" ? "transparent_dark" : "light"; }
  function loadGiscus() {
    var el = $("[data-giscus]");
    if (!el) return;
    var load = function () {
      loadScript(CDN.giscus, {
        "data-repo": el.dataset.repo,
        "data-repo-id": el.dataset.repoId,
        "data-category": el.dataset.category,
        "data-category-id": el.dataset.categoryId,
        "data-mapping": el.dataset.mapping,
        "data-reactions-enabled": "1",
        "data-emit-metadata": "0",
        "data-input-position": "top",
        "data-theme": giscusTheme(),
        "data-lang": el.dataset.lang,
        "data-loading": "lazy",
        crossorigin: "anonymous"
      });
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); load(); }
      }, { rootMargin: "400px" });
      io.observe(el);
    } else {
      load();
    }
    document.addEventListener("themechange", function () {
      var frame = document.querySelector("iframe.giscus-frame");
      if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, "https://giscus.app");
    });
  }

  $$(".prose").forEach(function (root) {
    enhanceCallouts(root);
    enhanceCodeBlocks(root);
    enhanceTables(root);
    enhanceLinks(root);
    $$("img", root).forEach(function (img) {
      if (img.closest("a")) return;
      img.loading = "lazy";
      img.addEventListener("click", function () { openLightbox(img); });
    });
  });
  if (prose) {
    enhanceHeadings(prose);
    buildToc(prose);
    renderMermaid(prose);
    renderMath(prose);
  }
  loadGiscus();
})();
