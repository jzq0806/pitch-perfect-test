// 游戏逻辑模块
class PitchTestGame {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.lives = 2;
        this.score = 0;
        this.correctAnswers = 0;
        this.answers = [];
        this.startTime = null;
        this.questionStartTime = null;
        this.selectedAnswer = null;
        this.correctAnswer = null;
        this.isPlaying = false;
    }

    // 初始化游戏
    init(level) {
        this.currentLevel = level;
        this.currentQuestion = 1;
        this.lives = 2;
        this.correctAnswers = 0;
        this.answers = [];
        this.startTime = Date.now();
        
        this.updateUI();
        this.startQuestion();
    }

    // 更新UI
    updateUI() {
        document.getElementById('questionNumber').textContent = this.currentQuestion;
        document.getElementById('totalQuestions').textContent = this.totalQuestions;
        document.getElementById('levelName').textContent = this.getLevelName();
        
        // 更新生命显示
        const livesDisplay = document.getElementById('livesDisplay');
        livesDisplay.textContent = '❤️ '.repeat(this.lives) + '🖤 '.repeat(2 - this.lives);
    }

    // 获取关卡名称
    getLevelName() {
        const levelNames = {
            1: 'Level 1: 单音识别',
            2: 'Level 2: 音高对比',
            3: 'Level 3: 音高距离感知',
            4: 'Level 4: 旋律记忆',
            5: 'Level 5: 双音同时识别',
            6: 'Level 6: 节奏识别',
            7: 'Level 7: 绝对音高挑战'
        };
        return levelNames[this.currentLevel] || 'Unknown Level';
    }

    // 开始新问题
    async startQuestion() {
        this.selectedAnswer = null;
        this.questionStartTime = Date.now();
        this.isPlaying = true;
        
        // 显示音频播放状态
        document.getElementById('audioStatus').style.display = 'block';
        document.getElementById('optionsContainer').style.display = 'none';
        document.getElementById('submitBtn').disabled = true;
        
        // 根据关卡类型播放音频
        await this.playQuestionAudio();
        
        // 音频播放完毕，显示选项
        this.isPlaying = false;
        document.getElementById('audioStatus').style.display = 'none';
        document.getElementById('optionsContainer').style.display = 'flex';
        
        // 生成选项
        this.generateOptions();
    }

    // 播放问题音频
    async playQuestionAudio() {
        switch (this.currentLevel) {
            case 1: // 单音识别
                await this.playLevel1Audio();
                break;
            case 2: // 音高对比
                await this.playLevel2Audio();
                break;
            case 3: // 音高距离感知
                await this.playLevel4Audio();
                break;
            case 4: // 旋律记忆
                await this.playLevel5Audio();
                break;
            case 5: // 双音同时识别
                await this.playLevel6Audio();
                break;
            case 6: // 节奏识别
                await this.playLevel7Audio();
                break;
            case 7: // 绝对音高挑战
                await this.playLevel8Audio();
                break;
        }
    }

    // Level 1: 单音识别 - C大调
    async playLevel1Audio() {
        // 播放音阶
        const scaleDuration = await audioEngine.playScale('C', 4);
        await this.sleep(scaleDuration + 500); // 等待音阶播放完毕 + 500ms间隔
        
        // 随机选择一个音
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.correctAnswer = notes[Math.floor(Math.random() * notes.length)];
        
        // 播放随机音（重复两次）
        const noteDuration = await audioEngine.playRandomNote(this.correctAnswer, 4);
        await this.sleep(noteDuration);
    }

    // Level 2: 音高对比
    async playLevel2Audio() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const note1 = notes[Math.floor(Math.random() * notes.length)];
        let note2 = notes[Math.floor(Math.random() * notes.length)];
        
        // 确保两个音不同（或者有一定概率相同）
        const sameChance = Math.random() < 0.3; // 30%概率相同
        if (!sameChance) {
            while (note2 === note1) {
                note2 = notes[Math.floor(Math.random() * notes.length)];
            }
        }
        
        this.correctAnswer = audioEngine.compareNotes(note1, note2);
        
        const duration = await audioEngine.playTwoNotes(note1, note2, 4);
        await this.sleep(duration);
    }

    // Level 3: 单音识别 - 其他调
    async playLevel3Audio() {
        const scales = ['G', 'F', 'D'];
        const scale = scales[Math.floor(Math.random() * scales.length)];
        
        // 播放音阶
        const scaleDuration = await audioEngine.playScale(scale, 4);
        await this.sleep(scaleDuration + 500);
        
        // 随机选择一个音
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.correctAnswer = notes[Math.floor(Math.random() * notes.length)];
        
        // 播放随机音
        const noteDuration = await audioEngine.playRandomNote(this.correctAnswer, 4);
        await this.sleep(noteDuration);
    }

    // Level 4: 音高距离感知
    async playLevel4Audio() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const note1 = notes[Math.floor(Math.random() * notes.length)];
        let note2 = notes[Math.floor(Math.random() * notes.length)];
        
        while (note2 === note1) {
            note2 = notes[Math.floor(Math.random() * notes.length)];
        }
        
        const distance = audioEngine.getNoteDistance(note1, note2);
        
        // 分类距离
        if (distance <= 2) {
            this.correctAnswer = 'close';
        } else if (distance <= 4) {
            this.correctAnswer = 'medium';
        } else {
            this.correctAnswer = 'far';
        }
        
        const duration = await audioEngine.playTwoNotes(note1, note2, 4);
        await this.sleep(duration);
    }

    // Level 5: 旋律记忆
    async playLevel5Audio() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const melodyLength = 3 + Math.floor(Math.random() * 3); // 3-5个音
        
        const melody1 = [];
        for (let i = 0; i < melodyLength; i++) {
            melody1.push(notes[Math.floor(Math.random() * notes.length)]);
        }
        
        // 50%概率相同，50%概率不同
        const isSame = Math.random() < 0.5;
        let melody2;
        
        if (isSame) {
            melody2 = [...melody1];
            this.correctAnswer = 'same';
        } else {
            melody2 = [...melody1];
            const changeIndex = Math.floor(Math.random() * melodyLength);
            let newNote = notes[Math.floor(Math.random() * notes.length)];
            while (newNote === melody2[changeIndex]) {
                newNote = notes[Math.floor(Math.random() * notes.length)];
            }
            melody2[changeIndex] = newNote;
            this.correctAnswer = 'different';
        }
        
        // 播放第一段旋律
        const duration1 = await audioEngine.playMelody(melody1, 4);
        await this.sleep(duration1 + 800);
        
        // 播放第二段旋律
        const duration2 = await audioEngine.playMelody(melody2, 4);
        await this.sleep(duration2);
    }

    // Level 6: 双音同时识别
    async playLevel6Audio() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const note1 = notes[Math.floor(Math.random() * notes.length)];
        let note2 = notes[Math.floor(Math.random() * notes.length)];
        
        while (note2 === note1) {
            note2 = notes[Math.floor(Math.random() * notes.length)];
        }
        
        this.correctAnswer = [note1, note2].sort();
        
        const duration = await audioEngine.playChord([note1, note2], 4);
        await this.sleep(duration + 500);
        
        // 重复一次
        const duration2 = await audioEngine.playChord([note1, note2], 4);
        await this.sleep(duration2);
    }

    // Level 7: 节奏识别
    async playLevel7Audio() {
        const rhythmPatterns = [
            [1, 1, 1, 1],           // 均匀四拍
            [2, 1, 1],              // 长短短
            [1, 1, 2],              // 短短长
            [1, 0.5, 0.5, 1],       // 短-快快-短
            [2, 2],                 // 长长
            [0.5, 0.5, 0.5, 0.5, 1] // 快快快快-短
        ];
        
        const patternIndex = Math.floor(Math.random() * rhythmPatterns.length);
        this.correctAnswer = patternIndex;
        
        const duration = await audioEngine.playRhythm(rhythmPatterns[patternIndex]);
        await this.sleep(duration + 500);
        
        // 重复一次
        const duration2 = await audioEngine.playRhythm(rhythmPatterns[patternIndex]);
        await this.sleep(duration2);
    }

    // Level 8: 绝对音高挑战
    async playLevel8Audio() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.correctAnswer = notes[Math.floor(Math.random() * notes.length)];
        
        // 直接播放随机音，不播放音阶
        const noteDuration = await audioEngine.playRandomNote(this.correctAnswer, 4);
        await this.sleep(noteDuration);
    }

    // 生成选项
    generateOptions() {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        switch (this.currentLevel) {
            case 1:
            case 7:
                this.generateNoteOptions(container);
                break;
            case 2:
                this.generateComparisonOptions(container);
                break;
            case 3:
                this.generateDistanceOptions(container);
                break;
            case 4:
                this.generateSameOrDifferentOptions(container);
                break;
            case 5:
                this.generateDualNoteOptions(container);
                break;
            case 6:
                this.generateRhythmOptions(container);
                break;
        }
    }

    // 生成音符选项（泡泡样式）
    generateNoteOptions(container) {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
        const solfege = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti', 'Do'];
        
        notes.forEach((note, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'option-bubble';
            bubble.textContent = solfege[index];
            bubble.dataset.value = note === 'C' && index === 7 ? 'C' : note;
            
            bubble.addEventListener('click', () => {
                this.selectOption(bubble);
            });
            
            container.appendChild(bubble);
        });
    }

    // 生成音高对比选项
    generateComparisonOptions(container) {
        const options = [
            { text: '更高 ↑', value: 'higher' },
            { text: '相同 =', value: 'same' },
            { text: '更低 ↓', value: 'lower' }
        ];
        
        options.forEach(option => {
            const rect = document.createElement('div');
            rect.className = 'option-rect';
            rect.textContent = option.text;
            rect.dataset.value = option.value;
            
            rect.addEventListener('click', () => {
                this.selectOption(rect);
            });
            
            container.appendChild(rect);
        });
    }

    // 生成距离选项
    generateDistanceOptions(container) {
        const options = [
            { text: '很近 • •', value: 'close' },
            { text: '中等 • · · •', value: 'medium' },
            { text: '很远 • · · · · •', value: 'far' }
        ];
        
        options.forEach(option => {
            const rect = document.createElement('div');
            rect.className = 'option-rect';
            rect.textContent = option.text;
            rect.dataset.value = option.value;
            
            rect.addEventListener('click', () => {
                this.selectOption(rect);
            });
            
            container.appendChild(rect);
        });
    }

    // 生成相同/不同选项
    generateSameOrDifferentOptions(container) {
        const options = [
            { text: '相同 ✓', value: 'same' },
            { text: '不同 ✗', value: 'different' }
        ];
        
        options.forEach(option => {
            const rect = document.createElement('div');
            rect.className = 'option-rect';
            rect.textContent = option.text;
            rect.dataset.value = option.value;
            
            rect.addEventListener('click', () => {
                this.selectOption(rect);
            });
            
            container.appendChild(rect);
        });
    }

    // 生成双音选项
    generateDualNoteOptions(container) {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const solfege = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'];
        
        notes.forEach((note, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'option-bubble';
            bubble.textContent = solfege[index];
            bubble.dataset.value = note;
            
            bubble.addEventListener('click', () => {
                this.selectDualOption(bubble);
            });
            
            container.appendChild(bubble);
        });
    }

    // 生成节奏选项
    generateRhythmOptions(container) {
        const rhythms = [
            { text: '♩ ♩ ♩ ♩', value: 0 },
            { text: '♩. ♩ ♩', value: 1 },
            { text: '♩ ♩ ♩.', value: 2 },
            { text: '♩ ♪♪ ♩', value: 3 },
            { text: '♩. ♩.', value: 4 },
            { text: '♪♪♪♪ ♩', value: 5 }
        ];
        
        rhythms.forEach(rhythm => {
            const rect = document.createElement('div');
            rect.className = 'option-rect';
            rect.textContent = rhythm.text;
            rect.dataset.value = rhythm.value;
            
            rect.addEventListener('click', () => {
                this.selectOption(rect);
            });
            
            container.appendChild(rect);
        });
    }

    // 选择选项（单选）
    selectOption(element) {
        // 如果已经选中，则取消选择
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            this.selectedAnswer = null;
            document.getElementById('submitBtn').disabled = true;
        } else {
            // 取消其他选项
            document.querySelectorAll('.option-bubble, .option-rect').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 选中当前选项
            element.classList.add('selected');
            this.selectedAnswer = element.dataset.value;
            document.getElementById('submitBtn').disabled = false;
        }
    }

    // 选择双音选项（多选，最多2个）
    selectDualOption(element) {
        const selected = document.querySelectorAll('.option-bubble.selected');
        
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
        } else {
            if (selected.length < 2) {
                element.classList.add('selected');
            } else {
                // 已经选了2个，取消第一个
                selected[0].classList.remove('selected');
                element.classList.add('selected');
            }
        }
        
        const nowSelected = document.querySelectorAll('.option-bubble.selected');
        if (nowSelected.length === 2) {
            this.selectedAnswer = Array.from(nowSelected).map(el => el.dataset.value).sort();
            document.getElementById('submitBtn').disabled = false;
        } else {
            this.selectedAnswer = null;
            document.getElementById('submitBtn').disabled = true;
        }
    }

    // 提交答案
    submitAnswer() {
        if (!this.selectedAnswer) return;
        
        const responseTime = Date.now() - this.questionStartTime;
        const isCorrect = this.checkAnswer();
        
        this.answers.push({
            question: this.currentQuestion,
            correct: isCorrect,
            responseTime: responseTime,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: this.correctAnswer
        });
        
        if (isCorrect) {
            this.correctAnswers++;
            this.nextQuestion();
        } else {
            this.lives--;
            if (this.lives <= 0) {
                this.endGame();
            } else {
                this.nextQuestion();
            }
        }
    }

    // 检查答案
    checkAnswer() {
        if (Array.isArray(this.correctAnswer)) {
            // 数组比较（双音识别）
            return JSON.stringify(this.selectedAnswer) === JSON.stringify(this.correctAnswer);
        } else if (typeof this.correctAnswer === 'number') {
            // 数字比较（节奏识别）
            return parseInt(this.selectedAnswer) === this.correctAnswer;
        } else {
            // 字符串比较
            return this.selectedAnswer === this.correctAnswer;
        }
    }

    // 下一题
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion > this.totalQuestions) {
            this.endGame();
        } else {
            this.updateUI();
            this.startQuestion();
        }
    }

    // 结束游戏
    endGame() {
        const totalTime = Date.now() - this.startTime;
        const avgTime = totalTime / this.answers.length;
        
        // 保存结果到 localStorage
        const results = {
            level: this.currentLevel,
            levelName: this.getLevelName(),
            correctAnswers: this.correctAnswers,
            totalQuestions: this.answers.length,
            accuracy: Math.round((this.correctAnswers / this.answers.length) * 100),
            avgTime: (avgTime / 1000).toFixed(1),
            livesUsed: 2 - this.lives,
            answers: this.answers,
            timestamp: Date.now()
        };
        
        localStorage.setItem('pitchTestResults', JSON.stringify(results));
        
        // 跳转到结果页面
        window.location.href = 'results.html';
    }

    // 辅助函数：延迟
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 页面加载完成后初始化
if (document.getElementById('optionsContainer')) {
    const game = new PitchTestGame();
    
    // 从 URL 获取关卡
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level')) || 1;
    
    game.init(level);
    
    // 提交按钮事件
    document.getElementById('submitBtn').addEventListener('click', () => {
        game.submitAnswer();
    });
}
