// 1. Particle System Configuration
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 60 },
    "color": { "value": "#64ffda" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5 },
    "size": { "value": 3 },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#64ffda",
      "opacity": 0.2,
      "width": 1
    },
    "move": { "enable": true, "speed": 1.5 }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" }
    }
  },
  "retina_detect": true
});

// 2. Typewriter Effect Logic
const textElement = document.querySelector(".typewriter");
if (textElement) {
    const words = textElement.getAttribute("data-text").split(", ");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000); // Wait before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500); // Wait before typing next word
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    document.addEventListener("DOMContentLoaded", type);
}