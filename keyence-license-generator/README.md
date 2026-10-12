# Keyence TR-W1000 — License & Activation Key Generator (Admin App)
**Version:** `v.2026.10.12.1523`

แอปพลิเคชันสำหรับผู้ดูแลระบบ (Admin Only) ใช้สร้างรหัส **Activation Key (`ACTV-XXXX-XXXX-XXXX-XXXX`)** และไฟล์ **`license.json`** เพื่อปลดล็อกการใช้งานโปรแกรม `keyence-tr-w1000` ให้เปิดใช้งานได้เฉพาะคอมพิวเตอร์เครื่องที่ได้รับอนุญาตเท่านั้น

---

## โครงสร้างไฟล์ในโฟลเดอร์ `keyence-license-generator/`
- `index.html`: หน้าเว็บสร้างรหัส Activation Key แบบ Offline 100% (ดับเบิลคลิกเปิดใช้งานได้ทันทีโดยไม่ต้องรัน Server)
- `open-keygen.bat`: ไฟล์คลิกเดียวสำหรับเปิดหน้าโปรแกรม Keygen
- `generate-key.js`: สคริปต์สร้างรหัสผ่าน Command Line (`node generate-key.js <MACHINE_ID>`)
- `README.md`: คู่มือการใช้งาน

---

## ขั้นตอนการนำไปใช้งาน (Workflow)

1. **ที่เครื่องคอมพิวเตอร์ปลายทาง (เครื่องที่จะติดตั้ง `keyence-tr-w1000`)**:
   - เมื่อเปิดรัน `start-server.bat` ครั้งแรก (หรือกรณีถูกก๊อปปี้ไปเปิดบนคอมเครื่องอื่น) หน้าเว็บ `http://localhost:3000` จะขึ้นหน้าจอ **Hardware Security Protection (LOCKED)**
   - หน้าจอจะแสดงรหัส **`Machine ID`** ประจำคอมพิวเตอร์เครื่องนั้น (เช่น `KTRW-44EC-7DB5-924D`) ซึ่งอ่านมาจาก `MachineGuid` ของเมนบอร์ด/Windows Registry
   - คัดลอกรหัส `Machine ID` นั้นส่งให้ผู้ดูแลระบบ

2. **ที่เครื่องผู้ดูแลระบบ (เปิดโปรแกรม `keyence-license-generator`)**:
   - ดับเบิลคลิกไฟล์ **`index.html`** หรือ **`open-keygen.bat`** ในโฟลเดอร์ `keyence-license-generator/`
   - วางรหัส **`Machine ID`** ลงในช่อง `Target Machine ID` แล้วกดปุ่ม **GENERATE KEY**
   - ระบบจะคำนวณรหัส **`Activation Key`** เฉพาะสำหรับเครื่องนั้นออกมา (เช่น `ACTV-DAF5-DF76-C6F3-1CF8`) พร้อมปุ่มดาวน์โหลดไฟล์ `license.json`

3. **ปลดล็อกเครื่องปลายทาง**:
   - นำรหัส `Activation Key` ไปวางในช่องปลดล็อกบนหน้าเว็บของเครื่องปลายทาง แล้วกด **ACTIVATE LICENSE** (หรือเลือกอัปโหลดไฟล์ `license.json`)
   - เมื่อปลดล็อกสำเร็จ โปรแกรมจะสร้างไฟล์ `license.json` ผูกไว้กับ `Machine ID` ของเครื่องนั้น หากมีคนก๊อปปี้โฟลเดอร์ (รวมถึงไฟล์ `license.json`) ไปเปิดที่คอมเครื่องอื่น โปรแกรมจะตรวจพบว่า `Machine ID` ไม่ตรงกันและล็อกตัวเองทันที
