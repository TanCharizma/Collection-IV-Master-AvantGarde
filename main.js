/**
 * Shared Main JavaScript
 * Handles global reveal animations, modals, booking integrations, and homepage interactions.
 */

// --- SILENT SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
        if (isLocalPreview) {
            navigator.serviceWorker.getRegistrations()
                .then(registrations => registrations.forEach(registration => registration.unregister()))
                .catch(() => {});
            return;
        }

        navigator.serviceWorker.register('/sw.js')
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Cache viewport height globally for scroll calculations
    let vh = window.innerHeight;
    let cachedWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        // Only update vh if the width actually changes to prevent mobile address bar thrashing
        if (window.innerWidth !== cachedWidth) {
            vh = window.innerHeight;
            cachedWidth = window.innerWidth;
        }
    }, { passive: true });
    
    // --- 1. GLOBAL REVEAL ANIMATIONS ---
    const revealOptions = {
        threshold: 0,
        rootMargin: "0px 0px -200px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        let toReveal = entries.filter(e => e.isIntersecting && !e.target.classList.contains('active'));

        if (toReveal.length > 1) {
            toReveal.sort((a, b) => {
                const rectA = a.boundingClientRect;
                const rectB = b.boundingClientRect;
                if (Math.abs(rectA.top - rectB.top) > 100) {
                    return rectA.top - rectB.top;
                }
                return rectA.left - rectB.left;
            });
        }

        toReveal.forEach((entry, index) => {
            const el = entry.target;
            if (!Array.from(el.classList).some(cls => cls.startsWith('delay-'))) {
                el.style.transitionDelay = `${index * 0.1}s`;
            }

            const images = el.tagName === 'IMG' ? [el] : Array.from(el.querySelectorAll('img'));
            const pendingImages = images.filter(img => !img.complete);

            const triggerActive = () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => el.classList.add('active'));
                });
                revealObserver.unobserve(el);
            };

            if (pendingImages.length > 0) {
                let loadedCount = 0;
                pendingImages.forEach(img => {
                    const checkLoad = () => {
                        loadedCount++;
                        if (loadedCount === pendingImages.length) triggerActive();
                    };
                    img.addEventListener('load', checkLoad, { once: true });
                    img.addEventListener('error', checkLoad, { once: true });
                });
            } else {
                triggerActive();
            }
        });
    }, revealOptions);

    // Select reveal targets (exclude hero reveals if on homepage to let hero loader handle them)
    const isHomePage = document.getElementById('hero') !== null;
    const revealTargets = isHomePage 
        ? document.querySelectorAll('.reveal:not(.hero .reveal)') 
        : document.querySelectorAll('.reveal');
        
    revealTargets.forEach(el => revealObserver.observe(el));


    // --- 2. HOMEPAGE SPECIFIC LOGIC ---
    if (isHomePage) {
        // Navigation Active State Observer
        const navOptions = { root: null, threshold: 0, rootMargin: "-80px 0px -80% 0px" };
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (['hero', 'highlights', 'portfolio', 'motion', 'measurements', 'digitals'].includes(id)) {
                        document.querySelectorAll('.nav-links a, .dropdown-trigger').forEach(el => el.classList.remove('active'));
                        const trigger = document.querySelector('.dropdown-trigger');
                        if (trigger) trigger.classList.add('active');
                        const subLink = document.querySelector(`.dropdown-content a[href="#${id}"], .dropdown-content a[href="index.html#${id}"]`);
                        if (subLink) subLink.classList.add('active');
                    }
                }
            });
        }, navOptions);
        document.querySelectorAll('header[id], section[id]').forEach(section => navObserver.observe(section));

        // Hero Entrance & Parallax
        const heroSection = document.getElementById('hero');
        const heroBg = document.querySelector('.hero-bg');
        const heroBgFrame = document.querySelector('.hero-bg-frame');
        const heroContent = document.querySelector('.hero-content');
        
        // Automatically extract the image URL defined in the HTML inline style
        let heroImgUrl = 'image/placeholder-hero.webp';
        if (heroBg && heroBg.style) {
            const bgUrlMatch = heroBg.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (bgUrlMatch) heroImgUrl = bgUrlMatch[1];
        }
        
        let heroEntranceStartTime = 0;
        let heroEntranceComplete = false;
            
        const triggerHeroEntrance = () => {
            if (heroSection) heroSection.classList.add('loaded');
            document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('active'));
            heroEntranceStartTime = performance.now();
            setTimeout(() => {
                heroEntranceComplete = true;
                if (heroBgFrame) heroBgFrame.style.animation = 'none'; // Keep the wrapper settled after the intro zoom
            }, 1500); // Reduced to 1500ms for a much faster, smoother come-in
        };

        const splashScreen = document.getElementById('splash-screen');
        const minSplashTime = new Promise(resolve => setTimeout(resolve, 800)); // Snappier brand entrance
        
        const heroImageLoad = new Promise(resolve => {
            const heroImgLoader = new Image();
            
            heroImgLoader.onload = resolve;
            heroImgLoader.onerror = resolve; // Proceed even if there is a loading error
            
            heroImgLoader.src = heroImgUrl;
            
            if (heroImgLoader.complete) resolve(); // Instant resolution if cached
            setTimeout(resolve, 3000); // 3-second hard failsafe in case browser swallows the load event
        });

        if (splashScreen) {
            if (splashScreen.style.display === 'none') {
                // Splash screen was skipped by the inline script
                heroImageLoad.then(triggerHeroEntrance);
            } else {
                sessionStorage.setItem('hasSeenSplash', 'true');
                document.body.style.overflow = 'hidden'; // Lock screen during splash
                Promise.all([minSplashTime, heroImageLoad]).then(() => {
                    splashScreen.classList.add('hidden');
                    setTimeout(() => {
                        document.body.style.overflow = ''; // Unlock scrolling
                        triggerHeroEntrance();
                }, 300); // Trigger hero text reveal smoothly as splash screen fades
                });
            }
        } else {
            heroImageLoad.then(triggerHeroEntrance);
        }

        let isDesktop = window.innerWidth > 768;
        let lastRenderedScrollY = -1;

        window.addEventListener('resize', () => isDesktop = window.innerWidth > 768, { passive: true });
        
        const heroTextBlock = document.querySelector('.hero-text-block');
        const heroScrollHint = document.querySelector('.hero-scroll-hint');

        let rafId = null;

        const renderHeroParallax = () => {
            const currentScrollY = window.scrollY; // Zero-cost compositor read

            // Only update DOM if the scroll value actually changed and is within range
            if (currentScrollY !== lastRenderedScrollY && currentScrollY <= vh + 100) {
                if (heroBg && heroEntranceComplete) {
                    if (isDesktop) {
                        // .toFixed() limits string length to prevent sub-pixel float parsing lag
                        const scrollScale = (1 + (currentScrollY / vh) * 0.18).toFixed(4); 
                        const parallax = (currentScrollY * 0.08).toFixed(2);
                        heroBg.style.transform = `translate3d(0, ${parallax}px, 0) scale3d(${scrollScale}, ${scrollScale}, 1)`;
                    } else {
                        const scrollScale = (1 + (currentScrollY / vh) * 0.08).toFixed(4);
                        heroBg.style.transform = `translateZ(0) scale3d(${scrollScale}, ${scrollScale}, 1)`;
                    }
                }
                
                const fadeProgress = Math.max(0.001, 1 - (currentScrollY / (vh * 0.6)));
                const isHidden = fadeProgress <= 0.01;

                if (heroTextBlock) {
                    heroTextBlock.style.opacity = fadeProgress.toFixed(3);
                    
                    if (isHidden) {
                        if (heroTextBlock.style.visibility !== 'hidden') heroTextBlock.style.visibility = 'hidden';
                    } else {
                        if (heroTextBlock.style.visibility !== '') heroTextBlock.style.visibility = '';
                    }
                }
                
                if (heroScrollHint) {
                    heroScrollHint.style.opacity = (fadeProgress * 0.72).toFixed(3);
                    
                    if (isHidden) {
                        if (heroScrollHint.style.visibility !== 'hidden') heroScrollHint.style.visibility = 'hidden';
                    } else {
                        if (heroScrollHint.style.visibility !== '') heroScrollHint.style.visibility = '';
                    }
                }

                lastRenderedScrollY = currentScrollY;
            }

            rafId = null;
        };

        // Render at most once per frame when the user scrolls.
        window.addEventListener('scroll', () => {
            if (!rafId) {
                rafId = requestAnimationFrame(renderHeroParallax);
            }
        }, { passive: true });
    }

    // About page scroll hint uses the same fade timing as the homepage hero content.
    const aboutScrollHint = document.querySelector('.about-scroll-hint');
    if (aboutScrollHint) {
        let aboutHintTicking = false;

        const renderAboutScrollHint = () => {
            const fadeProgress = Math.max(0.001, 1 - (window.scrollY / (vh * 0.6)));
            const isHidden = fadeProgress <= 0.01;

            if (aboutScrollHint.style.transition !== 'none') {
                aboutScrollHint.style.transition = 'none';
            }

            aboutScrollHint.style.opacity = (fadeProgress * 0.72).toFixed(3);
            aboutScrollHint.style.visibility = isHidden ? 'hidden' : '';
            aboutScrollHint.style.pointerEvents = isHidden ? 'none' : '';
            aboutHintTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!aboutHintTicking) {
                aboutHintTicking = true;
                requestAnimationFrame(renderAboutScrollHint);
            }
        }, { passive: true });

        renderAboutScrollHint();
    }

    // --- 3. BACK TO TOP LOGIC ---
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        let isScrollingToTop = false;
        let scrollCheckInterval = null;
        let scrollTimeout = null;
        let isBttVisible = false;

        const evaluateBackToTop = (currentScrollY) => {
            if (!backToTop || isScrollingToTop) return;
            const shouldBeVisible = currentScrollY > (vh * 0.5);
            if (isBttVisible !== shouldBeVisible) {
                shouldBeVisible ? backToTop.classList.add('visible') : backToTop.classList.remove('visible');
                isBttVisible = shouldBeVisible;
            }
        };

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            isScrollingToTop = true;
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
            backToTop.classList.remove('visible');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            clearInterval(scrollCheckInterval);
            clearTimeout(scrollTimeout);

            const unlockButton = () => {
                isScrollingToTop = false;
                backToTop.style.opacity = '';
                backToTop.style.pointerEvents = '';
                evaluateBackToTop(window.scrollY);
            };

            scrollCheckInterval = setInterval(() => {
                if (window.scrollY <= 0) {
                    clearInterval(scrollCheckInterval);
                    clearTimeout(scrollTimeout);
                    unlockButton();
                }
            }, 100);

            scrollTimeout = setTimeout(() => {
                clearInterval(scrollCheckInterval);
                unlockButton();
            }, 2000);
        });

        const interruptScroll = () => {
            if (isScrollingToTop) {
                clearInterval(scrollCheckInterval);
                clearTimeout(scrollTimeout);
                isScrollingToTop = false;
                backToTop.style.opacity = '';
                backToTop.style.pointerEvents = '';
                evaluateBackToTop(window.scrollY);
            }
        };

        window.addEventListener('touchstart', interruptScroll, { passive: true });
        window.addEventListener('wheel', interruptScroll, { passive: true });
        
        let bttTicking = false;
        let lastBttScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            lastBttScrollY = window.scrollY;
            if (!bttTicking) {
                window.requestAnimationFrame(() => {
                    evaluateBackToTop(lastBttScrollY);
                    bttTicking = false;
                });
                bttTicking = true;
            }
        }, { passive: true });
    }

    // --- SCROLL LOCK HELPER ---
    // Prevents the background layout from shifting when the scrollbar disappears
    const lockScroll = () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
    };
    const unlockScroll = () => {
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    };

    // --- 4. IMAGE MODAL LOGIC (With Keyboard Support) ---
    const modal = document.getElementById("imageModal");
    if (modal) {
        const modalImg = document.getElementById("img01");
        let currentSectionImages = [];
        let currentImgIndex = 0;
        
        const updateModal = (index, direction = 0, isOpening = false) => {
            const finalizeUpdate = () => {
                currentImgIndex = index;
                const newSrc = currentSectionImages[currentImgIndex].src;
                
                const playAnimation = () => {
                    document.querySelector('.modal-prev').style.visibility = currentImgIndex === 0 ? 'hidden' : 'visible';
                    document.querySelector('.modal-next').style.visibility = currentImgIndex === currentSectionImages.length - 1 ? 'hidden' : 'visible';
                    
                    if (direction !== 0) {
                        // Prep new image off-screen opposite to the swipe
                        modalImg.style.transition = 'none';
                        modalImg.style.transform = `translate(calc(-50% + ${direction * 50}px), -50%)`;
                        modalImg.style.opacity = '0';
                        
                        // Animate new image sliding into center
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                modalImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
                                modalImg.style.transform = `translate(-50%, -50%)`;
                                modalImg.style.opacity = '1';
                            });
                        });
                    } else if (isOpening) {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                modalImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
                                modalImg.style.transform = `translate(-50%, -50%) scale(1)`;
                                modalImg.style.opacity = '1';
                            });
                        });
                    } else {
                        modalImg.style.transition = 'none';
                        modalImg.style.transform = `translate(-50%, -50%)`;
                        modalImg.style.opacity = '1';
                    }
                };

                // Wait for the new image to fully render its dimensions before animating
                if (modalImg.src !== newSrc) {
                    modalImg.src = newSrc;
                    modalImg.alt = currentSectionImages[currentImgIndex].alt || 'Expanded portfolio image';
                    
                    // Use modern decode() to completely eliminate 1-frame layout thrashing
                    modalImg.decode().then(playAnimation).catch(playAnimation);
                } else {
                    playAnimation();
                }
            };

            if (direction !== 0) {
                // Animate old image sliding out
                modalImg.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease';
                modalImg.style.transform = `translate(calc(-50% + ${direction * -100}px), -50%)`;
                modalImg.style.opacity = '0';
                setTimeout(finalizeUpdate, 200);
            } else {
                finalizeUpdate();
            }
        };

        // Filter out any image that is a brand logo
        const galleryImages = Array.from(document.querySelectorAll('section img')).filter(img => {
            return !img.classList.contains('brand-logo') && !img.src.includes('brand_icons');
        });

        galleryImages.forEach((img) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                // Freeze the hover state so it doesn't drop while the modal opens
                img.classList.add('freeze-hover');
                setTimeout(() => img.classList.remove('freeze-hover'), 600);

                const parentSection = img.closest('section');
                currentSectionImages = Array.from(parentSection.querySelectorAll('img'))
                    .filter(i => !i.classList.contains('brand-logo') && !i.src.includes('brand_icons'))
                    .sort((a, b) => Math.abs(a.getBoundingClientRect().top - b.getBoundingClientRect().top) > 100 
                        ? a.getBoundingClientRect().top - b.getBoundingClientRect().top 
                        : a.getBoundingClientRect().left - b.getBoundingClientRect().left);
                
                // Prep image state BEFORE making modal visible to prevent 1-frame flashes
                modalImg.style.transition = 'none';
                modalImg.style.transform = 'translate(-50%, -50%) scale(0.95)';
                modalImg.style.opacity = '0';
                
                modal.classList.add('show-modal');
                updateModal(currentSectionImages.indexOf(img), 0, true);
                lockScroll();
            });
        });

        document.querySelector('.modal-prev').onclick = (e) => { e.stopPropagation(); updateModal(currentImgIndex - 1, -1); };
        document.querySelector('.modal-next').onclick = (e) => { e.stopPropagation(); updateModal(currentImgIndex + 1, 1); };
        modalImg.onclick = (e) => e.stopPropagation();
        
        const closeModal = () => {
            modal.classList.remove('show-modal');
            unlockScroll();
            // Clear transforms for next open
            setTimeout(() => {
                modalImg.style.transition = 'none';
                modalImg.style.transform = 'translate(-50%, -50%)';
                modalImg.style.opacity = '1';
            }, 300);
        };
        
        modal.onclick = closeModal;

        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('show-modal')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft' && currentImgIndex > 0) updateModal(currentImgIndex - 1, -1);
                if (e.key === 'ArrowRight' && currentImgIndex < currentSectionImages.length - 1) updateModal(currentImgIndex + 1, 1);
            }
        });
        
        // Mobile Touch Swipe Navigation
        let touchStartX = 0;
        let touchCurrentX = 0;
        let isSwiping = false;

        modal.addEventListener('touchstart', e => {
            if (e.touches.length > 1) return; // Ignore multi-touch
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
            modalImg.style.transition = 'none'; // Lock to finger
        }, { passive: true });

        // Lock background scroll on mobile completely when touching the modal
        modal.addEventListener('touchmove', e => {
            e.preventDefault();
            if (!isSwiping) return;
            touchCurrentX = e.changedTouches[0].screenX;
            const deltaX = touchCurrentX - touchStartX;
            
            // Elastic drag tracking
            modalImg.style.transform = `translate(calc(-50% + ${deltaX * 0.6}px), -50%)`;
            modalImg.style.opacity = Math.max(0.3, 1 - Math.abs(deltaX) / window.innerWidth);
        }, { passive: false });

        modal.addEventListener('touchend', e => {
            if (!isSwiping) return;
            isSwiping = false;
            const touchEndX = e.changedTouches[0].screenX;
            const deltaX = touchEndX - touchStartX;
            const swipeThreshold = 50; // Required distance

            if (deltaX < -swipeThreshold && currentImgIndex < currentSectionImages.length - 1) {
                updateModal(currentImgIndex + 1, 1); // Swipe left -> Next
            } else if (deltaX > swipeThreshold && currentImgIndex > 0) {
                updateModal(currentImgIndex - 1, -1); // Swipe right -> Prev
            } else {
                // Snap back to center if they didn't drag far enough
                modalImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
                modalImg.style.transform = `translate(-50%, -50%)`;
                modalImg.style.opacity = '1';
            }
        }, { passive: true });
        
        // Global Escape Key for Comp Card Modal
        document.addEventListener('keydown', (e) => {
            const compModal = document.getElementById('compCardModal');
            if (e.key === 'Escape' && compModal && compModal.classList.contains('show-modal')) {
                compModal.classList.remove('show-modal');
                unlockScroll();
            }
        });
    }

    // --- 5. BOOKING CONFIG LINKS & COMP CARD ---
    if (window.CLIENT_CONFIG) {
        const lnkLine = document.getElementById('link-line');
        const lnkEmail = document.getElementById('link-email');
        const lnkWa = document.getElementById('link-wa');
        const lnkIg = document.getElementById('link-ig');
        
        const setupLink = (el, url, prefix = "") => {
            if (el) {
                if (url && url.trim() !== "") {
                    el.href = prefix + url;
                } else {
                    el.style.display = "none"; // Automatically hide if client leaves it blank
                }
            }
        };

        setupLink(lnkLine, window.CLIENT_CONFIG.line);
        setupLink(lnkEmail, window.CLIENT_CONFIG.email, "mailto:");
        setupLink(lnkWa, window.CLIENT_CONFIG.whatsapp);
        setupLink(lnkIg, window.CLIENT_CONFIG.instagram);
        
        // Auto-populate Brutalist Marquee Text
        document.querySelectorAll('.client-name-marquee').forEach(el => {
            el.textContent = window.CLIENT_CONFIG.name;
        });

        // Comp Card Logic
        const compCardContainer = document.getElementById('compCardContainer');
        const compCardBtn = document.getElementById('compCardBtn');
        const compCardModal = document.getElementById('compCardModal');
        const compCardImg = document.getElementById('compCardImg');
        const compCardDownload = document.getElementById('compCardDownload');

        if (compCardContainer && compCardBtn && compCardModal) {
            // Lock background scroll for Comp Card Modal as well
            compCardModal.addEventListener('touchmove', e => {
                e.preventDefault();
            }, { passive: false });

            if (window.CLIENT_CONFIG.compCardUrl && window.CLIENT_CONFIG.compCardUrl.trim() !== "") {
                compCardBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    compCardImg.src = window.CLIENT_CONFIG.compCardUrl;
                    compCardDownload.href = window.CLIENT_CONFIG.compCardDownloadUrl || window.CLIENT_CONFIG.compCardUrl;
                    
                    // Prep image state BEFORE making modal visible
                    compCardImg.style.transition = 'none';
                    compCardImg.style.transform = 'translate(-50%, -50%) scale(0.95)';
                    compCardImg.style.opacity = '0';
                    
                    compCardModal.classList.add('show-modal');
                    lockScroll();
                    
                    const playCompCardAnimation = () => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                compCardImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
                                compCardImg.style.transform = 'translate(-50%, -50%) scale(1)';
                                compCardImg.style.opacity = '1';
                            });
                        });
                    };
                    
                    compCardImg.decode().then(playCompCardAnimation).catch(playCompCardAnimation);
                });

                compCardModal.onclick = (e) => {
                    // Close if clicking the background, but don't close if clicking the image or download button
                    if (e.target !== compCardImg && !compCardDownload.contains(e.target)) {
                        compCardModal.classList.remove('show-modal');
                        unlockScroll();
                    }
                };
            } else {
                compCardContainer.style.display = "none"; // Hide if client has no comp card
            }
        }
    }
});
