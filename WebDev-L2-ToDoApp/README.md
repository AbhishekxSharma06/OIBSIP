# WebDev-L2-ToDoApp — TaskFlow Pro

> **OIBSIP Track**: Web Development & Designing  
> **Level**: 2 | **Task**: 3  
> **Tech Stack**: HTML5, CSS3, Vanilla JavaScript (Event Delegation, LocalStorage API)

---

## 📌 Project Overview
A dual-state task management application dividing daily workflow cleanly into **Pending Tasks** and **Completed Tasks**. Engineered with inline task editing, priority classification, live counter badges, and durable JSON synchronization in `localStorage`.

---

## 🎯 Acceptance Criteria & Checklist
- [x] **Task Input & Insertion**: Immediate validation preventing empty/whitespace items; prepend to Pending list.
- [x] **Dual Column Views**: Real-time division between Pending and Completed tasks.
- [x] **Complete / Toggle Action**: Smooth transition between pending and completed lists without duplicates.
- [x] **Inline Editing**: Modal/dialog editing that preserves task identity (`id`) and original creation timestamp (`createdAt`).
- [x] **Delete Functionality**: Permanent removal of tasks from either list.
- [x] **Live Counter Badges**: Live counters (`Pending (N)`, `Completed (N)`) updated on every state mutation.
- [x] **Timestamps**: Displays formatted creation time (`Added: Oct 15, 10:30 AM`) and completion time.
- [x] **Storage Persistence & Corruption Recovery**: Auto-sync to browser `localStorage` with fallback and default seeds.
- [x] **Empty States**: Distinct visual empty states with helpful guidance for both lists.
- [x] **Search Filter & Clear All**: Quick search filter across task titles and bulk removal of completed items.

---

## 🚀 How to Run Locally
Open `WebDev-L2-ToDoApp/index.html` directly in any web browser.
