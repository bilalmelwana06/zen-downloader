/* ============================================================================
   ZENRA AI WEBSITE - SETTINGS
   This is the only file you need to edit. Change a value, save, upload.
   ========================================================================== */
window.ZENRA_CONFIG = {

  /* 1) GOOGLE ANALYTICS 4  (daily visitors, pages, downloads, WhatsApp clicks, form leads)
        Your Measurement ID, e.g. "G-AB12CD34EF".
        Leave it empty ("") and no analytics code is loaded at all. */
  gaMeasurementId: "G-JQ1KWSK23P",

  /* 1b) GOOGLE TAG MANAGER  (for Google Ads and other marketing tags)
        Your container ID, e.g. "GTM-XXXXXXX". Leave it empty ("") to switch GTM off. */
  gtmId: "GTM-MCQC8VR9",

  /* 1c) META (FACEBOOK) PIXEL  (Facebook & Instagram ads, retargeting audiences)
        Your Pixel / Dataset ID (numbers only). Leave it empty ("") to switch the pixel off. */
  metaPixelId: "1411805884269549",

  /* 2) MICROSOFT CLARITY  (optional, free: heatmaps and session recordings)
        Paste your Clarity project ID between the quotes, e.g. "abcd1234ef".
        Leave it empty ("") and Clarity is not loaded. */
  clarityId: "",

  /* 3) CONTACT FORM (Web3Forms - free)
        Your Access Key from web3forms.com.
        While it is empty, the form opens WhatsApp with the message instead. */
  web3formsKey: "35fecebf-3f02-478f-b9fc-430c94c1a53e",

  /* 4) ZENRA AI VIRAL CLIPS - LAUNCH SWITCH (Windows)
        Launched on 11 November 2026 with version 3.0.
        true  = the buttons are "Download for Windows" and "Buy" everywhere on the site.
        Keep this on true. */
  viralClipsLaunched: true,

  /* 5) MAC VERSIONS - DOWNLOAD LINKS
        Every app shows "Mac · Coming soon" until you paste its Mac download link here.
        Paste the link between the quotes, save and upload: on every page the button
        becomes "Download for Mac" and "Mac coming soon" becomes "macOS".
        Leave it empty ("") to keep "Coming soon". */
  macDownloads: {
    videoDownloader: "",   /* Zenra Video Downloader */
    viralClips: "",        /* Zenra AI Viral Clips */
    videoSplitter: ""      /* Zenra Video Splitter */
  }

};

/* switches → page classes (nothing to change below this line) */
(function (c, h) {
  if (c.viralClipsLaunched) h.classList.add("zvc-live");
  var m = c.macDownloads || {};
  for (var k in m) if (Object.prototype.hasOwnProperty.call(m, k) && String(m[k] || "").trim()) h.classList.add("zmac-" + k);
})(window.ZENRA_CONFIG, document.documentElement);
