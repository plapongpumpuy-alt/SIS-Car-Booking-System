const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFDhxfRoLMyLQu7aQjy3eTNGFHvKhgX02Z_BeRaE2RRVZWtNRwTLIXs50JGm1ujAPICA/exec";

// จะถูกเติมข้อมูลอัตโนมัติจาก Google Sheet
let userDB = [];
let vehicleDB = [];

// App State
window.appState = {
    bookings: [],
    timelineStartDate: new Date(),
    currentPayload: null,
    
    // ดึงข้อมูลทั้งหมดในครั้งเดียว (ประวัติ, รถ, พนักงาน)
    fetchAllData: async function() {
        const tbody = document.getElementById('dash-tbody');
        if(tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-500"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3 text-brand-500 block"></i><p>กำลังเชื่อมต่อฐานข้อมูล...</p></td></tr>`;
        
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL + "?action=get_all");
            const data = await response.json();
            if (data.status === 'success') {
                this.bookings = data.history || [];
                userDB = data.users || [];
                vehicleDB = data.cars || [];
                
                this.populateDropdowns();
                this.renderDashboard();
                this.renderTimeline();
            } else {
                if(tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-red-500">ไม่สามารถโหลดข้อมูลได้: ${data.message}</td></tr>`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if(tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-red-500"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i><p>เกิดข้อผิดพลาดในการเชื่อมต่อ</p></td></tr>`;
        }
    },

    // ดึงเฉพาะประวัติ (ใช้ตอนกดปุ่มรีเฟรชใน Dashboard)
    fetchBookings: async function() {
        const tbody = document.getElementById('dash-tbody');
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL + "?action=get_history");
            const data = await response.json();
            if (data.status === 'success' && data.data) {
                this.bookings = data.data;
                this.renderDashboard();
                this.renderTimeline();
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    },

    // นำข้อมูลลง Dropdown
    populateDropdowns: function() {
        const reqUserSelect = document.getElementById('req-user');
        const vehPlateSelect = document.getElementById('veh-plate');

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
                    <div class="flex gap-1 justify-center">
                        <button onclick="approveBooking(${rowIndex})" class="px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded text-xs font-medium hover:bg-green-600 hover:text-white transition" title="อนุมัติ"><i class="fa-solid fa-check"></i> อนุมัติ</button>
                        <button onclick="openRejectModal(${rowIndex})" class="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-600 hover:text-white transition" title="ปฏิเสธ"><i class="fa-solid fa-xmark"></i> ปฏิเสธ</button>
                    </div>`;
            } else if (statusKey === 'approved') {
                statusHtml = `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">อนุมัติแล้ว</span>`;
                actionHtml = `<button onclick="window.openReturnModal('${plate}', '${mileageOut === '-' ? '' : mileageOut}', ${rowIndex})" class="px-3 py-1 bg-brand-50 text-brand-600 border border-brand-200 rounded text-xs font-medium hover:bg-brand-600 hover:text-white transition whitespace-nowrap"><i class="fa-solid fa-pen-to-square"></i> บันทึกคืนรถ</button>`;
            } else if (statusKey === 'rejected') {
                statusHtml = `
                    <div class="flex flex-col gap-1 items-start">
                        <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">ปฏิเสธแล้ว</span>
                        ${remark && remark !== '-' ? `<span class="text-[10px] text-red-500 max-w-[120px] truncate" title="${remark}">เหตุผล: ${remark}</span>` : ''}
                    </div>`;
            } else {
                statusHtml = `<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">คืนรถแล้ว</span>`;
            }

            let dateDisplay = formatDateShort(fromDate);
            if (fromDate !== toDate && toDate !== '-') dateDisplay += ` - ${formatDateShort(toDate)}`;

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-brand-50 transition border-b border-gray-50';
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
                
                let bStart = new Date(fromRaw);
                bStart.setHours(0,0,0,0);
                
                let bEnd = new Date(toRaw);
                bEnd.setHours(0,0,0,0);

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
        const d = new Date(dateString);
        if(isNaN(d)) return dateString;
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    } catch(e) {
        return dateString;
    }
}

// --- Tab Navigation ---
window.switchTab = function(tabId) {
    const tabs = ['form', 'dash', 'time'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.remove('active');
        document.getElementById(`view-${t}`).classList.add('hidden');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.getElementById(`view-${tabId}`).classList.remove('hidden');

    if(tabId === 'dash' || tabId === 'time') {
        if(appState.bookings.length === 0) appState.fetchAllData();
        else { appState.renderDashboard(); appState.renderTimeline(); }
    }
}

// --- Actions (Approve / Reject) ---
window.approveBooking = function(rowIndex) {
    if(confirm("ยืนยันการอนุมัติคำขอจองรถนี้?")) {
        submitStatusUpdate(rowIndex, "Approved", "");
    }
}

const rejectModal = document.getElementById('reject-modal');
const rejectForm = document.getElementById('modal-reject-form');
window.openRejectModal = function(rowIndex) {
    document.getElementById('reject-row-index').value = rowIndex;
    rejectModal.classList.remove('hidden');
}
window.closeRejectModal = function() {
    rejectModal.classList.add('hidden');
    rejectForm.reset();
}
if(rejectForm) {
    rejectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rIndex = document.getElementById('reject-row-index').value;
        const reason = document.getElementById('reject-reason').value;
        submitStatusUpdate(rIndex, "Rejected", reason);
        closeRejectModal();
    });
}

