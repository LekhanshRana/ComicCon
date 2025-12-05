import React, { useState, useEffect } from 'react';
import { WordRow } from './WordRow';
import { SecretPhrase } from './SecretPhrase';
import { CompletionModal } from './CompletionModal';
import { Confetti } from './Confetti';
import { PUZZLE_DATA, SECRET_PHRASE_LENGTH } from '../constants';
import { GameState, GameStatus, PlayerScore } from '../types';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playCompletionSound } from '../services/soundService';

interface PuzzleGameProps {
  playerName: string;
  onFinish: (score: PlayerScore) => void;
  onReset: () => void;
  isSaving?: boolean;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ playerName, onFinish, onReset, isSaving }) => {
  // Initialize empty answers
  const initialAnswers: Record<string, string[]> = {};
  PUZZLE_DATA.forEach(word => {
    initialAnswers[word.id] = new Array(word.answer.length).fill('');
  });

  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.PLAYING,
    playerName,
    startTime: Date.now(),
    endTime: null,
    answers: initialAnswers,
    mistakes: 0
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'error'>('idle');

  // Timer
  useEffect(() => {
    if (gameState.status !== GameStatus.PLAYING) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.status]);

  // Derived State: Secret Phrase
  const secretPhrase = new Array(SECRET_PHRASE_LENGTH).fill(null);
  
  PUZZLE_DATA.forEach(word => {
    const userChar = gameState.answers[word.id][word.secretIndex];
    if (userChar) {
        secretPhrase[word.secretPosition] = userChar;
    }
  });

  const handleSubmit = () => {
    const allWordsCorrect = PUZZLE_DATA.every(word => {
      return gameState.answers[word.id].join('') === word.answer;
    });

    if (allWordsCorrect) {
      playCompletionSound();
      setGameState(prev => ({
        ...prev,
        status: GameStatus.COMPLETED,
        endTime: Date.now()
      }));
      setShowModal(true);
      setSubmissionStatus('idle');
    } else {
      playIncorrectSound();
      setSubmissionStatus('error');
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      // Hide error after 3s
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }
  };

  const handleWordChange = (wordId: string, charIndex: number, char: string) => {
    if (gameState.status !== GameStatus.PLAYING) return;

    // Sound Effect Logic
    if (char) { // Only play sound on entry (not backspace)
      const wordConfig = PUZZLE_DATA.find(w => w.id === wordId);
      if (wordConfig) {
        const correctChar = wordConfig.answer[charIndex];
        if (char === correctChar) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      }
    }

    setGameState(prev => {
      const newAnswers = { ...prev.answers };
      newAnswers[wordId] = [...newAnswers[wordId]];
      newAnswers[wordId][charIndex] = char;
      return { ...prev, answers: newAnswers };
    });
  };

  const handleSaveScore = () => {
    const score: PlayerScore = {
      name: playerName,
      timeSeconds: elapsedSeconds,
      date: new Date().toISOString().split('T')[0],
      mistakes: gameState.mistakes
    };
    onFinish(score);
  };

  const acrossWords = PUZZLE_DATA.filter(w => w.direction === 'ACROSS');
  const downWords = PUZZLE_DATA.filter(w => w.direction === 'DOWN');

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <SecretPhrase phrase={secretPhrase} />
      
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-amber-50 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
              The Volunteer Chronicles
            </h2>
            <p className="text-sm text-slate-400">Decipher the scrolls to reveal the hidden location.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-5 py-3 rounded-xl border border-slate-800 shadow-lg">
            <Clock size={18} className="text-amber-500 animate-pulse-slow" />
            <span className="font-mono font-bold text-xl text-amber-50 min-w-[3ch] text-right">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
          {/* First Column */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {acrossWords.map(word => (
                <WordRow
                  key={word.id}
                  word={word}
                  currentAnswer={gameState.answers[word.id]}
                  onChange={(idx, char) => handleWordChange(word.id, idx, char)}
                />
              ))}
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {downWords.map(word => (
                <WordRow
                  key={word.id}
                  word={word}
                  currentAnswer={gameState.answers[word.id]}
                  onChange={(idx, char) => handleWordChange(word.id, idx, char)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex flex-col items-center justify-center gap-4 pb-12">
          {submissionStatus === 'error' && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-500/30 text-red-200 px-6 py-3 rounded-lg animate-fade-in font-serif">
              <AlertCircle size={20} className="text-red-400" />
              <span>The magical seal remains locked. Some answers are incorrect.</span>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            className="group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold font-serif text-xl rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-3">
              <CheckCircle size={24} />
              Submit & Reveal Destiny
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          </button>
        </div>
      </div>

      {showModal && <Confetti />}

      {showModal && (
        <CompletionModal 
          timeSeconds={elapsedSeconds}
          onSave={handleSaveScore}
          onReset={onReset}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};