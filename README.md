# OIBSIP — Web Development & Designing Master Repository

> **Student**: Abhishek Sharma  
> **Program**: Oasis Infobyte Internship Program (OIBSIP)  
> **Domain**: Web Development & Designing Track  
> **Status**: Completed Levels 1, 2, and 3 (All 8 Tasks)  
> **Standard**: Grounded in the official OIBSIP PRD, TRD, UI/UX, and Delivery Matrix Blueprint

---

## 📑 Repository Structure & Project Index

This single public repository contains all projects organized strictly by track, level, and task naming as mandated by the OIBSIP specification:

```
OIBSIP/
├── WebDev-L1-LandingPage/
│   ├── index.html                  # Semantic product landing page for "Nova"
│   ├── styles.css                  # Responsive CSS with variables & 8-pt spacing
│   ├── README.md                   # Task requirements, QA checklist, run guide
│   └── screenshots/                # Task preview screenshots
│
├── WebDev-L1-PersonalPortfolio/
│   ├── index.html                  # Full stack developer portfolio & digital resume
│   ├── styles.css                  # High-contrast accessible design system
│   ├── script.js                   # Smooth-scroll spy, mobile drawer & form validation
│   ├── README.md                   # Feature documentation & run instructions
│   └── screenshots/                # Portfolio screenshots
│
├── WebDev-L1-TemperatureConverter/
│   ├── index.html                  # Scientific °C, °F, K converter interface
│   ├── styles.css                  # Dynamic thermal range indicator & result tiles
│   ├── script.js                   # Pure conversion math, validation & absolute-zero guard
│   ├── README.md                   # Formulas, physical boundaries & QA checklist
│   └── screenshots/                # Conversion & edge-case error screenshots
│
├── WebDev-L2-Calculator/
│   ├── index.html                  # Precision browser calculator
│   ├── styles.css                  # 4-column ergonomic keypad & high-contrast LCD
│   ├── script.js                   # Finite state machine, operator chaining, ZERO eval()
│   ├── README.md                   # Arithmetic state machine design & test cases
│   └── screenshots/                # Calculation & division-by-zero screenshots
│
├── WebDev-L2-TributePage/
│   ├── index.html                  # Tribute honoring Dr. A.P.J. Abdul Kalam
│   ├── styles.css                  # Dual section backgrounds & dual typography (Serif/Sans)
│   ├── README.md                   # Biography, milestone chronology & references
│   └── screenshots/                # Hero, quote & timeline screenshots
│
├── WebDev-L2-ToDoApp/
│   ├── index.html                  # TaskFlow Pro dual-state productivity board
│   ├── styles.css                  # Pending & completed cards, priority badges & animations
│   ├── script.js                   # Single source of truth, inline editing, localStorage
│   ├── README.md                   # CRUD data model & storage schema
│   └── screenshots/                # Dual board, inline edit & mobile screenshots
│
├── WebDev-L2-LoginAuth/
│   ├── index.html                  # AuthVault sign-in & registration portal
│   ├── dashboard.html              # Protected user dashboard view
│   ├── styles.css                  # Security aesthetic, alerts & strength meter
│   ├── script.js                   # Password rules, generic error copy, route guards
│   ├── README.md                   # User enumeration defense & session hygiene
│   └── screenshots/                # Auth forms & protected dashboard screenshots
│
└── WebDev-L3-PizzaDelivery/
    ├── client/                     # Interactive custom pizza builder & live order tracker
    ├── server/                     # Express REST API, auth, inventory & cron alert job
    ├── README.md                   # Full-stack architecture, consistency rule & test guide
    ├── demo/                       # Video title card format & LinkedIn post template
    └── screenshots/                # Pizza builder, checkout, tracker & admin console
```

---

## 🎯 Completion & Delivery Matrix

