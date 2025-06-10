// src/App.js
import React, { useState } from "react";
import "./App.css";

// Import semua komponen layar kita
import StartScreen from "./components/StartScreen/StartScreen";
import InitialScreen from "./components/InitialScreen/InitialScreen";
import MainGameArena from "./components/MainGameArena/MainGameArena";

function App() {
  const [currentScreen, setCurrentScreen] = useState("start");
  const [playerInfo, setPlayerInfo] = useState({ name: "", avatar: "" });
  const [isFading, setIsFading] = useState(false);

  const handleStartClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentScreen("initial");
      setIsFading(false);
    }, 500);
  };

  // --- DIUBAH: Fungsi ini sekarang juga menangani transisi fade-out ---
  const handleCharacterSelect = (name, avatar) => {
    console.log("Karakter dipilih!", name, avatar);
    setPlayerInfo({ name, avatar });

    // 1. Mulai animasi fade-out
    setIsFading(true);

    // 2. Setelah animasi selesai, baru pindah ke layar game
    setTimeout(() => {
      setCurrentScreen("game");
      setIsFading(false); // Reset state agar tidak memengaruhi layar berikutnya
    }, 500); // Durasi harus sama dengan durasi animasi di CSS
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "start":
        return (
          <div className={isFading ? "screen-fade-out" : ""}>
            <StartScreen onStart={handleStartClick} />
          </div>
        );
      case "initial":
        // --- DIUBAH: Dibungkus dengan div untuk animasi fade-out ---
        return (
          <div className={isFading ? "screen-fade-out" : ""}>
            <InitialScreen onStartGame={handleCharacterSelect} />
          </div>
        );
      case "game":
        return <MainGameArena playerInfo={playerInfo} />;
      default:
        return <StartScreen onStart={handleStartClick} />;
    }
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;
