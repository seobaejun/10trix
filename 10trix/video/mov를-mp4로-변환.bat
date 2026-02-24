@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "MOV=Bitcoin Mining Blue 2.mov"
set "MP4=Bitcoin-Mining-Blue-2.mp4"

if not exist "%MOV%" (
    echo [오류] "%MOV%" 파일이 이 폴더에 없습니다.
    echo.
    echo 이 폴더에 동영상 파일을 넣은 뒤 다시 실행하세요.
    echo 폴더: %CD%
    pause
    exit /b 1
)

where ffmpeg >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] ffmpeg 가 설치되어 있지 않습니다.
    echo.
    echo 1. https://www.gyan.dev/ffmpeg/builds/ 에서 ffmpeg-release-essentials.zip 다운로드
    echo 2. 압축 해제 후 bin 폴더 안의 ffmpeg.exe 를 이 폴더에 복사
    echo    또는 Windows PATH 에 ffmpeg 추가
    echo.
    pause
    exit /b 1
)

echo "%MOV%" 를 "%MP4%" 로 변환 중...
echo.
ffmpeg -y -i "%MOV%" -c:v libx264 -c:a aac -movflags +faststart "%MP4%"

if %errorlevel% equ 0 (
    echo.
    echo 변환 완료: %MP4%
) else (
    echo.
    echo 변환 실패. ffmpeg 오류를 확인하세요.
)
echo.
pause
