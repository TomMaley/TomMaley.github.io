/* =====================================================================
   Builds the portfolio from projects.js.
   You shouldn't need to edit this file: change projects.js instead.
   ===================================================================== */
(function () {
  "use strict";

  /* Edit mode shows missing files. It's on when you add ?edit to the
     address, or open index.html straight from your computer. */
  var params = new URLSearchParams(location.search);
  var EDIT_MODE =
    params.has("edit") ||
    location.protocol === "file:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

  var timelineEl = document.getElementById("timeline");
  var filtersEl = document.getElementById("filters");
  var statusEl = document.getElementById("filter-status");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var site = typeof SITE !== "undefined" ? SITE : {};
  var years = typeof YEARS !== "undefined" ? YEARS : {};

  renderLinks();
  setupNavHighlight();

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    timelineEl.innerHTML =
      '<div class="load-error"><strong>Projects didn\'t load.</strong> ' +
      "There is a typo in <code>projects.js</code>, usually a missing comma after a project's " +
      "closing <code>}</code>, or a quote or bracket that isn't closed. Press F12, open the Console " +
      "tab, and it will show the line number.</div>";
    filtersEl.hidden = true;
    return;
  }

  /* ---------- Prepare the data ---------- */

  var projects = PROJECTS.filter(Boolean).map(function (p, i) {
    var copy = Object.assign({}, p);
    copy._order = i;
    copy.year = Number(p.year) || 0;
    copy.tools = Array.isArray(p.tools) ? p.tools.filter(Boolean) : [];
    copy.media = (Array.isArray(p.media) ? p.media : []).map(normaliseMedia).filter(Boolean);
    copy.slug = slugify(p.title || "project-" + (i + 1));
    return copy;
  });

  // Chronological numbering: Year 1 first, then the order written in projects.js
  projects
    .slice()
    .sort(function (a, b) { return a.year - b.year || a._order - b._order; })
    .forEach(function (p, i) { p._number = i + 1; });

  var total = projects.length;
  var activeTool = null;
  var missingFiles = [];

  buildFilters();
  renderTimeline();
  updateEditBanner();
  setupLightbox();

  /* ---------- Helpers ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    if (children !== undefined && children !== null) {
      (Array.isArray(children) ? children : [children]).forEach(function (child) {
        if (child === null || child === undefined || child === false) return;
        node.append(child instanceof Node ? child : document.createTextNode(String(child)));
      });
    }
    return node;
  }

  function icon(name) {
    var paths = {
      mail: '<rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      doc: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      zoom: '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>'
    };
    var span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.style.display = "inline-flex";
    span.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18">' + (paths[name] || "") + "</svg>";
    return span;
  }

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function normaliseMedia(m) {
    if (!m) return null;
    if (typeof m === "string") m = { src: m };
    var item = Object.assign({}, m);
    var src = String(item.src || item.youtube || "").trim();
    var yt = src.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (item.type === "youtube" || yt) {
      item.type = "youtube";
      item.id = item.id || (yt ? yt[1] : src);
    } else if (!item.type) {
      if (/\.(glb|gltf)(\?|#|$)/i.test(src)) item.type = "model";
      else if (/\.(mp4|webm|m4v|mov|ogv)(\?|#|$)/i.test(src)) item.type = "video";
      else item.type = "image";
    }
    item.src = src;
    item.missing = false;
    return item;
  }

  function yearLabel(y) {
    var info = years[y] || {};
    return info.label || (y ? "Year " + y : "Other projects");
  }

  /* ---------- Contact links (from SITE in projects.js) ---------- */

  function renderLinks() {
    var heroLinks = document.getElementById("hero-links");
    var contactLinks = document.getElementById("contact-links");

    var items = [];
    if (site.email) items.push({ label: "Email me", href: "mailto:" + site.email, icon: "mail", key: "email" });
    if (site.linkedin) items.push({ label: "LinkedIn", href: site.linkedin, icon: "link", external: true, key: "linkedin" });
    if (site.github) items.push({ label: "GitHub", href: site.github, icon: "link", external: true, key: "github" });
    if (site.cv) items.push({ label: "Download CV", href: site.cv, icon: "doc", download: true, key: "cv" });

    function button(item, cls) {
      return el("a", {
        class: "btn " + cls,
        href: item.href,
        target: item.external ? "_blank" : null,
        rel: item.external ? "noopener" : null,
        download: item.download ? "" : null
      }, [icon(item.icon), item.label]);
    }

    if (heroLinks) {
      items.filter(function (i) { return i.key === "cv" || i.key === "linkedin"; })
        .forEach(function (i) { heroLinks.append(button(i, "btn-ghost")); });
    }
    if (contactLinks) {
      items.forEach(function (i, idx) {
        contactLinks.append(button(i, idx === 0 ? "btn-primary" : "btn-ghost"));
      });
    }
  }

  /* ---------- Software filter ---------- */

  function buildFilters() {
    var counts = {};
    projects.forEach(function (p) {
      p.tools.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    var tools = Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    });

    filtersEl.innerHTML = "";
    if (!tools.length) { filtersEl.hidden = true; return; }
    filtersEl.hidden = false;

    filtersEl.append(chip("All projects", total, null));
    tools.forEach(function (t) { filtersEl.append(chip(t, counts[t], t)); });
  }

  function chip(label, count, value) {
    var pressed = activeTool === value;
    var b = el("button", { class: "chip", type: "button", "aria-pressed": String(pressed) },
      [label, el("span", { class: "count" }, String(count))]);
    b.addEventListener("click", function () { setFilter(value); });
    return b;
  }

  function setFilter(tool, scroll) {
    activeTool = tool;
    buildFilters();
    renderTimeline();
    if (scroll) {
      var target = document.getElementById("projects");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderStatus(count) {
    statusEl.innerHTML = "";
    if (!activeTool) return;
    statusEl.append(
      "Showing " + count + " project" + (count === 1 ? "" : "s") + " using " + activeTool + "."
    );
    var clear = el("button", { type: "button" }, "Show all projects");
    clear.addEventListener("click", function () { setFilter(null); });
    statusEl.append(clear);
  }

  /* ---------- Timeline ---------- */

  function renderTimeline() {
    var dir = site.newestFirst ? -1 : 1;
    var list = projects
      .filter(function (p) { return !activeTool || p.tools.indexOf(activeTool) !== -1; })
      .sort(function (a, b) { return (a.year - b.year) * dir || (a._order - b._order) * dir; });

    timelineEl.innerHTML = "";
    renderStatus(list.length);

    if (!list.length) {
      timelineEl.append(el("div", { class: "empty-state" },
        total ? "No projects use that software yet." : "Add your first project in projects.js and it will appear here."));
      return;
    }

    var groups = [];
    list.forEach(function (p) {
      var last = groups[groups.length - 1];
      if (!last || last.year !== p.year) groups.push({ year: p.year, items: [p] });
      else last.items.push(p);
    });

    groups.forEach(function (g) {
      var info = years[g.year] || {};
      var n = g.items.length;
      var rail = el("div", { class: "year-rail" }, el("div", { class: "year-rail-inner" }, [
        el("h3", null, yearLabel(g.year)),
        info.dates ? el("span", { class: "dates" }, info.dates) : null,
        el("span", { class: "ycount" }, n + " project" + (n === 1 ? "" : "s"))
      ]));
      var column = el("div", { class: "year-projects" });
      g.items.forEach(function (p) { column.append(buildProject(p)); });
      timelineEl.append(el("section", { class: "year-group", "aria-label": yearLabel(g.year) }, [rail, column]));
    });
  }

  function buildProject(p) {
    var wrap = el("div", { class: "project", id: p.slug });
    var sheet = el("article", { class: "sheet" });

    // Title row, with optional society/club badge and status tag
    var logo = null;
    if (p.logo) {
      logo = el("img", { class: "org-logo", src: p.logo, alt: "", loading: "lazy" });
      logo.addEventListener("error", function () { logo.remove(); });
    }
    sheet.append(el("header", { class: "sheet-head" }, [
      logo,
      el("h4", null, p.title || "Untitled project"),
      p.status ? el("span", { class: "ongoing" }, p.status) : null
    ]));

    // Pictures and video across the full width
    if (p.media.length) sheet.append(buildGallery(p));

    // Words on the left, key facts on the right
    var main = el("div", { class: "sheet-main" });
    var facts = el("div", { class: "sheet-facts" });

    // Description: blank lines start a new paragraph
    var desc = el("div", { class: "sheet-desc" });
    String(p.description || "").split(/\n\s*\n/).forEach(function (para) {
      if (!para.trim()) return;
      var node = document.createElement("p");
      node.innerHTML = para.trim().replace(/\s+/g, " ");
      desc.append(node);
    });
    if (desc.childNodes.length) main.append(desc);

    if (Array.isArray(p.highlights) && p.highlights.length) {
      main.append(el("ul", { class: "highlights" }, p.highlights.map(function (h) {
        var li = document.createElement("li");
        li.innerHTML = h;
        return li;
      })));
    }

    if (Array.isArray(p.links) && p.links.length) {
      main.append(el("div", { class: "sheet-links" }, p.links.map(function (l) {
        var external = /^https?:/i.test(l.url || "");
        return el("a", { href: l.url, target: external ? "_blank" : null, rel: external ? "noopener" : null },
          l.label || l.url);
      })));
    }

    if (Array.isArray(p.stats) && p.stats.length) {
      facts.append(el("div", { class: "stats" }, p.stats.map(function (s) {
        return el("div", { class: "stat" }, [
          el("span", { class: "stat-value" }, s.value),
          el("span", { class: "stat-label" }, s.label)
        ]);
      })));
    }

    // Title block, like the corner of an engineering drawing
    var cells = [
      cell("Year", yearLabel(p.year)),
      p.date ? cell("Date", p.date) : null,
      cell("Project", p._number + " of " + total),
      p.type ? el("div", { class: "tb-cell tb-wide" }, [el("dt", null, "Type"), el("dd", null, p.type)]) : null
    ];
    if (p.tools.length) {
      var tags = el("dd", { class: "tb-tags" });
      p.tools.forEach(function (t) {
        var b = el("button", { class: "tool", type: "button", title: "Show every project using " + t }, t);
        b.addEventListener("click", function () { setFilter(t, true); });
        tags.append(b);
      });
      cells.push(el("div", { class: "tb-cell tb-wide" }, [el("dt", null, "Software"), tags]));
    }
    facts.append(el("dl", { class: "title-block" }, cells));

    sheet.append(el("div", { class: "sheet-body" }, [main, facts]));
    wrap.append(sheet);
    return wrap;
  }

  function cell(label, value) {
    return el("div", { class: "tb-cell" }, [el("dt", null, label), el("dd", null, value)]);
  }

  /* ---------- Gallery ----------
     Pictures are laid out in rows. Every picture keeps its own shape and
     each row is scaled to fill the width exactly, so nothing is cropped
     and there are no empty bands. */

  var GAP = 6;

  function buildGallery(p) {
    var g = el("div", { class: "gallery" });
    p._gallery = g;
    var pending = p.media.length;
    var laidOut = false;
    function finish() {
      if (laidOut) return;
      laidOut = true;
      layoutGallery(p, true);
    }
    p.media.forEach(function (m) {
      measure(p, m, function () {
        pending--;
        if (pending <= 0) finish();
      });
    });
    setTimeout(finish, 5000); // don't wait forever for a slow file

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { layoutGallery(p, false); }).observe(g);
    }
    return g;
  }

  // Work out each item's width-to-height ratio (and spot missing files)
  function measure(p, m, done) {
    if (m.ratio || m.missing) return done();
    var finished = false;
    function ok(ratio) {
      if (finished) return;
      finished = true;
      m.ratio = ratio && isFinite(ratio) ? ratio : 4 / 3;
      done();
    }
    function fail() {
      if (finished) return;
      finished = true;
      m.ratio = 4 / 3;
      noteMissing(p, m);
      done();
    }

    if (m.type === "image" || ((m.type === "video" || m.type === "model") && m.poster)) {
      var im = new Image();
      im.onload = function () { ok(im.naturalWidth / im.naturalHeight); };
      im.onerror = m.type === "image" ? fail : function () { ok(m.type === "video" ? 16 / 9 : 4 / 3); };
      im.src = m.type === "image" ? m.src : m.poster;
      if (m.type !== "image") checkExists(p, m);
    } else if (m.type === "video") {
      var v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.addEventListener("loadedmetadata", function () { ok(v.videoWidth / v.videoHeight); });
      v.addEventListener("error", function () { ok(16 / 9); });
      v.src = m.src;
      checkExists(p, m);
    } else if (m.type === "youtube") {
      ok(16 / 9);
    } else {
      ok(4 / 3);
      checkExists(p, m);
    }
  }

  // Videos and 3D models: ask the server whether the file is there
  function checkExists(p, m) {
    if (!/^https?:$/.test(location.protocol) || !window.fetch || /^https?:/i.test(m.src)) return;
    fetch(m.src, { method: "HEAD" })
      .then(function (r) {
        if (!r.ok) {
          noteMissing(p, m);
          layoutGallery(p, true);
        }
      })
      .catch(function () { /* offline: leave it */ });
  }

  function layoutGallery(p, force) {
    var g = p._gallery;
    if (!g || !g.isConnected) return;
    var items = p.media.filter(function (m) { return m.ratio && (EDIT_MODE || !m.missing); });
    if (!items.length) {
      g.hidden = true;
      return;
    }
    g.hidden = false;

    var W = g.clientWidth;
    if (!W) {
      requestAnimationFrame(function () { layoutGallery(p, true); });
      return;
    }
    var narrow = W < 560;
    var target = narrow ? 140 : 200;   // preferred row height (px)
    var maxH = narrow ? 340 : 480;     // never taller than this
    var ratios = items.map(function (m) { return Math.min(Math.max(m.ratio, 0.35), 4); });
    var sum = ratios.reduce(function (a, b) { return a + b; }, 0);
    // Try every row count and keep the one whose rows come closest to the
    // preferred height without any row hitting the height cap (which would
    // leave space at its sides)
    var best = null;
    for (var tryK = 1; tryK <= items.length; tryK++) {
      var tryRows = partition(ratios, tryK);
      var cost = 0;
      tryRows.forEach(function (row) {
        var rsum = 0;
        row.forEach(function (i) { rsum += ratios[i]; });
        var h = (W - GAP * (row.length - 1)) / rsum;
        var d = h - target;
        cost += d < 0 ? 2 * d * d : 0.15 * d * d;     // short rows look worse than tall ones
        if (h > maxH) cost += 50 * (h - maxH) * (h - maxH);
      });
      if (!best || cost < best.cost) best = { k: tryK, rows: tryRows, cost: cost };
    }
    var k = best.k;

    // Only rebuild when the number of rows changes (CSS handles the rest)
    var key = k + "|" + narrow + "|" + items.length + "|" + !!p._expanded;
    if (!force && g._key === key) return;
    g._key = key;

    var rows = best.rows;
    var limit = narrow ? 3 : 2;
    var hiddenCount = 0;
    g.innerHTML = "";

    rows.forEach(function (row, r) {
      var rsum = 0;
      row.forEach(function (i) { rsum += ratios[i]; });
      var rowEl = el("div", { class: "g-row" });
      // a row of tall pictures stops at maxH and sits centred
      rowEl.style.maxWidth = "calc(" + (maxH * rsum).toFixed(1) + "px + " + (GAP * (row.length - 1)) + "px)";
      row.forEach(function (i) { rowEl.append(tile(p, items[i], ratios[i])); });
      if (!p._expanded && r >= limit) {
        rowEl.hidden = true;
        hiddenCount += row.length;
      }
      g.append(rowEl);
    });

    if (hiddenCount) {
      var more = el("button", { class: "g-more", type: "button" },
        "Show " + hiddenCount + " more " + (hiddenCount === 1 ? "picture" : "pictures"));
      more.addEventListener("click", function () {
        p._expanded = true;
        layoutGallery(p, true);
        var first = g.querySelectorAll(".g-tile")[items.length - hiddenCount];
        if (first) first.focus();
      });
      g.append(more);
    }
  }

  // Split items (in order) into k rows whose widths are as even as possible
  function partition(ratios, k) {
    var n = ratios.length;
    var idx = function (a, b) { var out = []; for (var x = a; x < b; x++) out.push(x); return out; };
    if (k <= 1) return [idx(0, n)];
    if (k >= n) return ratios.map(function (_, i) { return [i]; });

    var pre = [0];
    for (var i = 0; i < n; i++) pre.push(pre[i] + ratios[i]);
    var ideal = pre[n] / k;
    var dp = [], cut = [];
    for (var j = 0; j <= k; j++) {
      dp.push(new Array(n + 1).fill(Infinity));
      cut.push(new Array(n + 1).fill(0));
    }
    dp[0][0] = 0;
    for (j = 1; j <= k; j++) {
      for (i = j; i <= n; i++) {
        for (var s = j - 1; s < i; s++) {
          var w = pre[i] - pre[s];
          var c = dp[j - 1][s] + (w - ideal) * (w - ideal);
          if (c < dp[j][i]) { dp[j][i] = c; cut[j][i] = s; }
        }
      }
    }
    var rows = [];
    i = n;
    for (j = k; j >= 1; j--) {
      var start = cut[j][i];
      rows.unshift(idx(start, i));
      i = start;
    }
    return rows;
  }

  function tile(p, m, ratio) {
    var kind = { image: "picture", video: "video", youtube: "video", model: "3D model" }[m.type] || "picture";
    var t = el("button", {
      class: "g-tile" + (m.missing ? " is-missing" : ""),
      type: "button",
      "aria-label": "Open " + kind + (m.caption ? ": " + m.caption : "")
    });
    t.style.flexGrow = ratio;
    t.style.aspectRatio = String(ratio);

    if (m.missing) {
      t.disabled = true;
      t.append(el("span", { class: "g-missing" }, [
        el("strong", null, "File not found"),
        el("code", null, m.src)
      ]));
      return t;
    }

    var picture = null;
    if (m.type === "image") picture = m.src;
    else if (m.poster) picture = m.poster;
    else if (m.type === "youtube") picture = "https://i.ytimg.com/vi/" + encodeURIComponent(m.id) + "/hqdefault.jpg";

    if (picture) {
      t.append(el("img", { src: picture, alt: "", loading: "lazy", decoding: "async" }));
    } else if (m.type === "video") {
      t.append(el("video", { src: m.src + "#t=0.1", muted: true, preload: "metadata", playsinline: true, tabindex: "-1" }));
    }
    if (m.type === "video" || m.type === "youtube") {
      var play = el("span", { class: "g-play" });
      play.append(icon("play"));
      t.append(play);
    }
    if (m.type === "model") t.append(el("span", { class: "g-badge" }, "3D"));
    if (m.caption) t.append(el("span", { class: "g-cap" }, m.caption));

    t.addEventListener("click", function () { openLightbox(p, m); });
    return t;
  }

  function noteMissing(p, m) {
    if (m.missing) return;
    m.missing = true;
    missingFiles.push(m.src);
    if (window.console) {
      console.warn('Portfolio: couldn\'t load "' + m.src + '" in "' + p.title +
        '". Check the file exists and the name matches exactly, including capitals and spaces.');
    }
    updateEditBanner();
  }

  /* 3D viewer (Google's <model-viewer>), loaded only when a project has a .glb */
  function loadModelViewer() {
    if (document.getElementById("model-viewer-lib")) return;
    var s = document.createElement("script");
    s.type = "module";
    s.id = "model-viewer-lib";
    s.src = window.MODEL_VIEWER_SRC ||
      "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.4.0/dist/model-viewer.min.js";
    document.head.append(s);
  }

  function updateEditBanner() {
    if (!EDIT_MODE) return;
    var banner = document.getElementById("edit-banner");
    if (!banner) {
      banner = el("div", { class: "edit-banner", id: "edit-banner", role: "status" });
      document.body.prepend(banner);
    }
    banner.innerHTML = "";
    banner.append(el("strong", null, "Edit mode. "), "Visitors don't see this bar. ");

    var todo = [];
    if (missingFiles.length) {
      todo.push(missingFiles.length + " file" + (missingFiles.length === 1 ? "" : "s") +
        " not found (outlined in orange below): " + missingFiles.join(", "));
    }
    if (!site.email) todo.push("Add your email address to SITE in projects.js");
    if (!site.linkedin) todo.push("Add your LinkedIn link to SITE in projects.js");
    if (!site.cv) todo.push("Add your CV (PDF) and its file name to SITE in projects.js");

    if (!todo.length) {
      banner.append("Every photo and video loaded.");
      return;
    }
    banner.append(el("ul", null, todo.map(function (t) { return el("li", null, t); })));
  }

  /* ---------- Full-screen viewer (pictures, video, 3D) ---------- */

  var lb, lbFigure, lbImg, lbCaption, lbCount, lbPrev, lbNext, lbClose;
  var lbItems = [];
  var lbIndex = 0;
  var lastFocus = null;

  function setupLightbox() {
    lb = document.getElementById("lightbox");
    if (!lb) return;
    lbFigure = lb.querySelector(".lb-figure");
    lbImg = lb.querySelector(".lb-figure img");
    lbCaption = lb.querySelector(".lb-caption");
    lbCount = lb.querySelector(".lb-count");
    lbPrev = lb.querySelector(".lb-prev");
    lbNext = lb.querySelector(".lb-next");
    lbClose = lb.querySelector(".lb-close");

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { stepLightbox(-1); });
    lbNext.addEventListener("click", function () { stepLightbox(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === lbFigure) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "Tab") {
        // keep keyboard focus inside the viewer
        var dyn = lbFigure.querySelector(".lb-dyn");
        var focusable = [lbClose, lbPrev, lbNext, dyn].filter(function (b) { return b && !b.hidden; });
        var i = focusable.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? i - 1 : i + 1;
        focusable[(next + focusable.length) % focusable.length].focus();
      }
    });

    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var onModel = e.target.closest && e.target.closest("model-viewer");
      if (!onModel && Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  function openLightbox(p, m) {
    if (!lb) return;
    lbItems = p.media.filter(function (x) { return !x.missing; });
    lbIndex = Math.max(0, lbItems.indexOf(m));
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add("lb-open");
    showLightboxItem();
    lbClose.focus();
  }

  function clearDynamic() {
    var old = lbFigure.querySelector(".lb-dyn");
    if (old) {
      if (old.pause) old.pause();
      old.remove();
    }
  }

  function showLightboxItem() {
    var m = lbItems[lbIndex];
    if (!m) return;
    clearDynamic();
    lbImg.hidden = m.type !== "image";
    if (m.type === "image") {
      lbImg.src = m.src;
      lbImg.alt = m.caption || "";
    } else {
      lbImg.removeAttribute("src");
      var node;
      if (m.type === "video") {
        node = el("video", {
          class: "lb-dyn", src: m.src, poster: m.poster || null,
          controls: true, autoplay: true, playsinline: true
        });
      } else if (m.type === "youtube") {
        node = el("iframe", {
          class: "lb-dyn lb-frame",
          src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(m.id) + "?autoplay=1",
          title: m.caption || "Video",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: true
        });
      } else {
        loadModelViewer();
        node = el("model-viewer", {
          class: "lb-dyn lb-frame", src: m.src, poster: m.poster || null,
          alt: m.caption || "3D model", "camera-controls": true, "camera-orbit": m.orbit || null,
          "shadow-intensity": "0.6", "environment-image": "neutral", exposure: "1.1", tabindex: "0"
        });
      }
      lbFigure.insertBefore(node, lbCaption);
    }
    lbCaption.textContent = m.caption || "";
    var many = lbItems.length > 1;
    lbCount.textContent = many ? (lbIndex + 1) + " of " + lbItems.length : "";
    lbPrev.hidden = !many;
    lbNext.hidden = !many;
  }

  function stepLightbox(dir) {
    if (lbItems.length < 2) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    showLightboxItem();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove("lb-open");
    clearDynamic();
    lbImg.removeAttribute("src");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  /* ---------- Highlight the current section in the menu ---------- */

  function setupNavHighlight() {
    if (!("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "projects", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) observer.observe(s);
    });
  }
})();
