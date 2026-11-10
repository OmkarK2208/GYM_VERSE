@echo off
title GYMVERSE - 3D Fitness Universe Server
echo ========================================================
echo   GYMVERSE - 3D FITNESS UNIVERSE (24/7 Production Server)
echo ========================================================
echo.
cd /d "%~dp0"
echo [1/2] Starting Production Next.js server on port 3000...
start /b "" "C:\Users\Abhishek shelke\AppData\Local\ms-playwright-go\1.57.0\node.exe" "node_modules\next\dist\bin\next" start -H 0.0.0.0 -p 3000
timeout /t 3 /nobreak >nul
echo [2/2] Launching Cloudflare Global Public Tunnel...
echo.
echo ========================================================
echo Look for your public URL below (https://...trycloudflare.com)
echo This URL can be opened on ANY phone, PC, or Wi-Fi network!
echo ========================================================
echo.
"cloudflared.exe" tunnel --url http://127.0.0.1:3000
pause
