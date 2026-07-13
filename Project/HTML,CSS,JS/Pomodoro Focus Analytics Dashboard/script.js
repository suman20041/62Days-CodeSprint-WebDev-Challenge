const STORAGE_KEY = "pomodoro-sessions";
const FOCUS_MIN = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

const modeLabel = document.getElementById("modeLabel");
const timerDisplay = document.getElementById("timerDisplay");
const sessionNum = document.getElementById("sessionNum");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const totalSessionsEl = document.getElementById("totalSessions");
const totalFocusEl = document.getElementById("totalFocus");
const todayFocusEl = document.getElementById("todayFocus");
const bestDayEl = document.getElementById("bestDay");
const historyList = document.getElementById("historyList");

let mode = "focus";
let secondsLeft = FOCUS_MIN * 60;
let pomodoroCount = 1;
let running = false;
let intervalId = null;
let sessionsChart = null;
let focusChart = null;

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSession(minutes) {
  const sessions = loadSessions();
  sessions.unshift({
    date: new Date().toISOString(),
    minutes,
    type: "focus",
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 100)));
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatMinutes(m) {
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m`;
}

function dateKey(iso) {
  return iso.slice(0, 10);
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function dayLabel(key) {
  const d = new Date(key + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(secondsLeft);
  sessionNum.textContent = pomodoroCount;
  modeLabel.textContent = mode === "focus" ? "Focus Session" : mode === "short" ? "Short Break" : "Long Break";
  modeLabel.classList.toggle("break", mode !== "focus");
  document.documentElement.style.setProperty("--accent", mode === "focus" ? "#ef4444" : "#22c55e");
}

function setMode(newMode) {
  mode = newMode;
  if (mode === "focus") secondsLeft = FOCUS_MIN * 60;
  else if (mode === "short") secondsLeft = SHORT_BREAK * 60;
  else secondsLeft = LONG_BREAK * 60;
  updateDisplay();
}

function completeSession() {
  if (mode === "focus") {
    saveSession(FOCUS_MIN);
    pomodoroCount = pomodoroCount >= 4 ? 1 : pomodoroCount + 1;
    setMode(pomodoroCount === 1 ? "long" : "short");
  } else {
    setMode("focus");
  }
  updateAnalytics();
}

function tick() {
  if (secondsLeft <= 0) {
    completeSession();
    return;
  }
  secondsLeft--;
  updateDisplay();
}

function startTimer() {
  if (running) return;
  running = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  running = false;
  clearInterval(intervalId);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  pomodoroCount = 1;
  setMode("focus");
}

function skipSession() {
  pauseTimer();
  if (mode === "focus") {
    pomodoroCount = pomodoroCount >= 4 ? 1 : pomodoroCount + 1;
    setMode(pomodoroCount === 1 ? "long" : "short");
  } else {
    setMode("focus");
  }
}

function updateAnalytics() {
  const sessions = loadSessions().filter((s) => s.type === "focus");
  const today = dateKey(new Date().toISOString());
  const days = getLast7Days();

  const byDay = {};
  days.forEach((d) => { byDay[d] = { count: 0, minutes: 0 }; });
  sessions.forEach((s) => {
    const k = dateKey(s.date);
    if (byDay[k]) {
      byDay[k].count++;
      byDay[k].minutes += s.minutes;
    }
  });

  const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0);
  const todayMinutes = byDay[today]?.minutes || 0;

  let bestDayKey = null;
  let bestMinutes = 0;
  Object.entries(byDay).forEach(([k, v]) => {
    if (v.minutes > bestMinutes) {
      bestMinutes = v.minutes;
      bestDayKey = k;
    }
  });

  totalSessionsEl.textContent = sessions.length;
  totalFocusEl.textContent = formatMinutes(totalMinutes);
  todayFocusEl.textContent = formatMinutes(todayMinutes);
  bestDayEl.textContent = bestDayKey ? `${dayLabel(bestDayKey)} (${bestMinutes}m)` : "—";

  renderHistory(sessions);
  renderCharts(days, byDay);
}

function renderHistory(sessions) {
  if (sessions.length === 0) {
    historyList.innerHTML = '<li class="empty">No focus sessions yet. Complete a Pomodoro to start tracking!</li>';
    return;
  }
  historyList.innerHTML = sessions.slice(0, 8).map((s) => {
    const d = new Date(s.date);
    const label = d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    return `<li><span>🍅 Focus session</span><span>${label} · ${s.minutes}m</span></li>`;
  }).join("");
}

function renderCharts(days, byDay) {
  const labels = days.map(dayLabel);
  const counts = days.map((d) => byDay[d].count);
  const minutes = days.map((d) => byDay[d].minutes);

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  if (sessionsChart) sessionsChart.destroy();
  if (focusChart) focusChart.destroy();

  sessionsChart = new Chart(document.getElementById("sessionsChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ data: counts, backgroundColor: "#ef4444", borderRadius: 6 }],
    },
    options: chartOpts,
  });

  focusChart = new Chart(document.getElementById("focusChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ data: minutes, backgroundColor: "#f97316", borderRadius: 6 }],
    },
    options: {
      ...chartOpts,
      scales: { y: { beginAtZero: true, title: { display: true, text: "Minutes" } } },
    },
  });
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
skipBtn.addEventListener("click", skipSession);

updateDisplay();
updateAnalytics();
