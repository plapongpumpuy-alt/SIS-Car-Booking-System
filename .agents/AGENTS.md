# SIS Car Booking System - Agent Context

## Architecture & Tech Stack
- **Frontend Phase 1**: HTML5, Tailwind CSS (via CDN), Vanilla JavaScript (Modular).
- **UI Design**: Modern Clean / Corporate style.
- **Responsive**: Mobile-first approach using Tailwind's utility classes.

## Key File Structures
- `.agents/AGENTS.md`: Agent context and rules.
- `README.md`: User manual, work log, and version information.
- `index.html`: Main application entry point.
- `assets/css/style.css`: Custom styles.
- `assets/js/utils.js`: Utility functions (Date formatting, ID generation).
- `assets/js/app.js`: Main application logic (State management, Validation, DOM manipulation).

## Rules & Conventions
- **Versioning**: Timestamp-based versioning `v.YYYY.MM.DD.HHMM`.
- **Documentation**: Keep `README.md` and `AGENTS.md` updated with significant changes.
- **Logging**: Keep a log of work and latest updates in `README.md` or a dedicated log file.

## Conversation & Design Decisions
- Initial project setup (2026-09-15 16:19).
- Phase 1 Frontend implementation with Tailwind CSS and Vanilla JS, avoiding ES6 imports to allow testing via local `file://` protocol directly (2026-09-15 16:21).
- GitHub Pages selected for public hosting (2026-09-16 15:12). MinGit configured, repo initialized, and deployment pipeline prepared.
