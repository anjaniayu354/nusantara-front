"use client";

import React, { useState, useRef, useEffect } from "react";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Disc3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // Sleek pill docked parallel to BMKG by default
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack: AudioTrack = AUDIO_TRACKS[currentTrackIndex];

  // Initialize and handle volume/loop state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.loop = true; // Ensure continuous loop
  }, [volume, isMuted]);

  // Attempt autoplay on first user interaction anywhere
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!hasInteracted && audioRef.current && !isPlaying) {
        setHasInteracted(true);
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay interaction prevented:", err);
          });
      }
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
    };
  }, [hasInteracted, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => console.error("Playback failed:", err));
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % AUDIO_TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
  };

  // Reload track when changed
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.src;
    audioRef.current.load();
    if (isPlaying || hasInteracted) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Track switch autoplay blocked:", err));
    }
  }, [currentTrackIndex]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="relative select-none"
      role="region"
      aria-label="Pemutar Musik Latar Budaya Nusantara"
    >
      {/* Hidden audio element with continuous infinite loop */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
          }
        }}
      />

      {/* Upward Expanded Popover Card (opens directly above the pill when toggled) */}
      {isExpanded && (
        <div className="absolute bottom-full mb-2 left-0 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 shadow-2xl text-amber-50 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Backsound Gamelan
              </span>
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono">
                <Repeat className="w-2.5 h-2.5" /> Loop
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Tutup panel lagu"
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Track Title */}
          <div className="mb-2">
            <h4
              className="text-xs font-bold text-white truncate"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </h4>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
              <span className="truncate max-w-[170px] text-amber-200/80">
                {currentTrack.subtitle}
              </span>
              <span className="font-mono">
                {formatSeconds(currentTime)} / {formatSeconds(duration)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden cursor-pointer mb-2.5"
            onClick={(e) => {
              if (!audioRef.current || duration === 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = clickPos * duration;
            }}
          >
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Bunyikan audio" : "Bisukan audio"}
                className="text-slate-400 hover:text-white transition p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume musik"
                className="w-20 h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Track Switcher */}
            <div className="flex gap-1">
              {AUDIO_TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTrackIndex(idx)}
                  className={`text-[9px] px-2 py-0.5 rounded font-medium transition ${
                    currentTrackIndex === idx
                      ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {idx === 0 ? "Track 1" : "Track 2"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Docked Pill: Positioned Parallel to BMKG Bar at the Bottom */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-full px-3 py-2 shadow-2xl text-white flex items-center gap-2 sm:gap-2.5">
        {/* Spinning Disc / Visualizer Icon */}
        <div
          className={`flex items-center justify-center p-1 rounded-full ${
            isPlaying ? "text-amber-400" : "text-slate-400"
          }`}
          title="Pemutar Backsound Budaya Nusantara (Looping)"
        >
          <Disc3
            className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3.5s" }}
          />
        </div>

        {/* Play / Pause Mini Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
          className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow transition active:scale-90"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        {/* Current Song Title */}
        <span
          className="text-xs font-medium text-amber-100 max-w-[100px] sm:max-w-[150px] truncate"
          title={currentTrack.title}
        >
          {currentTrack.title}
        </span>

        {/* Next Track Button */}
        <button
          onClick={handleNextTrack}
          aria-label="Lagu berikutnya"
          title="Ganti ke lagu berikutnya"
          className="p-1 rounded-full text-slate-400 hover:text-white transition"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Bunyikan audio" : "Bisukan audio"}
          title={isMuted ? "Bunyikan" : "Bisukan"}
          className="p-1 rounded-full text-slate-400 hover:text-white transition"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          )}
        </button>

        {/* Expand / Collapse Details Chevron */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Ciutkan panel audio" : "Buka kontrol audio lengkap"}
          title={isExpanded ? "Ciutkan" : "Kontrol lengkap"}
          className="p-1 rounded-full text-slate-400 hover:text-white transition"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
