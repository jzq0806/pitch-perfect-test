// 数据同步模块 - 将测试结果同步到 Firebase
import { auth, db, collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, serverTimestamp } from './firebase-config.js';

class DataSync {
    constructor() {
        this.userId = null;
        this.init();
    }

    // 初始化
    init() {
        auth.onAuthStateChanged((user) => {
            this.userId = user ? user.uid : null;
        });
    }

    // 保存测试结果到 Firestore
    async saveTestResult(results) {
        if (!this.userId) {
            console.log('用户未登录，仅保存到本地');
            return { success: false, message: '用户未登录' };
        }

        try {
            // 添加到用户的测试结果集合
            const testRef = await addDoc(collection(db, 'users', this.userId, 'testResults'), {
                level: results.level,
                levelName: results.levelName,
                correctAnswers: results.correctAnswers,
                totalQuestions: results.totalQuestions,
                accuracy: results.accuracy,
                avgTime: parseFloat(results.avgTime),
                livesUsed: results.livesUsed,
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });

            // 同时更新全局统计（用于大众数据对比）
            await this.updateGlobalStats(results);

            // 更新用户统计
            await this.updateUserStats(results);

            console.log('测试结果已保存到云端:', testRef.id);
            return { success: true, id: testRef.id };
        } catch (error) {
            console.error('保存测试结果失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 更新全局统计数据
    async updateGlobalStats(results) {
        try {
            const statsRef = doc(db, 'globalStats', `level${results.level}`);
            const statsDoc = await getDoc(statsRef);

            if (statsDoc.exists()) {
                const data = statsDoc.data();
                const newCount = data.totalTests + 1;
                const newTotalAccuracy = data.totalAccuracy + results.accuracy;
                const newAvgAccuracy = newTotalAccuracy / newCount;

                await updateDoc(statsRef, {
                    totalTests: newCount,
                    totalAccuracy: newTotalAccuracy,
                    avgAccuracy: Math.round(newAvgAccuracy * 100) / 100,
                    lastUpdated: serverTimestamp()
                });
            } else {
                // 首次创建
                await updateDoc(statsRef, {
                    level: results.level,
                    levelName: results.levelName,
                    totalTests: 1,
                    totalAccuracy: results.accuracy,
                    avgAccuracy: results.accuracy,
                    lastUpdated: serverTimestamp()
                }, { merge: true });
            }
        } catch (error) {
            console.error('更新全局统计失败:', error);
        }
    }

    // 更新用户统计
    async updateUserStats(results) {
        try {
            const userStatsRef = doc(db, 'users', this.userId);
            const userDoc = await getDoc(userStatsRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                const bestScores = data.bestScores || {};
                
                // 更新该关卡的最佳成绩
                if (!bestScores[`level${results.level}`] || 
                    bestScores[`level${results.level}`].accuracy < results.accuracy) {
                    bestScores[`level${results.level}`] = {
                        accuracy: results.accuracy,
                        avgTime: parseFloat(results.avgTime),
                        timestamp: new Date().toISOString()
                    };
                }

                await updateDoc(userStatsRef, {
                    totalTests: (data.totalTests || 0) + 1,
                    bestScores: bestScores,
                    lastTestDate: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('更新用户统计失败:', error);
        }
    }

    // 获取用户的所有测试历史
    async getUserTestHistory() {
        if (!this.userId) {
            return { success: false, message: '用户未登录' };
        }

        try {
            const resultsRef = collection(db, 'users', this.userId, 'testResults');
            const q = query(resultsRef);
            const querySnapshot = await getDocs(q);

            const history = [];
            querySnapshot.forEach((doc) => {
                history.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // 按时间倒序排列
            history.sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || new Date(a.createdAt);
                const timeB = b.timestamp?.toDate?.() || new Date(b.createdAt);
                return timeB - timeA;
            });

            return { success: true, data: history };
        } catch (error) {
            console.error('获取测试历史失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取特定关卡的测试历史
    async getLevelHistory(level) {
        if (!this.userId) {
            return { success: false, message: '用户未登录' };
        }

        try {
            const resultsRef = collection(db, 'users', this.userId, 'testResults');
            const q = query(resultsRef, where('level', '==', level));
            const querySnapshot = await getDocs(q);

            const history = [];
            querySnapshot.forEach((doc) => {
                history.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // 按时间倒序排列
            history.sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || new Date(a.createdAt);
                const timeB = b.timestamp?.toDate?.() || new Date(b.createdAt);
                return timeB - timeA;
            });

            return { success: true, data: history };
        } catch (error) {
            console.error('获取关卡历史失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取全局统计数据
    async getGlobalStats(level) {
        try {
            const statsRef = doc(db, 'globalStats', `level${level}`);
            const statsDoc = await getDoc(statsRef);

            if (statsDoc.exists()) {
                return { success: true, data: statsDoc.data() };
            } else {
                return { success: false, message: '暂无数据' };
            }
        } catch (error) {
            console.error('获取全局统计失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取所有关卡的全局统计
    async getAllGlobalStats() {
        try {
            const stats = {};
            for (let level = 1; level <= 7; level++) {
                const result = await this.getGlobalStats(level);
                if (result.success) {
                    stats[`level${level}`] = result.data;
                }
            }
            return { success: true, data: stats };
        } catch (error) {
            console.error('获取所有全局统计失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取用户统计摘要
    async getUserStatsSummary() {
        if (!this.userId) {
            return { success: false, message: '用户未登录' };
        }

        try {
            const userRef = doc(db, 'users', this.userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                return { success: true, data: userDoc.data() };
            } else {
                return { success: false, message: '用户数据不存在' };
            }
        } catch (error) {
            console.error('获取用户统计失败:', error);
            return { success: false, error: error.message };
        }
    }
}

// 创建全局实例
const dataSync = new DataSync();
export default dataSync;
