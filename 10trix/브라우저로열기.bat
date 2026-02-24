@echo off
chcp 65001 >nul
echo 브라우저에서 10trix 페이지를 엽니다.
echo (먼저 start-server.bat 으로 서버를 실행해 두세요.)
echo.
start "" "http://127.0.0.1:8000/10trix/"
timeout /t 2 >nul
