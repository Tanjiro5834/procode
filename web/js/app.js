// ProCode app shell — no framework, hand-rolled hash router + render functions.

let currentTopicTheme = null; // 'springboot' | 'php' | null

function $(sel, root = document) { return root.querySelector(sel); }
function el(tag, opts = {}, children = []) {
  const e = document.createElement(tag);
  if (opts.class) e.className = opts.class;
  if (opts.text) e.textContent = opts.text;
  if (opts.html) e.innerHTML = opts.html;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (opts.onClick) e.addEventListener("click", opts.onClick);
  children.forEach(c => c && e.appendChild(c));
  return e;
}

function applyTheme(themeName) {
  currentTopicTheme = themeName;
  document.body.classList.remove("theme-springboot", "theme-php", "theme-git");
  if (themeName === "springboot") document.body.classList.add("theme-springboot");
  if (themeName === "php") document.body.classList.add("theme-php");
  if (themeName === "git") document.body.classList.add("theme-git");
}

function showToast(message) {
  let toast = $("#toast");
  if (!toast) {
    toast = el("div", { class: "toast", attrs: { id: "toast" } });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- Landing ----------

function renderLanding() {
  applyTheme(null);
  document.body.innerHTML = "";
  const root = el("div", { class: "landing" });
  const card = el("div", { class: "landing-card" });

  card.appendChild(el("div", {
    class: "landing-mark",
    html: `Pro<span>Code</span><span class="p">.</span>`
  }));
  card.appendChild(el("p", { class: "landing-sub", text: "Learn Spring Boot and PHP by doing, at your own pace." }));

  const form = el("form", { class: "landing-form" });
  const label = el("label", { text: "What's your name?", attrs: { for: "name-input" } });
  const input = el("input", { attrs: { id: "name-input", type: "text", placeholder: "e.g. Nath", autocomplete: "off", maxlength: "40" } });
  const btn = el("button", { class: "btn-primary", text: "Start learning", attrs: { type: "submit" } });

  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(btn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    Store.setName(name);
    location.hash = "#/dashboard";
  });

  card.appendChild(form);
  root.appendChild(card);
  document.body.appendChild(root);
}

// ---------- App shell (sidebar + main) ----------

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "\u2302" },
  { id: "topics", label: "Topics", icon: "\u2318" },
  { id: "quizzes", label: "Quizzes", icon: "?" },
  { id: "progress", label: "Progress", icon: "\u25B2" },
  { id: "settings", label: "Settings", icon: "\u2699" },
  { id: "about", label: "About", icon: "i" }
];

function renderShell(activeId, contentEl) {
  document.body.innerHTML = "";
  if (Store.state.darkMode) document.body.classList.add("dark"); else document.body.classList.remove("dark");
  if (Store.state.readingMode) document.body.classList.add("reading-mode"); else document.body.classList.remove("reading-mode");
  if (Store.state.codeFont === "cascadia") document.body.classList.add("codefont-cascadia"); else document.body.classList.remove("codefont-cascadia");

  const shell = el("div", { class: "app-shell" });

  const hamburger = el("button", { class: "hamburger", attrs: { "aria-label": "Toggle menu" }, text: "\u2630" });
  const sidebar = el("aside", { class: "sidebar" });
  const scrim = el("div", { class: "sidebar-scrim" });

  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    scrim.style.display = sidebar.classList.contains("open") ? "block" : "none";
  });
  scrim.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.style.display = "none";
  });

  sidebar.appendChild(el("div", { class: "sidebar-brand", html: `Pro<span style="color:var(--accent)">Code</span>` }));

  const nav = el("ul", { class: "sidebar-nav" });
  NAV_ITEMS.forEach(item => {
    const btn = el("button", {
      class: item.id === activeId ? "active" : "",
      onClick: () => { location.hash = `#/${item.id}`; }
    });
    btn.appendChild(el("span", { class: "sidebar-icon", text: item.icon }));
    btn.appendChild(el("span", { text: item.label }));
    nav.appendChild(el("li", {}, [btn]));
  });
  sidebar.appendChild(nav);

  const info = Store.levelInfo();
  sidebar.appendChild(el("div", {
    class: "sidebar-footer",
    html: `Signed in as <strong>${escapeHtml(Store.state.name || "Student")}</strong><br>Level ${info.level} &middot; ${Store.state.streak} day streak`
  }));

  shell.appendChild(sidebar);
  shell.appendChild(scrim);

  const main = el("main", { class: "main" });
  main.appendChild(contentEl);
  shell.appendChild(main);

  document.body.appendChild(hamburger);
  document.body.appendChild(shell);
}

