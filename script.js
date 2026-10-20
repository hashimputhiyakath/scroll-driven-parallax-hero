console.log("JavaScript is connected.");

gsap.registerPlugin(ScrollTrigger);

const heroTimeline = gsap.timeline({
  defaults: {
    duration: 1,
    ease: "none",
  },

  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=1000",
    scrub: true,
    pin: true,
    markers: true,
  },
});

heroTimeline.fromTo(
  ".sky",

  {
    scale: 1.14,
  },

  {
    scale: 1,
    duration: 1,
  },

  0,
);

heroTimeline.fromTo(".earth", { y: 300 }, { y: 0 }, 0);

heroTimeline.fromTo(".moonscape", { y: 80 }, { y: 0 }, 0);

heroTimeline.fromTo(
  ".frame",

  {
    scale: 1.6,
    opacity: 0,
  },

  {
    scale: 1,
    opacity: 1,
    duration: 0.3,
  },

  0.3,
);
heroTimeline.fromTo(
  ".ground",

  {
    y: 260,
  },

  {
    y: 0,
    duration: 0.3,
  },

  0.35,
);
// title

// Entrance: rise slightly and become visible.
heroTimeline.fromTo(
  ".hero-title",

  {
    opacity: 0,
    y: 30,
  },

  {
    opacity: 1,
    y: 0,
    duration: 0.15,
  },

  0.1,
);

// Exit: continue upward and disappear.
heroTimeline.to(
  ".hero-title",

  {
    opacity: 0,
    y: -20,
    duration: 0.15,
  },

  0.75,
);

// dust
heroTimeline.to(
  ".dust-veil",

  {
    opacity: 0,
    y: -100,
    scale: 1.25,
    duration: 0.18,
  },

  0,
);

const dustCanvas = document.querySelector(".dust-particles");
const dustContext = dustCanvas.getContext("2d");

let dustWidth = 1;
let dustHeight = 1;

// Create the particles once.
const dustParticles = Array.from({ length: 100 }, () => ({
  x: Math.random(),
  y: Math.random(),
  radius: 0.6 + Math.random() * 1.8,
  opacity: 0.2 + Math.random() * 0.6,
  speed: 6 + Math.random() * 12,
}));

// Match the drawing surface to its displayed size.
function resizeDust() {
  dustWidth = Math.max(1, dustCanvas.clientWidth);
  dustHeight = Math.max(1, dustCanvas.clientHeight);

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  dustCanvas.width = Math.round(dustWidth * pixelRatio);
  dustCanvas.height = Math.round(dustHeight * pixelRatio);

  dustContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

resizeDust();

const dustObserver = new ResizeObserver(resizeDust);
dustObserver.observe(dustCanvas);

// Move and redraw the particles.
let previousDustTime = null;

function animateDust(now) {
  const secondsPassed = previousDustTime === null ? 0 : Math.min((now - previousDustTime) / 1000, 0.05);

  previousDustTime = now;

  // The veil finishes fading at timeline position 0.18.
  if (heroTimeline.time() < 0.18) {
    dustContext.clearRect(0, 0, dustWidth, dustHeight);
    dustContext.fillStyle = "#dfe6f2";

    for (const particle of dustParticles) {
      particle.x += (particle.speed * secondsPassed) / dustWidth;
      particle.y -= (particle.speed * 0.5 * secondsPassed) / dustHeight;

      // Re-enter from the opposite edge.
      if (particle.x > 1) particle.x = 0;
      if (particle.y < 0) particle.y = 1;

      dustContext.globalAlpha = particle.opacity;
      dustContext.beginPath();

      dustContext.arc(particle.x * dustWidth, particle.y * dustHeight, particle.radius, 0, Math.PI * 2);

      dustContext.fill();
    }

    dustContext.globalAlpha = 1;
  }

  requestAnimationFrame(animateDust);
}

requestAnimationFrame(animateDust);
