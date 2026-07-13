const DATA = {
  html: {
    label: "HTML / CSS / JS",
    checklist: [
      "Fork the repository and clone it locally",
      "Create a new branch for your feature",
      "Add project under Project/HTML,CSS,JS/Your-Project-Name",
      "Include index.html, style.css, script.js (if needed)",
      "Add a README.md with features and how to run",
      "Test by opening index.html in a browser",
      "Ensure no console errors or broken links",
      "Do NOT commit node_modules or .env files",
      "Write a clear commit message",
      "Push to your fork and open a Pull Request",
      "Add project name, tech stack, and screenshot in PR description",
    ],
    commits: {
      feat: "feat: add Weather App under HTML,CSS,JS",
      fix: "fix: resolve responsive layout issue in portfolio page",
      docs: "docs: add README and setup instructions for Quiz App",
      refactor: "refactor: clean up CSS and improve code structure",
    },
  },
  react: {
    label: "React",
    checklist: [
      "Fork the repo and clone locally",
      "Create a feature branch (e.g. feature/my-react-app)",
      "Add project under Project/MERN/ or appropriate folder",
      "Include package.json with correct dependencies",
      "Add README.md with npm install and npm run dev steps",
      "Ensure npm run build completes without errors",
      "Do NOT commit node_modules, .env, or build/dist folders",
      "Use meaningful component and file names",
      "Test all routes and features locally",
      "Push changes and open a PR with description and screenshot",
      "Reference related issue number if applicable (e.g. #123)",
    ],
    commits: {
      feat: "feat: add Task Manager React app with local storage",
      fix: "fix: resolve state update bug in todo component",
      docs: "docs: update README with React setup instructions",
      refactor: "refactor: extract reusable Button component",
    },
  },
  mern: {
    label: "MERN Stack",
    checklist: [
      "Fork and clone the repository",
      "Create a dedicated branch for your MERN project",
      "Add frontend and backend in separate folders",
      "Include .env.example (never commit real .env)",
      "Add README with MongoDB Atlas setup instructions",
      "Document all API endpoints in README",
      "Test frontend + backend integration locally",
      "Ensure JWT/auth flows work correctly",
      "Do NOT commit API keys, passwords, or node_modules",
      "Verify npm install works in both client and server",
      "Open PR with tech stack, features, and screenshots",
    ],
    commits: {
      feat: "feat: add MERN blog platform with auth and CRUD",
      fix: "fix: resolve MongoDB connection error in server",
      docs: "docs: add API documentation and .env.example",
      refactor: "refactor: organize routes and middleware structure",
    },
  },
  node: {
    label: "Node.js / Express",
    checklist: [
      "Fork the repository and clone locally",
      "Create a new branch for your backend project",
      "Add server code with clear folder structure",
      "Include package.json and .env.example",
      "Document all routes and request/response formats",
      "Test APIs with Postman or curl",
      "Add input validation and error handling",
      "Do NOT commit secrets or node_modules",
      "Ensure server starts without errors",
      "Add README with setup and run instructions",
      "Submit PR with endpoint list and usage examples",
    ],
    commits: {
      feat: "feat: add REST API for URL shortener service",
      fix: "fix: handle invalid request body in auth route",
      docs: "docs: add Postman collection and API guide",
      refactor: "refactor: split controllers and route handlers",
    },
  },
  docs: {
    label: "Documentation",
    checklist: [
      "Fork the repository and clone locally",
      "Create a branch for documentation changes",
      "Fix typos, unclear steps, or missing info only",
      "Do NOT modify unrelated code or project files",
      "Keep language clear and beginner-friendly",
      "Preview markdown formatting before submitting",
      "Follow existing documentation style",
      "Reference the file/section you improved in PR",
      "Use docs: prefix in commit message",
      "Keep changes focused — one topic per PR",
      "Open PR describing what was improved and why",
    ],
    commits: {
      feat: "docs: add contribution guide for first-time contributors",
      fix: "docs: fix broken links in INSTALL.md",
      docs: "docs: improve README setup instructions",
      refactor: "docs: reorganize FAQ section for clarity",
    },
  },
};

const TIPS = [
  "Always pull the latest changes from main before starting work.",
  "Keep PRs small and focused — one feature or fix per PR.",
  "Write commit messages in present tense: 'add feature' not 'added feature'.",
  "Include screenshots or GIFs for any UI changes.",
  "Respond politely to reviewer feedback and make requested changes.",
  "Never force-push to shared branches unless explicitly asked.",
  "Reference issue numbers in PR title or description (e.g. #152 issue resolved).",
  "If your PR modifies core code without reason, it may be rejected.",
];

const projectType = document.getElementById("projectType");
const generateBtn = document.getElementById("generateBtn");
const checklist = document.getElementById("checklist");
const commitTemplates = document.getElementById("commitTemplates");
const tipsList = document.getElementById("tipsList");
const copyChecklistBtn = document.getElementById("copyChecklistBtn");
const copyCommitsBtn = document.getElementById("copyCommitsBtn");

function generate() {
  const type = projectType.value;
  const data = DATA[type];

  checklist.innerHTML = data.checklist
    .map((item) => `<li>${item}</li>`)
    .join("");

  commitTemplates.innerHTML = Object.entries(data.commits)
    .map(
      ([key, msg]) => `
      <div class="commit-card">
        <div class="type">${key}</div>
        <code>${msg}</code>
      </div>`
    )
    .join("");

  tipsList.innerHTML = TIPS.map((t) => `<li>${t}</li>`).join("");
}

function getChecklistText() {
  const type = projectType.value;
  const data = DATA[type];
  const lines = [`Open Source PR Checklist — ${data.label}`, ""];
  data.checklist.forEach((item, i) => lines.push(`${i + 1}. [ ] ${item}`));
  return lines.join("\n");
}

function getCommitsText() {
  const type = projectType.value;
  const data = DATA[type];
  const lines = [`Commit Message Templates — ${data.label}`, ""];
  Object.entries(data.commits).forEach(([key, msg]) => lines.push(`${key}: ${msg}`));
  return lines.join("\n");
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove("copied");
    }, 1500);
  } catch {
    alert("Could not copy. Please select and copy manually.");
  }
}

generateBtn.addEventListener("click", generate);
projectType.addEventListener("change", generate);

copyChecklistBtn.addEventListener("click", () => copyText(getChecklistText(), copyChecklistBtn));
copyCommitsBtn.addEventListener("click", () => copyText(getCommitsText(), copyCommitsBtn));

generate();
