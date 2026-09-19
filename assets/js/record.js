(function () {
  "use strict";

  function slug(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function badge(type, value) {
    if (!value) return "";
    return '<span class="badge ' + type + "-" + slug(value) + '">' + value + "</span>";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; });
  }
  function isRedactedLine(line) {
    var blocks = (line.match(/█/g) || []).length;
    return line.length > 0 && blocks / line.length > 0.3;
  }
  function isLocked(record) {
    return record.status === "ACCESS DENIED" || record.classification === "ADMIN ONLY";
  }

  function renderDenied(container, code, message, sub) {
    container.innerHTML =
      '<a class="back-link" href="/archive.html">&larr; BACK TO ARCHIVE</a>' +
      '<div class="denied-block">' +
        '<div class="denied-code">' + code + "</div>" +
        '<div class="denied-msg">' + message + "</div>" +
        (sub ? '<div class="denied-sub">' + sub + "</div>" : "") +
      "</div>";
  }

  function renderMeta(record) {
    var rows = [
      { k: "SUBJECT", v: record.subject },
      { k: "CLASSIFICATION", v: record.classification },
      { k: "STATUS", v: record.status },
      { k: "DATE LOGGED", v: record.dateLogged },
      { k: "DATE RECORDED", v: record.dateRecorded },
      { k: "OPERATOR", v: record.operator }
    ].concat((record.fields || []).map(function (f) { return { k: f.label, v: f.value }; }));

    return (
      '<ul class="meta-list">' +
      rows.map(function (r) {
        var redacted = /\[REDACTED\]|█/.test(String(r.v));
        return (
          "<li><span class=\"k\">" + escapeHtml(r.k) + "</span><span class=\"v" + (redacted ? " redacted-val" : "") + "\">" +
          escapeHtml(r.v == null ? "—" : r.v) + "</span></li>"
        );
      }).join("") +
      "</ul>"
    );
  }

  function renderBody(record) {
    if (!record.body || !record.body.length) return "";
    return (
      '<div class="record-body">' +
      record.body.map(function (line) {
        if (isRedactedLine(line)) {
          return '<p><span class="redacted-line">' + escapeHtml(line) + "</span></p>";
        }
        return "<p>" + escapeHtml(line) + "</p>";
      }).join("") +
      "</div>"
    );
  }

  function renderAccessLog(record) {
    if (!record.accessLog || !record.accessLog.length) return "";
    return (
      '<div class="access-log"><h2>Access Log</h2><table><thead><tr><th>Timestamp</th><th>User</th><th>Action</th></tr></thead><tbody>' +
      record.accessLog.map(function (l) {
        return "<tr><td>" + escapeHtml(l.date) + "</td><td>" + escapeHtml(l.user) + "</td><td>" + escapeHtml(l.action) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>"
    );
  }

  function mountMedia(record, mediaContainer) {
    if (!record.media) {
      mediaContainer.innerHTML = '<div class="media-block"><div class="media-empty">NO MEDIA LINKED TO THIS RECORD</div></div>';
      return;
    }
    mediaContainer.innerHTML =
      '<div class="media-block">' +
        '<div class="media-empty" id="media-slot">RETRIEVING LINKED MEDIA&hellip;</div>' +
        '<div class="media-caption"><span>' + escapeHtml(record.media.caption || "") + '</span><span class="faint">REC ' + record.id + "</span></div>" +
      "</div>";

    window.DADStore.media.getUrl(record.id).then(function (url) {
      var slot = document.getElementById("media-slot");
      if (!slot) return;
      if (!url) {
        slot.outerHTML = '<div class="media-empty">MEDIA MARKED AS LINKED BUT NOT YET INGESTED IN THIS TERMINAL</div>';
        return;
      }
      var video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.preload = "metadata";
      slot.replaceWith(video);
    });
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var container = document.getElementById("record-view");

    if (!id) {
      renderDenied(container, "NO ID", "NO RECORD ID SPECIFIED.", "Return to the archive index and select a record.");
      return;
    }

    var record = window.DADStore.getRecord(id);

    if (!record) {
      renderDenied(container, "404", "RECORD " + escapeHtml(id) + " NOT FOUND.", "This record does not exist in the accessible index.");
      return;
    }

    if (isLocked(record)) {
      renderDenied(
        container,
        "ACCESS DENIED",
        "INSUFFICIENT CLEARANCE TO VIEW RECORD " + record.id + ".",
        "Classification: " + record.classification + " &mdash; contact your administrator if you believe this is an error."
      );
      document.title = "Access Denied — D.A.D. Archive";
      return;
    }

    document.title = "REC " + record.id + " — " + record.title + " — D.A.D. Archive";

    container.innerHTML =
      '<a class="back-link" href="/archive.html">&larr; BACK TO ARCHIVE</a>' +
      '<div class="record-head">' +
        "<div>" +
          '<div class="record-head-id">RECORD ' + record.id + "</div>" +
          "<h1>" + escapeHtml(record.title) + "</h1>" +
        "</div>" +
        '<div class="record-badges">' + badge("cls", record.classification) + badge("status", record.status) + "</div>" +
      "</div>" +
      (record.summary ? '<p class="muted">' + escapeHtml(record.summary) + "</p>" : "") +
      '<div class="scan-hairline"></div>' +
      '<div class="record-grid">' +
        '<div class="panel"><div class="panel-header"><span>Metadata</span></div><div class="panel-body">' + renderMeta(record) + "</div></div>" +
        '<div>' +
          '<div id="media-container"></div>' +
          renderBody(record) +
          renderAccessLog(record) +
        "</div>" +
      "</div>";

    mountMedia(record, document.getElementById("media-container"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
