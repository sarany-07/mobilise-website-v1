const steps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.next-trigger');
const liquid = document.querySelector('.liquid-layer');
const currentStepUI = document.getElementById('current-step');
let currentIdx = 0;

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Liquid Transition Up
        gsap.to(liquid, {
            top: 0,
            duration: 0.6,
            ease: "power4.inOut",
            onComplete: () => {
                // Change Step
                steps[currentIdx].classList.remove('active');
                currentIdx++;
                steps[currentIdx].classList.add('active');
                currentStepUI.innerText = `0${currentIdx + 1}`;

                // Liquid Transition Away
                gsap.to(liquid, {
                    top: "-100%",
                    duration: 0.6,
                    ease: "power4.inOut",
                    onComplete: () => {
                        gsap.set(liquid, {top: "100%"});
                    }
                });
            }
        });
    });
});