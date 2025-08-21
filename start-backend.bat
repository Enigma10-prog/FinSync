@echo off
echo Starting Financial Advisor Backend...
echo.

cd backend

echo Installing dependencies...
npm install

echo.
echo Setting up database...
node setup.js

echo.
echo Starting backend server...
npm run dev

pause 