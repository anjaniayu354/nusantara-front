"use client";

import React, { useState, useRef, useEffect } from "react";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Disc3,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Music2,
} from "lucide-react";

interface MusicPlayerProps {
  geoTrackId?: string;
  geoNextTrackId?: string | null;
  geoRegionName?: string;
  isOverview?: boolean;
}

export function MusicPlayer({
  geoTrackId,
  geoNextTrackId,
  geoRegionName,
  isOverview,
}: MusicPlayerProps = {}) {
  const defaultIndex = AUDIO_TRACKS.findIndex((t) => t.isDefault);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(
    defaultIndex !== -1 ? defaultIndex : 0
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // Upward drop-up card state
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [queuedNextTrackId, setQueuedNextTrackId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeTrackItemRef = useRef<HTMLButtonElement | null>(null);
  const queuedNextTrackRef = useRef<string | null>(null);
  const lastGeoTrackIdRef = useRef<string | undefined>(undefined);
  const userPausedRef = useRef<boolean>(false);

  const currentTrack: AudioTrack =
    AUDIO_TRACKS[currentTrackIndex] || AUDIO_TRACKS[0];

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    userPausedRef.current = false;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.log("Audio play awaiting gesture:", err);
        });
    }
  };

  // Initialize and handle volume/loop state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.loop = isLooping;
  }, [volume, isMuted, isLooping]);

  // Click outside to close drop-up
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Auto-scroll active track item into view inside playlist
  useEffect(() => {
    if (isExpanded && activeTrackItemRef.current) {
      activeTrackItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isExpanded, currentTrackIndex]);

  // Autoplay default song immediately on page load, with capture-phase fallback on any user gesture
  useEffect(() => {
    let isDisposed = false;

    const tryAutoPlay = () => {
      if (isDisposed) return;
      const audio = audioRef.current;
      if (!audio) return;
      if (!userPausedRef.current) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (!isDisposed) {
                setIsPlaying(true);
                setHasInteracted(true);
              }
            })
            .catch(() => {
              // Browser autoplay policy awaiting user gesture
            });
        }
      }
    };

    // 1. Attempt playback immediately upon page load
    tryAutoPlay();

    // 2. Short staggered retries in case media is still buffering
    const t1 = setTimeout(tryAutoPlay, 100);
    const t2 = setTimeout(tryAutoPlay, 500);
    const t3 = setTimeout(tryAutoPlay, 1200);

    // 3. Capture-phase listeners across the entire document so map drags/clicks aren't suppressed by stopPropagation
    const gestureEvents = [
      "pointerdown",
      "mousedown",
      "touchstart",
      "click",
      "keydown",
      "wheel",
    ];

    const handleGesture = () => {
      tryAutoPlay();
    };

    gestureEvents.forEach((evt) => {
      document.addEventListener(evt, handleGesture, { capture: true, passive: true });
    });

    return () => {
      isDisposed = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      gestureEvents.forEach((evt) => {
        document.removeEventListener(evt, handleGesture, { capture: true } as any);
      });
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      playAudio();
    }
  };

  const handleNextTrack = () => {
    // If a chained transition track was queued (e.g. Jawa Barat: Pajajaran -> Pencak Silat)
    if (queuedNextTrackRef.current) {
      const nextId = queuedNextTrackRef.current;
      queuedNextTrackRef.current = null;
      setQueuedNextTrackId(null);
      const nextIdx = AUDIO_TRACKS.findIndex((t) => t.id === nextId);
      if (nextIdx !== -1) {
        switchTrack(nextIdx);
        return;
      }
    }
    const nextIndex = (currentTrackIndex + 1) % AUDIO_TRACKS.length;
    switchTrack(nextIndex);
  };

  const handlePrevTrack = () => {
    queuedNextTrackRef.current = null;
    setQueuedNextTrackId(null);
    const prevIndex =
      (currentTrackIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    switchTrack(prevIndex);
  };

  const switchTrack = (index: number) => {
    userPausedRef.current = false;
    setCurrentTrackIndex(index);
    setCurrentTime(0);
  };

  // Sync with dynamic geographical location track
  useEffect(() => {
    if (!geoTrackId) return;

    if (geoTrackId !== lastGeoTrackIdRef.current) {
      lastGeoTrackIdRef.current = geoTrackId;
      const targetIndex = AUDIO_TRACKS.findIndex((t) => t.id === geoTrackId);
      if (targetIndex !== -1) {
        setQueuedNextTrackId(geoNextTrackId || null);
        queuedNextTrackRef.current = geoNextTrackId || null;
        userPausedRef.current = false; // Unpause and automatically play regional track

        if (targetIndex !== currentTrackIndex) {
          switchTrack(targetIndex);
        } else {
          // Track is already active, ensure it is playing
          if (audioRef.current && audioRef.current.paused) {
            playAudio();
          }
        }
      }
    } else if (geoNextTrackId !== queuedNextTrackRef.current) {
      setQueuedNextTrackId(geoNextTrackId || null);
      queuedNextTrackRef.current = geoNextTrackId || null;
    }
  }, [geoTrackId, geoNextTrackId, currentTrackIndex]);

  // Update audio source and play when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetSrc = encodeURI(currentTrack.src);

    if (audio.getAttribute("src") !== targetSrc) {
      audio.src = targetSrc;
      audio.load();
    }

    if (!userPausedRef.current) {
      playAudio();
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
      ref={containerRef}
      className="relative select-none"
      role="region"
      aria-label="Pemutar Musik Latar Budaya Nusantara"
    >
      {/* Hidden audio element with continuous loop */}
      <audio
        ref={audioRef}
        src={encodeURI(currentTrack.src)}
        autoPlay
        playsInline
        loop={!queuedNextTrackId && isLooping}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={() => {
          if (!userPausedRef.current) {
            playAudio();
          }
        }}
        onEnded={() => {
          if (queuedNextTrackRef.current) {
            const nextId = queuedNextTrackRef.current;
            queuedNextTrackRef.current = null;
            setQueuedNextTrackId(null);
            const nextIdx = AUDIO_TRACKS.findIndex((t) => t.id === nextId);
            if (nextIdx !== -1) {
              switchTrack(nextIdx);
              return;
            }
          }
          if (isLooping && audioRef.current) {
            audioRef.current.currentTime = 0;
            playAudio();
          } else {
            handleNextTrack();
          }
        }}
      />

      {/* Upward Drop-Up Playlist Popover Card */}
      {isExpanded && (
        <div className="absolute bottom-full mb-3 left-0 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-slate-950/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-3 sm:p-3.5 shadow-2xl text-amber-50 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <ListMusic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  Musik Budaya Nusantara
                  <span className="text-[10px] font-mono font-normal bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                    {AUDIO_TRACKS.length} Lagu
                  </span>
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Tutup daftar lagu"
              title="Tutup drop up"
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Map DJ Location Indicator */}
          {geoRegionName && (
            <div className="flex items-center justify-between px-2 py-1 mb-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px]">
              <span className="text-amber-300 font-medium flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                Auto-DJ: <span className="font-bold text-white truncate">{geoRegionName}</span>
              </span>
              {queuedNextTrackId && (
                <span className="text-[9px] text-amber-200 font-mono bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0 ml-1">
                  ➔ Lanjut: Pencak Silat
                </span>
              )}
            </div>
          )}

          {/* Current Playing Mini Bar */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-950 border border-amber-500/20 mb-3 shadow-inner">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-400/90 flex items-center gap-1">
                    <Music2 className="w-2.5 h-2.5" /> Sedang Diputar
                  </span>
                  {currentTrack.region && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-amber-200 font-mono">
                      {currentTrack.region}
                    </span>
                  )}
                </div>
                <h4
                  className="text-xs font-bold text-white truncate"
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-amber-200/70 truncate">
                  {currentTrack.subtitle}
                </p>
              </div>

              {/* Mini Controls */}
              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={handlePrevTrack}
                  aria-label="Lagu sebelumnya"
                  title="Lagu sebelumnya"
                  className="p-1 rounded-full text-slate-400 hover:text-amber-300 transition"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Jeda" : "Putar"}
                  className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNextTrack}
                  aria-label="Lagu berikutnya"
                  title="Lagu berikutnya"
                  className="p-1 rounded-full text-slate-400 hover:text-amber-300 transition"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden cursor-pointer my-2"
              onClick={(e) => {
                if (!audioRef.current || duration === 0) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = clickPos * duration;
              }}
            >
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full transition-all"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Timestamps & Extra Controls */}
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono text-amber-300/80">
                {formatSeconds(currentTime)} / {formatSeconds(duration || 0)}
              </span>

              <div className="flex items-center gap-2">
                {/* Loop Toggle */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  aria-label={isLooping ? "Matikan loop" : "Aktifkan loop"}
                  title={isLooping ? "Loop aktif" : "Loop nonaktif"}
                  className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded transition ${
                    isLooping
                      ? "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Repeat className="w-2.5 h-2.5" /> Loop
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Bunyikan" : "Bisukan"}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3 h-3 text-rose-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-amber-400" />
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
                    className="w-14 sm:w-16 h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Playlist Header */}
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
              Pilih Lagu (Scroll)
            </span>
            <span className="text-[9px] text-slate-500">
              Klik judul untuk memutar
            </span>
          </div>

          {/* Scrollable Playlist List */}
          <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {AUDIO_TRACKS.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  ref={isCurrent ? activeTrackItemRef : null}
                  onClick={() => switchTrack(idx)}
                  className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between gap-2.5 group cursor-pointer ${
                    isCurrent
                      ? "bg-amber-500/20 border border-amber-500/50 shadow-sm"
                      : "bg-slate-900/60 hover:bg-slate-800/90 border border-white/5 hover:border-amber-500/30"
                  }`}
                >
                  {/* Left: Indicator & Title */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Track Number / Playing Wave Indicator */}
                    <div className="w-5 flex items-center justify-center shrink-0">
                      {isCurrent ? (
                        isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3.5">
                            <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                            <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-3.5" />
                            <span className="w-1 bg-amber-400 rounded-full animate-bounce h-2" />
                          </div>
                        ) : (
                          <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400 transition">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs truncate block ${
                            isCurrent
                              ? "font-semibold text-amber-200"
                              : "font-medium text-slate-200 group-hover:text-amber-100"
                          }`}
                        >
                          {track.title}
                        </span>
                        {track.region && (
                          <span className="shrink-0 text-[8px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                            {track.region}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">
                        {track.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration or Active Badge */}
                  <div className="shrink-0 text-right">
                    {isCurrent && isPlaying ? (
                      <span className="inline-flex text-[9px] font-medium text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Memutar
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                        {track.duration || "--:--"}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Docked Bar: Integrated within the Unified Bottom Footer */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-white">
        {/* Spinning Disc / Visualizer Icon */}
        <div
          className={`flex items-center justify-center p-1 rounded-full ${
            isPlaying ? "text-amber-400" : "text-slate-400"
          }`}
          title="Pemutar Backsound Budaya Nusantara"
        >
          <Disc3
            className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3.5s" }}
          />
        </div>

        {/* Previous Track Mini Button */}
        <button
          onClick={handlePrevTrack}
          aria-label="Lagu sebelumnya"
          title="Lagu sebelumnya"
          className="p-1 rounded-full text-slate-400 hover:text-white transition active:scale-90"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

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

        {/* Next Track Button */}
        <button
          onClick={handleNextTrack}
          aria-label="Lagu berikutnya"
          title="Lagu berikutnya"
          className="p-1 rounded-full text-slate-400 hover:text-white transition active:scale-90"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Playlist List Button Trigger (Buka daftar pilihan lagu / drop up) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Tutup daftar lagu" : "Buka daftar lagu (Drop up)"}
          title="Daftar lagu (Drop up)"
          className={`p-1 sm:px-1.5 rounded-md transition flex items-center gap-1 text-xs ${
            isExpanded
              ? "bg-amber-500/20 text-amber-300 font-semibold"
              : "text-slate-300 hover:text-amber-300 hover:bg-white/5"
          }`}
        >
          <ListMusic className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline text-[11px]">Playlist</span>
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

        {/* Expand / Collapse Chevron */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Ciutkan panel audio" : "Buka kontrol & daftar audio"}
          title={isExpanded ? "Ciutkan" : "Daftar lagu"}
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
