const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ไฟล์ตั้งค่าอุปกรณ์ (config.json) และไฟล์เก็บประวัติการส่ง Comment (comments-history.json)
const CONFIG_FILE = path.join(__dirname, 'config.json');
const HISTORY_FILE = path.join(__dirname, 'comments-history.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ให้บริการไฟล์หน้าเว็บ Static (index.html)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * อ่านไฟล์ตั้งค่า config.json
 */
function loadConfig() {
    const defaultConfig = {
        deviceName: 'Keyence TR-W1000',
        targetIp: process.env.KEYENCE_IP || '192.168.100.145',
        timeoutMs: 5000,
        updatedAt: new Date().toISOString()
    };

    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf8');
            return defaultConfig;
        }
        const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
        return { ...defaultConfig, ...JSON.parse(raw) };
    } catch (err) {
        console.error('[Config Load Error]:', err.message);
        return defaultConfig;
    }
}

/**
 * บันทึกการตั้งค่าลงไฟล์ config.json
 */
function saveConfig(newConfig) {
    try {
        const current = loadConfig();
        const updated = {
            ...current,
            ...newConfig,
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
        return updated;
    } catch (err) {
        console.error('[Config Save Error]:', err.message);
        throw err;
    }
}

/**
 * อ่านรายการประวัติ Comment จากไฟล์ JSON
 */
function loadCommentHistory() {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('[History Load Error]:', err.message);
        return [];
    }
}

/**
 * บันทึกรายการประวัติ Comment ลงไฟล์ JSON
 */
function saveCommentHistory(list) {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
        console.error('[History Save Error]:', err.message);
    }
}

/**
 * แปลงข้อความเป็นรหัส ASCII/Unicode (Decimal) คั่นด้วยลูกน้ำ (,)
 * เช่น "ABC" -> "65,66,67"
 */
function convertToAsciiCommaSeparated(text) {
    return Array.from(text)
        .map(char => char.charCodeAt(0))
        .join(',');
}

/**
 * สร้างสตริงเวลาปัจจุบันตามรูปแบบที่เลือก
 */
function formatEmbeddedTimestamp(format = 'HH:mm') {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    switch (format) {
        case 'HH:mm:ss':
            return `${hh}:${min}:${ss}`;
        case 'DD/MM HH:mm':
            return `${dd}/${mm} ${hh}:${min}`;
        case 'YYYY/MM/DD HH:mm:ss':
            return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
        case 'HH:mm':
        default:
            return `${hh}:${min}`;
    }
}

const dgram = require('dgram');

// แคช Session ล่าสุดของแต่ละ IP เพื่อลดการเปิด Session ใหม่ซ้ำซ้อน
const sessionCache = new Map();

/**
 * ดึงชื่อเครื่องจริง (NetBIOS Machine Name & MAC Address) จากเครื่อง Keyence TR-W1000 ผ่าน UDP Port 137
 */
function queryNetBiosName(ip, timeoutMs = 1200) {
    return new Promise((resolve) => {
        const socket = dgram.createSocket('udp4');
        let done = false;
        const finish = (val) => {
            if (!done) {
                done = true;
                try { socket.close(); } catch (e) {}
                resolve(val);
            }
        };

        const timer = setTimeout(() => finish(null), timeoutMs);

        // NetBIOS Node Status Request Packet (ค้นหาชื่อเครื่อง *)
        const packet = Buffer.from([
            0x80, 0x94, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x20, 0x43, 0x4b, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41,
            0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41,
            0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x00,
            0x00, 0x21, 0x00, 0x01
        ]);

        socket.on('message', (msg) => {
            clearTimeout(timer);
            try {
                if (msg.length > 57) {
                    const numNames = msg[56];
                    if (numNames > 0 && msg.length >= 57 + 18) {
                        const rawName = msg.slice(57, 57 + 15).toString('ascii').trim();
                        const macOffset = 57 + numNames * 18;
                        let mac = '';
                        if (msg.length >= macOffset + 6) {
                            mac = Array.from(msg.slice(macOffset, macOffset + 6))
                                .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                                .join('-');
                        }
                        return finish({ netbiosName: rawName, macAddress: mac });
                    }
                }
            } catch (e) {}
            finish(null);
        });

        socket.on('error', () => {
            clearTimeout(timer);
            finish(null);
        });

        socket.send(packet, 0, packet.length, 137, ip);
    });
}

