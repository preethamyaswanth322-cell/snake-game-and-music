/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Target, Activity, Cpu, Zap } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden scanline">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/5 blur-[120px] rounded-full"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-7xl w-full flex flex-col gap-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-neon-cyan animate-pulse" />
              <span className="text-[10px] font-mono text-neon-cyan tracking-[0.3em] uppercase">System Online // Grid-77</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              Neon<span className="text-neon-cyan text-glow-cyan">Groove</span>
            </h1>
          </div>
          
          <div className="flex gap-6 mt-6 md:mt-0">
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Session Data</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white font-mono">{score.toString().padStart(4, '0')}</span>
                <span className="text-xs text-neon-cyan uppercase font-bold tracking-tighter">PTS</span>
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-6">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Archive Max</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white/60 font-mono">{highScore.toString().padStart(4, '0')}</span>
                <span className="text-xs text-white/40 uppercase font-bold tracking-tighter">MAX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Stats & Modules */}
          <div className="xl:col-span-3 order-2 xl:order-1 h-full flex flex-col gap-4">
            <div className="bg-cyber-grey/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Target size={20} className="text-neon-cyan" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Navigation</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-white/40 font-mono uppercase">Controls</span>
                  <span className="text-xs text-white/80 font-mono">ARROWS</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-white/40 font-mono uppercase">Audio</span>
                  <span className="text-xs text-white/80 font-mono">ENABLED</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-white/40 font-mono uppercase">Neural Link</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-1 h-3 bg-neon-cyan/40 rounded-full animate-pulse-fast" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neon-magenta/10 to-transparent border border-neon-magenta/20 rounded-2xl p-6 relative overflow-hidden group">
              <Activity className="text-neon-magenta mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">Stability Mode</h3>
              <p className="text-xs text-white/40 font-mono leading-relaxed">
                Adaptive difficulty engine active. Speed correlates with rhythmic precision.
              </p>
            </div>
          </div>

          {/* Center Column: Game */}
          <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col items-center gap-8">
            <SnakeGame onScoreUpdate={handleScoreUpdate} />
          </div>

          {/* Right Column: Info & Extra */}
          <div className="xl:col-span-3 order-3 flex flex-col gap-4">
            <div className="bg-cyber-grey/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Cpu size={20} className="text-neon-magenta" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Hardware</h2>
                </div>
                <div className="text-[10px] font-mono text-white/60 space-y-2 uppercase leading-loose">
                  <p className="flex justify-between"><span>Core.v1</span> <span className="text-neon-green">OK</span></p>
                  <p className="flex justify-between"><span>Mem.77</span> <span className="text-neon-green">OK</span></p>
                  <p className="flex justify-between"><span>Gfx.Lnk</span> <span className="text-neon-green">OVR_CLK</span></p>
                  <p className="flex justify-between"><span>Syn.Aud</span> <span className="text-neon-cyan">SYNC...</span></p>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Area: Music Player */}
        <div className="mt-8 flex justify-center">
          <MusicPlayer />
        </div>

        <div className="flex justify-center gap-8 mt-12 pb-8 opacity-20 hover:opacity-100 transition-opacity">
          {['Cyberpunk', 'Rhythm', 'Snake', 'Synth'].map(tag => (
            <span key={tag} className="text-[10px] font-mono tracking-[0.5em] uppercase text-white">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

