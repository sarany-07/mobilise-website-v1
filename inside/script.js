gsap.registerPlugin(ScrollTrigger);
window.addEventListener('load', () => {
    // 1. Watermark Movement
    gsap.to(".scrolling-text", {
        xPercent: -40,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5
        }
    });
    // 2. Hero Reveal
    gsap.from(".k-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    });
    // 3. Content Box Floating Animation
    gsap.utils.toArray('.k-content-box').forEach((box, i) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top bottom",
                toggleActions: "play none none reverse"
            },
            y: 80,
            rotation: i % 2 === 0 ? -2 : 2,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
    // 4. Slash Bar Expansion
    gsap.from(".slash-bar", {
        scrollTrigger: {
            trigger: ".k-slash-section",
            scrub: 1,
            start: "top bottom",
            end: "top top"
        },
        scaleX: 0,
        opacity: 0
    });
});
const boxes = document.querySelectorAll('.k-content-box');
boxes.forEach(box => {
    box.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = box.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        gsap.to(box, {
            rotationY: x * 10,
            rotationX: -y * 10,
            ease: "power2.out",
            duration: 0.6
        });
    });    
    box.addEventListener('mouseleave', () => {
        gsap.to(box, { rotationY: 0, rotationX: 0, duration: 0.6 });
    });
});
