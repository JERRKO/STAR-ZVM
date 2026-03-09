/* ========================================
   MILITARY RP - Core Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* Falling Meteors & Parallax Effect have been disabled to keep the site clean and static. */

    // ========================================
    // Scroll Reveal Animation (About Section)
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.about-content, .about-photo, .reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    // ========================================
    // Preloader
    // ========================================
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (!preloader) return;
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.remove();
        }, 600);
    }
    
    // Скрываем прелоадер после загрузки
    window.addEventListener('load', () => {
        hidePreloader();
    });

    // Safety timeout
    setTimeout(hidePreloader, 2500);

    // ========================================
    // Back to Top Button
    // ========================================
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Header Scroll Effect (Transparent -> Solid)
    // ========================================
    const header = document.getElementById('mainHeader');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // Mobile Menu (Hamburger)
    // ========================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const fullscreenMenu = document.getElementById('fullscreenMenu');

    if (hamburgerBtn && fullscreenMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            fullscreenMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking links
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                fullscreenMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // ========================================
    // Sidebar Group Collapse (Mobile/Tablet)
    // ========================================
    const sidebarTitles = document.querySelectorAll('.sidebar-title');
    sidebarTitles.forEach(title => {
        title.addEventListener('click', () => {
            const group = title.closest('.sidebar-group');
            if (group) {
                group.classList.toggle('collapsed');
            }
        });
    });
});


/* ========================================
   DOCS SPA LOGIC (Rules Page)
   ======================================== */

// Global function to be called from HTML onclick
window.showRuleSection = function(sectionId, linkElement) {
    console.log('Switching to section:', sectionId);

    // 1. Hide all sections
    const sections = document.querySelectorAll('.rule-section-content');
    sections.forEach(sec => sec.classList.remove('active'));

    // 2. Show target section
    const target = document.getElementById('section-' + sectionId);
    if (target) {
        target.classList.add('active');
        // Scroll Main Content container to top
        const contentContainer = document.querySelector('.docs-content');
        if (contentContainer) contentContainer.scrollTop = 0;
    } else {
        console.error('Target section not found:', 'section-' + sectionId);
    }

    // 3. Update Sidebar Active State
    const links = document.querySelectorAll('.docs-sidebar .sidebar-link');
    links.forEach(link => link.classList.remove('active'));
    
    // If linkElement is passed (clicked), use it. 
    if (linkElement) {
        linkElement.classList.add('active');
    }

    // 4. Regenerate TOC for this new section
    generateTOC(sectionId);
};

function generateTOC(sectionId) {
    const tocContainer = document.getElementById('toc-container');
    if (!tocContainer) return;

    tocContainer.innerHTML = ''; 

    const activeSection = document.getElementById('section-' + sectionId);
    if (!activeSection) return;

    const ruleBlocks = activeSection.querySelectorAll('.rule-block');

    ruleBlocks.forEach(block => {
        const id = block.id;
        const titleEl = block.querySelector('.rule-title');
        const numEl = block.querySelector('.rule-number');
        
        if (id && titleEl) {
            const titleFull = (numEl ? numEl.textContent + ' ' : '') + titleEl.textContent;
            
            const link = document.createElement('a');
            link.href = '#' + id;
            link.className = 'toc-link';
            link.textContent = titleFull;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                // Highlight
                document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });

            tocContainer.appendChild(link);
        }
    });
}



// Hash Router for Rules SPA
document.addEventListener('DOMContentLoaded', () => {
    const docsLayout = document.querySelector('.docs-layout');
    if (!docsLayout) return;

    const hash = window.location.hash;
    let targetSection = 'general'; // Default

    // Simple heuristic to determine section from hash
    if (hash) {
        if (hash.includes('rp')) targetSection = 'rp';
        else if (hash.includes('combat') || hash.includes('cmb')) targetSection = 'combat';
    }

    // Initialize the correct section
    if (typeof showRuleSection === 'function') {
        const linkSelector = `.sidebar-link[onclick*='${targetSection}']`;
        const link = document.querySelector(linkSelector);
        showRuleSection(targetSection, link);
    }
    
    // If there is a specific anchor (e.g. #rp_2_1), scroll to it
    if (hash) {
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    }
});


// Dashboard Sidebar Logic
function toggleAccordion(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
        group.classList.toggle('expanded');
    }
}


/* ========================================
   RULES & FACTION TABS (SPA Logic)
   ======================================== */
window.switchTab = function(tabId) {
    console.log("Switching to tab:", tabId);
    
    // 1. Hide all content sections inside main
    const sections = document.querySelectorAll('.rule-section-content');
    if (sections.length > 0) {
        sections.forEach(sec => {
            sec.style.display = 'none';
        });
    } else {
        console.warn("No rule sections found!");
    }

    // 2. Show the specific target
    const target = document.getElementById(tabId);
    if (target) {
        target.style.display = 'block';
        // Scroll to top of main content to make it feel fresh
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("Target section not found:", tabId);
    }

    // 3. Update Sidebar Active State
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.classList.remove('active');
        // Note: checking onclick attribute is a simple way match the button to the action
        const onclickVal = link.getAttribute('onclick');
        if (onclickVal && onclickVal.includes(tabId)) {
            link.classList.add('active');
        }
    });
};

/* ========================================
   ATMOSPHERE CAROUSEL LOGIC
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Only run on pages with the carousel

    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Config
    const cardWidthPercent = 33.33333; 
    let isAnimating = false;

    if (nextBtn && prevBtn) {
        // NEXT BUTTON
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = `translateX(-${cardWidthPercent}%)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild); // Move first item to end
                track.style.transform = 'translateX(0)';
                
                setTimeout(() => { isAnimating = false; }, 10);
            }, { once: true });
        });

        // PREV BUTTON
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            // Move last item to front immediately
            track.style.transition = 'none';
            track.insertBefore(track.lastElementChild, track.firstElementChild);
            track.style.transform = `translateX(-${cardWidthPercent}%)`; 
            
            // Force redraw
            void track.offsetWidth;

            // Animate to 0
            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = 'translateX(0)';

            track.addEventListener('transitionend', () => {
                 isAnimating = false;
            }, { once: true });
        });
    }

    // Optional: Auto-play (User didn't ask but it's nice for atmosphere)
    // setInterval(() => { nextBtn.click(); }, 5000);
});

