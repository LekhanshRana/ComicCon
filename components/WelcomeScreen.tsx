import React, { useState } from 'react';
import { Sparkles, Scroll } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-amber-50 p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black opacity-80 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Scroll size={48} className="text-amber-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-md">
          Volunteer Quest
        </h1>
        
        <p className="text-slate-300 text-lg font-light tracking-wide">
          Prove your worth to the Council of Comic Con.
          Solve the puzzle to reveal the hidden location.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name, Volunteer"
              className="relative w-full px-6 py-4 bg-slate-900 rounded-lg border border-slate-700 text-amber-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-serif text-lg text-center shadow-xl"
              maxLength={20}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Begin the Trial
          </button>
        </form>
      </div>
    </div>
  );
};
