// GSAP Intro Animation
window.addEventListener('load', () => {
    // Reveal GROW letters one by one
    gsap.from(".grow-wrap span", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
    });

    // Reveal Rest of Title
    gsap.from(".display-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out"
    });

    // Reveal Info Card
    gsap.from(".info-card", {
        x: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power4.out"
    });
});

// Mobile Fallback for Accordion
if (window.matchMedia("(max-width: 1024px)").matches) {
    const accItems = document.querySelectorAll('.acc-item');
    accItems.forEach(item => {
        item.addEventListener('click', () => {
            const isOpen = item.classList.contains('active-mobile');
            accItems.forEach(el => {
                el.classList.remove('active-mobile');
                el.querySelector('.acc-body').style.maxHeight = "0";
            });
            
            if (!isOpen) {
                item.classList.add('active-mobile');
                item.querySelector('.acc-body').style.maxHeight = "400px";
            }
        });
    });
}