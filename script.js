/**
 * MOBILISE - Core Interaction Engine V2
 * Optimized for compatibility and performance.
 */

// Global State Tracker to reduce event listener spam
const State = {
    mouse: { x: 0, y: 0 },
    scroll: 0,
    width: window.innerWidth,
    height: window.innerHeight
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initGlobalTrackers();
    initRevealSystem();
    initTunnelEffect();
    initTestimonials();
    initIndustryHover();
    initInsightsPreview();
    initLiquidLens();
    initMapPortal();
    initFooterInteractions();
    initMagneticText();
    initNavigation();
});

// --- 1. Global Trackers (Mouse & Scroll) ---
function initGlobalTrackers() {
    window.addEventListener('mousemove', (e) => {
        State.mouse.x = e.clientX;
        State.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        State.scroll = window.pageYOffset;
    }, { passive: true });

    window.addEventListener('resize', () => {
        State.width = window.innerWidth;
        State.height = window.innerHeight;
    });
}

// --- 2. Loader System ---
function initLoader() {
    const wrapper = document.querySelector('.intro-text-wrapper');
    const overlay = document.querySelector('.intro-overlay');
    const texts = document.querySelectorAll('.intro-text');

    if (!wrapper || !overlay || texts.length === 0) return;

    let currentIndex = 0;

    // Safety timeout: Forced load after 5 seconds if assets hang
    const safetyTimer = setTimeout(() => finishAnimation(), 5000);

    // Cycle text
    const cycleInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex < texts.length) {
            // 60px is the approx height of logic in CSS
            wrapper.style.transform = `translateY(-${currentIndex * 60}px)`;
        } else {
            clearInterval(cycleInterval);
            finishAnimation();
        }
    }, 600);

    function finishAnimation() {
        clearTimeout(safetyTimer);
        setTimeout(() => {
            if (document.getElementById('introOverlay')) {
                document.getElementById('introOverlay').classList.add('loaded');
                setTimeout(() => {
                    document.getElementById('introOverlay').style.display = 'none';
                    document.body.classList.add('hero-ready');
                }, 1200);
            }
        }, 500);
    }
}

// --- 3. Reveal on Scroll ---
function initRevealSystem() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- 4. Tunnel Effect (Z-Axis Scroll) ---
function initTunnelEffect() {
    const track = document.querySelector('.tunnel-scroll-track');
    const layers = document.querySelectorAll('.tunnel-layer');

    if (!track || layers.length === 0) return;

    function updateTunnel() {
        const trackTop = track.offsetTop;
        const trackHeight = track.offsetHeight;
        const scrollTop = State.scroll;

        // Only calculate and update DOM if within view range
        if (scrollTop >= trackTop - State.height && scrollTop <= trackTop + trackHeight) {
            let progress = (scrollTop - trackTop) / (trackHeight - State.height);
            progress = Math.max(0, Math.min(progress, 1));

            const spacing = 2200;

            layers.forEach((layer, index) => {
                const startZ = index * -spacing;
                const currentZ = startZ + (progress * (layers.length * spacing));

                let opacity = 0;
                if (currentZ > -1200 && currentZ < 200) {
                    opacity = (currentZ + 1200) / 1200;
                } else if (currentZ >= 200 && currentZ < 700) {
                    opacity = 1;
                } else if (currentZ >= 700) {
                    opacity = 1 - (currentZ - 700) / 600;
                }

                layer.style.transform = `translateZ(${currentZ}px)`;
                layer.style.opacity = Math.max(0, opacity);

                const blurAmount = Math.abs(currentZ) > 600 ? Math.min(Math.abs(currentZ) / 250, 15) : 0;
                layer.style.filter = `blur(${blurAmount}px)`;
            });
        }

        // Continues the loop
        requestAnimationFrame(updateTunnel);
    }

    // Start loop
    updateTunnel();
}