function topBar(title) {
  const info = Store.levelInfo();
  const bar = el("div", { class: "topbar" });
  bar.appendChild(el("h1", { text: title }));
  const stats = el("div", { class: "stat-row", attrs: { id: "topbar-stats" } });
  stats.appendChild(el("span", { class: "stat-pill", text: `${info.xp} XP` }));
  stats.appendChild(el("span", { class: "stat-pill", text: `\uD83D\uDD25 ${Store.state.streak}` }));
  stats.appendChild(el("span", { class: "stat-pill", text: `Lvl ${info.level}` }));
  bar.appendChild(stats);
  return bar;
}

function refreshTopBarStats() {
  const stats = document.getElementById("topbar-stats");
  if (!stats) return;
  const info = Store.levelInfo();
  stats.innerHTML = "";
  stats.appendChild(el("span", { class: "stat-pill", text: `${info.xp} XP` }));
  stats.appendChild(el("span", { class: "stat-pill", text: `\uD83D\uDD25 ${Store.state.streak}` }));
  stats.appendChild(el("span", { class: "stat-pill", text: `Lvl ${info.level}` }));
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// Splits lesson content on ``` fences into alternating prose/code segments
// and renders each with the appropriate element/font.
function renderLessonContent(rawContent) {
  const container = el("div", { class: "lesson-content" });
  const parts = rawContent.split("```");
  parts.forEach((part, i) => {
    const isCode = i % 2 === 1;
    const trimmed = part.replace(/^\n+|\n+$/g, "");
    if (!trimmed) return;
    if (isCode) {
      const pre = el("pre", { class: "code-block" });
      const code = el("code", { text: trimmed });
      pre.appendChild(code);
      container.appendChild(pre);
    } else {
      trimmed.split(/\n{2,}/).forEach(paragraph => {
        if (paragraph.trim()) container.appendChild(renderProseParagraph(paragraph.trim()));
      });
    }
  });
  return container;
}

// Renders a paragraph of prose, converting `inline code` spans (single
// backticks) into styled <code> elements. Anything outside backticks is
// plain text. This only affects paragraphs, never fenced ``` code blocks.
function renderProseParagraph(text) {
  const p = el("p");
  const segments = text.split(/(`[^`]+`)/g);
  segments.forEach(seg => {
    if (!seg) return;
    if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 1) {
      p.appendChild(el("code", { class: "inline-code", text: seg.slice(1, -1) }));
    } else {
      p.appendChild(document.createTextNode(seg));
    }
  });
  return p;
}

// ---------- Views ----------

function viewDashboard() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar(`Welcome back, ${Store.state.name || "there"}.`));

  const info = Store.levelInfo();
  const xpPanel = el("div", { class: "panel" });
  xpPanel.appendChild(el("h3", { text: "This level" }));
  xpPanel.appendChild(el("p", { text: `${info.xpIntoLevel} / ${info.xpForNextLevel} XP toward level ${info.level + 1}.` }));
  const barOuter = el("div", { attrs: { style: "background:var(--border);border-radius:999px;height:10px;overflow:hidden;" } });
  const barInner = el("div", { attrs: { style: `background:var(--accent);height:100%;width:${(info.xpIntoLevel / info.xpForNextLevel) * 100}%;` } });
  barOuter.appendChild(barInner);
  xpPanel.appendChild(barOuter);
  content.appendChild(xpPanel);

  const quickPanel = el("div", { class: "panel" });
  quickPanel.appendChild(el("h3", { text: "Continue learning" }));
  quickPanel.appendChild(el("p", { text: "Jump back into Spring Boot or PHP where you left off." }));
  const row = el("div", { class: "stat-row" });
  row.appendChild(el("button", { class: "btn-secondary", text: "Spring Boot", onClick: () => { location.hash = "#/topics/springboot"; } }));
  row.appendChild(el("button", { class: "btn-secondary", text: "PHP", onClick: () => { location.hash = "#/topics/php"; } }));
  quickPanel.appendChild(row);
  content.appendChild(quickPanel);

  renderShell("dashboard", content);
}

function viewTopics() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar("Topics"));
  const grid = el("div", { class: "topic-grid" });

  const springLocked = !Store.isSpringBootUnlocked();
  const springTile = el("button", {
    class: "topic-tile" + (springLocked ? " locked" : ""),
    onClick: () => { if (!springLocked) location.hash = "#/topics/springboot"; else location.hash = "#/quizzes/java-gate"; }
  });
  springTile.appendChild(el("h3", { text: CONTENT.topics.springboot.name + (springLocked ? " \uD83D\uDD12" : "") }));
  springTile.appendChild(el("p", { text: springLocked ? "Pass the Java Skills Check to unlock." : CONTENT.topics.springboot.description }));
  grid.appendChild(springTile);

  const phpTile = el("button", { class: "topic-tile", onClick: () => { location.hash = "#/topics/php"; } });
  phpTile.appendChild(el("h3", { text: CONTENT.topics.php.name }));
  phpTile.appendChild(el("p", { text: CONTENT.topics.php.description }));
  grid.appendChild(phpTile);

  if (CONTENT.topics.git) {
    const gitTile = el("button", { class: "topic-tile", onClick: () => { location.hash = "#/topics/git"; } });
    gitTile.appendChild(el("h3", { text: CONTENT.topics.git.name }));
    gitTile.appendChild(el("p", { text: CONTENT.topics.git.description }));
    grid.appendChild(gitTile);
  }

  const laravelTile = el("button", { class: "topic-tile locked" });
  laravelTile.appendChild(el("h3", { text: "Laravel \uD83D\uDD12" }));
  laravelTile.appendChild(el("p", { text: "Coming soon." }));
  grid.appendChild(laravelTile);

  content.appendChild(grid);
  renderShell("topics", content);
}

function viewTopicDetail(topicId) {
  if (topicId === "springboot" && !Store.isSpringBootUnlocked()) {
    location.hash = "#/quizzes/java-gate";
    return;
  }

  const topic = CONTENT.topics[topicId];
  if (!topic) { location.hash = "#/topics"; return; }
  applyTheme(topic.theme);

  const content = el("div");
  content.appendChild(topBar(topic.name));

  if (topic.lessons) {
    const list = el("div", { class: "lesson-list panel" });
    topic.lessons.forEach(lesson => {
      const done = Store.isLessonComplete(lesson.id);
      const row = el("div", { class: "lesson-row" });
      row.appendChild(el("span", { text: (done ? "\u2713 " : "") + lesson.title }));
      row.appendChild(el("button", { class: "btn-secondary", text: done ? "Review" : "Start", onClick: () => { location.hash = `#/lesson/${topicId}/${lesson.id}`; } }));
      list.appendChild(row);
    });
    content.appendChild(list);
  }

  if (topic.tiers) {
    Object.entries(topic.tiers).forEach(([tierKey, tier]) => {
      const block = el("div", { class: "tier-block panel" });
      block.appendChild(el("h3", { text: tier.label }));
      tier.lessons.forEach(lesson => {
        const done = Store.isLessonComplete(lesson.id);
        const row = el("div", { class: "lesson-row" });
        row.appendChild(el("span", { text: (done ? "\u2713 " : "") + lesson.title }));
        row.appendChild(el("button", { class: "btn-secondary", text: done ? "Review" : "Start", onClick: () => { location.hash = `#/lesson/${topicId}/${lesson.id}`; } }));
        block.appendChild(row);
      });
      content.appendChild(block);
    });
  }

  renderShell("topics", content);
}

