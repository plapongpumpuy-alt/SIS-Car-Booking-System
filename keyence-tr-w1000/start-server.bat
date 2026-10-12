@echo off
chcp 65001 >nul
title Keyence TR-W1000 Comment Sender Server
cd /d "%~dp0"

echo ========================================================
echo   Keyence TR-W1000 Comment Sender - Starting Server...
echo ========================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ไม่พบโปรแกรม Node.js ในเครื่องนี้!
    echo กรุณาติดตั้ง Node.js ^(LTS^) จาก https://nodejs.org ก่อนใช้งาน
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] กำลังติดตั้ง Package ที่จำเป็นครั้งแรก ^(npm install^)...
    call npm install
)

echo [INFO] กำลังเปิดหน้าเว็บ http://localhost:3000 ...
start "" http://localhost:3000

node server.js
pause
