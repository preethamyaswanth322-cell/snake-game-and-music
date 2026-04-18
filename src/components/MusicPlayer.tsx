/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Gen - Synthia',
    duration: 184,
    coverUrl: 'https://picsum.photos/seed/cyber/200/200',
    genre: 'Synthwave',
  },
  {
    id: '2',
    title: 'Neon Rain',
    artist: 'AI Gen - LofiBot',
    duration: 215,
    coverUrl: 'https://picsum.photos/seed/neon/200/200',
    genre: 'Chillhop',
  },
  {
    id: '3',
    title: 'Glitch Core',
    artist: 'AI Gen - DataDrain',
    duration: 162,
    coverUrl: 'https://picsum.photos/seed/glitch/200/200',
    genre: 'Industrial',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => (prev >= currentTrack.duration ? 0 : prev + 1));
      }, 1000);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl bg-cyber-grey/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-magenta/10 blur-[60px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/10 blur-[60px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="relative group">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 rounded-full border-4 border-white/5 relative overflow-hidden shadow-neon-magenta"
          >
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-cyber-black rounded-full border-2 border-white/20"></div>
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-neon-magenta p-2 rounded-full shadow-lg">
            <Music size={16} className="text-black" />
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {currentTrack.title}
                </motion.span>
              </AnimatePresence>
            </h3>
            <p className="text-neon-cyan font-mono text-sm tracking-widest uppercase">{currentTrack.artist}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta shadow-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / currentTrack.duration) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <button 
              onClick={skipBackward}
              className="p-2 text-white/60 hover:text-neon-cyan transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-neon-cyan transition-all transform hover:scale-110 shadow-lg shadow-neon-cyan/20"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
            </button>
            <button 
              onClick={skipForward}
              className="p-2 text-white/60 hover:text-neon-cyan transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Volume2 size={16} className="text-white/40" />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white/40"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Disc size={14} className={`text-neon-magenta ${isPlaying ? 'animate-spin-slow' : ''}`} />
           <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{currentTrack.genre} ENGINE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
