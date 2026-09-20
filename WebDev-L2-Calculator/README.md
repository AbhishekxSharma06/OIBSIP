# WebDev-L2-Calculator — Precision State-Machine Calculator

> **OIBSIP Track**: Web Development & Designing  
> **Level**: 2 | **Task**: 1  
> **Tech Stack**: HTML5, CSS3, Vanilla JavaScript (Zero `eval()`)

---

## 📌 Project Overview
A fully functional browser calculator built as a finite state machine. It handles basic arithmetic (`+`, `-`, `*`, `/`), sequential operation chaining, controlled division-by-zero errors, backspace deletion, and complete keyboard accessibility without relying on dangerous dynamic execution (`eval()`).

---

## 🎯 Acceptance Criteria & Checklist
- [x] **Primary Display & History Subtitle**: Displays current operand/result and active expression history (`120 / 5 = 24`).
- [x] **0-9 & Decimal Logic**: Handles digit entry, leading zeros, and single decimal points per operand.
- [x] **Safe Arithmetic Engine (Zero `eval()`)**: Computations evaluated through isolated, pure mathematical operator mappings.
- [x] **Division-by-Zero Safeguard**: Triggers controlled `"Cannot divide by zero"` error state without crashing the UI.
- [x] **Operation Chaining**: Sequences like `10 + 5 * 2` evaluate progressively following calculator state standards.
- [x] **DEL / Backspace & AC / Clear**: Safely modifies or resets calculator state.
- [x] **Full Keyboard Support**: Responds to `0-9`, `+`, `-`, `*`, `/`, `Enter`, `=`, `Backspace`, and `Escape`.
- [x] **Ergonomic UI**: Dark LCD screen contrast, tactile button transitions, and visible focus rings.

---

## 🚀 How to Run Locally
Open `WebDev-L2-Calculator/index.html` directly in any browser.
