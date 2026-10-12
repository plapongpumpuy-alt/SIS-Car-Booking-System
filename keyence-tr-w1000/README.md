# Keyence TR-W1000 Comment Sender Web App
**Version:** `v.2026.10.12.1525`

Web Application สำหรับส่งข้อความ Comment ไปแสดงผลบนเครื่องบันทึกข้อมูลไร้สาย **Keyence TR-W1000** ผ่านโปรโตคอล HTTP POST (`side.asp`) พร้อมระบบ **Hardware Machine License Lock** ป้องกันการนำโปรแกรมไปเปิดใช้งานบนคอมพิวเตอร์เครื่องอื่นโดยไม่ได้รับอนุญาต

---

## โครงสร้างไฟล์ (Project Structure)
```text
keyence-tr-w1000/
├── start-server.bat     # ไฟล์คลิกเดียวรันโปรแกรม (เปิด Server + เปิดหน้าเว็บอัตโนมัติ)
├── package.json         # กำหนด Dependencies ของ Node.js (express, axios, cors)
├── license.json         # ไฟล์เก็บสิทธิ์การใช้งานประจำเครื่อง (สร้างหลัง Activate สำเร็จ)
├── config.json          # ไฟล์ตั้งค่า IP ของเครื่อง Recorder
├── comments-history.json# ไฟล์เก็บประวัติรายการ Comment
├── server.js            # Backend (Node.js + Express + Axios + Hardware License Lock)
├── README.md            # คู่มือการติดตั้ง ใช้งาน และบันทึกการทำงาน (Work Log)
└── public/
    └── index.html       # Frontend (Industrial Engineering Control Utility UI)
```

*(แอปสำหรับสร้างรหัสปลดล็อกของผู้ดูแลระบบแยกอยู่ที่โฟลเดอร์ [`../keyence-license-generator/`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-license-generator))*

---

## ระบบล็อกสิทธิ์การใช้งานประจำเครื่อง (Hardware Machine License Lock)

1. **ล็อกเฉพาะเครื่อง (`127.0.0.1` Localhost Only + Windows `MachineGuid`)**:
   - ตัวโปรแกรมจะอ่านค่า `MachineGuid` ของคอมพิวเตอร์จาก Windows Registry แล้วแปลงเป็นรหัส **`Machine ID`** (เช่น `KTRW-44EC-7DB5-924D`)
   - หากยังไม่ได้เปิดใช้งาน หรือมีคนก๊อปปี้โฟลเดอร์ (รวมถึงไฟล์ `license.json` ของเครื่องเดิม) ไปเปิดบนคอมพิวเตอร์เครื่องอื่น โปรแกรมจะตรวจพบว่า `Machine ID` ไม่ตรงกันและขึ้นหน้าจอ **HARDWARE SECURITY PROTECTION (LOCKED)** ทันที
