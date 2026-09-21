const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFDhxfRoLMyLQu7aQjy3eTNGFHvKhgX02Z_BeRaE2RRVZWtNRwTLIXs50JGm1ujAPICA/exec";

// Master data fallback (โหลดได้ทันที 0ms ไม่ต้องรอ Google Sheets)
const DEFAULT_USERS = [
    { "Name": "นาย ประพัฒน์ สกุลรัตนกุลชัย", "Nickname": "พัฒน์", "Tel": "0891150330", "Email": "prapat09@gmail.com", "Position": "Manager" },
    { "Name": "นาย สมคิด เอี่ยมสำอางค์", "Nickname": "ปุ้ย", "Tel": "0898978454", "Email": "plapongpumpuy@gmail.com", "Position": "Engineer" },
    { "Name": "นาย อัมมาร์ สมานพิทักษ์", "Nickname": "มาร์", "Tel": "0894631615", "Email": "ammamvsk.new@gmail.com", "Position": "Engineer" },
    { "Name": "นาย วันจักรี เนียมพุ่มพวง", "Nickname": "ต้น", "Tel": "0982843460", "Email": "wanjakkri.n@gmail.com", "Position": "Engineer" },
    { "Name": "นาย วิษณุ วงษ์คำ", "Nickname": "นุ", "Tel": "0649371489", "Email": "witsanu.wongkam.1996@gmail.com", "Position": "Technician" },
    { "Name": "น.ส. วิภาวรรณ จันตา", "Nickname": "ป็อปอาย", "Tel": "0898686964", "Email": "Popeye.wipawan@gmail.com", "Position": "Admin ACC" },
    { "Name": "น.ส.วีณา แสงสุวรรณ", "Nickname": "วี", "Tel": "0626639899", "Email": "accsisint@gmail.com", "Position": "ACC" },
    { "Name": "นาย ปัญญา แย้มพุชชง", "Nickname": "ปิ๊ก", "Tel": "0633859821", "Email": "payyayaemphuchchng@gmail.com", "Position": "Technician" },
    { "Name": "นาย ณิชาบล พงษ์ศักดิ์", "Nickname": "โด่ง", "Tel": "065667950", "Email": "dong065667950@gmail.com", "Position": "Technician" },
    { "Name": "นาย อัษฎาวุฒิ พลอยโสพล", "Nickname": "เติล", "Tel": "", "Email": "adsadawut028@gmail.com", "Position": "Technician" },
    { "Name": "นาย ธนเดช อินช่วย", "Nickname": "อั๋น", "Tel": "0944847953", "Email": "Tanadet080@gmail.com", "Position": "Technician" },
    { "Name": "นาย ดาวกระจาย ศรีชัย", "Nickname": "ปู", "Tel": "0981505495", "Email": "daokrachais@gmail.com", "Position": "Technician" },
    { "Name": "นาย ประวัตร กองคำ", "Nickname": "โทน", "Tel": "", "Email": "Prawatit88@gmail.com", "Position": "Technician" },
    { "Name": "นาย กิตติกวิน เรียบร้อย", "Nickname": "ซอฟ", "Tel": "0626253030", "Email": "kittikwinreiybrxy718@gmail.com", "Position": "นักศึกษาฝึกงาน" }
];

const DEFAULT_CARS = [
    { "ทะเบียนรถ": "1ฒม3823", "รุ่น": "D-Max", "สี": "เทา", "ยี่ห้อ": "ISUSU", "Code": "SIS005", "ชื่อคนดูแล": "นาย วิษณุ วงษ์คำ" },
    { "ทะเบียนรถ": "7กฌ2554", "รุ่น": "Yamaha", "สี": "แดง", "ยี่ห้อ": "Yamaha", "Code": "SIS001", "ชื่อคนดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย" },
    { "ทะเบียนรถ": "4ขข7395", "รุ่น": "Civic EHEV", "สี": "ขาว", "ยี่ห้อ": "Honda", "Code": "SIS002", "ชื่อคนดูแล": "นาย สมคิด เอี่ยมสำอางค์" },
    { "ทะเบียนรถ": "ฮฐ1300", "รุ่น": "Toyota", "สี": "ขาว", "ยี่ห้อ": "Toyota", "Code": "SIS001", "ชื่อคนดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย" },
    { "ทะเบียนรถ": "3ฒจ4298", "รุ่น": "Toyota Revo", "สี": "ขาว", "ยี่ห้อ": "Toyota", "Code": "SIS004", "ชื่อคนดูแล": "นาย วันจักรี เนียมพุ่มพวง" },
    { "ทะเบียนรถ": "5ขจ9318", "รุ่น": "Yaris Cross", "สี": "เทา", "ยี่ห้อ": "Toyota", "Code": "SIS001", "ชื่อคนดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย" },
    { "ทะเบียนรถ": "3ฒฮ8017", "รุ่น": "Hilux Champ", "สี": "ขาว", "ยี่ห้อ": "Toyota", "Code": "Champ", "ชื่อคนดูแล": "นาย ธนเดช อินช่วย" },
    { "ทะเบียนรถ": "2ฆณ 2556", "รุ่น": "Yadea GS70", "สี": "เทา", "ยี่ห้อ": "Yadea", "Code": "EV01", "ชื่อคนดูแล": "" }
];

const DEFAULT_MAINTENANCE = [
    {
        "รหัสรายการ": "MNT-202609-001",
        "วันที่เข้าซ่อม": "2026-09-10",
        "ทะเบียนรถ": "1ฒม3823",
        "ประเภทงาน": "เช็คระยะตามรอบ",
        "รายการซ่อม/เช็คระยะ": "เปลี่ยนถ่ายน้ำมันเครื่อง สังเคราะห์แท้ + ไส้กรองน้ำมันเครื่อง",
        "เลขไมล์เข้าซ่อม": 95000,
        "เลขไมล์รอบถัดไป": 105000,
        "อู่หรือศูนย์บริการ": "ศูนย์ Isuzu ตรีเพชร",
        "ค่าใช้จ่าย": 2450,
        "ผู้ส่งซ่อม": "นาย วิษณุ วงษ์คำ",
        "สถานะ": "เสร็จสิ้น",
        "หมายเหตุ/เลขที่ใบเสร็จ": "RC-69021"
    },
    {
        "รหัสรายการ": "MNT-202609-002",
        "วันที่เข้าซ่อม": "2026-09-12",
        "ทะเบียนรถ": "3ฒจ4298",
        "ประเภทงาน": "เปลี่ยนอะไหล่/ยาง",
        "รายการซ่อม/เช็คระยะ": "สลับยาง ถ่วงล้อ 4 เส้น + ตั้งศูนย์",
        "เลขไมล์เข้าซ่อม": 48200,
        "เลขไมล์รอบถัดไป": 58200,
        "อู่หรือศูนย์บริการ": "B-Quik สาขามีนบุรี",
        "ค่าใช้จ่าย": 850,
        "ผู้ส่งซ่อม": "นาย วันจักรี เนียมพุ่มพวง",
        "สถานะ": "เสร็จสิ้น",
        "หมายเหตุ/เลขที่ใบเสร็จ": "BQ-8812"
    },
    {
        "รหัสรายการ": "MNT-202609-003",
        "วันที่เข้าซ่อม": "2026-09-15",
        "ทะเบียนรถ": "4ขข7395",
        "ประเภทงาน": "เช็คระยะตามรอบ",
        "รายการซ่อม/เช็คระยะ": "เช็คระยะ 40,000 กม. เปลี่ยนน้ำมันเบรก และกรองแอร์ PM2.5",
        "เลขไมล์เข้าซ่อม": 41200,
        "เลขไมล์รอบถัดไป": 51200,
        "อู่หรือศูนย์บริการ": "ศูนย์ Honda สุขาภิบาล 3",
        "ค่าใช้จ่าย": 3890,
        "ผู้ส่งซ่อม": "นาย สมคิด เอี่ยมสำอางค์",
        "สถานะ": "เสร็จสิ้น",
        "หมายเหตุ/เลขที่ใบเสร็จ": "HD-44390"
    }
];

const DEFAULT_TAX_INSURANCE = [
    { "ทะเบียนรถ": "1ฒม3823", "รุ่น": "D-Max", "ผู้ดูแล": "นาย วิษณุ วงษ์คำ", "วันหมดอายุภาษี": "2026-11-15", "วันหมดอายุพรบ": "2026-11-15", "วันหมดอายุประกัน": "2026-11-15", "ประเภทประกัน": "ชั้น 1", "บริษัทประกัน": "วิริยะประกันภัย", "เลขที่กรมธรรม์": "VIR-2025-8831", "ค่าใช้จ่ายภาษีล่าสุด": 900, "ค่าเบี้ยประกันล่าสุด": 16500, "หมายเหตุ": "ดูแลเรียบร้อย" },
    { "ทะเบียนรถ": "7กฌ2554", "รุ่น": "Yamaha", "ผู้ดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย", "วันหมดอายุภาษี": "2026-10-30", "วันหมดอายุพรบ": "2026-10-30", "วันหมดอายุประกัน": "2026-10-30", "ประเภทประกัน": "พ.ร.บ. เท่านั้น", "บริษัทประกัน": "กลางคุ้มครองผู้ประสบภัย", "เลขที่กรมธรรม์": "NVP-2025-1120", "ค่าใช้จ่ายภาษีล่าสุด": 150, "ค่าเบี้ยประกันล่าสุด": 645, "หมายเหตุ": "มอเตอร์ไซค์" },
    { "ทะเบียนรถ": "4ขข7395", "รุ่น": "Civic EHEV", "ผู้ดูแล": "นาย สมคิด เอี่ยมสำอางค์", "วันหมดอายุภาษี": "2026-12-20", "วันหมดอายุพรบ": "2026-12-20", "วันหมดอายุประกัน": "2026-12-20", "ประเภทประกัน": "ชั้น 1", "บริษัทประกัน": "โตเกียวมารีน", "เลขที่กรมธรรม์": "TKM-88921-A", "ค่าใช้จ่ายภาษีล่าสุด": 1800, "ค่าเบี้ยประกันล่าสุด": 22000, "หมายเหตุ": "รถประจำตำแหน่ง" },
    { "ทะเบียนรถ": "ฮฐ1300", "รุ่น": "Toyota", "ผู้ดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย", "วันหมดอายุภาษี": "2026-10-10", "วันหมดอายุพรบ": "2026-10-10", "วันหมดอายุประกัน": "2026-10-10", "ประเภทประกัน": "ชั้น 2+", "บริษัทประกัน": "ทิพยประกันภัย", "เลขที่กรมธรรม์": "TIP-55421-B", "ค่าใช้จ่ายภาษีล่าสุด": 1200, "ค่าเบี้ยประกันล่าสุด": 8900, "หมายเหตุ": "ใกล้ครบกำหนด" },
    { "ทะเบียนรถ": "3ฒจ4298", "รุ่น": "Toyota Revo", "ผู้ดูแล": "นาย วันจักรี เนียมพุ่มพวง", "วันหมดอายุภาษี": "2027-01-25", "วันหมดอายุพรบ": "2027-01-25", "วันหมดอายุประกัน": "2027-01-25", "ประเภทประกัน": "ชั้น 1", "บริษัทประกัน": "กรุงเทพประกันภัย", "เลขที่กรมธรรม์": "BKI-99321", "ค่าใช้จ่ายภาษีล่าสุด": 950, "ค่าเบี้ยประกันล่าสุด": 17500, "หมายเหตุ": "" },
    { "ทะเบียนรถ": "5ขจ9318", "รุ่น": "Yaris Cross", "ผู้ดูแล": "นาย ประพัฒน์ สกุลรัตนกุลชัย", "วันหมดอายุภาษี": "2027-02-18", "วันหมดอายุพรบ": "2027-02-18", "วันหมดอายุประกัน": "2027-02-18", "ประเภทประกัน": "ชั้น 1", "บริษัทประกัน": "วิริยะประกันภัย", "เลขที่กรมธรรม์": "VIR-2026-0041", "ค่าใช้จ่ายภาษีล่าสุด": 1450, "ค่าเบี้ยประกันล่าสุด": 19000, "หมายเหตุ": "" },
    { "ทะเบียนรถ": "3ฒฮ8017", "รุ่น": "Hilux Champ", "ผู้ดูแล": "นาย ธนเดช อินช่วย", "วันหมดอายุภาษี": "2026-11-05", "วันหมดอายุพรบ": "2026-11-05", "วันหมดอายุประกัน": "2026-11-05", "ประเภทประกัน": "ชั้น 1", "บริษัทประกัน": "เมืองไทยประกันภัย", "เลขที่กรมธรรม์": "MTI-44120-C", "ค่าใช้จ่ายภาษีล่าสุด": 900, "ค่าเบี้ยประกันล่าสุด": 15500, "หมายเหตุ": "" },
    { "ทะเบียนรถ": "2ฆณ 2556", "รุ่น": "Yadea GS70", "ผู้ดูแล": "-", "วันหมดอายุภาษี": "2026-10-01", "วันหมดอายุพรบ": "2026-10-01", "วันหมดอายุประกัน": "-", "ประเภทประกัน": "พ.ร.บ. เท่านั้น", "บริษัทประกัน": "กลางคุ้มครองผู้ประสบภัย", "เลขที่กรมธรรม์": "NVP-2025-9981", "ค่าใช้จ่ายภาษีล่าสุด": 100, "ค่าเบี้ยประกันล่าสุด": 324, "หมายเหตุ": "รถมอเตอร์ไซค์ไฟฟ้า EV" }
];

