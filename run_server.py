#!/usr/bin/env python3
"""
포트 8000 정리 후 HTTP 서버 실행 (10trix 등 로컬 페이지용)
실행: python run_server.py
"""
import os
import subprocess
import sys
import time

PORT = 8000
HOST = "127.0.0.1"


def kill_process_on_port(port: int) -> None:
    """Windows: 포트를 사용 중인 프로세스 종료"""
    try:
        result = subprocess.run(
            ["netstat", "-ano"],
            capture_output=True,
            text=True,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0) if sys.platform == "win32" else 0,
        )
        if result.returncode != 0:
            return
        for line in result.stdout.splitlines():
            if f":{port}" in line and "LISTENING" in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    if pid.isdigit():
                        subprocess.run(
                            ["taskkill", "/F", "/PID", pid],
                            capture_output=True,
                            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0) if sys.platform == "win32" else 0,
                        )
                        print(f"  포트 {port} 사용 중이던 PID {pid} 종료됨")
    except Exception as e:
        print(f"  포트 정리 중 오류 (무시하고 진행): {e}")


def main() -> None:
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 50)
    print("  개발 서버 (포트 8000)")
    print("=" * 50)
    print()

    print("[1] 포트 8000 정리 중...")
    kill_process_on_port(PORT)
    time.sleep(1.5)
    print()

    print(f"[2] 서버 시작: http://{HOST}:{PORT}/")
    print(f"    10trix 페이지: http://{HOST}:{PORT}/10trix/")
    print()
    print("  종료하려면 Ctrl+C 를 누르세요.")
    print("-" * 50)

    try:
        import http.server
        import socketserver

        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer((HOST, PORT), handler) as httpd:
            httpd.serve_forever()
    except OSError as e:
        if "10048" in str(e) or "Address already in use" in str(e):
            print(f"\n[오류] 포트 {PORT} 이(가) 아직 사용 중입니다.")
            print("       다른 터미널/프로그램에서 포트를 쓰는지 확인 후 다시 실행하세요.")
        else:
            print(f"\n[오류] {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")


if __name__ == "__main__":
    main()
