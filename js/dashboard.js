// Dashboard 页面逻辑
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

function loadDashboard() {
    // 从 localStorage 读取历史记录
    const historyData = localStorage.getItem('pitchTestHistory');
    
    if (!historyData) {
        // 没有历史记录
        document.getElementById('totalTests').textContent = '0';
        document.getElementById('avgAccuracy').textContent = '0%';
        document.getElementById('avgResponseTime').textContent = '0s';
        document.getElementById('bestScore').textContent = '0%';
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
    
    // 显示历史记录列表
    displayHistory(history);
}

function displayHistory(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无测试记录</div>';
        return;
    }
    
    // 按时间倒序排列（最新的在前）
    const sortedHistory = [...history].reverse();
    
    sortedHistory.forEach((test, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // 格式化日期
        const date = new Date(test.timestamp);
        const dateStr = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // 根据正确率设置颜色
        let scoreColor = '#f87171'; // 红色
        if (test.accuracy >= 80) {
            scoreColor = '#4ade80'; // 绿色
        } else if (test.accuracy >= 60) {
            scoreColor = '#fbbf24'; // 黄色
        }
        
        item.innerHTML = `
            <div class="history-info">
                <div class="history-level">${test.levelName}</div>
                <div class="history-date">${dateStr}</div>
            </div>
            <div class="history-score" style="color: ${scoreColor}">
                ${test.accuracy}%
            </div>
        `;
        
        historyList.appendChild(item);
    });
}

function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
        localStorage.removeItem('pitchTestHistory');
        localStorage.removeItem('pitchTestResults');
        
        // 重新加载页面
        location.reload();
    }
}
