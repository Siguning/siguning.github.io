/* Racury theme — category filter (home) and multi-tag filter (/tags/). State lives in the URL hash. */
(function () {
  "use strict";

  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ───── Home: category chips ─────
  $$("[data-post-filter]").forEach(function (section) {
    var chips = $$("[data-filter-cat]", section);
    var cards = $$("[data-filter-list] > [data-category]", section);
    var empty = section.querySelector("[data-filter-empty]");

    function apply(cat, animate) {
      chips.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-filter-cat") === cat); });
      var shown = 0;
      cards.forEach(function (card, i) {
        var on = !cat || card.getAttribute("data-category") === cat;
        card.classList.toggle("is-filtered-out", !on);
        if (on && animate) {
          card.classList.remove("is-visible");
          card.style.setProperty("--delay", Math.min(shown * 0.04, 0.3) + "s");
          requestAnimationFrame(function () { requestAnimationFrame(function () { card.classList.add("is-visible"); }); });
        }
        if (on) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-filter-cat");
        history.replaceState(null, "", cat ? "#cat=" + encodeURIComponent(cat) : location.pathname + location.search);
        apply(cat, true);
      });
    });
    var m = location.hash.match(/^#cat=(.+)$/);
    if (m) apply(decodeURIComponent(m[1]), false);
  });

  // ───── Tags page ─────
  var tf = document.querySelector("[data-tag-filter]");
  if (!tf) return;

  var buttons = $$("[data-tag]", tf);
  var rows = $$("[data-tag-results] > li", tf);
  var statusEl = tf.querySelector("[data-tag-status]");
  var find = tf.querySelector("[data-tag-find]");
  var modeButtons = $$("[data-mode]", tf);
  var selected = [];
  var mode = "or";

  function readHash() {
    var raw = decodeURIComponent(location.hash.replace(/^#/, ""));
    var m = raw.match(/^(and|or):(.*)$/);
    if (m) { mode = m[1]; raw = m[2]; }
    selected = raw ? raw.split(",").filter(Boolean) : [];
  }

  function writeHash() {
    var value = selected.length ? (mode === "and" ? "and:" : "") + selected.join(",") : "";
    history.replaceState(null, "", value ? "#" + encodeURIComponent(value).replace(/%2C/g, ",").replace(/%3A/g, ":") : location.pathname);
  }

  function apply() {
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(selected.indexOf(b.getAttribute("data-tag")) >= 0)); });
    modeButtons.forEach(function (b) {
      var on = b.getAttribute("data-mode") === mode;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", String(on));
    });
    var count = 0;
    rows.forEach(function (row) {
      var tags = (row.getAttribute("data-tags") || "").split("|").filter(Boolean);
      var on = !selected.length || (mode === "and"
        ? selected.every(function (t) { return tags.indexOf(t) >= 0; })
        : selected.some(function (t) { return tags.indexOf(t) >= 0; }));
      row.hidden = !on;
      if (on) count++;
    });
    statusEl.textContent = selected.length
      ? "// " + count + " MATCH · " + mode.toUpperCase() + " · " + selected.map(function (t) { return "#" + t; }).join(" ")
      : "// ALL " + rows.length + " POSTS";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-tag");
      var i = selected.indexOf(t);
      if (i >= 0) selected.splice(i, 1); else selected.push(t);
      writeHash();
      apply();
    });
  });
  modeButtons.forEach(function (b) {
    b.addEventListener("click", function () { mode = b.getAttribute("data-mode"); writeHash(); apply(); });
  });
  var clear = tf.querySelector("[data-tag-clear]");
  if (clear) clear.addEventListener("click", function () { selected = []; writeHash(); apply(); });
  if (find) {
    find.addEventListener("input", function () {
      var q = find.value.trim().toLowerCase();
      buttons.forEach(function (b) { b.hidden = q && b.getAttribute("data-tag").toLowerCase().indexOf(q) < 0; });
    });
  }
  window.addEventListener("hashchange", function () { readHash(); apply(); });

  readHash();
  apply();
})();
