// 音频生成和播放模块
class AudioEngine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.3;
    }

    // 音符频率映射 (C4 = 中央C)
    getNoteFrequency(note, octave = 4) {
        const noteFrequencies = {
            'C': 261.63,
            'D': 293.66,
            'E': 329.63,
            'F': 349.23,
            'G': 392.00,
            'A': 440.00,
            'B': 493.88
        };
        
        const baseFreq = noteFrequencies[note];
        const octaveMultiplier = Math.pow(2, octave - 4);
        return baseFreq * octaveMultiplier;
    }

    // 播放单个音符（钢琴音色）
    playNote(frequency, duration = 0.5, startTime = 0) {
        const now = this.audioContext.currentTime + startTime;
        
        // 创建多个谐波来模拟钢琴音色
        const harmonics = [
            { freq: 1, gain: 1.0 },      // 基频
            { freq: 2, gain: 0.5 },      // 第二谐波
            { freq: 3, gain: 0.3 },      // 第三谐波
            { freq: 4, gain: 0.2 },      // 第四谐波
            { freq: 5, gain: 0.1 },      // 第五谐波
            { freq: 6, gain: 0.05 }      // 第六谐波
        ];
        
        const masterGain = this.audioContext.createGain();
        
        // 为每个谐波创建振荡器
        harmonics.forEach(harmonic => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency * harmonic.freq, now);
            
            // 钢琴的 ADSR 包络（快速起音，缓慢衰减）
            const harmonicVolume = this.masterVolume * harmonic.gain;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(harmonicVolume, now + 0.01); // 快速起音
            gainNode.gain.exponentialRampToValueAtTime(harmonicVolume * 0.3, now + 0.1); // 快速衰减
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // 缓慢释放
            
            oscillator.connect(gainNode);
            gainNode.connect(masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
        });
        
        masterGain.connect(this.audioContext.destination);
        
        return duration;
    }

    // 播放音阶 (Do Re Mi Fa So La Ti Do)
    async playScale(scale = 'C', octave = 4) {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
        const noteDuration = 0.4;
        const gap = 0.1;
        
        let currentTime = 0;
        
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            const noteOctave = i === 7 ? octave + 1 : octave; // 最后一个Do是高八度
            const frequency = this.getNoteFrequency(note, noteOctave);
            this.playNote(frequency, noteDuration, currentTime);
            currentTime += noteDuration + gap;
        }
        
        return currentTime * 1000; // 返回总时长（毫秒）
    }

    // 播放随机音（重复两次）
    async playRandomNote(note, octave = 4) {
        const frequency = this.getNoteFrequency(note, octave);
        const noteDuration = 0.5;
        const gap = 0.3;
        
        // 第一次
        this.playNote(frequency, noteDuration, 0);
        // 第二次
        this.playNote(frequency, noteDuration, noteDuration + gap);
        
        return (noteDuration * 2 + gap) * 1000; // 返回总时长（毫秒）
    }

    // 播放两个音（用于音高对比）
    async playTwoNotes(note1, note2, octave = 4) {
        const freq1 = this.getNoteFrequency(note1, octave);
        const freq2 = this.getNoteFrequency(note2, octave);
        const noteDuration = 0.6;
        const gap = 0.3;
        
        this.playNote(freq1, noteDuration, 0);
        this.playNote(freq2, noteDuration, noteDuration + gap);
        
        return (noteDuration * 2 + gap) * 1000;
    }

    // 同时播放两个音（用于双音识别）
    async playChord(notes, octave = 4) {
        const noteDuration = 1.0;
        
        notes.forEach(note => {
            const frequency = this.getNoteFrequency(note, octave);
            this.playNote(frequency, noteDuration, 0);
        });
        
        return noteDuration * 1000;
    }

    // 播放旋律序列
    async playMelody(notes, octave = 4) {
        const noteDuration = 0.4;
        const gap = 0.1;
        let currentTime = 0;
        
        notes.forEach(note => {
            const frequency = this.getNoteFrequency(note, octave);
            this.playNote(frequency, noteDuration, currentTime);
            currentTime += noteDuration + gap;
        });
        
        return currentTime * 1000;
    }

    // 播放带缺失的旋律（用于 Level 3）
    async playMelodyWithGap(notes, octave = 4) {
        const noteDuration = 0.4;
        const gap = 0.1;
        let currentTime = 0;
        
        notes.forEach(note => {
            if (note === null) {
                // 缺失的音：只留空白时间
                currentTime += noteDuration + gap;
            } else {
                const frequency = this.getNoteFrequency(note, octave);
                this.playNote(frequency, noteDuration, currentTime);
                currentTime += noteDuration + gap;
            }
        });
        
        return currentTime * 1000;
    }

    // 播放节奏（使用固定音高）
    async playRhythm(pattern) {
        // pattern 是一个数组，表示节奏型，例如 [1, 0.5, 0.5, 1]
        const frequency = 440; // A4
        let currentTime = 0;
        
        pattern.forEach(duration => {
            if (duration > 0) {
                this.playNote(frequency, duration * 0.4, currentTime);
            }
            currentTime += duration * 0.5;
        });
        
        return currentTime * 1000;
    }

    // 设置音量
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // 获取随机音符
    getRandomNote() {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        return notes[Math.floor(Math.random() * notes.length)];
    }

    // 获取音符的唱名
    getNoteSolfege(note) {
        const solfege = {
            'C': 'Do',
            'D': 'Re',
            'E': 'Mi',
            'F': 'Fa',
            'G': 'So',
            'A': 'La',
            'B': 'Ti'
        };
        return solfege[note];
    }

    // 获取音符索引
    getNoteIndex(note) {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        return notes.indexOf(note);
    }

    // 计算两个音符之间的距离
    getNoteDistance(note1, note2) {
        const index1 = this.getNoteIndex(note1);
        const index2 = this.getNoteIndex(note2);
        return Math.abs(index2 - index1);
    }

    // 判断音高关系
    compareNotes(note1, note2) {
        const index1 = this.getNoteIndex(note1);
        const index2 = this.getNoteIndex(note2);
        
        if (index1 < index2) return 'higher';
        if (index1 > index2) return 'lower';
        return 'same';
    }
    
    // 播放节拍器音效（木质敲击声）
    async playMetronomeClick() {
        const now = this.audioContext.currentTime;
        
        // 使用白噪声 + 滤波器模拟木质敲击声
        const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // 生成白噪声
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        // 低通滤波器（模拟木质音色）
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(1, now);
        
        // 增益包络（快速衰减）
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.masterVolume * 0.8, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        // 连接节点
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(now);
        noise.stop(now + 0.05);
        
        return 50; // 返回毫秒
    }
}

// 导出全局实例
const audioEngine = new AudioEngine();