function submitStatusUpdate(rowIndex, newStatus, reason) {
    const booking = appState.bookings.find(b => b._rowIndex === parseInt(rowIndex));
    if(booking) {
        const keys = Object.keys(booking);
        const statusKey = keys.find(k => k.toLowerCase().includes('สถานะ'));
        const remarkKey = keys.find(k => k.toLowerCase().includes('หมายเหตุ'));
        if(statusKey) booking[statusKey] = newStatus;
        if(remarkKey && reason) booking[remarkKey] = reason;
        appState.renderDashboard();
        appState.renderTimeline();
    }

    const payload = { action: "update_status", rowIndex: rowIndex, status: newStatus, rejectReason: reason };
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
    })
    .then(r => r.json())
    .then(data => {
        if(data.status !== "success") alert(`❌ อัปเดตล้มเหลว: ${data.message}`);
    }).catch(err => {
        alert("❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลทั้งหมดทันทีที่หน้าเว็บเปิดขึ้นมา
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
        bookingForm.addEventListener('submit', (e) => {
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

                // --- ระบบป้องกันการจองซ้ำ (เช็คช่วงเวลาและสถานะรถ) ---
                const newStart = new Date(dtStart.value);
                newStart.setHours(0,0,0,0);
                const newEnd = new Date(dtEnd.value);
                newEnd.setHours(0,0,0,0);
                const selectedPlate = vehPlateSelect.value;

                const overlapping = appState.bookings.find(b => {
                    const bPlate = getVal(b, ['plate', 'ทะเบียนรถ', 'ทะเบียน']);
                    if (bPlate !== selectedPlate) return false;

                    let status = getVal(b, ['status', 'สถานะ']).toString().toLowerCase();
                    // ถ้ารถคืนแล้ว (completed) หรือถูกปฏิเสธ (rejected) ถือว่ารถว่าง
                    if (status.includes('reject') || status.includes('complete') || status.includes('คืนรถ')) return false;

                    let bStartRaw = getVal(b, ['fromdate', 'จากวันที่']);
                    let Auto_todate = getVal(b, ['todate', 'ถึงวันที่']);
                    let bEndRaw = (!Auto_todate || Auto_todate === '-') ? bStartRaw : Auto_todate;
                    
                    if (!bStartRaw || bStartRaw === '-') return false;
                    
                    let bStart = new Date(bStartRaw);
                    bStart.setHours(0,0,0,0);
                    let bEnd = new Date(bEndRaw);
                    bEnd.setHours(0,0,0,0);

                    // เช็คว่า วันที่จองใหม่ ทับซ้อนกับ วันที่จองเดิมที่ยังไม่คืนรถ หรือไม่
                    // (StartA <= EndB) และ (EndA >= StartB)
                    return (newStart <= bEnd && newEnd >= bStart);
                });

                if (overlapping) {
                    alert(`❌ ไม่สามารถจองได้!\nรถทะเบียน [ ${selectedPlate} ] มีการจองค้างอยู่หรือถูกใช้งานในช่วงวันที่คุณเลือก (และยังไม่ถูกกดคืนรถ)\n\nกรุณาเลือกรถคันอื่น หรือตรวจสอบวันที่ใหม่อีกครั้งครับ`);
                    return;
                }
                // ----------------------------------------------------

                const selectedUser = userDB[reqUserSelect.value];
                const emailToSave = selectedUser['Email'] || selectedUser['Name'] || selectedUser['ชื่อ'] || '';

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
        modalConfirm.addEventListener('click', () => {
            submitModal.classList.add('hidden');
            
            const targetBtn = document.getElementById('btn-submit');
            const originalBtnText = targetBtn.innerHTML;
            targetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกข้อมูล...';
            targetBtn.disabled = true;

            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(appState.currentPayload),
            })
            .then(r => r.json())
            .then(data => {
                if(data.status === "success") {
                    alert(`✅ ส่งคำขอจองรถสำเร็จ!\nระบบได้บันทึกข้อมูลแล้ว`);
                    bookingForm.reset();
                    document.getElementById('user-info-card').classList.add('hidden');
                    document.getElementById('car-info-card').classList.add('hidden');
                    appState.fetchBookings(); // Refresh cache quietly
                } else { alert(`❌ เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${data.message}`); }
            })
            .catch(err => alert("❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"))
            .finally(() => { targetBtn.innerHTML = originalBtnText; targetBtn.disabled = false; });
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