function findLesson(topicId, lessonId) {
  const topic = CONTENT.topics[topicId];
  if (!topic) return null;
  if (topic.lessons) {
    const found = topic.lessons.find(l => l.id === lessonId);
    if (found) return found;
  }
  if (topic.tiers) {
    for (const tier of Object.values(topic.tiers)) {
      const found = tier.lessons.find(l => l.id === lessonId);
      if (found) return found;
    }
  }
  return null;
}

function viewLesson(topicId, lessonId) {
  const lesson = findLesson(topicId, lessonId);
  if (!lesson) { location.hash = `#/topics/${topicId}`; return; }
  applyTheme(CONTENT.topics[topicId].theme);

  const content = el("div");
  content.appendChild(topBar(lesson.title));

  const panel = el("div", { class: "panel" });
  panel.appendChild(renderLessonContent(lesson.content));

  const markBtn = el("button", {
    class: "btn-primary",
    text: Store.isLessonComplete(lesson.id) ? "Lesson complete" : "Mark as complete (+10 XP)",
    attrs: Store.isLessonComplete(lesson.id) ? { disabled: "true" } : {}
  });
  markBtn.addEventListener("click", () => {
    const result = Store.completeLesson(lesson.id);
    viewLesson(topicId, lessonId);
    if (result.leveledUp) showToast(`Level ${result.newLevel}! Keep going.`);
    else showToast("+10 XP");
  });
  panel.appendChild(markBtn);
  content.appendChild(panel);

  if (lesson.quiz) {
    const quizPanel = el("div", { class: "panel" });
    quizPanel.appendChild(el("h3", { text: "Check your understanding" }));
    quizPanel.appendChild(el("p", { text: `Quiz score: ${Math.round(Store.bestQuizScore(lesson.id) * 100)}%` }));
    quizPanel.appendChild(el("button", { class: "btn-secondary", text: "Take quiz", onClick: () => { location.hash = `#/quizzes/lesson/${topicId}/${lessonId}`; } }));
    content.appendChild(quizPanel);
  }

  renderShell("topics", content);
}

