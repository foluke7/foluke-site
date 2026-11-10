// What's Your SHINE Style? Runs entirely in this browser; answers are not sent anywhere.
(function () {
  "use strict";
  var root = document.getElementById("quiz"); if (!root) return;
  var HOME = root.dataset.home, CHECKIN = root.dataset.checkin;

  // Each answer counts toward one style: M = Mover, R = Restorer, C = Connector, F = Reflector.
  var QUESTIONS = [
    { q: "It's a free Saturday morning. What sounds best?", a: [
      ["A dance or workout class to get my blood pumping", "M"],
      ["Sleeping in, then a slow breakfast with nowhere to be", "R"],
      ["Brunch or a long phone call with my people", "C"],
      ["Quiet time with my Bible, journal, and a warm drink", "F"] ] },
    { q: "When stress builds up, how does it show up for you?", a: [
      ["I get restless and fidgety. I need to move it out.", "M"],
      ["I'm tired all the way down to my bones", "R"],
      ["I feel alone, like nobody gets what I'm carrying", "C"],
      ["My mind won't stop racing. I need to sort it out.", "F"] ] },
    { q: "Your favorite part of a class with Foluke?", a: [
      ["The workout. Make me sweat!", "M"],
      ["The stretching and breathing at the end", "R"],
      ["The laughs and the people", "C"],
      ["The reflection question that stays with me all week", "F"] ] },
    { q: "Your friends would describe you as…", a: [
      ["The energizer. Always on the go.", "M"],
      ["The calm one. Steady and gentle.", "R"],
      ["The glue. You keep everyone together.", "C"],
      ["The deep thinker. You ask the real questions.", "F"] ] },
    { q: "Pick a word for this season of your life.", a: [
      ["Strength", "M"],
      ["Rest", "R"],
      ["Belonging", "C"],
      ["Purpose", "F"] ] },
    { q: "At a weekend retreat, you'd be first in line for…", a: [
      ["Sunrise dance aerobics", "M"],
      ["A nap, a foot soak, and a quiet room", "R"],
      ["Late-night sister talks", "C"],
      ["A prayer walk and journaling by the water", "F"] ] },
    { q: "What do you need most right now?", a: [
      ["More energy", "M"],
      ["Permission to slow down", "R"],
      ["People who understand", "C"],
      ["Clarity about what's next", "F"] ] },
    { q: "Pick a treat.", a: [
      ["A fresh green smoothie", "M"],
      ["A cup of herbal tea", "R"],
      ["A plate from the church potluck", "C"],
      ["Sliced fruit and a good book", "F"] ] }
  ];

  var RESULTS = {
    M: { emoji: "🔥", name: "The Mover", tag: "You come alive when your body is moving.",
      body: "Movement is how you clear your head, lift your mood, and feel like yourself again. You don't just exercise; you celebrate what your body can do. Your gift is energy, and it's contagious.",
      watch: "You can push past your limits. Remember that rest is part of training, not the opposite of it.",
      step: "Move for 10 minutes on 3 days this week, and notice how your mood shifts afterward.",
      cta: ["Join a K2K Fit class", HOME + "#services"] },
    R: { emoji: "🌿", name: "The Restorer", tag: "You heal by slowing down.",
      body: "You've been pouring out for a long time, and your body and spirit are asking for a reset. You thrive with gentle rhythms: stretching, breathing, sleep, and quiet. Rest isn't lazy. It's faithful stewardship.",
      watch: "You may wait until you're empty to stop. Build rest in before you need it.",
      step: "Pick one evening this week to put your phone away an hour before bed.",
      cta: ["Try the SHINE 7-Day Reset Journal", HOME + "#shop"] },
    C: { emoji: "🤝", name: "The Connector", tag: "You grow best together.",
      body: "You're the one who checks on everyone, and you feel most whole in community. Laughter, honest talk, and people who get it are your medicine. You were never meant to carry it all alone.",
      watch: "You can take care of everyone except yourself. Let people pour back into you.",
      step: "Text one friend this week and invite her to move, walk, or pray with you.",
      cta: ["Join the RECONNECT circle", HOME + "#services"] },
    F: { emoji: "✨", name: "The Reflector", tag: "You need space to think, pray, and make meaning.",
      body: "You process life on the inside. Journaling, Scripture, and honest questions help you find your footing. When you understand why, you can take the next step with peace.",
      watch: "You can stay in your head. Let your body and your people be part of the healing too.",
      step: "Use the Weekly Check-In before and after class to notice what's changing.",
      cta: ["Start the Weekly Check-In", CHECKIN] }
  };
  var ORDER = ["M", "R", "C", "F"];

  var screens = {}, answers = [], i = 0;
  Array.prototype.forEach.call(root.querySelectorAll("[data-screen]"), function (s) { screens[s.dataset.screen] = s; });
  var optBox = root.querySelector("[data-options]"), next = root.querySelector("[data-next]"), back = root.querySelector("[data-back]");

  function show(name) { Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; }); window.scrollTo(0, 0); }

  function renderQuestion() {
    var item = QUESTIONS[i];
    root.querySelector("[data-count]").textContent = String(i + 1).padStart(2, "0") + " / " + String(QUESTIONS.length).padStart(2, "0");
    root.querySelector("[data-progress]").innerHTML = QUESTIONS.map(function (_, n) { return '<i class="' + (n < i ? "done" : n === i ? "now" : "") + '"></i>'; }).join("");
    document.getElementById("q-text").innerHTML = "<b>" + (i + 1) + "</b>" + item.q;
    optBox.innerHTML = item.a.map(function (opt, n) {
      var on = answers[i] === n;
      return '<button type="button" class="option" role="radio" aria-checked="' + on + '" tabindex="' + (on || (answers[i] === undefined && n === 0) ? 0 : -1) + '" data-n="' + n + '"><span class="letter">' + "ABCD"[n] + "</span><span>" + opt[0] + "</span></button>";
    }).join("");
    next.disabled = answers[i] === undefined;
    next.textContent = i === QUESTIONS.length - 1 ? "See my style →" : "Next →";
    back.disabled = i === 0;
  }

  function choose(n) {
    answers[i] = n; renderQuestion();
    optBox.querySelector('[data-n="' + n + '"]').focus();
  }

  optBox.addEventListener("click", function (e) {
    var b = e.target.closest(".option"); if (!b) return;
    choose(+b.dataset.n);
    setTimeout(function () { if (answers[i] === +b.dataset.n) go(1); }, 350); // move on after a tap
  });
  optBox.addEventListener("keydown", function (e) {
    var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault();
    var cur = answers[i] === undefined ? (d > 0 ? -1 : 4) : answers[i];
    choose((cur + d + 4) % 4);
  });

  function go(d) {
    if (d > 0 && answers[i] === undefined) return;
    i += d;
    if (i >= QUESTIONS.length) return finish();
    renderQuestion();
  }
  next.addEventListener("click", function () { go(1); });
  back.addEventListener("click", function () { if (i > 0) go(-1); });

  function finish() {
    var score = { M: 0, R: 0, C: 0, F: 0 };
    answers.forEach(function (n, q) { score[QUESTIONS[q].a[n][1]]++; });
    var top = Math.max.apply(null, ORDER.map(function (k) { return score[k]; }));
    var tied = ORDER.filter(function (k) { return score[k] === top; });
    var need = QUESTIONS[6].a[answers[6]][1]; // "What do you need most right now?" breaks ties
    var main = tied.indexOf(need) > -1 ? need : tied[0];
    var second = ORDER.filter(function (k) { return k !== main; }).sort(function (a, b) { return score[b] - score[a]; })[0];
    try { localStorage.setItem("shine:style", main); } catch (e) {}
    renderResult(main, score[second] > 0 ? second : null);
  }

  function renderResult(key, second) {
    var r = RESULTS[key], s = second && RESULTS[second];
    var parts = r.name.split(" ");
    screens.result.innerHTML =
      '<p class="quiz-eyebrow">Your SHINE style is</p>' +
      '<div class="result-badge" aria-hidden="true">' + r.emoji + "</div>" +
      '<h1 class="result-name">' + parts[0] + " <span>" + parts.slice(1).join(" ") + "</span></h1>" +
      '<p class="quiz-tag">' + r.tag + "</p>" +
      '<div class="result-body"><p>' + r.body + "</p>" +
      "<h3>Watch for</h3><p>" + r.watch + "</p>" +
      "<h3>Your small step this week</h3><p>" + r.step + "</p></div>" +
      (s ? '<p class="result-also">With a little bit of <strong>' + s.name + "</strong> " + s.emoji + " in you too.</p>" : "") +
      '<div class="result-actions">' +
        '<a class="btn primary" href="' + r.cta[1] + '">' + r.cta[0] + "</a>" +
        '<a class="btn ghost" href="' + HOME + '#community">Join the community</a>' +
        '<button type="button" class="btn ghost" data-share>Share the quiz</button>' +
        '<button type="button" class="btn ghost" data-again>Take it again</button>' +
      "</div>" +
      '<p class="result-also" data-share-status role="status" aria-live="polite"></p>';
    show("result"); screens.result.focus({ preventScroll: true });
  }

  screens.result.addEventListener("click", function (e) {
    if (e.target.closest("[data-again]")) { answers = []; i = 0; renderQuestion(); show("question"); }
    if (e.target.closest("[data-share]")) {
      var url = location.href.split("#")[0], msg = root.querySelector("[data-share-status]");
      var text = "What's your SHINE style? Take Foluke Arthurton's 2-minute quiz:";
      if (navigator.share) navigator.share({ title: "What's your SHINE style?", text: text, url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + url).then(function () { msg.textContent = "Link copied. Paste it to a friend!"; });
    }
  });

  root.querySelector("[data-start]").addEventListener("click", function () { renderQuestion(); show("question"); optBox.querySelector(".option").focus(); });
})();
