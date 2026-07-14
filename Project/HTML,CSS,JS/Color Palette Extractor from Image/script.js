const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const dropContent = document.getElementById("dropContent");
const imagePreview = document.getElementById("imagePreview");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const colorCount = document.getElementById("colorCount");
const colorCountVal = document.getElementById("colorCountVal");
const paletteGrid = document.getElementById("paletteGrid");
const paletteEmpty = document.getElementById("paletteEmpty");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentImage = null;

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function showError(msg) {
  errorState.textContent = msg;
  errorState.classList.remove("hidden");
  setTimeout(() => errorState.classList.add("hidden"), 4000);
}

function extractColors(img, count) {
  const maxSize = 120;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.max(1, Math.floor(img.width * scale));
  canvas.height = Math.max(1, Math.floor(img.height * scale));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buckets = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue;
    const r = Math.round(data[i] / 24) * 24;
    const g = Math.round(data[i + 1] / 24) * 24;
    const b = Math.round(data[i + 2] / 24) * 24;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const sorted = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(",").map(Number));

  const palette = [];
  for (const [r, g, b] of sorted) {
    if (palette.length >= count) break;
    const tooClose = palette.some(([pr, pg, pb]) =>
      Math.abs(pr - r) + Math.abs(pg - g) + Math.abs(pb - b) < 40
    );
    if (!tooClose) palette.push([r, g, b]);
  }
  return palette;
}

function renderPalette(colors) {
  paletteEmpty.classList.toggle("hidden", colors.length > 0);
  paletteGrid.innerHTML = colors.map(([r, g, b]) => {
    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);
    return `
      <article class="color-card">
        <div class="color-swatch" style="background:${hex}"></div>
        <div class="color-info">
          <div class="color-format"><span>HEX</span> ${hex} <button class="copy-btn" data-copy="${hex}">Copy</button></div>
          <div class="color-format"><span>RGB</span> ${rgb} <button class="copy-btn" data-copy="${rgb}">Copy</button></div>
          <div class="color-format"><span>HSL</span> ${hsl} <button class="copy-btn" data-copy="${hsl}">Copy</button></div>
        </div>
      </article>`;
  }).join("");

  paletteGrid.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1200);
      } catch {
        showError("Could not copy to clipboard.");
      }
    });
  });
}

function processImage(img) {
  loadingState.classList.remove("hidden");
  requestAnimationFrame(() => {
    try {
      const colors = extractColors(img, Number(colorCount.value));
      renderPalette(colors);
    } catch {
      showError("Failed to extract colors from this image.");
    }
    loadingState.classList.add("hidden");
  });
}

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showError("Please upload a valid image file (PNG, JPG, WEBP).");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      imagePreview.src = reader.result;
      imagePreview.classList.remove("hidden");
      dropContent.classList.add("hidden");
      processImage(img);
    };
    img.onerror = () => showError("Could not load this image.");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

colorCount.addEventListener("input", () => {
  colorCountVal.textContent = colorCount.value;
  if (currentImage) processImage(currentImage);
});
