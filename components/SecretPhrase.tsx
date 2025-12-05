import React from 'react';
import { Lock } from 'lucide-react';

interface SecretPhraseProps {
  phrase: (string | null)[];
}

export const SecretPhrase: React.FC<SecretPhraseProps> = ({ phrase }) => {
  return (
    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-900/50 shadow-2xl py-3 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-serif text-amber-500 tracking-widest uppercase">Secret Phrase</span>
          <Lock size={12} className="text-amber-700" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {phrase.map((char, idx) => (
            <div
              key={idx}
              className={`
                w-6 h-8 sm:w-8 sm:h-10 md:w-10 md:h-12 flex items-center justify-center rounded border text-sm sm:text-lg md:text-xl font-bold font-serif transition-all duration-500
                ${char 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transform scale-110' 
                  : 'bg-slate-900 border-slate-800 text-slate-700'}
              `}
            >
              {char || '?'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
