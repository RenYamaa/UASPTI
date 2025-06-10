import React, { useState, useEffect, useRef } from "react";
import "./CaveMinigame.css";

import targetImage from "../../assets/images/elemens/elemens/items map 1/gold.png";
import potionImage from "../../assets/images/potion.png"; // <-- Import gambar potion

const GAME_DURATION = 15000;

function CaveMinigame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [targets, setTargets] = useState([]);
  const [collectedSpecial, setCollectedSpecial] = useState(false);

  const endTimeRef = useRef(Date.now() + GAME_DURATION);
  const hasSpawnedSpecialRef = useRef(false);

  // Timer utama
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        clearInterval(timerInterval);
        onGameEnd({ score, collectedSpecialItem: collectedSpecial });
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 100);
    return () => clearInterval(timerInterval);
  }, [onGameEnd, score, collectedSpecial]);

  // Memunculkan target baru
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const isSpecial = Math.random() < 0.15 && !hasSpawnedSpecialRef.current; // 15% chance, hanya sekali
      if (isSpecial) {
        hasSpawnedSpecialRef.current = true;
      }

      const newTarget = {
        id: Date.now(),
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        isSpecial: isSpecial,
      };
      setTargets((prevTargets) => [...prevTargets, newTarget].slice(-7));
    }, 800);

    return () => clearInterval(spawnInterval);
  }, []);

  const handleTargetClick = (target) => {
    if (target.isSpecial) {
      setCollectedSpecial(true);
    } else {
      setScore((prevScore) => prevScore + 1);
    }
    setTargets((prevTargets) => prevTargets.filter((t) => t.id !== target.id));
  };

  return (
    <div className="minigame-overlay">
      <div className="minigame-container">
        <div className="minigame-header">
          <span>Skor: {score}</span>
          <span>Waktu: {timeLeft}s</span>
        </div>
        <div className="minigame-area">
          {targets.map((target) => (
            <img
              key={target.id}
              src={target.isSpecial ? potionImage : targetImage}
              alt={target.isSpecial ? "Potion" : "Target"}
              className={`minigame-target ${target.isSpecial ? "special" : ""}`}
              style={{ top: target.top, left: target.left }}
              onClick={() => handleTargetClick(target)}
            />
          ))}
        </div>
        <div className="minigame-instructions">
          Klik Koin sebanyak mungkin! Awas ada item langka!
        </div>
      </div>
    </div>
  );
}

export default CaveMinigame;
