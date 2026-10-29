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
- `google-apps-script/Code.gs`: Backend Google Apps Script (API handler, server-side duplicate check, Telegram Bot Webhook).

## Rules & Conventions
- **Versioning**: Timestamp-based versioning `v.YYYY.MM.DD.HHMM`.
- **Documentation**: Keep `README.md` and `AGENTS.md` updated with significant changes.
- **Logging**: Keep a log of work and latest updates in `README.md` or a dedicated log file.

## Conversation & Design Decisions
- Initial project setup (2026-09-15 16:19).
- Phase 1 Frontend implementation with Tailwind CSS and Vanilla JS, avoiding ES6 imports to allow testing via local `file://` protocol directly (2026-09-15 16:21).
- GitHub Pages selected for public hosting (2026-09-16 15:12). MinGit configured, repo initialized, and deployment pipeline prepared.
- Published live via GitHub Pages branch `gh-pages` at `https://plapongpumpuy-alt.github.io/SIS-Car-Booking-System/` (2026-09-16 15:30).
- Implemented Instant Local Caching (LocalStorage + Master Data Fallback) with background SWR sync to resolve slow dropdown loading caused by Google Apps Script cold starts (2026-09-16 15:39).
- Added Approver/Rejector identity tracking modal and formatted remark output to Column N (`หมายเหตุ`) (2026-09-16 15:55).
- Dedicated approval workflow to Telegram Bot only; removed manual approval triggers from Web App to prevent authorization bypass (2026-09-16 16:31).
- Implemented Vehicle Usage Report & Expense Claim Slip (ใบขอใช้รถยนต์และบันทึกการเดินทาง) with `@media print` A4 layout, interactive fuel/receipt adjust toolbar, and accounting attachment section (2026-09-17 08:41).
- Added 1-click Download PDF (`html2pdf.js`), Send Email to Accounting modal (Gmail Web & mailto), and made entire table rows clickable (2026-09-17 08:55).
- Configured default accounting submission recipient to `sisintegration005@gmail.com` and added CC field support for Gmail Web & mailto (2026-09-17 09:03).
- Added official company corporate branding (SIS Integration Co.,Ltd. / บริษัท เอสไอเอส อินติเกรชั่น จำกัด (สำนักงานใหญ่), full registered address, Tax ID, phone numbers, and company logo) to the Vehicle Usage Report (2026-09-17 09:15).
- Solved duplicate booking issue (2026-09-21 09:10): Implemented server-side collision validation in `Code.gs` for both booking creation and Telegram approval, added client-side `toBangkokYMD` timezone normalization, race-condition history-loading guard, optimistic cache updates, and double-submit button locks.
- Implemented Vehicle Maintenance and Tax/Insurance Renewal Management Modules (2026-09-21 10:15):
  - Added `tab-maint` and `tab-tax` views with responsive UI, KPI summary cards, filter/search controls, and modals.
  - Added `DEFAULT_MAINTENANCE` and `DEFAULT_TAX_INSURANCE` fallback datasets and LocalStorage synchronization for 0ms loading.
  - Extended Google Apps Script (`Code.gs`) with automatic sheet provisioning (`ประวัติซ่อมบำรุง` and `ประกันและภาษีรถ`), `create_maintenance`, `renew_tax_insurance`, automated Telegram notifications, and `checkExpiringNotifications()` expiration scanner.
- Enabled Direct Return Car from Timeline/Calendar view (2026-09-21 10:40):
  - Made timeline booking bars interactive with clickable handlers to invoke `openReturnModal` directly for active/pending reservations.
  - Added `[↩ คืนรถ]` visual status badge, dynamic tooltips, and fallback to `openSlipModal` when clicking completed trips.
  - Implemented 0ms optimistic UI cache updates upon returning car, updating both Dashboard and Calendar immediately.
