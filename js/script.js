(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setFooterYear();
    initThemeToggle();
    initMobileNav();
    initCounters();
    initRevealOnScroll();
    initContactForm();
    initCyberQuiz();
    initBreathingCircle();
    initQuoteGenerator();
    initFootprintCalculator();
  }

  /* Footer year */
  function setFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* Dark mode toggle */
  function initThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    var root = document.documentElement;
    var stored = localStorage.getItem("hh-theme");

    if (stored === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (!stored && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.setAttribute("data-theme", "dark");
    }

    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("hh-theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("hh-theme", "dark");
      }
    });
  }

  /* Mobile nav */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Animated counters */
  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { observer.observe(el); });
    } else {
      counters.forEach(animate);
    }
  }

  /* Reveal on scroll */
  function initRevealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* Contact form */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"];
      var email = form.elements["email"];
      var message = form.elements["message"];

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        status.textContent = "Please fill in all fields before sending.";
        status.style.color = "var(--danger)";
        return;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        status.textContent = "Please enter a valid email address.";
        status.style.color = "var(--danger)";
        return;
      }

      status.textContent = "Thank you, " + name.value.trim() + "! Your message has been received.";
      status.style.color = "var(--accent)";
      form.reset();
    });
  }

  /* Cyberbullying recognition quiz */
  function initCyberQuiz() {
    var qEl = document.getElementById("quiz-q");
    var optsEl = document.getElementById("quiz-options");
    var feedbackEl = document.getElementById("quiz-feedback");
    var nextBtn = document.getElementById("quiz-next");
    if (!qEl || !optsEl || !feedbackEl || !nextBtn) return;

    var questions = [
      {
        q: "A classmate creates a fake account to mock a peer publicly. Is this cyberbullying?",
        options: ["Yes, this is cyberbullying", "No, it's just a joke", "Only if it's shared widely"],
        correct: 0,
        explain: "Impersonation intended to mock or humiliate someone is a form of cyberbullying."
      },
      {
        q: "Someone repeatedly sends unwanted, hurtful messages to a person online. What should the target do first?",
        options: ["Reply with an angrier message", "Ignore it and delete the app forever", "Save evidence (screenshot) and report it"],
        correct: 2,
        explain: "Documenting the abuse and reporting it to the platform or a trusted adult is the safest first step."
      },
      {
        q: "A group chat excludes one classmate on purpose and mocks them in a separate thread. Is this a form of cyberbullying?",
        options: ["Yes, deliberate exclusion and mockery counts", "No, exclusion isn't bullying", "Only if physical harm occurs"],
        correct: 0,
        explain: "Deliberate exclusion and mockery online is a recognized form of cyberbullying, even without direct messages to the target."
      },
      {
        q: "What is the best way to support a friend being cyberbullied?",
        options: ["Tell them to toughen up", "Listen, believe them, and help them report it", "Confront the bully publicly online"],
        correct: 1,
        explain: "Listening, believing the person, and helping them report the behavior is the most supportive response."
      }
    ];

    var current = 0;

    function render() {
      var item = questions[current];
      qEl.textContent = item.q;
      optsEl.innerHTML = "";
      feedbackEl.textContent = "";

      item.options.forEach(function (optionText, idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = optionText;
        btn.addEventListener("click", function () {
          handleAnswer(idx, item, btn);
        });
        optsEl.appendChild(btn);
      });
    }

    function handleAnswer(idx, item, clickedBtn) {
      var buttons = optsEl.querySelectorAll("button");
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === item.correct) b.classList.add("correct");
        if (i === idx && i !== item.correct) b.classList.add("wrong");
      });
      feedbackEl.textContent = (idx === item.correct ? "Correct! " : "Not quite. ") + item.explain;
    }

    nextBtn.addEventListener("click", function () {
      current = (current + 1) % questions.length;
      render();
    });

    render();
  }

  /* Breathing circle */
  function initBreathingCircle() {
    var circle = document.getElementById("breathe-circle");
    var text = document.getElementById("breathe-text");
    if (!circle || !text) return;

    var order = ["Inhale", "Hold", "Exhale"];
    var step = 0;
    text.textContent = order[0];
    setInterval(function () {
      step = (step + 1) % order.length;
      text.textContent = order[step];
    }, 4000);
  }

  /* Quote generator */
  function initQuoteGenerator() {
    var quoteEl = document.getElementById("quote-text");
    var btn = document.getElementById("quote-btn");
    if (!quoteEl || !btn) return;

    var quotes = [
      "\u201CYou don't have to control your thoughts. You just have to stop letting them control you.\u201D — Dan Millman",
      "\u201CThis too shall pass.\u201D — Persian proverb",
      "\u201CYou are not your illness. You have an individual story to tell.\u201D — Julian Seifter",
      "\u201CIt's okay to not be okay, as long as you are not giving up.\u201D — Karen Salmansohn",
      "\u201CSelf-care is not selfish. You cannot serve from an empty vessel.\u201D — Eleanor Brownn",
      "\u201CThere is hope, even when your brain tells you there isn't.\u201D — John Green",
      "\u201CYou don't have to see the whole staircase, just take the first step.\u201D — Martin Luther King Jr.",
      "\u201COut of difficulties grow miracles.\u201D — Jean de La Bruyère"
    ];

    var lastIndex = -1;
    btn.addEventListener("click", function () {
      var idx;
      do {
        idx = Math.floor(Math.random() * quotes.length);
      } while (idx === lastIndex && quotes.length > 1);
      lastIndex = idx;
      quoteEl.textContent = quotes[idx];
    });
  }

  /* Carbon footprint estimator */
  function initFootprintCalculator() {
    var km = document.getElementById("cf-km");
    var meat = document.getElementById("cf-meat");
    var flights = document.getElementById("cf-flights");
    var kmOut = document.getElementById("cf-km-out");
    var meatOut = document.getElementById("cf-meat-out");
    var flightsOut = document.getElementById("cf-flights-out");
    var total = document.getElementById("cf-total");
    if (!km || !meat || !flights || !total) return;

    function update() {
      var kmVal = parseInt(km.value, 10);
      var meatVal = parseInt(meat.value, 10);
      var flightsVal = parseInt(flights.value, 10);

      kmOut.textContent = kmVal + " km";
      meatOut.textContent = meatVal + (meatVal === 1 ? " meal" : " meals");
      flightsOut.textContent = flightsVal + (flightsVal === 1 ? " flight" : " flights");

      // Rough estimation formula
      var carTons = (kmVal * 52 * 0.00012);        
      var meatTons = (meatVal * 52 * 0.0033);       
      var flightTons = (flightsVal * 0.9);         

      var result = carTons + meatTons + flightTons;
      total.textContent = result.toFixed(1);
    }

    [km, meat, flights].forEach(function (input) {
      input.addEventListener("input", update);
    });
    update();
  }
})();
