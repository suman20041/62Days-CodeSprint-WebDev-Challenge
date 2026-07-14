// Primary framework configuration pairing UI layouts to curriculum folders (Web Dev-focused)
const topicsData = {
    "Fundamentals": {
        mdFile: "Fundamentals Overview.md",
        subtopics: [
            { name: "Basic Syntax", path: "Fundamentals/Basic_Syntax" },
            { name: "Triggers", path: "Fundamentals/Triggers" },
            { name: "Core Services", path: "Fundamentals/Core_Services" }
        ]
    },
    "Google Workspace Integration": {
        mdFile: "Google Workspace Integration Overview.md",
        subtopics: [
            { name: "Working with Google Docs", path: "Google_Workspace_Integration/Google_Docs" },
            { name: "Working with Google Sheets", path: "Google_Workspace_Integration/Google_Sheets" },
            { name: "Working with Google Forms", path: "Google_Workspace_Integration/Google_Forms" },
            { name: "Working with Google Calendar", path: "Google_Workspace_Integration/Google_Calendar" }
        ]
    },
    "Web Apps": {
        mdFile: "Web Apps Overview.md",
        subtopics: [
            { name: "HTML Service Basics", path: "Web_Apps/HTML_Service_Basics" },
            { name: "Server-Client Communication", path: "Web_Apps/Server_Client_Communication" },
        ]
    }
};

const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');
const sidebarTreeWrapper = document.getElementById('sidebar-tree-wrapper');

let globalRepositoryTreeFlatArray = [];

document.addEventListener('DOMContentLoaded', async () => {
    buildDropdownMenus();
    setupInlineContentLinks();
    setupParentTopicLinks();
    await initializeRepositoryTreeMap();
    checkUrlHashRoute();
});

async function initializeRepositoryTreeMap() {
    try {
        const response = await fetch('tree_manifest.json');
        if (!response.ok) throw new Error("Could not find tree_manifest.json. Make sure you have run the `generate_manifest.py` script and are running this site from a local server, not the file system.");
        globalRepositoryTreeFlatArray = await response.json();

        if (!globalRepositoryTreeFlatArray || globalRepositoryTreeFlatArray.length === 0) {
            throw new Error("The `tree_manifest.json` file is empty. Please ensure the `generate_manifest.py` script was run in the correct directory and found your content files.");
        }
    } catch (err) {
        console.error("Blueprint layout generation loading exception:", err);
        const programsContainer = document.getElementById('programs-container');
        const sidebarWrapper = document.getElementById('sidebar-tree-wrapper');
        const errorHtml = `
            <div class="error-text" style="padding: 1rem; border: 1px solid #f75a68; border-radius: 8px;">
                <h3 style="color: #f75a68;">Failed to Load Content</h3>
                <p>There was an error loading the repository's file structure. Please check the developer console for more details.</p>
                <p><strong>Common Causes:</strong></p>
                <ul>
                    <li>The <code>tree_manifest.json</code> file is missing or empty. Try regenerating it by running <code>python3 generate_manifest.py</code>.</li>
                    <li>You are opening this <code>index.html</code> file directly from your computer (e.g., using a <code>file:///</code> URL). This site must be run through a local web server as described in the README.</li>
                </ul>
                <br>
                <p><em>Error details: ${err.message}</em></p>
            </div>
        `;
        if (programsContainer) programsContainer.innerHTML = errorHtml;
        if (sidebarWrapper) sidebarWrapper.innerHTML = `<p class="error-text">Error loading.</p>`;
    }
}

function buildDropdownMenus() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        const topicKey = menu.getAttribute('data-topic');
        const subtopics = topicsData[topicKey].subtopics || [];

        subtopics.forEach(sub => {
            const li = document.createElement('li');
            li.className = 'dropdown-item';
            li.textContent = sub.name;
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.hash = `${encodeURIComponent(topicKey)}:${encodeURIComponent(sub.path)}`;
            });
            menu.appendChild(li);
        });
    });
}

function setupInlineContentLinks() {
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentTopic = link.getAttribute('data-parent');
            const targetPath = link.getAttribute('data-path');
            window.location.hash = `${encodeURIComponent(parentTopic)}:${encodeURIComponent(targetPath)}`;
        });
    });
}

function setupParentTopicLinks() {
    document.querySelectorAll('.nav-topic-title').forEach(titleSpan => {
        titleSpan.addEventListener('click', () => {
            const topicKey = titleSpan.getAttribute('data-topic');
            window.location.hash = `${encodeURIComponent(topicKey)}:all`;
        });
    });
}

function updateBrowserTabTitle(viewName) {
    document.title = `${viewName} | 💻 Ultimate Google Apps Script Repository`;
}