- Implemented Daily Fleet Summary and Telegram Reporting System (2026-09-21 10:45):
  - Added Daily Fleet Summary Widget (`สรุปการใช้รถรายวัน`) in `#view-dash` with date switcher (`< | วันที่ | > | วันนี้`) and 4 real-time KPI cards (In-use, Returned, Available, Total Mileage).
  - Built comprehensive `#daily-summary-modal` with active trip breakdowns, 1-click return car shortcut, returned vehicle list with mileage calculations, and available vehicles list.
  - Added "คัดลอกข้อความสรุป" clipboard export and "ส่งเข้า Telegram" direct fleet channel dispatch (`action: "send_daily_summary"` in `Code.gs`).
- Created standalone Keyence TR-W1000 Comment Sender Web App in `keyence-tr-w1000/` and Admin Activation App in `keyence-license-generator/` (`v.2026.10.12.1525`):
  - Built Node.js/Express backend (`server.js`, bound to `127.0.0.1:3000` Localhost Only + `start-server.bat` 1-click launcher) and Industrial Engineering / Factory HMI Utility UI frontend (`public/index.html`) for sending ASCII-encoded comments (`UniComm`) with single-line embedded timestamps to `http://[IP]/side.asp?dt=[AdminCode]`.
  - Reverse-engineered Keyence TR-W1000 web server (`/include/func.js` & `/side.asp`) to solve `error.asp?cd=401` (`Session error`): implemented persistent `getKeyenceSession()` pre-flight handshake (`GET /` -> `index.asp` -> `side.asp`) to capture `AdminCode` and `LCDCode` cookies, matched `?dt=[AdminCode]`, enforced the 32-character hardware limit, simulated `CommentComplete()` (`GET /main.asp?dt=[AdminCode]`) after posting, and verified `Ret:200` (`RetCode`) hardware acknowledgment (noting that the Recorder must be in `Acquiring` mode rather than `Stopping` mode to plot comments onto the waveform).
  - Added Live Screen `640x480` capture (`GET /api/screen-image` calling `main.asp` before `png.asp` to initialize the screen buffer), Remote Touch (`POST /api/screen-click`), `.PNG` graph export, `config.json` IP management, `comments-history.json` Transmission Log table, high-visibility pre-save confirmation modal, and automatic read-only hardware identity detection via UDP 137 NetBIOS Node Status + HTTP headers (`TR (TR-series | MAC: 00-01-FC-80-13-DF)`).
  - Implemented Hardware Machine License Lock (`MachineGuid` -> `KTRW-XXXX-XXXX-XXXX` + SHA-256 `ACTV-XXXX-XXXX-XXXX-XXXX` stored in `license.json`) and separate Admin Activation Key Generator App in `keyence-license-generator/` (`index.html`, `open-keygen.bat`, `generate-key.js`).
  - Relocated both `keyence-tr-w1000/` and `keyence-license-generator/` along with dedicated `.agents/AGENTS.md` context into standalone workspace `E:\Project\Aoyama Thai\Keyence TR-W10000` (2026-10-12 15:33).
  - **IMPORTANT WORKSPACE RULE**: Any future edits, feature additions, or documentation updates for the Keyence TR-W1000 project MUST be made directly inside `E:\Project\Aoyama Thai\Keyence TR-W10000` (`E:\Project\Aoyama Thai\Keyence TR-W10000\keyence-tr-w1000` and `E:\Project\Aoyama Thai\Keyence TR-W10000\keyence-license-generator`).
- Implemented Fuel Expense Tracking & Auto-Slip Integration (2026-10-29 15:00):
  - Added "เงินที่เติมน้ำมัน" (บาท) field in Return Car modal (`#modal-return-form`) and Booking form (`#booking-form`).
  - Integrated auto-population in Vehicle Usage Slip (`#slip-modal`) and accounting email draft.
  - Added fuel expense display badges on Dashboard table and daily fuel total calculation in Daily Fleet Summary widget / Telegram report.
  - Enhanced Google Apps Script (`Code.gs`) with automatic sheet column creation and synchronization for `ค่าน้ำมัน`.
