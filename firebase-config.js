/**
 * 같은 Firebase 프로젝트를 여러 사이트에서 공유할 때 사용하는 설정.
 * 다른 사이트와 동일한 프로젝트 값(apiKey, projectId 등)을 그대로 넣으면 됩니다.
 *
 * 사이트별 데이터 구분:
 * - Auth: 한 프로젝트에서 공통 (나중에 사이트 간 로그인 연동 가능)
 * - Firestore: sites/{siteId}/users, sites/{siteId}/forms 등으로 사이트별 저장
 *   - 10trix → siteId '10trix'
 *   - 다른 사이트 → 각자 siteId 사용
 *
 * Firestore 규칙 예시는 firestore-rules-example.txt 참고.
 */
(function() {
    'use strict';
    window.FIREBASE_CONFIG = {
        apiKey: "AIzaSyBGQdEiVOl_49oVfb8TPWkc47uaFxV55Xg",
        authDomain: "shopping-31dce.firebaseapp.com",
        projectId: "shopping-31dce",
        storageBucket: "shopping-31dce.firebasestorage.app",
        messagingSenderId: "344605730776",
        appId: "1:344605730776:web:925f9d6206b1ff2e0374ad",
        measurementId: "G-B7V6HK8Z7X"
    };
})();