/**
 * ขอ Session Cookie (AdminCode, LCDCode) และดึงชื่อเครื่องจริงจาก Keyence TR-W1000
 * ใช้ Session เดิมต่อเนื่องเหมือนการทำงานของ Frameset (index.asp -> main.asp + side.asp)
 * และจะขอ Session ใหม่เฉพาะเมื่อเริ่มต้นหรือเมื่อ Session เดิมหมดอายุ (302 / cd=401)
 */
async function getKeyenceSession(host, timeoutMs = 5000, forceRefresh = false) {
    const cached = sessionCache.get(host);
    if (!forceRefresh && cached) {
        return cached;
    }

    const res = await axios.get(`http://${host}/`, {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400,
        timeout: timeoutMs
    });

    const setCookies = res.headers['set-cookie'] || [];
    const cookieHeader = setCookies.map(c => c.split(';')[0]).join('; ');

    let adminCode = '';
    for (const c of setCookies) {
        const match = c.match(/AdminCode=([^;]+)/);
        if (match) {
            adminCode = match[1];
            break;
        }
    }

    if (!adminCode) {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        adminCode = `${String(now.getFullYear()).slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    }

    const finalCookie = cookieHeader || `AdminCode=${adminCode}; LCDCode=1`;
    const serverHeader = res.headers['server'] || 'TR-series';

    // เปิด index.asp และ side.asp ครั้งแรกเพื่อให้เครื่องเตรียมพร้อมรับคำสั่งใน Session นี้เหมือนเบราว์เซอร์จริง
    let htmlTitle = '';
    try {
        const idxRes = await axios.get(`http://${host}/index.asp`, {
            headers: { Cookie: finalCookie },
            timeout: 3000
        });
        const tMatch = String(idxRes.data).match(/<TITLE>([^<]+)<\/TITLE>/i);
        if (tMatch) htmlTitle = tMatch[1].trim();

        await axios.get(`http://${host}/side.asp?dt=${adminCode}`, {
            headers: { Cookie: finalCookie, Referer: `http://${host}/index.asp` },
            timeout: 3000
        });
    } catch (e) {}

    const nbInfo = await queryNetBiosName(host);
    const machineName = (nbInfo && nbInfo.netbiosName) ? nbInfo.netbiosName : (htmlTitle || 'TR');
    const macAddress = (nbInfo && nbInfo.macAddress) ? nbInfo.macAddress : '';
    const detectedDeviceName = macAddress
        ? `${machineName} (${serverHeader} | MAC: ${macAddress})`
        : `${machineName} (${serverHeader})`;

    // อัปเดตชื่อเครื่องที่อ่านได้ลงใน config.json อัตโนมัติ (Read-only from Recorder)
    saveConfig({ deviceName: detectedDeviceName });

    const sessionObj = {
        adminCode,
        cookieHeader: finalCookie,
        serverHeader,
        machineName,
        macAddress,
        deviceName: detectedDeviceName,
        createdAt: Date.now()
    };
    sessionCache.set(host, sessionObj);
    return sessionObj;
}

/**
 * API Endpoint: GET /api/config
 * อ่านค่า IP และการตั้งค่าปัจจุบันจาก config.json
 */
app.get('/api/config', (req, res) => {
    const config = loadConfig();
    return res.json({
        success: true,
        config
    });
});

/**
 * API Endpoint: POST /api/config
 * บันทึก/เปลี่ยนเฉพาะ IP ของเครื่อง Keyence TR-W1000 ลงไฟล์ config.json แล้วดึงชื่อเครื่องจาก Recorder อัตโนมัติ
 */
app.post('/api/config', async (req, res) => {
    try {
        const { targetIp, timeoutMs } = req.body;

        if (!targetIp || typeof targetIp !== 'string' || targetIp.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'กรุณาระบุ IP Address ของเครื่อง Recorder'
            });
        }

        const cleanIp = targetIp.trim();
        let updatedConfig = saveConfig({
            targetIp: cleanIp,
            timeoutMs: Number(timeoutMs) || 5000
        });

        // ทดสอบเชื่อมต่อกับ IP ที่ตั้งใหม่ทันที พร้อมอ่านชื่อเครื่องจาก Recorder
        const startTime = Date.now();
        let online = false;
        let sessionCode = '';
        let statusMessage = '';

        try {
            const session = await getKeyenceSession(cleanIp, updatedConfig.timeoutMs, true);
            online = true;
            sessionCode = session.adminCode;
            updatedConfig = loadConfig();
            statusMessage = `เชื่อมต่อและอ่านชื่อเครื่องสำเร็จ (${Date.now() - startTime} ms)`;
        } catch (connErr) {
            online = false;
            statusMessage = `บันทึก IP แล้ว แต่ยังไม่สามารถเชื่อมต่อกับ ${cleanIp} ได้ (${connErr.message})`;
        }

        return res.json({
            success: true,
            message: 'บันทึก IP ลงไฟล์ config.json เรียบร้อยแล้ว',
            config: updatedConfig,
            connection: {
                online,
                latencyMs: Date.now() - startTime,
                sessionCode,
                statusMessage
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'ไม่สามารถบันทึกไฟล์ config.json ได้',
            details: err.message
        });
    }
});

