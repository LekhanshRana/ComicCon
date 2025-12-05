import React, { useState, useRef } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PuzzleGame } from './components/PuzzleGame';
import { Leaderboard } from './components/Leaderboard';
import { GameStatus, PlayerScore } from './types';
import { savePlayerScore } from './services/leaderboardService';
import { BackgroundMusic, BackgroundMusicHandle } from './components/BackgroundMusic';

function App() {
  const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
  const [playerName, setPlayerName] = useState('');
  const [lastScore, setLastScore] = useState<PlayerScore | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const musicRef = useRef<BackgroundMusicHandle>(null);

  const handleStart = (name: string) => {
    // Attempt to start the music when the user interacts to start the game
    musicRef.current?.play();
    
    setPlayerName(name);
    setStatus(GameStatus.PLAYING);
  };

  const handleFinish = async (score: PlayerScore) => {
    setIsSaving(true);
    try {
      await savePlayerScore(score);
      setLastScore(score);
      setStatus(GameStatus.LEADERBOARD);
    } catch (error) {
      console.error("Failed to save score:", error);
      // Even if save fails, show leaderboard (maybe they are offline)
      setLastScore(score);
      setStatus(GameStatus.LEADERBOARD);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPlayerName('');
    setLastScore(null);
    setStatus(GameStatus.WELCOME);
  };

  return (
    <div className="font-sans text-slate-900 selection:bg-amber-500 selection:text-white relative">
      <BackgroundMusic ref={musicRef} />

      {status === GameStatus.WELCOME && (
        <WelcomeScreen onStart={handleStart} />
      )}
      
      {(status === GameStatus.PLAYING || status === GameStatus.COMPLETED) && (
        <PuzzleGame 
          playerName={playerName} 
          onFinish={handleFinish}
          onReset={handleReset}
          isSaving={isSaving}
        />
      )}

      {status === GameStatus.LEADERBOARD && (
        <Leaderboard 
          currentScore={lastScore} 
          onBack={handleReset}
        />
      )}
    </div>
  );
}

export default App;
