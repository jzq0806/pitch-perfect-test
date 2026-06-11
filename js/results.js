// 结果页面逻辑
document.addEventListener('DOMContentLoaded', () => {
    loadResults();
});

function loadResults() {
    // 从 localStorage 读取结果
    const resultsData = localStorage.getItem('pitchTestResults');
    
    if (!resultsData) {
        // 如果没有结果，显示默认信息
        document.getElementById('resultsTitle').textContent = '暂无测试结果';
        document.getElementById('scoreValue').textContent = '0%';
        document.getElementById('correctCount').textContent = '0 / 0';
        document.getElementById('avgTime').textContent = '0s';
        document.getElementById('livesUsed').textContent = '0 / 2';
        document.getElementById('levelReached').textContent = 'N/A';
        return;
    }
    
    const results = JSON.parse(resultsData);
    
    // 更新标题
    document.getElementById('resultsTitle').textContent = results.levelName;
    
    // 更新正确率
    document.getElementById('scoreValue').textContent = results.accuracy + '%';
    
    // 更新统计数据
    document.getElementById('correctCount').textContent = 
        `${results.correctAnswers} / ${results.totalQuestions}`;
    
    document.getElementById('avgTime').textContent = results.avgTime + 's';
    
    document.getElementById('livesUsed').textContent = 
        `${results.livesUsed} / 2`;
    
    document.getElementById('levelReached').textContent = 
        `Level ${results.level}`;
    
    // 根据正确率改变颜色
    const scoreElement = document.getElementById('scoreValue');
    if (results.accuracy >= 80) {
        scoreElement.style.color = '#4ade80'; // 绿色
    } else if (results.accuracy >= 60) {
        scoreElement.style.color = '#fbbf24'; // 黄色
    } else {
        scoreElement.style.color = '#f87171'; // 红色
    }
}

function saveScore() {
    const resultsData = localStorage.getItem('pitchTestResults');
    
    if (!resultsData) {
        alert('没有可保存的成绩！');
        return;
    }
    
    const results = JSON.parse(resultsData);
    
    // 获取历史记录
    let history = localStorage.getItem('pitchTestHistory');
    history = history ? JSON.parse(history) : [];
    
    // 添加当前成绩
    history.push(results);
    
    // 保存历史记录
    localStorage.setItem('pitchTestHistory', JSON.stringify(history));
    
    alert('成绩已保存！');
    
    // 可以在这里添加更多功能，比如上传到服务器
}

function tryAgain() {
    // 返回首页
    window.location.href = 'index.html';
}

// 音量控制
let isMuted = false;

function toggleVolume() {
    isMuted = !isMuted;
    const volumeBtn = document.getElementById('volumeBtn');
    
    if (isMuted) {
        volumeBtn.textContent = '🔇';
        audioEngine.setVolume(0);
    } else {
        volumeBtn.textContent = '🔊';
        audioEngine.setVolume(0.3);
    }
}
