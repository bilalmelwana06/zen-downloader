/* Zenra AI — Google Analytics 4 (+ optional Microsoft Clarity) with Consent Mode v2.
   The IDs are set in /assets/js/config.js — nothing to change here.
   - Visitors in the EEA, UK and Switzerland: analytics stay off until they accept.
   - Everyone can change their choice with "Cookie settings" in the footer.
   - Advertising features are never used (ad_* is always denied). */
(function () {
  var C = window.ZENRA_CONFIG || {};
  var id = String(C.gaMeasurementId || "").trim();
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
  if (saved === "denied") {
    gtag("consent", "default", deniedAll);
  } else if (saved === "granted") {
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  } else {
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    gtag("consent", "default", Object.assign({ region: EEA }, deniedAll));
  }
  gtag("set", "ads_data_redaction", true);

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
      gtag("config", id, { allow_google_signals: false, allow_ad_personalization_signals: false });
    }
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
      if (/^(_ga|_cl|CLID|MUID)/.test(name)) {
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
    enabled: !!(id || clarity),
    accept: function () {
      save("granted"); this.choice = "granted"; this.needsAsk = false;
      gtag("consent", "update", { analytics_storage: "granted" });
      load();
      if (window.clarity) window.clarity("consent");
    },
    decline: function () {
      save("denied"); this.choice = "denied"; this.needsAsk = false;
      gtag("consent", "update", { analytics_storage: "denied" });
      if (id) window["ga-disable-" + id] = true;
      if (window.clarity) window.clarity("consent", false);
      clearCookies();
    }
  };

  /* Small helper so the rest of the site can send events safely */
  window.zenraTrack = function (name, params) {
    try {
      if (id && !window["ga-disable-" + id]) gtag("event", name, params || {});
      if (window.clarity) window.clarity("event", name);
    } catch (e) {}
  };

  if (saved === "denied" || (!saved && european)) return; /* wait for a choice */
  load();
})();
