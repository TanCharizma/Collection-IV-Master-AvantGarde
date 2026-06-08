/**
 * Shared Navigation Component
 * Injects the global navigation into the page and handles dynamic states.
 */
(function() {
    // --- NATIVE APP TRANSITIONS (CURTAIN SETUP) ---
    // Pre-inject the curtain so it's ready before the DOM fully parses
    const isFirstLoad = !sessionStorage.getItem('appCurtainLoaded');
    document.write(`<div class="app-transition-curtain ${!isFirstLoad ? 'start-covered' : ''}" id="appCurtain"></div>`);
    sessionStorage.setItem('appCurtainLoaded', 'true');

    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    const currentPage = window.location.pathname.split('/').pop(); // e.g., "about.html"

    let logoHref = 'index.html'; // Default for non-homepage

    if (isHomePage) { // Homepage specific setup
        logoHref = '#hero'; // Logo scrolls to hero section on homepage
    }

    // Automatically format the document title
    const currentTitle = document.title;
    if (currentTitle.includes('|')) {
        document.title = currentTitle.split('|')[0].trim() + ' | ' + window.CLIENT_CONFIG.name;
    } else {
        document.title = currentTitle + ' | ' + window.CLIENT_CONFIG.name;
    }

    const navHTML = `
    <nav>
        <a href="${logoHref}" class="logo">${window.CLIENT_CONFIG.name}</a>
        <div class="nav-links">
            <div class="dropdown">
                <a href="${logoHref}" class="dropdown-trigger">
                    <span lang="en">Home</span>
                    <span lang="th">หน้าหลัก</span>
                </a>
                <div class="dropdown-content">
                    <a href="${isHomePage ? '#highlights' : 'index.html#highlights'}">
                        <span lang="en">Highlights</span>
                        <span lang="th">ไฮไลต์</span>
                    </a>
                    <a href="${isHomePage ? '#portfolio' : 'index.html#portfolio'}">
                        <span lang="en">Portfolio</span>
                        <span lang="th">ผลงาน</span>
                    </a>
                    <a href="${isHomePage ? '#motion' : 'index.html#motion'}">
                        <span lang="en">Videos</span>
                        <span lang="th">วิดีโอ</span>
                    </a>
                    <a href="${isHomePage ? '#measurements' : 'index.html#measurements'}">
                        <span lang="en">Measurements</span>
                        <span lang="th">สัดส่วน</span>
                    </a>
                    <a href="${isHomePage ? '#digitals' : 'index.html#digitals'}">
                        <span lang="en">Digitals</span>
                        <span lang="th">สแนปช็อต</span>
                    </a>
                </div>
            </div>
            <a href="about.html">
                <span lang="en">About</span>
                <span lang="th">เกี่ยวกับฉัน</span>
            </a>
            <a href="booking.html">
                <span lang="en">Booking</span>
                <span lang="th">จองคิว</span> 
            </a>
            <span class="lang-switch" id="langToggle">
                <span class="en">EN</span> / 
                <span class="th">TH</span>
            </span>
            <span class="theme-toggle" id="themeToggle">
                <span lang="en">Dark</span>
                <span lang="th">โหมดมืด</span>
            </span>
        </div>
        <div class="mobile-toggle" id="mobileToggle">
            <span></span>
            <span></span>
        </div>
    </nav>`;

    // Inject the navigation HTML
    document.currentScript.insertAdjacentHTML('beforebegin', navHTML);

    // After injection, get the nav element
    const navElement = document.querySelector('nav');

    // Handle active class for non-homepage links
    if (!isHomePage) {
        const currentLink = navElement.querySelector(`a[href="${currentPage}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }


    // Mobile Menu Logic
    const mobileToggle = navElement.querySelector('#mobileToggle');
    const navLinks = navElement.querySelector('.nav-links');
    const getHeaderOffset = () => Math.ceil((navElement && navElement.getBoundingClientRect().height) || 64);
    const getAnchorTargetY = (targetElement) => {
        const visualTarget = targetElement.querySelector('.section-label') || targetElement;
        const targetTop = visualTarget.getBoundingClientRect().top + window.scrollY;

        return Math.max(0, targetTop - getHeaderOffset() - 12);
    };
    const scrollToAnchorTarget = (targetId, behavior = 'smooth') => {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const land = (nextBehavior = behavior) => {
            window.scrollTo({
                top: getAnchorTargetY(targetElement),
                behavior: nextBehavior
            });
        };

        land();
        window.setTimeout(() => land('smooth'), 700);
        window.setTimeout(() => land('smooth'), 1400);
        history.replaceState(null, null, targetId);
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navElement.classList.toggle('nav-open');
            document.body.style.overflow = navElement.classList.contains('nav-open') ? 'hidden' : '';
        });

        if (navLinks) {
            navLinks.addEventListener('click', (e) => {
                if (!navElement.classList.contains('nav-open')) return;
                if (e.target.closest('a, .lang-switch, .theme-toggle')) return;

                navElement.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        }

        // Close menu when a link is clicked
        navElement.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (navElement.classList.contains('nav-open')) {
                    const href = link.getAttribute('href');
                    const isSamePageHash = href && (href.startsWith('#') || (isHomePage && href.startsWith('index.html#')));

                    if (isSamePageHash) {
                        e.preventDefault();
                        const targetId = href.substring(href.indexOf('#'));

                        navElement.classList.remove('nav-open');
                        document.body.style.overflow = '';
                        setTimeout(() => scrollToAnchorTarget(targetId), 140);
                    } else {
                        navElement.classList.remove('nav-open');
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        // Cleanup: Ensure body scroll is restored if window is resized while menu is open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && navElement.classList.contains('nav-open')) {
                navElement.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    }

    // Theme Switching Logic
    const themeToggle = navElement.querySelector('#themeToggle');
    const updateThemeUI = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const enSpan = themeToggle.querySelector('[lang="en"]');
        const thSpan = themeToggle.querySelector('[lang="th"]');
        if (theme === 'dark') {
            enSpan.textContent = 'Light';
            thSpan.textContent = 'โหมดสว่าง';
        } else {
            enSpan.textContent = 'Dark';
            thSpan.textContent = 'โหมดมืด';
        }
        localStorage.setItem('preferredTheme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        updateThemeUI(isDark ? 'light' : 'dark');
    });

    // Initialize theme on load
    updateThemeUI(localStorage.getItem('preferredTheme') || 'light');

    // Language Switching Logic
    const setLanguage = (lang) => {
        if (lang === 'th') {
            document.body.classList.add('lang-th');
        } else {
            document.body.classList.remove('lang-th');
        }
        localStorage.setItem('preferredLang', lang);
    };

    navElement.querySelector('.lang-switch .en').addEventListener('click', () => setLanguage('en'));
    navElement.querySelector('.lang-switch .th').addEventListener('click', () => setLanguage('th'));

    // Initialize language on load
    setLanguage(localStorage.getItem('preferredLang') || 'en');

    // Custom Editorial Cursor
    if (window.matchMedia("(hover: hover)").matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-dot';
        cursor.innerHTML = `
            <svg class="cursor-arrow" width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0L16.5 10.5L10 11.5L14 21L10.5 23L6.5 13.5L0 19.5V0Z" fill="var(--gold)" stroke="var(--text)" stroke-width="2" stroke-linejoin="round"/></svg>
        `;
        document.body.appendChild(cursor);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let currentScale = 1;
        let isCursorClicked = false;
        let cursorVisible = false;
        let cursorTransform = '';

        const paintCursor = () => {
            const nextTransform = `translate3d(${cursorX.toFixed(2)}px, ${cursorY.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;
            if (nextTransform !== cursorTransform) {
                cursor.style.transform = nextTransform;
                cursorTransform = nextTransform;
            }
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorX = mouseX;
            cursorY = mouseY;
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
            paintCursor();
        }, { passive: true });

        document.addEventListener('mousedown', (e) => {
            isCursorClicked = true;
            const radar = document.createElement('div');
            radar.className = 'cursor-radar';
            radar.style.left = e.clientX + 'px';
            radar.style.top = e.clientY + 'px';
            document.body.appendChild(radar);
            setTimeout(() => radar.remove(), 600); // Cleans up the DOM automatically
        });

        document.addEventListener('mouseup', () => isCursorClicked = false);

        // Hide custom cursor over interactive elements so native pointer shows
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, img, .dropdown-trigger, .lang-switch span, .theme-toggle, .mobile-toggle, .back-to-top, .modal-nav')) {
                cursor.classList.add('hover');
            } else {
                cursor.classList.remove('hover');
            }
        });

        const renderCursor = () => {
            const targetScale = isCursorClicked ? 0.7 : 1;
            const ds = targetScale - currentScale;

            // Position is immediate; only click scale eases to avoid a delayed cursor feel.
            if (Math.abs(ds) > 0.01) {
                currentScale += ds * 0.65;
                paintCursor();
            }
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
    }

    // --- CROSS-PAGE CINEMATIC TRANSITIONS ---
    document.addEventListener('DOMContentLoaded', () => {
        const curtain = document.getElementById('appCurtain');
        
        // Remove cover immediately on load
        if (curtain) {
            requestAnimationFrame(() => {
                curtain.classList.remove('start-covered');
                curtain.classList.remove('curtain-cover');
            });
        }

        // Intercept cross-page links
        document.querySelectorAll('a').forEach(anchor => {
            const href = anchor.getAttribute('href');
            // Ignore hash links, external links, and new tabs
            if (!href || href.startsWith('#') || href.startsWith('http') || anchor.getAttribute('target') === '_blank') return;
            
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                if (curtain) curtain.classList.add('curtain-cover');
                
                setTimeout(() => window.location.href = href, 200); // Faster cross-page transition
            });
        });
    });

    // Auto-inject Config Data into HTML placeholders
    document.addEventListener('DOMContentLoaded', () => {
        const inject = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        inject('clientNameHero', window.CLIENT_CONFIG.name);
        inject('taglineEn', window.CLIENT_CONFIG.taglineEn);
        inject('taglineTh', window.CLIENT_CONFIG.taglineTh);

        const splashCaption = document.getElementById('splashCaption');
        if (splashCaption) {
            const captionText = window.CLIENT_CONFIG.splashCaption || '';
            splashCaption.textContent = captionText;
            splashCaption.style.display = captionText ? '' : 'none';
        }
        
        if (window.CLIENT_CONFIG.measurements) {
            inject('val-height', window.CLIENT_CONFIG.measurements.height);
            inject('val-bust', window.CLIENT_CONFIG.measurements.bust);
            inject('val-waist', window.CLIENT_CONFIG.measurements.waist);
            inject('val-hips', window.CLIENT_CONFIG.measurements.hips);
            inject('val-shoes', window.CLIENT_CONFIG.measurements.shoes);
            inject('val-hairEn', window.CLIENT_CONFIG.measurements.hairEn);
            inject('val-hairTh', window.CLIENT_CONFIG.measurements.hairTh);
            inject('val-eyesEn', window.CLIENT_CONFIG.measurements.eyesEn);
            inject('val-eyesTh', window.CLIENT_CONFIG.measurements.eyesTh);
        }
    });
})();