function renderQuizRunner(quizId, questions, passThreshold, onComplete, title) {
  const content = el("div");
  content.appendChild(topBar(title));

  const answers = new Array(questions.length).fill(null);
  let submitted = false;

  const panel = el("div", { class: "panel" });
  const qContainer = el("div");

  function renderQuestions() {
    qContainer.innerHTML = "";
    questions.forEach((q, qi) => {
      const qBlock = el("div", { class: "quiz-question" });
      qBlock.appendChild(el("p", { text: `${qi + 1}. ${q.q}` }));
      q.options.forEach((opt, oi) => {
        const classes = ["quiz-option"];
        if (!submitted && answers[qi] === oi) classes.push("selected");
        if (submitted) {
          if (oi === q.answer) classes.push("correct");
          else if (oi === answers[qi]) classes.push("incorrect");
        }
        const optEl = el("div", { class: classes.join(" "), text: opt });
        if (!submitted) {
          optEl.addEventListener("click", () => { answers[qi] = oi; renderQuestions(); });
        }
        qBlock.appendChild(optEl);
      });
      qContainer.appendChild(qBlock);
    });
  }
  renderQuestions();
  panel.appendChild(qContainer);

  const resultEl = el("div");
  panel.appendChild(resultEl);

  const submitBtn = el("button", { class: "btn-primary", text: "Submit answers" });
  submitBtn.addEventListener("click", () => {
    if (answers.includes(null)) { showToast("Answer every question first."); return; }
    submitted = true;
    const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    const score = correctCount / questions.length;
    renderQuestions();
    submitBtn.style.display = "none";

    const passed = score >= passThreshold;
    resultEl.innerHTML = "";
    resultEl.appendChild(el("h3", { text: `${correctCount} / ${questions.length} correct (${Math.round(score * 100)}%)` }));
    resultEl.appendChild(el("p", { text: passed ? "Passed." : `Not yet \u2014 you need ${Math.round(passThreshold * 100)}% to pass.` }));
    const retryBtn = el("button", { class: "btn-secondary", text: "Retake quiz", onClick: () => { location.reload(); } });
    resultEl.appendChild(retryBtn);

    onComplete(score, passed);
    refreshTopBarStats();
  });
  panel.appendChild(submitBtn);

  content.appendChild(panel);
  return content;
}

