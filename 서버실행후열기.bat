@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   개발 서버 (포트 8000) + 브라우저 열기
echo ========================================
echo.
echo 3초 후 브라우저가 자동으로 열립니다. 이 창은 닫지 마세요.
echo.
start /min cmd /c "timeout /t 3 /nobreak >nul && start http://127.0.0.1:8000/10trix/"

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
echo        https://www.python.org/downloads/ 에서 설치 후 "Add to PATH" 체크.
:done
pause
