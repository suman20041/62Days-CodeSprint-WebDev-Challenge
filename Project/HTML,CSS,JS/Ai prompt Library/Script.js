/* =========================================================
   Prompt/Lib — application logic
   Vanilla JS, no build step, no dependencies.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. DATA — the catalog
     Each prompt: id, title, category, tags, prompt text.
     Categories map to CSS variables --cat-<slug> for color.
  --------------------------------------------------------- */
  const CATEGORIES = [
    { slug: "chatgpt",       label: "ChatGPT" },
    { slug: "webdev",        label: "Web Development" },
    { slug: "htmlcss",       label: "HTML & CSS" },
    { slug: "javascript",    label: "JavaScript" },
    { slug: "react",         label: "React" },
    { slug: "nodejs",        label: "Node.js" },
    { slug: "git",           label: "Git & GitHub" },
    { slug: "debugging",     label: "Debugging" },
    { slug: "interview",     label: "Interview Preparation" },
    { slug: "productivity",  label: "Productivity" },
  ];

  const PROMPTS = [
    // ---------------- ChatGPT ----------------
    { id: "gpt-01", category: "chatgpt", title: "Explain it like I'm five",
      tags: ["beginner", "explanations"],
      prompt: "Explain [topic] to me as if I were five years old. Use a simple everyday analogy, avoid jargon entirely, and keep the whole explanation under 150 words. After the explanation, give one follow-up question I could ask to go one level deeper." },
    { id: "gpt-02", category: "chatgpt", title: "Expert panel consultation",
      tags: ["roleplay", "decision-making"],
      prompt: "Act as a panel of three experts in [field]: a skeptic, an optimist, and a pragmatist. I will describe a decision I'm facing: [describe decision]. Have each expert give their take in 2-3 sentences, then summarize where they agree and disagree." },
    { id: "gpt-03", category: "chatgpt", title: "Structured decision matrix",
      tags: ["decision-making", "productivity"],
      prompt: "Help me decide between these options: [list options]. Build a decision matrix with the criteria that matter most for this choice, weight each criterion out of 5, score every option, and tell me which one wins along with the biggest risk of that choice." },
    { id: "gpt-04", category: "chatgpt", title: "Socratic tutor",
      tags: ["learning", "beginner"],
      prompt: "You are a Socratic tutor teaching me [topic]. Never give me the answer directly. Instead, ask me one guiding question at a time, wait for my answer, and adjust the next question based on what I got right or wrong. Start with a question that tests my current understanding." },

    // ---------------- Web Development ----------------
    { id: "web-01", category: "webdev", title: "Responsive landing page blueprint",
      tags: ["layout", "planning"],
      prompt: "Plan a responsive landing page for [product/service]. Outline the sections in order, the goal of each section, what content it needs, and how the layout should adapt at desktop, tablet, and mobile breakpoints. Do not write code yet, just the structural plan." },
    { id: "web-02", category: "webdev", title: "Accessibility audit checklist",
      tags: ["accessibility", "review"],
      prompt: "Review the following page structure or markup for accessibility issues: [paste HTML or describe the page]. Check color contrast expectations, heading hierarchy, keyboard navigation, ARIA usage, and form labeling. List each issue found with its WCAG criterion and a concrete fix." },
    { id: "web-03", category: "webdev", title: "Performance optimization review",
      tags: ["performance", "review"],
      prompt: "Here is my page's current load profile: [describe metrics or paste a Lighthouse report]. Identify the top three bottlenecks, explain why each one matters for real users, and suggest a fix for each ranked by effort versus impact." },
    { id: "web-04", category: "webdev", title: "API integration plan",
      tags: ["planning", "backend"],
      prompt: "I need to integrate the [API name] into my [type of app]. Walk me through the integration plan: authentication method, the key endpoints I'll likely need, error cases to handle, and how to structure the client-side calls so they're easy to test." },

    // ---------------- HTML & CSS ----------------
    { id: "hc-01", category: "htmlcss", title: "Semantic HTML refactor",
      tags: ["semantics", "refactor"],
      prompt: "Refactor this HTML to use proper semantic elements instead of generic divs: [paste HTML]. Explain each swap you made and why it improves accessibility and SEO, without changing the visual layout." },
    { id: "hc-02", category: "htmlcss", title: "CSS Grid layout generator",
      tags: ["css-grid", "layout"],
      prompt: "Write a CSS Grid layout for [describe layout, e.g. a 3-column dashboard with a sticky sidebar]. Include the grid-template-columns/rows, gap, and responsive behavior for tablet and mobile using media queries. Add short comments explaining each rule." },
    { id: "hc-03", category: "htmlcss", title: "Cross-browser CSS debugging",
      tags: ["debugging", "browser-quirks"],
      prompt: "This CSS renders correctly in [browser A] but breaks in [browser B]: [paste CSS and describe the visual bug]. Identify the likely cause of the inconsistency and give me a fix that works across both browsers without vendor-specific hacks unless unavoidable." },
    { id: "hc-04", category: "htmlcss", title: "Design system component spec",
      tags: ["design-system", "components"],
      prompt: "Define a reusable CSS component for a [button/card/modal] as part of a small design system. Use CSS custom properties for color, spacing, and radius so it can be themed. Include default, hover, focus, and disabled states." },

    // ---------------- JavaScript ----------------
    { id: "js-01", category: "javascript", title: "Readability refactor",
      tags: ["refactor", "clean-code"],
      prompt: "Refactor this JavaScript function for readability and maintainability without changing its behavior: [paste code]. Rename unclear variables, remove duplication, and add brief comments only where the logic isn't self-explanatory. Explain each change afterward." },
    { id: "js-02", category: "javascript", title: "Callback to async/await conversion",
      tags: ["async", "refactor"],
      prompt: "Convert this callback-based or .then() chain code to async/await: [paste code]. Preserve the exact error-handling behavior, and point out any place where the original code had a subtle bug that the conversion fixes or exposes." },
    { id: "js-03", category: "javascript", title: "Algorithm explainer with complexity",
      tags: ["algorithms", "learning"],
      prompt: "Explain how this algorithm works step by step: [paste code or describe the algorithm]. Walk through it with a small example input, then state its time and space complexity in Big O notation and explain why." },
    { id: "js-04", category: "javascript", title: "Unit test generator",
      tags: ["testing", "quality"],
      prompt: "Write unit tests for this function using [Jest/Vitest/Mocha]: [paste function]. Cover the happy path, edge cases like empty or null input, and at least one failure case. Use descriptive test names that explain the expected behavior." },

    // ---------------- React ----------------
    { id: "react-01", category: "react", title: "Component architecture planner",
      tags: ["architecture", "planning"],
      prompt: "I'm building a [feature, e.g. a multi-step checkout form] in React. Propose a component breakdown: which components exist, what state each owns, what gets passed as props, and where I should lift state up. Keep it framework-idiomatic, no code yet." },
    { id: "react-02", category: "react", title: "Custom hook designer",
      tags: ["hooks", "reusability"],
      prompt: "Design a custom React hook that [describe behavior, e.g. debounces a search input and tracks loading state]. Show the hook's implementation, its return values, and a short example of a component using it." },
    { id: "react-03", category: "react", title: "State management advisor",
      tags: ["state-management", "decision-making"],
      prompt: "My app currently manages state with [useState/Context/etc.] and is starting to feel unwieldy because [describe the pain point]. Recommend whether to stay with the current approach, move to Context, or adopt a library like Zustand or Redux, and justify the tradeoffs for my specific case." },
    { id: "react-04", category: "react", title: "Re-render performance profiling",
      tags: ["performance", "optimization"],
      prompt: "This React component re-renders more often than expected: [paste component code]. Identify the likely causes, and suggest fixes using memoization, key stability, or state colocation. Explain which fix addresses which cause." },

    // ---------------- Node.js ----------------
    { id: "node-01", category: "nodejs", title: "REST API scaffold",
      tags: ["backend", "scaffolding"],
      prompt: "Scaffold a REST API in Node.js with Express for a [resource, e.g. 'blog posts'] resource. Include routes for CRUD operations, a basic input validation layer, and a consistent JSON error response shape. Explain the folder structure you'd use." },
    { id: "node-02", category: "nodejs", title: "Error-handling middleware",
      tags: ["error-handling", "express"],
      prompt: "Write centralized error-handling middleware for an Express app that distinguishes between operational errors (like validation failures) and programmer errors (like bugs). Include logging and a sanitized response so internals never leak to the client." },
    { id: "node-03", category: "nodejs", title: "Database schema designer",
      tags: ["database", "planning"],
      prompt: "Design a database schema for [describe the domain, e.g. a task management app with teams and projects]. List the tables/collections, their fields, relationships, and indexes you'd add for the most common queries. Note one normalization tradeoff you made." },
    { id: "node-04", category: "nodejs", title: "Security hardening checklist",
      tags: ["security", "review"],
      prompt: "Review this Node.js/Express app for security issues: [paste code or describe the setup]. Check for missing input validation, unsafe dependencies, secrets in code, missing rate limiting, and improper auth checks. Rank issues by severity." },

    // ---------------- Git & GitHub ----------------
    { id: "git-01", category: "git", title: "Commit message generator",
      tags: ["commits", "workflow"],
      prompt: "Write a clear commit message for this diff: [paste git diff or describe the change]. Use the conventional commits format (type(scope): summary), keep the summary line under 72 characters, and add a short body explaining the why if it isn't obvious from the diff." },
    { id: "git-02", category: "git", title: "Merge conflict resolver",
      tags: ["merge-conflicts", "troubleshooting"],
      prompt: "I have a merge conflict in this file: [paste the conflicted section with <<<<<<<, =======, >>>>>>> markers]. Explain what each side changed, recommend how to resolve it, and show the resolved code." },
    { id: "git-03", category: "git", title: "Branching strategy advisor",
      tags: ["workflow", "team"],
      prompt: "My team of [team size] is working on [type of project] and currently uses [current branching approach, or 'no strategy']. Recommend a branching strategy (trunk-based, Git Flow, GitHub Flow, etc.), and explain how releases, hotfixes, and feature work would flow through it." },
    { id: "git-04", category: "git", title: "Pull request description writer",
      tags: ["pull-requests", "documentation"],
      prompt: "Write a pull request description for this change: [summarize the change or paste the diff]. Include what changed, why, how it was tested, and a checklist of things reviewers should double check. Keep it scannable with headers and bullet points." },

    // ---------------- Debugging ----------------
    { id: "dbg-01", category: "debugging", title: "Root cause analysis",
      tags: ["root-cause", "troubleshooting"],
      prompt: "I'm seeing this bug: [describe the symptom]. Here is the relevant code: [paste code]. Walk through the likely execution path, identify where behavior diverges from what's expected, and state the most probable root cause before suggesting any fix." },
    { id: "dbg-02", category: "debugging", title: "Stack trace interpreter",
      tags: ["errors", "troubleshooting"],
      prompt: "Here is a stack trace I don't fully understand: [paste stack trace]. Explain what each frame means starting from the top, point to the line most likely responsible, and tell me what information I should log to confirm the cause." },
    { id: "dbg-03", category: "debugging", title: "Minimal reproduction builder",
      tags: ["reproduction", "isolation"],
      prompt: "Help me isolate this bug into a minimal reproducible example. Here's the full context: [describe the bug and paste relevant code]. Guide me through what to strip out first, and what to keep, so the reproduction stays as small as possible while still triggering the bug." },
    { id: "dbg-04", category: "debugging", title: "Rubber duck debugging partner",
      tags: ["reasoning", "process"],
      prompt: "Act as a rubber duck. I'm going to explain my code and what I expect it to do, step by step: [start explaining]. After each step, just ask me one clarifying question that forces me to double-check my assumption, rather than giving me the answer." },

    // ---------------- Interview Preparation ----------------
    { id: "int-01", category: "interview", title: "Mock technical interviewer",
      tags: ["mock-interview", "coding"],
      prompt: "Act as a technical interviewer for a [role, e.g. mid-level frontend engineer] position at a [company type]. Ask me one coding or system question appropriate for that level, wait for my answer, then give specific feedback on correctness, communication, and what a strong answer would have added." },
    { id: "int-02", category: "interview", title: "Behavioral question coach",
      tags: ["behavioral", "storytelling"],
      prompt: "Help me prepare a STAR-format answer for the question '[behavioral question]' based on this experience: [describe a real situation]. Ask me questions to fill in gaps, then produce a tight 90-second spoken version of the answer." },
    { id: "int-03", category: "interview", title: "System design walkthrough",
      tags: ["system-design", "architecture"],
      prompt: "Guide me through designing [system, e.g. a URL shortener] for an interview setting. Ask me clarifying questions first about scale and requirements, then let me propose a design, and challenge my choices the way an interviewer would, one issue at a time." },
    { id: "int-04", category: "interview", title: "Resume bullet point polisher",
      tags: ["resume", "writing"],
      prompt: "Rewrite these resume bullet points to lead with impact and use strong action verbs: [paste bullet points]. Where a metric is missing, suggest what kind of number would strengthen it, and flag any bullet that's too vague to be convincing." },

    // ---------------- Productivity ----------------
    { id: "prod-01", category: "productivity", title: "Daily priority planner",
      tags: ["planning", "focus"],
      prompt: "Here's my task list for today: [list tasks]. Help me pick the top 3 that matter most given this goal: [state your main goal for the week]. Sequence them, estimate rough time for each, and flag anything that should be deferred or delegated." },
    { id: "prod-02", category: "productivity", title: "Meeting notes summarizer",
      tags: ["meetings", "summarizing"],
      prompt: "Summarize these raw meeting notes into: key decisions made, open questions, and action items with an owner for each: [paste notes]. Keep the summary under 150 words plus the action item list." },
    { id: "prod-03", category: "productivity", title: "Weekly retrospective",
      tags: ["reflection", "planning"],
      prompt: "Help me run a personal weekly retrospective. Ask me what went well, what didn't, and what I want to change next week, one question at a time, then summarize my answers into three concrete adjustments for next week." },
    { id: "prod-04", category: "productivity", title: "Focus session planner",
      tags: ["deep-work", "time-blocking"],
      prompt: "I have [X hours] of uninterrupted time and need to make progress on [task/project]. Break it into focused work blocks with a clear objective for each block, a short break in between, and a definition of 'done' for the session." },
  ];

  /* ---------------------------------------------------------
     2. STATE
  --------------------------------------------------------- */
  const state = {
    query: "",
    activeCategory: "all",
    showFavoritesOnly: false,
    sort: "default",
    favorites: loadFavorites(),
  };

  /* ---------------------------------------------------------
     3. LOCAL STORAGE HELPERS
  --------------------------------------------------------- */
  const LS_FAV_KEY = "promptlib_favorites";
  const LS_THEME_KEY = "promptlib_theme";

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(LS_FAV_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      console.warn("Prompt/Lib: could not read favorites from storage.", e);
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(LS_FAV_KEY, JSON.stringify([...state.favorites]));
    } catch (e) {
      console.warn("Prompt/Lib: could not save favorites to storage.", e);
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(LS_THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(LS_THEME_KEY, theme);
    } catch (e) {
      console.warn("Prompt/Lib: could not save theme preference.", e);
    }
  }

  /* ---------------------------------------------------------
     4. DOM REFERENCES
  --------------------------------------------------------- */
  const el = {
    root: document.documentElement,
    searchInput: document.getElementById("searchInput"),
    categoryRail: document.getElementById("categoryRail"),
    cardGrid: document.getElementById("cardGrid"),
    resultsCount: document.getElementById("resultsCount"),
    sortSelect: document.getElementById("sortSelect"),
    emptyState: document.getElementById("emptyState"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    randomBtn: document.getElementById("randomBtn"),
    favToggle: document.getElementById("favToggle"),
    favCount: document.getElementById("favCount"),
    themeToggle: document.getElementById("themeToggle"),
    iconSun: document.getElementById("iconSun"),
    iconMoon: document.getElementById("iconMoon"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalClose: document.getElementById("modalClose"),
    modalTitle: document.getElementById("modalTitle"),
    modalCatLabel: document.getElementById("modalCatLabel"),
    modalTags: document.getElementById("modalTags"),
    modalBody: document.getElementById("modalBody"),
    modalCopy: document.getElementById("modalCopy"),
    modalFav: document.getElementById("modalFav"),
    modalAnother: document.getElementById("modalAnother"),
    toast: document.getElementById("toast"),
  };

  let modalPromptId = null;
  let toastTimer = null;

  /* ---------------------------------------------------------
     5. INIT
  --------------------------------------------------------- */
  function init() {
    initTheme();
    renderCategoryChips();
    bindEvents();
    render();
  }

  function initTheme() {
    const saved = loadTheme();
    const theme = saved || "dark";
    setTheme(theme, false);
  }

  function setTheme(theme, persist = true) {
    el.root.setAttribute("data-theme", theme);
    el.iconSun.style.display = theme === "dark" ? "block" : "none";
    el.iconMoon.style.display = theme === "light" ? "block" : "none";
    if (persist) saveTheme(theme);
  }

  /* ---------------------------------------------------------
     6. CATEGORY CHIPS
  --------------------------------------------------------- */
  function renderCategoryChips() {
    const frag = document.createDocumentFragment();

    const allChip = makeChip("all", "All prompts", PROMPTS.length);
    frag.appendChild(allChip);

    CATEGORIES.forEach((cat) => {
      const count = PROMPTS.filter((p) => p.category === cat.slug).length;
      frag.appendChild(makeChip(cat.slug, cat.label, count));
    });

    el.categoryRail.appendChild(frag);
    updateActiveChip();
  }

  function makeChip(slug, label, count) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.category = slug;
    if (slug !== "all") {
      btn.style.setProperty("--chip-color", `var(--cat-${slug})`);
    }
    btn.innerHTML = `
      ${slug !== "all" ? '<span class="dot" aria-hidden="true"></span>' : ""}
      <span>${label}</span>
      <span class="chip-count">${count}</span>
    `;
    btn.addEventListener("click", () => {
      state.activeCategory = slug;
      updateActiveChip();
      render();
    });
    return btn;
  }

  function updateActiveChip() {
    el.categoryRail.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.category === state.activeCategory);
    });
  }

  /* ---------------------------------------------------------
     7. EVENTS
  --------------------------------------------------------- */
  function bindEvents() {
    el.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });

    // "/" focuses search, like many catalog / doc sites
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
      }
      if (e.key === "Escape" && !el.modalOverlay.hidden) {
        closeModal();
      }
    });

    el.sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });

    el.favToggle.addEventListener("click", () => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
      el.favToggle.setAttribute("aria-pressed", String(state.showFavoritesOnly));
      render();
    });

    el.emptyResetBtn.addEventListener("click", resetFilters);

    el.themeToggle.addEventListener("click", () => {
      const current = el.root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });

    el.randomBtn.addEventListener("click", () => openRandomModal());
    el.modalAnother.addEventListener("click", () => openRandomModal());
    el.modalClose.addEventListener("click", closeModal);
    el.modalOverlay.addEventListener("click", (e) => {
      if (e.target === el.modalOverlay) closeModal();
    });

    el.modalCopy.addEventListener("click", () => {
      const p = PROMPTS.find((x) => x.id === modalPromptId);
      if (p) copyPrompt(p);
    });

    el.modalFav.addEventListener("click", () => {
      if (modalPromptId) toggleFavorite(modalPromptId);
      syncModalFavButton();
      renderCategoryChips(); // no-op safe refresh (counts unaffected) - keep chips consistent
      render();
    });
  }

  function resetFilters() {
    state.query = "";
    state.activeCategory = "all";
    state.showFavoritesOnly = false;
    el.searchInput.value = "";
    el.favToggle.setAttribute("aria-pressed", "false");
    updateActiveChip();
    render();
  }

  /* ---------------------------------------------------------
     8. FILTER / SORT / RENDER
  --------------------------------------------------------- */
  function getFilteredPrompts() {
    let list = PROMPTS.slice();

    if (state.activeCategory !== "all") {
      list = list.filter((p) => p.category === state.activeCategory);
    }

    if (state.showFavoritesOnly) {
      list = list.filter((p) => state.favorites.has(p.id));
    }

    if (state.query) {
      const q = state.query;
      list = list.filter((p) => {
        const haystack = (
          p.title + " " + p.prompt + " " + p.tags.join(" ") + " " + categoryLabel(p.category)
        ).toLowerCase();
        return haystack.includes(q);
      });
    }

    switch (state.sort) {
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "category":
        list.sort((a, b) => categoryLabel(a.category).localeCompare(categoryLabel(b.category)));
        break;
      default:
        break; // catalog order = original array order
    }

    return list;
  }

  function categoryLabel(slug) {
    const found = CATEGORIES.find((c) => c.slug === slug);
    return found ? found.label : slug;
  }

  function callNumber(p) {
    const idx = PROMPTS.filter((x) => x.category === p.category).indexOf(p) + 1;
    const prefix = p.category.slice(0, 3).toUpperCase();
    return `${prefix} · ${String(idx).padStart(3, "0")}`;
  }

  function render() {
    const list = getFilteredPrompts();
    el.cardGrid.innerHTML = "";

    if (list.length === 0) {
      el.emptyState.hidden = false;
    } else {
      el.emptyState.hidden = true;
      const frag = document.createDocumentFragment();
      list.forEach((p, i) => frag.appendChild(renderCard(p, i)));
      el.cardGrid.appendChild(frag);
    }

    el.resultsCount.textContent = describeResults(list.length);
    el.favCount.textContent = state.favorites.size;
  }

  function describeResults(n) {
    const parts = [];
    if (state.activeCategory !== "all") parts.push(categoryLabel(state.activeCategory));
    if (state.showFavoritesOnly) parts.push("favorites");
    if (state.query) parts.push(`matching "${state.query}"`);
    const scope = parts.length ? ` — ${parts.join(", ")}` : "";
    return `${n} prompt${n === 1 ? "" : "s"}${scope}`;
  }

  function renderCard(p, index) {
    const card = document.createElement("article");
    card.className = "prompt-card";
    card.style.setProperty("--card-color", `var(--cat-${p.category})`);
    card.style.animationDelay = `${Math.min(index, 12) * 25}ms`;

    const isFav = state.favorites.has(p.id);

    card.innerHTML = `
      <div class="card-top">
        <span class="card-call">${callNumber(p)}</span>
        <button class="fav-btn ${isFav ? "is-fav" : ""}" type="button" aria-label="${isFav ? "Remove from favorites" : "Save to favorites"}" aria-pressed="${isFav}">
          ${isFav ? "♥" : "♡"}
        </button>
      </div>
      <h3 class="card-title">${escapeHtml(p.title)}</h3>
      <span class="card-cat"><span class="dot"></span>${categoryLabel(p.category)}</span>
      <p class="card-snippet">${escapeHtml(p.prompt)}</p>
      <div class="card-tags">
        ${p.tags.map((t) => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="card-perf"></div>
      <div class="card-actions">
        <button class="btn btn-primary copy-btn" type="button"><span class="copy-ico" aria-hidden="true">⧉</span> Copy</button>
        <button class="btn btn-ghost view-btn" type="button">View</button>
      </div>
    `;

    card.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFavorite(p.id);
      render();
    });
    card.querySelector(".copy-btn").addEventListener("click", () => copyPrompt(p));
    card.querySelector(".view-btn").addEventListener("click", () => openModal(p.id));

    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------------------------------------------------
     9. FAVORITES
  --------------------------------------------------------- */
  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast("Removed from favorites");
    } else {
      state.favorites.add(id);
      showToast("Saved to favorites");
    }
    saveFavorites();
  }

  /* ---------------------------------------------------------
     10. COPY TO CLIPBOARD
  --------------------------------------------------------- */
  function copyPrompt(p) {
    const text = p.prompt;

    const done = () => showToast("Prompt copied to clipboard");
    const fail = () => showToast("Couldn't copy — please copy manually");

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => legacyCopy(text, done, fail));
    } else {
      legacyCopy(text, done, fail);
    }
  }

  function legacyCopy(text, done, fail) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      ok ? done() : fail();
    } catch (e) {
      fail();
    }
  }

  /* ---------------------------------------------------------
     11. TOAST
  --------------------------------------------------------- */
  function showToast(message) {
    clearTimeout(toastTimer);
    el.toast.classList.remove("leaving");
    el.toast.textContent = message;
    el.toast.hidden = false;

    toastTimer = setTimeout(() => {
      el.toast.classList.add("leaving");
      setTimeout(() => { el.toast.hidden = true; }, 220);
    }, 2200);
  }

  /* ---------------------------------------------------------
     12. MODAL (prompt detail + random)
  --------------------------------------------------------- */
  function openModal(id) {
    const p = PROMPTS.find((x) => x.id === id);
    if (!p) return;
    modalPromptId = id;

    el.modalOverlay.style.setProperty("--modal-color", `var(--cat-${p.category})`);
    el.modalCatLabel.style.setProperty("--modal-color", `var(--cat-${p.category})`);
    el.modalCatLabel.textContent = `${categoryLabel(p.category)} · ${callNumber(p).split("· ")[1]}`;
    el.modalTitle.textContent = p.title;
    el.modalTags.textContent = p.tags.map((t) => `#${t}`).join("  ");
    el.modalBody.textContent = p.prompt;
    syncModalFavButton();

    el.modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function syncModalFavButton() {
    const isFav = modalPromptId && state.favorites.has(modalPromptId);
    el.modalFav.innerHTML = isFav
      ? '<span aria-hidden="true">♥</span> Saved to favorites'
      : '<span aria-hidden="true">♡</span> Save to favorites';
  }

  function closeModal() {
    el.modalOverlay.hidden = true;
    modalPromptId = null;
    document.body.style.overflow = "";
  }

  function openRandomModal() {
    const pool = getFilteredPrompts().length ? getFilteredPrompts() : PROMPTS;
    const candidates = pool.length > 1 ? pool.filter((p) => p.id !== modalPromptId) : pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    openModal(pick.id);
  }

  /* ---------------------------------------------------------
     13. GO
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", init);
})();
