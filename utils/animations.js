import { walletConnect } from '../constants.js';
import { getSoundEnabled } from './SoundToggleButton.js';

gsap.registerPlugin(ScrollTrigger);

// Utility function to toggle class
const toggleClass = (el, className, add) => {
  document.querySelector(el)?.classList[add ? "add" : "remove"](className);
};

// Slider Animations (Enter & Leave Back)
ScrollTrigger.create({
  trigger: ".content",
  start: "top center",
  end: "bottom top",
  scrub: true,
  onEnter: () => {
    toggleClass(".slider", "disable-animation", true);
    gsap.to(".slider", { y: -300, duration: 1, ease: "power2.out" });
    gsap.to(".slider .item img", {
      y: -300,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    });
  },
  onLeaveBack: () => {
    toggleClass(".slider", "disable-animation", false);
    gsap.to(".slider", { y: 0, duration: 1, ease: "power2.out" });
    gsap.to(".slider .item img", {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    });
  },
});

// Banner visibility
ScrollTrigger.create({
  trigger: ".main",
  start: "top 90%",
  end: "top 40%",
  scrub: true,
  onEnter: () => toggleClass(".banner", "disable-hidden", true),
  onLeaveBack: () => toggleClass(".banner", "disable-hidden", false),
});

// Author content slide-out
gsap.timeline({
  scrollTrigger: {
    trigger: ".content",
    start: "top 50%",
    end: "bottom 50%",
    scrub: 1,
  },
})
.to(".content .author", {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
}, 0)
.to(".content .author h2, .content .author p, .content .author button, .content h1, .content h1::after", {
  x: -50,
  opacity: 0,
  stagger: 0.1,
  duration: 1,
  ease: "power2.out",
}, 0);

// Model scroll-in
gsap.to(".model", {
  y: 587,
  scale: 1.1,
  opacity: 0.99,
  width: "40%",
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".main",
    start: "top 95%",
    end: "top 20%",
    toggleActions: "play none none reverse",
  },
});

// Slider rotations
const sliderConfigs = [
  { selector: ".main .slider1:not([reverse])", rotateZ: 10 },
  { selector: ".main .slider1[reverse]", rotateZ: -10 }
];

sliderConfigs.forEach(({ selector, rotateZ }) => {
  gsap.to(selector, {
    y: -50,
    rotateZ,
    zIndex: 2,
    duration: 1.2,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".main",
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Main section lift
gsap.to(".main", {
  y: 90,
  duration: 1.2,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".main",
    start: "top 80%",
    end: "top 20%",
    toggleActions: "play none none reverse",
  },
});

// modeli slide in
gsap.to(".modeli", {
  y: 60,
  opacity: 1,
  duration: 1.2,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".main",
    start: "top bottom",
    end: "top 20%",
    toggleActions: "play none none reverse",
  },
});

// Wallet connect sound + content reveal
gsap.to(".main .content1 .author1, .main .content1 .author1 h2, .main .content1 .author1 p, .main .content1 .author1 button, .main .content1 h1, .main .content1 h1::after", {
  opacity: 1,
  y: 20,
  duration: 1.2,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".ok",
    start: "top bottom",
    end: "top center",
    toggleActions: "play none none reverse",
    onEnter: () => {
      if (getSoundEnabled()) {
        walletConnect.currentTime = 0;
        walletConnect.play();
      }
    },
    onLeaveBack: () => {
      if (getSoundEnabled()) {
        walletConnect.currentTime = 0;
        walletConnect.play();
      }
    },
  },
});