// --- 5. Testimonials Switcher ---
function initTestimonials() {
    const testiItems = document.querySelectorAll('.testi-item');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const countDisplay = document.querySelector('.nav-count');

    if (testiItems.length === 0) return;

    let currentTesti = 0;

    function updateStage(index) {
        // Reset all
        testiItems.forEach(item => {
            item.classList.remove('active');
            item.style.opacity = '0';
        });

        // Activate new
        const activeItem = testiItems[index];
        activeItem.classList.add('active');

        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            activeItem.style.opacity = '1';
        }, 50);

        if (countDisplay) countDisplay.innerText = `0${index + 1} / 0${testiItems.length}`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTesti = (currentTesti + 1) % testiItems.length;
            updateStage(currentTesti);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTesti = (currentTesti - 1 + testiItems.length) % testiItems.length;
            updateStage(currentTesti);
        });
    }

    // Init state
    if (countDisplay) countDisplay.innerText = `01 / 0${testiItems.length}`;
    testiItems[0].classList.add('active');
    setTimeout(() => testiItems[0].style.opacity = '1', 50);
}

// --- 6. Industry Hover Effects ---
function initIndustryHover() {
    const items = document.querySelectorAll('.industry-item');
    if (items.length === 0) return;

    items.forEach(item => {
        const arrow = item.querySelector('.ind-arrow');
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (arrow) arrow.style.transform = `translate(${x * 0.05}px, ${y * 0.1}px)`;
        });

        item.addEventListener('mouseleave', () => {
            if (arrow) arrow.style.transform = `translate(0, 0)`;
        });
    });
}

// --- 7. Insights Cursor Preview ---
function initInsightsPreview() {
    const preview = document.querySelector('.cursor-image-preview');
    const rows = document.querySelectorAll('.insight-row');

    if (!preview || rows.length === 0) return;

    rows.forEach(row => {
        const title = row.querySelector('.insight-title');
        const imgPath = title ? title.getAttribute('data-img') : '';

        row.addEventListener('mouseenter', () => {
            preview.style.backgroundImage = `url(${imgPath})`;
            preview.style.opacity = '1';
            preview.style.transform = `translate(-50%, -50%) scale(1)`;
        });

        row.addEventListener('mouseleave', () => {
            preview.style.opacity = '0';
            preview.style.transform = `translate(-50%, -50%) scale(0.4)`;
        });
    });

    // Animate preview position smoothly
    function animatePreview() {
        if (preview.style.opacity === '1') {
            preview.style.left = `${State.mouse.x}px`;
            preview.style.top = `${State.mouse.y}px`;
        }
        requestAnimationFrame(animatePreview);
    }
    animatePreview();
}

// --- 8. Liquid Lens (Client Logos) ---
function initLiquidLens() {
    const wrapper = document.querySelector('.liquid-lens-wrapper');
    const items = document.querySelectorAll('.brand-item');

    if (!wrapper || items.length === 0) return;

    function renderLens() {
        const rect = wrapper.getBoundingClientRect();
        // Only run if visible
        if (rect.top < State.height && rect.bottom > 0) {
            const centerX = rect.left + rect.width / 2;

            items.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(centerX - itemCenter);

                // Lens effect range: 250px
                if (distance < 250) {
                    const power = (250 - distance) / 250;
                    item.style.transform = `scale(${1 + (power * 0.25)})`;
                    const img = item.querySelector('img');
                    if (img) img.style.opacity = 0.4 + (power * 0.6);
                    if (img) img.style.filter = `grayscale(${1 - power})`
                } else {
                    item.style.transform = `scale(1)`;
                    const img = item.querySelector('img');
                    if (img) img.style.opacity = 0.4;
                    if (img) img.style.filter = `grayscale(1)`
                }
            });
        }
        requestAnimationFrame(renderLens);
    }
    renderLens();
}

// --- 9. Map Portal ---
function initMapPortal() {
    const cards = document.querySelectorAll('.loc-card');
    const mapLayer = document.getElementById('mapLayer');

    if (!mapLayer || cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('click', function () {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const { x, y, z } = this.dataset;
            mapLayer.style.transform = `scale(${z}) translate(${x}%, ${y}%)`;
            mapLayer.style.filter = "brightness(1.5) blur(2px) contrast(1.2)";

            setTimeout(() => {
                mapLayer.style.filter = "brightness(1.2) blur(0px) contrast(1.1)";
            }, 500);
        });
    });
}

