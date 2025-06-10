import React, { useState, useEffect, useRef } from "react";
import "./RepairMinigame.css";

// Siapkan gambar-gambar ini di folder assets kamu
import gearImage from "../../assets/images/gear.png";
import plankImage from "../../assets/images/plank.png";
import screwImage from "../../assets/images/screw.png";
import boltImage from "../../assets/images/bolt.png"; // <-- Siapkan gambar ini

const GAME_DURATION = 25000; // Waktu diperpanjang jadi 25 detik

// Daftar semua komponen yang mungkin muncul
const ALL_PARTS = [
  { id: "p1", type: "gear", image: gearImage },
  { id: "p2", type: "plank", image: plankImage },
  { id: "p3", type: "screw", image: screwImage },
  { id: "p4", type: "gear", image: gearImage },
  { id: "p5", type: "bolt", image: boltImage },
  { id: "p6", type: "plank", image: plankImage },
];

// Data untuk zona drop, tanpa posisi
const ZONES_DATA = [
  { id: "z1", accepts: "gear", filled: null },
  { id: "z2", accepts: "plank", filled: null },
  { id: "z3", accepts: "screw", filled: null },
  { id: "z4", accepts: "gear", filled: null },
  { id: "z5", accepts: "bolt", filled: null },
  { id: "z6", accepts: "plank", filled: null },
];

// Helper function untuk mengacak array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

function RepairMinigame({ onGameEnd }) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [parts, setParts] = useState([]);
  const [zones, setZones] = useState([]);
  const endTimeRef = useRef(Date.now() + GAME_DURATION);

  // --- PERUBAHAN 1: Logika untuk mengacak posisi zona saat game dimulai ---
  useEffect(() => {
    // Daftar kemungkinan posisi dalam grid 2x3
    const possiblePositions = [
      { top: "15%", left: "10%" },
      { top: "15%", left: "40%" },
      { top: "15%", left: "70%" },
      { top: "60%", left: "10%" },
      { top: "60%", left: "40%" },
      { top: "60%", left: "70%" },
    ];

    const shuffledPositions = shuffleArray([...possiblePositions]);

    const initialZones = ZONES_DATA.map((zone, index) => ({
      ...zone,
      ...shuffledPositions[index], // Berikan posisi yang sudah diacak
    }));

    setZones(initialZones);
    setParts(shuffleArray([...ALL_PARTS])); // Acak juga urutan parts yang ditampilkan
  }, []);

  // Timer
  useEffect(() => {
    if (zones.length === 0) return; // Jangan jalankan timer jika zona belum siap

    const timerInterval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        clearInterval(timerInterval);
        onGameEnd(false);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 100);
    return () => clearInterval(timerInterval);
  }, [onGameEnd, zones]);

  const handleDragStart = (e, part) => {
    e.dataTransfer.setData("partId", part.id);
    e.dataTransfer.setData("partType", part.type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const partId = e.dataTransfer.getData("partId");
    const partType = e.dataTransfer.getData("partType");

    const zone = zones.find((z) => z.id === zoneId);
    if (zone && !zone.filled && zone.accepts === partType) {
      const newZones = zones.map((z) =>
        z.id === zoneId ? { ...z, filled: partType } : z
      );
      setZones(newZones);
      setParts((prevParts) => prevParts.filter((p) => p.id !== partId));

      const allFilled = newZones.every((z) => z.filled);
      if (allFilled) {
        onGameEnd(true);
      }
    }
  };

  return (
    <div className="minigame-overlay">
      <div className="repair-minigame-container">
        <div className="repair-header">
          <span>Pasang Komponen!</span>
          <span>Waktu: {timeLeft}s</span>
        </div>

        <div className="repair-main-area">
          <div className="parts-panel">
            <h3>Komponen</h3>
            <div className="parts-grid">
              {parts.map((part) => (
                <img
                  key={part.id}
                  id={part.id}
                  src={part.image}
                  alt={part.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, part)}
                  className="draggable-part"
                />
              ))}
            </div>
          </div>
          <div className="blueprint-panel">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`drop-zone ${zone.filled ? "filled" : ""} type-${
                  zone.accepts
                }`}
                style={{ top: zone.top, left: zone.left }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, zone.id)}
              >
                {zone.filled && (
                  <img
                    src={ALL_PARTS.find((p) => p.type === zone.filled).image}
                    alt={zone.filled}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepairMinigame;
