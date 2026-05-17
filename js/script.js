document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Modules
    initThemeEngine();
    initMobileNav();
    initCodeCopyButtons();
    initMermaidDiagrams();
});

/**
 * Theme Engine: Manages Light/Dark Mode switches and state persistence
 */
function initThemeEngine() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check for saved preference, otherwise default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(toggleBtn, savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(toggleBtn, newTheme);
        
        // Reload Mermaid diagrams if applicable to recalculate theme colors
        if (window.mermaid) {
            location.reload();
        }
    });
}

function updateToggleIcon(btn, theme) {
    // Plain text/unicode representations to avoid heavy SVGs or CDN calls
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
}

/**
 * Mobile Navigation Menu Hamburger Toggle
 */
function initMobileNav() {
    const hamburger = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    });
}

/**
 * Clipboard Integration: Dynamically binds copy buttons to formatting containers
 */
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach((block) => {
        // Prevent adding buttons inside Mermaid diagrams
        if (block.classList.contains('mermaid')) return;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.type = 'button';
        button.innerText = 'Copy';

        block.appendChild(button);

        button.addEventListener('click', async () => {
            const codeElement = block.querySelector('code');
            const textToCopy = codeElement ? codeElement.innerText : block.innerText.replace('Copy', '').trim();

            try {
                await navigator.clipboard.writeText(textToCopy);
                button.innerText = 'Copied!';
                button.style.backgroundColor = 'var(--accent-success)';
                button.style.color = '#ffffff';
                
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.style.backgroundColor = '';
                    button.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                button.innerText = 'Error';
            }
        });
    });
}

/**
 * Mermaid.js Initialization Configuration
 */
function initMermaidDiagrams() {
    if (typeof mermaid !== 'undefined') {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        mermaid.initialize({
            startOnLoad: true,
            theme: currentTheme === 'light' ? 'default' : 'dark',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
    }
}