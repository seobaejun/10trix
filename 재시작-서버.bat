@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   포트 8000 정리 후 서버 재시작
echo ========================================
echo.

echo [1] 포트 8000 사용 중인 프로세스 종료 중...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo       PID %%a 종료됨
)
echo       완료.
echo.

echo [2] 2초 대기 (포트 해제 대기)...
timeout /t 2 /nobreak >nul
echo.

echo [3] 개발 서버 시작 (포트 8000)...
echo     이 창을 닫으면 서버가 종료됩니다.
echo     브라우저: http://127.0.0.1:8000/10trix/
echo.

where py >nul 2>&1
if %errorlevel% equ 0 (
    py -m http.server 8000 --bind 127.0.0.1
    goto :done
)
where python >nul 2>&1
if %errorlevel% equ 0 (
    python -m http.server 8000 --bind 127.0.0.1
    goto :done
)

echo [오류] Python을 찾을 수 없습니다.
:done
pause
