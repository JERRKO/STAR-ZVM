/* ========================================
   MILITARY RP - 3D Parallax Mouse Effect
   Только для фона
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
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
        // Без искусственной задержки: скрываем сразу, как только всё загрузилось
        hidePreloader();
    });

    // Safety: если событие load задерживается (расширения/битые ресурсы), не держим экран загрузки долго
    setTimeout(hidePreloader, 2500);

    // ========================================
    // Back to Top Button
    // ========================================
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Показать/скрыть кнопку при скролле
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Плавный скролл наверх при клике
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Play once
            }
        });
    }, observerOptions);

    // Elements to animate (will be selected after DOM fully loaded)
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => observer.observe(el));
    }, 100);

    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    
    // ========================================
    // Hamburger Menu Logic
    // ========================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (hamburgerBtn && fullscreenMenu) {
        hamburgerBtn.addEventListener('click', () => {
            // Toggle active class for animation and visibility
            hamburgerBtn.classList.toggle('active');
            fullscreenMenu.classList.toggle('active');
            
            // Toggle body scroll
            if (fullscreenMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Оптимизация для мобильных/снижения анимаций
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Настройки интенсивности эффекта (3DParallax) - УСИЛЕНО
    const settings = {
        base: { translateX: 50, translateY: 50 },  // Фон (задний план)
        top: { translateX: 120, translateY: 120 }  // Передний план (сильнее для 3D)
    };

    const layerBase = document.querySelector('.layer-base');
    const layerTop = document.querySelector('.layer-top');

    // Плавность анимации
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const ease = 0.08;

    // Функция для плавной интерполяции
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Обработчик движения мыши
    function handleMouseMove(e) {
        const rect = hero.getBoundingClientRect();
        // Нормализуем координаты от -1 до 1
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    // Сброс при выходе мыши
    function handleMouseLeave() {
        targetX = 0;
        targetY = 0;
    }

    // Анимационный цикл
    function animate() {
        currentX = lerp(currentX, targetX, ease);
        currentY = lerp(currentY, targetY, ease);

        // 3D Parallax logic
        
        // Base Layer
        if (layerBase) {
            const tx = -currentX * settings.base.translateX;
            const ty = -currentY * settings.base.translateY;
            layerBase.style.transform = `scale(1.05) translate(${tx}px, ${ty}px)`;
        }

        // Top Layer
        if (layerTop) {
            const tx = -currentX * settings.top.translateX;
            const ty = -currentY * settings.top.translateY;
            layerTop.style.transform = `scale(1.05) translate(${tx}px, ${ty}px)`;
        }

        requestAnimationFrame(animate);
    }

    // Инициализация (Принудительно включаем эффект для проверки)
    if (hero) {
        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);
        requestAnimationFrame(animate);
    }

    // Переключатель языков убран: сайт остаётся только на русском.
});