// จะถูกเติมข้อมูลจาก LocalStorage หรือ Default ทันที และซิงค์กับ Google Sheet ในพื้นหลัง
let userDB = [];
let vehicleDB = [];

// App State
window.appState = {
    bookings: (function(){
        try {
            const h = localStorage.getItem('sis_history');
            return h ? JSON.parse(h) : [];
        } catch(e) { return []; }
    })(),
    maintenance: (function(){
        try {
            const m = localStorage.getItem('sis_maintenance');
            return m ? JSON.parse(m) : DEFAULT_MAINTENANCE;
        } catch(e) { return DEFAULT_MAINTENANCE; }
    })(),
    taxInsurance: (function(){
        try {
            const t = localStorage.getItem('sis_tax_insurance');
            return t ? JSON.parse(t) : DEFAULT_TAX_INSURANCE;
        } catch(e) { return DEFAULT_TAX_INSURANCE; }
    })(),
    isHistoryLoaded: false,
    timelineStartDate: new Date(),
    currentPayload: null,
    
    setSyncStatus: function(state) {
        const el = document.getElementById('sync-status');
        if (!el) return;
        if (state === 'syncing') {
            el.className = "text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 border border-brand-200 transition-all";
            el.innerHTML = '<i class="fa-solid fa-rotate fa-spin text-xs"></i> กำลังซิงค์ข้อมูล...';
        } else if (state === 'synced') {
            el.className = "text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all";
            el.innerHTML = '<i class="fa-solid fa-circle-check text-xs"></i> ข้อมูลล่าสุดแล้ว';
        } else if (state === 'offline') {
            el.className = "text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 transition-all";
            el.innerHTML = '<i class="fa-solid fa-cloud text-xs"></i> ใช้งานข้อมูลจากแคช';
        } else if (state === 'error') {
            el.className = "text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 transition-all";
            el.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-xs"></i> ซิงค์ไม่สำเร็จ';
        }
    },

    // ดึงข้อมูลทั้งหมดในพื้นหลัง (ประวัติ, รถ, พนักงาน, ซ่อมบำรุง, ภาษี/ประกัน)
    fetchAllData: async function() {
        this.setSyncStatus('syncing');
        const tbody = document.getElementById('dash-tbody');
        if(tbody && (!this.bookings || this.bookings.length === 0)) {
            tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-500"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3 text-brand-500 block"></i><p>กำลังเชื่อมต่อฐานข้อมูล...</p></td></tr>`;
        }
        
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL + "?action=get_all");
            const data = await response.json();
            if (data.status === 'success') {
                if (data.history) {
                    this.bookings = data.history;
                    this.isHistoryLoaded = true;
                    try { localStorage.setItem('sis_history', JSON.stringify(data.history)); } catch(e){}
                }
                if (data.users && data.users.length > 0) {
                    userDB = data.users;
                    try { localStorage.setItem('sis_users', JSON.stringify(data.users)); } catch(e){}
                }
                if (data.cars && data.cars.length > 0) {
                    vehicleDB = data.cars;
                    try { localStorage.setItem('sis_cars', JSON.stringify(data.cars)); } catch(e){}
                }
                if (data.maintenance && data.maintenance.length > 0) {
                    this.maintenance = data.maintenance;
                    try { localStorage.setItem('sis_maintenance', JSON.stringify(data.maintenance)); } catch(e){}
                }
                if (data.taxInsurance && data.taxInsurance.length > 0) {
                    this.taxInsurance = data.taxInsurance;
                    try { localStorage.setItem('sis_tax_insurance', JSON.stringify(data.taxInsurance)); } catch(e){}
                }
                
                this.populateDropdowns();
                this.renderDashboard();
                this.renderTimeline();
                this.renderMaintenance();
                this.renderTaxInsurance();
                this.setSyncStatus('synced');
            } else {
                this.setSyncStatus('error');
            }
        } catch (error) {
            console.warn('Background sync error, maintaining local cache:', error);
            this.setSyncStatus('offline');
        }
    },

    // ดึงเฉพาะประวัติ (ใช้ตอนกดปุ่มรีเฟรชใน Dashboard)
    fetchBookings: async function() {
        this.setSyncStatus('syncing');
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL + "?action=get_history");
            const data = await response.json();
            if (data.status === 'success' && data.data) {
                this.bookings = data.data;
                this.isHistoryLoaded = true;
                try { localStorage.setItem('sis_history', JSON.stringify(data.data)); } catch(e){}
                this.renderDashboard();
                this.renderTimeline();
                this.setSyncStatus('synced');
            }
        } catch (error) {
            console.warn('Error fetching bookings:', error);
            this.setSyncStatus('offline');
        }
    },

    // นำข้อมูลลง Dropdown
    populateDropdowns: function() {
        const reqUserSelect = document.getElementById('req-user');
        const vehPlateSelect = document.getElementById('veh-plate');
        const maintFilterCar = document.getElementById('maint-filter-car');
        const maintCarSelect = document.getElementById('maint-car-select');
        const maintReqSelect = document.getElementById('maint-requester');
        const taxCarSelect = document.getElementById('tax-car-select');

        if(reqUserSelect) {
            const currentVal = reqUserSelect.value;
            reqUserSelect.innerHTML = '<option value="" disabled selected>เลือกรายชื่อพนักงาน</option>';
            userDB.forEach((u, i) => {
                const name = u['Name'] || u['ชื่อ'] || 'Unknown';
                const nick = u['Nickname'] || u['ชื่อเล่น'] || '';
                reqUserSelect.insertAdjacentHTML('beforeend', `<option value="${i}">${name} ${nick ? `(${nick})` : ''}</option>`);
            });
            if(currentVal) reqUserSelect.value = currentVal;
        }

        if(vehPlateSelect) {
            const currentVal = vehPlateSelect.value;
            vehPlateSelect.innerHTML = '<option value="" disabled selected>เลือกทะเบียนรถ</option>';
            vehicleDB.forEach(c => {
                const plate = c['ทะเบียนรถ'] || c['Plate'] || 'Unknown';
                const model = c['รุ่น'] || c['Model'] || '';
                vehPlateSelect.insertAdjacentHTML('beforeend', `<option value="${plate}">${plate} ${model ? `(${model})` : ''}</option>`);
            });
            if(currentVal) vehPlateSelect.value = currentVal;
        }

        // Dropdown กรองรถในหน้าซ่อมบำรุง
        if (maintFilterCar) {
            const currentVal = maintFilterCar.value || 'all';
            maintFilterCar.innerHTML = '<option value="all">รถทุกคัน</option>';
            vehicleDB.forEach(c => {
                const plate = c['ทะเบียนรถ'] || c['Plate'] || 'Unknown';
                const model = c['รุ่น'] || c['Model'] || '';
                maintFilterCar.insertAdjacentHTML('beforeend', `<option value="${plate}">${plate} ${model ? `(${model})` : ''}</option>`);
            });
            maintFilterCar.value = currentVal;
        }

        // Dropdown เลือกรถในฟอร์มซ่อมบำรุง
        if (maintCarSelect) {
            const currentVal = maintCarSelect.value;
            maintCarSelect.innerHTML = '<option value="" disabled selected>เลือกทะเบียนรถ</option>';
            vehicleDB.forEach(c => {
                const plate = c['ทะเบียนรถ'] || c['Plate'] || 'Unknown';
                const model = c['รุ่น'] || c['Model'] || '';
                maintCarSelect.insertAdjacentHTML('beforeend', `<option value="${plate}">${plate} ${model ? `(${model})` : ''}</option>`);
            });
            if (currentVal) maintCarSelect.value = currentVal;
        }

        // Dropdown เลือกผู้ส่งซ่อม
        if (maintReqSelect) {
            const currentVal = maintReqSelect.value;
            maintReqSelect.innerHTML = '<option value="">เลือกผู้รับผิดชอบ</option>';
            userDB.forEach(u => {
                const name = u['Name'] || u['ชื่อ'] || 'Unknown';
                const nick = u['Nickname'] || u['ชื่อเล่น'] || '';
                maintReqSelect.insertAdjacentHTML('beforeend', `<option value="${name}">${name} ${nick ? `(${nick})` : ''}</option>`);
            });
            if (currentVal) maintReqSelect.value = currentVal;
        }

        // Dropdown เลือกรถในฟอร์มต่ออายุภาษี/ประกัน
        if (taxCarSelect) {
            const currentVal = taxCarSelect.value;
            taxCarSelect.innerHTML = '<option value="" disabled selected>เลือกทะเบียนรถ</option>';
            vehicleDB.forEach(c => {
                const plate = c['ทะเบียนรถ'] || c['Plate'] || 'Unknown';
                const model = c['รุ่น'] || c['Model'] || '';
                taxCarSelect.insertAdjacentHTML('beforeend', `<option value="${plate}">${plate} ${model ? `(${model})` : ''}</option>`);
            });
            if (currentVal) taxCarSelect.value = currentVal;
        }
    },

    renderMaintenance: function() {
        const tbody = document.getElementById('maint-tbody');
        if (!tbody) return;

        const carFilter = document.getElementById('maint-filter-car')?.value || 'all';
        const catFilter = document.getElementById('maint-filter-cat')?.value || 'all';
        const searchKeyword = (document.getElementById('maint-search')?.value || '').toLowerCase().trim();

        const list = (this.maintenance || []).filter(item => {
            const plate = (item['ทะเบียนรถ'] || item['plate'] || '').toString();
            const cat = (item['ประเภทงาน'] || item['category'] || '').toString();
            const items = (item['รายการซ่อม/เช็คระยะ'] || item['items'] || '').toString();
            const garage = (item['อู่หรือศูนย์บริการ'] || item['garage'] || '').toString();
            const req = (item['ผู้ส่งซ่อม'] || item['requester'] || '').toString();

            if (carFilter !== 'all' && plate !== carFilter) return false;
            if (catFilter !== 'all' && cat !== catFilter) return false;
            if (searchKeyword) {
                const matched = plate.toLowerCase().includes(searchKeyword) ||
                                items.toLowerCase().includes(searchKeyword) ||
                                garage.toLowerCase().includes(searchKeyword) ||
                                req.toLowerCase().includes(searchKeyword);
                if (!matched) return false;
            }
            return true;
        });

        // Update KPIs
        let totalCost = 0;
        let pendingCount = 0;
        (this.maintenance || []).forEach(m => {
            const c = Number(m['ค่าใช้จ่าย'] || m['cost'] || 0);
            if (!isNaN(c)) totalCost += c;
            const st = (m['สถานะ'] || m['status'] || '').toString();
            if (st.includes('กำลังซ่อม') || st.includes('นัดหมาย') || st.includes('Progress') || st.includes('Scheduled')) {
                pendingCount++;
            }
        });

        const kpiCount = document.getElementById('maint-kpi-count');
        const kpiCost = document.getElementById('maint-kpi-cost');
        const kpiPending = document.getElementById('maint-kpi-pending');
        if (kpiCount) kpiCount.textContent = (this.maintenance || []).length;
        if (kpiCost) kpiCost.textContent = totalCost.toLocaleString() + ' ฿';
        if (kpiPending) kpiPending.textContent = pendingCount;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-gray-400"><i class="fa-solid fa-wrench text-3xl mb-2 block text-gray-300"></i>ไม่มีรายการซ่อมบำรุงที่ตรงกับเงื่อนไข</td></tr>`;
            return;
        }

        // Sort by date descending
        const sorted = [...list].sort((a, b) => {
            const da = a['วันที่เข้าซ่อม'] || a['serviceDate'] || '';
            const db = b['วันที่เข้าซ่อม'] || b['serviceDate'] || '';
            return db.localeCompare(da);
        });

        let html = '';
        sorted.forEach(m => {
            const rawDate = m['วันที่เข้าซ่อม'] || m['serviceDate'] || '-';
            const dateStr = formatDateShort(rawDate);
            const plate = m['ทะเบียนรถ'] || m['plate'] || '-';
            const car = vehicleDB.find(v => (v['ทะเบียนรถ'] || v['Plate']) === plate);
            const model = car ? (car['รุ่น'] || car['Model'] || '') : '';
            const cat = m['ประเภทงาน'] || m['category'] || '-';
            const items = m['รายการซ่อม/เช็คระยะ'] || m['items'] || '-';
            const mileageIn = m['เลขไมล์เข้าซ่อม'] || m['mileage'];
            const mileageNext = m['เลขไมล์รอบถัดไป'] || m['nextMileage'];
            const garage = m['อู่หรือศูนย์บริการ'] || m['garage'] || '-';
            const cost = Number(m['ค่าใช้จ่าย'] || m['cost'] || 0);
            const costFormatted = cost > 0 ? cost.toLocaleString() : '-';
            const req = m['ผู้ส่งซ่อม'] || m['requester'] || '-';
            const status = m['สถานะ'] || m['status'] || 'เสร็จสิ้น';
            const note = m['หมายเหตุ/เลขที่ใบเสร็จ'] || m['notes'] || '';

            let statusBadge = '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">เสร็จสิ้น</span>';
            if (status.includes('กำลังซ่อม') || status.includes('Progress')) {
                statusBadge = '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">กำลังซ่อม</span>';
            } else if (status.includes('นัดหมาย') || status.includes('Scheduled')) {
                statusBadge = '<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">นัดหมาย</span>';
            }

            html += `
            <tr class="hover:bg-slate-50 transition border-b border-gray-100">
                <td class="p-4 font-medium text-gray-800 whitespace-nowrap">${dateStr}</td>
                <td class="p-4">
                    <span class="font-bold text-sky-900 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded font-mono text-xs">${plate}</span>
                    <span class="text-xs text-gray-500 block mt-0.5">${model}</span>
                </td>
                <td class="p-4">
                    <span class="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium mb-1">${cat}</span>
                    <p class="font-medium text-gray-900">${items}</p>
                    ${note ? `<p class="text-[11px] text-gray-500 mt-0.5"><i class="fa-solid fa-receipt text-gray-400 mr-1"></i>${note}</p>` : ''}
                </td>
                <td class="p-4 text-center font-mono font-medium text-gray-700 whitespace-nowrap">${mileageIn ? Number(mileageIn).toLocaleString() + ' กม.' : '-'}</td>
                <td class="p-4 text-center font-mono font-medium text-brand-600 whitespace-nowrap">${mileageNext ? Number(mileageNext).toLocaleString() + ' กม.' : '-'}</td>
                <td class="p-4 text-gray-700">${garage}</td>
                <td class="p-4 text-right font-mono font-bold text-gray-900 whitespace-nowrap">${costFormatted}</td>
                <td class="p-4 text-center whitespace-nowrap">${statusBadge}</td>
                <td class="p-4 text-gray-600 text-xs">${req}</td>
            </tr>`;
        });
        tbody.innerHTML = html;
    },

    renderTaxInsurance: function() {
        const tbody = document.getElementById('tax-tbody');
        if (!tbody) return;

        const statusFilter = document.getElementById('tax-filter-status')?.value || 'all';
        const searchKeyword = (document.getElementById('tax-search')?.value || '').toLowerCase().trim();

        // Calculate helper for expiry badge
        const getExpiryInfo = (dateStr) => {
            if (!dateStr || dateStr === '-' || dateStr === '') {
                return { badge: '<span class="text-gray-400 text-xs">-</span>', days: null, status: 'none', dateStr: '-' };
            }
            const ymd = toBangkokYMD(dateStr);
            if (!ymd) return { badge: `<span class="text-gray-500 text-xs">${dateStr}</span>`, days: null, status: 'none', dateStr };

            const todayYMD = toBangkokYMD(new Date());
            const expMs = new Date(ymd).getTime();
            const todayMs = new Date(todayYMD).getTime();
            const diffDays = Math.ceil((expMs - todayMs) / (1000 * 60 * 60 * 24));
            const formattedDate = formatDateShort(ymd);

            if (diffDays < 0) {
                return {
                    badge: `<div class="inline-flex flex-col"><span class="font-bold text-red-600">${formattedDate}</span><span class="text-[10px] px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold border border-red-200 mt-0.5">🔴 เกินกำหนด ${Math.abs(diffDays)} วัน</span></div>`,
                    days: diffDays,
                    status: 'expired',
                    dateStr: ymd
                };
            } else if (diffDays <= 30) {
                return {
                    badge: `<div class="inline-flex flex-col"><span class="font-bold text-amber-600">${formattedDate}</span><span class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200 mt-0.5">🟡 เหลืออีก ${diffDays} วัน</span></div>`,
                    days: diffDays,
                    status: 'warning',
                    dateStr: ymd
                };
            } else {
                return {
                    badge: `<div class="inline-flex flex-col"><span class="font-medium text-emerald-700">${formattedDate}</span><span class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium border border-emerald-200 mt-0.5">🟢 ปกติ (${diffDays} วัน)</span></div>`,
                    days: diffDays,
                    status: 'ok',
                    dateStr: ymd
                };
            }
        };

        let expiredFleetCount = 0;
        let warningFleetCount = 0;
        let okFleetCount = 0;

        const fleetList = (this.taxInsurance || DEFAULT_TAX_INSURANCE).map(row => {
            const plate = row['ทะเบียนรถ'] || row['plate'] || '';
            const car = vehicleDB.find(v => (v['ทะเบียนรถ'] || v['Plate']) === plate);
            const model = row['รุ่น'] || (car ? (car['รุ่น'] || car['Model']) : '');
            const manager = row['ผู้ดูแล'] || (car ? (car['ชื่อคนดูแล'] || car['Manager']) : '-');
            const taxExp = getExpiryInfo(row['วันหมดอายุภาษี']);
            const prbExp = getExpiryInfo(row['วันหมดอายุพรบ']);
            const insExp = getExpiryInfo(row['วันหมดอายุประกัน']);
            const insType = row['ประเภทประกัน'] || '-';
            const insComp = row['บริษัทประกัน'] || '-';
            const policyNo = row['เลขที่กรมธรรม์'] || '-';
            const taxCost = Number(row['ค่าใช้จ่ายภาษีล่าสุด'] || 0);
            const insCost = Number(row['ค่าเบี้ยประกันล่าสุด'] || 0);
            const notes = row['หมายเหตุ'] || '';

            const hasExpired = taxExp.status === 'expired' || prbExp.status === 'expired' || insExp.status === 'expired';
            const hasWarning = !hasExpired && (taxExp.status === 'warning' || prbExp.status === 'warning' || insExp.status === 'warning');

            if (hasExpired) expiredFleetCount++;
            else if (hasWarning) warningFleetCount++;
            else okFleetCount++;

            return {
                plate, model, manager,
                taxExp, prbExp, insExp,
                insType, insComp, policyNo,
                taxCost, insCost, notes,
                hasExpired, hasWarning
            };
        });

        // Update KPIs
        const kpiExpired = document.getElementById('tax-kpi-expired');
        const kpiWarning = document.getElementById('tax-kpi-warning');
        const kpiOk = document.getElementById('tax-kpi-ok');
        if (kpiExpired) kpiExpired.textContent = `${expiredFleetCount} คัน`;
        if (kpiWarning) kpiWarning.textContent = `${warningFleetCount} คัน`;
        if (kpiOk) kpiOk.textContent = `${okFleetCount} คัน`;

        // Apply filters
        const filtered = fleetList.filter(item => {
            if (statusFilter === 'alert' && !item.hasExpired && !item.hasWarning) return false;
            if (statusFilter === 'ok' && (item.hasExpired || item.hasWarning)) return false;
            if (searchKeyword) {
                const match = item.plate.toLowerCase().includes(searchKeyword) ||
                              item.model.toLowerCase().includes(searchKeyword) ||
                              item.manager.toLowerCase().includes(searchKeyword) ||
                              item.insComp.toLowerCase().includes(searchKeyword);
                if (!match) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400"><i class="fa-solid fa-shield-halved text-3xl mb-2 block text-gray-300"></i>ไม่พบข้อมูลรถตามเงื่อนไขที่เลือก</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const totalCost = item.taxCost + item.insCost;
            html += `
            <tr class="hover:bg-slate-50 transition border-b border-gray-100 ${item.hasExpired ? 'bg-red-50/20' : item.hasWarning ? 'bg-amber-50/20' : ''}">
                <td class="p-4">
                    <span class="font-bold text-sky-900 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded font-mono text-xs">${item.plate}</span>
                    <span class="font-semibold text-gray-800 text-sm block mt-1">${item.model}</span>
                </td>
                <td class="p-4 text-xs font-medium text-gray-700">
                    <i class="fa-solid fa-user-gear text-gray-400 mr-1"></i>${item.manager}
                </td>
                <td class="p-4">${item.taxExp.badge}</td>
                <td class="p-4">${item.prbExp.badge}</td>
                <td class="p-4">
                    <div class="text-xs space-y-0.5">
                        <span class="inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded text-[10px]">${item.insType}</span>
                        <p class="font-medium text-gray-900">${item.insComp}</p>
                        ${item.insExp.badge}
                        ${item.policyNo !== '-' ? `<p class="text-[10px] text-gray-400 font-mono mt-0.5">เลขที่: ${item.policyNo}</p>` : ''}
                    </div>
                </td>
                <td class="p-4 text-right text-xs">
                    <p class="font-mono font-bold text-gray-900">${totalCost > 0 ? totalCost.toLocaleString() + ' ฿' : '-'}</p>
                    <p class="text-[10px] text-gray-400">ภาษี: ${item.taxCost > 0 ? item.taxCost.toLocaleString() : '-'} | เบี้ย: ${item.insCost > 0 ? item.insCost.toLocaleString() : '-'}</p>
                </td>
                <td class="p-4 text-center">
                    <button type="button" onclick="openTaxModal('${item.plate}')" class="px-3 py-1.5 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold transition shadow-sm inline-flex items-center gap-1">
                        <i class="fa-solid fa-rotate-right"></i> ต่ออายุ
                    </button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    },

    shiftTimeline: function(days) {
        this.timelineStartDate.setDate(this.timelineStartDate.getDate() + days);
        this.renderTimeline();
    },

    renderDashboard: function() {
        const tbody = document.getElementById('dash-tbody');
        const filterStatus = document.getElementById('filter-status').value;
        const searchQuery = document.getElementById('dash-search').value.toLowerCase().trim();
        
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let records = [...this.bookings].reverse();
        let visibleCount = 0;

        records.forEach(record => {
            const user = getVal(record, ['email', 'อีเมล', 'ชื่อผู้จอง', 'ผู้จอง', 'ชื่อ', 'พนักงาน', 'คนจอง', 'gmail']);
            const plate = getVal(record, ['plate', 'ทะเบียนรถ', 'ทะเบียน', 'รถ', 'ยานพาหนะ']);
            const dtRaw = getVal(record, ['bookingdatetime', 'เวลาที่จอง', 'วันที่จอง', 'เวลาทำรายการ']);
            const fromDate = getVal(record, ['fromdate', 'วันที่เดินทาง', 'ตั้งแต่วันที่', 'จากวันที่']);
            const toDate = getVal(record, ['todate', 'ถึงวันที่', 'วันสิ้นสุด']);
            const purpose = getVal(record, ['purpose', 'ไปทำอะไร', 'จุดประสงค์']);
            const dest = getVal(record, ['destination', 'ไปที่ไหน', 'สถานที่']);
            let statusRaw = getVal(record, ['status', 'สถานะ']);
            const mileageIn = getVal(record, ['mileagein', 'ไมล์เข้า', 'เลขไมล์เข้า']);
            const mileageOut = getVal(record, ['mileageout', 'ไมล์ออก', 'เลขไมล์ออก']);
            const remark = getVal(record, ['remark', 'หมายเหตุ', 'เหตุผล']);
            const rowIndex = record._rowIndex;
            
            if (!statusRaw || statusRaw === '-') {
                statusRaw = (mileageIn && mileageIn !== '-') ? 'completed' : 'pending';
            }

            const statusLower = statusRaw.toString().toLowerCase();
            let statusKey = 'pending';
            if (statusLower.includes('approve')) statusKey = 'approved';
            else if (statusLower.includes('reject')) statusKey = 'rejected';
            else if (statusLower.includes('complete') || statusLower.includes('คืนรถแล้ว') || statusLower.includes('เสร็จ')) statusKey = 'completed';
            else if (statusLower.includes('pending') || statusLower.includes('รอ')) statusKey = 'pending';

            if (filterStatus !== 'all' && statusKey !== filterStatus) return;
            
            const searchableText = `${user} ${plate} ${purpose} ${dest}`.toLowerCase();
            if (searchQuery && !searchableText.includes(searchQuery)) return;
            
            visibleCount++;

            let statusHtml = '';
            let actionHtml = '-';
            
            if (statusKey === 'pending') {
                statusHtml = `<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">รออนุมัติ</span>`;
                actionHtml = `
                    <div class="flex items-center justify-center gap-1.5 flex-wrap">
                        <span class="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1 whitespace-nowrap"><i class="fa-brands fa-telegram text-sky-500"></i> รออนุมัติ</span>
                        <button onclick="event.stopPropagation(); window.openSlipModal(${rowIndex})" class="px-2 py-1 bg-gray-100 hover:bg-sky-50 hover:text-sky-700 text-gray-700 border border-gray-200 rounded text-xs font-medium transition whitespace-nowrap flex items-center gap-1" title="ดูตัวอย่างใบขอใช้รถ">
                            <i class="fa-solid fa-file-lines"></i> ดูรายงาน
                        </button>
                    </div>`;
            } else if (statusKey === 'approved') {
                statusHtml = `
                    <div class="flex flex-col gap-1 items-start">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">อนุมัติแล้ว</span>
                        ${remark && remark !== '-' ? `<span class="text-[11px] text-emerald-800 font-medium max-w-[170px] truncate" title="${remark}"><i class="fa-solid fa-circle-check text-[10px] mr-1 text-emerald-600"></i>${remark}</span>` : ''}
                    </div>`;
                actionHtml = `
                    <div class="flex items-center justify-center gap-1.5 flex-wrap">
                        <button onclick="event.stopPropagation(); window.openReturnModal('${plate}', '${mileageOut === '-' ? '' : mileageOut}', ${rowIndex})" class="px-2.5 py-1.5 bg-brand-50 text-brand-600 border border-brand-200 rounded-lg text-xs font-medium hover:bg-brand-600 hover:text-white transition whitespace-nowrap"><i class="fa-solid fa-pen-to-square mr-1"></i>คืนรถ</button>
                        <button onclick="event.stopPropagation(); window.openSlipModal(${rowIndex})" class="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition whitespace-nowrap shadow-sm flex items-center gap-1" title="เปิดดูใบขอใช้รถยนต์และเบิกค่าใช้จ่าย"><i class="fa-solid fa-file-invoice-dollar mr-1"></i>ใบใช้รถ (PDF)</button>
                    </div>`;
            } else if (statusKey === 'rejected') {
                statusHtml = `
                    <div class="flex flex-col gap-1 items-start">
                        <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">ปฏิเสธแล้ว</span>
                        ${remark && remark !== '-' ? `<span class="text-[11px] text-red-600 font-medium max-w-[170px] truncate" title="${remark}"><i class="fa-solid fa-ban text-[10px] mr-1 text-red-500"></i>${remark}</span>` : ''}
                    </div>`;
                actionHtml = `
                    <div class="flex items-center justify-center">
                        <button onclick="event.stopPropagation(); window.openSlipModal(${rowIndex})" class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 rounded text-xs font-medium transition whitespace-nowrap flex items-center gap-1">
                            <i class="fa-solid fa-file-lines"></i> ดูรายงาน
                        </button>
                    </div>`;
            } else {
                statusHtml = `
                    <div class="flex flex-col gap-1 items-start">
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">คืนรถแล้ว</span>
                        ${remark && remark !== '-' ? `<span class="text-[11px] text-gray-600 font-medium max-w-[170px] truncate" title="${remark}">${remark}</span>` : ''}
                    </div>`;
                actionHtml = `
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="event.stopPropagation(); window.openSlipModal(${rowIndex})" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition whitespace-nowrap shadow-sm flex items-center gap-1.5" title="เปิดดูใบขอใช้รถยนต์และแนบบิลส่งบัญชี">
                            <i class="fa-solid fa-file-invoice-dollar"></i> ดูใบรายงาน / PDF
                        </button>
                    </div>`;
            }

            let dateDisplay = formatDateShort(fromDate);
            if (fromDate !== toDate && toDate !== '-') dateDisplay += ` - ${formatDateShort(toDate)}`;

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-sky-50 transition border-b border-gray-100 cursor-pointer group';
            tr.title = 'คลิกที่แถวนี้เพื่อเปิดดูใบรายงาน / ใบขอใช้รถ (PDF)';
            tr.onclick = (e) => {
                if (e.target.closest('button') || e.target.closest('a')) return;
                window.openSlipModal(rowIndex);
            };
            tr.innerHTML = `
                <td class="p-4 text-gray-800">${user}</td>
                <td class="p-4 text-gray-800 font-semibold whitespace-nowrap"><span class="bg-gray-100 px-2 py-1 rounded border border-gray-200">${plate}</span></td>
                <td class="p-4 text-gray-600 whitespace-nowrap">${dateDisplay}</td>
                <td class="p-4 text-gray-600 text-xs">
                    <p class="font-medium text-gray-800 mb-0.5">${purpose !== '-' ? purpose : ''}</p>
                    <p class="text-gray-500">${dest !== '-' ? dest : ''}</p>
                </td>
                <td class="p-4 text-gray-500 text-xs whitespace-nowrap">${dtRaw !== '-' ? formatDateShort(dtRaw) : '-'}</td>
                <td class="p-4">${statusHtml}</td>
                <td class="p-4 text-center">${actionHtml}</td>
            `;
            tbody.appendChild(tr);
        });

        if (visibleCount === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-500">ไม่พบรายการที่ตรงกับเงื่อนไข</td></tr>`;
        }
    },

    renderTimeline: function() {
        const container = document.getElementById('timeline-container');
        const rangeLabel = document.getElementById('timeline-range-label');
        if (!container) return;

        let start = new Date(this.timelineStartDate);
        start.setHours(0,0,0,0);
        
        let end = new Date(start);
        end.setDate(end.getDate() + 6);
        
        rangeLabel.textContent = `${formatDateShort(start)} - ${formatDateShort(end)}`;

        let html = `<div class="timeline-header bg-gray-100 border-b border-gray-200" style="grid-row: 1; grid-column: 1;">ทะเบียนรถ</div>`;
        
        for(let i=0; i<7; i++) {
            let d = new Date(start);
            d.setDate(d.getDate() + i);
            const isToday = d.toDateString() === new Date().toDateString();
            const dateStr = d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });
            html += `<div class="timeline-header ${isToday ? 'text-brand-600 bg-brand-50' : ''}" style="grid-row: 1; grid-column: ${i+2};">${dateStr}</div>`;
        }

        vehicleDB.forEach((car, index) => {
            const plate = car['ทะเบียนรถ'] || car['Plate'] || 'Unknown';
            const row = index + 2;
            html += `<div class="timeline-cell flex items-center justify-center font-bold text-gray-700 bg-gray-50 text-sm whitespace-nowrap" style="grid-row: ${row}; grid-column: 1; z-index: 5;">${plate}</div>`;
            for(let i=0; i<7; i++) {
                html += `<div class="timeline-cell relative border-l border-dashed border-gray-200" style="grid-row: ${row}; grid-column: ${i+2}; z-index: 1;"></div>`;
            }
        });

        container.innerHTML = html;

        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        let vehicleRowIndex = 1;

        vehicleDB.forEach(car => {
            const carPlate = car['ทะเบียนรถ'] || car['Plate'];
            
            const carBookings = this.bookings.filter(b => {
                const bPlate = getVal(b, ['plate', 'ทะเบียนรถ', 'ทะเบียน']);
                let status = getVal(b, ['status', 'สถานะ']).toString().toLowerCase();
                if (status.includes('reject')) return false; 
                return bPlate === carPlate;
            });

            carBookings.forEach(b => {
                let fromRaw = getVal(b, ['fromdate', 'จากวันที่']);
                let Auto_todate = getVal(b, ['todate', 'ถึงวันที่']);
                let toRaw = (!Auto_todate || Auto_todate === '-') ? fromRaw : Auto_todate;
                if(!fromRaw || fromRaw === '-') return;
                
                let bStartYMD = toBangkokYMD(fromRaw);
                let bEndYMD = toBangkokYMD(toRaw) || bStartYMD;
                if (!bStartYMD) return;

                let bStart = new Date(bStartYMD + 'T00:00:00');
                let bEnd = new Date(bEndYMD + 'T00:00:00');

                if (bEnd < start || bStart > end) return;

                let colStartOffset = Math.max(0, Math.floor((bStart - start) / MS_PER_DAY));
                let colEndOffset = Math.min(6, Math.floor((bEnd - start) / MS_PER_DAY));
                let span = colEndOffset - colStartOffset + 1;

                let gridColStart = colStartOffset + 2; 
                let gridRow = vehicleRowIndex + 1; 

                let status = getVal(b, ['status', 'สถานะ']).toString().toLowerCase();
                let statusClass = 'status-pending';
                if(status.includes('approve')) statusClass = 'status-approved';
                else if(status.includes('complete') || status.includes('คืนรถ')) statusClass = 'status-completed';

                let user = getVal(b, ['email', 'คนจอง', 'ชื่อผู้จอง']);
                let dest = getVal(b, ['destination', 'ไปที่ไหน']);

                let bar = document.createElement('div');
                bar.className = `timeline-bar ${statusClass} cursor-pointer hover:opacity-90 transition`;
                bar.style.gridColumn = `${gridColStart} / span ${span}`;
                bar.style.gridRow = `${gridRow}`;
                bar.style.left = '4px';
                bar.style.right = '4px';
                bar.style.position = 'relative'; 
                bar.style.marginTop = '10px';
                bar.style.zIndex = '10'; // Ensure it sits above the cells
                
                bar.title = `${user}\nไป: ${dest}`;
                bar.innerHTML = `<span class="font-bold truncate">${user.split('@')[0]}</span><span class="text-[10px] truncate opacity-80">${dest}</span>`;
                
                container.appendChild(bar);
            });
            vehicleRowIndex++;
        });
    }
};

