// Simple synth for UI sounds to avoid loading external files and ensure offline functionality.
const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getContext = () => {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    return audioCtx;
};

export const playCorrectSound = () => {
    try {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        
        // Magical "Ping" - High pitch sine with bell envelope
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // Slide up octave
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.error("Audio error", e);
    }
};

export const playIncorrectSound = () => {
    try {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        
        // Soft "Thud" - Low frequency triangle
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
        console.error("Audio error", e);
    }
};

export const playCompletionSound = () => {
    try {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        // Victory Fanfare - Major Arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major scale extended
        const now = ctx.currentTime;
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = now + i * 0.08;
            const duration = 1.0;
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    } catch (e) {
        console.error("Audio error", e);
    }
};
