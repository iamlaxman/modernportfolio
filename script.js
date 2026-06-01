/* =============================================
   LAXMAN POUDEL — PORTFOLIO
   script.js
   ============================================= */

"use strict";

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Navbar scroll behaviour ── */
const navbar = $("#navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

/* ── Hamburger / mobile menu ── */
const hamburger = $("#hamburger");
const navLinks = $("#nav-links");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

// close when a link is clicked
$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ── Terminal typewriter ── */
const terminalOutput = $("#terminal-output");

const terminalLines = [
  {
    delay: 0,
    html: '<span class="prompt">❯</span> <span class="cmd">whoami</span>',
  },
  { delay: 500, html: '<span style="color:var(--text)">Laxman Poudel</span>' },
  { delay: 900, html: "" }, // blank line
  {
    delay: 1000,
    html: '<span class="prompt">❯</span> <span class="cmd">cat profile.json</span>',
  },
  { delay: 1500, html: '<span class="out-cm">{</span>' },
  {
    delay: 1700,
    html: '  <span class="out-key">"role"</span>: <span class="out-str">"Security Engineer"</span>,',
  },
  {
    delay: 1850,
    html: '  <span class="out-key">"focus"</span>: <span class="out-str">"Ethical Hacking"</span>,',
  },
  {
    delay: 2000,
    html: '  <span class="out-key">"stack"</span>: <span class="out-val">[</span>',
  },
  {
    delay: 2100,
    html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="out-str">"Python"</span>, <span class="out-str">"JavaScript"</span>,',
  },
  {
    delay: 2200,
    html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="out-str">"Kali Linux"</span>, <span class="out-str">"React"</span>',
  },
  { delay: 2300, html: '  <span class="out-val">]</span>,' },
  {
    delay: 2450,
    html: '  <span class="out-key">"status"</span>: <span class="out-ok">"available"</span>',
  },
  { delay: 2600, html: '<span class="out-cm">}</span>' },
  { delay: 2900, html: "" },
  {
    delay: 3000,
    html: '<span class="prompt">❯</span> <span class="cmd">ls skills/</span>',
  },
  {
    delay: 3400,
    html: `<div class="s-tags">
      <span class="s-tag">pen-testing</span>
      <span class="s-tag">web-dev</span>
      <span class="s-tag">network-admin</span>
      <span class="s-tag">ctf</span>
      <span class="s-tag">api-design</span>
      <span class="s-tag">linux</span>
    </div>`,
  },
  {
    delay: 3800,
    html: '<span class="prompt">❯</span> <span class="caret"></span>',
  },
];

function runTerminal() {
  if (!terminalOutput) return;
  terminalOutput.innerHTML = "";

  terminalLines.forEach(({ delay, html }) => {
    setTimeout(() => {
      if (html === "") {
        // blank spacer
        const br = document.createElement("div");
        br.style.height = "0.4rem";
        terminalOutput.appendChild(br);
      } else {
        const line = document.createElement("div");
        line.style.lineHeight = "1.9";
        line.innerHTML = html;
        terminalOutput.appendChild(line);
      }
      // auto-scroll inside terminal
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, delay);
  });
}

// run on load
runTerminal();

/* ── Counter animation ── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── Intersection Observer — generic ── */
const observerOpts = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" };

const genericObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      genericObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

// Hero text and terminal
$$(".hero-text, .terminal-card").forEach((el) => genericObserver.observe(el));

// Fade-up sections
$$(".fade-up").forEach((el) => genericObserver.observe(el));

/* ── Skill bars ── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = $$(".skill-fill", entry.target);
        fills.forEach((fill) => {
          fill.style.width = fill.dataset.width + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const skillsGrid = $(".skills-grid");
if (skillsGrid) skillObserver.observe(skillsGrid);

/* ── Counter observer ── */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numEls = $$("[data-target]", entry.target);
        numEls.forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const heroStats = $(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);

/* ── Staggered card observer ── */
function observeStaggered(selector, delayStep = 80) {
  const cards = $$(selector);
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = cards.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, idx * delayStep);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  cards.forEach((card) => cardObserver.observe(card));
}

observeStaggered(".services-grid .service-card", 90);
observeStaggered(".projects-grid .proj-card", 110);

/* ── Active nav link on scroll ── */
const sections = $$('section[id], div[id="home"]');
const navAnchors = $$(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => (a.style.color = ""));
        const active = navAnchors.find(
          (a) => a.getAttribute("href") === "#" + entry.target.id,
        );
        if (active) active.style.color = "var(--accent)";
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => navObserver.observe(s));

/* ── Contact form validation & submission ── */
const form = $("#contact-form");
const submitBtn = $("#submit-btn");
const successMsg = $("#form-success");

function validateField(input) {
  const group = input.closest(".form-group");
  const errorEl = $(".field-error", group);
  let message = "";

  if (!input.value.trim()) {
    message = "This field is required.";
  } else if (
    input.type === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
  ) {
    message = "Please enter a valid email address.";
  }

  input.classList.toggle("error", !!message);
  errorEl.textContent = message;
  errorEl.classList.toggle("visible", !!message);
  return !message;
}

if (form) {
  // real-time validation on blur
  $$("input, textarea", form).forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields first
    const fields = $$("input, textarea", form);
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) return;

    // Show loading state
    submitBtn.disabled = true;
    $(".btn-text", submitBtn).hidden = true;
    $(".btn-loading", submitBtn).hidden = false;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // Success
        form.reset();
        successMsg.hidden = false;
        setTimeout(() => {
          successMsg.hidden = true;
        }, 5000);
      } else {
        // Formspree returned an error
        const data = await response.json();
        const msg =
          data?.errors?.map((e) => e.message).join(", ") ||
          "Something went wrong. Please try again.";
        alert(msg);
      }
    } catch (err) {
      alert("Network error — please check your connection and try again.");
    } finally {
      // Always restore button
      submitBtn.disabled = false;
      $(".btn-text", submitBtn).hidden = false;
      $(".btn-loading", submitBtn).hidden = true;
    }
  });
}

/* ── Footer year ── */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Smooth anchor links with offset ── */
document.addEventListener("click", (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const targetId = anchor.getAttribute("href").slice(1);
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ── Reduced motion: disable animations ── */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.setProperty("--ease", "linear");
  $$(".skill-fill").forEach((el) => {
    el.style.transition = "none";
    el.style.width = el.dataset.width + "%";
  });
}