/**
 * API Endpoint: GET /api/status
 * ตรวจสอบสถานะการเชื่อมต่อและดึงชื่อเครื่องจากอุปกรณ์ Keyence TR-W1000 แบบ Real-time
 */
app.get('/api/status', async (req, res) => {
    const config = loadConfig();
    const host = (req.query.ip && req.query.ip.trim() !== '') ? req.query.ip.trim() : config.targetIp;
    const startTime = Date.now();

    try {
        const session = await getKeyenceSession(host, config.timeoutMs || 4000);
        const latencyMs = Date.now() - startTime;

        return res.json({
            success: true,
            online: true,
            targetIp: host,
            deviceName: session.deviceName,
            machineName: session.machineName,
            macAddress: session.macAddress,
            serverHeader: session.serverHeader,
            sessionCode: session.adminCode,
            latencyMs,
            checkedAt: new Date().toISOString()
        });
    } catch (error) {
        return res.json({
            success: true,
            online: false,
            targetIp: host,
            deviceName: 'ไม่สามารถดึงชื่อเครื่องได้ (ออฟไลน์)',
            latencyMs: Date.now() - startTime,
            error: error.code === 'ECONNABORTED' ? 'Timeout' : error.message,
            checkedAt: new Date().toISOString()
        });
    }
});

/**
 * API Endpoint: GET /api/screen-image
 * ดึงภาพหน้าจอสด (Live Screen 640x480 PNG) จาก http://[IP]/png.asp
 * หมายเหตุ: เครื่อง Keyence TR-W1000 บังคับให้เรียก main.asp?dt=[AdminCode] ก่อน
 * เพื่อให้ตัวเครื่องสร้างไฟล์ภาพหน้าจอลง Buffer มิฉะนั้น png.asp จะคืนค่า 404
 */
app.get('/api/screen-image', async (req, res) => {
    try {
        const config = loadConfig();
        const host = req.query.ip || config.targetIp;
        let { adminCode, cookieHeader } = await getKeyenceSession(host, config.timeoutMs);

        // 1. เรียก main.asp เพื่อสั่งให้เครื่องเรนเดอร์ภาพหน้าจอลง Buffer พร้อมดึง dt ของรูปภาพ
        const mainRes = await axios.get(`http://${host}/main.asp?dt=${adminCode}`, {
            headers: {
                'Cookie': cookieHeader,
                'Referer': `http://${host}/index.asp`
            },
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400,
            timeout: 6000
        });

        // กรณี Session หมดอายุ (ถูก Redirect ไป 401) ให้ขอ Session ใหม่ทันที
        if (mainRes.status === 302 || (typeof mainRes.data === 'string' && mainRes.data.includes('cd=401'))) {
            const refreshed = await getKeyenceSession(host, config.timeoutMs, true);
            adminCode = refreshed.adminCode;
            cookieHeader = refreshed.cookieHeader;
            await axios.get(`http://${host}/main.asp?dt=${adminCode}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'Referer': `http://${host}/index.asp`
                },
                timeout: 6000
            });
        }

        // 2. ดึงภาพ PNG จาก png.asp
        const imgRes = await axios.get(`http://${host}/png.asp?dt=${adminCode}`, {
            headers: {
                'Cookie': cookieHeader,
                'Referer': `http://${host}/main.asp?dt=${adminCode}`
            },
            responseType: 'arraybuffer',
            timeout: 8000
        });

        res.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return res.send(Buffer.from(imgRes.data));
    } catch (error) {
        console.error('[Screen Image Error]:', error.message);
        return res.status(500).json({
            success: false,
            error: 'ไม่สามารถดึงภาพหน้าจอจากเครื่อง Keyence TR-W1000 ได้'
        });
    }
});

/**
 * API Endpoint: POST /api/screen-click
 * จำลองการแตะหน้าจอสัมผัส (Remote Touch) บนเครื่อง Keyence TR-W1000 ด้วยพิกัด X, Y
 */
