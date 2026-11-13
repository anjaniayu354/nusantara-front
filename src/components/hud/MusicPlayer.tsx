"use client";

import React, { useState, useRef, useEffect } from "react";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import { Volume2, VolumeX, Play, Pause, SkipForward, Music2, Repeat, Disc3, ChevronDown, ChevronUp } from "lucide-react";

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack: AudioTrack = AUDIO_TRACKS[currentTrackIndex];

  // Initialize and handle play state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.loop = true; // Ensure continuous loop
  }, [volume, isMuted]);

  // Attempt autoplay on first user interaction anywhere on the window
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

  // When track index changes, reload and play
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
      className="fixed bottom-24 left-4 z-30 transition-all duration-300"
      role="region"
      aria-label="Pemutar Musik Latar Budaya Nusantara"
    >
      {/* Hidden audio element with continuous loop */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          // Continuous loop guarantee
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
          }
        }}
      />

      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-2xl text-amber-50 w-72 sm:w-80 transition-all">
        {/* Header bar of music player */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isPlaying ? "bg-amber-500/20 text-amber-400 animate-pulse" : "bg-white/5 text-slate-400"}`}>
              <Disc3 className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                Backsound Nusantara
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono">
                  <Repeat className="w-2.5 h-2.5" /> Loop
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Ciutkan pemutar musik" : "Perluas pemutar musik"}
            className="p-1 rounded-md hover:bg-white/10 text-slate-300 transition"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Track Title & Artist */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white truncate max-w-[200px]" title={currentTrack.title}>
              {currentTrack.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </span>
          </div>
          <p className="text-[10px] text-amber-200/80 truncate">{currentTrack.subtitle}</p>
        </div>

        {/* Animated Sound Wave Equalizer (when playing) */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-3 mb-2 px-1">
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-full" style={{ animationDelay: "0.1s", animationDuration: "0.6s" }}></span>
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-2/3" style={{ animationDelay: "0.3s", animationDuration: "0.8s" }}></span>
            <span className="w-1 bg-amber-500 rounded-full animate-pulse h-4/5" style={{ animationDelay: "0.2s", animationDuration: "0.5s" }}></span>
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-1/2" style={{ animationDelay: "0.4s", animationDuration: "0.7s" }}></span>
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-full" style={{ animationDelay: "0.15s", animationDuration: "0.9s" }}></span>
            <span className="w-1 bg-amber-500 rounded-full animate-pulse h-3/4" style={{ animationDelay: "0.25s", animationDuration: "0.6s" }}></span>
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-2/3" style={{ animationDelay: "0.35s", animationDuration: "0.8s" }}></span>
          </div>
        )}

        {/* Collapsed quick controls or Expanded full controls */}
        {isExpanded ? (
          <div className="space-y-2 pt-1">
            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden cursor-pointer"
                 onClick={(e) => {
                   if (!audioRef.current || duration === 0) return;
                   const rect = e.currentTarget.getBoundingClientRect();
                   const clickPos = (e.clientX - rect.left) / rect.width;
                   audioRef.current.currentTime = clickPos * duration;
                 }}>
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Playback & Volume row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Play / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
                  className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  aria-label="Ganti lagu berikutnya"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition"
                  title="Ganti ke lagu berikutnya"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Bunyikan audio" : "Bisukan audio"}
                  className="text-slate-400 hover:text-white transition"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume musik"
                  className="w-16 h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Track Selector buttons */}
            <div className="pt-1 flex gap-1">
              {AUDIO_TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTrackIndex(idx)}
                  className={`text-[9px] px-2 py-1 rounded truncate flex-1 text-center font-medium transition ${
                    currentTrackIndex === idx
                      ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {idx === 0 ? "🎵 Rising (Utama)" : "🎶 Dance of Nusantara"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Mini compact bar */
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={togglePlay}
              className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? "Jeda" : "Putar"}</span>
            </button>
            <span className="text-[10px] text-amber-300/80">Looping aktif</span>
          </div>
        )}
      </div>
    </div>
  );
}
