// 主应用逻辑 - 首页
function startTest(level) {
    // 跳转到游戏页面，传递关卡参数
    window.location.href = `game.html?level=${level}`;
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pitch Perfect Test - Ready!');
});
