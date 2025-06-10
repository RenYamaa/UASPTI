import React, { useState, useEffect, useRef } from "react";
import "./InitialScreen.css";
import "../../Scenery.css";

import char1 from "../../assets/images/1.jpg";
import char2 from "../../assets/images/2.jpg";
import char3 from "../../assets/images/3.jpg";
import char4 from "../../assets/images/4.jpg";
import char5 from "../../assets/images/5.jpg";
import char6 from "../../assets/images/6.jpg";
import char7 from "../../assets/images/7.jpg";
import char8 from "../../assets/images/8.jpg";

import iconPesawat from "../../assets/images/Plane.png";
import gambarLangit from "../../assets/images/sky.jpg";

const CHARACTERS_DATA = [
  { id: "char1", name: "Luna", imageSrc: char1 },
  { id: "char2", name: "Miko", imageSrc: char2 },
  { id: "char3", name: "Riko", imageSrc: char3 },
  { id: "char4", name: "Sasa", imageSrc: char4 },
  { id: "char5", name: "Nina", imageSrc: char5 },
  { id: "char6", name: "Zio", imageSrc: char6 },
  { id: "char7", name: "Kira", imageSrc: char7 },
  { id: "char8", name: "Tama", imageSrc: char8 },
];

function InitialScreen({ onStartGame }) {
  const [playerName, setPlayerName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentView, setCurrentView] = useState("greeting"); // 'greeting', 'character'
  const [fadeState, setFadeState] = useState("fade-in");

  const totalSlides = CHARACTERS_DATA.length;
  const isClickable = useRef(true);

  const handleNext = () => {
    if (!isClickable.current) return;
    isClickable.current = false;
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    if (!isClickable.current) return;
    isClickable.current = false;
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    if (currentIndex === totalSlides) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 400);
    } else if (currentIndex === -1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalSlides - 1);
      }, 400);
    } else if (
      !isTransitioning &&
      (currentIndex === 0 || currentIndex === totalSlides - 1)
    ) {
      setTimeout(() => {
        setIsTransitioning(true);
        isClickable.current = true;
      }, 50);
    } else {
      setTimeout(() => {
        isClickable.current = true;
      }, 400);
    }
  }, [currentIndex, totalSlides, isTransitioning]);

  const handleStartGame = () => {
    if (playerName.trim() === "") {
      alert("Nama tidak boleh kosong ya!");
      return;
    }
    const realIndex = currentIndex % totalSlides;
    const selectedCharacter = CHARACTERS_DATA[realIndex];
    onStartGame(playerName, selectedCharacter.id);
  };

  const proceedToCharacterSelect = () => {
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentView("character");
      setFadeState("fade-in");
    }, 500); // Durasi sama dengan animasi
  };

  const slidesToRender = [
    CHARACTERS_DATA[totalSlides - 1],
    ...CHARACTERS_DATA,
    CHARACTERS_DATA[0],
  ];

  const initialOffset = -100;
  const slideOffset = initialOffset - currentIndex * 100;

  return (
    <div
      className="initial-screen-container"
      style={{ backgroundImage: `url(${gambarLangit})` }}
    >
      <div className="clouds-css">
        <div className="cloud-css cloud-css-1"></div>
        <div className="cloud-css cloud-css-2"></div>
        <div className="cloud-css cloud-css-3"></div>
      </div>
      <div className="trees-container">
        <div className="tree">
          <div className="tree-trunk"></div>
          <div className="tree-canopy tree-canopy-1"></div>
          <div className="tree-canopy tree-canopy-2"></div>
          <div className="tree-canopy tree-canopy-3"></div>
        </div>
        <div className="tree tree-style-2">
          <div className="tree-trunk"></div>
          <div className="tree-canopy-svg">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="30" r="25" fill="darkgreen" />
              <circle cx="30" cy="50" r="25" fill="green" />
              <circle cx="70" cy="50" r="25" fill="green" />
              <circle cx="50" cy="60" r="25" fill="darkolivegreen" />
            </svg>
          </div>
        </div>
      </div>

      {currentView === "greeting" && (
        <div className={`greeting-container ${fadeState}`}>
          <h1>Halo, Selamat Datang di Dunia Ucup!</h1>
          <p>
            Jelajahi dunia yang luas, penuhi kebutuhan hidupmu, dan selesaikan
            berbagai aktivitas seru. Selamat bermain!
          </p>
          <button onClick={proceedToCharacterSelect}>START</button>
        </div>
      )}

      {currentView === "character" && (
        <div className={`main-content ${fadeState}`}>
          <img src={iconPesawat} alt="Ucup Airways" className="plane-icon" />
          <h1 className="game-title">Ucup Ucupan</h1>
          <div className="character-slider">
            <p className="select-prompt">Pilih Avatarmu:</p>
            <div className="slider-wrapper">
              <button onClick={handlePrev} className="slider-arrow prev-arrow">
                ◀
              </button>
              <div className="slider-viewport">
                <div
                  className={`slider-filmstrip ${
                    !isTransitioning ? "no-transition" : ""
                  }`}
                  style={{ transform: `translateX(${slideOffset}%)` }}
                >
                  {slidesToRender.map((character, index) => (
                    <div
                      className="character-slide"
                      key={`${character.id}-${index}`}
                    >
                      <img
                        src={character.imageSrc}
                        alt={character.name}
                        className="character-image"
                      />
                      <p className="character-name">{character.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleNext} className="slider-arrow next-arrow">
                ▶
              </button>
            </div>
          </div>
          <input
            type="text"
            className="player-name-input"
            placeholder="Enter your name here..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button className="start-exploring-button" onClick={handleStartGame}>
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
}

export default InitialScreen;
