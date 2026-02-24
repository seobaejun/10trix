# GitHub 저장소 연동 방법

저장소: **https://github.com/seobaejun/10trix**

## 1. 준비

- **Cursor를 관리자 권한 없이** 실행한 뒤 터미널을 열거나, Windows **명령 프롬프트(cmd)** 를 엽니다.
- Git 설치 확인: `git --version`

## 2. 프로젝트 폴더로 이동

```bash
cd /d c:\bigtech
```

## 3. 한 번만 실행할 명령 (순서대로)

```bash
git init
git remote add origin https://github.com/seobaejun/10trix.git
git add .
git commit -m "Initial commit: 10trix site, admin, Firebase"
git branch -M main
git push -u origin main
```

`git push` 시 **로그인**이 필요합니다.

- **Username**: `seobaejun`
- **Password**: GitHub **Personal Access Token** (일반 비밀번호 아님)  
  - 채팅으로 주신 토큰을 비밀번호 자리에 붙여넣으면 됩니다.

## 4. 보안 권장 사항

- 토큰이 채팅에 노출되었으므로, 연동 후  
  **GitHub → Settings → Developer settings → Personal access tokens**  
  에서 해당 토큰을 **Revoke** 하고, 필요하면 새 토큰을 발급해 사용하는 것을 권장합니다.
- 이후에는 Windows용 **Git Credential Manager** 로 자동 로그인됩니다.

## 5. 이후 작업 시 (커밋 & 푸시) — **항상 둘 다 푸시**

- **origin** → `seobaejun/10trix` (메인 저장소)
- **site** → `seobaejun/10trix-site` (Vercel 자동 배포용)

```bash
cd /d c:\bigtech
git add .
git commit -m "작업 내용 요약"
git push origin main
git push site main
```

한 번에: `git push origin main; git push site main`  
→ 10trix-site에 푸시되면 Vercel이 자동 배포합니다.

`.env` 파일은 `.gitignore`에 포함되어 있어 저장소에 올라가지 않습니다.