// --- 10. Footer Interactions ---
function initFooterInteractions() {
    // 1. Clocks
    function updateClocks() {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const zones = [
            { id: 'time-london', zone: 'Europe/London' },
            { id: 'time-dubai', zone: 'Asia/Dubai' },
            { id: 'time-singapore', zone: 'Asia/Singapore' }
        ];

        zones.forEach(loc => {
            const el = document.getElementById(loc.id);
            if (el) {
                try {
                    el.textContent = new Intl.DateTimeFormat('en-US', { ...options, timeZone: loc.zone }).format(new Date());
                } catch (e) {
                    el.textContent = "00:00:00";
                }
            }
        });
    }
    setInterval(updateClocks, 1000);
    updateClocks();

    // 2. Magnetic CTA Text
    const ctaText = document.getElementById('magnetCTA');
    if (ctaText) {
        ctaText.parentElement.addEventListener('mousemove', (e) => {
            const rect = ctaText.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            ctaText.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });
        ctaText.parentElement.addEventListener('mouseleave', () => {
            ctaText.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        });
    }

    // 3. Contact Overlay
    const openBtn = document.getElementById('openForm');
    const closeBtn = document.getElementById('closeForm');
    const overlay = document.getElementById('contactOverlay');

    if (openBtn && overlay) {
        openBtn.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => document.body.style.overflow = 'auto', 800);
        });
    }
}

// --- 11. Magnetic Text (Physics) ---
function initMagneticText() {
    const container = document.getElementById('magneticText');
    if (!container) return;

    // Build DOM
    const textContent = "B2B MARKETING FOR GLOBAL BRANDS.";
    container.innerHTML = '';
    textContent.split(" ").forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.style.display = "inline-block";
        wordDiv.style.marginRight = "2vw";
        word.split("").forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.innerText = char;
            span.dataset.x = 0;
            span.dataset.y = 0;
            wordDiv.appendChild(span);
        });
        container.appendChild(wordDiv);
    });

    const chars = document.querySelectorAll('.char');

    function animateMagnetic() {
        chars.forEach((char) => {
            const rect = char.getBoundingClientRect();
            // Checking center of char relative to viewport
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;

            const dx = State.mouse.x - charX;
            const dy = State.mouse.y - charY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const range = 300;

            let targetX = 0, targetY = 0, rot = 0, scale = 1;

            if (dist < range) {
                const force = (range - dist) / range;
                // Repel effect
                targetX = (dx / dist) * -60 * force;
                targetY = (dy / dist) * -60 * force;
                rot = dx * 0.1 * force;
                scale = 1 + (force * 0.3);
                char.style.color = `rgb(${18 - (force * 18)}, 121, ${147 + (force * 50)})`;
            } else {
                char.style.color = 'var(--black)';
            }

            // Lerp
            const currentX = parseFloat(char.dataset.x) || 0;
            const currentY = parseFloat(char.dataset.y) || 0;
            const newX = currentX + (targetX - currentX) * 0.1;
            const newY = currentY + (targetY - currentY) * 0.1;

            char.dataset.x = newX;
            char.dataset.y = newY;
            char.style.transform = `translate(${newX}px, ${newY}px) rotate(${rot}deg) scale(${scale})`;
        });
        requestAnimationFrame(animateMagnetic);
    }
    animateMagnetic();
}

// --- 12. Navigation Logic ---
function initNavigation() {
    const navBar = document.getElementById('mainNav');
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const btnLabel = document.getElementById('btnLabel');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            if (btnLabel) btnLabel.textContent = isOpen ? 'CLOSE' : 'MENU';
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
                if (btnLabel) btnLabel.textContent = 'MENU';
                document.body.style.overflow = 'auto';
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (navBar) {
            if (State.scroll > 50) {
                navBar.classList.add('scrolled');
            } else {
                navBar.classList.remove('scrolled');
            }
        }
    });
}