function viewJavaGate() {
  applyTheme(null);
  const gate = CONTENT.javaGate;
  const content = el("div");

  if (Store.isSpringBootUnlocked()) {
    content.appendChild(topBar(gate.title));
    const panel = el("div", { class: "panel" });
    panel.appendChild(el("p", { text: "You've already passed this check. Spring Boot is unlocked." }));
    panel.appendChild(el("button", { class: "btn-primary", text: "Go to Spring Boot", onClick: () => { location.hash = "#/topics/springboot"; } }));
    content.appendChild(panel);
    renderShell("quizzes", content);
    return;
  }

  const runner = renderQuizRunner(gate.id, gate.questions, gate.passThreshold, (score, passed) => {
    if (passed) {
      Store.passJavaGate();
      Store.addXP(10);
      showToast("Java check passed \u2014 Spring Boot unlocked!");
    }
  }, gate.title);

  const banner = el("div", { class: "gate-banner" });
  banner.appendChild(el("p", { text: gate.description }));
  content.appendChild(topBar(gate.title));
  content.appendChild(banner);
  content.appendChild(runner.querySelector(".panel"));

  renderShell("quizzes", content);
}

function viewLessonQuiz(topicId, lessonId) {
  const lesson = findLesson(topicId, lessonId);
  if (!lesson || !lesson.quiz) { location.hash = `#/lesson/${topicId}/${lessonId}`; return; }
  applyTheme(CONTENT.topics[topicId].theme);

  const content = renderQuizRunner(lesson.id, lesson.quiz.questions, 0.7, (score, passed) => {
    const result = Store.recordQuizScore(lesson.id, score);
    if (result.leveledUp) showToast(`Level ${result.newLevel}! Keep going.`);
  }, `Quiz: ${lesson.title}`);

  renderShell("quizzes", content);
}

function viewQuizzesHub() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar("Quizzes"));

  const panel = el("div", { class: "panel" });
  panel.appendChild(el("h3", { text: "Java Skills Check" }));
  panel.appendChild(el("p", { text: Store.isSpringBootUnlocked() ? "Passed \u2014 Spring Boot unlocked." : "Required before starting Spring Boot." }));
  panel.appendChild(el("button", { class: "btn-secondary", text: Store.isSpringBootUnlocked() ? "Review" : "Take check", onClick: () => { location.hash = "#/quizzes/java-gate"; } }));
  content.appendChild(panel);

  Object.values(CONTENT.topics).forEach(topic => {
    const lessons = topic.lessons || Object.values(topic.tiers || {}).flatMap(t => t.lessons);
    lessons.forEach(lesson => {
      if (!lesson.quiz) return;
      const p = el("div", { class: "panel" });
      p.appendChild(el("h3", { text: lesson.title }));
      p.appendChild(el("p", { text: `Best score: ${Math.round(Store.bestQuizScore(lesson.id) * 100)}%` }));
      p.appendChild(el("button", { class: "btn-secondary", text: "Take quiz", onClick: () => { location.hash = `#/quizzes/lesson/${topic.id}/${lesson.id}`; } }));
      content.appendChild(p);
    });
  });

  renderShell("quizzes", content);
}

function viewProgress() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar("Progress"));
  const info = Store.levelInfo();

  const panel = el("div", { class: "panel" });
  panel.appendChild(el("p", { html: `<span class="accent-script" style="font-size:2rem;">${info.xp} XP earned</span>` }));
  panel.appendChild(el("p", { text: `Current streak: ${Store.state.streak} day${Store.state.streak === 1 ? "" : "s"}.` }));
  panel.appendChild(el("p", { text: `Lessons completed: ${Store.state.completedLessons.length}` }));
  panel.appendChild(el("p", { text: `Java Skills Check: ${Store.isSpringBootUnlocked() ? "Passed" : "Not yet passed"}` }));
  content.appendChild(panel);

  if (Store.state.rewards.length) {
    const rewardsPanel = el("div", { class: "panel" });
    rewardsPanel.appendChild(el("h3", { text: "Rewards" }));
    Store.state.rewards.forEach(lvl => {
      rewardsPanel.appendChild(el("span", { class: "badge", text: `Level ${lvl} reached`, attrs: { style: "margin-right:0.5rem;" } }));
    });
    content.appendChild(rewardsPanel);
  }

  renderShell("progress", content);
}

