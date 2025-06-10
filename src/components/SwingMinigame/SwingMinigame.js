import React, { useState, useEffect, useRef } from "react";
import "./SwingMinigame.css";

const GAME_DURATION = 15000; // 15 detik

function SwingMinigame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [swingAngle, setSwingAngle] = useState(0);
  const [momentum, setMomentum] = useState(10); // Kecepatan awal ayunan
  const [keyPrompt, setKeyPrompt] = useState(null); // Tombol yang harus ditekan ('A' atau 'D')

  const animationFrameRef = useRef();
  const endTimeRef = useRef(Date.now() + GAME_DURATION);
  const lastPressTimeRef = useRef(0);
  const swingPhaseRef = useRef(0);

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

  // Animasi ayunan
  useEffect(() => {
    const animateSwing = (timestamp) => {
      swingPhaseRef.current += momentum / 1000;
      const newAngle = Math.sin(swingPhaseRef.current) * momentum * 1.5;
      setSwingAngle(newAngle);

      // Tampilkan prompt di puncak ayunan
      if (Math.abs(newAngle) > momentum * 1.4 && !keyPrompt) {
        setKeyPrompt(newAngle > 0 ? "A" : "D");
      } else if (Math.abs(newAngle) < 10) {
        setKeyPrompt(null);
      }

      // Kurangi momentum secara alami
      setMomentum((prev) => Math.max(5, prev * 0.999));

      animationFrameRef.current = requestAnimationFrame(animateSwing);
    };
    animationFrameRef.current = requestAnimationFrame(animateSwing);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [momentum, keyPrompt]);

  // Event listener untuk keyboard
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase();
      if (key !== "A" && key !== "D") return;

      // Mencegah spam tombol
      const now = Date.now();
      if (now - lastPressTimeRef.current < 200) return;
      lastPressTimeRef.current = now;

      if (key === keyPrompt) {
        setScore((prev) => prev + 10);
        setMomentum((prev) => Math.min(60, prev + 5)); // Tambah momentum
        setKeyPrompt(null); // Hilangkan prompt setelah berhasil
      } else {
        setMomentum((prev) => Math.max(5, prev - 5)); // Kurangi momentum jika salah tekan
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyPrompt]);

  return (
    <div className="minigame-overlay">
      <div className="swing-minigame-container">
        <div className="swing-header">
          <span>Skor: {score}</span>
          <span>Waktu: {timeLeft}s</span>
        </div>
        <div className="swing-game-area">
          <div className="swing-pivot"></div>
          <div
            className="swing-rope"
            style={{ transform: `rotate(${swingAngle}deg)` }}
          >
            <div className="swing-seat"></div>
          </div>
          {keyPrompt && <div className="swing-prompt">{keyPrompt}</div>}
        </div>
        <div className="swing-instructions">
          Tekan A dan D sesuai petunjuk untuk berayun!
        </div>
      </div>
    </div>
  );
}

export default SwingMinigame;
