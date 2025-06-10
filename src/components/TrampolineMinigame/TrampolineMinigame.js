import React, { useState, useEffect, useRef } from "react";
import "./TrampolineMinigame.css";

const GAME_DURATION = 15000;

function TrampolineMinigame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [barPosition, setBarPosition] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isShaking, setIsShaking] = useState(false); // State untuk efek getar

  const barRef = useRef(null);
  const directionRef = useRef(1);
  const speedRef = useRef(2); // Kecepatan awal
  const animationFrameRef = useRef();
  const endTimeRef = useRef(Date.now() + GAME_DURATION);

  // Timer utama
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        clearInterval(timerInterval);
        onGameEnd(score);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 100);
    return () => clearInterval(timerInterval);
  }, [onGameEnd, score]);

  // --- PERUBAHAN 1: Logika kecepatan acak ---
  useEffect(() => {
    const changeSpeedInterval = setInterval(() => {
      // Hasilkan kecepatan baru antara 1.5 dan 4.5
      speedRef.current = Math.random() * 3 + 1.5;
    }, 3000); // Ganti kecepatan setiap 3 detik

    return () => clearInterval(changeSpeedInterval);
  }, []);

  // Animasi bar yang bergerak
  useEffect(() => {
    const animateBar = () => {
      setBarPosition((prev) => {
        // Gunakan kecepatan dari ref
        let newPos = prev + speedRef.current * directionRef.current;
        if (newPos > 100 || newPos < 0) {
          directionRef.current *= -1;
          newPos = prev + speedRef.current * directionRef.current;
        }
        return newPos;
      });
      animationFrameRef.current = requestAnimationFrame(animateBar);
    };
    animationFrameRef.current = requestAnimationFrame(animateBar);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // Event listener untuk spasi
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        checkJump();
      }
    };

    const checkJump = () => {
      // --- PERUBAHAN 1: Memicu efek getar ---
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      const currentPos = barPosition;
      let currentFeedback = "";
      if (currentPos >= 40 && currentPos <= 60) {
        setScore((prev) => prev + 10);
        currentFeedback = "SEMPURNA!";
      } else if (currentPos >= 25 && currentPos <= 75) {
        setScore((prev) => prev + 5);
        currentFeedback = "Bagus!";
      } else {
        currentFeedback = "Meleset!";
      }

      setFeedback(currentFeedback);
      setTimeout(() => setFeedback(""), 500);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [barPosition]);

  return (
    <div className="minigame-overlay">
      <div
        className={`trampoline-minigame-container ${isShaking ? "shake" : ""}`}
      >
        <div className="trampoline-header">
          <span>Skor: {score}</span>
          <span>Waktu: {timeLeft}s</span>
        </div>
        <div className="trampoline-instructions">
          Tekan SPASI saat bar di zona hijau!
        </div>
        <div className="trampoline-game-area">
          <div className="jump-track">
            <div className="jump-zone good"></div>
            <div className="jump-zone perfect"></div>
            <div
              ref={barRef}
              className="jump-bar"
              style={{ bottom: `${barPosition}%` }}
            ></div>
          </div>
          {feedback && <div className="jump-feedback">{feedback}</div>}
        </div>
      </div>
    </div>
  );
}

export default TrampolineMinigame;