// --- Utilities ---
function getVal(record, keywords) {
    const keys = Object.keys(record);
    for (let k of keys) {
        const cleanKey = k.toLowerCase().replace(/[\s\(\)\[\]\.\-_]/g, '');
        for (let word of keywords) {
            const cleanWord = word.toLowerCase().replace(/[\s\(\)\[\]\.\-_]/g, '');
            if (cleanKey.includes(cleanWord)) return record[k];
        }
    }
    return '-';
}

function formatDateShort(dateString) {
    if(!dateString || dateString === '-') return '-';
    try {
        const ymd = toBangkokYMD(dateString);
        if (!ymd) return dateString;
        const parts = ymd.split('-');
        const d = parseInt(parts[2], 10);
        const m = parseInt(parts[1], 10);
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return `${d} ${months[m - 1]}`;
    } catch(e) {
        return dateString;
    }
}

// --- Tab Navigation ---
window.switchTab = function(tabId) {
    const tabs = ['form', 'dash', 'time', 'maint', 'tax'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        const view = document.getElementById(`view-${t}`);
        if (btn) btn.classList.remove('active');
        if (view) view.classList.add('hidden');
    });
    const activeBtn = document.getElementById(`tab-${tabId}`);
    const activeView = document.getElementById(`view-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeView) activeView.classList.remove('hidden');

    if(tabId === 'dash' || tabId === 'time') {
        if(appState.bookings.length === 0) appState.fetchAllData();
        else { appState.renderDashboard(); appState.renderTimeline(); }
    } else if (tabId === 'maint') {
        appState.renderMaintenance();
    } else if (tabId === 'tax') {
        appState.renderTaxInsurance();
    }
}



function submitStatusUpdate(rowIndex, newStatus, fullRemark, actorName) {
    const booking = appState.bookings.find(b => b._rowIndex === parseInt(rowIndex));
    if(booking) {
        const keys = Object.keys(booking);
        const statusKey = keys.find(k => k.toLowerCase().includes('สถานะ')) || 'สถานะ';
        const remarkKey = keys.find(k => k.toLowerCase().includes('หมายเหตุ')) || 'หมายเหตุ';
        booking[statusKey] = newStatus;
        booking[remarkKey] = fullRemark;
        try { localStorage.setItem('sis_history', JSON.stringify(appState.bookings)); } catch(e){}
        appState.renderDashboard();
        appState.renderTimeline();
    }

    const payload = { 
        action: "update_status", 
        rowIndex: rowIndex, 
        status: newStatus, 
        rejectReason: fullRemark, // For backwards compatibility with older Apps Script code
        remark: fullRemark,
        note: fullRemark,
        reason: fullRemark,
        actorName: actorName,
        approvedBy: actorName
    };
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
    })
    .then(r => r.json())
    .then(data => {
        if(data.status !== "success") alert(`❌ อัปเดตล้มเหลว: ${data.message}`);
        else {
            appState.fetchBookings(); // Sync silently
        }
    }).catch(err => {
        console.warn("Server update notice:", err);
    });
}

// --- Return Car Modal ---
const returnModal = document.getElementById('return-modal');
const returnForm = document.getElementById('modal-return-form');
window.openReturnModal = function(plate, mileageOutStr, rowIndex) {
    document.getElementById('modal-plate-display').textContent = plate;
    document.getElementById('modal-plate-value').value = plate;
    document.getElementById('modal-return-row').value = rowIndex; 
    
    const mOutInput = document.getElementById('modal-mileage-out');
    if (mileageOutStr && mileageOutStr !== 'undefined' && mileageOutStr !== 'null') {
        mOutInput.value = mileageOutStr;
    } else {
        mOutInput.value = '';
    }
    
    returnModal.classList.remove('hidden');
    setTimeout(() => returnModal.classList.add('show', 'opacity-100'), 10);
};

window.closeReturnModal = function() {
    returnModal.classList.remove('show', 'opacity-100');
    setTimeout(() => { returnModal.classList.add('hidden'); if(returnForm) returnForm.reset(); }, 300);
}

if (returnForm) {
    returnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (returnForm.checkValidity()) {
            const btn = document.getElementById('return-submit-btn');
            const ogText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังอัปเดต...';
            btn.disabled = true;

            const rIndex = document.getElementById('modal-return-row').value;
            const payload = {
                action: "update",
                searchPlate: document.getElementById('modal-plate-value').value, 
                rowIndex: rIndex || null, 
                mileageOut: document.getElementById('modal-mileage-out').value,
                mileageIn: document.getElementById('modal-mileage-in').value,
                tollFee: document.getElementById('modal-toll-fee').value || "",
                tollBalance: document.getElementById('modal-toll-balance').value || ""
            };

            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
            })
            .then(r => r.json())
            .then(data => {
                if(data.status === "success") {
                    alert(`✅ บันทึกข้อมูลคืนรถสำเร็จ!`);
                    closeReturnModal();
                    appState.fetchBookings(); 
                } else { alert(`❌ เกิดข้อผิดพลาด: ${data.message}`); }
            })
            .catch(err => alert("❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"))
            .finally(() => { btn.innerHTML = ogText; btn.disabled = false; });
        }
    });
}

// --- Vehicle Usage Slip & PDF Printing ---
window.openSlipModal = function(rowIndex) {
    const slipModal = document.getElementById('slip-modal');
    if (!slipModal) {
        console.error("slipModal element not found!");
        return;
    }

    try {
        const booking = appState.bookings.find(b => b._rowIndex === parseInt(rowIndex)) || 
                        appState.bookings[rowIndex] || {};
        
        // 1. Resolve User details
        const userIdentifier = getVal(booking, ['email', 'อีเมล', 'ชื่อผู้จอง', 'ผู้จอง', 'ชื่อ', 'พนักงาน', 'คนจอง', 'gmail']);
        let matchedUser = userDB.find(u => {
            const uEmail = (u['Email'] || '').toLowerCase();
            const uName = (u['Name'] || u['ชื่อ'] || '').toLowerCase();
            const uNick = (u['Nickname'] || u['ชื่อเล่น'] || '').toLowerCase();
            const ident = userIdentifier.toLowerCase();
            return (uEmail && ident.includes(uEmail)) || 
                   (uName && (ident.includes(uName) || uName.includes(ident))) || 
                   (uNick && ident.includes(uNick));
        }) || {};

        const displayName = matchedUser['Name'] || matchedUser['ชื่อ'] || userIdentifier;
        const displayNick = matchedUser['Nickname'] || matchedUser['ชื่อเล่น'] || '';
        const displayPos = matchedUser['Position'] || matchedUser['ตำแหน่ง'] || '-';
        const displayTel = matchedUser['Tel'] || matchedUser['เบอร์โทร'] || '-';
        const displayEmail = matchedUser['Email'] || (userIdentifier.includes('@') ? userIdentifier : '-');

        // 2. Resolve Car details
        const plate = getVal(booking, ['plate', 'ทะเบียนรถ', 'ทะเบียน', 'รถ', 'ยานพาหนะ']);
        let matchedCar = vehicleDB.find(c => {
            const cPlate = c['ทะเบียนรถ'] || c['Plate'] || '';
            return cPlate && plate.includes(cPlate);
        }) || {};

        const displayModel = `${matchedCar['ยี่ห้อ'] || ''} ${matchedCar['รุ่น'] || ''} ${matchedCar['สี'] ? `(${matchedCar['สี']})` : ''}`.trim() || '-';
        const displayCarCode = matchedCar['Code'] || matchedCar['รหัสรถ'] || '-';
        const displayCarManager = matchedCar['ชื่อคนดูแล'] || matchedCar['ผู้ดูแล'] || '-';

        // 3. Trip & Dates
        const purpose = getVal(booking, ['purpose', 'ไปทำอะไร', 'จุดประสงค์']);
        const dest = getVal(booking, ['destination', 'ไปที่ไหน', 'สถานที่']);
        const fromDate = getVal(booking, ['fromdate', 'วันที่เดินทาง', 'ตั้งแต่วันที่', 'จากวันที่']);
        const toDate = getVal(booking, ['todate', 'ถึงวันที่', 'วันสิ้นสุด']);
        const days = getVal(booking, ['days', 'จำนวนวัน', 'กี่วัน']);
        const statusRaw = getVal(booking, ['status', 'สถานะ']);
        const remark = getVal(booking, ['remark', 'หมายเหตุ', 'เหตุผล']);

        let dateDisplay = formatDateShort(fromDate);
        if (fromDate !== toDate && toDate !== '-') dateDisplay += ` ถึง ${formatDateShort(toDate)}`;

        // 4. Odometer & Mileage
        const mOut = getVal(booking, ['mileageout', 'ไมล์ออก', 'เลขไมล์ออก']);
        const mIn = getVal(booking, ['mileagein', 'ไมล์เข้า', 'เลขไมล์เข้า']);
        const mOutNum = parseFloat(mOut);
        const mInNum = parseFloat(mIn);
        let totalKm = '-';
        if (!isNaN(mInNum) && !isNaN(mOutNum) && mInNum >= mOutNum) {
            totalKm = (mInNum - mOutNum).toLocaleString() + ' กม.';
        }

        // 5. Toll Fee & Toll Balance
        const tollFee = getVal(booking, ['tollfee', 'ค่าทางด่วน']);
        const tollBalance = getVal(booking, ['tollbalance', 'ทางด่วนคงเหลือ']);
        const tollFeeNum = parseFloat(tollFee) || 0;

        // Doc Number & Date
        const today = new Date();
        const docDateStr = today.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
        const ymd = today.toISOString().slice(0, 10).replace(/-/g, '');
        const docNo = `SIS-${ymd}-${String(rowIndex || 1).padStart(3, '0')}`;

        // Fill DOM in Slip
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if (el) el.textContent = txt;
        };

        setTxt('slip-doc-no', docNo);
        setTxt('slip-doc-date', docDateStr);

        // Status Badge
        const badgeEl = document.getElementById('slip-status-badge');
        if (badgeEl) {
            const sLower = (statusRaw || '').toString().toLowerCase();
            if (sLower.includes('complete') || sLower.includes('คืน')) {
                badgeEl.textContent = 'คืนรถแล้ว';
                badgeEl.className = 'mt-1.5 inline-block text-[11px] px-2 py-0.5 rounded font-bold uppercase border bg-slate-100 text-slate-700 border-slate-300';
            } else if (sLower.includes('approve') || sLower.includes('อนุมัติ')) {
                badgeEl.textContent = 'อนุมัติแล้ว';
                badgeEl.className = 'mt-1.5 inline-block text-[11px] px-2 py-0.5 rounded font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-300';
            } else {
                badgeEl.textContent = 'รอการใช้งาน';
                badgeEl.className = 'mt-1.5 inline-block text-[11px] px-2 py-0.5 rounded font-bold uppercase border bg-amber-50 text-amber-700 border-amber-300';
            }
        }

        // Populate Info
        setTxt('slip-user-name', `${displayName} ${displayNick ? `(${displayNick})` : ''}`);
        setTxt('slip-user-position', displayPos);
        setTxt('slip-user-tel', displayTel);
        setTxt('slip-user-email', displayEmail);

        setTxt('slip-car-plate', plate !== '-' ? plate : 'ไม่ระบุ');
        setTxt('slip-car-model', displayModel);
        setTxt('slip-car-code', displayCarCode);
        setTxt('slip-car-manager', displayCarManager);

        setTxt('slip-purpose', purpose !== '-' ? purpose : 'ปฏิบัติงานตามที่ได้รับมอบหมาย');
        setTxt('slip-dest', dest !== '-' ? dest : '-');
        setTxt('slip-dates', dateDisplay);
        setTxt('slip-days', days !== '-' ? (days.includes('วัน') ? days : `${days} วัน`) : '1 วัน');

        setTxt('slip-mileage-out', (mOut && mOut !== '-') ? parseFloat(mOut).toLocaleString() + ' กม.' : 'ไม่ได้ระบุ');
        setTxt('slip-mileage-in', (mIn && mIn !== '-') ? parseFloat(mIn).toLocaleString() + ' กม.' : '-');
        setTxt('slip-mileage-total', totalKm);

        // Toll Fee Row
        setTxt('slip-table-toll', tollFeeNum > 0 ? tollFeeNum.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00');
        let tollNote = '-';
        if (tollBalance && tollBalance !== '-') {
            tollNote = `คงเหลือในบัตร Easy Pass: ${parseFloat(tollBalance).toLocaleString()} บาท`;
        }
        setTxt('slip-table-toll-note', tollNote);

        // Signatures
        setTxt('slip-sign-requester', `( ${displayName} )`);
        
        // Approver matching
        let approverName = '....................................................';
        if (remark && (remark.includes('Approved โดย') || remark.includes('อนุมัติโดย'))) {
            approverName = remark.replace(/^Approved โดย\s*/i, '').replace(/^อนุมัติโดย\s*/i, '').trim();
        }
        setTxt('slip-sign-approver', `( ${approverName} )`);
        setTxt('slip-sign-caretaker', `( ${displayCarManager !== '-' ? displayCarManager : '....................................................'} )`);

        // Reset Quick inputs & recalculate
        const fuelIn = document.getElementById('slip-input-fuel');
        if (fuelIn) fuelIn.value = '';
        const fuelBillsIn = document.getElementById('slip-input-fuel-bills');
        if (fuelBillsIn) fuelBillsIn.value = '1';
        const otherIn = document.getElementById('slip-input-other');
        if (otherIn) otherIn.value = '';
        window.updateSlipAccountingValues();

        // Show modal
        slipModal.classList.remove('hidden');
        slipModal.style.display = 'flex';
        setTimeout(() => slipModal.classList.add('show', 'opacity-100'), 10);
    } catch(err) {
        console.error("Error opening slip modal:", err);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลใบใช้รถ: " + err.message);
    }
};

window.closeSlipModal = function() {
    const slipModal = document.getElementById('slip-modal');
    if (!slipModal) return;
    slipModal.classList.remove('show', 'opacity-100');
    setTimeout(() => {
        slipModal.classList.add('hidden');
        slipModal.style.display = 'none';
    }, 250);
};

window.updateSlipAccountingValues = function() {
    const fuelVal = parseFloat(document.getElementById('slip-input-fuel')?.value) || 0;
    const fuelBills = parseInt(document.getElementById('slip-input-fuel-bills')?.value) || 1;
    const otherVal = parseFloat(document.getElementById('slip-input-other')?.value) || 0;

    const tollText = document.getElementById('slip-table-toll')?.textContent?.replace(/,/g, '') || '0';
    const tollVal = parseFloat(tollText) || 0;

    // Fuel row
    const fuelEl = document.getElementById('slip-table-fuel');
    if (fuelEl) fuelEl.textContent = fuelVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const fuelNoteEl = document.getElementById('slip-table-fuel-note');
    if (fuelNoteEl) fuelNoteEl.textContent = fuelVal > 0 ? `แนบใบเสร็จ ${fuelBills} ใบ` : 'แนบใบเสร็จ 1 ใบ';

    // Other row
    const otherEl = document.getElementById('slip-table-other');
    if (otherEl) otherEl.textContent = otherVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Total row
    const total = fuelVal + tollVal + otherVal;
    const totalEl = document.getElementById('slip-table-total');
    if (totalEl) totalEl.textContent = total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

window.printSlip = function() {
    window.print();
};

window.downloadSlipPDF = function() {
    const slipElement = document.getElementById('printable-slip');
    if (!slipElement) return;

    const btnTop = document.getElementById('btn-download-pdf-top');
    const btnBottom = document.getElementById('btn-download-pdf-bottom');
    const originalTopText = btnTop ? btnTop.innerHTML : '';
    const originalBottomText = btnBottom ? btnBottom.innerHTML : '';

    if (btnTop) btnTop.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังสร้าง PDF...';
    if (btnBottom) btnBottom.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังสร้าง PDF...';

    const docNo = (document.getElementById('slip-doc-no')?.textContent || 'SIS-CAR').trim();
    const carPlate = (document.getElementById('slip-car-plate')?.textContent || 'Car').trim();
    const fileName = `ใบใช้รถ_${carPlate}_${docNo}.pdf`;

    if (typeof html2pdf !== 'undefined') {
        const opt = {
            margin: [6, 8, 6, 8],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(slipElement).save().then(() => {
            if (btnTop) btnTop.innerHTML = originalTopText;
            if (btnBottom) btnBottom.innerHTML = originalBottomText;
        }).catch(err => {
            console.warn("html2pdf failed, falling back to print dialog:", err);
            if (btnTop) btnTop.innerHTML = originalTopText;
            if (btnBottom) btnBottom.innerHTML = originalBottomText;
            window.print();
        });
    } else {
        if (btnTop) btnTop.innerHTML = originalTopText;
        if (btnBottom) btnBottom.innerHTML = originalBottomText;
        window.print();
    }
};

// --- Email Forwarding for Accounting Slip ---
window.openEmailModal = function() {
    const emailModal = document.getElementById('email-modal');
    if (!emailModal) return;

    const docNo = document.getElementById('slip-doc-no')?.textContent || '-';
    const userName = document.getElementById('slip-user-name')?.textContent || '-';
    const userPos = document.getElementById('slip-user-position')?.textContent || '-';
    const carPlate = document.getElementById('slip-car-plate')?.textContent || '-';
    const carModel = document.getElementById('slip-car-model')?.textContent || '-';
    const purpose = document.getElementById('slip-purpose')?.textContent || '-';
    const dest = document.getElementById('slip-dest')?.textContent || '-';
    const dates = document.getElementById('slip-dates')?.textContent || '-';
    const days = document.getElementById('slip-days')?.textContent || '-';
    const mOut = document.getElementById('slip-mileage-out')?.textContent || '-';
    const mIn = document.getElementById('slip-mileage-in')?.textContent || '-';
    const mTotal = document.getElementById('slip-mileage-total')?.textContent || '-';

    const fuel = document.getElementById('slip-table-fuel')?.textContent || '0.00';
    const fuelNote = document.getElementById('slip-table-fuel-note')?.textContent || '-';
    const toll = document.getElementById('slip-table-toll')?.textContent || '0.00';
    const tollNote = document.getElementById('slip-table-toll-note')?.textContent || '-';
    const other = document.getElementById('slip-table-other')?.textContent || '0.00';
    const total = document.getElementById('slip-table-total')?.textContent || '0.00';

    const subject = `[ใบขอใช้รถยนต์และเบิกค่าใช้จ่าย] ทะเบียน ${carPlate} - ${userName} (${docNo})`;
    const body = `เรียน ฝ่ายบัญชีและการเงิน,

ขอนำส่งใบขอใช้รถยนต์และสรุปค่าใช้จ่ายในการเดินทาง (${docNo}) เพื่อดำเนินการเบิกจ่ายตามระเบียบบริษัทฯ รายละเอียดดังนี้:

• ผู้ขอใช้รถ / ผู้ขับขี่: ${userName} (ตำแหน่ง: ${userPos})
• ข้อมูลยานพาหนะ: ทะเบียน ${carPlate} (${carModel})
• วัตถุประสงค์: ${purpose}
• สถานที่ปลายทาง: ${dest}
• กำหนดการเดินทาง: ${dates} (รวม ${days})
• ระยะทางใช้งานจริง: ${mTotal} (ไมล์ออก: ${mOut} - ไมล์เข้า: ${mIn})

สรุปรายการค่าใช้จ่ายที่ขอเบิกแนบบิล:
1. ค่าน้ำมันเชื้อเพลิง: ${fuel} บาท (${fuelNote})
2. ค่าทางด่วน / ผ่านทาง: ${toll} บาท (${tollNote})
3. ค่าใช้จ่ายอื่นๆ: ${other} บาท
---------------------------------------------
รวมเป็นเงินที่ขอเบิกจ่ายทั้งสิ้น: ${total} บาท

(หมายเหตุ: ได้แนบสลิป/ใบเสร็จรับเงินค่าน้ำมันและค่าทางด่วนฉบับจริง เพื่อส่งมอบให้ฝ่ายบัญชีเรียบร้อยแล้ว)

ขอแสดงความนับถือ,
${userName}`;

    const toInput = document.getElementById('email-recipients');
    if (toInput) toInput.value = 'sisintegration005@gmail.com';

    const ccInput = document.getElementById('email-cc');
    if (ccInput) {
        const userEmail = (document.getElementById('slip-user-email')?.textContent || '').trim();
        if (userEmail && userEmail !== '-' && userEmail.includes('@') && !userEmail.includes('sisintegration005')) {
            ccInput.value = userEmail;
        } else {
            ccInput.value = '';
        }
    }

    document.getElementById('email-subject').value = subject;
    document.getElementById('email-body').value = body;

    emailModal.classList.remove('hidden');
    emailModal.style.display = 'flex';
    setTimeout(() => emailModal.classList.add('show', 'opacity-100'), 10);
};

window.closeEmailModal = function() {
    const emailModal = document.getElementById('email-modal');
    if (!emailModal) return;
    emailModal.classList.remove('show', 'opacity-100');
    setTimeout(() => {
        emailModal.classList.add('hidden');
        emailModal.style.display = 'none';
    }, 250);
};

window.sendViaGmail = function() {
    const to = (document.getElementById('email-recipients')?.value || 'sisintegration005@gmail.com').trim();
    const cc = (document.getElementById('email-cc')?.value || '').trim();
    const su = document.getElementById('email-subject')?.value || '';
    const body = document.getElementById('email-body')?.value || '';
    
    let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`;
    if (cc) {
        gmailUrl += `&cc=${encodeURIComponent(cc)}`;
    }
    window.open(gmailUrl, '_blank');
};

