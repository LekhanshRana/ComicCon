import React, { useRef, useEffect, useState } from 'react';
import { WordConfig } from '../types';
import { getMagicalHint } from '../services/geminiService';
import { Wand2, Sparkles, Loader } from 'lucide-react';

interface WordRowProps {
  word: WordConfig;
  currentAnswer: string[];
  onChange: (index: number, char: string) => void;
}

export const WordRow: React.FC<WordRowProps> = ({ word, currentAnswer, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [hint, setHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);

  // Initialize input refs
  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, word.answer.length);
  }, [word.answer.length]);

  const handleInputChange = (idx: number, val: string) => {
    if (val && !/^[a-zA-Z]$/.test(val)) return;
    onChange(idx, val.toUpperCase());
    
    // Auto-advance focus
    if (val && idx < word.answer.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !currentAnswer[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleMagicalHint = async () => {
    if (hint) return;
    setLoadingHint(true);
    const magicalHint = await getMagicalHint(word.displayName, word.clue);
    setHint(magicalHint);
    setLoadingHint(false);
  };

  return (
    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div className="flex flex-col gap-3">
        {/* Header: Number & ID */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-amber-500 text-xs font-mono border border-slate-700">
              {word.number}
            </span>
          </div>
          
          <button
            onClick={handleMagicalHint}
            disabled={loadingHint || !!hint}
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all
              ${hint 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-default' 
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-200'
              }
            `}
          >
            {loadingHint ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <Wand2 size={12} />
            )}
            {hint ? 'Revealed' : 'Magical Hint'}
          </button>
        </div>

        {/* Clue */}
        <div className="text-slate-300 text-sm italic font-light leading-relaxed border-l-2 border-slate-700 pl-3">
          {word.clue}
        </div>

        {/* Inputs - Always Horizontal */}
        <div className="flex flex-row gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          {word.answer.split('').map((char, idx) => {
            const isSecret = idx === word.secretIndex;
            const userChar = currentAnswer[idx] || '';
            const isCorrect = userChar === char;

            return (
              <div key={idx} className="relative w-8 h-10 sm:w-10 sm:h-12 flex-shrink-0">
                <input
                  ref={(el) => { if (el) inputsRef.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={userChar}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`
                    w-full h-full text-center text-lg sm:text-xl font-bold rounded-md border focus:outline-none focus:ring-2 focus:ring-amber-500/50 uppercase caret-transparent transition-all
                    ${isSecret ? 'ring-1 ring-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)] z-10' : ''}
                    ${isCorrect 
                      ? 'bg-emerald-900/80 text-emerald-100 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : userChar 
                          ? 'bg-slate-800 text-slate-100 border-slate-600'
                          : 'bg-slate-900/50 text-white border-slate-700 hover:border-slate-500'
                    }
                  `}
                />
                {isSecret && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 rounded-full bg-amber-500 blur-[1px]"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Revealed Hint */}
        {hint && (
          <div className="mt-1 p-3 bg-indigo-950/30 rounded-lg border border-indigo-500/20 animate-fade-in flex gap-2">
            <Sparkles size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-200 font-serif italic">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};