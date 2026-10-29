# SIS Car Booking System
**Version:** v.2026.10.29.1500
**Last Updated:** 2026-10-29 15:00:00+07:00
**Live Website (GitHub Pages):** [https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/](https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/)

## Overview
Welcome to the SIS Car Booking System. This document serves as the main user manual and work log.

## Work Log / Changelog
- **2026-10-29 15:00**: Added Fuel Expense Tracking & Auto-Slip Integration (`เงินที่เติมน้ำมัน / ค่าน้ำมัน`):
  - **Return Car Modal (`#modal-return-form`)**:
    - Added dedicated input field for `เงินที่เติมน้ำมัน (บาท)` alongside odometer in/out and toll fee fields.
    - Pre-loads previously saved fuel amount if the return modal is re-opened for adjustments.
  - **Booking Form (`#booking-form`)**:
    - Added optional `เงินที่เติมน้ำมัน (ถ้ามี)` field for trips where fuel is refueled in advance or recorded retroactively.
    - Integrated with live preview panel (`#pv-fuel`) updating in real-time.
  - **Vehicle Usage Slip & Accounting PDF (`#slip-modal`)**:
    - Seamlessly pre-populates `slip-input-fuel` with recorded fuel money from booking/return records, eliminating manual re-typing.
    - Auto-calculates total claim amount and updates the accounting email body (`openEmailModal`) automatically.
  - **Dashboard & Daily Fleet Summary**:
    - Displays fuel amount badges (`⛽ ค่าน้ำมัน: XXX บ.`) on Dashboard table rows for trips with recorded fuel.
    - Aggregates daily fleet fuel expenses (`totalFuel`) in the Daily Summary Modal (`#daily-summary-modal`) with an extra KPI stat card.
    - Includes fuel expense breakdown in both clipboard summary export and Telegram broadcast notifications.
  - **Backend Google Apps Script (`Code.gs`)**:
    - Added support for `payload.fuelFee` in both `action === "create"` and `action === "update"`.
    - Automatically checks for column `ค่าน้ำมัน` / `เงินเติมน้ำมัน` / `เงินที่เติมน้ำมัน` and auto-provisions the column header in Google Sheets if not yet present.
- **2026-09-21 10:45**: Added Daily Fleet Summary & Telegram Reporting Widget (`สรุปการใช้รถรายวัน`):
  - **Dashboard Summary Widget (`#view-dash`)**:
    - Embedded an interactive daily summary panel with quick date navigation (`< วันก่อนหน้า | วันที่ | วันถัดไป > | วันนี้`).
    - 4 real-time KPI status cards for the selected day: รถที่อยู่ระหว่างปฏิบัติงาน / มีคิววิ่ง (Amber), รถที่คืนแล้วในวัน (Emerald), รถว่างพร้อมใช้งาน (Sky), and ระยะทางรวมที่วิ่ง (Slate, calculated from odometer difference).
  - **Detailed Modal Report (`#daily-summary-modal`)**:
    - Displays detailed breakdown of active trips (license plate, car model, driver, destination, mission purpose, approval status).
    - Includes 1-click Return Car shortcut directly from the summary list.
    - Displays returned vehicles with recorded trip distances and direct link to Vehicle Usage PDF slips.
    - Lists all currently available fleet vehicles with caretaker details.
  - **1-Click Copy & Telegram Dispatch**:
    - "คัดลอกข้อความสรุป" button copies formatted, clean text summary to clipboard for easy sharing in LINE/email.
    - "ส่งเข้า Telegram" button triggers direct Telegram broadcast to the company fleet group via backend Google Apps Script (`action: "send_daily_summary"`).
- **2026-09-21 10:40**: Added Direct Return Car from Timeline/Calendar view (`tab-time`):
  - **Interactive Booking Bars**: Click directly on any booking bar in the 7-day vehicle calendar to open the Return Car modal (`modal-return-form`) with pre-filled vehicle plate, initial mileage, and row index.
  - **Visual Action Indicators**: Added a distinctive `[↩ คืนรถ]` badge and dynamic tooltip on pending/approved bars, and `[✔ คืนแล้ว]` for completed trips (clicking completed trips opens the Vehicle Usage Slip & PDF report).
  - **Optimistic State Updates**: Submitting return from either the calendar or dashboard instantly updates both views without waiting for backend roundtrip latency.
  - **User Guidance**: Added a helpful notification banner below the timeline informing users they can click directly to return cars.
