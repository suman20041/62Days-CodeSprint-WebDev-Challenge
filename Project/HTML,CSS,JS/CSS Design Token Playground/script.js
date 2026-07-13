const DEFAULTS = {
  "--color-primary": "#2563eb",
  "--color-secondary": "#7c3aed",
  "--color-bg": "#f8fafc",
  "--color-surface": "#ffffff",
  "--color-text": "#1e293b",
  "--color-muted": "#64748b",
  "--space-xs": "4",
  "--space-sm": "8",
  "--space-md": "16",
  "--space-lg": "24",
  "--space-xl": "32",
  "--font-family": "'Segoe UI', system-ui, sans-serif",
  "--font-size-base": "16",
  "--font-size-heading": "28",
  "--radius": "8",
};

const SPACING_TOKENS = new Set([
  "--space-xs", "--space-sm", "--space-md", "--space-lg", "--space-xl",
  "--font-size-base", "--font-size-heading", "--radius",
]);

const root = document.documentElement;
const tokenOutput = document.getElementById("tokenOutput");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");

function applyToken(name, value) {
  const cssValue = SPACING_TOKENS.has(name) ? `${value}px` : value;
  root.style.setProperty(name, cssValue);
}

function updateLabel(name, value) {
  const label = document.querySelector(`.val[data-for="${name}"]`);
  if (label) label.textContent = SPACING_TOKENS.has(name) ? `${value}px` : value;
}

function generateCSS() {
  const lines = [":root {"];
  for (const [key, val] of Object.entries(DEFAULTS)) {
    const current = SPACING_TOKENS.has(key)
      ? root.style.getPropertyValue(key) || `${val}px`
      : root.style.getPropertyValue(key) || val;
    lines.push(`  ${key}: ${current};`);
  }
  lines.push("}");
  tokenOutput.textContent = lines.join("\n");
}

function syncFromInputs() {
  document.querySelectorAll("[data-token]").forEach((input) => {
    const token = input.dataset.token;
    const value = input.value;
    applyToken(token, value);
    updateLabel(token, value);
  });
  generateCSS();
}

function resetTokens() {
  document.querySelectorAll("[data-token]").forEach((input) => {
    const token = input.dataset.token;
    const value = DEFAULTS[token];
    input.value = value;
    applyToken(token, value);
    updateLabel(token, value);
  });
  generateCSS();
}

document.querySelectorAll("[data-token]").forEach((input) => {
  input.addEventListener("input", () => {
    applyToken(input.dataset.token, input.value);
    updateLabel(input.dataset.token, input.value);
    generateCSS();
  });
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(tokenOutput.textContent);
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = "Copy Tokens"; }, 1500);
  } catch {
    alert("Could not copy. Please select and copy manually.");
  }
});

resetBtn.addEventListener("click", resetTokens);

syncFromInputs();
