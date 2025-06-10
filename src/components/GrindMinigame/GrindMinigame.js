import React, { useState, useEffect, useRef } from "react";
import "./GrindMinigame.css";

const GAME_DURATION = 15000; // 15 detik

function GrindMinigame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const crankRef = useRef(null);
  const lastAngleRef = useRef(0);
  const totalRotationRef = useRef(0);
  const endTimeRef = useRef(Date.now() + GAME_DURATION);

  // Timer utama
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        clearInterval(timerInterval);
        onGameEnd(Math.floor(totalRotationRef.current / 360)); // Skor = jumlah putaran
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 100);
    return () => clearInterval(timerInterval);
  }, [onGameEnd]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const crankBox = crankRef.current.getBoundingClientRect();
    const centerX = crankBox.left + crankBox.width / 2;
    const centerY = crankBox.top + crankBox.height / 2;
    const angle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    lastAngleRef.current = angle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const crankBox = crankRef.current.getBoundingClientRect();
    const centerX = crankBox.left + crankBox.width / 2;
    const centerY = crankBox.top + crankBox.height / 2;
    const angle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    let angleDiff = angle - lastAngleRef.current;

    // Handle a large jump when crossing the -180/180 degree boundary
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    totalRotationRef.current += Math.abs(angleDiff);
    setRotation((prev) => prev + angleDiff);
    lastAngleRef.current = angle;
  };

  return (
    <div
      className="minigame-overlay"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="grind-minigame-container">
        <div className="grind-header">
          <span>Putaran: {Math.floor(totalRotationRef.current / 360)}</span>
          <span>Waktu: {timeLeft}s</span>
        </div>
        <div className="grind-game-area">
          <div className="grind-stone-top"></div>
          <div className="grind-stone-bottom"></div>
          <div
            ref={crankRef}
            className="crank-container"
            style={{ transform: `rotate(${rotation}deg)` }}
            onMouseDown={handleMouseDown}
          >
            <div className="crank-arm"></div>
            <div className="crank-handle"></div>
          </div>
        </div>
        <div className="grind-instructions">
          Klik dan putar tuas secepat mungkin!
        </div>
      </div>
    </div>
  );
}

export default GrindMinigame;
