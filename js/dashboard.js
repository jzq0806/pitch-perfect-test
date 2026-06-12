// Dashboard 页面逻辑
import dataSync from './data-sync.js';
import authManager from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

async function loadDashboard() {
    // 检查用户是否登录
    if (authManager.isLoggedIn()) {
        // 从云端加载数据
        await loadCloudData();
    } else {
        // 从本地加载数据
        loadLocalData();
    }
}

// 从云端加载数据
async function loadCloudData() {
    const historyResult = await dataSync.getUserTestHistory();
    const statsResult = await dataSync.getUserStatsSummary();
    const globalStatsResult = await dataSync.getAllGlobalStats();
    
    if (historyResult.success && historyResult.data.length > 0) {
        const history = historyResult.data;
        
        // 计算总体统计
        const totalTests = history.length;
        const totalAccuracy = history.reduce((sum, test) => sum + test.accuracy, 0);
        const avgAccuracy = Math.round(totalAccuracy / totalTests);
        const totalTime = history.reduce((sum, test) => sum + parseFloat(test.avgTime), 0);
        const avgResponseTime = (totalTime / totalTests).toFixed(1);
        const bestScore = Math.max(...history.map(test => test.accuracy));
        
        // 更新统计卡片
        document.getElementById('totalTests').textContent = totalTests;
        document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
        document.getElementById('avgResponseTime').textContent = avgResponseTime + 's';
        document.getElementById('bestScore').textContent = bestScore + '%';
        
        // 显示关卡详细统计
        displayLevelStats(history, globalStatsResult.success ? globalStatsResult.data : null);
        
        // 显示历史记录
        displayHistory(history);
    } else {
        // 没有云端数据，尝试本地数据
        loadLocalData();
    }
}

// 从本地加载数据
function loadLocalData() {
    const historyData = localStorage.getItem('pitchTestHistory');
    
    if (!historyData) {
        document.getElementById('totalTests').textContent = '0';
        document.getElementById('avgAccuracy').textContent = '0%';
        document.getElementById('avgResponseTime').textContent = '0s';
        document.getElementById('bestScore').textContent = '0%';
        
        // 显示登录提示
        const container = document.querySelector('.dashboard-container');
        if (container) {
            const loginPrompt = document.createElement('div');
            loginPrompt.style.cssText = 'text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 15px; margin: 20px 0;';
            loginPrompt.innerHTML = `
                <h3 style="margin-bottom: 15px;">🔐 登录以查看完整数据</h3>
                <p style="margin-bottom: 20px; opacity: 0.8;">登录后可以查看云端数据、关卡详细统计和大众数据对比</p>
                <a href="login.html" style="display: inline-block; padding: 12px 30px; background: #4a90e2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">立即登录</a>
            `;
            container.insertBefore(loginPrompt, container.firstChild);
        }
        return;
    }
    
    const history = JSON.parse(historyData);
    
    if (history.length === 0) {
        return;
    }
    
    // 计算统计数据
    const totalTests = history.length;
    const totalAccuracy = history.reduce((sum, test) => sum + test.accuracy, 0);
    const avgAccuracy = Math.round(totalAccuracy / totalTests);
    const totalTime = history.reduce((sum, test) => sum + parseFloat(test.avgTime), 0);
    const avgResponseTime = (totalTime / totalTests).toFixed(1);
    const bestScore = Math.max(...history.map(test => test.accuracy));
    
    // 更新统计卡片
    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
    document.getElementById('avgResponseTime').textContent = avgResponseTime + 's';
    document.getElementById('bestScore').textContent = bestScore + '%';
    
    // 显示关卡详细统计（本地数据）
    displayLevelStats(history, null);
    
    // 显示历史记录列表
    displayHistory(history);
}