- **2026-09-21 10:15**: Added Vehicle Maintenance & Repair Management and Vehicle Tax & Insurance Renewal Modules:
  - **Vehicle Maintenance Module (`tab-maint`)**:
    - Summary KPI cards: Total maintenance records, Total maintenance costs (THB), and In-progress/Scheduled tasks.
    - Comprehensive maintenance history log table with vehicle filtering, category filtering (regular service, oil changes, tire replacement, general/emergency repairs), and live search.
    - Modal form for recording new maintenance entries with auto-generated ID (`MNT-YYYYMM-XXXX`), service date, mileage at service, recommended next service mileage, garage/service center, cost, responsible driver/technician, and receipt notes.
    - Automatic Telegram notifications sent to fleet administrators when maintenance is logged.
  - **Vehicle Tax & Insurance Tracking Module (`tab-tax`)**:
    - Overview KPI cards categorizing vehicles: Expired (🔴), Expiring soon within 30 days (🟡), and Normal status (🟢).
    - Status dashboard table tracking Road Tax (ป้ายภาษีประจำปี), Compulsory Insurance (พ.ร.บ.), and Voluntary Insurance (ชั้น 1 / 2+ / 3) for all company vehicles.
    - Remaining days countdown and visual badges for each expiration item.
    - 1-Click Renewal Modal: Supports renewing Road Tax, Compulsory Insurance, Voluntary Insurance, or All in one go with automatic +1 year date calculation, cost tracking, policy number, and insurer recording.
    - Automatic Telegram alert summary on renewals and backend function `checkExpiringNotifications()` ready for daily/weekly automated expiration triggers.
  - **Dual Persistence Architecture**: Full offline/instant cache (LocalStorage 0ms) paired with Google Sheets backend auto-creation (`ประวัติซ่อมบำรุง` and `ประกันและภาษีรถ`).
- **2026-09-21 09:10**: Fixed duplicate booking issue across Frontend and Backend (Google Apps Script):
  - **Server-side Validation (`Code.gs`)**: Added strict overlap check on `action: "create"` in Google Apps Script. Rejects duplicate submissions with clear error message if the car is already booked/pending during the requested date range.
  - **Telegram Bot Conflict Prevention**: Added collision check in `handleTelegramClick` to prevent multiple approvals for the same vehicle and overlapping dates.
  - **Timezone-safe Normalization (`toBangkokYMD`)**: Normalized date comparisons to `Asia/Bangkok` (`YYYY-MM-DD`) across all devices and browsers, eliminating timezone parsing drift.
  - **Client-side Race Condition Safeguards**: Blocked form submission if history data is still loading from Google Sheets. Added immediate optimistic cache update on successful booking and disabled confirmation button to prevent double-click submissions.
  - **Master Data Expansion**: Updated fallback `DEFAULT_CARS` with all active company vehicles including `3ฒฮ8017` (Hilux Champ) and electric bike.
- **2026-09-17 09:15**: Added Official SIS Integration Corporate Header & Logo to Vehicle Usage Report:
  - Applied official Thai company name: `บริษัท เอสไอเอส อินติเกรชั่น จำกัด (สำนักงานใหญ่)`
  - Applied official English company name: `SIS Integration Co.,Ltd. (Head Office)`
  - Full registered address: `61/561 ซอยประชาร่วมใจ 31 แขวงทรายกองดิน เขตคลองสามวา กรุงเทพฯ 10510`
  - Registered Tax ID: `0105533042856` | Phone: `02-101-0834, 089-115-0330`
  - Integrated official SIS logo icon (`assets/images/logo.png`) in the document header.
- **2026-09-17 09:03**: Updated accounting email target and added CC support:
  - Set default recipient to `sisintegration005@gmail.com`.
  - Added interactive CC (Carbon Copy) field in the Email modal for forwarding copies to supervisors/team members.
  - Pre-filled CC with requester's email when applicable.
  - Linked CC support to both Gmail Web Compose and desktop mailto clients.
- **2026-09-17 08:57**: Fixed modal layout nesting and CSS display style so the slip report preview displays reliably.
- **2026-09-17 08:55**: Enhanced Vehicle Usage Report with Direct PDF Download, Email Forwarding to Accounting, and Clickable Rows:
  - Enabled clicking directly on any table row in Dashboard to open the report preview.
  - Added 1-click **Download PDF** button using `html2pdf.js` with high-resolution A4 export.
  - Added **Send Email to Accounting** modal with pre-filled Gmail Web & Outlook mailto integration.
  - Added cache-busting query strings on script and style assets to prevent browser caching issues.
- **2026-09-17 08:41**: Added Vehicle Usage Report & Expense Claim Slip (ใบขอใช้รถยนต์และบันทึกการเดินทาง) in official A4 PDF format. Features include:
  - Print/Save as PDF button on Dashboard for approved and completed trips.
  - Interactive preview modal with quick adjust toolbar for fuel expense (ค่าน้ำมัน) and receipt counts.
  - Automatic calculation of odometer differences (ไมล์เข้า - ไมล์ออก) and total claim expenses.
  - Standard 4-party corporate signatures (Applicant/Driver, Approver, Caretaker, Accounting & Finance).
  - Clean `@media print` CSS ensuring 1-page A4 print layout without web chrome or menus.
- **2026-09-16 16:31**: Streamlined approval workflow to be strictly managed via Telegram Bot. Removed Approve/Reject buttons from Web App, keeping Web App focused on booking creation, vehicle returns, and real-time dashboard visibility.
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
