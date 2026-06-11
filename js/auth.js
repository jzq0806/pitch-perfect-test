// 用户认证模块
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    // 初始化认证状态监听
    init() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUI();
            
            if (user) {
                console.log('用户已登录:', user.email);
                // 同步本地数据到云端
                this.syncLocalDataToCloud();
            } else {
                console.log('用户未登录');
            }
        });
    }

    // 注册新用户
    async signUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('注册成功:', user.email);
            
            // 创建用户文档
            await this.createUserDocument(user.uid, email);
            
            return { success: true, user };
        } catch (error) {
            console.error('注册失败:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // 登录
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('登录成功:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // 登出
    async logout() {
        try {
            await signOut(auth);
            console.log('登出成功');
            return { success: true };
        } catch (error) {
            console.error('登出失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 创建用户文档
    async createUserDocument(userId, email) {
        const { doc, setDoc, serverTimestamp } = await import('./firebase-config.js');
        const { db } = await import('./firebase-config.js');
        
        try {
            await setDoc(doc(db, 'users', userId), {
                email: email,
                createdAt: serverTimestamp(),
                totalTests: 0,
                bestScores: {}
            });
        } catch (error) {
            console.error('创建用户文档失败:', error);
        }
    }

    // 同步本地数据到云端
    async syncLocalDataToCloud() {
        if (!this.currentUser) return;

        const historyData = localStorage.getItem('pitchTestHistory');
        if (historyData) {
            const history = JSON.parse(historyData);
            // 将历史数据上传到 Firestore
            await this.uploadTestHistory(history);
        }
    }

    // 上传测试历史
    async uploadTestHistory(history) {
        const { collection, addDoc, serverTimestamp } = await import('./firebase-config.js');
        const { db } = await import('./firebase-config.js');
        
        try {
            for (const test of history) {
                await addDoc(collection(db, 'testResults', this.currentUser.uid, 'results'), {
                    ...test,
                    uploadedAt: serverTimestamp()
                });
            }
            console.log('历史数据同步成功');
        } catch (error) {
            console.error('同步历史数据失败:', error);
        }
    }

    // 更新 UI
    updateUI() {
        const signupLink = document.querySelector('a[href="#"]:nth-child(1)');
        const loginLink = document.querySelector('a[href="#"]:nth-child(2)');
        
        if (this.currentUser) {
            // 用户已登录
            if (signupLink) signupLink.textContent = this.currentUser.email;
            if (loginLink) {
                loginLink.textContent = 'LOGOUT';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }
        } else {
            // 用户未登录
            if (signupLink) {
                signupLink.textContent = 'SIGN UP';
                signupLink.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = 'signup.html';
                };
            }
            if (loginLink) {
                loginLink.textContent = 'LOGIN';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                };
            }
        }
    }

    // 获取错误信息
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': '该邮箱已被注册',
            'auth/invalid-email': '邮箱格式不正确',
            'auth/operation-not-allowed': '操作不被允许',
            'auth/weak-password': '密码强度太弱（至少6位）',
            'auth/user-disabled': '该用户已被禁用',
            'auth/user-not-found': '用户不存在',
            'auth/wrong-password': '密码错误',
            'auth/too-many-requests': '请求过于频繁，请稍后再试',
            'auth/network-request-failed': '网络连接失败'
        };
        
        return errorMessages[errorCode] || '发生未知错误';
    }

    // 检查是否登录
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }
}

// 创建全局实例
const authManager = new AuthManager();
export default authManager;
