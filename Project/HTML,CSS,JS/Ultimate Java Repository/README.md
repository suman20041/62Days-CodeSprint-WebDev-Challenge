<div align="center">
    
# ♨️ Ultimate Java Repository 📖

> An interactive static website for learning and browsing structured Java programs — with syntax-highlighted code, rendered markdown guides, and a clean, searchable layout.

</div>

<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=white" alt="C">
    <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Markdown">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License">
</p>

---

<img width="1313" height="924" alt="image" src="https://github.com/user-attachments/assets/57bec857-5636-4503-8111-c0410695d818" />

<img width="1313" height="924" alt="image" src="https://github.com/user-attachments/assets/3c0700f5-c21f-41e8-bfc7-580856630241" />

<img width="1313" height="924" alt="image" src="https://github.com/user-attachments/assets/d008ffb9-883a-42ef-b01f-a6932046947b" />

<img width="1313" height="924" alt="image" src="https://github.com/user-attachments/assets/70523e5e-2656-44b7-bde6-eb2b37f381cf" />

<img width="1313" height="924" alt="image" src="https://github.com/user-attachments/assets/bf784239-de3d-4b80-93ad-3e9b55421a40" />

---

## ✨ About

This website serves as a **visual, interactive documentation platform** for Java programs. Instead of browsing raw files on GitHub, you get:

- **Syntax-highlighted Java code** rendered directly from the source files
- **Rendered Markdown guides** for conceptual topics
- **Accordion sidebar navigation** with expandable folders
- **Dropdown topic menus** for jumping between subjects
- **Brutalist dark UI** with scanline animations

---

## 🎯 Features

| Feature | Description |
|---|---|
| **Live Code Rendering** | C `.c` files are fetched and displayed with Prism.js syntax highlighting |
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
| [Prism.js](https://prismjs.com/) | Syntax highlighting for source code files (Java) | <img src="https://img.shields.io/badge/Prism.js-1E2A3A?style=for-the-badge&logo=javascript&logoColor=white" alt="Prism.js" width="100"> |
| **`tree_manifest.json`** | Flat-array file tree used by the frontend to render the sidebar and content | <img src="https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white" alt="JSON" width="80"> |

---

## 🗂️ Project Structure

The repository is organized around Java topics and subtopics. Each top-level topic has an overview `.md` file and folders containing the standalone Java programs shown in the sidebar on the website.

Top-level topics and their subtopics used in this repo:

- **🛠️ Core Foundations**
   - Variables
   - Type Casting
   - Access Modifiers
   - Wrapper Classes
   - Auto-Boxing and Auto-Unboxing
- **Conditional and Looping Statements**
   - Conditional Statements
   - Looping Statements
- **Data Structures**
   - Arrays
   - Strings
   - Methods
- **Object-Oriented Programming (OOP)**
   - Classes
   - Objects
   - Constructors
   - Inheritance
   - Interfaces
   - Polymorphism
   - Method Overloading and Overriding
   - Exception Handling
   - Threads and Runnable
- **Java Database Connectivity (JDBC)**
- **General Examples**

Files of interest (examples present in this workspace):

- `Access_Modifiers.java`
- `Auto_Boxing_and_Auto_Unboxing.java`
- `Type_Casting.java`
- `Variables.java`
- `Wrapper_Class.java`

Each topic folder contains either:
- Single `.java` files (directly rendered with syntax highlighting)
- A `.md` file (rendered as HTML)
- Multiple files in subdirectories (shown as expandable sidebar groups)

---

## 🚀 How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/abhisek2004/62Days-CodeSprint-WebDev-Challenge/Project/HTML,CSS,JS/Ultimate-Java-Repository.git
cd "Ultimate-Java-Repository"
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
   - `.c` → fetched with `fetch()`, displayed inside a `<pre><code>` block, then highlighted with `Prism.highlightElement()`
   - `.md` → fetched and parsed with `marked.parse()`, rendered as HTML
   - `.png` → displayed as an `<img>` tag
   - Folders → recursively expanded with accordion controls

5. **Navigation State** — The browser's hashchange event keeps the URL in sync, enabling bookmarking and back/forward navigation.

---

## ✏️ Adding New Content

1. **Add a new subtopic folder** (e.g., `NewTopic/SubFolder/`) with your `.java`, `.md`, or image files.
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

<div align="center">
    Made with ⚙️ and 💜
</div>