async function checkUrlHashRoute() {
    const currentHash = window.location.hash.replace('#', '');

    // Clear previous selections on any hash change
    document.querySelectorAll('.sidebar-link.selected, .sidebar-sub-link.selected').forEach(link => {
        link.classList.remove('selected');
    });

    if (!currentHash) {
        document.title = "Ultimate Google Apps Script Repository";
        return; 
    }

    if (currentHash.startsWith('section_')) {
        const element = document.getElementById(currentHash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            setTimeout(() => {
                const retryElement = document.getElementById(currentHash);
                if (retryElement) retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }

        // Highlight the corresponding link in the sidebar
        const activeLink = document.querySelector(`a[href="#${currentHash}"]`);
        if (activeLink && (activeLink.classList.contains('sidebar-link') || activeLink.classList.contains('sidebar-sub-link'))) {
            activeLink.classList.add('selected');
        }

        return;
    }

    const segments = currentHash.split(':');
    if (segments.length !== 2) return;

    const topicKey = decodeURIComponent(segments[0]);
    const routeTarget = decodeURIComponent(segments[1]);

    if (!topicsData[topicKey]) return;

    if (routeTarget === 'all') {
        await triggerParentTopicLoad(topicKey);
    } else {
        const sub = topicsData[topicKey].subtopics.find(s => s.path === routeTarget);
        if (sub) await triggerContentLoad(topicKey, sub);
    }
}

window.addEventListener('hashchange', checkUrlHashRoute);

async function triggerParentTopicLoad(topicKey) {
    updateBrowserTabTitle(topicKey);
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = topicKey;
    programsContainer.innerHTML = '<p class="placeholder-text">Rendering overview streams...</p>';
    sidebarTreeWrapper.innerHTML = '';

    const parentObj = topicsData[topicKey];
    const rootUL = document.createElement('ul');
    rootUL.className = 'sidebar-list';
    sidebarTreeWrapper.appendChild(rootUL);

    // Clear the main content area first
    programsContainer.innerHTML = '';

    if (parentObj.mdFile) {
        const safeId = generateSafeElementId(parentObj.mdFile);
        
        // Create sidebar link for the overview
        const sideLI = document.createElement('li');
        sideLI.className = 'sidebar-item';
        sideLI.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link overview-link selected">📖 ${topicKey} Overview</a>`;
        rootUL.appendChild(sideLI);

        // Create a wrapper for the overview content that can be targeted by the hash
        const contentWrapper = document.createElement('div');
        contentWrapper.id = safeId;
        programsContainer.appendChild(contentWrapper);
        await fetchAndRenderCode(parentObj.mdFile, parentObj.mdFile, contentWrapper);
    }

    for (const sub of parentObj.subtopics) {
        const parentSafeId = generateSafeElementId(sub.path);
        const masterLI = document.createElement('li');
        masterLI.className = 'sidebar-item';
        masterLI.style.marginTop = "1rem";

        const headerRow = document.createElement('div');
        headerRow.className = 'sidebar-header-row';
        headerRow.innerHTML = `<span class="arrow-icon expanded">▼</span><a href="#${parentSafeId}" class="sidebar-link" style="color: #ffffff;">💡 ${sub.name}</a>`;

        const subUL = document.createElement('ul');
        subUL.className = 'sidebar-nested-sublist show';

        headerRow.addEventListener('click', (e) => {
            const arrow = headerRow.querySelector('.arrow-icon');
            if (arrow) arrow.classList.toggle('expanded');
            subUL.classList.toggle('show');
            window.location.hash = parentSafeId;
        });

        const interiorLink = headerRow.querySelector('.sidebar-link');
        if (interiorLink) {
            interiorLink.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }

        masterLI.appendChild(headerRow);
        masterLI.appendChild(subUL);
        rootUL.appendChild(masterLI);

        const subTopicDivider = document.createElement('h2');
        subTopicDivider.id = parentSafeId;
        subTopicDivider.className = 'nested-folder-title';
        subTopicDivider.style.fontSize = '1.6rem';
        subTopicDivider.style.borderBottom = '3px solid #4df3a9';
        subTopicDivider.textContent = sub.name;
        programsContainer.appendChild(subTopicDivider);

        const containerWrapper = document.createElement('div');
        programsContainer.appendChild(containerWrapper);

        await resolveAndBuildContent(sub.path, containerWrapper, subUL, sub.preferredOrder || []);
    }
}

async function triggerContentLoad(topicKey, subtopicObj) {
    updateBrowserTabTitle(subtopicObj.name);
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = `${topicKey} ➔ ${subtopicObj.name}`;
    programsContainer.innerHTML = '<p class="placeholder-text">Rendering resources...</p>';
    sidebarTreeWrapper.innerHTML = '';
    
    const rootUL = document.createElement('ul');
    rootUL.className = 'sidebar-list';
    sidebarTreeWrapper.appendChild(rootUL);

    programsContainer.innerHTML = '';
    await resolveAndBuildContent(subtopicObj.path, programsContainer, rootUL, subtopicObj.preferredOrder || []);
}

function cleanDisplayName(rawName) {
    return rawName.replace(/\.(java|md|png|jpg|jpeg)$/i, '').replace(/^\d+_/g, '');
}

function getLanguageFromFileName(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'js': return 'javascript';
        case 'html': return 'markup'; // Prism.js uses 'markup' for HTML
        case 'css': return 'css';
        case 'php': return 'php';
        case 'md': return 'markdown';
        case 'sql': return 'sql';
        default: return 'clike'; // A sensible default
    }
}

function getSectionHeadingForFile(filePath, fileName) {
    const cleanName = cleanDisplayName(fileName);
    return cleanName;
}

function generateSafeElementId(rawString) {
    return 'section_' + rawString.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

async function resolveAndBuildContent(folderPath, targetContainer, currentSidebarUL, preferredOrder = []) {
    const prefix = folderPath + "/";
    
    let immediateContents = globalRepositoryTreeFlatArray.filter(item => {
        if (!item.path.startsWith(prefix)) return false;
        const relativePart = item.path.substring(prefix.length);
        return !relativePart.includes('/');
    });

    if (preferredOrder.length > 0) {
        immediateContents.sort((a, b) => {
            const nameA = a.path.split('/').pop();
            const nameB = b.path.split('/').pop();
            const cleanA = cleanDisplayName(nameA);
            const cleanB = cleanDisplayName(nameB);

            let idxA = preferredOrder.findIndex(r => r === nameA || r === cleanA);
            let idxB = preferredOrder.findIndex(r => r === nameB || r === cleanB);

            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return nameA.localeCompare(nameB);
        });
    }

    // If there's a .md file in this folder, skip standalone .png blobs (they're embedded in the markdown)
    const hasMarkdown = immediateContents.some(i => i.type === "blob" && i.path.toLowerCase().endsWith('.md'));
    
    for (const item of immediateContents) {
        const itemRealName = item.path.split('/').pop();
        const safeId = generateSafeElementId(item.path);
        const displayName = cleanDisplayName(itemRealName);

        if (item.type === "blob") { 
            const lowerName = itemRealName.toLowerCase();
            const isCodeFile = lowerName.endsWith('.html') || lowerName.endsWith('.css') || lowerName.endsWith('.js') || lowerName.endsWith('.php') || lowerName.endsWith('.sql');
            const isMarkdown = lowerName.endsWith('.md');
            const isImage = lowerName.endsWith('.png');

            if (isCodeFile || isMarkdown || isImage) {
                
                // Skip PNGs if there's a markdown file in the same folder (images are embedded in MD)
                if (isImage && hasMarkdown) continue;

                // Create sidebar link
                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link">📄 ${displayName}</a>`;
                currentSidebarUL.appendChild(li);

                if (isCodeFile || isMarkdown) {
                    await fetchAndRenderCode(itemRealName, item.path, targetContainer, safeId);
                } else if (isImage) {
                    renderImageBlock(itemRealName, item.path, targetContainer, safeId);
                }
            }
        } 
        else if (item.type === "tree") { 
            const internalChildren = globalRepositoryTreeFlatArray.filter(child => child.path.startsWith(item.path + "/"));
            
            // Determine if this folder has a markdown file (PNGs alongside it are embedded, so skip them)
            const hasMd = internalChildren.some(c => c.type === "blob" && c.path.toLowerCase().endsWith('.md'));
            const nonPngBlobs = internalChildren.filter(c => c.type === "blob" && !c.path.toLowerCase().endsWith('.png'));

            // Single-file folder flattening mechanic:
            // Also flatten if there's exactly 1 .md/.py file and all other blobs are PNGs (embedded in markdown)
            // Exception: never flatten the Event Handling folder — this keeps "On Mouse Click" under an "Event Handling" folder
            const shouldFlatten = 
                (internalChildren.length === 1 && internalChildren[0].type === "blob") || (hasMd && nonPngBlobs.length === 1 && nonPngBlobs[0].type === "blob");

            if (shouldFlatten) {
                const singleItem = hasMd ? nonPngBlobs[0] : internalChildren.find(c => c.type === "blob");
                const singleRealName = singleItem.path.split('/').pop();
                const singleSafeId = generateSafeElementId(singleItem.path);
                const singleDisplayName = cleanDisplayName(singleRealName);

                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.innerHTML = `<a href="#${singleSafeId}" class="sidebar-sub-link">📄 ${singleDisplayName}</a>`;
                currentSidebarUL.appendChild(li);

                const singleLowerName = singleRealName.toLowerCase();
                const isSingleCodeFile = singleLowerName.endsWith('.html') || singleLowerName.endsWith('.css') || singleLowerName.endsWith('.js') || singleLowerName.endsWith('.php') || singleLowerName.endsWith('.sql');
                const isSingleMarkdown = singleLowerName.endsWith('.md');
                const isSingleImage = singleLowerName.endsWith('.png');

                if (isSingleCodeFile || isSingleMarkdown) {
                    await fetchAndRenderCode(singleRealName, singleItem.path, targetContainer, singleSafeId);
                } else if (isSingleImage) {
                    renderImageBlock(singleRealName, singleItem.path, targetContainer, singleSafeId);
                }
            } else {
                // Multi-program dropdown folder layout
                const masterLI = document.createElement('li');
                masterLI.className = 'sidebar-item';
                
                const headerRow = document.createElement('div');
                headerRow.className = 'sidebar-header-row';
                // Style adjustment to make the row surface visually feel like an active button layout option
                headerRow.style.cursor = 'pointer'; 
                headerRow.innerHTML = `<span class="arrow-icon">▶</span><a href="#${safeId}" class="sidebar-link">📁 ${displayName}</a>`;
                
                const subUL = document.createElement('ul');
                subUL.className = 'sidebar-nested-sublist';
                
                // Clicking anywhere on the entire container option now navigates and expands the dropdown menu list
                headerRow.addEventListener('click', (e) => {
                    const arrow = headerRow.querySelector('.arrow-icon');
                    if (arrow) arrow.classList.toggle('expanded');
                    subUL.classList.toggle('show');
                    
                    // Manually trigger hash relocation navigation jump when row box panel target surfaces are clicked
                    window.location.hash = safeId;
                });

                // Prevent the raw text link inside from causing double route tracking jumps
                const interiorLink = headerRow.querySelector('.sidebar-link');
                if (interiorLink) {
                    interiorLink.addEventListener('click', (e) => {
                        e.preventDefault();
                    });
                }

                masterLI.appendChild(headerRow);
                masterLI.appendChild(subUL);
                currentSidebarUL.appendChild(masterLI);

                const subHeading = document.createElement('h3');
                subHeading.className = 'nested-folder-title';
                subHeading.id = safeId;
                subHeading.textContent = `📁 ${displayName}`;
                targetContainer.appendChild(subHeading);

                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = 'nested-group-container';
                targetContainer.appendChild(nestedGroupContainer);

                await resolveAndBuildContent(item.path, nestedGroupContainer, subUL, []);
            }
        }
    }
}

async function fetchAndRenderCode(fileName, downloadUrl, containerElement, elementId) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("File content mismatch.");
        const textData = await response.text();

        const block = document.createElement('div');
        block.className = 'program-block';
        block.id = elementId;

        const header = document.createElement('div');
        header.className = 'program-header';
        header.textContent = cleanDisplayName(fileName);
        block.appendChild(header);

        if (fileName.toLowerCase().endsWith('.md')) {
            // For markdown, we just render the content.
            const mdWrapper = document.createElement('div');
            mdWrapper.className = 'markdown-body-render';
            mdWrapper.innerHTML = marked.parse(textData);
            block.appendChild(mdWrapper);
            containerElement.appendChild(block);
        } else {
            const lang = getLanguageFromFileName(fileName);
            const pre = document.createElement('pre');
            pre.className = `language-${lang}`; 
            
            const code = document.createElement('code');
            code.className = `language-${lang}`;
            code.textContent = textData; 

            pre.appendChild(code);
            block.appendChild(pre);
            containerElement.appendChild(block);

            // Highlight the element *after* it has been added to the DOM.
            Prism.highlightElement(code);
        }
    } catch (err) {
        console.error(err);
    }
}

function renderImageBlock(fileName, downloadUrl, containerElement, elementId) {
    const block = document.createElement('div');
    block.className = 'program-block repo-image-block';
    block.id = elementId;
    block.style.padding = '1.5rem';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';
    block.style.gap = '1rem';
    block.style.alignItems = 'center';
    block.style.borderRadius = '0';

    const header = document.createElement('div');
    header.className = 'program-header';
    header.style.width = '100%';
    header.style.margin = '-1.5rem -1.5rem 0 -1.5rem';
    header.style.padding = '0.85rem 1.5rem';
    header.textContent = cleanDisplayName(fileName);

    const img = document.createElement('img');
    img.src = downloadUrl;
    img.alt = fileName;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '0';
    img.style.border = '1px solid #1c2541';

    block.appendChild(header);
    block.appendChild(img);
    containerElement.appendChild(block);
}

// --- To Top Button ---
const toTopBtn = document.getElementById('to-top');

toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        toTopBtn.classList.add('visible');
    } else {
        toTopBtn.classList.remove('visible');
    }
});