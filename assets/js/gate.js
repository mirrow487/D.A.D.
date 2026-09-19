/*
 * Public-site access gate. Client-side only — this does not provide real
 * security (the code is visible in this file's source), it only gives the
 * visitor-facing site a "clearance code" entry step consistent with the
 * archive's theme.
 */
(function (global) {
  "use strict";

  var KEY = "dad_public_gate";
  var CODE = "CLEARANCE-04";

  function isCleared() {
    try { return global.sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function grant() {
    try { global.sessionStorage.setItem(KEY, "1"); } catch (e) { /* noop */ }
  }
  function verify(input) {
    return String(input || "").trim().toUpperCase() === CODE;
  }
  function requireOrRedirect() {
    if (!isCleared()) {
      var ret = encodeURIComponent(location.pathname + location.search);
      location.replace("/index.html?return=" + ret);
    }
  }

  global.DADGate = { isCleared: isCleared, grant: grant, verify: verify, requireOrRedirect: requireOrRedirect };
})(window);
