import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Upload, RefreshCw } from 'lucide-react';

export interface BackgroundMusicHandle {
  play: () => Promise<void>;
  stop: () => void;
}

// Using the direct download link for the Google Drive file provided.
// ID: 1Ig7uvBBAslL6icQRPrEXytM63LMS3CPu
const MUSIC_URLS = [
  "https://audio.jukehost.co.uk/JtiBC2mVkArHDGhKmdh4NStEedaHTfk1.mp3"
];



export const BackgroundMusic = forwardRef<BackgroundMusicHandle>((_, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [customSource, setCustomSource] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Determine current source: Custom Upload -> Current URL in list
  const currentSrc = customSource || MUSIC_URLS[urlIndex];

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.3;
          await audioRef.current.play();
          setIsPlaying(true);
          setHasError(false);
        } catch (err) {
          console.warn("Audio play failed (likely autoplay policy):", err);
        }
      }
    },
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }));

  // Auto-play when source changes if we were supposed to be playing or retrying
  useEffect(() => {
    if ((isPlaying || isRetrying) && audioRef.current && !hasError) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsRetrying(false);
          })
          .catch((e) => {
             console.warn("Autoplay after source change prevented:", e);
          });
      }
    }
  }, [urlIndex, customSource]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch(e => {
            console.error("Play failed", e);
            if (e.name !== 'NotAllowedError') {
                handleError();
            }
          });
      }
    }
  };

  const handleError = () => {
    // If we have a custom source, it's a hard error.
    if (customSource) {
      console.error("Custom audio file failed.");
      setHasError(true);
      setIsPlaying(false);
      return;
    }

    // Try next URL in the list
    if (urlIndex < MUSIC_URLS.length - 1) {
      console.log(`Audio source ${urlIndex} failed, trying next mirror...`);
      setIsRetrying(true);
      setUrlIndex(prev => prev + 1);
    } else {
      console.error("All audio sources failed.");
      setHasError(true);
      setIsPlaying(false);
      setIsRetrying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSource(url);
      setHasError(false);
      setIsRetrying(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-auto flex flex-col items-end gap-2">
      <audio 
        ref={audioRef} 
        src={currentSrc} 
        loop 
        preload="auto" 
        onError={handleError}
      />
      
      {hasError && (
        <label className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-900/90 border border-red-500 text-red-100 text-xs cursor-pointer hover:bg-red-800 transition-all shadow-lg mb-2 animate-fade-in z-50">
          <Upload size={14} />
          <span className="font-bold">Music missing? Upload MP3</span>
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}

      {isRetrying && !hasError && (
         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 text-amber-200 text-xs mb-2 animate-pulse">
           <RefreshCw size={12} className="animate-spin" />
           <span>Loading local magic...</span>
         </div>
      )}

      <button
        onClick={toggleMusic}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md border transition-all duration-300 group
          ${isPlaying 
            ? 'bg-amber-900/40 border-amber-500/50 text-amber-200 hover:bg-amber-900/60' 
            : 'bg-slate-900/80 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          }
          ${hasError ? 'border-red-500/50 text-red-400' : ''}
        `}
        title={hasError ? "Music Error" : (isPlaying ? "Pause Music" : "Play Music")}
      >
        {isPlaying ? (
          <>
            <div className="relative">
              <Volume2 size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-amber-400 blur-sm opacity-30 animate-pulse"></div>
            </div>
            <span className="hidden sm:inline font-serif text-sm tracking-wide">Magic On</span>
          </>
        ) : (
          <>
            <VolumeX size={20} />
            <span className="hidden sm:inline font-serif text-sm tracking-wide">
                {hasError ? "Silence" : "Magic Off"}
            </span>
          </>
        )}
      </button>
    </div>
  );
});

BackgroundMusic.displayName = "BackgroundMusic";