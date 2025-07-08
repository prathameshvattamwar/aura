"use strict";

gsap.registerPlugin(ScrollTrigger);

function initPreloader() {
  const loaderText = new SplitType(".loader-text", { types: "chars" });
  const chars = loaderText.chars;

  const tl = gsap.timeline();
  tl.from(chars, {
    y: 100,
    opacity: 0,
    stagger: 0.05,
    ease: "power3.out",
    duration: 1,
  })
    .to(
      chars,
      {
        opacity: 0,
        stagger: 0.05,
        ease: "power3.in",
        duration: 0.5,
      },
      "+=1"
    )
    .to(".preloader", {
      y: "-100%",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        document.body.style.overflow = "auto";
        initAnimations();
      },
    });
}

function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  document.body.classList.add("cursor-visible");

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const render = () => {
    gsap.to(cursorDot, { duration: 0.1, x: mouseX, y: mouseY });
    gsap.to(cursorOutline, { duration: 0.2, x: mouseX, y: mouseY });
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursorOutline.classList.add("hover")
    );
    el.addEventListener("mouseleave", () =>
      cursorOutline.classList.remove("hover")
    );
  });

  document.addEventListener("mousedown", () =>
    cursorOutline.classList.add("click-effect")
  );
  document.addEventListener("mouseup", () =>
    cursorOutline.classList.remove("click-effect")
  );
}

function initMagneticElements() {
  if (window.matchMedia("(hover: none)").matches) return;

  const magneticElements = document.querySelectorAll("[data-magnetic]");
  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(this, {
        duration: 0.3,
        x: x * 0.2,
        y: y * 0.2,
        ease: "power2.out",
      });
    });
    el.addEventListener("mouseleave", function () {
      gsap.to(this, { duration: 0.3, x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
    });
  });
}

function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector("header");
  const scrollThreshold = 80;

  ScrollTrigger.create({
    start: "top top-=" + scrollThreshold,
    end: 99999,
    onUpdate: (self) => {
      const isScrolled = self.scroll() > scrollThreshold;
      header.classList.toggle("scrolled", isScrolled);

      if (self.direction === -1) {
        header.classList.remove("hidden");
      } else if (
        self.scroll() > lastScroll &&
        self.scroll() > header.offsetHeight
      ) {
        header.classList.add("hidden");
      }
      lastScroll = self.scroll();
    },
  });
}

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const navLinks = mobileNav.querySelectorAll("a");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.classList.toggle("mobile-nav-active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
      document.body.classList.remove("mobile-nav-active");
    });
  });
}

function initTextAnimations() {
  const splitTargets = document.querySelectorAll(".split-text");
  splitTargets.forEach((target) => {
    const split = new SplitType(target, { types: "chars, words" });
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: target,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.5,
      },
      opacity: 0.1,
      stagger: 0.02,
      ease: "power2.out",
    });
  });
}

function initGeneralReveals() {
  const revealElements = document.querySelectorAll(".reveal-fade");
  revealElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });
  });

  const revealCards = document.querySelectorAll(".reveal-card");
  revealCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card.parentElement,
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: (index % 4) * 0.15,
      ease: "power3.out",
    });
  });
}

function initHeroParallax() {
  gsap.to(".hero-content", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

function initServiceCardGlare() {
  const cards = document.querySelectorAll(".service-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

function initHorizontalScroll() {
  if (!window.matchMedia("(min-width: 993px)").matches) return;

  const workTrack = document.querySelector(".work-track");
  const trackWidth = workTrack.scrollWidth;
  const containerWidth = document.querySelector(
    ".work-track-container"
  ).offsetWidth;
  const distance = trackWidth - containerWidth;

  gsap.to(workTrack, {
    x: -distance,
    ease: "none",
    scrollTrigger: {
      trigger: ".work-section",
      start: "center center",
      end: `+=${distance * 1.5}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(".work-progress-bar .progress", {
          width: `${progress * 100}%`,
          ease: "none",
        });
      },
    },
  });

  const workItems = document.querySelectorAll(".work-item");
  workItems.forEach((item) => {
    gsap.from(item.querySelector("img"), {
      clipPath: "inset(30% 30% 30% 30%)",
      scale: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        containerAnimation: gsap.getTweensOf(workTrack)[0],
        start: "left 80%",
        end: "left 50%",
        scrub: 1,
      },
    });
  });
}

function initTechStackAnimation() {
  const techItems = gsap.utils.toArray(".tech-item");
  techItems.forEach((item) => {
    gsap.to(item, {
      y: "-=20",
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2,
    });
  });
}

function initTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"));
    const tl = gsap.timeline();
    tl.fromTo(
      slides[n],
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
    slides[n].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  showSlide(currentSlide);
}

function initProcessLine() {
  gsap.to(".process-line", {
    width: "75%",
    scrollTrigger: {
      trigger: ".process-grid",
      start: "top 70%",
      end: "bottom 80%",
      scrub: 1,
    },
  });
}

function initAnimations() {
  initCursor();
  initMagneticElements();
  initHeaderScroll();
  initMobileMenu();
  initTextAnimations();
  initGeneralReveals();
  initHeroParallax();
  initServiceCardGlare();
  initHorizontalScroll();
  initTechStackAnimation();
  initTestimonialSlider();
  initProcessLine();
}

window.addEventListener("load", initPreloader);
