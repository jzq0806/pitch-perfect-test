// 结果页面逻辑
import dataSync from './data-sync.js';

document.addEventListener('DOMContentLoaded', () => {
    loadResults();
    loadGlobalComparison();
});

async function loadResults() {
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
    
    // 自动保存到云端
    await saveToCloud(results);
}

// 保存到云端
async function saveToCloud(results) {
    const saveResult = await dataSync.saveTestResult(results);
    if (saveResult.success) {
        console.log('成绩已自动保存到云端');
    } else {
        console.log('云端保存失败，仅保存到本地');
    }
}

// 加载大众数据对比
async function loadGlobalComparison() {
    const resultsData = localStorage.getItem('pitchTestResults');
    if (!resultsData) return;
    
    const results = JSON.parse(resultsData);
    const globalResult = await dataSync.getGlobalStats(results.level);
    
    if (globalResult.success) {
        const globalData = globalResult.data;
        const comparisonHTML = `
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 15px;">
                <h3 style="margin-bottom: 15px;">📊 大众数据对比</h3>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 14px; opacity: 0.8;">你的正确率</div>
                        <div style="font-size: 28px; font-weight: bold; color: #4ade80;">${results.accuracy}%</div>
                    </div>
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 14px; opacity: 0.8;">大众平均</div>
                        <div style="font-size: 28px; font-weight: bold; color: #fbbf24;">${globalData.avgAccuracy}%</div>
                    </div>
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 14px; opacity: 0.8;">总测试次数</div>
                        <div style="font-size: 28px; font-weight: bold;">${globalData.totalTests}</div>
                    </div>
                </div>
                <div style="margin-top: 15px; text-align: center; font-size: 16px;">
                    ${results.accuracy > globalData.avgAccuracy ? 
                        `🎉 你超过了平均水平 ${(results.accuracy - globalData.avgAccuracy).toFixed(1)}%！` : 
                        `💪 继续努力，距离平均还差 ${(globalData.avgAccuracy - results.accuracy).toFixed(1)}%`}
                </div>
            </div>
        `;
        
        // 插入到结果页面
        const container = document.querySelector('.stats-grid');
        if (container && container.parentElement) {
            container.parentElement.insertAdjacentHTML('beforeend', comparisonHTML);
        }
    }
}

async function saveScore() {
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
    
    // 同时保存到云端
    const saveResult = await dataSync.saveTestResult(results);
    
    if (saveResult.success) {
        alert('成绩已保存到本地和云端！');
    } else {
        alert('成绩已保存到本地历史！（云端保存失败）');
    }
}

function tryAgain() {
    // 返回首页
    window.location.href = 'index.html';
}

// 将函数暴露到全局作用域
window.saveScore = saveScore;
window.tryAgain = tryAgain;
window.toggleVolume = toggleVolume;

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