window.sendViaMailto = function() {
    const to = (document.getElementById('email-recipients')?.value || 'sisintegration005@gmail.com').trim();
    const cc = (document.getElementById('email-cc')?.value || '').trim();
    const su = document.getElementById('email-subject')?.value || '';
    const body = document.getElementById('email-body')?.value || '';
    
    let mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`;
    if (cc) {
        mailtoUrl += `&cc=${encodeURIComponent(cc)}`;
    }
    window.location.href = mailtoUrl;
};

window.copyEmailBody = function() {
    const body = document.getElementById('email-body').value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(body).then(() => {
            const btn = document.getElementById('btn-copy-email');
            const og = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check text-green-600"></i> คัดลอกสำเร็จ!';
            setTimeout(() => btn.innerHTML = og, 2000);
        });
    } else {
        alert("กรุณาเลือกและคัดลอกข้อความในกล่องด้วยตนเองครับ");
    }
};

function initLocalCache() {
    try {
        const cachedUsers = localStorage.getItem('sis_users');
        const cachedCars = localStorage.getItem('sis_cars');
        const cachedHistory = localStorage.getItem('sis_history');
        const cachedMaint = localStorage.getItem('sis_maintenance');
        const cachedTax = localStorage.getItem('sis_tax_insurance');

        userDB = cachedUsers ? JSON.parse(cachedUsers) : DEFAULT_USERS;
        vehicleDB = cachedCars ? JSON.parse(cachedCars) : DEFAULT_CARS;
        if (cachedHistory && window.appState) {
            window.appState.bookings = JSON.parse(cachedHistory);
            if (window.appState.bookings && window.appState.bookings.length > 0) {
                window.appState.isHistoryLoaded = true;
            }
        }
        if (window.appState) {
            window.appState.maintenance = cachedMaint ? JSON.parse(cachedMaint) : DEFAULT_MAINTENANCE;
            window.appState.taxInsurance = cachedTax ? JSON.parse(cachedTax) : DEFAULT_TAX_INSURANCE;
        }
    } catch(e) {
        console.warn("Using fallback master data", e);
        userDB = DEFAULT_USERS;
        vehicleDB = DEFAULT_CARS;
        if (window.appState) {
            window.appState.maintenance = DEFAULT_MAINTENANCE;
            window.appState.taxInsurance = DEFAULT_TAX_INSURANCE;
        }
    }
}

// --- Modal Handlers for Maintenance & Tax/Insurance ---
window.openMaintenanceModal = function(prefillPlate) {
    const modal = document.getElementById('maint-modal');
    if (!modal) return;
    
    // Default date to today (Bangkok YMD)
    const todayYMD = toBangkokYMD(new Date());
    const dateInput = document.getElementById('maint-date');

    // Reset fields
    document.getElementById('maint-form')?.reset();
    if (dateInput) dateInput.value = todayYMD;

    if (prefillPlate) {
        const carSelect = document.getElementById('maint-car-select');
        if (carSelect) carSelect.value = prefillPlate;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.remove('opacity-0'), 20);
};

window.closeMaintenanceModal = function() {
    const modal = document.getElementById('maint-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
};

window.submitMaintenanceForm = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-maint');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> กำลังบันทึก...';
        btn.disabled = true;
    }

    const plate = document.getElementById('maint-car-select').value;
    const serviceDate = document.getElementById('maint-date').value;
    const category = document.getElementById('maint-cat').value;
    const status = document.getElementById('maint-status').value;
    const items = document.getElementById('maint-items').value;
    const mileage = document.getElementById('maint-mileage').value;
    const nextMileage = document.getElementById('maint-next-mileage').value;
    const garage = document.getElementById('maint-garage').value;
    const cost = document.getElementById('maint-cost').value || 0;
    const requester = document.getElementById('maint-requester').value;
    const notes = document.getElementById('maint-notes').value;

    const id = "MNT-" + new Date().getFullYear() + String(new Date().getMonth()+1).padStart(2, '0') + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const newEntry = {
        "รหัสรายการ": id,
        "วันที่เข้าซ่อม": serviceDate,
        "ทะเบียนรถ": plate,
        "ประเภทงาน": category,
        "รายการซ่อม/เช็คระยะ": items,
        "เลขไมล์เข้าซ่อม": mileage ? Number(mileage) : "",
        "เลขไมล์รอบถัดไป": nextMileage ? Number(nextMileage) : "",
        "อู่หรือศูนย์บริการ": garage,
        "ค่าใช้จ่าย": Number(cost),
        "ผู้ส่งซ่อม": requester,
        "สถานะ": status,
        "หมายเหตุ/เลขที่ใบเสร็จ": notes
    };

    // Optimistic Cache update
    appState.maintenance.unshift(newEntry);
    try { localStorage.setItem('sis_maintenance', JSON.stringify(appState.maintenance)); } catch(err){}
    appState.renderMaintenance();
    closeMaintenanceModal();

    // Async Google Apps Script sync
    const payload = {
        action: "create_maintenance",
        id: id,
        plate: plate,
        serviceDate: serviceDate,
        category: category,
        status: status,
        items: items,
        mileage: mileage,
        nextMileage: nextMileage,
        garage: garage,
        cost: cost,
        requester: requester,
        notes: notes
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        alert("✅ บันทึกงานซ่อมบำรุงเรียบร้อยแล้ว และส่งแจ้งเตือนเข้า Telegram แล้วครับ");
    } catch(err) {
        console.warn("Maintenance submit error:", err);
        alert("บันทึกข้อมูลในเครื่องเรียบร้อยแล้ว (จะซิงค์กับเซิร์ฟเวอร์เมื่อมีการเชื่อมต่อ)");
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
};

window.openTaxModal = function(prefillPlate) {
    const modal = document.getElementById('tax-modal');
    if (!modal) return;

    document.getElementById('tax-form')?.reset();
    const carSelect = document.getElementById('tax-car-select');
    if (prefillPlate && carSelect) {
        carSelect.value = prefillPlate;
    }
    onTaxCarSelected();
    onRenewTypeChanged();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.remove('opacity-0'), 20);
};

window.closeTaxModal = function() {
    const modal = document.getElementById('tax-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
};

window.onTaxCarSelected = function() {
    const plate = document.getElementById('tax-car-select')?.value;
    const box = document.getElementById('tax-current-status-box');
    if (!plate || !box) return;

    const carData = (appState.taxInsurance || []).find(c => (c['ทะเบียนรถ'] || c['plate']) === plate);
    if (!carData) {
        box.classList.add('hidden');
        return;
    }

    const taxExp = formatDateShort(carData['วันหมดอายุภาษี'] || '-');
    const prbExp = formatDateShort(carData['วันหมดอายุพรบ'] || '-');
    const insExp = formatDateShort(carData['วันหมดอายุประกัน'] || '-');
    const insComp = carData['บริษัทประกัน'] || '-';
    const insType = carData['ประเภทประกัน'] || '-';
    const policyNo = carData['เลขที่กรมธรรม์'] || '';

    box.classList.remove('hidden');
    box.innerHTML = `
        <p class="font-semibold text-slate-700"><i class="fa-solid fa-circle-info text-sky-600 mr-1"></i> ข้อมูลวันหมดอายุปัจจุบัน:</p>
        <div class="grid grid-cols-3 gap-2 text-[11px] pt-1">
            <div><span class="text-gray-500">ภาษี:</span> <span class="font-bold text-gray-800">${taxExp}</span></div>
            <div><span class="text-gray-500">พ.ร.บ.:</span> <span class="font-bold text-gray-800">${prbExp}</span></div>
            <div><span class="text-gray-500">ประกัน:</span> <span class="font-bold text-gray-800">${insExp}</span></div>
        </div>
        <p class="text-[11px] text-gray-500 mt-1">ประกันภัย: <span class="font-medium text-gray-700">${insComp} (${insType})</span></p>
    `;

    // Pre-fill insurance fields if available
    const compInput = document.getElementById('tax-company');
    const typeSelect = document.getElementById('tax-ins-type');
    const policyInput = document.getElementById('tax-policy-no');
    if (compInput && insComp !== '-') compInput.value = insComp;
    if (typeSelect && insType !== '-') typeSelect.value = insType;
    if (policyInput && policyNo !== '-') policyInput.value = policyNo;

    // Auto set default next year expiry
    autoSetNextYearExpiry();
};

window.onRenewTypeChanged = function() {
    const renewType = document.getElementById('tax-renew-type')?.value;
    const insSection = document.getElementById('tax-ins-details-section');
    if (!insSection) return;

    if (renewType === 'tax' || renewType === 'prb') {
        insSection.classList.add('hidden');
    } else {
        insSection.classList.remove('hidden');
    }
    autoSetNextYearExpiry();
};

window.autoSetNextYearExpiry = function() {
    const plate = document.getElementById('tax-car-select')?.value;
    const renewType = document.getElementById('tax-renew-type')?.value;
    const expiryInput = document.getElementById('tax-new-expiry');
    if (!expiryInput) return;

    const carData = (appState.taxInsurance || []).find(c => (c['ทะเบียนรถ'] || c['plate']) === plate);
    let baseDateStr = '';
    if (carData) {
        if (renewType === 'tax') baseDateStr = carData['วันหมดอายุภาษี'];
        else if (renewType === 'prb') baseDateStr = carData['วันหมดอายุพรบ'];
        else if (renewType === 'insurance') baseDateStr = carData['วันหมดอายุประกัน'];
        else baseDateStr = carData['วันหมดอายุภาษี'] || carData['วันหมดอายุพรบ'];
    }

    let targetDate = new Date();
    if (baseDateStr) {
        const ymd = toBangkokYMD(baseDateStr);
        if (ymd) {
            const parts = ymd.split('-');
            targetDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
    }

    // Add 1 year
    targetDate.setFullYear(targetDate.getFullYear() + 1);
    expiryInput.value = toBangkokYMD(targetDate);
};

window.submitTaxRenewalForm = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-tax');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> กำลังบันทึก...';
        btn.disabled = true;
    }

    const plate = document.getElementById('tax-car-select').value;
    const renewType = document.getElementById('tax-renew-type').value;
    const newExpiry = document.getElementById('tax-new-expiry').value;
    const cost = document.getElementById('tax-cost').value || 0;
    const company = document.getElementById('tax-company').value;
    const insType = document.getElementById('tax-ins-type').value;
    const policyNo = document.getElementById('tax-policy-no').value;
    const notes = document.getElementById('tax-notes').value;

    const car = vehicleDB.find(v => (v['ทะเบียนรถ'] || v['Plate']) === plate);
    const model = car ? (car['รุ่น'] || car['Model'] || '') : '';
    const manager = car ? (car['ชื่อคนดูแล'] || car['Manager'] || '-') : '-';

    // Update in local cache
    let targetCar = appState.taxInsurance.find(c => (c['ทะเบียนรถ'] || c['plate']) === plate);
    if (!targetCar) {
        targetCar = { "ทะเบียนรถ": plate, "รุ่น": model, "ผู้ดูแล": manager };
        appState.taxInsurance.push(targetCar);
    }

    if (renewType === 'tax' || renewType === 'all') {
        targetCar['วันหมดอายุภาษี'] = newExpiry;
        targetCar['ค่าใช้จ่ายภาษีล่าสุด'] = Number(cost);
    }
    if (renewType === 'prb' || renewType === 'all') {
        targetCar['วันหมดอายุพรบ'] = newExpiry;
    }
    if (renewType === 'insurance' || renewType === 'all') {
        targetCar['วันหมดอายุประกัน'] = newExpiry;
        targetCar['ค่าเบี้ยประกันล่าสุด'] = Number(cost);
        if (company) targetCar['บริษัทประกัน'] = company;
        if (insType) targetCar['ประเภทประกัน'] = insType;
        if (policyNo) targetCar['เลขที่กรมธรรม์'] = policyNo;
    }
    if (notes) {
        const prev = targetCar['หมายเหตุ'] || '';
        targetCar['หมายเหตุ'] = notes + (prev ? ' | ' + prev : '');
    }

    try { localStorage.setItem('sis_tax_insurance', JSON.stringify(appState.taxInsurance)); } catch(err){}
    appState.renderTaxInsurance();
    closeTaxModal();

    // Async Google Apps Script sync
    const payload = {
        action: "renew_tax_insurance",
        plate: plate,
        model: model,
        manager: manager,
        renewType: renewType,
        newExpiry: newExpiry,
        taxExpiry: (renewType === 'tax' || renewType === 'all') ? newExpiry : undefined,
        prbExpiry: (renewType === 'prb' || renewType === 'all') ? newExpiry : undefined,
        insExpiry: (renewType === 'insurance' || renewType === 'all') ? newExpiry : undefined,
        cost: cost,
        taxCost: (renewType === 'tax' || renewType === 'all') ? cost : undefined,
        insCost: (renewType === 'insurance' || renewType === 'all') ? cost : undefined,
        insCompany: company,
        insType: insType,
        policyNo: policyNo,
        notes: notes
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        alert("✅ บันทึกการต่ออายุเรียบร้อยแล้ว และส่งแจ้งเตือนเข้า Telegram แล้วครับ");
    } catch(err) {
        console.warn("Tax renewal submit error:", err);
        alert("บันทึกข้อมูลในเครื่องเรียบร้อยแล้ว (จะซิงค์กับเซิร์ฟเวอร์เมื่อมีการเชื่อมต่อ)");
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. นำข้อมูลพนักงานและรถจากแคช/ค่าเริ่มต้นใส่ Dropdown ทันที 0ms ไม่ต้องรอ API
    initLocalCache();
    appState.populateDropdowns();
    if (appState.bookings && appState.bookings.length > 0) {
        appState.renderDashboard();
        appState.renderTimeline();
    }
    appState.renderMaintenance();
    appState.renderTaxInsurance();

    // 2. ซิงค์ข้อมูลล่าสุดกับ Google Sheets ในเบื้องหลัง (Background Sync)
    appState.fetchAllData();

    // Clock
    const datetimeEl = document.getElementById('current-datetime');
    function updateClock() {
        if (datetimeEl) datetimeEl.textContent = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Listeners for Dropdowns
    const reqUserSelect = document.getElementById('req-user');
    const vehPlateSelect = document.getElementById('veh-plate');

    if(reqUserSelect) {
        reqUserSelect.addEventListener('change', (e) => {
            const u = userDB[e.target.value];
            document.getElementById('user-info-card').classList.remove('hidden');
            document.getElementById('info-email').textContent = u['Email'] || u['อีเมล'] || '-';
            document.getElementById('info-tel').textContent = u['Tel'] || u['เบอร์โทร'] || '-';
            document.getElementById('info-position').textContent = u['Position'] || u['ตำแหน่ง'] || '-';
            updatePreview();
        });
    }

    if(vehPlateSelect) {
        vehPlateSelect.addEventListener('change', (e) => {
            const c = vehicleDB.find(v => (v['ทะเบียนรถ'] || v['Plate']) === e.target.value);
            document.getElementById('car-info-card').classList.remove('hidden');
            document.getElementById('info-model').textContent = c['รุ่น'] || c['Model'] || '-';
            document.getElementById('info-manager').textContent = c['ชื่อคนดูแล'] || c['Manager'] || '-';
            updatePreview();
        });
    }

    // Dashboard Filters Event Listeners
    document.getElementById('filter-status')?.addEventListener('change', () => appState.renderDashboard());
    document.getElementById('dash-search')?.addEventListener('input', () => appState.renderDashboard());

    // Booking Form Submit Logic
    const bookingForm = document.getElementById('booking-form');
    if(bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (bookingForm.checkValidity()) {
                const dtStart = document.getElementById('dt-start');
                const dtEnd = document.getElementById('dt-end');
                const dtError = document.getElementById('dt-error');
                
                if (new Date(dtStart.value) > new Date(dtEnd.value)) {
                    dtError.classList.remove('hidden');
                    return;
                }
                dtError.classList.add('hidden');

                // หากประวัติการจองยังโหลดไม่เสร็จ ให้รอโหลดข้อมูลจริงก่อน เพื่อป้องกันการจองซ้ำ
                if (!appState.isHistoryLoaded && (!appState.bookings || appState.bookings.length === 0)) {
                    const btn = document.getElementById('btn-submit');
                    const ogText = btn ? btn.innerHTML : '';
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ตรวจสอบสถานะรถล่าสุด...';
                        btn.disabled = true;
                    }
                    try {
                        await appState.fetchAllData();
                    } catch(err) {
                        console.warn("Wait for history fetch error:", err);
                    } finally {
                        if (btn) {
                            btn.innerHTML = ogText;
                            btn.disabled = false;
                        }
                    }
                }

                // --- ระบบป้องกันการจองซ้ำ (เช็คช่วงเวลาและสถานะรถแบบ Timezone-safe) ---
                const newStartYMD = toBangkokYMD(dtStart.value);
                const newEndYMD = toBangkokYMD(dtEnd.value) || newStartYMD;
                const selectedPlate = (vehPlateSelect.value || '').trim();

                const overlapping = appState.bookings.find(b => {
                    const bPlate = (getVal(b, ['plate', 'ทะเบียนรถที่จอง', 'ทะเบียนรถ', 'ทะเบียน']) || '').toString().trim();
                    if (bPlate !== selectedPlate) return false;

                    let status = (getVal(b, ['status', 'สถานะ']) || '').toString().toLowerCase();
                    // ถ้ารถคืนแล้ว (completed) หรือถูกปฏิเสธ (rejected) ถือว่ารถว่าง
                    if (status.includes('reject') || status.includes('ปฏิเสธ') || status.includes('complete') || status.includes('คืนรถ')) return false;

                    let bStartRaw = getVal(b, ['fromdate', 'จากวันที่']);
                    let Auto_todate = getVal(b, ['todate', 'ถึงวันที่']);
                    let bEndRaw = (!Auto_todate || Auto_todate === '-') ? bStartRaw : Auto_todate;
                    
                    if (!bStartRaw || bStartRaw === '-') return false;
                    
                    const bStartYMD = toBangkokYMD(bStartRaw);
                    const bEndYMD = toBangkokYMD(bEndRaw) || bStartYMD;
                    if (!bStartYMD) return false;

                    // เช็คว่า วันที่จองใหม่ ทับซ้อนกับ วันที่จองเดิมที่ยังไม่คืนรถ หรือไม่
                    // (StartA <= EndB) และ (EndA >= StartB)
                    return (newStartYMD <= bEndYMD && newEndYMD >= bStartYMD);
                });

                if (overlapping) {
                    const existFrom = formatDateShort(getVal(overlapping, ['fromdate', 'จากวันที่']));
                    const existTo = formatDateShort(getVal(overlapping, ['todate', 'ถึงวันที่']));
                    const existUser = getVal(overlapping, ['email', 'คนจอง', 'ชื่อผู้จอง']);
                    const dateRangeText = (existFrom === existTo || existTo === '-') ? existFrom : `${existFrom} - ${existTo}`;
                    alert(`❌ ไม่สามารถจองได้!\nรถทะเบียน [ ${selectedPlate} ] มีการจองค้างอยู่แล้วในช่วงวันที่ ${dateRangeText}\nผู้จอง: ${existUser}\n\nกรุณาเลือกรถคันอื่น หรือเลือกวันเดินทางช่วงอื่นครับ`);
                    return;
                }
                // ----------------------------------------------------

                const selectedUser = userDB[reqUserSelect.value];
                const emailToSave = selectedUser ? (selectedUser['Email'] || selectedUser['Name'] || selectedUser['ชื่อ'] || '') : '';

                appState.currentPayload = {
                    action: "create",
                    bookingDatetime: (new Date()).toISOString(),
                    fromDate: dtStart.value,
                    toDate: dtEnd.value,
                    days: document.getElementById('dt-days').value,
                    email: emailToSave,
                    plate: vehPlateSelect.value,
                    purpose: document.getElementById('purpose').value,
                    destination: document.getElementById('dest').value,
                    mileageOut: document.getElementById('mileage-out').value || ""
                };
                
                document.getElementById('submit-modal').classList.remove('hidden');
            }
        });
    }

    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const submitModal = document.getElementById('submit-modal');
    
    if(modalCancel) modalCancel.addEventListener('click', () => submitModal.classList.add('hidden'));
    
    if(modalConfirm) {
        modalConfirm.addEventListener('click', async () => {
            const originalConfirmText = modalConfirm.innerHTML;
            modalConfirm.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่งคำขอ...';
            modalConfirm.disabled = true;

            const targetBtn = document.getElementById('btn-submit');
            const originalBtnText = targetBtn ? targetBtn.innerHTML : '';
            if (targetBtn) {
                targetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกข้อมูล...';
                targetBtn.disabled = true;
            }

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(appState.currentPayload),
                });
                const data = await response.json();

                if(data.status === "success") {
                    // Optimistic update: เพิ่มลง state และ localStorage ทันที ป้องกันการจองซ้ำทันที 100%
                    const nextRowIndex = (appState.bookings && appState.bookings.length > 0) 
                        ? (Math.max(...appState.bookings.map(b => parseInt(b._rowIndex) || 0)) + 1) 
                        : 2;

                    const newBookingRecord = {
                        _rowIndex: nextRowIndex,
                        "วันที่ เวลา ที่จอง": appState.currentPayload.bookingDatetime,
                        "คนจอง(Gmail)": appState.currentPayload.email,
                        "จากวันที่": appState.currentPayload.fromDate,
                        "ถึงวันที่": appState.currentPayload.toDate,
                        "จำนวนกี่วัน": appState.currentPayload.days,
                        "ไปทำอะไร": appState.currentPayload.purpose,
                        "ไปที่ไหน": appState.currentPayload.destination,
                        "ทะเบียนรถที่จอง": appState.currentPayload.plate,
                        "เลขไมล์ออก": appState.currentPayload.mileageOut || "",
                        "เลขไมล์เข้า": "",
                        "ค่าทางด่วน": "",
                        "บัตรทางด่วนคงเหลือ": "",
                        "สถานะ": "รออนุมัติ",
                        "หมายเหตุ": ""
                    };
                    appState.bookings.push(newBookingRecord);
                    try { localStorage.setItem('sis_history', JSON.stringify(appState.bookings)); } catch(e){}
                    appState.renderDashboard();
                    appState.renderTimeline();

                    submitModal.classList.add('hidden');
                    alert(`✅ ส่งคำขอจองรถสำเร็จ!\nระบบได้บันทึกข้อมูลและส่งแจ้งเตือนไปยังผู้ดูแลเรียบร้อยแล้ว`);
                    bookingForm.reset();
                    document.getElementById('user-info-card').classList.add('hidden');
                    document.getElementById('car-info-card').classList.add('hidden');
                    appState.fetchBookings(); // Sync silently in background
                } else {
                    submitModal.classList.add('hidden');
                    alert(`❌ ไม่สามารถทำการจองได้:\n${data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'}`);
                }
            } catch(err) {
                submitModal.classList.add('hidden');
                alert("❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
            } finally {
                modalConfirm.innerHTML = originalConfirmText;
                modalConfirm.disabled = false;
                if (targetBtn) {
                    targetBtn.innerHTML = originalBtnText;
                    targetBtn.disabled = false;
                }
            }
        });
    }

    // Auto-calculate Days
    const inputs = ['dt-start', 'dt-end'];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            const start = document.getElementById('dt-start').value;
            const end = document.getElementById('dt-end').value;
            if(start && end) {
                const s = new Date(start); const e = new Date(end);
                if(e >= s) {
                    const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
                    document.getElementById('dt-days').value = days + " วัน";
                } else {
                    document.getElementById('dt-days').value = "วันที่ไม่ถูกต้อง";
                }
            }
            updatePreview();
        });
    });

    ['purpose', 'dest'].forEach(id => document.getElementById(id)?.addEventListener('input', updatePreview));

    function updatePreview() {
        const uIdx = document.getElementById('req-user').value;
        if(uIdx && userDB[uIdx]) {
            document.getElementById('pv-user').textContent = userDB[uIdx]['Name'] || userDB[uIdx]['ชื่อ'] || '-';
            document.getElementById('pv-email').textContent = userDB[uIdx]['Email'] || userDB[uIdx]['อีเมล'] || '-';
        }
        
        const s = document.getElementById('dt-start').value;
        const e = document.getElementById('dt-end').value;
        document.getElementById('pv-start').textContent = s ? new Date(s).toLocaleDateString('th-TH') : '-';
        document.getElementById('pv-end').textContent = e ? new Date(e).toLocaleDateString('th-TH') : '-';
        document.getElementById('pv-days').textContent = document.getElementById('dt-days').value || '-';
        
        document.getElementById('pv-purpose').textContent = document.getElementById('purpose').value || '-';
        document.getElementById('pv-dest').textContent = document.getElementById('dest').value || '-';
        
        const p = document.getElementById('veh-plate').value;
        if(p) {
            document.getElementById('pv-plate').textContent = p;
            const c = vehicleDB.find(v => (v['ทะเบียนรถ'] || v['Plate']) === p);
            document.getElementById('pv-model').textContent = c ? (c['รุ่น'] || c['Model'] || '-') : '-';
        }
    }
});
