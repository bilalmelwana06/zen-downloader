/* ============================================================================
   ZENRA AI WEBSITE — SETTINGS
   This is the only file you need to edit. Change a value, save, upload.
   ========================================================================== */
window.ZENRA_CONFIG = {

  /* 1) GOOGLE ANALYTICS 4  (daily visitors, pages, downloads, WhatsApp clicks, form leads)
        Your Measurement ID, e.g. "G-AB12CD34EF".
        Leave it empty ("") and no analytics code is loaded at all. */
  gaMeasurementId: "G-JQ1KWSK23P",

  /* 2) MICROSOFT CLARITY  (optional, free: heatmaps and session recordings)
        Paste your Clarity project ID between the quotes, e.g. "abcd1234ef".
        Leave it empty ("") and Clarity is not loaded. */
  clarityId: "",

  /* 3) CONTACT FORM (Web3Forms — free)
        Your Access Key from web3forms.com.
        While it is empty, the form opens WhatsApp with the message instead. */
  web3formsKey: "35fecebf-3f02-478f-b9fc-430c94c1a53e",

  /* 4) ZENRA AI VIRAL CLIPS — LAUNCH SWITCH
        false = every Viral Clips button shows "Coming soon".
        true  = the buttons become "Download" and "Buy" everywhere on the site.
        (The installer must already be on GitHub Releases as ZenraAIViralClips.exe) */
  viralClipsLaunched: false

};

if (window.ZENRA_CONFIG.viralClipsLaunched) document.documentElement.classList.add("zvc-live");
