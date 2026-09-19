(function () {
  "use strict";

  var PASSPHRASE = "OVERSEER-7";
  var SESSION_KEY = "dad_admin_session";

  function isAuthed() {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
  }
  function setAuthed() {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* noop */ }
  }
  function clearAuthed() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* noop */ }
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; });
  }

  // ---------- Login gate ----------
  function initLogin() {
    var gate = document.getElementById("login-gate");
    var dashboard = document.getElementById("admin-root");
    var attempts = 0;

    function show() {
      if (isAuthed()) {
        gate.style.display = "none";
        dashboard.style.display = "";
        document.dispatchEvent(new CustomEvent("dad-admin-ready"));
      } else {
        gate.style.display = "";
        dashboard.style.display = "none";
      }
    }

    var form = document.getElementById("login-form");
    var errorEl = document.getElementById("login-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = document.getElementById("login-pass").value;
      if (val === PASSPHRASE) {
        setAuthed();
        errorEl.textContent = "";
        show();
      } else {
        attempts++;
        errorEl.textContent = attempts >= 3
          ? "ACCESS DENIED — REPEATED FAILURE LOGGED"
          : "ACCESS DENIED — INVALID CREDENTIALS";
      }
    });

    var logoutBtns = document.querySelectorAll("[data-action='logout']");
    Array.prototype.forEach.call(logoutBtns, function (b) {
      b.addEventListener("click", function () { clearAuthed(); show(); });
    });

    show();
  }

  // ---------- Dashboard ----------
  function initDashboard() {
    var tbody = document.getElementById("admin-records-body");

    function render() {
      var records = window.DADStore.getAllRecords();
      if (!records.length) {
        tbody.innerHTML = '<tr><td colspan="7">No records.</td></tr>';
        return;
      }
      tbody.innerHTML = records.map(function (r) {
        return (
          "<tr>" +
            "<td>" + escapeHtml(r.id) + "</td>" +
            "<td>" + escapeHtml(r.title || "") + "</td>" +
            "<td>" + escapeHtml(r.subject || "") + "</td>" +
            "<td>" + escapeHtml(r.classification) + "</td>" +
            "<td>" + escapeHtml(r.status) + "</td>" +
            "<td>" + (r.hidden ? '<span class="tag-yes">HIDDEN</span>' : '<span class="tag-no">VISIBLE</span>') + "</td>" +
            "<td>" + (r.media ? '<span class="tag-yes">LINKED</span>' : '<span class="tag-no">NONE</span>') + "</td>" +
            '<td class="actions">' +
              '<a href="/admin/edit.html?id=' + encodeURIComponent(r.id) + '">EDIT</a>' +
              '<button data-toggle-hidden="' + escapeHtml(r.id) + '">' + (r.hidden ? "UNHIDE" : "HIDE") + "</button>" +
              '<button class="danger" data-delete="' + escapeHtml(r.id) + '">DELETE</button>' +
            "</td>" +
          "</tr>"
        );
      }).join("");

      Array.prototype.forEach.call(tbody.querySelectorAll("[data-toggle-hidden]"), function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-toggle-hidden");
          var rec = window.DADStore.getRecord(id);
          if (!rec) return;
          rec.hidden = !rec.hidden;
          window.DADStore.saveRecord(rec);
          render();
        });
      });
      Array.prototype.forEach.call(tbody.querySelectorAll("[data-delete]"), function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-delete");
          if (!confirm("Delete record " + id + "? This cannot be undone from this terminal.")) return;
          window.DADStore.deleteRecord(id);
          window.DADStore.media.remove(id);
          render();
        });
      });
    }

    render();
  }

  // ---------- Edit / create form ----------
  function fieldsToText(fields) {
    return (fields || []).map(function (f) { return f.label + ": " + f.value; }).join("\n");
  }
  function textToFields(text) {
    return String(text || "").split("\n").map(function (l) { return l.trim(); }).filter(Boolean).map(function (line) {
      var idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });
  }
  function logToText(log) {
    return (log || []).map(function (l) { return l.date + " | " + l.user + " | " + l.action; }).join("\n");
  }
  function textToLog(text) {
    return String(text || "").split("\n").map(function (l) { return l.trim(); }).filter(Boolean).map(function (line) {
      var parts = line.split("|").map(function (p) { return p.trim(); });
      return { date: parts[0] || "", user: parts[1] || "", action: parts[2] || "" };
    });
  }

  function initEdit() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var isNew = !id;
    var existing = id ? window.DADStore.getRecord(id) : null;

    document.getElementById("form-title").textContent = isNew ? "NEW RECORD" : "EDIT RECORD " + id;
    var idInput = document.getElementById("f-id");
    if (!isNew) { idInput.value = id; idInput.disabled = true; }

    if (existing) {
      document.getElementById("f-title").value = existing.title || "";
      document.getElementById("f-subject").value = existing.subject || "";
      document.getElementById("f-classification").value = existing.classification || "UNCLASSIFIED";
      document.getElementById("f-status").value = existing.status || "ACTIVE";
      document.getElementById("f-date-logged").value = existing.dateLogged || "";
      document.getElementById("f-date-recorded").value = existing.dateRecorded || "";
      document.getElementById("f-operator").value = existing.operator || "";
      document.getElementById("f-tags").value = (existing.tags || []).join(", ");
      document.getElementById("f-summary").value = existing.summary || "";
      document.getElementById("f-body").value = (existing.body || []).join("\n");
      document.getElementById("f-fields").value = fieldsToText(existing.fields);
      document.getElementById("f-access-log").value = logToText(existing.accessLog);
      document.getElementById("f-hidden").checked = !!existing.hidden;
      document.getElementById("f-media-caption").value = existing.media ? (existing.media.caption || "") : "";
    }

    var mediaCurrentEl = document.getElementById("media-current");
    function renderMediaStatus() {
      if (!existing) { mediaCurrentEl.textContent = "Save the record first to enable media upload."; return; }
      window.DADStore.media.get(existing.id).then(function (entry) {
        if (entry && entry.blob) {
          var url = URL.createObjectURL(entry.blob);
          mediaCurrentEl.innerHTML = '<video src="' + url + '" controls></video><span>' + escapeHtml(entry.name || "linked file") + "</span>";
        } else {
          mediaCurrentEl.textContent = existing.media ? "Marked as linked, but no file stored in this browser." : "No media linked.";
        }
      });
    }
    renderMediaStatus();

    var fileInput = document.getElementById("f-media-file");
    document.getElementById("btn-upload-media").addEventListener("click", function () {
      if (!existing) { alert("Save the record first, then upload media."); return; }
      var file = fileInput.files[0];
      if (!file) { alert("Choose a video file first."); return; }
      window.DADStore.media.put(existing.id, file).then(function () {
        existing.media = existing.media || {};
        existing.media.status = "linked";
        existing.media.caption = document.getElementById("f-media-caption").value || existing.media.caption || "";
        window.DADStore.saveRecord(existing);
        renderMediaStatus();
        alert("Media stored and linked to record " + existing.id + ".");
      });
    });
    document.getElementById("btn-remove-media").addEventListener("click", function () {
      if (!existing) return;
      if (!confirm("Remove linked media from this record?")) return;
      window.DADStore.media.remove(existing.id).then(function () {
        existing.media = null;
        window.DADStore.saveRecord(existing);
        renderMediaStatus();
      });
    });

    document.getElementById("edit-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var recId = isNew ? document.getElementById("f-id").value.trim() : id;
      if (!recId) { alert("Record ID is required."); return; }
      if (isNew && window.DADStore.getRecord(recId)) { alert("A record with this ID already exists."); return; }

      var record = {
        id: recId,
        title: document.getElementById("f-title").value.trim(),
        subject: document.getElementById("f-subject").value.trim(),
        classification: document.getElementById("f-classification").value,
        status: document.getElementById("f-status").value,
        dateLogged: document.getElementById("f-date-logged").value,
        dateRecorded: document.getElementById("f-date-recorded").value,
        operator: document.getElementById("f-operator").value.trim(),
        tags: document.getElementById("f-tags").value.split(",").map(function (t) { return t.trim(); }).filter(Boolean),
        summary: document.getElementById("f-summary").value.trim(),
        body: document.getElementById("f-body").value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean),
        fields: textToFields(document.getElementById("f-fields").value),
        accessLog: textToLog(document.getElementById("f-access-log").value),
        hidden: document.getElementById("f-hidden").checked,
        media: existing ? existing.media : null
      };
      window.DADStore.saveRecord(record);
      window.location.href = "/admin/index.html";
    });
  }

  window.DADAdmin = {
    initLogin: initLogin,
    initDashboard: initDashboard,
    initEdit: initEdit
  };
})();
