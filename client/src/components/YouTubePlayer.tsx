import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, 
  Maximize, CheckCircle, ChevronLeft, ChevronRight, Gauge
} from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  startTime?: number; 
  endTime?: number;   
  currentTimestamp?: number;
  onTimeUpdate?: (seconds: number) => void;
  onLessonComplete?: () => void;
  isCompleted?: boolean;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevLesson?: boolean;
  hasNextLesson?: boolean;
  lessonTitle: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  startTime = 0,
  endTime,
  currentTimestamp,
  onTimeUpdate,
  onLessonComplete,
  isCompleted,
  onPrevLesson,
  onNextLesson,
  hasPrevLesson,
  hasNextLesson,
  lessonTitle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(startTime);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    if (playerRef.current && playerRef.current.destroy) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
    }

    const playerId = `yt_player_${Math.random().toString(36).substring(7)}`;
    const tempDiv = document.createElement('div');
    tempDiv.id = playerId;
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(tempDiv);

    try {
      playerRef.current = new window.YT.Player(playerId, {
        videoId,
        playerVars: {
          start: Math.floor(startTime),
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          controls: 1,
          fs: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            if (startTime > 0) {
              event.target.seekTo(startTime, true);
            }
          },
          onStateChange: (event: any) => {

            if (event.data === 1) {
              setIsPlaying(true);
              startTracking();
            } else {
              setIsPlaying(false);
              stopTracking();
            }
          }
        }
      });
    } catch (err) {
      console.warn('YouTube Player init error:', err);
    }

    return () => {
      stopTracking();
    };
  }, [videoId, isApiReady]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(startTime, true);
        setPlaybackTime(startTime);
      } catch (e) {}
    }
  }, [startTime]);

  useEffect(() => {
    if (currentTimestamp !== undefined && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(currentTimestamp, true);
        setPlaybackTime(currentTimestamp);
      } catch (e) {}
    }
  }, [currentTimestamp]);

  const startTracking = () => {
    stopTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = Math.floor(playerRef.current.getCurrentTime());
        setPlaybackTime(time);
        if (onTimeUpdate) {
          onTimeUpdate(time);
        }
      }
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSeekDelta = (deltaSeconds: number) => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      const current = playerRef.current.getCurrentTime();
      const target = Math.max(0, current + deltaSeconds);
      playerRef.current.seekTo(target, true);
      setPlaybackTime(target);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(speed);
      setPlaybackRate(speed);
    }
  };

  return (
    <div className="bg-[#101014] border-2 border-[#101014] shadow-neo text-white flex flex-col">
      <div className="bg-[#101014] px-4 py-2.5 border-b border-white/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 truncate">
          <span className="w-2.5 h-2.5 bg-[#FFD21C] inline-block animate-pulse"></span>
          <span className="font-heading text-sm font-bold truncate text-white uppercase">
            {lessonTitle}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2 py-0.5 bg-white/10 text-[#FFD21C] border border-white/20 font-bold">
            CURRENT: {formatTime(playbackTime)}
          </span>
          {endTime ? (
            <span className="text-[#F1F0E9]/60">
              [SPAN: {formatTime(startTime)} - {formatTime(endTime)}]
            </span>
          ) : null}
        </div>
      </div>
      <div className="relative aspect-video w-full bg-black">
        <div ref={containerRef} className="w-full h-full">
        </div>
      </div>
      <div className="p-3 bg-[#101014] border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSeekDelta(-10)}
            className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center space-x-1"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFD21C]" />
            <span className="text-[10px] font-bold">10s</span>
          </button>

          <button
            onClick={() => handleSeekDelta(10)}
            className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center space-x-1"
            title="Forward 10 seconds"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#FFD21C]" />
            <span className="text-[10px] font-bold">10s</span>
          </button>
          <div className="flex items-center space-x-1 pl-2 border-l border-white/20">
            <Gauge className="w-3.5 h-3.5 text-[#A77AF5]" />
            {[1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-1.5 py-0.5 text-[10px] border transition-all ${
                  playbackRate === spd
                    ? 'bg-[#FFD21C] text-[#101014] font-black border-[#FFD21C]'
                    : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/15'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasPrevLesson && (
            <button
              onClick={onPrevLesson}
              className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PREV</span>
            </button>
          )}
          {onLessonComplete && (
            <button
              onClick={onLessonComplete}
              className={`flex items-center space-x-1.5 px-3 py-1 font-heading text-xs font-black border-2 transition-all ${
                isCompleted
                  ? 'bg-[#35D68B] text-[#101014] border-[#35D68B] shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-[#FFD21C] text-[#101014] border-white shadow-[2px_2px_0px_#FFFFFF] hover:bg-[#FFE066]'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? 'fill-[#101014]' : ''}`} />
              <span>{isCompleted ? 'COMPLETED' : 'MARK COMPLETE'}</span>
            </button>
          )}
          {hasNextLesson && (
            <button
              onClick={onNextLesson}
              className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
