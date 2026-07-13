<div align="center">
    
# 💻 Ultimate Web Dev Repository 📖

> An interactive static website for learning and browsing structured HTML, CSS, JavaScript, and PHP programs — with syntax-highlighted code, rendered markdown guides, and a clean, searchable layout.

</div>

<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
    <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Markdown">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License">
</p>

---

<img width="1631" height="923" alt="image" src="https://github.com/user-attachments/assets/8897b63a-fd66-4318-933c-e6be7c3770d6" />

<img width="1631" height="923" alt="image" src="https://github.com/user-attachments/assets/69efcb5d-0190-4a59-a37f-934e465105d3" />

<img width="1631" height="923" alt="image" src="https://github.com/user-attachments/assets/3d6d2fd8-de83-4d25-b648-93f011599b2e" />

<img width="1631" height="923" alt="image" src="https://github.com/user-attachments/assets/30a913a8-c0a0-4ca1-925b-ce74c3cae175" />

<img width="1631" height="923" alt="image" src="https://github.com/user-attachments/assets/030c8063-3ac4-4406-91fb-e89d99ce50a8" />

---

## ✨ About

This website serves as a **visual, interactive documentation platform** for web development code. Instead of browsing raw files on GitHub, you get:

- **Syntax-highlighted code** (`.html`, `.css`, `.js`, `.php`) rendered directly from the source files
- **Rendered Markdown guides** for conceptual topics
- **Accordion sidebar navigation** with expandable folders
- **Dropdown topic menus** for jumping between subjects
- **Brutalist dark UI** with scanline animations

---

## 🎯 Features

| Feature | Description |
|---|---|
| **Live Code Rendering** | Source code files (`.html`, `.css`, `.js`, `.php`) are fetched and displayed with Prism.js syntax highlighting |
| **Markdown Rendering** | `.md` overview files are parsed with `marked` and displayed as styled HTML |
| **Nested Sidebar Navigation** | Accordion-style tree matching the repository's folder structure |
| **Topic Dropdowns** | Quick navigation via hover-reveal menus in the header |
| **URL Hash Routing** | Direct deep-linking to any subtopic or file via `#Topic:SubTopic` |
| **Flat File Flattening** | Single-file folders display inline without unnecessary nesting |
| **Responsive Layout** | Two-column desktop layout collapses to single column on mobile |
| **Brutalist Dark Theme** | Black/dark navy background, neon green accents, scanline overlay animation |

---

## 🛠️ Tech Stack

| Technology | Purpose | Badge |
|---|---|---|
| **HTML5** | Page structure and semantic markup | <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" width="100"> |
| **CSS3** | All styling (brutalist dark theme, layout, responsive design) | <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" width="90"> |
| **JavaScript (Vanilla)** | Core application logic — routing, sidebar, content fetching and rendering | <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" width="110"> |
| **Python** | `generate_manifest.py` — walks the repo and produces `tree_manifest.json` | <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" width="100"> |
| [marked.js](https://marked.js.org/) | Markdown → HTML parsing for `.md` overview files | <img src="https://img.shields.io/badge/marked.js-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="marked.js" width="100"> |
| Prism.js | Syntax highlighting for source code files (HTML, CSS, JS, PHP) | <img src="https://img.shields.io/badge/Prism.js-1E2A3A?style=for-the-badge&logo=javascript&logoColor=white" alt="Prism.js" width="100"> |
| **`tree_manifest.json`** | Flat-array file tree used by the frontend to render the sidebar and content | <img src="https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white" alt="JSON" width="80"> |

---

## 🗂️ Project Structure

The repository is organized around web development topics. Each top-level topic has an overview `.md` file and folders containing the standalone code examples shown in the sidebar on the website.

Top-level topics and their subtopics are:

- **HTML/CSS**
   - HTML Basics
   - CSS Fundamentals
   - Layouts (Flexbox & Grid)
   - Responsive Design
   - Examples
- **JavaScript**
   - Core Concepts
   - DOM Manipulation
   - Asynchronous JavaScript
   - ES6+ Features
   - Examples
- **PHP**
   - PHP Syntax
   - Form Handling
   - Database with MySQL

Each topic folder contains either:
- Single code files (e.g., `.html`, `.js`, `.php`) which are rendered with syntax highlighting.
- A `.md` file (rendered as HTML)
- Multiple files in subdirectories (shown as expandable sidebar groups)

---

## 🚀 How to Run

### 1. Clone the Repository

```bash
git clone <this-repo-url>
cd "Ultimate-Web-Dev-Repository"
```

### 2. Regenerate the File Manifest (Optional)

If you add, remove, or rename files, regenerate the tree index:

```bash
python3 generate_manifest.py
```

This overwrites `tree_manifest.json` so the frontend knows about the new structure.

### 3. Serve the Site Locally

The frontend fetches files from the repo, so serve over HTTP when testing locally.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 🧩 How It Works

1. **Manifest Generation** — `generate_manifest.py` walks the repository directory tree and writes a flat array of `{ path, type }` objects to `tree_manifest.json`. Each entry is either `"blob"` (file) or `"tree"` (directory).

2. **Initialization** — On page load, `script.js`:
   - Fetches `tree_manifest.json`
   - Builds the dropdown navigation from `topicsData` (the map of topic names → subtopics)
   - Listens for URL hash changes

3. **Navigation** — Clicking a topic or subtopic:
   - Sets `window.location.hash` to `TopicName:SubTopicPath`
   - `checkUrlHashRoute()` parses the hash and calls `triggerContentLoad()` or `triggerParentTopicLoad()`
   - The sidebar and main content area are rebuilt via `resolveAndBuildContent()`

4. **Content Rendering** — For each file in the current subtree:
   - `.html`/`.css`/`.js`/`.php` → fetched with `fetch()`, displayed inside a `<pre><code>` block, then highlighted with `Prism.highlightElement()`
   - `.md` → fetched and parsed with `marked.parse()`, rendered as HTML
   - Folders → recursively expanded with accordion controls

5. **Navigation State** — The browser's hashchange event keeps the URL in sync, enabling bookmarking and back/forward navigation.

---

## ✏️ Adding New Content

1. **Add a new subtopic folder** (e.g., `NewTopic/SubFolder/`) with your `.html`/`.css`/`.js`/`.php`, `.md`, or `.png` files.
2. **Register the subtopic** in `script.js` under the `topicsData` object, specifying the parent topic and optionally a `preferredOrder` array for sidebar sorting.
3. **Regenerate the manifest:**

```bash
python3 generate_manifest.py
```

4. **Update the topic overview `.md` file** if needed.
5. **Serve and verify** — the new content appears in the sidebar and is rendered on click.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

Project added by [**rhalbhavi**](github.com/rhalbhavi)
