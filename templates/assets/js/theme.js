/* Notion for Halo — front-end behaviour
   - color scheme switching (light / dark / system) with persistence
   - mobile navigation toggle
   - table-of-contents scroll spy
   - copy-to-clipboard buttons on code blocks
   ========================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "notion-halo-scheme";

  /* ---- color scheme ---------------------------------------------------- */
  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function resolve(scheme) {
    if (scheme === "dark") return "dark";
    if (scheme === "light") return "light";
    return systemPrefersDark() ? "dark" : "light"; // system
  }

  function apply(scheme) {
    var resolved = resolve(scheme);
    root.setAttribute("data-theme", resolved);
    // the comment widget reads data-color-scheme on <html>; keep it in sync
    root.setAttribute("data-color-scheme", resolved);
  }

  // current stored preference (may be "system")
  function preference() {
    return localStorage.getItem(STORAGE_KEY) ||
      root.getAttribute("data-default-scheme") || "system";
  }

  apply(preference());

  // react to system changes while in "system" mode
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (preference() === "system") apply("system");
    });
  }

  function bindSchemeToggle() {
    var btn = document.querySelector("[data-scheme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      // toggle between the two visible states based on what's rendered now
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
    });
  }

  /* ---- sidebar drawer (small screens) --------------------------------- */
  function bindSidebarToggle() {
    var toggle = document.querySelector("[data-sidebar-toggle]");
    var sidebar = document.querySelector("[data-sidebar]");
    var mask = document.querySelector("[data-sidebar-mask]");
    if (!toggle || !sidebar) return;

    function open() {
      sidebar.classList.add("is-open");
      if (mask) mask.classList.add("is-open");
    }
    function close() {
      sidebar.classList.remove("is-open");
      if (mask) mask.classList.remove("is-open");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.contains("is-open") ? close() : open();
    });
    if (mask) mask.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---- admin entry: reflect login state ------------------------------- */
  function bindAdminEntry() {
    var el = document.querySelector("[data-login-entry]");
    if (!el) return;
    fetch("/apis/api.console.halo.run/v1alpha1/users/-/permissions", {
      headers: { Accept: "application/json" },
      credentials: "include"
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        // anonymous visitors also get HTTP 200 but with empty uiPermissions;
        // only switch to the console icon when there are real console permissions
        if (data && Array.isArray(data.uiPermissions) && data.uiPermissions.length > 0) {
          el.classList.add("is-logged-in");
          el.setAttribute("title", "控制台");
          el.setAttribute("aria-label", "控制台");
        }
      })
      .catch(function () {});
  }

  /* ---- whole-card click ----------------------------------------------- */
  function bindCardClick() {
    document.querySelectorAll(".post-card[data-href]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        // let real links / buttons handle their own clicks
        if (e.target.closest("a, button")) return;
        // don't hijack a click that ends a text selection
        if (window.getSelection && String(window.getSelection())) return;
        var href = card.getAttribute("data-href");
        if (!href) return;
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          window.open(href, "_blank");
        } else {
          window.location.href = href;
        }
      });
    });
  }

  /* ---- table of contents scroll spy ----------------------------------- */
  function bindToc() {
    var toc = document.querySelector("[data-toc]");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    if (!links.length) return;

    var targets = links
      .map(function (a) {
        var id = decodeURIComponent(a.getAttribute("href").slice(1));
        var el = document.getElementById(id);
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var match = targets.find(function (t) { return t.el === entry.target; });
          if (!match) return;
          links.forEach(function (l) { l.classList.remove("is-active"); });
          match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    targets.forEach(function (t) { observer.observe(t.el); });
  }

  /* ---- build TOC from headings (if container present but empty) -------- */
  function buildToc() {
    var toc = document.querySelector("[data-toc]");
    var body = document.querySelector("[data-prose]");
    if (!toc || !body) return;
    var list = toc.querySelector("ul");
    if (!list) return;

    var headings = body.querySelectorAll("h2, h3, h4");
    if (!headings.length) {
      var wrap = toc.closest("[data-toc-wrap]");
      if (wrap) wrap.style.display = "none";
      else toc.style.display = "none";
      return;
    }
    headings.forEach(function (h, i) {
      if (!h.id) h.id = "heading-" + i;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      a.className = "lvl-" + h.tagName.slice(1);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ---- copy buttons on code blocks ------------------------------------ */
  function bindCodeCopy() {
    var blocks = document.querySelectorAll("[data-prose] pre");
    blocks.forEach(function (pre) {
      pre.style.position = "relative";
      var btn = document.createElement("button");
      btn.className = "btn--ghost";
      btn.textContent = "复制";
      btn.style.cssText =
        "position:absolute;top:8px;right:8px;padding:2px 8px;font-size:12px;opacity:0;transition:opacity .12s";
      pre.addEventListener("mouseenter", function () { btn.style.opacity = "1"; });
      pre.addEventListener("mouseleave", function () { btn.style.opacity = "0"; });
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(function () {
          btn.textContent = "已复制";
          setTimeout(function () { btn.textContent = "复制"; }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  /* ---- init ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    bindSchemeToggle();
    bindSidebarToggle();
    bindCardClick();
    bindAdminEntry();
    buildToc();
    bindToc();
    bindCodeCopy();
  });
})();
