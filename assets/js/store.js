/*
 * D.A.D. Internal Archive — data layer.
 * Seed records + localStorage overrides (edits/new/hidden/deleted)
 * + IndexedDB for linked media (video) blobs.
 * No backend: state lives in this browser only.
 */
(function (global) {
  "use strict";

  var LS_KEY = "dad_archive_overrides_v1";
  var DB_NAME = "dad_media_store";
  var DB_STORE = "media";
  var DB_VERSION = 1;

  var SEED_RECORDS = [
    {
      id: "0002",
      subject: "N/A",
      title: "Department Charter (Excerpt)",
      classification: "UNCLASSIFIED",
      status: "ARCHIVED",
      dateLogged: "2019-02-11",
      dateRecorded: "2019-02-11",
      operator: "D.A.D. — Administrative Records",
      tags: ["charter", "administrative"],
      summary: "Partial excerpt of departmental founding documentation, retained for internal reference.",
      fields: [
        { label: "DOCUMENT TYPE", value: "CHARTER EXCERPT" },
        { label: "REVISION", value: "4" },
        { label: "DISTRIBUTION", value: "INTERNAL" }
      ],
      body: [
        "...the Department is established to evaluate behavioral and cognitive responses to controlled digital environments under naturalistic conditions, wherein the subject's awareness of observation is, where permitted under internal protocol, not a precondition of the evaluation.",
        "Environments are to be presented to candidates through ordinary distribution channels such that no distinction is perceptible between a standard environment and one prepared for study.",
        "Sections IV through IX of this document have been withheld from this excerpt pending declassification review."
      ],
      media: null,
      accessLog: [
        { date: "2019-02-11 09:00", user: "SYSTEM", action: "RECORD CREATED" },
        { date: "2021-06-04 14:22", user: "OPERATOR_01", action: "VIEWED" },
        { date: "2024-11-03 08:15", user: "OPERATOR_04", action: "VIEWED" }
      ],
      hidden: false
    },
    {
      id: "0871",
      subject: "[REDACTED]",
      title: "Prior Candidate — Closeout",
      classification: "CLASSIFIED",
      status: "REDACTED",
      dateLogged: "2022-08-30",
      dateRecorded: "2022-08-30",
      operator: "[REDACTED]",
      tags: ["closeout", "prior-program"],
      summary: "█████████████████████████████████████████████████",
      fields: [
        { label: "OUTCOME", value: "[REDACTED]" },
        { label: "FOLLOW-UP REQUIRED", value: "[REDACTED]" },
        { label: "CANDIDATE STATUS", value: "[REDACTED]" }
      ],
      body: [
        "████████████ ███████████████ ██████ ████████████████████ ███████████.",
        "████ ██████████████████████████████████████████████████████████████ ███████.",
        "PROGRAM CONTINUED UNDER REVISED PROTOCOL."
      ],
      media: null,
      accessLog: [
        { date: "2022-08-30 00:00", user: "SYSTEM", action: "RECORD SEALED" },
        { date: "2024-11-02 23:58", user: "OPERATOR_04", action: "VIEWED" }
      ],
      hidden: false
    },
    {
      id: "1142",
      subject: "[REDACTED]",
      title: "Candidate Pool — Batch 3",
      classification: "CLASSIFIED",
      status: "ARCHIVED",
      dateLogged: "2024-09-17",
      dateRecorded: "2024-09-17",
      operator: "OPERATOR_02",
      tags: ["candidate-pool", "selection"],
      summary: "Shortlist of candidates evaluated for compatibility with test environment WORLD-TEST-01.",
      fields: [
        { label: "POOL SIZE", value: "██" },
        { label: "SELECTION CRITERIA", value: "[REDACTED]" },
        { label: "FINAL SELECTION", value: "1 CANDIDATE" }
      ],
      body: [
        "Candidates considered for Batch 3 delivery, ranked by compatibility score. Names below are retained per retention policy 4.1.",
        "████████████████ — DISQUALIFIED",
        "████████ ████████ — DISQUALIFIED",
        "CARDB0ARD_D4WN — SELECTED",
        "████████████ — DISQUALIFIED (backup pool)",
        "Rationale for selection withheld. See Record 1150 for pre-contact profile and Record 1151 for the flagging event that initiated this review."
      ],
      media: null,
      accessLog: [
        { date: "2024-09-17 11:04", user: "OPERATOR_02", action: "RECORD CREATED" },
        { date: "2024-09-18 09:41", user: "OPERATOR_04", action: "VIEWED" },
        { date: "2024-11-01 19:12", user: "OPERATOR_04", action: "VIEWED" }
      ],
      hidden: false
    },
    {
      id: "1150",
      subject: "Cardb0ard_D4wn",
      title: "Pre-Contact Profile",
      classification: "RESTRICTED",
      status: "ACTIVE",
      dateLogged: "2024-09-20",
      dateRecorded: "2024-09-20",
      operator: "OPERATOR_02",
      tags: ["profile", "pre-contact", "surveillance"],
      summary: "Compiled public activity profile assembled prior to initial contact. Subject was not made aware of this compilation.",
      fields: [
        { label: "PLATFORM", value: "MINECRAFT: JAVA EDITION" },
        { label: "ACCOUNT AGE", value: "~3 YEARS" },
        { label: "ACTIVITY PATTERN", value: "SOLO / SMALL SERVERS" },
        { label: "SOCIAL EXPOSURE", value: "LOW" },
        { label: "SUITABILITY SCORE", value: "0.91" }
      ],
      body: [
        "Subject exhibits low social exposure and infrequent public streaming activity, reducing likelihood of third-party observation during test window.",
        "Subject has expressed, across public posts, a preference for exploration-focused and 'mystery' style content. This preference informed environment design (see WORLD-TEST-01 specification, withheld from this record).",
        "Compilation of this profile began five days after an unprovisioned anomaly involving the subject was flagged for review (see Record 1151).",
        "No indication subject is aware of this profile or its purpose."
      ],
      media: null,
      accessLog: [
        { date: "2024-09-20 10:30", user: "OPERATOR_02", action: "RECORD CREATED" },
        { date: "2024-11-03 08:16", user: "OPERATOR_04", action: "VIEWED" }
      ],
      hidden: false
    },
    {
      id: "1151",
      subject: "Cardb0ard_D4wn",
      title: "First Contact — Disc Eleven (Unmonitored)",
      classification: "CLASSIFIED",
      status: "ARCHIVED",
      dateLogged: "2024-09-12",
      dateRecorded: "2024-09-10",
      operator: "SYSTEM",
      tags: ["first-contact", "anomaly", "unmonitored", "trigger-event"],
      summary: "Anomaly detected in an environment not provisioned by this department. Subject was not known to this department prior to this event.",
      fields: [
        { label: "EVENT TYPE", value: "UNPROVISIONED ANOMALY" },
        { label: "DETECTION METHOD", value: "[REDACTED]" },
        { label: "WORLD SOURCE", value: "SUBJECT-OWNED — NOT D.A.D. ISSUED" },
        { label: "OUTCOME", value: "SUBJECT ADDED TO CANDIDATE POOL, SEE RECORD 1142" }
      ],
      body: [
        "Subject, playing in a self-hosted environment with no departmental involvement, located a music disc and a jukebox structure. Neither item was placed by this department, and this department had no presence in this environment.",
        "Subject played the disc for approximately 00:03:12 before it ceased to exist within the world's save data. No removal action was taken by the subject or any other player present. The jukebox itself was undamaged and remained in place.",
        "Detection of this event did not occur through direct monitoring of the subject; this department had no record of the subject's existence prior to this event (see DETECTION METHOD, withheld).",
        "Subject was added to the candidate pool for Batch 3 five days later. See Record 1142."
      ],
      media: null,
      accessLog: [
        { date: "2024-09-10 03:41", user: "SYSTEM", action: "ANOMALY AUTO-FLAGGED" },
        { date: "2024-09-12 09:02", user: "OPERATOR_02", action: "RECORD CREATED" },
        { date: "2024-11-03 08:10", user: "OPERATOR_04", action: "VIEWED" }
      ],
      hidden: false
    },
    {
      id: "1152",
      subject: "[REDACTED]",
      title: "Disc Eleven — Recovered Statement",
      classification: "CLASSIFIED",
      status: "CORRUPTED",
      dateLogged: "2021-03-02",
      dateRecorded: "2021-03-02",
      operator: "[REDACTED]",
      tags: ["disc-eleven", "recovered-audio", "source-statement"],
      summary: "[PARTIAL RECOVERY] Transcript recovered from a statement given by the individual credited with the first documented recording of the track catalogued as DISC-11.",
      fields: [
        { label: "SOURCE", value: "AUDIO STATEMENT (TRANSCRIBED)" },
        { label: "SUBJECT STATUS", value: "[REDACTED]" },
        { label: "RECOVERY", value: "PARTIAL — 18%" }
      ],
      body: [
        "...I wasn't trying to record over it, I just wanted to hear it again, and it—",
        "██████████████████████████████████████████████████████",
        "...it isn't a sound. It's not supposed to be a sound. If you play it all the way through, you—",
        "██████████████████████████████████████████████████████",
        "I've stopped calling it eleven. I don't think that's what it's called where it comes from."
      ],
      media: null,
      accessLog: [
        { date: "2021-03-02 00:00", user: "SYSTEM", action: "STATEMENT ARCHIVED" },
        { date: "2024-11-03 08:11", user: "OPERATOR_04", action: "VIEWED — CROSS-REFERENCED WITH RECORD 1156" }
      ],
      hidden: false
    },
    {
      id: "1153",
      subject: "N/A",
      title: "Disc Twelve — Withdrawal Notice",
      classification: "CLASSIFIED",
      status: "ARCHIVED",
      dateLogged: "2020-11-01",
      dateRecorded: "2020-11-01",
      operator: "[REDACTED]",
      tags: ["disc-twelve", "withdrawal", "distribution"],
      summary: "Administrative notice — track withdrawn from circulation.",
      fields: [
        { label: "ACTION", value: "WITHDRAWAL" },
        { label: "SCOPE", value: "ALL KNOWN DISTRIBUTION CHANNELS" },
        { label: "REASON", value: "[REDACTED]" }
      ],
      body: [
        "Track catalogued as DISC-12 is to be withdrawn from all distributed builds effective immediately.",
        "Field copies located during retrieval operations are to be purged on discovery, not archived.",
        "████████████████████████████████████████████████████████",
        "This notice supersedes all prior guidance regarding DISC-12. Questions should be directed to [REDACTED]."
      ],
      media: null,
      accessLog: [
        { date: "2020-11-01 00:00", user: "SYSTEM", action: "NOTICE ISSUED" }
      ],
      hidden: false
    },
    {
      id: "1154",
      subject: "N/A",
      title: "Disc Thirteen — Substitution Log",
      classification: "CLASSIFIED",
      status: "ARCHIVED",
      dateLogged: "2020-11-02",
      dateRecorded: "2020-11-02",
      operator: "[REDACTED]",
      tags: ["disc-thirteen", "substitution"],
      summary: "Original composition replaced with an alternate track prior to redistribution.",
      fields: [
        { label: "ACTION", value: "SUBSTITUTION" },
        { label: "ORIGINAL TRACK", value: "[REDACTED]" },
        { label: "REPLACEMENT TRACK", value: "COMMISSIONED — SEE ASSET 13-B" }
      ],
      body: [
        "Original track catalogued as DISC-13 has been replaced with an alternate composition in all builds distributed after this date.",
        "Subjects exposed to both versions report no perceptual discrepancy unless directly comparing the replacement against an archived reference recording.",
        "No further action required unless a subject requests the original by name. See escalation protocol 4."
      ],
      media: null,
      accessLog: [
        { date: "2020-11-02 00:00", user: "SYSTEM", action: "LOG CREATED" }
      ],
      hidden: false
    },
    {
      id: "1155",
      subject: "N/A",
      title: "Selection Criteria — Retrieval Candidates",
      classification: "CLASSIFIED",
      status: "ACTIVE",
      dateLogged: "2022-01-10",
      dateRecorded: "2022-01-10",
      operator: "[REDACTED]",
      tags: ["selection-criteria", "protocol", "candidates"],
      summary: "Standing criteria for selecting field candidates for disc retrieval assignments.",
      fields: [
        { label: "PRIMARY CRITERION", value: "ZERO VERIFIED PRIOR EXPOSURE TO TARGET PLATFORM" },
        { label: "DELIVERY DIFFICULTY", value: "PEACEFUL — NO HOSTILE ENTITY INTERFERENCE" },
        { label: "STARTER PROVISION", value: "STANDARD KIT — SEE APPENDIX" },
        { label: "EXCLUSION", value: "EXPERIENCED PLAYERS, STREAMERS, COMMUNITY-AFFILIATED ACCOUNTS" }
      ],
      body: [
        "Candidates with prior experience on the target platform are excluded from retrieval assignments. Experienced users consistently identify pre-placed content and world modifications within the first session, compromising the assignment.",
        "Preferred candidates have no verified account history prior to selection. Naive users attribute anomalies to personal error or coincidence rather than external modification, extending the usable window of an assignment.",
        "Standard delivery protocol sets the environment to peaceful difficulty to remove hostile-entity interference as a variable, and provisions a starter kit to minimize time spent on unrelated survival tasks before the subject reaches planted content.",
        "This protocol has been in effect since [REDACTED] and has not required revision."
      ],
      media: null,
      accessLog: [
        { date: "2022-01-10 00:00", user: "SYSTEM", action: "PROTOCOL FILED" },
        { date: "2024-09-17 10:40", user: "OPERATOR_02", action: "REFERENCED — SEE RECORD 1142" }
      ],
      hidden: false
    },
    {
      id: "1156",
      subject: "Cardb0ard_D4wn",
      title: "First Encounter",
      classification: "RESTRICTED",
      status: "ACTIVE",
      dateLogged: "2024-11-03",
      dateRecorded: "2024-11-03",
      operator: "D.A.D. — Field Unit 4",
      tags: ["baseline", "candidate-response", "world-test-01", "ingested-footage"],
      summary: "Automated capture of subject's initial session inside test environment WORLD-TEST-01. Subject shows no indication of awareness that the environment was modified prior to delivery.",
      fields: [
        { label: "DELIVERY METHOD", value: "[REDACTED]" },
        { label: "WORLD SEED ORIGIN", value: "[REDACTED]" },
        { label: "SUBJECT AWARENESS", value: "NEGATIVE" },
        { label: "SESSION DURATION", value: "01:42:17" },
        { label: "CAPTURE METHOD", value: "AUTOMATIC — CLIENT-SIDE CAPTURE MODULE" },
        { label: "AUDIO ANOMALY", value: "UNRESOLVED — SEE BODY" },
        { label: "DISC STATUS", value: "DESTROYED (JUKEBOX BROKEN BY SUBJECT, 00:04:01)" },
        { label: "SUBJECT MEMORY OF EVENT", value: "NEGATIVE (queried informally in later session)" },
        { label: "RELATED RECORDS", value: "1142, 1150, 1151, 1155, 1157, 1158" }
      ],
      body: [
        "Subject received the prepared world through a channel indistinguishable, from the subject's perspective, from an ordinary file transfer. No confirmation of receipt was requested or given.",
        "Session capture began automatically upon world load. Subject proceeded to explore the immediate spawn area for approximately eleven minutes before locating a pre-placed jukebox and a single music disc, neither of which the subject had brought into the world (see WORLD-TEST-01 build manifest, withheld from this record).",
        "Subject inserted the disc without hesitation and activated the jukebox. Playback matched the reference waveform logged for DISC-11 for the first 00:03:12 of runtime.",
        "At 00:03:13, output diverged from the DISC-11 reference and began matching an unlisted track internally logged as ELEVEN. Subject paused and reopened chat; the subject's own chat log shows no message sent at this timestamp. The session overlay recorded the string RECORDING SYNCHRONIZED at the same timestamp. This string could not be attributed to the client, the disc file, or any operator action (see access log).",
        "Track volume increased over the following seconds with no corresponding change to any in-game or client setting. At 00:04:01, subject struck the jukebox, destroying it and ending playback. Subject did not attempt to recover the disc.",
        "Subject's reaction upon locating the jukebox has been flagged for behavioral review (see OP-NOTE-1163, access restricted).",
        "No corrective action was necessary during this session. Environment integrity held for full duration. The anomalous audio segment has been retained for analysis; see AUDIO ANOMALY."
      ],
      media: { status: "linked", caption: "Session capture — 01:42:17 — auto-ingested, unedited" },
      accessLog: [
        { date: "2024-11-02 22:47", user: "SYSTEM", action: "PRE-STAGED — AWAITING SESSION START" },
        { date: "2024-11-03 08:12", user: "SYSTEM", action: "CAPTURE INGESTED" },
        { date: "2024-11-03 08:13", user: "SYSTEM", action: "AUDIO ANOMALY FLAGGED — DISC-11 DIVERGED TO ELEVEN AT 00:03:13" },
        { date: "2024-11-03 08:13", user: "SYSTEM", action: "STRING LOGGED: \"RECORDING SYNCHRONIZED\" — SOURCE UNKNOWN" },
        { date: "2024-11-03 08:15", user: "OPERATOR_04", action: "VIEWED" },
        { date: "2024-11-03 08:19", user: "OPERATOR_04", action: "NOTE ADDED — see OP-NOTE-1163" }
      ],
      hidden: false
    },
    {
      id: "1157",
      subject: "Cardb0ard_D4wn",
      title: "Second Session",
      classification: "RESTRICTED",
      status: "CORRUPTED",
      dateLogged: "2024-11-09",
      dateRecorded: "2024-11-09",
      operator: "D.A.D. — Field Unit 4",
      tags: ["candidate-response", "world-test-01", "corrupted"],
      summary: "[PARTIAL RECOVERY] Capture file sustained damage during transfer. Recovered segments attached below.",
      fields: [
        { label: "SESSION DURATION", value: "██:██:██" },
        { label: "RECOVERY STATUS", value: "PARTIAL — 12% RECOVERED" },
        { label: "CAPTURE METHOD", value: "AUTOMATIC — CLIENT-SIDE CAPTURE MODULE" }
      ],
      body: [
        "[RECOVERED FRAGMENT 1] ...returned to the same coordinates without being directed to. A jukebox stood at the site again, though subject destroyed the original in the prior session and did not rebuild it. Subject appears to be comparing the structure to something, possibly a screenshot taken outside the sess—",
        "[SEGMENT UNREADABLE — 00:14:02 to 00:51:40]",
        "[RECOVERED FRAGMENT 2] ...began to suspect something was placed rather than generated. Subject said, aloud, \"this isn't natural,\" then quit without saving chat log. Recommend rev",
        "[FILE TRUNCATED]"
      ],
      media: null,
      accessLog: [
        { date: "2024-11-09 07:58", user: "SYSTEM", action: "CAPTURE INGESTED — INTEGRITY CHECK FAILED" },
        { date: "2024-11-09 08:40", user: "OPERATOR_04", action: "VIEWED" },
        { date: "2024-11-09 08:41", user: "OPERATOR_04", action: "RECOVERY ATTEMPTED" }
      ],
      hidden: false
    },
    {
      id: "1158",
      subject: "Cardb0ard_D4wn",
      title: "Assignment Directive — Full-Set Retrieval",
      classification: "CLASSIFIED",
      status: "ACTIVE",
      dateLogged: "2024-11-10",
      dateRecorded: "2024-11-10",
      operator: "[REDACTED]",
      tags: ["assignment", "full-set", "deviation-precursor"],
      summary: "Directive escalating subject's assignment scope beyond standard single-disc retrieval.",
      fields: [
        { label: "PRIOR SCOPE", value: "SINGLE-DISC RETRIEVAL (STANDARD)" },
        { label: "REVISED SCOPE", value: "FULL-SET RETRIEVAL — DISC 11 THROUGH DISC 13 INCLUSIVE" },
        { label: "AUTHORIZATION", value: "[REDACTED]" },
        { label: "RATIONALE", value: "SEE RECORD 1161 — ACCESS RESTRICTED" }
      ],
      body: [
        "Standard protocol limits a single candidate's assignment to one disc (see Record 1155). This directive revises subject Cardb0ard_D4wn's assignment to cover the complete numbered set.",
        "No other active candidate has been assigned full-set scope at this time.",
        "Field units are reminded that this deviation from standard protocol is not to be discussed with the subject under any circumstance.",
        "Full rationale for this directive is restricted; see Record 1161."
      ],
      media: null,
      accessLog: [
        { date: "2024-11-10 17:20", user: "[REDACTED]", action: "DIRECTIVE ISSUED" },
        { date: "2024-11-10 17:45", user: "OPERATOR_04", action: "VIEWED" },
        { date: "2024-11-12 12:00", user: "SYSTEM", action: "SEE RECORD 1161 — SEALED SAME DAY" }
      ],
      hidden: false
    },
    {
      id: "1161",
      subject: "Cardb0ard_D4wn",
      title: "Deviation Report",
      classification: "ADMIN ONLY",
      status: "ACCESS DENIED",
      dateLogged: "2024-11-12",
      dateRecorded: "2024-11-12",
      operator: "[REDACTED]",
      tags: ["deviation", "restricted"],
      summary: null,
      fields: [],
      body: [],
      media: null,
      accessLog: [
        { date: "2024-11-12 12:00", user: "SYSTEM", action: "RECORD SEALED — ADMIN CLEARANCE REQUIRED" }
      ],
      hidden: false
    },
    {
      id: "1163",
      subject: "Cardb0ard_D4wn",
      title: "Operator Notes — Unofficial",
      classification: "UNLOGGED",
      status: "UNOFFICIAL",
      dateLogged: "2024-11-03",
      dateRecorded: "2024-11-03",
      operator: "OPERATOR_04",
      tags: ["personal", "unofficial", "not-for-file"],
      summary: "Personal note, not part of the formal record. Retained by mistake during archive migration.",
      fields: [
        { label: "FILED UNDER", value: "N/A — SHOULD NOT BE HERE" }
      ],
      body: [
        "He said 'thank you' out loud when he found the second structure. Not to anyone in the game. Just said it, to the room.",
        "The chat log said 'RECORDING SYNCHRONIZED.' Nobody on this team typed that. I checked twice, then I stopped checking because I didn't want an answer.",
        "I keep telling myself this is a baseline session like any other. I don't fully believe that anymore.",
        "Deleting this from my drafts folder. Not deleting it from here yet."
      ],
      media: null,
      accessLog: [
        { date: "2024-11-03 08:19", user: "OPERATOR_04", action: "CREATED — PERSONAL DRAFT" },
        { date: "2024-11-04 02:03", user: "OPERATOR_04", action: "MODIFIED" }
      ],
      hidden: true
    }
  ];

  function readOverrides() {
    try {
      var raw = global.localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { records: {}, deleted: [] };
    } catch (e) {
      return { records: {}, deleted: [] };
    }
  }

  function writeOverrides(data) {
    try {
      global.localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) {
      /* storage unavailable — admin edits will not persist */
    }
  }

  function cloneRecord(r) {
    return JSON.parse(JSON.stringify(r));
  }

  function mergeAll() {
    var overrides = readOverrides();
    var byId = {};
    SEED_RECORDS.forEach(function (r) {
      byId[r.id] = cloneRecord(r);
    });
    Object.keys(overrides.records || {}).forEach(function (id) {
      var ov = overrides.records[id];
      byId[id] = Object.assign({}, byId[id] || {}, ov);
    });
    (overrides.deleted || []).forEach(function (id) {
      delete byId[id];
    });
    return Object.keys(byId)
      .map(function (id) { return byId[id]; })
      .sort(function (a, b) { return a.id.localeCompare(b.id); });
  }

  var Store = {
    getAllRecords: function () {
      return mergeAll();
    },
    getVisibleRecords: function () {
      return mergeAll().filter(function (r) { return !r.hidden; });
    },
    getRecord: function (id) {
      return mergeAll().filter(function (r) { return r.id === id; })[0] || null;
    },
    saveRecord: function (record) {
      var overrides = readOverrides();
      overrides.records = overrides.records || {};
      overrides.records[record.id] = record;
      overrides.deleted = (overrides.deleted || []).filter(function (id) { return id !== record.id; });
      writeOverrides(overrides);
    },
    deleteRecord: function (id) {
      var overrides = readOverrides();
      overrides.deleted = overrides.deleted || [];
      if (overrides.deleted.indexOf(id) === -1) overrides.deleted.push(id);
      if (overrides.records) delete overrides.records[id];
      writeOverrides(overrides);
    },
    isSeedRecord: function (id) {
      return SEED_RECORDS.some(function (r) { return r.id === id; });
    },
    resetOverrides: function () {
      try { global.localStorage.removeItem(LS_KEY); } catch (e) { /* noop */ }
    }
  };

  // --- Media (video) storage via IndexedDB ---
  var dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!global.indexedDB) { reject(new Error("indexedDB unavailable")); return; }
      var req = global.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(DB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  Store.media = {
    put: function (id, file) {
      return openDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(DB_STORE, "readwrite");
          tx.objectStore(DB_STORE).put({ blob: file, type: file.type, name: file.name, ts: Date.now() }, id);
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error); };
        });
      });
    },
    get: function (id) {
      return openDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(DB_STORE, "readonly");
          var req = tx.objectStore(DB_STORE).get(id);
          req.onsuccess = function () { resolve(req.result || null); };
          req.onerror = function () { reject(req.error); };
        });
      });
    },
    remove: function (id) {
      return openDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(DB_STORE, "readwrite");
          tx.objectStore(DB_STORE).delete(id);
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error); };
        });
      });
    },
    getUrl: function (id) {
      return Store.media.get(id).then(function (entry) {
        if (!entry || !entry.blob) return null;
        return URL.createObjectURL(entry.blob);
      }).catch(function () { return null; });
    }
  };

  global.DADStore = Store;
})(window);
