# SIS Car Booking System
**Version:** v.2026.09.16.1555
**Last Updated:** 2026-09-16 15:55:00+07:00
**Live Website (GitHub Pages):** [https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/](https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/)

## Overview
Welcome to the SIS Car Booking System. This document serves as the main user manual and work log.

## Work Log / Changelog
- **2026-09-16 15:55**: Added Approver/Rejector identification modal and formatted remark recording for Column N (`หมายเหตุ`). Approving/Rejecting now records the action taker's name (e.g. `Approved โดย นาย...` / `Rejected โดย นาย... - เหตุผล: ...`).
- **2026-09-16 15:39**: Fixed slow initial loading of employee and vehicle dropdowns by implementing Instant Local Caching (LocalStorage + Master Data Fallback) with background Google Apps Script sync (SWR pattern). Dropdowns now load in 0ms immediately.
- **2026-09-16 15:30**: Successfully published and deployed to GitHub Pages at `https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/`.
- **2026-09-16 15:12**: Initialized Git repository, installed Git environment, and prepared deployment configuration for GitHub Pages.
- **2026-09-16 10:35**: Added `history.html` and `assets/js/history.js` to view booking history. Updated `index.html` header to include a navigation menu.
- **2026-09-15 16:41**: (Phase 2 Completed) Connected the frontend form to the live Google Sheets Backend via Google Apps Script API. Replaced mockSubmit with real `fetch()` API call. Added loading spinner on submit.
- **2026-09-15 16:37**: Refactored the UI to align strictly with Google Sheets database structures. Changed user input to an employee dropdown that autofills email/tel/position. Updated vehicle selection to use license plates. Changed payload structure to map directly to the `ตารางบันทึกการใช้รถ` columns.
- **2026-09-15 16:22**: Developed Phase 1 Frontend. Added `index.html`, `assets/css/style.css`, `assets/js/utils.js`, `assets/js/app.js`. Implemented UI with Tailwind CSS, real-time preview, form validation, and mock submit function.
- **2026-09-15 16:19**: Initialized the project structure.

## Deployment to GitHub Pages (วิธีเผยแพร่เว็บ)
1. สร้าง Repository ใหม่บน GitHub เช่น ชื่อ `sis-car-booking` (เลือกแบบ Public)
2. เชื่อมต่อ Remote และ Push โค้ด:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. เปิดไปที่ GitHub Repository -> **Settings** -> **Pages**
4. ในส่วน **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: เลือก `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
5. รอระบบประมวลผลประมาณ 1 นาที จะได้รับ URL สำหรับเข้าใช้งาน เช่น `https://<your-username>.github.io/<repo-name>/`

## User Manual
### How to Run the Application Locally
1. Navigate to the project folder: `e:\Project\SIS Car Booking System\`
2. Double-click the `index.html` file to open it in your preferred web browser (Google Chrome, Microsoft Edge, Safari, etc.).

### Features
- **Booking Form:** Select user, travel dates, and vehicle from the synchronized database.
- **Auto-calculation:** Number of travel days is calculated automatically.
- **Live Preview:** See your booking summary update in real-time as you type or select.
- **Validation:** Ensures date correctness (no past dates, end date must be after start date).
- **Backend Integration:** Saves booking records directly into the Google Sheets database (`ตารางบันทึกการใช้รถ`).