| Level | Task | Project Name | Tech Stack | Key Architectural Features |
|---|---|---|---|---|
| **Level 1** | Task 1 | [Landing Page](WebDev-L1-LandingPage/) | HTML5, CSS3 | Sticky nav, hero CTA, 3-card feature grid, live telemetry, pricing tiers. |
| **Level 1** | Task 2 | [Personal Portfolio](WebDev-L1-PersonalPortfolio/) | HTML5, CSS3, JS | Categorized skills matrix, project showcase cards, smooth scroll spy. |
| **Level 1** | Task 3 | [Temperature Converter](WebDev-L1-TemperatureConverter/) | HTML5, CSS3, JS | Pure conversion functions, simultaneous multi-unit output, absolute zero physics guard. |
| **Level 2** | Task 1 | [Calculator](WebDev-L2-Calculator/) | HTML5, CSS3, JS | Finite state machine, operation chaining, keyboard listeners, **strictly zero `eval()`**. |
| **Level 2** | Task 2 | [Tribute Page](WebDev-L2-TributePage/) | HTML5, CSS3 | Dr. A.P.J. Abdul Kalam tribute, dual backgrounds, serif quote styling, milestone timeline. |
| **Level 2** | Task 3 | [To-Do Web App](WebDev-L2-ToDoApp/) | HTML5, CSS3, JS | Dual-state pending/completed lists, inline editing, live counts, `localStorage` persistence. |
| **Level 2** | Task 4 | [Login Authentication](WebDev-L2-LoginAuth/) | HTML5, CSS3, JS | Password strength rules, generic error reporting against user enumeration, protected route guard. |
| **Level 3** | Task 1 | [Pizza Delivery Platform](WebDev-L3-PizzaDelivery/) | React, Node, Express, Razorpay | 4-step custom builder, server-side stock & price verification, live order tracking, admin inventory & cron job. |

---

## 🛡️ Code Quality & Design Principles ("Written by Human")

1. **Semantic HTML5 Elements**: Explicit `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<aside>`, and `<dialog>` tags used universally.
2. **CSS Variables & Shared UI System**: Structured design tokens based on the Page 3 blueprint:
   - Primary: `#4f46e5`, Dark Slate: `#0f172a`, Secondary: `#06b6d4`, Accent: `#8b5cf6`.
   - 8-point spacing scale, 12-16px border radii, high contrast, and accessible `:focus-visible` states.
3. **Security Standards**:
   - **No `eval()`**: Arithmetic calculator runs on an isolated operator map.
   - **User Enumeration Defense**: Login authentication returns generic error messages (`"Invalid email or password"`).
   - **Server-Side Consistency**: Order pricing and stock availability are always recomputed server-side before mutating inventory.
4. **Resilient Local Execution**:
   - Level 1 & Level 2 tasks run standalone in any browser with zero dependencies.
   - Level 3 API includes a built-in JSON file/memory persistence adapter that works out-of-the-box without requiring an external MongoDB server setup.

---

## 📹 Video Demo & Submission Title Card Format

As required by the OIBSIP Submission Guide, demo videos begin with the official 2-second static title card:

```
===================================================================
Full Name      : Abhishek Sharma
Assigned Track : Web Development & Designing
Task Titles    : Level 1 (Tasks 1-3), Level 2 (Tasks 1-4), Level 3 (Task 1)
Internship     : Oasis Infobyte Internship Program (OIBSIP)
===================================================================
```

---

## 📢 LinkedIn Post Guidelines
When posting project walkthroughs on LinkedIn:
- Tag: **Oasis Infobyte** (`@Oasis Infobyte`)
- Include required hashtag: `#oasisinfobyte`
- Include public GitHub repository link and demo video attachment.
- Templates are provided inside `WebDev-L3-PizzaDelivery/demo/README.md`.

---

## 🚀 Quick Start & Local Preview

### Preview Static Tasks (Levels 1 & 2)
You can open any task's `index.html` file directly in your browser, or start a local HTTP server from the root directory:
```bash
python -m http.server 8000
```
Then browse to `http://localhost:8000/WebDev-L1-LandingPage/` or any other task directory.

### Run Full-Stack Capstone (Level 3 PizzaLab)
```bash
# Start backend API
cd WebDev-L3-PizzaDelivery/server
npm install
npm start

# In another terminal or browser, open client/index.html or run dev:
cd ../client
npm install
npm run dev
```

---

&copy; 2026 Abhishek Sharma &bull; Built with dedication for the Oasis Infobyte Internship Program.
