// src/components/StartScreen/StartScreen.js
import React from "react";
import "./StartScreen.css";

// Import aset yang kita butuhkan untuk layar ini
import iconPesawat from "../../assets/images/Plane.png";
import gambarLangit from "../../assets/images/sky.jpg";

//Import tree cloud
import "../../Scenery.css";

function StartScreen({ onStart }) {
  return (
    // Container utama dengan background langit biru
    <div
      className="start-screen-container"
      style={{ backgroundImage: `url(${gambarLangit})` }}
    >
      {/* Elemen awan bergerak */}
      <div className="clouds-css">
        <div className="cloud-css cloud-css-1"></div>
        <div className="cloud-css cloud-css-2"></div>
        <div className="cloud-css cloud-css-3"></div>
      </div>

      {/* Elemen pohon di bagian bawah */}
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
            </svg>
          </div>
        </div>
      </div>

      {/* Wrapper untuk konten di tengah (judul & tombol) */}
      <div className="start-content-wrapper">
        <img
          src={iconPesawat}
          alt="Ucup Airways"
          className="start-plane-icon"
        />
        <h1 className="start-title">Ucup Ucupan</h1>{" "}
        {/* Judul bisa disesuaikan lagi */}
        <button className="start-button" onClick={onStart}>
          START
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
