/* ========================================
   MILITARY RP - 3D Parallax Mouse Effect
   Только для фона
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // 1. FALLING METEORS ANIMATION (Canvas)
    // ========================================
    const canvas = document.getElementById('meteorCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Star Texture (Try to load image, fallback to generated glow)
        const starImg = new Image();
        starImg.src = 'img/STAR.png';
        
        // Fallback canvas (Yellow Glow)
        const starCanvas = document.createElement('canvas');
        starCanvas.width = 32;
        starCanvas.height = 32;
        const sCtx = starCanvas.getContext('2d');
        const grd = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grd.addColorStop(0, 'white');
        grd.addColorStop(0.2, '#fff1a8');
        grd.addColorStop(0.4, 'rgba(255, 215, 0, 0.5)');
        grd.addColorStop(1, 'transparent');
        sCtx.fillStyle = grd;
        sCtx.beginPath();
        sCtx.arc(16, 16, 16, 0, Math.PI*2);
        sCtx.fill();

        class Meteor {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                // FIX: On mobile/vertical screens, to cover the bottom-right, 
                // the meteor must start far to the left (negative X).
                // Determine range based on height to ensure diagonal coverage.
                
                const startXMin = -height; // Allow spawning far left
                const startXMax = width;   // Allow spawning up to right edge
                
                this.x = startXMin + Math.random() * (startXMax - startXMin);
                this.y = -100;
                
                if (initial) {
                   this.x = Math.random() * width;
                   this.y = Math.random() * height;
                }

                this.speed = 2 + Math.random() * 2; // Slower speed
                this.size = 50 + Math.random() * 70;  // MUCH BIGGER (50px to 100px)
                this.len = 150 + Math.random() * 200; 
                this.angle = Math.PI / 4; 
                
                // Rotation initialization
                this.rotationAngle = Math.random() * Math.PI * 2;
                this.rotationSpeed = 0.02 + Math.random() * 0.05; // Slower rotation
            }

            update() {
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
                
                // Update rotation (Clockwise)
                this.rotationAngle += this.rotationSpeed;

                if (this.y > height + 100 || this.x > width + 100) {
                    this.reset();
                }
            }

            draw() {
                // 1. Draw Trail
                const tailX = this.x - this.len * Math.cos(this.angle);
                const tailY = this.y - this.len * Math.sin(this.angle);
                
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2 + (this.size / 30);
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                // 2. Draw Star Head
                ctx.save();
                ctx.translate(this.x, this.y);
                
                // Apply rotation
                ctx.rotate(this.rotationAngle);

                if (starImg.complete && starImg.naturalWidth !== 0) {
                    // Draw Image
                    ctx.drawImage(starImg, -this.size/2, -this.size/2, this.size, this.size);
                } else {
                    // Draw Fallback
                    ctx.drawImage(starCanvas, -this.size/2, -this.size/2, this.size, this.size);
                }
                ctx.restore();
            }
        }

        const meteors = [];
        const meteorCount = 15; // Number of stars (Reduced from 40 for less clutter)

        for (let i = 0; i < meteorCount; i++) {
            meteors.push(new Meteor());
        }

        function animateMeteors() {
            ctx.clearRect(0, 0, width, height);
            
            meteors.forEach(m => {
                m.update();
                m.draw();
            });
            
            requestAnimationFrame(animateMeteors);
        }
        
        animateMeteors();
    }



    // ========================================
    // 2. PARALLAX EFFECT (Mouse Move)
    // ========================================
    const heroSection = document.getElementById('heroSection');
    const layerBase = document.querySelector('.layer-base');
    const layerTop = document.querySelector('.layer-top');

    if (heroSection && layerBase && layerTop) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move layers slightly different amounts for depth
            layerBase.style.transform = 'translateX(' + (x * 0.5) + 'px) translateY(' + (y * 0.5) + 'px)';
            layerTop.style.transform = 'translateX(' + (x * 1.5) + 'px) translateY(' + (y * 1.5) + 'px)';
        });
        
        // Reset on mouse leave (optional)
        heroSection.addEventListener('mouseleave', () => {
            layerBase.style.transform = 'translate(0,0)';
            layerTop.style.transform = 'translate(0,0)';
        });
    }

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
