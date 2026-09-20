(function () {
  "use strict";

  function slug(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function badge(type, value) {
    if (!value) return "";
    return '<span class="badge ' + type + "-" + slug(value) + '">' + value + "</span>";
  }

  function isLocked(record) {
    return record.status === "ACCESS DENIED" || record.classification === "ADMIN ONLY";
  }

  var ADMIN_TRIGGER = "D4WN-OVERRIDE";

  function renderRows(records) {
    if (!records.length) {
      return '<tr><td colspan="6"><div class="records-empty">NO RECORDS MATCH CURRENT QUERY</div></td></tr>';
    }
    return records.map(function (r) {
      var locked = isLocked(r);
      var rowClass = "linkable" + (locked ? " locked" : "");
      return (
        '<tr class="' + rowClass + '" data-id="' + r.id + '">' +
          '<td class="rid">' + r.id + "</td>" +
          '<td class="title">' + (locked ? r.title || "UNTITLED" : r.title) + "</td>" +
          "<td>" + (r.subject || "&mdash;") + "</td>" +
          "<td>" + badge("cls", r.classification) + "</td>" +
          "<td>" + badge("status", r.status) + "</td>" +
          '<td class="faint">' + (r.dateLogged || "&mdash;") + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function applyFilters(records, query, cls) {
    var q = (query || "").trim().toLowerCase();
    return records.filter(function (r) {
      if (cls && cls !== "ALL" && r.classification !== cls) return false;
      if (!q) return true;
      var hay = [r.id, r.title, r.subject, r.classification, r.status].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function init() {
    var records = window.DADStore.getVisibleRecords();
    var tbody = document.getElementById("records-body");
    var searchInput = document.getElementById("record-search");
    var clsSelect = document.getElementById("cls-filter");
    var countEl = document.getElementById("record-count");

    var classes = Array.from(new Set(records.map(function (r) { return r.classification; }))).sort();
    classes.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      clsSelect.appendChild(opt);
    });

    function render() {
      var filtered = applyFilters(records, searchInput.value, clsSelect.value);
      tbody.innerHTML = renderRows(filtered);
      countEl.textContent = filtered.length + " / " + records.length + " RECORDS";
      Array.prototype.forEach.call(tbody.querySelectorAll("tr.linkable"), function (row) {
        row.addEventListener("click", function () {
          window.location.href = "/record.html?id=" + encodeURIComponent(row.getAttribute("data-id"));
        });
      });
    }

    searchInput.addEventListener("input", function () {
      if (searchInput.value.trim().toUpperCase() === ADMIN_TRIGGER) {
        window.location.href = "/admin/index.html";
        return;
      }
      render();
    });
    clsSelect.addEventListener("change", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
