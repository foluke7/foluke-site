// Whole Person Check-In: saves answers in this browser only, and builds summaries.
(function () {
  "use strict";
  var PREFIX = "wpc:";

  function get(key) {
    try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, value); return true; } catch (e) { return false; }
  }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var statusTimer;
  function status(msg) {
    $all(".save-status").forEach(function (s) { s.textContent = msg; });
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { $all(".save-status").forEach(function (s) { s.textContent = ""; }); }, 2500);
  }
  function saved(ok) { status(ok ? "Saved on this device" : "Couldn't save on this device. Copy your answers to keep them."); }

  // ---- Text fields and checkboxes ----
  $all("[data-save]").forEach(function (el) {
    var key = el.dataset.save, v = get(key), isBox = el.type === "checkbox";
    if (v !== null) { if (isBox) el.checked = v === "true"; else el.value = v; }
    el.addEventListener(isBox ? "change" : "input", function () {
      saved(set(key, isBox ? el.checked : el.value));
      refresh();
    });
  });

  // ---- 1 to 5 ratings ----
  function paintRating(group) {
    var v = get(group.dataset.rating), cmp = group.dataset.compare ? get(group.dataset.compare) : null;
    $all("button", group).forEach(function (b) {
      var on = b.value === v;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on || (!v && b.value === "1") ? 0 : -1;
      b.classList.toggle("was", cmp !== null && b.value === cmp);
      if (cmp !== null && b.value === cmp) b.title = "Your before-class answer"; else b.removeAttribute("title");
    });
  }
  $all("[data-rating]").forEach(function (group) {
    paintRating(group);
    group.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var key = group.dataset.rating;
      saved(get(key) === b.value ? set(key, "") : set(key, b.value)); // tap again to clear
      refresh();
    });
    group.addEventListener("keydown", function (e) {
      var dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (!dir) return;
      e.preventDefault();
      var cur = parseInt(get(group.dataset.rating) || "0", 10), next = Math.min(5, Math.max(1, (cur || (dir > 0 ? 0 : 6)) + dir));
      saved(set(group.dataset.rating, String(next))); refresh();
      group.querySelector('button[value="' + next + '"]').focus();
    });
  });

  // ---- Habit tracker day names (from the class date) ----
  var article = document.querySelector("[data-start-date]");
  if (article) {
    var p = article.dataset.startDate.split("-"), start = new Date(+p[0], +p[1] - 1, +p[2]);
    $all("[data-day-offset]").forEach(function (el) {
      var d = new Date(start); d.setDate(d.getDate() + parseInt(el.dataset.dayOffset, 10));
      el.innerHTML = "<b>" + d.toLocaleDateString(undefined, { weekday: "short" }) + "</b>" + d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    });
  }

  // ---- Remember open/closed optional sections ----
  $all("details[data-remember]").forEach(function (d) {
    if (get(d.dataset.remember) === "true") d.open = true;
    d.addEventListener("toggle", function () { set(d.dataset.remember, d.open); });
  });

  function num(k) { var v = get(k); return v ? parseInt(v, 10) : null; }
  function trackCount(prefix) { var c = 0; for (var i = 1; i <= 7; i++) if (get(prefix + "." + i) === "true") c++; return c; }

  // ---- Summary text of everything on the page ----
  function buildSummary() {
    var lines = [], head = document.querySelector(".checkin-head");
    if (head) lines.push(head.querySelector("h1").textContent.trim(), head.querySelector(".eyebrow").textContent.trim(), "");
    var section = null;
    $all("section").forEach(function (sec) {
      $all("[data-label]", sec).forEach(function (el) {
        var val;
        if (el.dataset.rating) val = get(el.dataset.rating);
        else if (el.dataset.tracker) { var n = trackCount(el.dataset.tracker); val = n ? n + " of 7 days" : ""; }
        else val = el.value;
        if (!val || !String(val).trim()) return;
        var h = sec.querySelector(".band h2");
        if (h && h !== section) { section = h; lines.push("— " + h.textContent.trim() + " —"); }
        lines.push(el.dataset.label + (el.dataset.rating ? ": " + val + " of 5" : el.dataset.tracker ? ": " + val : "\n" + String(val).trim()));
      });
    });
    return lines.join("\n").trim();
  }

  // ---- Refresh computed parts ----
  function refresh() {
    $all("[data-rating]").forEach(paintRating);

    $all("[data-change-row]").forEach(function (row) {
      var b = num(row.dataset.before), a = num(row.dataset.after), d = row.querySelector(".d");
      row.querySelector(".b").textContent = b || "–";
      row.querySelector(".a").textContent = a || "–";
      d.className = "d";
      if (b && a) {
        var diff = a - b;
        d.textContent = diff > 0 ? "+" + diff + " ↑" : diff < 0 ? diff + " ↓" : "Same";
        d.classList.add(diff > 0 ? "up" : diff < 0 ? "down" : "same");
      } else d.textContent = "–";
    });

    $all("[data-tracker-count]").forEach(function (el) {
      var n = trackCount(el.dataset.trackerCount);
      el.textContent = n === 0 ? "" : n === 7 ? "7 of 7 days. Wonderful consistency!" : n + " of 7 days so far. Every one counts.";
    });

    $all("[data-progress]").forEach(function (el) {
      var w = el.dataset.progress, started = false;
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k.indexOf(PREFIX + w + ".") === 0 && localStorage.getItem(k) && localStorage.getItem(k) !== "false") { started = true; break; }
        }
      } catch (e) {}
      var n = trackCount(w + ".track");
      el.textContent = started ? (n ? "Started · habit " + n + "/7" : "Started") : "";
    });

    var summary = document.querySelector("textarea.summary");
    if (summary) summary.value = buildSummary() || "Your answers will appear here as you fill in the check-in.";

    var mail = document.querySelector("[data-action='email']");
    if (mail) {
      var base = mail.getAttribute("href").split("?")[0], title = document.querySelector(".checkin-head h1").textContent.trim();
      var body = buildSummary(); if (body.length > 1800) body = body.slice(0, 1800) + "\n…";
      mail.href = base + "?subject=" + encodeURIComponent("My check-in: " + title) + "&body=" + encodeURIComponent(body);
    }

    renderJourney();
  }

  // ---- My Journey page ----
  function renderJourney() {
    var dataEl = document.getElementById("series-data"); if (!dataEl) return;
    var weeks = JSON.parse(dataEl.textContent), table = document.getElementById("journey-ratings");
    var areas = [];
    weeks.forEach(function (wk) { wk.ratings.forEach(function (r) { if (!areas.some(function (a) { return a.key === r.key; })) areas.push(r); }); });
    var html = "<thead><tr><th>Area</th>" + weeks.map(function (wk) { return '<th><a href="' + wk.url + '">Wk ' + wk.week + "</a></th>"; }).join("") + "</tr></thead><tbody>";
    areas.forEach(function (a) {
      html += '<tr><th scope="row">' + a.label + "</th>" + weeks.map(function (wk) {
        var has = wk.ratings.some(function (r) { return r.key === a.key; });
        var v = has ? num("w" + wk.week + ".after." + a.key) : null;
        return '<td class="' + (has ? "" : "na") + '">' + (v ? '<span class="dot l' + v + '">' + v + "</span>" : has ? "–" : "") + "</td>";
      }).join("") + "</tr>";
    });
    table.innerHTML = html + "</tbody>";

    var box = document.getElementById("journey-weeks");
    box.innerHTML = weeks.map(function (wk) {
      var w = "w" + wk.week, n = trackCount(w + ".track");
      function row(label, key) { var v = get(w + "." + key); return v && v.trim() ? "<dt>" + label + "</dt><dd>" + esc(v) + "</dd>" : ""; }
      var body = row("My challenge", "challenge") + row("A win", "win") + row("Something hard", "hard") + row("Home, family, work", "life");
      return '<div class="card journey-week"><h3><a href="' + wk.url + '">Week ' + wk.week + ": " + esc(wk.title) + "</a></h3>" +
        '<p class="hint">' + esc(wk.habit) + ": " + n + " of 7 days</p>" + (body ? "<dl>" + body + "</dl>" : '<p class="hint">Nothing written yet.</p>') + "</div>";
    }).join("");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---- Buttons ----
  $all("[data-action='print']").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });

  $all("[data-action='copy']").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = buildSummary();
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { status("Copied. Paste it into a text, email, or notes."); }, fallback);
      else fallback();
      function fallback() { var t = document.querySelector("textarea.summary"); t.focus(); t.select(); status("Selected. Press copy on your device."); }
    });
  });

  $all("[data-action='share']").forEach(function (b) {
    b.addEventListener("click", function () {
      var name = document.querySelector("[data-save='profile.name']");
      var fd = new FormData();
      if (b.dataset.entryName) fd.append(b.dataset.entryName, name ? name.value : "");
      if (b.dataset.entryWeek) fd.append(b.dataset.entryWeek, b.dataset.weekTitle);
      fd.append(b.dataset.entryAnswers, buildSummary());
      b.disabled = true; b.textContent = "Sending…";
      fetch(b.dataset.form, { method: "POST", mode: "no-cors", body: fd })
        .then(function () { b.textContent = "Sent. Thank you!"; status("Shared with Foluke."); })
        .catch(function () { b.disabled = false; b.textContent = "Send to Foluke"; status("Couldn't send. Check your connection and try again."); });
    });
  });

  refresh();
})();
