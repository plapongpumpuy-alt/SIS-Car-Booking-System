const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const LICENSE_MASTER_SECRET = 'SIS_KEYENCE_TRW1000_MASTER_SECRET_2026_#9981';

function generateActivationKey(machineId) {
    const cleanId = String(machineId || '').trim().toUpperCase();
    const hex = crypto
        .createHash('sha256')
        .update(`${LICENSE_MASTER_SECRET}::${cleanId}::V1_PERMANENT`)
        .digest('hex')
        .toUpperCase();
    return `ACTV-${hex.slice(0, 4)}-${hex.slice(8, 12)}-${hex.slice(16, 20)}-${hex.slice(24, 28)}`;
}

const inputMachineId = process.argv[2];
const licensedTo = process.argv[3] || 'Authorized Station';

if (!inputMachineId) {
    console.log('Usage: node generate-key.js <MACHINE_ID> [STATION_NAME]');
    console.log('Example: node generate-key.js KTRW-44EC-7DB5-924D "Line 1 PC"');
    process.exit(1);
}

const cleanId = inputMachineId.trim().toUpperCase();
const activationKey = generateActivationKey(cleanId);

const licensePayload = {
    machineId: cleanId,
    activationKey,
    licensedTo,
    activatedAt: new Date().toISOString()
};

const outPath = path.join(__dirname, 'license.json');
fs.writeFileSync(outPath, JSON.stringify(licensePayload, null, 2), 'utf8');

console.log('====================================================');
console.log('🔑 KEYENCE TR-W1000 ACTIVATION KEY GENERATOR');
console.log('====================================================');
console.log(`Machine ID     : ${cleanId}`);
console.log(`Licensed To    : ${licensedTo}`);
console.log(`Activation Key : ${activationKey}`);
console.log(`Saved File     : ${outPath}`);
console.log('====================================================');
