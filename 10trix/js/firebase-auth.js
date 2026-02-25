/**
 * 10trix 전용 Firebase Auth + Firestore 연동
 * 같은 프로젝트를 쓰고, 사이트별 데이터는 Firestore sites/{siteId}/users 에 저장
 */
(function() {
    'use strict';

    var SITE_ID = '10trix';
    var config = typeof window.FIREBASE_CONFIG !== 'undefined' ? window.FIREBASE_CONFIG : null;
    var isConfigValid = config && config.apiKey && config.apiKey.indexOf('YOUR_') !== 0;

    if (!isConfigValid) {
        return;
    }

    var auth = null;
    var db = null;

    try {
        firebase.initializeApp(config);
        auth = firebase.auth();
        db = firebase.firestore();
    } catch (e) {
        console.warn('Firebase init failed', e);
        return;
    }

    function usersRef() {
        return db.collection('sites').doc(SITE_ID).collection('users');
    }

    function formsRef() {
        return db.collection('sites').doc(SITE_ID).collection('forms');
    }

    function updateHeaderUI(user) {
        var link = document.getElementById('header-auth-link');
        if (link) link.textContent = user ? '로그아웃' : '로그인';
        var signupLi = document.getElementById('header-signup-li');
        if (signupLi) signupLi.style.display = user ? 'none' : '';
        var mobileLink = document.getElementById('mobile-auth-link');
        if (mobileLink) mobileLink.textContent = user ? '로그아웃' : '로그인';
        var mobileSignupLi = document.getElementById('mobile-signup-li');
        if (mobileSignupLi) mobileSignupLi.style.display = user ? 'none' : '';
    }

    auth.onAuthStateChanged(function(user) {
        updateHeaderUI(user);
    });

    var link = document.getElementById('header-auth-link');
    var mobileAuthLink = document.getElementById('mobile-auth-link');
    var loginModalEl = document.getElementById('loginModal');

    function handleAuthClick(e) {
        e.preventDefault();
        if (auth.currentUser) {
            auth.signOut().then(function() {
                updateHeaderUI(null);
            }).catch(function(err) {
                alert('로그아웃 중 오류: ' + (err.message || err));
            });
        } else {
            if (typeof bootstrap !== 'undefined' && loginModalEl) {
                bootstrap.Modal.getOrCreateInstance(loginModalEl).show();
            }
        }
    }
    if (link) link.addEventListener('click', handleAuthClick);
    if (mobileAuthLink) mobileAuthLink.addEventListener('click', handleAuthClick);

    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('login-email').value.trim();
            var password = document.getElementById('login-password').value;
            if (!email || !password) return;

            var btn = loginForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.textContent = '로그인 중...';
            }
            auth.signInWithEmailAndPassword(email, password)
                .then(function() {
                    if (loginModalEl && typeof bootstrap !== 'undefined') {
                        bootstrap.Modal.getInstance(loginModalEl).hide();
                    }
                    loginForm.reset();
                })
                .catch(function(err) {
                    var msg = err.code === 'auth/user-not-found' ? '등록되지 않은 이메일입니다.' :
                              err.code === 'auth/wrong-password' ? '비밀번호가 올바르지 않습니다.' :
                              err.code === 'auth/invalid-email' ? '이메일 형식을 확인해 주세요.' :
                              err.message || '로그인에 실패했습니다.';
                    alert(msg);
                })
                .finally(function() {
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = '로그인';
                    }
                });
        });
    }

    var signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('signup-name').value.trim();
            var email = document.getElementById('signup-email').value.trim();
            var password = document.getElementById('signup-password').value;
            var pwConfirm = document.getElementById('signup-password-confirm').value;
            var typeNew = document.getElementById('signup-type-new') && document.getElementById('signup-type-new').checked;
            var signupType = typeNew ? 'new' : '10shopping';

            if (password !== pwConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            if (password.length < 8) {
                alert('비밀번호는 8자 이상이어야 합니다.');
                return;
            }
            var integratedChecked = document.getElementById('signup-integrated') && document.getElementById('signup-integrated').checked;
            if (signupType === '10shopping' && !integratedChecked) {
                alert('10쇼핑 가입회원은 "10쇼핑과 통합회원 동의"에 체크해 주세요.');
                return;
            }
            var walletEl = document.getElementById('signup-wallet-address');
            var walletConfirmEl = document.getElementById('signup-wallet-address-confirm');
            var walletAddress = walletEl && walletEl.value ? walletEl.value.trim() : '';
            var walletConfirm = walletConfirmEl && walletConfirmEl.value ? walletConfirmEl.value.trim() : '';
            if (walletAddress || walletConfirm) {
                if (walletAddress !== walletConfirm) {
                    alert('코인지갑 주소가 일치하지 않습니다.');
                    return;
                }
            }
            var walletToSave = walletAddress || null;

            var btn = signupForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.textContent = '가입 중...';
            }
            function done() {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '가입하기';
                }
            }
            function saveUserAndClose(uid, displayName, email, type, integratedAgreed, walletAddress) {
                var data = {
                    displayName: displayName,
                    email: email,
                    siteId: SITE_ID,
                    signupType: type || 'new',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    agreedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                if (integratedAgreed) {
                    data.integratedMemberAgreedAt = firebase.firestore.FieldValue.serverTimestamp();
                }
                if (walletAddress) {
                    data.coinWalletAddress = walletAddress;
                }
                return usersRef().doc(uid).set(data, { merge: true }).then(function() {
                    if (document.getElementById('signupModal') && typeof bootstrap !== 'undefined') {
                        bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
                    }
                    signupForm.reset();
                });
            }

            if (signupType === 'new') {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(function(cred) {
                        var uid = cred.user.uid;
                        return saveUserAndClose(uid, name, email, 'new', false, walletToSave).then(function() {
                            alert('회원가입이 완료되었습니다.');
                        });
                    })
                    .catch(function(err) {
                        var msg = err.code === 'auth/email-already-in-use' ? '이미 사용 중인 이메일입니다. 10쇼핑 회원이시면 "10쇼핑 가입회원입니다"를 선택해 주세요.' :
                              err.code === 'auth/weak-password' ? '비밀번호는 8자 이상이어야 합니다.' :
                              err.code === 'auth/invalid-email' ? '이메일 형식을 확인해 주세요.' :
                              err.message || '가입에 실패했습니다.';
                        alert(msg);
                    })
                    .finally(done);
            } else {
                auth.signInWithEmailAndPassword(email, password)
                    .then(function(cred) {
                        var uid = cred.user.uid;
                        return saveUserAndClose(uid, name, email, '10shopping', true, walletToSave).then(function() {
                            alert('10trix 회원가입이 완료되었습니다. (10쇼핑 회원 연동)');
                        });
                    })
                    .catch(function(err) {
                        var msg = err.code === 'auth/user-not-found' ? '등록된 이메일이 없습니다. 신규가입을 선택해 주세요.' :
                              err.code === 'auth/wrong-password' ? '비밀번호가 맞지 않습니다. 10쇼핑에서 사용하는 비밀번호를 입력해 주세요.' :
                              err.code === 'auth/invalid-email' ? '이메일 형식을 확인해 주세요.' :
                              err.message || '회원가입에 실패했습니다.';
                        alert(msg);
                    })
                    .finally(done);
            }
        });
    }

    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var nameEl = document.getElementById('contact-name');
            var emailEl = document.getElementById('contact-email');
            var messageEl = document.getElementById('contact-message');
            var btn = document.getElementById('contact-submit-btn');
            var name = nameEl && nameEl.value ? nameEl.value.trim() : '';
            var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
            var message = messageEl && messageEl.value ? messageEl.value.trim() : '';
            if (!name || !email || !message) return;
            if (btn) {
                btn.disabled = true;
                btn.textContent = '전송 중...';
            }
            formsRef().add({
                name: name,
                email: email,
                message: message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                contactForm.reset();
                alert('메시지가 전송되었습니다.');
                var qnaModalEl = document.getElementById('qnaModal');
                if (qnaModalEl && typeof bootstrap !== 'undefined') {
                    var modalInstance = bootstrap.Modal.getInstance(qnaModalEl);
                    if (modalInstance) modalInstance.hide();
                }
            }).catch(function(err) {
                alert('전송에 실패했습니다. 다시 시도해 주세요.');
                console.warn(err);
            }).finally(function() {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '문의 메시지 보내기';
                }
            });
        });
    }
})();
