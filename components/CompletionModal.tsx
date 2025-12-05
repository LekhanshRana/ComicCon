import React from 'react';
import { Trophy, Save, RotateCcw, Loader2 } from 'lucide-react';

interface CompletionModalProps {
  timeSeconds: number;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ timeSeconds, onSave, onReset, isSaving = false }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-xl max-w-lg w-full p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

        <div className="mx-auto bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-4 ring-amber-500/20">
          <Trophy size={40} className="text-amber-400" />
        </div>

        <h2 className="text-3xl font-serif font-bold text-amber-50 mb-2">
          Mischief Managed!
        </h2>
        
        <p className="text-slate-300 mb-6">
          You have revealed the secret location and proven your knowledge.
        </p>

        <div className="bg-slate-950 rounded-lg p-4 mb-8 border border-slate-800">
          <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Total Time</p>
          <p className="text-4xl font-mono font-bold text-emerald-400">{formatTime(timeSeconds)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:text-amber-200/50 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving to Archives...' : 'Immortalize Score'}
          </button>
          
          <button
            onClick={onReset}
            disabled={isSaving}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