function viewSettings() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar("Settings"));
  const panel = el("div", { class: "panel" });

  const darkRow = el("div", { class: "settings-row" });
  darkRow.appendChild(el("span", { text: "Dark mode" }));
  const darkToggle = el("button", { class: "toggle" + (Store.state.darkMode ? " on" : "") });
  darkToggle.addEventListener("click", () => { Store.toggleDarkMode(); viewSettings(); });
  darkRow.appendChild(darkToggle);
  panel.appendChild(darkRow);

  const readRow = el("div", { class: "settings-row" });
  readRow.appendChild(el("span", { text: "Reading mode" }));
  const readToggle = el("button", { class: "toggle" + (Store.state.readingMode ? " on" : "") });
  readToggle.addEventListener("click", () => { Store.toggleReadingMode(); viewSettings(); });
  readRow.appendChild(readToggle);
  panel.appendChild(readRow);

  const codeFontRow = el("div", { class: "settings-row" });
  codeFontRow.appendChild(el("span", { text: "Code font" }));
  const select = el("select", { attrs: { style: "padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--fg);font-family:var(--font-body);" } });
  [["consolas", "Consolas"], ["cascadia", "Cascadia Code"]].forEach(([value, label]) => {
    const opt = el("option", { text: label, attrs: { value } });
    if (Store.state.codeFont === value) opt.setAttribute("selected", "true");
    select.appendChild(opt);
  });
  select.addEventListener("change", (e) => {
    Store.setCodeFont(e.target.value);
    if (e.target.value === "cascadia") document.body.classList.add("codefont-cascadia");
    else document.body.classList.remove("codefont-cascadia");
  });
  codeFontRow.appendChild(select);
  panel.appendChild(codeFontRow);

  const sampleRow = el("div", { attrs: { style: "padding:0 0 var(--space-2);" } });
  sampleRow.appendChild(el("pre", { class: "code-block" }, [el("code", { text: 'function greet($name) {\n    echo "Hello, $name!";\n}' })]));
  panel.appendChild(sampleRow);

  const nameRow = el("div", { class: "settings-row" });
  nameRow.appendChild(el("span", { text: `Name: ${Store.state.name}` }));
  panel.appendChild(nameRow);

  const resetRow = el("div", { class: "settings-row" });
  resetRow.appendChild(el("span", { text: "Reset all progress" }));
  resetRow.appendChild(el("button", { class: "btn-secondary", text: "Reset", onClick: () => {
    if (confirm("This clears all progress, XP, and streaks stored in this browser. Continue?")) {
      Store.reset();
      location.hash = "";
      location.reload();
    }
  }}));
  panel.appendChild(resetRow);

  content.appendChild(panel);
  renderShell("settings", content);
}

function viewAbout() {
  applyTheme(null);
  const content = el("div");
  content.appendChild(topBar("About ProCode"));
  const panel = el("div", { class: "panel" });
  panel.appendChild(el("p", { text: "ProCode teaches Spring Boot and PHP fundamentals — the parts that make you industry-ready even before full mastery. Laravel is coming in a later update." }));
  panel.appendChild(el("p", { text: "Everything you do is saved locally in this browser. There's no account and no server — clearing your browser data will reset your progress." }));
  content.appendChild(panel);
  renderShell("about", content);
}

// ---------- Router ----------

function router() {
  Store.load();
  const hash = location.hash.replace(/^#\//, "");
  const parts = hash.split("/").filter(Boolean);

  if (!Store.state.name) {
    renderLanding();
    return;
  }

  if (parts.length === 0 || parts[0] === "dashboard") { viewDashboard(); return; }
  if (parts[0] === "topics" && parts[1]) { viewTopicDetail(parts[1]); return; }
  if (parts[0] === "topics") { viewTopics(); return; }
  if (parts[0] === "lesson" && parts[1] && parts[2]) { viewLesson(parts[1], parts[2]); return; }
  if (parts[0] === "quizzes" && parts[1] === "java-gate") { viewJavaGate(); return; }
  if (parts[0] === "quizzes" && parts[1] === "lesson" && parts[2] && parts[3]) { viewLessonQuiz(parts[2], parts[3]); return; }
  if (parts[0] === "quizzes") { viewQuizzesHub(); return; }
  if (parts[0] === "progress") { viewProgress(); return; }
  if (parts[0] === "settings") { viewSettings(); return; }
  if (parts[0] === "about") { viewAbout(); return; }

  viewDashboard();
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);