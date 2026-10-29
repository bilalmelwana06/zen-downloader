/* Zenra AI — site behaviour: menus, cookie banner, event tracking, contact form, app versions. */
(function () {
  "use strict";
  var C = window.ZENRA_CONFIG || {};
  var track = window.zenraTrack || function () {};
  var doc = document;

  /* ---------- header menus ---------- */
  var menuBtn = doc.querySelector(".menu-btn");
  var menu = doc.getElementById("menu");
  var drops = Array.prototype.slice.call(doc.querySelectorAll(".menu [data-drop]"));
  var desktop = window.matchMedia("(min-width: 1061px)");

  function closeDrops(except) {
    drops.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      var p = doc.getElementById(b.getAttribute("aria-controls"));
      if (p) p.classList.remove("open");
    });
  }
  drops.forEach(function (b) {
    var panel = doc.getElementById(b.getAttribute("aria-controls"));
    var li = b.parentNode, timer, hoverOpened = false;
    b.addEventListener("click", function () {
      // the pointer already opened it on hover: this click should keep it open, not close it
      if (hoverOpened) { hoverOpened = false; return; }
      var open = b.getAttribute("aria-expanded") !== "true";
      closeDrops(b);
      b.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.classList.toggle("open", open);
    });
    li.addEventListener("mouseenter", function () {
      if (!desktop.matches) return;
      clearTimeout(timer); closeDrops(b);
      if (b.getAttribute("aria-expanded") !== "true") hoverOpened = true;
      b.setAttribute("aria-expanded", "true"); if (panel) panel.classList.add("open");
    });
    li.addEventListener("mouseleave", function () {
      if (!desktop.matches) return;
      hoverOpened = false;
      timer = setTimeout(function () { b.setAttribute("aria-expanded", "false"); if (panel) panel.classList.remove("open"); }, 160);
    });
  });
  doc.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".menu > li")) closeDrops();
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openBtn = drops.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    closeDrops();
    if (openBtn) openBtn.focus();
    if (menu && menu.classList.contains("open")) { toggleMenu(false); if (menuBtn) menuBtn.focus(); }
  });
  function toggleMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("menu-open", open);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { toggleMenu(!menu.classList.contains("open")); });
  if (menu) menu.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (a && !desktop.matches) toggleMenu(false);
  });
  if (desktop.addEventListener) desktop.addEventListener("change", function () { toggleMenu(false); closeDrops(); });

  /* ---------- year ---------- */
  var yr = doc.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- cookie banner ---------- */
  var consent = window.zenraConsent;
  var banner = doc.getElementById("consent");
  function showBanner() { if (banner) { banner.classList.add("show"); var b = banner.querySelector("button"); if (b) b.focus({ preventScroll: true }); } }
  function hideBanner() { if (banner) banner.classList.remove("show"); }
  if (banner && consent) {
    banner.querySelector("[data-consent=accept]").addEventListener("click", function () { consent.accept(); hideBanner(); });
    banner.querySelector("[data-consent=decline]").addEventListener("click", function () { consent.decline(); hideBanner(); });
    if (consent.needsAsk && consent.enabled) showBanner();
  }
  Array.prototype.forEach.call(doc.querySelectorAll("[data-cookie-settings]"), function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });
  });

  /* ---------- event tracking (Google Analytics 4) ---------- */
  function where(el) {
    var p = el.closest("[data-place]");
    if (p) return p.getAttribute("data-place");
    var s = el.closest("section[id],header,footer");
    return s ? (s.id || s.tagName.toLowerCase()) : "page";
  }
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a,button");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var place = where(a);
    if (a.hasAttribute("data-download") || /\.exe(\?|$)/i.test(href)) {
      track("download_click", { product: a.getAttribute("data-download") || href.split("/").pop(), placement: place, link_url: href });
    } else if (/wa\.me\//.test(href)) {
      track("whatsapp_click", { placement: place, topic: a.getAttribute("data-topic") || "general" });
    } else if (/whatsapp\.com\/channel/.test(href)) {
      track("channel_click", { placement: place });
    } else if (/^mailto:/.test(href)) {
      track("email_click", { placement: place });
    }
    if (a.hasAttribute("data-plan")) {
      track("plan_click", { product: a.getAttribute("data-product") || "", plan: a.getAttribute("data-plan"), placement: place });
    }
    if (a.hasAttribute("data-cta")) {
      track("cta_click", { cta: a.getAttribute("data-cta"), placement: place });
    }
  });

  /* ---------- newest app version (never blocks the page) ---------- */
  function showVersion(src, fn) {
    if (!window.fetch || location.protocol === "file:") return;
    fetch(src, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) fn(d); })
      .catch(function () {});
  }
  var ver = doc.querySelector("[data-version-src]");
  if (ver && doc.documentElement.classList.contains("zvc-live")) {
    showVersion(ver.getAttribute("data-version-src"), function (d) {
      var v = doc.querySelector("[data-version]"), s = doc.querySelector("[data-size]");
      if (d.version && v) v.textContent = String(d.version);
      if (d.size > 0 && s) { s.textContent = Math.round(d.size / 1048576) + " MB download"; var row = doc.querySelector("[data-size-row]"); if (row) row.hidden = false; }
    });
  }
  var dl = doc.querySelectorAll("[data-app-version]");
  if (dl.length) {
    showVersion(dl[0].getAttribute("data-app-version"), function (d) {
      if (!d.version) return;
      Array.prototype.forEach.call(dl, function (el) { el.textContent = String(d.version); });
    });
  }

  /* ---------- contact form ---------- */
  var form = doc.getElementById("contact-form");
  if (!form) return;
  var okBox = doc.getElementById("form-ok"), errBox = doc.getElementById("form-err"), waBox = doc.getElementById("form-wa");
  var btn = form.querySelector("button[type=submit]");
  var btnText = btn ? btn.innerHTML : "";
  var params = new URLSearchParams(location.search);
  var pre = params.get("service");
  if (pre) { var sel = form.querySelector("[name=service]"); if (sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === pre || o.getAttribute("data-key") === pre) sel.value = o.value; }); }

  function show(box) { [okBox, errBox, waBox].forEach(function (b) { if (b) b.classList.toggle("show", b === box); }); if (box) box.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  function val(n) { var f = form.elements[n]; return f ? String(f.value || "").trim() : ""; }

  /* "Custom budget" opens a box to type the amount */
  var budgetSel = form.elements.budget, customWrap = doc.getElementById("budget-custom"), customIn = form.elements.budget_custom;
  function syncBudget(focus) {
    if (!budgetSel || !customWrap) return;
    var on = budgetSel.value === "Custom";
    customWrap.hidden = !on;
    if (customIn) customIn.required = on;
    if (on && focus && customIn) customIn.focus();
  }
  if (budgetSel) budgetSel.addEventListener("change", function () { syncBudget(true); });
  syncBudget(false);
  function budgetText() {
    var b = val("budget");
    if (b !== "Custom") return b;
    var c = val("budget_custom");
    return c ? "Custom: " + c : "Custom";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements.botcheck && form.elements.botcheck.checked) { show(okBox); form.reset(); return; }
    var data = {
      name: val("name"), email: val("email"), company: val("company"), service: val("service"),
      budget: budgetText(), timeline: val("timeline"), source: val("source"), message: val("message")
    };
    var budgetKind = val("budget");   // analytics get the range or "Custom", never the typed amount
    var key = String(C.web3formsKey || "").trim();
    if (!key) {
      var text = "Hi Zenra AI! I'd like to start a project.\n\nName: " + data.name + "\nEmail: " + data.email +
        (data.company ? "\nCompany: " + data.company : "") + "\nService: " + data.service +
        (data.budget ? "\nBudget: " + data.budget : "") + (data.timeline ? "\nTimeline: " + data.timeline : "") +
        "\n\n" + data.message;
      var url = form.getAttribute("data-wa") + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      track("generate_lead", { method: "whatsapp_form", service: data.service, budget: budgetKind, source: data.source });
      show(waBox);
      return;
    }
    if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: "New project enquiry: " + data.service + " (" + data.name + ")",
        from_name: "Zenra AI website",
        replyto: data.email,
        name: data.name, email: data.email, company: data.company || "-", service: data.service,
        budget: data.budget || "-", timeline: data.timeline || "-", heard_about_us: data.source || "-",
        message: data.message, page: location.href
      })
    })
      .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
      .then(function (res) {
        if (res && res.success) {
          show(okBox); form.reset(); syncBudget(false);
          track("generate_lead", { method: "contact_form", service: data.service, budget: budgetKind, source: data.source });
        } else { show(errBox); }
      })
      .catch(function () { show(errBox); })
      .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = btnText; } });
  });
})();
