// === ADAPTIQ RUNTIME CONFIG ===
// Server-side configuration. The UI never asks the user for any of this.
//
// claudeApiKey: enables AI coach responses and question generation.
// SECURITY NOTE: anything placed here is downloadable by every visitor.
// For a real production deployment, leave this empty and route Claude calls
// through a server proxy (e.g. a Firebase Cloud Function) that holds the key.
window.ADAPTIQ_CONFIG = {
  claudeApiKey: "",
};
