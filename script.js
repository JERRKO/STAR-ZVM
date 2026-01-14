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
    setTimeout(hidePreloader, 900);

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
    const dustContainer = document.querySelector('.dust-container');
    const particles = document.querySelectorAll('.particle');
    const menuToggle = document.getElementById('menu-toggle');
    const submenuLinks = document.querySelectorAll('.submenu-link');

    // Закрытие меню при клике на подпункт (ссылку подменю)
    submenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) {
                menuToggle.checked = false;
            }
        });
    });
    
    // Закрытие меню при клике на затемнённую область (вне контента меню)
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            const menuContent = document.querySelector('.menu-content');
            // Если клик был на overlay, но не внутри menu-content
            if (menuContent && !menuContent.contains(e.target) && menuToggle) {
                menuToggle.checked = false;
            }
        });
    }

    // Оптимизация для мобильных/снижения анимаций
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Настройки интенсивности эффекта (только фон)
    const settings = {
        bg: { translateX: 30, translateY: 30 },
        dust: { translateX: 50, translateY: 50 },
        particles: { translateX: 80, translateY: 80 }
    };

    // Плавность анимации
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const ease = 0.05;

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
        // Плавная интерполяция
        currentX = lerp(currentX, targetX, ease);
        currentY = lerp(currentY, targetY, ease);

        // Параллакс для фона (движется в противоположную сторону)
        if (heroBg) {
            const translateX = -currentX * settings.bg.translateX;
            const translateY = -currentY * settings.bg.translateY;
            heroBg.style.transform = `
                scale(1.1)
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;
        }

        // Параллакс для пыли
        if (dustContainer) {
            const translateX = currentX * settings.dust.translateX;
            const translateY = currentY * settings.dust.translateY;
            dustContainer.style.transform = `
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;
        }

        // Параллакс для частиц
        particles.forEach((particle, index) => {
            const factor = 1 + (index % 3) * 0.3;
            const translateX = currentX * settings.particles.translateX * factor;
            const translateY = currentY * settings.particles.translateY * factor;
            particle.style.transform = `
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;
        });

        // Статичный баннер: без динамической подсветки по курсору

        requestAnimationFrame(animate);
    }

    // Инициализация
    if (hero) {
        // По запросу: отключаем любые эффекты, реагирующие на курсор/сенсор
        if (heroBg) {
            heroBg.style.transform = 'scale(1.1)';
            heroBg.style.transition = 'none';
        }
    }

    // Переключатель языков убран: сайт остаётся только на русском.
});