// 显示关卡详细统计
function displayLevelStats(history, globalStats) {
    const levelStatsContainer = document.getElementById('levelStats');
    if (!levelStatsContainer) {
        // 如果容器不存在，创建一个
        const container = document.querySelector('.dashboard-container');
        const statsSection = document.createElement('div');
        statsSection.innerHTML = `
            <h2 style="margin: 40px 0 20px 0; font-size: 28px;">📊 关卡详细统计</h2>
            <div id="levelStats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px;"></div>
        `;
        container.insertBefore(statsSection, document.getElementById('historySection'));
    }
    
    const levelStats = {};
    
    // 按关卡分组统计
    history.forEach(test => {
        if (!levelStats[test.level]) {
            levelStats[test.level] = {
                level: test.level,
                levelName: test.levelName,
                tests: [],
                totalAccuracy: 0,
                bestAccuracy: 0
            };
        }
        levelStats[test.level].tests.push(test);
        levelStats[test.level].totalAccuracy += test.accuracy;
        levelStats[test.level].bestAccuracy = Math.max(levelStats[test.level].bestAccuracy, test.accuracy);
    });
    
    // 生成关卡统计卡片
    const statsHTML = Object.values(levelStats).map(stat => {
        const avgAccuracy = Math.round(stat.totalAccuracy / stat.tests.length);
        const globalAvg = globalStats && globalStats[`level${stat.level}`] ? 
            globalStats[`level${stat.level}`].avgAccuracy : null;
        
        const comparison = globalAvg ? 
            (avgAccuracy > globalAvg ? 
                `<div style="color: #4ade80; margin-top: 10px;">📈 超过平均 ${(avgAccuracy - globalAvg).toFixed(1)}%</div>` :
                `<div style="color: #fbbf24; margin-top: 10px;">📉 低于平均 ${(globalAvg - avgAccuracy).toFixed(1)}%</div>`) :
            '';
        
        return `
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
                <h3 style="margin-bottom: 15px; font-size: 20px;">${stat.levelName}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div style="font-size: 14px; opacity: 0.8;">测试次数</div>
                        <div style="font-size: 24px; font-weight: bold;">${stat.tests.length}</div>
                    </div>
                    <div>
                        <div style="font-size: 14px; opacity: 0.8;">平均正确率</div>
                        <div style="font-size: 24px; font-weight: bold; color: ${avgAccuracy >= 80 ? '#4ade80' : avgAccuracy >= 60 ? '#fbbf24' : '#f87171'};">${avgAccuracy}%</div>
                    </div>
                    <div>
                        <div style="font-size: 14px; opacity: 0.8;">最佳成绩</div>
                        <div style="font-size: 24px; font-weight: bold; color: #4ade80;">${stat.bestAccuracy}%</div>
                    </div>
                    ${globalAvg ? `
                    <div>
                        <div style="font-size: 14px; opacity: 0.8;">大众平均</div>
                        <div style="font-size: 24px; font-weight: bold; color: #fbbf24;">${globalAvg}%</div>
                    </div>
                    ` : '<div></div>'}
                </div>
                ${comparison}
            </div>
        `;
    }).join('');
    
    document.getElementById('levelStats').innerHTML = statsHTML;
}

function displayHistory(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无测试记录</div>';
        return;
    }
    
    // 按时间倒序排列
    const sortedHistory = [...history].sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp || a.createdAt || 0);
        const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp || b.createdAt || 0);
        return timeB - timeA;
    });
    
    sortedHistory.forEach(test => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = test.timestamp?.toDate?.() || new Date(test.timestamp || test.createdAt || Date.now());
        const dateStr = date.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        historyItem.innerHTML = `
            <div class="history-level">${test.levelName}</div>
            <div class="history-stats">
                <span class="history-accuracy" style="color: ${test.accuracy >= 80 ? '#4ade80' : test.accuracy >= 60 ? '#fbbf24' : '#f87171'};">
                    ${test.accuracy}%
                </span>
                <span class="history-correct">${test.correctAnswers}/${test.totalQuestions}</span>
                <span class="history-time">${test.avgTime}s</span>
            </div>
            <div class="history-date">${dateStr}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('确定要清除所有本地历史记录吗？（云端数据不会被删除）')) {
        localStorage.removeItem('pitchTestHistory');
        loadDashboard();
    }
}
