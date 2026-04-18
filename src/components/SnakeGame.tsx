/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const speedRef = useRef(INITIAL_SPEED);
  const lastUpdateRef = useRef(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    speedRef.current = INITIAL_SPEED;
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (isGameOver || !gameStarted) return;

    if (time - lastUpdateRef.current < speedRef.current) {
      requestAnimationFrame(update);
      return;
    }
    lastUpdateRef.current = time;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const next = s + 10;
          onScoreUpdate(next);
          return next;
        });
        setFood(generateFood(newSnake));
        speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    requestAnimationFrame(update);
  }, [direction, food, isGameOver, gameStarted, generateFood, onScoreUpdate]);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      requestAnimationFrame(update);
    }
  }, [gameStarted, isGameOver, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (canvas.width / GRID_SIZE), 0);
      ctx.lineTo(i * (canvas.width / GRID_SIZE), canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * (canvas.height / GRID_SIZE));
      ctx.lineTo(canvas.width, i * (canvas.height / GRID_SIZE));
      ctx.stroke();
    }

    // Draw snake
    ctx.shadowBlur = 15;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : '#00a3ba';
      ctx.shadowColor = '#00f3ff';
      const x = segment.x * (canvas.width / GRID_SIZE);
      const y = segment.y * (canvas.width / GRID_SIZE);
      const size = canvas.width / GRID_SIZE - 2;
      ctx.fillRect(x + 1, y + 1, size, size);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    const fx = food.x * (canvas.width / GRID_SIZE);
    const fy = food.y * (canvas.width / GRID_SIZE);
    const fsize = canvas.width / GRID_SIZE - 2;
    ctx.beginPath();
    ctx.arc(fx + fsize / 2 + 1, fy + fsize / 2 + 1, fsize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-cyber-black rounded-lg overflow-hidden border border-white/10 p-2 w-full max-w-[400px] aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full rounded cursor-none"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-neon-cyan mb-6 text-glow-cyan uppercase tracking-widest">Neon Snake</h2>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan rounded-full font-bold hover:bg-neon-cyan hover:text-black transition-all shadow-neon-cyan uppercase tracking-wider"
            >
              Start Mission
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-neon-magenta mb-2 text-glow-magenta uppercase tracking-widest leading-tight">System Failure</h2>
            <p className="text-white/60 mb-8 font-mono">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-neon-magenta/20 border-2 border-neon-magenta text-neon-magenta rounded-full font-bold hover:bg-neon-magenta hover:text-black transition-all shadow-neon-magenta uppercase tracking-wider"
            >
              System Reboot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
