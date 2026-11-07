@echo off
title GYMVERSE - 3D Fitness Universe Server
echo ========================================================
echo   GYMVERSE - 3D FITNESS UNIVERSE SERVER
echo ========================================================
echo.
echo Starting Next.js server on 0.0.0.0:3000...
echo.
cd /d "%~dp0"
"C:\Users\Abhishek shelke\AppData\Local\ms-playwright-go\1.57.0\node.exe" "node_modules\next\dist\bin\next" dev -H 0.0.0.0 -p 3000
pause
