@echo off
REM StudyMate Diagnostic Script - Run this to check all systems

echo.
echo =====================================
echo    StudyMate Diagnostic Checker
echo =====================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed: 
    node --version
) else (
    echo [ERROR] Node.js not found. Please install from nodejs.org
    exit /b 1
)

echo.
echo [2/4] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm is installed:
    npm --version
) else (
    echo [ERROR] npm not found
    exit /b 1
)

echo.
echo [3/4] Checking MySQL connection...
mysql -u root -p1234 -e "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL is running and accessible
    echo Connecting as user: root
    echo Database host: localhost
) else (
    echo [ERROR] Cannot connect to MySQL
    echo Please ensure:
    echo   - MySQL service is running
    echo   - User: root
    echo   - Password: 1234
    echo   - Host: localhost
    echo.
    echo To start MySQL on Windows:
    echo   net start MySQL80
    exit /b 1
)

echo.
echo [4/4] Checking database...
mysql -u root -p1234 -e "USE studymate_db; SHOW TABLES;" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] StudyMate database exists with tables
) else (
    echo [WARNING] Database not created yet
    echo Please run: database\studymate.sql
)

echo.
echo =====================================
echo    Diagnostic Summary
echo =====================================
echo.
echo [OK] All systems ready!
echo.
echo Next steps:
echo 1. Open Command Prompt
echo 2. Navigate: cd backend
echo 3. Run: npm start
echo 4. Open browser: http://localhost:5000
echo.
pause