app.post('/api/screen-click', async (req, res) => {
    try {
        const config = loadConfig();
        const { x, y, targetIp } = req.body;
        const host = targetIp && targetIp.trim() !== '' ? targetIp.trim() : config.targetIp;
        const { adminCode, cookieHeader } = await getKeyenceSession(host, config.timeoutMs);

        const clickX = Math.max(0, Math.min(640, Math.round(Number(x) || 0)));
        const clickY = Math.max(0, Math.min(480, Math.round(Number(y) || 0)));

        await axios.get(`http://${host}/main.asp?dt=${adminCode}`, {
            headers: {
                'Cookie': `${cookieHeader}; CAxX=${clickX}; CAxY=${clickY}`,
                'Referer': `http://${host}/main.asp?dt=${adminCode}`
            },
            timeout: 8000
        });

        return res.json({
            success: true,
            x: clickX,
            y: clickY
        });
    } catch (error) {
        console.error('[Screen Click Error]:', error.message);
        return res.status(500).json({
            success: false,
            error: 'ไม่สามารถส่งคำสั่งคลิกหน้าจอได้'
        });
    }
});

/**
 * API Endpoint: GET /api/comments
 * ดึงรายการ Comment ทั้งหมดที่เคยบันทึกไว้
 */
app.get('/api/comments', (req, res) => {
    const history = loadCommentHistory();
    const activeEntry = history.length > 0 ? history[0] : null;
    const currentActiveComment = activeEntry && !activeEntry.isClear ? activeEntry.txtMsg : '';

    return res.json({
        success: true,
        currentActiveComment,
        total: history.length,
        items: history
    });
});

/**
 * API Endpoint: DELETE /api/comments/:id
 * ลบรายการออกจากตารางประวัติ (หรือล้างประวัติทั้งหมดหาก id === 'all')
 */
app.delete('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'all') {
        saveCommentHistory([]);
        return res.json({
            success: true,
            message: 'ล้างประวัติรายการ Comment ทั้งหมดเรียบร้อยแล้ว'
        });
    }

    const history = loadCommentHistory();
    const filtered = history.filter(item => item.id !== id);
    saveCommentHistory(filtered);

    return res.json({
        success: true,
        message: 'ลบรายการออกจากตารางเรียบร้อยแล้ว'
    });
});

/**
 * API Endpoint: POST /api/send-comment
 */
