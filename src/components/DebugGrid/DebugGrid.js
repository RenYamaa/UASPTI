import React from 'react';
import './DebugGrid.css';

function DebugGrid({ mapLayout, tileSize }) {
  if (!mapLayout) {
    return null;
  }

  return (
    <div className="debug-grid-container">
      {mapLayout.map((row, rowIndex) =>
        row.map((tileValue, colIndex) => {
          let tileType = 'walkable'; // Default bisa dilewati
          if (tileValue === 2) {
            tileType = 'wall'; // Tipe dinding/kolisi
          } else if (tileValue === 3) {
            tileType = 'special'; // Tipe spesial seperti pintu
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`debug-tile ${tileType}`}
              style={{
                left: `${colIndex * tileSize}px`,
                top: `${rowIndex * tileSize}px`,
                width: `${tileSize}px`,
                height: `${tileSize}px`,
              }}
            >
              <span>{tileValue}</span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default DebugGrid;