"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaUndo,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { FiMaximize, FiMinimize, FiLayout } from "react-icons/fi";

interface CourseVideoPlayerProps {
  isWide?: boolean;
  onWideToggle?: () => void;
}

export default function CourseVideoPlayer({
  isWide = false,
  onWideToggle,
}: CourseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!hasStarted) {
          setHasStarted(true);
        }
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsEnded(false);
          })
          .catch((error) => {
            console.error("Playback failed: ", error);
          });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleFullscreen = useCallback(async () => {
    const nextFullscreen = !isFullscreen;
    setIsFullscreen(nextFullscreen);

    try {
      if (nextFullscreen) {
        const docEl = document.documentElement as unknown as {
          requestFullscreen?: () => Promise<void>;
          webkitRequestFullscreen?: () => Promise<void>;
        };
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      } else {
        const customDoc = document as unknown as {
          exitFullscreen?: () => Promise<void>;
          webkitExitFullscreen?: () => Promise<void>;
        };
        if (customDoc.exitFullscreen) {
          await customDoc.exitFullscreen();
        } else if (customDoc.webkitExitFullscreen) {
          await customDoc.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed: ", err);
    }
  }, [isFullscreen]);

  const resetActivityTimeout = () => {
    setShowControls(true);
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    if (isPlaying && !isHoveringControls) {
      activityTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === videoRef.current) {
      togglePlay();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isNaN(video.duration)) {
      setDuration(video.duration);
    }
    setCurrentTime(video.currentTime);

    const onPlay = () => {
      setIsPlaying(true);
      setIsEnded(false);
      setHasStarted(true);
      setShowControls(true);
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
      setShowControls(true);
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onLoadedMetadata);
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onLoadedMetadata);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as unknown as { webkitFullscreenElement?: Element };
      const activeElement =
        document.fullscreenElement || doc.webkitFullscreenElement;
      setIsFullscreen(!!activeElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFullscreen]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isOut = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsSticky(isOut);
      },
      { threshold: [0, 1] },
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, []);

  useEffect(() => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    if (isPlaying && !isHoveringControls) {
      activityTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [isPlaying, isHoveringControls]);

  const containerClasses = [
    "bg-black group overflow-hidden transition-all duration-300 border border-neutral-200/50",
    isFullscreen
      ? "player-fullscreen"
      : isSticky
        ? "fixed top-0 left-0 right-0 z-40 w-full rounded-none border-none shadow-xl aspect-video md:relative md:w-full md:rounded-lg md:border md:border-neutral-200/50"
        : "relative w-full aspect-video rounded-lg",
  ].join(" ");

  return (
    <div className="relative w-full">
      <div
        ref={sentinelRef}
        className="absolute -top-1 left-0 w-full h-0 pointer-events-none"
      />

      {isSticky && !isFullscreen && (
        <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-lg md:hidden" />
      )}

      <div
        ref={playerRef}
        className={containerClasses}
        onMouseMove={resetActivityTimeout}
        onTouchStart={resetActivityTimeout}
        onClick={handleContainerClick}
      >
        <video
          ref={videoRef}
          src="https://vjs.zencdn.net/v/oceans.mp4#t=1"
          className="w-full h-full object-cover"
          controls={false}
          preload="metadata"
          playsInline
        />

        {(!hasStarted || isEnded) && (
          <div
            className="absolute inset-0 z-10 flex flex-col justify-between p-6 cursor-pointer bg-black/20 transition-all duration-500"
            onClick={togglePlay}
          >
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-20 w-20 rounded-full bg-white/20 animate-ping opacity-75" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all duration-300 group/btn cursor-pointer"
                  aria-label={isEnded ? "Replay video" : "Play video"}
                >
                  {isEnded ? (
                    <FaUndo className="w-6 h-6 text-[#2D2D2D] transition-transform duration-500 group-hover/btn:rotate-180" />
                  ) : (
                    <FaPlay className="w-6 h-6 ml-1 text-[#2D2D2D] transition-transform duration-300 group-hover/btn:scale-110" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {hasStarted && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => setIsHoveringControls(false)}
          >
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Video Seek Scrubber"
              className="video-scrubber w-full h-1 bg-white/20 rounded appearance-none cursor-pointer accent-[#6ABD8A]"
              style={{
                background: `linear-gradient(to right, #6ABD8A 0%, #6ABD8A ${
                  (currentTime / (duration || 1)) * 100
                }%, rgba(255,255,255,0.2) ${
                  (currentTime / (duration || 1)) * 100
                }%, rgba(255,255,255,0.2) 100%)`,
              }}
            />

            <div className="flex items-center justify-between mt-1 text-white select-none">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="hover:text-[#6ABD8A] transition-colors cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <FaPause className="w-4 h-4" />
                  ) : (
                    <FaPlay className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="hover:text-[#6ABD8A] transition-colors cursor-pointer"
                    aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute className="w-5 h-5" />
                    ) : (
                      <FaVolumeUp className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume Slider"
                    className="w-0 overflow-hidden group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/20 accent-[#6ABD8A] rounded appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {onWideToggle && (
                  <button
                    onClick={onWideToggle}
                    className="hidden md:block hover:text-[#6ABD8A] transition-colors cursor-pointer"
                    title={isWide ? "Normal Mode" : "Wide Mode"}
                    aria-label={isWide ? "Normal Mode" : "Wide Mode"}
                  >
                    <FiLayout
                      className={`w-5 h-5 ${isWide ? "text-[#6ABD8A]" : ""}`}
                    />
                  </button>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-[#6ABD8A] transition-colors cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <FiMinimize className="w-5 h-5" />
                  ) : (
                    <FiMaximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