app.post('/api/send-comment', async (req, res) => {
    try {
        const config = loadConfig();
        const {
            message,
            targetIp,
            isClear,
            embedTime = true,
            timeFormat = 'HH:mm',
            timePosition = 'suffix'
        } = req.body;

        const rawMessage = isClear ? '' : (typeof message === 'string' ? message.trim() : '');

        if (!isClear && rawMessage === '') {
            return res.status(400).json({
                success: false,
                error: 'กรุณาระบุข้อความ (message) ที่ต้องการส่ง'
            });
        }

        // ประกอบข้อความพร้อมฝังเวลา (กรณีเปิดใช้งาน embedTime)
        let finalMessage = rawMessage;
        let embeddedTimeStr = '';

        if (!isClear && embedTime) {
            embeddedTimeStr = formatEmbeddedTimestamp(timeFormat);
            if (timePosition === 'prefix') {
                finalMessage = `${embeddedTimeStr} ${rawMessage}`;
            } else {
                finalMessage = `${rawMessage} ${embeddedTimeStr}`;
            }
        }

        if (finalMessage.length > 32) {
            return res.status(400).json({
                success: false,
                error: `ข้อความรวมเวลา (${finalMessage.length} ตัวอักษร) เกิน 32 ตัวอักษร กรุณาย่อข้อความหรือเลือกรูปแบบเวลาที่สั้นลง`
            });
        }

        // 1. แปลงข้อความเป็นรหัส ASCII คั่นด้วยลูกน้ำ เก็บในตัวแปร UniComm
        const UniComm = convertToAsciiCommaSeparated(finalMessage);

        const host = targetIp && targetIp.trim() !== '' ? targetIp.trim() : config.targetIp;

        // 2. ใช้ Session ปัจจุบันจากเครื่อง Keyence TR-W1000 (หากหมดอายุค่อยขอใหม่แล้วส่งซ้ำอัตโนมัติ)
        let { adminCode, cookieHeader } = await getKeyenceSession(host, config.timeoutMs, false);
        let targetUrl = `http://${host}/side.asp?dt=${adminCode}`;

        // 3. เตรียม Payload แบบ application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('CommFlg', 'true');
        formData.append('cmbReload', '0');
        formData.append('txtMsg', finalMessage);
        formData.append('UniComm', UniComm);

        console.log(`[Keyence TR-W1000] Sending to ${targetUrl}`);
        console.log(`[Session Cookie] ${cookieHeader}`);
        console.log(`[Payload] txtMsg="${finalMessage}" | UniComm="${UniComm}"`);

        // 4. ยิง HTTP POST ไปที่ Keyence TR-W1000 พร้อมแนบ Session Cookie
        let response = await axios.post(targetUrl, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookieHeader,
                'Referer': targetUrl
            },
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400,
            timeout: 8000
        });

        let responseHtml = typeof response.data === 'string' ? response.data : '';
        if (response.status === 302 || responseHtml.includes('cd=401') || (response.headers.location && response.headers.location.includes('cd=401'))) {
            const refreshed = await getKeyenceSession(host, config.timeoutMs, true);
            adminCode = refreshed.adminCode;
            cookieHeader = refreshed.cookieHeader;
            targetUrl = `http://${host}/side.asp?dt=${adminCode}`;
            response = await axios.post(targetUrl, formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookieHeader,
                    'Referer': targetUrl
                },
                maxRedirects: 0,
                validateStatus: status => status >= 200 && status < 400,
                timeout: 8000
            });
            responseHtml = typeof response.data === 'string' ? response.data : '';
        }

        // จำลองการทำงานของฟังก์ชัน CommentComplete(adminCode) ใน func.js เพื่อสั่งอัปเดตหน้าจอหลักของเครื่องทันที
        try {
            await axios.get(`http://${host}/main.asp?dt=${adminCode}`, {
                headers: {
                    'Cookie': `${cookieHeader}; CAxX=; CAxY=`,
                    'Referer': targetUrl
                },
                timeout: 5000
            });
        } catch (e) {}

        // ดึงค่า RetCode และ UniComm ที่เครื่อง Keyence สะท้อนกลับมาในหน้า side.asp
        const retMatch = responseHtml.match(/name="RetCode"\s+value="([^"]*)"/);
        const retCode = retMatch ? retMatch[1] : 'OK';
        const echoedUniMatch = responseHtml.match(/name="UniComm"\s+value="([^"]*)"/);
        const echoedUniComm = echoedUniMatch ? echoedUniMatch[1] : UniComm;

        // 5. บันทึกลงตารางประวัติ Comment (comments-history.json)
        const history = loadCommentHistory();
        const newEntry = {
            id: `CMT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            sessionCode: adminCode,
            deviceName: config.deviceName || 'Keyence TR-W1000',
            targetIp: host,
            isClear: !!isClear,
            rawMessage,
            embeddedTime: embeddedTimeStr,
            txtMsg: finalMessage,
            UniComm: echoedUniComm,
            retCode
        };
        history.unshift(newEntry);
        saveCommentHistory(history);

        return res.status(200).json({
            success: true,
            message: 'ส่ง Comment พร้อมฝังเวลาไปยัง Keyence TR-W1000 สำเร็จ',
            data: {
                ...newEntry,
                targetUrl,
                statusCode: response.status
            }
        });
    } catch (error) {
        console.error('[Keyence Error]:', error.message);

        let errorMessage = 'ไม่สามารถเชื่อมต่อกับเครื่อง Keyence TR-W1000 ได้';
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'หมดเวลาการเชื่อมต่อ (Connection Timeout) กรุณาตรวจสอบ IP หรือสาย LAN';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'การเชื่อมต่อถูกปฏิเสธ (Connection Refused) จากเครื่องปลายทาง';
        } else if (error.response) {
            errorMessage = `เครื่องตอบกลับด้วยสถานะ HTTP ${error.response.status}`;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return res.status(500).json({
            success: false,
            error: errorMessage,
            details: error.message
        });
    }
});

// Route หน้าหลัก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const os = require('os');

function getLocalLanIps() {
    const nets = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ips.push(net.address);
            }
        }
    }
    return ips;
}

app.listen(PORT, '0.0.0.0', () => {
    const cfg = loadConfig();
    const lanIps = getLocalLanIps();
    console.log(`====================================================`);
    console.log(`🚀 Keyence TR-W1000 Server running!`);
    console.log(`💻 เปิดจากเครื่องนี้ (Local):   http://localhost:${PORT}`);
    lanIps.forEach(ip => {
        console.log(`🌐 เปิดจากเครื่องอื่นในวง LAN: http://${ip}:${PORT}`);
    });
    console.log(`📡 Target Recorder IP:        http://${cfg.targetIp}/side.asp`);
    console.log(`====================================================`);
});
