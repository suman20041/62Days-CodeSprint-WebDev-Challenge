const SAMPLE_RESUME = `# Jane Doe

**Email:** jane.doe@email.com | **Phone:** +91 98765 43210 | **LinkedIn:** linkedin.com/in/janedoe

## Summary

Motivated Computer Science graduate with hands-on experience in frontend and full-stack web development. Passionate about building clean, accessible, and user-friendly applications.

## Skills

- HTML, CSS, JavaScript, React
- Node.js, Express, MongoDB
- Git, GitHub, REST APIs
- Responsive Design, UI/UX Basics

## Experience

### Frontend Developer Intern — Tech Solutions Pvt. Ltd.
*Jan 2025 – Jun 2025*

- Built responsive landing pages using HTML, CSS, and JavaScript
- Collaborated with a team of 4 on a MERN stack internal dashboard
- Improved page load time by 20% through image optimization

### Open Source Contributor — SSoC'26
*Mar 2026 – Present*

- Contributed beginner-friendly web projects to open-source repositories
- Wrote clean documentation and followed Git best practices

## Education

### B.Tech in Computer Science
*GIET University, Gunupur — 2026*

- CGPA: 8.5 / 10
- Relevant coursework: Data Structures, Web Development, DBMS

## Projects

### Markdown Resume Builder
- Live preview resume editor with print-ready PDF output

### To-Do List App
- Task manager with local storage persistence
`;

const markdownInput = document.getElementById("markdownInput");
const resumePreview = document.getElementById("resumePreview");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");
const printBtn = document.getElementById("printBtn");

marked.setOptions({ breaks: true, gfm: true });

function renderPreview() {
  const text = markdownInput.value.trim();

  if (!text) {
    resumePreview.innerHTML =
      '<p class="resume-empty">Start typing on the left to see your resume preview here.</p>';
    return;
  }

  resumePreview.innerHTML = `<div class="resume-page">${marked.parse(text)}</div>`;
}

sampleBtn.addEventListener("click", () => {
  markdownInput.value = SAMPLE_RESUME;
  renderPreview();
});

clearBtn.addEventListener("click", () => {
  markdownInput.value = "";
  renderPreview();
  markdownInput.focus();
});

printBtn.addEventListener("click", () => {
  if (!markdownInput.value.trim()) {
    alert("Please write or load a resume before printing.");
    return;
  }
  window.print();
});

markdownInput.addEventListener("input", renderPreview);

markdownInput.value = SAMPLE_RESUME;
renderPreview();
