/* Shared chrome for public-facing pages: header, status strip, footer, CRT overlay. */
(function (global) {
  "use strict";

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function mountChrome(activePage) {
    document.body.insertBefore(el('<div class="crt-vignette"></div>'), document.body.firstChild);
    document.body.insertBefore(el('<div class="crt-overlay"></div>'), document.body.firstChild);

    var isNav = function (p) { return activePage === p ? " active" : ""; };

    var header = el(
      '<div class="topbar">' +
        '<div class="topbar-inner">' +
          '<a class="brand" href="/index.html">' +
            '<span class="brand-mark">D.A.D.</span>' +
            '<span class="brand-text">' +
              '<span class="brand-title">D.A.D.</span>' +
              '<span class="brand-sub">DIGITAL ARCHIVE DEPARTMENT</span>' +
            '</span>' +
          '</a>' +
          '<nav class="nav">' +
            '<a href="/index.html" class="' + isNav("home").trim() + '">HOME</a>' +
            '<a href="/archive.html" class="' + isNav("archive").trim() + '">ARCHIVE</a>' +
          '</nav>' +
        '</div>' +
      '</div>'
    );

    var status = el(
      '<div class="status-strip">' +
        '<div class="status-strip-inner">' +
          '<span><span class="dot"></span>SYSTEM NOMINAL</span>' +
          '<span id="dad-clock">--</span>' +
          '<span class="faint">TERMINAL: PUBLIC-ACCESS-04</span>' +
        '</div>' +
      '</div>'
    );

    var mainInsertionPoint = document.querySelector("main");
    document.body.insertBefore(header, mainInsertionPoint);
    document.body.insertBefore(status, mainInsertionPoint);

    var footer = el(
      '<footer>' +
        '<div class="shell">' +
          '<span>D.A.D. INTERNAL ARCHIVE SYSTEM &mdash; RETRIEVAL INTERFACE v2.3</span>' +
          '<span>UNAUTHORIZED ACCESS IS LOGGED</span>' +
        '</div>' +
      '</footer>'
    );
    document.body.appendChild(footer);

    if (global.DADEffects) {
      global.DADEffects.startClock(document.getElementById("dad-clock"));
    }
  }

  global.DADSite = { mountChrome: mountChrome };
})(window);
