# WebDev-L2-LoginAuth — AuthVault Authentication & Session System

> **OIBSIP Track**: Web Development & Designing  
> **Level**: 2 | **Task**: 4  
> **Tech Stack**: HTML5, CSS3, JavaScript (Session Storage API, Password Strength Engine)

---

## 📌 Project Overview
A secure client/session authentication system featuring registration with password complexity enforcement, duplicate identity detection, protected dashboard route guards, and generic credential error messaging to guard against user enumeration attacks.

---

## 🎯 Acceptance Criteria & Checklist
- [x] **Registration Fields**: Full Name, Email, Password, and Password Confirmation.
- [x] **Password Complexity Rule**: Enforces `>= 8 characters` and at least `1 number` with an interactive dynamic strength meter.
- [x] **Duplicate Detection**: Blocks duplicate account creation with friendly feedback.
- [x] **Login Validation**: Requires valid email and matching password.
- [x] **Generic Credential Error Copy**: When invalid credentials are submitted, displays `"Invalid email or password"`, deliberately concealing whether the email exists to protect against user enumeration.
- [x] **Protected Dashboard Route Guard (`dashboard.html`)**: Direct visits without an authenticated session are intercepted and redirected to `index.html?reason=unauthorized`.
- [x] **Session Logout**: Destroys active session tokens and returns the user to the login screen with confirmation notice.
- [x] **Pre-seeded Demo User**: Includes `user@example.com` / `Password123` for evaluator convenience.

---

## 🚀 How to Run Locally
1. Open `WebDev-L2-LoginAuth/index.html` in your browser.
2. Sign in using the preloaded demo credentials:
   - **Email**: `user@example.com`
   - **Password**: `Password123`
3. Notice redirect to `dashboard.html` with authenticated session metadata.
4. Click **Log Out** to confirm session destruction and route interception upon page refresh.
