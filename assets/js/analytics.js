/* Zenra AI — Google Analytics 4, Google Tag Manager and Meta Pixel (+ optional Microsoft Clarity), with Consent Mode v2.
   The IDs are set in /assets/js/config.js — nothing to change here.
   - Visitors in the EEA, UK and Switzerland: analytics and advertising stay off until they accept.
   - Everyone else: on by default; anyone can switch it off with "Cookie settings" in the footer.
   - Site events (downloads, WhatsApp clicks, form leads...) go to GA4, to GTM's dataLayer and to the Meta Pixel. */
(function () {
  var C = window.ZENRA_CONFIG || {};
  var id = String(C.gaMeasurementId || "").trim();
  var gtm = String(C.gtmId || "").trim();
  var pixel = String(C.metaPixelId || "").trim();
  var clarity = String(C.clarityId || "").trim();
  var KEY = "zenra_consent";
  var EEA = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
             "PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = read();
  var tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var european = /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);

  var deniedAll = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };
  var grantedAll = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" };
  if (saved === "denied") {
    gtag("consent", "default", deniedAll);
  } else if (saved === "granted") {
    gtag("consent", "default", grantedAll);
  } else {
    gtag("consent", "default", grantedAll);
    gtag("consent", "default", Object.assign({ region: EEA }, deniedAll));
  }
  gtag("set", "ads_data_redaction", true);

  function loadPixel() {
    if (!pixel || window.fbq) return;
    /* Meta Pixel base code */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("consent", "grant");
    window.fbq("init", pixel);
    window.fbq("track", "PageView");
  }

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    if (id) {
      window["ga-disable-" + id] = false;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(s);
      gtag("js", new Date());
      gtag("config", id, { allow_google_signals: false });
    }
    if (gtm) {
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtm);
      document.head.appendChild(g);
    }
    loadPixel();
    if (clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + encodeURIComponent(i);
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", clarity);
    }
  }

  function clearCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^(_ga|_gcl|_fbp|_fbc|_cl|CLID|MUID)/.test(name)) {
        ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  /* Used by the cookie banner in main.js */
  window.zenraConsent = {
    needsAsk: !saved && european,
    choice: saved,
    enabled: !!(id || gtm || pixel || clarity),
    accept: function () {
      save("granted"); this.choice = "granted"; this.needsAsk = false;
      gtag("consent", "update", grantedAll);
      if (window.fbq) window.fbq("consent", "grant");
      load();
      if (window.clarity) window.clarity("consent");
    },
    decline: function () {
      save("denied"); this.choice = "denied"; this.needsAsk = false;
      gtag("consent", "update", deniedAll);
      if (id) window["ga-disable-" + id] = true;
      if (window.fbq) window.fbq("consent", "revoke");
      if (window.clarity) window.clarity("consent", false);
      clearCookies();
    }
  };

  /* Site events → Meta Pixel event names */
  var FB = {
    generate_lead: ["track", "Lead"],
    whatsapp_click: ["track", "Contact"],
    email_click: ["track", "Contact"],
    download_click: ["trackCustom", "DownloadClick"],
    plan_click: ["trackCustom", "PlanClick"],
    cta_click: ["trackCustom", "CtaClick"],
    channel_click: ["trackCustom", "ChannelClick"]
  };

  /* Small helper so the rest of the site can send events safely */
  window.zenraTrack = function (name, params) {
    try {
      var on = window.zenraConsent.choice !== "denied" && loaded;
      if (id && !window["ga-disable-" + id]) gtag("event", name, params || {});
      if (on) window.dataLayer.push(Object.assign({ event: "zenra_" + name }, params || {}));
      if (on && window.fbq && FB[name]) window.fbq(FB[name][0], FB[name][1], params || {});
      if (window.clarity) window.clarity("event", name);
    } catch (e) {}
  };

  if (saved === "denied" || (!saved && european)) return; /* wait for a choice */
  load();
})();
