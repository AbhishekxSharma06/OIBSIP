/**
 * Portfolio Interactive Scripts — Abhishek Sharma
 * Handles smooth scroll spy, mobile drawer navigation, email clipboard helper,
 * and contact form validation with accessible user feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile menu when any anchor link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Scroll Spy Navigation Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 3. Email Copy to Clipboard Feature
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'abhishek.se06@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        copyEmailBtn.style.backgroundColor = 'var(--accent-cyan)';
        copyEmailBtn.style.color = '#000';

        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.backgroundColor = '';
          copyEmailBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for browsers with restricted clipboard permissions
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // 4. Contact Form Validation and Submission
  const contactForm = document.getElementById('contactForm');
  const formResponseAlert = document.getElementById('formResponseAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const subjectInput = document.getElementById('userSubject');
      const messageInput = document.getElementById('userMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email (RFC 5322 standard check)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        const submitBtn = document.getElementById('formSubmitBtn');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';

        // Simulate seamless submission feedback
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;

          formResponseAlert.className = 'form-response-alert success';
          formResponseAlert.textContent = `✔ Thank you, ${nameInput.value.trim()}! Your message has been prepared. Opening your email client to send...`;

          // Launch mailto client with prefilled inputs
          const subject = encodeURIComponent(subjectInput.value.trim() || 'Portfolio Contact Inquiry');
          const body = encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`);
          window.location.href = `mailto:abhishek.se06@gmail.com?subject=${subject}&body=${body}`;

          contactForm.reset();

          setTimeout(() => {
            formResponseAlert.textContent = '';
          }, 8000);
        }, 600);
      }
    });

    // Clear error states on input focus
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }
});
