@echo off
echo ==========================================
echo    StockNova Development Starter
echo ==========================================
echo.
echo [1/3] Installing root dependencies...
call npm install
echo.
echo [2/3] Installing service dependencies...
echo.
echo Installing Frontend...
cd frontend
call npm install
cd ..
echo.
echo Installing Backend...
cd backend
call npm install
cd ..
echo.
echo [3/3] Starting Frontend (3333) and Backend (5000)...
npm run dev
pause
