@echo off
echo Starting Financial Advisor Application...
echo.

echo Starting Backend...
start "Backend Server" cmd /k "cd backend && npm install && node setup.js && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "Frontend Server" cmd /k "cd project && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to open the application in your browser...
pause > nul

start http://localhost:5173

echo Application started successfully!
pause 