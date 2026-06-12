// 主应用逻辑 - 首页
async function startTest(level) {
    // 激活 AudioContext（移动端必需）
    if (typeof audioEngine !== 'undefined' && audioEngine.audioContext.state === 'suspended') {
        try {
            await audioEngine.audioContext.resume();
            console.log('AudioContext 已激活');
        } catch (error) {
            console.error('激活 AudioContext 失败:', error);
        }
    }
    
    // 跳转到游戏页面，传递关卡参数
    window.location.href = `game.html?level=${level}`;
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pitch Perfect Test - Ready!');
});
