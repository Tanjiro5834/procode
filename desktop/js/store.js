// ProCode local state — all persistence is localStorage, no backend.

const STORAGE_KEY = "procode_state_v1";

const XP_PER_SUCCESS = 10;
const XP_PER_LEVEL = 100;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    name: "",
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    darkMode: false,
    readingMode: false,
    codeFont: "consolas", // "consolas" | "cascadia"
    javaGatePassed: false,
    completedLessons: [],   // lesson ids
    completedQuizzes: {},   // quizId -> best score (0-1)
    rewards: []             // level numbers already announced
  };
}

const Store = {
  state: defaultState(),

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.state = { ...defaultState(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error("ProCode: failed to load state, resetting.", e);
      this.state = defaultState();
    }
    this._applyStreak();
    return this.state;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  },

  reset() {
    this.state = defaultState();
    this.save();
  },

  // Streak logic: increments once per new calendar day the user shows up,
  // resets to 1 if more than one day was missed.
  _applyStreak() {
    const today = todayStr();
    const last = this.state.lastActiveDate;
    if (last === today) {
      return; // already counted today
    }
    if (!last) {
      this.state.streak = 1;
    } else {
      const dayMs = 24 * 60 * 60 * 1000;
      const gap = Math.round((new Date(today) - new Date(last)) / dayMs);
      this.state.streak = gap === 1 ? this.state.streak + 1 : 1;
    }
    this.state.lastActiveDate = today;
    this.save();
  },

  setName(name) {
    this.state.name = name.trim();
    this.save();
  },

  toggleDarkMode(force) {
    this.state.darkMode = force !== undefined ? force : !this.state.darkMode;
    this.save();
  },

  toggleReadingMode(force) {
    this.state.readingMode = force !== undefined ? force : !this.state.readingMode;
    this.save();
  },

  setCodeFont(font) {
    this.state.codeFont = font;
    this.save();
  },

  // Returns { leveledUp: bool, newLevel: number|null }
  addXP(amount) {
    const prevLevel = Math.floor(this.state.xp / XP_PER_LEVEL);
    this.state.xp += amount;
    const newLevel = Math.floor(this.state.xp / XP_PER_LEVEL);
    this.save();
    if (newLevel > prevLevel && !this.state.rewards.includes(newLevel)) {
      this.state.rewards.push(newLevel);
      this.save();
      return { leveledUp: true, newLevel };
    }
    return { leveledUp: false, newLevel: null };
  },

  completeLesson(lessonId) {
    if (!this.state.completedLessons.includes(lessonId)) {
      this.state.completedLessons.push(lessonId);
      this.save();
      return this.addXP(XP_PER_SUCCESS);
    }
    return { leveledUp: false, newLevel: null };
  },

  isLessonComplete(lessonId) {
    return this.state.completedLessons.includes(lessonId);
  },

  // score is 0-1 (fraction correct)
  recordQuizScore(quizId, score) {
    const prevBest = this.state.completedQuizzes[quizId] || 0;
    const isFirstPass = prevBest === 0 && score > 0;
    this.state.completedQuizzes[quizId] = Math.max(prevBest, score);
    this.save();
    if (isFirstPass) {
      return this.addXP(XP_PER_SUCCESS);
    }
    return { leveledUp: false, newLevel: null };
  },

  bestQuizScore(quizId) {
    return this.state.completedQuizzes[quizId] || 0;
  },

  passJavaGate() {
    this.state.javaGatePassed = true;
    this.save();
  },

  isSpringBootUnlocked() {
    return this.state.javaGatePassed;
  },

  levelInfo() {
    const level = Math.floor(this.state.xp / XP_PER_LEVEL);
    const intoLevel = this.state.xp % XP_PER_LEVEL;
    return { level, xpIntoLevel: intoLevel, xpForNextLevel: XP_PER_LEVEL, xp: this.state.xp };
  }
};