2. **การปลดล็อกด้วยแอป [`keyence-license-generator`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-license-generator/index.html)**:
   - ผู้ดูแลระบบเปิดไฟล์ [`keyence-license-generator/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-license-generator/index.html) (หรือ `open-keygen.bat`)
   - นำรหัส **`Machine ID`** ที่แสดงบนหน้าจอเครื่องปลายทางไปวาง แล้วกด **GENERATE KEY**
   - นำรหัส **`Activation Key`** (`ACTV-XXXX-XXXX-XXXX-XXXX`) หรือไฟล์ `license.json` ที่ได้ ไปปลดล็อกที่เครื่องปลายทาง

---

## วิธีติดตั้งและรันใช้งานผ่าน Command Line (CLI)

1. **เข้าไปที่โฟลเดอร์โปรเจกต์**
   ```bash
   cd "keyence-tr-w1000"
   ```

2. **ติดตั้ง Package ที่จำเป็นด้วย `npm install`**
   ```bash
   npm install express axios cors
   ```

3. **สั่งรันตัวโปรแกรม Backend Server**
   ```bash
   node server.js
   ```
   *(หรือดับเบิลคลิกที่ไฟล์ `start-server.bat`)*

4. **เปิดเข้าใช้งานผ่าน Web Browser**
   เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

---

## รายละเอียดการทำงานเชิงเทคนิค (Technical Specification)

1. **Session Handshake (`getKeyenceSession`)**:
   - เครื่อง Keyence TR-W1000 มีระบบตรวจสอบ Session ป้องกันการยิง POST ตรงๆ โดยจะตรวจเช็คค่า Cookie `AdminCode` และ `LCDCode` เทียบกับ Query Parameter `?dt=`
   - หากไม่ส่ง Cookie หรือค่า `dt` ไม่ตรงกับ `AdminCode` เครื่องจะตอบ HTTP 200 แต่สั่ง Redirect ไปหน้า `error.asp?cd=401` (`[Session error] An illegal access was detected.`) ทำให้ข้อความไม่เข้าตัวเครื่อง
   - ดังนั้น Backend (`server.js`) จึงทำการยิง `GET http://192.168.100.145/` ก่อนเพื่อรับ `Set-Cookie: AdminCode=...; LCDCode=1` จากนั้นนำค่า `AdminCode` ไปต่อท้าย `POST http://192.168.100.145/side.asp?dt=[AdminCode]` พร้อมแนบ Cookie Header

2. **การแปลงรหัส ASCII/Unicode (`UniComm`)**:
   - อ้างอิงจากฟังก์ชัน `ht10()` ในไฟล์ `/include/func.js` ของเครื่อง Keyence TR-W1000
   - แปลงตัวอักษรแต่ละตัวด้วย `charCodeAt(0)` คั่นด้วยลูกน้ำ (`,`) เช่น `"TEST-OK"` $\rightarrow$ `"84,69,83,84,45,79,75"`
   - จำกัดความยาวข้อความสูงสุดไม่เกิน **32 ตัวอักษร** ตามข้อกำหนดของเครื่อง

3. **Form Data Payload (`application/x-www-form-urlencoded`)**:
   - `CommFlg`: `'true'`
   - `cmbReload`: `'0'`
   - `txtMsg`: ข้อความต้นฉบับ
   - `UniComm`: ข้อความที่แปลงเป็นรหัส ASCII คั่นด้วยลูกน้ำ

4. **การตรวจสอบผลลัพธ์ (`RetCode`) และสถานะการบันทึกของตัวเครื่อง (`Acquiring` vs `Stopping`)**:
   - เมื่อส่งข้อมูลสำเร็จ หน้า `side.asp` จะคืนค่า `<input type="hidden" name="RetCode" value="Ret:200">` กลับมา
   - **ข้อสำคัญของฮาร์ดแวร์ Keyence TR-W1000**: ตัวเครื่องจะเขียนข้อความ Comment ลงบนเส้นกราฟได้ **เฉพาะขณะที่เครื่องอยู่ในสถานะ `Acquiring` (กำลังเดินกราฟบันทึกข้อมูล)** เท่านั้น หากหน้าจอเครื่องขึ้นสถานะ **`Stopping`** (หยุดการบันทึกกราฟ) เส้นเวลาจะหยุดเดินและข้อความที่ส่งเข้าไปจะไม่ถูกพล็อตลงบนกราฟจนกว่าจะกดเริ่มบันทึก (`Acquiring`) ที่ตัวเครื่องอีกครั้ง

---

## บันทึกการทำงานและอัปเดต (Work Log & Changelog)

### `v.2026.10.12.1525` (2026-10-12 15:25)
- **เพิ่มระบบล็อกสิทธิ์การใช้งานประจำเครื่อง (Hardware Machine License Lock) และสร้างแอป `keyence-license-generator/` แยกสำหรับ Admin**:
  - อัปเดต [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) ให้อ่านค่า `MachineGuid` ประจำเครื่องจาก Windows Registry มาแปลงเป็นรหัส `Machine ID` (`KTRW-XXXX-XXXX-XXXX`), ล็อกพอร์ตเป็น `127.0.0.1` (Localhost เท่านั้น), และบังคับตรวจสอบ `license.json` ก่อนอนุญาตให้เรียกใช้งาน API ทั้งหมด
  - เพิ่มหน้าจอ **Hardware Security Protection (LOCKED)** ใน [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) รองรับทั้งการกรอกรหัส `Activation Key` (`ACTV-XXXX-XXXX-XXXX-XXXX`) และการนำเข้าไฟล์ `license.json`
  - สร้างแอปพลิเคชันแยก [`keyence-license-generator/`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-license-generator/index.html) (พร้อม `open-keygen.bat` และ `generate-key.js`) สำหรับให้ Admin ใช้สร้างรหัส `Activation Key` และดาวน์โหลดไฟล์ `license.json` แบบ Offline 100%

### `v.2026.10.12.1438` (2026-10-12 14:38)
- **ออกแบบหน้าเว็บใหม่ในสไตล์ซอฟต์แวร์วิศวกรรมโรงงาน (Industrial Engineering / Factory HMI Utility UI)**:
  - ตัดองค์ประกอบที่ดูเหมือนเว็บสำเร็จรูปจาก AI ออกทั้งหมด (เช่น การ์ดมุมมนขนาดใหญ่, เงาฟุ้งกระจาย, ไอคอนหน้าประโยคทุกจุด, และป้ายแคปซูลกลม)
  - เปลี่ยนเป็นเลย์เอาต์แบบ **Workstation Console (`container-fluid`)** ขอบคมชัด (`border-radius: 3px-4px`), แถบ System Topbar สีกรมท่าเข้ม (`#102a43`), แถบ Connection Strip, หน้าจอแสดงผลข้อความแบบ **Digital LCD Readout**, กรอบจอ Monitor Bezel พร้อม Status Bar และตาราง Engineering Data Grid ที่กระชับอ่านง่ายเหมือนซอฟต์แวร์เครื่องมือวัดของญี่ปุ่น (Keyence / Omron)

### `v.2026.10.12.1250` (2026-10-12 12:50)
- **ปรับปรุงระบบจัดการ Session (`AdminCode`) ให้คงที่ต่อเนื่องและสั่งรีเฟรชหน้าจอหลัก (`CommentComplete`) หลังส่ง Comment**:
  - ปรับ [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) ให้คงค่า `AdminCode` เดิมไว้ตลอดการใช้งาน (ไม่สุ่มขอ Session ใหม่ทุก 15 วินาทีที่จะไปตัด Session การส่ง Comment) และสั่งเรียก `GET /main.asp?dt=[AdminCode]` ทันทีหลัง `POST /side.asp` เหมือนฟังก์ชัน `CommentComplete()` ของตัวเครื่อง
  - ตรวจสอบพบสาเหตุที่ข้อความไม่ปรากฏบนเส้นกราฟ: เนื่องจากตัวเครื่อง Recorder ปัจจุบันถูกเปลี่ยนสถานะจาก **`Acquiring 996day`** เป็น **`Stopping`** (หยุดการบันทึกกราฟตั้งแต่เวลาประมาณ 12:18 น.) ทำให้เส้นเวลาของกราฟหยุดนิ่งและไม่พล็อต Comment ใหม่ลงบนกราฟจนกว่าจะสั่งเริ่มบันทึก (`Acquiring`) ที่เครื่อง Recorder

### `v.2026.10.12.1237` (2026-10-12 12:37)
- **ดึงชื่อเครื่อง Recorder จากฮาร์ดแวร์โดยตรงแบบอ่านอย่างเดียว (Read-Only Hardware Identity)**:
  - อัปเดต [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) ให้สอบถามชื่อเครื่องจากตัว Recorder โดยตรงผ่านโปรโตคอล **NetBIOS Node Status (UDP Port 137)** คู่กับ HTTP Header `Server` และ `<TITLE>` ของเครื่อง ได้ผลลัพธ์ชื่อเครื่องจริงจากฮาร์ดแวร์คือ `TR (TR-series | MAC: 00-01-FC-80-13-DF)`
  - ปรับช่อง **`ชื่อเครื่อง (อ่านจากเครื่อง)`** บนหน้าเว็บ [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) ให้เป็นแบบ **อ่านอย่างเดียว (`readonly`)** ไม่ต้องให้ผู้ใช้งานกรอกหรือกดบันทึกเอง โดยระบบจะดึงชื่อจากเครื่องอัตโนมัติตาม IP ที่เชื่อมต่อ
- **แก้ไขปัญหาดึงภาพหน้าจอสด (`png.asp`) ไม่ได้เมื่อเริ่ม Session ใหม่**:
  - เรียก `GET /main.asp?dt=[AdminCode]` ก่อนเรียก `GET /png.asp?dt=[AdminCode]` เพื่อสั่งให้เครื่องสร้าง Buffer ภาพหน้าจอ `640x480` ก่อนดึงภาพเสมอ

### `v.2026.10.12.1225` (2026-10-12 12:25)
- **เพิ่มการตั้งค่าและแสดง "ชื่อเครื่อง Recorder" (`deviceName`) ทุกจุดในระบบ**:
  - เพิ่มช่องตั้งค่า **`ชื่อเครื่อง`** คู่กับ `IP` บนแถบด้านบนสุด เพื่อให้บันทึกชื่อเครื่องลงในไฟล์ [`config.json`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/config.json) ได้โดยตรง
  - แสดงชื่อเครื่อง Recorder บนหัวการ์ดส่ง Comment, หัวการ์ดหน้าจอสด (`Live Screen`), ในคอลัมน์ **`เครื่อง Recorder`** ของตารางประวัติ Comment, ในหน้าต่างคำเตือนยืนยันก่อนบันทึก, และใช้ตั้งเป็นชื่อไฟล์รูปภาพ `.PNG` ตอนกดดาวน์โหลดกราฟ

### `v.2026.10.12.1146` (2026-10-12 11:46)
- **เพิ่มหน้าต่างยืนยันก่อนบันทึก Comment ลงเครื่อง Recorder (Pre-Save Confirmation Modal)**:
  - เมื่อกดปุ่ม `Send Comment` หรือปุ่ม `ส่งซ้ำ` ในตาราง ระบบจะแสดง Popup ยืนยันพร้อมแสดงตัวอย่างข้อความรวมเวลาจริงที่จะถูกเขียนลงบนกราฟ และมีปุ่ม **"ยืนยันการบันทึก"** คู่กับปุ่ม **"ยกเลิก"** เพื่อป้องกันการกดส่งผิดพลาด

### `v.2026.10.12.1127` (2026-10-12 11:27)
- **ปรับโฉม UI เป็นโทนสีฟ้าไล่เฉดไปจนถึงสีน้ำเงินเข้ม (Sky Blue $\rightarrow$ Royal/Deep Blue Gradient Theme)**:
  - ปรับพื้นหลัง, แถบหัวข้อ (Card Header), ปุ่มกด (`Send Comment`, `บันทึก IP`, `บันทึกรูปกราฟ`), กล่องแสดงข้อความล่าสุด, และหัวตารางให้ใช้เฉดสีฟ้า (`#0ea5e9` / `#0284c7`) ไล่ไปจนถึงสีน้ำเงินเข้ม (`#2563eb` / `#1e40af`) อย่างสวยงามสบายตา

### `v.2026.10.12.1123` (2026-10-12 11:23)
- **เพิ่มระบบตั้งค่า IP ผ่านไฟล์ `config.json` และแถบแสดงสถานะการเชื่อมต่อกับอุปกรณ์แบบ Real-time**:
  - สร้างไฟล์ [`config.json`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/config.json) สำหรับเก็บค่า `targetIp`, `deviceName`, และ `timeoutMs`
  - เพิ่ม API `GET /api/config`, `POST /api/config`, และ `GET /api/status` ใน [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js)
  - เพิ่มแถบด้านบนสุดในหน้าเว็บ [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) แสดงสถานะการเชื่อมต่อกับเครื่อง Recorder (`ออนไลน์ / ออฟไลน์`, ความเร็วตอบสนอง `ms`, และรหัส `Session`) พร้อมช่องกรอกแก้ไข IP และปุ่มบันทึกค่าลงไฟล์ `config.json` ได้โดยตรงจากหน้าเว็บ

### `v.2026.10.12.1118` (2026-10-12 11:18)
- **เพิ่มปุ่ม "บันทึกรูปกราฟ (.PNG)" ในหน้าหลัก (`public/index.html`)**:
  - ดึงภาพหน้าจอกราฟสด (`640x480 px`) จากเครื่อง Keyence TR-W1000 แล้วดาวน์โหลดลงเครื่องคอมพิวเตอร์เป็นไฟล์ `.PNG` พร้อมตั้งชื่อไฟล์ระบุวัน-เวลาอัตโนมัติ (เช่น `Keyence-Graph-20261012-111800.png`)

### `v.2026.10.12.1115` (2026-10-12 11:15)
- **นำโหมดวาดภาพแยก (`draw.html`) ออกตามความต้องการของผู้ใช้งาน**:
  - คงเหลือเฉพาะหน้าหลัก [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) สำหรับส่งข้อความ Comment พร้อมฝังเวลา, แสดงภาพหน้าจอสดจากเครื่อง (`Live Screen 640x480`), และตารางประวัติรายการ Comment ที่บันทึกไว้

### `v.2026.10.12.1055` (2026-10-12 10:55)
- **เพิ่มการดึงภาพหน้าจอสดจากเครื่อง Recorder (Live Screen `640x480`) และการสั่งแตะหน้าจอระยะไกล (Remote Touch)**:
  - เพิ่ม API `GET /api/screen-image` ใน [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) เพื่อดึงภาพหน้าจอสดจาก `http://192.168.100.145/png.asp?dt=[AdminCode]` พร้อมจัดการ Session Cookie ให้อัตโนมัติ
  - เพิ่ม API `POST /api/screen-click` สำหรับส่งพิกัด `CAxX` และ `CAxY` ไปที่ `main.asp` เพื่อจำลองการแตะหน้าจอเครื่อง Recorder จากหน้าเว็บโดยตรง
  - อัปเดต [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) ให้แสดงจอ Live Screen คู่กับตารางประวัติ Comment พร้อมระบบรีเฟรชภาพอัตโนมัติทุก 3 วินาที และรีเฟรชทันทีเมื่อกดส่ง Comment

### `v.2026.10.12.1052` (2026-10-12 10:52)
- **เพิ่มระบบฝังเวลาลงในข้อความ Comment อัตโนมัติ (Embedded Timestamp on Graph)**:
  - จากการทดสอบกับภาพหน้าจอเครื่อง Recorder (`png.asp`) พบว่า Comment บนกราฟจะแสดงผลในกล่องข้อความบรรทัดเดียว (1-line box) หากใช้ `\r\n` จะแสดงเป็นอักขระกล่องสี่เหลี่ยม (`□□`)
  - ปรับปรุง [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) และ [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) ให้รองรับการฝังเวลาจริงจากเครื่องคอมพิวเตอร์แบบบรรทัดเดียว (Single-line) คั่นด้วยช่องว่าง (ASCII `32`)
  - เพิ่มตัวเลือกรูปแบบเวลา (`HH:mm`, `HH:mm:ss`, `DD/MM HH:mm`, `YYYY/MM/DD HH:mm:ss`) และตำแหน่งเวลา (`ต่อท้ายข้อความ` / `นำหน้าข้อความ`) พร้อมช่อง Preview ข้อความจริงที่จะปรากฏบนกราฟแบบ Real-time

### `v.2026.10.12.1043` (2026-10-12 10:43)
- **เพิ่มหน้าตารางรายการ Comment ที่บันทึกเข้าไป (Comment List Table)**:
  - เก็บค่า `UniComm` และ `RetCode` ที่เครื่อง Keyence TR-W1000 สะท้อนกลับมาขณะส่งข้อมูล ลงในไฟล์ฐานข้อมูล [`comments-history.json`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/comments-history.json)
  - เพิ่ม API `GET /api/comments` และ `DELETE /api/comments/:id` ใน [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js)
  - อัปเดต UI หน้าเว็บ [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) ให้แสดงแถบ **ข้อความล่าสุดบนเครื่อง (Active Comment)** และ **ตารางรายการ Comment ที่บันทึก (Comment List)** พร้อมปุ่มกด **"ส่งซ้ำ"** และปุ่มลบรายการในตาราง

### `v.2026.10.12.1035` (2026-10-12 10:35)
- **เพิ่มฟังก์ชันลบ/ล้างข้อความ Comment บนเครื่อง Recorder (Clear Comment)**:
  - รองรับการส่งค่าว่าง (`txtMsg: ""` และ `UniComm: ""` พร้อม `isClear: true`) ไปยัง `POST /api/send-comment` เพื่อเขียนทับข้อความเดิมบนจอเป็นค่าว่าง
  - เพิ่มปุ่ม **"ลบข้อความ (Clear)"** บนหน้าเว็บ [`public/index.html`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/public/index.html) พร้อมกล่องยืนยัน SweetAlert2

### `v.2026.10.12.1029` (2026-10-12 10:29)
- **วิเคราะห์และแก้ไขปัญหาข้อความไม่เข้า Recorder (Session Error 401)**:
  - ตรวจสอบ Source Code ภายในเครื่อง Keyence TR-W1000 (`/include/func.js`, `/index.asp`, `/side.asp`, `/error.asp`)
  - พบว่าเครื่องต้องการ Session Cookie (`AdminCode` และ `LCDCode`) ที่ได้จากการเรียก `GET /` ครั้งแรก และต้องใช้ค่า `AdminCode` เดียวกันเป็นพารามิเตอร์ `?dt=[AdminCode]`
  - อัปเดต [`server.js`](file:///e:/Project/SIS%20Car%20Booking%20System/keyence-tr-w1000/server.js) เพิ่มฟังก์ชัน `getKeyenceSession()` เพื่อดึง Cookie อัตโนมัติก่อนยิง `POST /side.asp`
  - เพิ่มการตรวจสอบความยาวข้อความไม่เกิน 32 ตัวอักษร และการเช็คค่า `RetCode` (`Ret:200`) ยืนยันว่า Recorder รับข้อความสำเร็จ
  - ทดสอบส่งข้อความ `"TEST-OK"` ไปยัง `192.168.100.145` ได้ผลลัพธ์ `Ret:200` สำเร็จ

### `v.2026.10.12.1006` (2026-10-12 10:06)
- **สร้างโปรเจกต์เริ่มต้น (Initial Release)**:
  - สร้าง Backend `server.js` (Node.js + Express + Axios) เปิด API `POST /api/send-comment`
  - สร้าง Frontend `public/index.html` ด้วย Bootstrap 5 และ SweetAlert2 พร้อมระบบแสดงตัวอย่างรหัส ASCII (`UniComm`) แบบ Real-time
  - ติดตั้ง Dependencies (`express`, `axios`, `cors`) และรันทดสอบระบบเครือข่ายกับ `192.168.100.145:80`
