/* Small, restrained ambient effects: boot-typing and status clock. */
(function (global) {
  "use strict";

  function typeInto(el, text, speed, done) {
    if (!el) return;
    var reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      if (done) done();
      return;
    }
    el.textContent = "";
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        global.setTimeout(step, speed);
      } else if (done) {
        done();
      }
    })();
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function startClock(el) {
    if (!el) return;
    function tick() {
      var d = new Date();
      el.textContent = d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) +
        " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + " UTC";
    }
    tick();
    global.setInterval(tick, 1000);
  }

  global.DADEffects = { typeInto: typeInto, startClock: startClock };
})(window);
