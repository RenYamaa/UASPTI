import React, { useState, useEffect, useRef, useCallback } from "react";
import bgmFile from "../../assets/images/audio/bgm.mp3";
const bgm = new Audio(bgmFile);
import "./MainGameArena.css";
import "../../Scenery.css";

import DebugGrid from "../DebugGrid/DebugGrid";
import CaveMinigame from "../CaveMinigame/CaveMinigame";
import TrampolineMinigame from "../TrampolineMinigame/TrampolineMinigame";
import SwingMinigame from "../SwingMinigame/SwingMinigame";
import GrindMinigame from "../GrindMinigame/GrindMinigame";
import RepairMinigame from "../RepairMinigame/RepairMinigame";

import map1Background from "../../assets/images/map1.png";
import spritesheet1 from "../../assets/images/spritesheet1.png";
import spritesheet2 from "../../assets/images/spritesheet2.png";
import spritesheet3 from "../../assets/images/spritesheet3.png";
import spritesheet4 from "../../assets/images/spritesheet4.png";
import spritesheet5 from "../../assets/images/spritesheet5.png";
import spritesheet6 from "../../assets/images/spritesheet6.png";
import spritesheet7 from "../../assets/images/spritesheet7.png";
import spritesheet8 from "../../assets/images/spritesheet8.png";

import goldImage from "../../assets/images/elemens/elemens/items map 1/gold.png";
import misteriApelImage from "../../assets/images/elemens/elemens/items map 1/misteri apel.png";
import shopInteriorImage from "../../assets/images/shopinside.png";
import homeInteriorImage from "../../assets/images/homeinside.png";
import playgroundInteriorImage from "../../assets/images/castleinside.png";
import windmillInteriorImage from "../../assets/images/windmillinside.png";
import caveVideo from "../../assets/images/insidecave.mp4";

const RARE_ITEMS = {
  potion: {
    id: "rare_potion",
    name: "Potion Ajaib",
    price: 1000,
    sellable: true,
    effect: { stat: "happiness", value: 50 },
  },
  souvenir: {
    id: "rare_souvenir",
    name: "Souvenir Antik",
    price: 2000,
    sellable: true,
    effect: null,
  },
};

const SHOP_ITEMS = [
  {
    id: "kopi",
    name: "Kopi",
    price: 150,
    sellable: true,
    effect: { stat: "sleep", value: 20 },
  },
  {
    id: "buku",
    name: "Buku",
    price: 300,
    sellable: true,
    effect: { stat: "happiness", value: 25 },
  },
  {
    id: "sabun",
    name: "Sabun",
    price: 100,
    sellable: true,
    effect: { stat: "cleanliness", value: 40 },
  },
  {
    id: "energi_drink",
    name: "Energi Drink",
    price: 250,
    sellable: true,
    effect: { stat: "sleep", value: 35 },
  },
  {
    id: "cokelat",
    name: "Cokelat",
    price: 120,
    sellable: true,
    effect: { stat: "happiness", value: 15 },
  },
];

const ITEM_TYPES = [
  { id: "gold", name: "Gold", image: goldImage, value: 200, sellable: false },
  {
    id: "misteri_apel",
    name: "Misteri Apel",
    image: misteriApelImage,
    buyPrice: 0,
    sellable: false,
  },
];

const MAX_INVENTORY_SIZE = 20;
const SPAWN_INTERVAL = 10000;
const TILE_SIZE = 55;
const MAP_DIMENSIONS = { width: 16, height: 16 };
const CHARACTER_SIZE = 55;
const MOVE_COOLDOWN = 150;

const activityZones = {
  3: { zoneName: "Windmill", actions: [] },
  4: { zoneName: "Playground", actions: [] },
  5: { zoneName: "Shop", actions: [] },
  6: { zoneName: "Home", actions: [] },
};

const mapLayout = [
  [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 2, 2, 2, 1, 1, 0, 1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 2, 2, 2, 1, 1, 0, 1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 2, 2, 2, 1, 1, 0, 1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 2, 3, 2, 1, 0, 0, 0, 1, 2, 4, 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1],
  [1, 1, 2, 2, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
  [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
];

const avatarMap = {
  char1: spritesheet1,
  char2: spritesheet2,
  char3: spritesheet3,
  char4: spritesheet4,
  char5: spritesheet5,
  char6: spritesheet6,
  char7: spritesheet7,
  char8: spritesheet8,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initialStats = {
  meal: 50,
  sleep: 50,
  happiness: 50,
  cleanliness: 50,
  money: 0,
};
const initialGameTime = { day: 1, hours: 6, minutes: 0 };
const initialPosition = { x: 7, y: 7 };
const initialActivityLog = {};

function MainGameArena({ playerInfo }) {
  const [stats, setStats] = useState(initialStats);
  const [gameTime, setGameTime] = useState(initialGameTime);
  const [position, setPosition] = useState(initialPosition);
  const [inventory, setInventory] = useState([]);
  const [spawnedItems, setSpawnedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activityLog, setActivityLog] = useState(initialActivityLog);

  const [direction, setDirection] = useState("down");
  const [isWalking, setIsWalking] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [notification, setNotification] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentWeather, setCurrentWeather] = useState("sunny");
  const [weatherParticles, setWeatherParticles] = useState([]);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInsideShop, setIsInsideShop] = useState(false);
  const [shopAnimationClass, setShopAnimationClass] = useState("");

  const [isInsideHome, setIsInsideHome] = useState(false);
  const [homeAnimationClass, setHomeAnimationClass] = useState("");

  const [isInsidePlayground, setIsInsidePlayground] = useState(false);
  const [playgroundAnimationClass, setPlaygroundAnimationClass] = useState("");

  const [isInsideWindmill, setIsInsideWindmill] = useState(false);
  const [windmillAnimationClass, setWindmillAnimationClass] = useState("");

  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showCaveMinigame, setShowCaveMinigame] = useState(false);
  const [showTrampolineMinigame, setShowTrampolineMinigame] = useState(false);
  const [showSwingMinigame, setShowSwingMinigame] = useState(false);
  const [showGrindMinigame, setShowGrindMinigame] = useState(false);
  const [showRepairMinigame, setShowRepairMinigame] = useState(false);
  const [animateIceCream, setAnimateIceCream] = useState(false);
  const videoRef = useRef(null);

  const [showInventory, setShowInventory] = useState(true);
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);
  const [showDebugGrid, setShowDebugGrid] = useState(false);

  const notificationTimeoutRef = useRef(null);
  const keysPressed = useRef(new Set());
  const lastMoveTime = useRef(0);
  const playerSpritesheet = avatarMap[playerInfo.avatar] || spritesheet1;
  const gameLoopRef = useRef();

  useEffect(() => {
    const savedHighScore = localStorage.getItem("ucupUcupanHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    const assetsToLoad = [
      map1Background,
      ...Object.values(avatarMap),
      goldImage,
      misteriApelImage,
      shopInteriorImage,
      homeInteriorImage,
      playgroundInteriorImage,
      windmillInteriorImage,
    ];
    let loadedCount = 0;

    assetsToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      const onAssetLoad = () => {
        loadedCount++;
        if (loadedCount === assetsToLoad.length) {
          setIsLoading(false);
        }
      };
      img.onload = onAssetLoad;
      img.onerror = onAssetLoad;
    });
  }, []);

  useEffect(() => {
    bgm.volume = volume;
  }, [volume]);

  const logActivity = useCallback((activityName) => {
    setActivityLog((prevLog) => ({
      ...prevLog,
      [activityName]: (prevLog[activityName] || 0) + 1,
    }));
  }, []);

  const handleRestartGame = () => {
    setStats(initialStats);
    setGameTime(initialGameTime);
    setPosition(initialPosition);
    setInventory([]);
    setSpawnedItems([]);
    setScore(0);
    setActivityLog(initialActivityLog);
    setIsGameOver(false);
    setIsBusy(false);
    setIsInsideShop(false);
    setIsInsideHome(false);
    setIsInsidePlayground(false);
    setIsInsideWindmill(false);
    showNotification("Memulai petualangan baru!");
  };

  const fastForwardTime = (minutesToAdvance) => {
    setGameTime((prevTime) => {
      let newMinutes = prevTime.minutes + minutesToAdvance;
      let newHours = prevTime.hours;
      let newDay = prevTime.day;

      while (newMinutes >= 60) {
        newMinutes -= 60;
        newHours += 1;
        while (newHours >= 24) {
          newHours -= 24;
          newDay += 1;
          setScore((prevScore) => prevScore + 100);
          logActivity("Hari Berlalu");
        }
      }
      return { day: newDay, hours: newHours, minutes: newMinutes };
    });
  };

  useEffect(() => {
    if (isGameOver) return;
    const { meal, sleep, happiness, cleanliness } = stats;
    if (meal <= 0 || sleep <= 0 || happiness <= 0 || cleanliness <= 0) {
      setIsGameOver(true);
      setIsBusy(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("ucupUcupanHighScore", score.toString());
        showNotification("High Score Baru Tercapai!");
      }
    }
  }, [stats, isGameOver, score, highScore]);

  useEffect(() => {
    if (isLoading) return;
    bgm.loop = true;
    bgm.play().catch((e) => console.log("BGM auto-play dicegah browser:", e));
    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [isLoading]);

  useEffect(() => {
    if (isBusy || isLoading) return;
    const timeInterval = setInterval(() => fastForwardTime(1), 1000);
    return () => clearInterval(timeInterval);
  }, [isBusy, isLoading]);

  useEffect(() => {
    if (isBusy || isLoading) return;
    const statsDecayInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        meal: Math.max(0, prev.meal - 1),
        sleep: Math.max(0, prev.sleep - 1),
        happiness: Math.max(0, prev.happiness - 1),
        cleanliness: Math.max(0, prev.cleanliness - 1),
      }));
    }, 15000);
    return () => clearInterval(statsDecayInterval);
  }, [isBusy, isLoading]);

  useEffect(() => {
    if (isBusy || isLoading) return;
    const spawnNewItem = () => {
      const walkableTiles = [];
      mapLayout.forEach((row, y) =>
        row.forEach((tile, x) => {
          if (tile === 0 || tile === 1) walkableTiles.push({ x, y });
        })
      );
      if (walkableTiles.length === 0) return;
      const randomSpot =
        walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
      const randomItemType =
        ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
      const newItem = {
        ...randomItemType,
        x: randomSpot.x,
        y: randomSpot.y,
        instanceId: `${randomSpot.x}-${randomSpot.y}-${Date.now()}`,
      };
      setSpawnedItems([newItem]);
    };
    spawnNewItem();
    const intervalId = setInterval(spawnNewItem, SPAWN_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isBusy, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const weatherInterval = setInterval(() => {
      const weathers = ["sunny", "rainy", "snowy"];
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setCurrentWeather(newWeather);
    }, 120000);
    return () => clearInterval(weatherInterval);
  }, [isLoading]);

  useEffect(() => {
    if (currentWeather === "rainy" || currentWeather === "snowy") {
      const particles = Array.from({ length: 50 }).map(() => ({
        id: Math.random(),
        style: {
          left: `${Math.random() * 100}%`,
          animationDuration: `${
            (currentWeather === "rainy" ? 0.4 : 5) +
            Math.random() * (currentWeather === "rainy" ? 0.2 : 5)
          }s`,
          animationDelay: `${Math.random() * 5}s`,
        },
        type: currentWeather,
      }));
      setWeatherParticles(particles);
    } else {
      setWeatherParticles([]);
    }
  }, [currentWeather]);

  const handleMove = useCallback(
    (moveDirection) => {
      if (
        isBusy ||
        isInsideShop ||
        isInsideHome ||
        isInsidePlayground ||
        isInsideWindmill
      )
        return;
      setDirection(moveDirection);
      setPosition((prevPos) => {
        let newPos = { ...prevPos };
        if (moveDirection === "up") newPos.y -= 1;
        else if (moveDirection === "down") newPos.y += 1;
        else if (moveDirection === "left") newPos.x -= 1;
        else if (moveDirection === "right") newPos.x += 1;
        if (
          newPos.x >= 0 &&
          newPos.x < 16 &&
          newPos.y >= 0 &&
          newPos.y < 16 &&
          mapLayout[newPos.y][newPos.x] !== 2
        ) {
          return newPos;
        }
        return prevPos;
      });
    },
    [isBusy, isInsideShop, isInsideHome, isInsidePlayground, isInsideWindmill]
  );

  useEffect(() => {
    if (
      isBusy ||
      isInsideShop ||
      isInsideHome ||
      isInsidePlayground ||
      isInsideWindmill ||
      isLoading
    ) {
      setIsWalking(false);
      return;
    }
    const gameLoop = (timestamp) => {
      if (keysPressed.current.size > 0) {
        if (timestamp - lastMoveTime.current > MOVE_COOLDOWN) {
          handleMove(Array.from(keysPressed.current).pop());
          lastMoveTime.current = timestamp;
        }
        setIsWalking(true);
      } else {
        setIsWalking(false);
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [
    isBusy,
    isInsideShop,
    isInsideHome,
    isInsidePlayground,
    isInsideWindmill,
    isLoading,
    handleMove,
  ]);

  useEffect(() => {
    const keyMap = {
      ArrowUp: "up",
      w: "up",
      ArrowDown: "down",
      s: "down",
      ArrowLeft: "left",
      a: "left",
      ArrowRight: "right",
      d: "right",
    };
    const handleKeyDown = (e) => {
      if (isShopOpen || isBusy || isLoading) return;
      if (keyMap[e.key]) {
        e.preventDefault();
        keysPressed.current.add(keyMap[e.key]);
      }
      if (e.key === "g") setShowDebugGrid((prev) => !prev);
      if (e.key.toLowerCase() === "i") setShowInventory((prev) => !prev);
    };
    const handleKeyUp = (e) => {
      if (keyMap[e.key]) {
        e.preventDefault();
        keysPressed.current.delete(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isBusy, isShopOpen, isLoading]);

  const showNotification = (message, duration = 3000) => {
    if (notificationTimeoutRef.current)
      clearTimeout(notificationTimeoutRef.current);
    setNotification(message);
    notificationTimeoutRef.current = setTimeout(
      () => setNotification(""),
      duration
    );
  };

  useEffect(() => {
    if (isBusy || isLoading) return;
    const tileValue = mapLayout[position.y][position.x];
    const zone = activityZones[tileValue] || null;
    setCurrentZone(zone);

    if (tileValue === 5 && !isInsideShop) {
      setIsInsideShop(true);
      setShopAnimationClass("fade-in-shop");
    }
    if (tileValue === 6 && !isInsideHome) {
      setIsInsideHome(true);
      setHomeAnimationClass("fade-in-home");
    }
    if (tileValue === 4 && !isInsidePlayground) {
      setIsInsidePlayground(true);
      setPlaygroundAnimationClass("fade-in-playground");
    }
    if (tileValue === 3 && !isInsideWindmill) {
      setIsInsideWindmill(true);
      setWindmillAnimationClass("fade-in-windmill");
    }

    const itemOnTile = spawnedItems.find(
      (item) => item.x === position.x && item.y === position.y
    );
    if (itemOnTile) {
      logActivity("Mengambil Item");
      if (itemOnTile.id === "gold") {
        setStats((prev) => ({ ...prev, money: prev.money + itemOnTile.value }));
        setScore((prevScore) => prevScore + 5);
        showNotification(`Kamu mengambil ${itemOnTile.value} gold! (+5 Poin)`);
      } else {
        if (inventory.length < MAX_INVENTORY_SIZE) {
          setInventory((prev) => [
            ...prev,
            { ...itemOnTile, buyPrice: itemOnTile.price || 0 },
          ]);
          setScore((prevScore) => prevScore + 10);
          showNotification(`Kamu mengambil ${itemOnTile.name}! (+10 Poin)`);
        } else {
          showNotification("Inventaris penuh!");
        }
      }
      setSpawnedItems((prev) =>
        prev.filter((item) => item.instanceId !== itemOnTile.instanceId)
      );
    }
  }, [
    position,
    spawnedItems,
    isBusy,
    isInsideShop,
    isInsideHome,
    isInsidePlayground,
    isInsideWindmill,
    isLoading,
    logActivity,
  ]);

  const handleUseItem = async (itemToUse) => {
    if (isBusy) return;
    setIsBusy(true);

    showNotification(`Menggunakan ${itemToUse.name}...`, 2000);
    logActivity(`Menggunakan ${itemToUse.name}`);
    await sleep(2000);

    let timeCost = 0;
    if (itemToUse.id === "misteri_apel") {
      timeCost = 10;
      setStats((prev) => ({ ...prev, meal: Math.min(100, prev.meal + 25) }));
      setScore((prevScore) => prevScore + 15);
      showNotification("Apel dimakan! (+15 Poin)");
    } else {
      timeCost = 5;
      setStats((prev) => ({
        ...prev,
        [itemToUse.effect.stat]: Math.min(
          100,
          prev[itemToUse.effect.stat] + itemToUse.effect.value
        ),
      }));
      setScore((prevScore) => prevScore + 20);
      showNotification(`${itemToUse.name} berhasil digunakan! (+20 Poin)`);
    }

    fastForwardTime(timeCost);
    setInventory((prev) =>
      prev.filter((item) => item.instanceId !== itemToUse.instanceId)
    );
    setIsBusy(false);
  };

  const handleDiscardItem = (itemToDiscard) => {
    if (isBusy) return;
    setInventory((prev) =>
      prev.filter((item) => item.instanceId !== itemToDiscard.instanceId)
    );
    showNotification(`${itemToDiscard.name} dibuang.`);
  };

  const handleVideoEnd = () => {
    const foundGold = Math.floor(Math.random() * 50) + 10;
    setStats((prev) => ({
      ...prev,
      money: prev.money + foundGold,
      cleanliness: Math.max(0, prev.cleanliness - 15),
    }));
    setScore((prevScore) => prevScore + 75);
    logActivity("Menjelajahi Goa (Video)");
    fastForwardTime(60);
    showNotification(
      `Menjelajahi goa dan menemukan ${foundGold} gold! (+75 Poin)`
    );
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
    setShowVideoPlayer(false);
    setIsBusy(false);
  };

  const handleMinigameEnd = (result, gameType) => {
    let timeCost = 30;
    let points = 0;
    if (gameType === "cave") {
      setShowCaveMinigame(false);
      const { score, collectedSpecialItem } = result;
      const reward = score * 50;
      points = score * 20;
      if (reward > 0) {
        setStats((prev) => ({ ...prev, money: prev.money + reward }));
        showNotification(
          `Mini-game selesai! Kamu mendapat ${reward} gold. (+${points} Poin)`
        );
      } else {
        showNotification("Kamu tidak mendapat apa-apa dari mini-game.");
      }
      if (collectedSpecialItem) {
        setInventory((prev) => {
          if (prev.length < MAX_INVENTORY_SIZE) {
            showNotification("Kamu menemukan Potion Ajaib langka!");
            points += 200;
            return [
              ...prev,
              { ...RARE_ITEMS.potion, instanceId: `potion-${Date.now()}` },
            ];
          }
          showNotification("Potion langka ditemukan, tapi inventaris penuh!");
          return prev;
        });
      }
      logActivity("Mini-Game Goa");
    } else if (gameType === "trampoline") {
      setShowTrampolineMinigame(false);
      const happinessGain = Math.floor(result / 2);
      points = result * 3;
      if (happinessGain > 0) {
        setStats((prev) => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + happinessGain),
        }));
        showNotification(
          `Asyik! Kamu mendapat ${happinessGain} kebahagiaan. (+${points} Poin)`
        );
      } else {
        showNotification("Lain kali coba lompat lebih baik!");
      }
      logActivity("Bermain Trampolin");
    } else if (gameType === "swing") {
      setShowSwingMinigame(false);
      const happinessGain = Math.floor(result / 5);
      points = result;
      if (happinessGain > 0) {
        setStats((prev) => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + happinessGain),
        }));
        showNotification(
          `Seru! Kamu mendapat ${happinessGain} kebahagiaan. (+${points} Poin)`
        );
      } else {
        showNotification("Kamu perlu lebih bersemangat!");
      }
      logActivity("Bermain Ayunan");
    } else if (gameType === "grind") {
      setShowGrindMinigame(false);
      const reward = result * 10;
      points = result * 15;
      if (reward > 0) {
        setStats((prev) => ({
          ...prev,
          money: prev.money + reward,
          sleep: Math.max(0, prev.sleep - 5),
        }));
        showNotification(
          `Kerja bagus! Kamu mendapat ${reward} gold. (+${points} Poin)`
        );
      } else {
        showNotification("Kamu tidak menggiling apapun.");
      }
      logActivity("Menggiling Gandum");
    } else if (gameType === "repair") {
      setShowRepairMinigame(false);
      const { success } = result;
      if (success) {
        setStats((prev) => ({
          ...prev,
          money: prev.money + 500,
          sleep: Math.max(0, prev.sleep - 25),
          cleanliness: Math.max(0, prev.cleanliness - 20),
        }));
        points = 500;
        showNotification(
          `Kincir berhasil diperbaiki! Dapat upah 500 gold. (+${points} Poin)`
        );
        timeCost = 180;
        if (Math.random() < 0.25) {
          setInventory((prev) => {
            if (prev.length < MAX_INVENTORY_SIZE) {
              showNotification("Kamu juga menemukan Souvenir Antik!");
              points += 500;
              return [
                ...prev,
                {
                  ...RARE_ITEMS.souvenir,
                  instanceId: `souvenir-${Date.now()}`,
                },
              ];
            }
            showNotification(
              "Souvenir antik ditemukan, tapi inventaris penuh!"
            );
            return prev;
          });
        }
      } else {
        showNotification("Gagal memperbaiki kincir. Coba lagi lain kali.");
      }
      logActivity("Memperbaiki Kincir");
    }
    setScore((prevScore) => prevScore + points);
    fastForwardTime(timeCost);
    setIsBusy(false);
  };

  const handleFastForwardVideo = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 4.0;
    }
  };

  const handleActivityClick = async (action) => {
    if (isBusy) return;
    setIsBusy(true);

    if (action.id === "jelajahi_goa") {
      const chance = Math.random();
      if (chance < 0.5) {
        showNotification(
          "Kamu menemukan sesuatu yang aneh di dalam goa...",
          2000
        );
        await sleep(2000);
        setShowCaveMinigame(true);
      } else {
        showNotification("Mulai menjelajahi goa misterius...", 2000);
        await sleep(2000);
        setShowVideoPlayer(true);
      }
      return;
    }
    if (action.id === "lompat_trampolin") {
      showNotification("Waktunya melompat!", 2000);
      await sleep(2000);
      setShowTrampolineMinigame(true);
      return;
    }
    if (action.id === "main_ayunan") {
      showNotification("Waktunya bermain ayunan!", 2000);
      await sleep(2000);
      setShowSwingMinigame(true);
      return;
    }
    if (action.id === "giling_gandum") {
      showNotification("Waktunya bekerja...", 2000);
      await sleep(2000);
      setShowGrindMinigame(true);
      return;
    }
    if (action.id === "perbaiki_kincir") {
      showNotification("Melihat mesin kincir...", 2000);
      await sleep(2000);
      setShowRepairMinigame(true);
      return;
    }
    if (action.id === "beli_es_krim") {
      if (stats.money >= 50) {
        showNotification("Membeli es krim...");
        setAnimateIceCream(true);
        logActivity("Membeli Es Krim");
        await sleep(1500);
        setStats((prev) => ({
          ...prev,
          money: prev.money - 50,
          happiness: Math.min(100, prev.happiness + 20),
        }));
        setScore((prevScore) => prevScore + 20);
        setAnimateIceCream(false);
        showNotification("Es krimnya enak! (+20 Poin)");
        fastForwardTime(10);
      } else {
        showNotification("Uang tidak cukup untuk beli es krim.");
      }
      setIsBusy(false);
      return;
    }

    let notificationStart = "";
    let notificationDone = "";
    let timeCost = 0;
    let points = 0;
    let activityName = "";
    let runLogic = () => {};

    switch (action.id) {
      case "tidur":
        notificationStart = "Sedang bersiap untuk tidur...";
        timeCost = 480;
        points = 50;
        activityName = "Tidur";
        runLogic = () =>
          setStats((prev) => ({
            ...prev,
            sleep: 100,
            meal: Math.max(0, prev.meal - 20),
            happiness: Math.min(100, prev.happiness + 10),
          }));
        notificationDone = `Tidur nyenyak! (+${points} Poin)`;
        break;
      case "makan_di_rumah":
        notificationStart = "Sedang memasak dan makan...";
        timeCost = 30;
        points = 25;
        activityName = "Makan di Rumah";
        runLogic = () =>
          setStats((prev) => ({
            ...prev,
            meal: Math.min(100, prev.meal + 40),
          }));
        notificationDone = `Makanan rumah memang yang terbaik! (+${points} Poin)`;
        break;
      case "ganti_baju":
        notificationStart = "Sedang mencari baju bersih...";
        timeCost = 15;
        points = 10;
        activityName = "Ganti Baju";
        runLogic = () => setStats((prev) => ({ ...prev, cleanliness: 100 }));
        notificationDone = `Wangi dan bersih! (+${points} Poin)`;
        break;
      default:
        notificationDone = `Aktivitas belum bisa dilakukan.`;
    }

    if (notificationStart) {
      showNotification(notificationStart, 2000);
      await sleep(2000);
    }

    runLogic();
    if (points > 0) {
      setScore((prevScore) => prevScore + points);
      logActivity(activityName);
    }
    if (timeCost > 0) fastForwardTime(timeCost);
    if (notificationDone) showNotification(notificationDone);

    setIsBusy(false);
  };

  const handleBuyItem = (itemToBuy) => {
    if (stats.money >= itemToBuy.price) {
      if (inventory.length < MAX_INVENTORY_SIZE) {
        setStats((prev) => ({ ...prev, money: prev.money - itemToBuy.price }));
        setInventory((prev) => [
          ...prev,
          { ...itemToBuy, instanceId: `bought-${itemToBuy.id}-${Date.now()}` },
        ]);
        setScore((prevScore) => prevScore + 10);
        logActivity("Membeli Item");
        showNotification(`${itemToBuy.name} berhasil dibeli! (+10 Poin)`);
      } else {
        showNotification("Inventaris penuh!");
      }
    } else {
      showNotification("Uang tidak cukup!");
    }
  };

  const handleSellItem = (itemToSell) => {
    if (isBusy || !itemToSell.sellable) return;
    const sellPrice = Math.floor(itemToSell.price / 2);
    setStats((prev) => ({ ...prev, money: prev.money + sellPrice }));
    setInventory((prev) =>
      prev.filter((item) => item.instanceId !== itemToSell.instanceId)
    );
    logActivity("Menjual Item");
    showNotification(`${itemToSell.name} dijual seharga ${sellPrice} gold.`);
  };

  const handleBuyZoneClick = () => setIsShopOpen(true);
  const handleSellZoneClick = () => {
    showNotification("Pilih item dari inventaris untuk dijual.");
    setIsInventoryExpanded(true);
  };

  const handleExitShop = async () => {
    setShopAnimationClass("fade-out-shop");
    await sleep(300);
    setIsInsideShop(false);
    setPosition((prevPos) => ({ x: prevPos.x, y: prevPos.y + 1 }));
  };

  const handleExitHome = async () => {
    setHomeAnimationClass("fade-out-home");
    await sleep(300);
    setIsInsideHome(false);
    setPosition((prevPos) => ({ x: prevPos.x, y: prevPos.y + 1 }));
  };

  const handleExitPlayground = async () => {
    setPlaygroundAnimationClass("fade-out-playground");
    await sleep(300);
    setIsInsidePlayground(false);
    setPosition((prevPos) => ({ x: prevPos.x, y: prevPos.y + 1 }));
  };

  const handleExitWindmill = async () => {
    setWindmillAnimationClass("fade-out-windmill");
    await sleep(300);
    setIsInsideWindmill(false);
    setPosition((prevPos) => ({ x: prevPos.x, y: prevPos.y + 1 }));
  };

  const getGreeting = (hour) => {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    if (hour >= 18 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  const getTimeOfDayClass = (hour) => {
    if (hour >= 20 || hour < 5) return "night";
    if (hour >= 18) return "dusk";
    if (hour >= 5 && hour < 7) return "dawn";
    return "day";
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const handleButtonPress = (dir) => {
    if (!isBusy && !isLoading) keysPressed.current.add(dir);
  };
  const handleButtonRelease = (dir) => keysPressed.current.delete(dir);

  return (
    <div className="game-screen">
      {isLoading && (
        <div className="loading-overlay">
          <h2>MEMUAT ASET...</h2>
        </div>
      )}

      {showCaveMinigame && (
        <CaveMinigame
          onGameEnd={(result) => handleMinigameEnd(result, "cave")}
        />
      )}
      {showTrampolineMinigame && (
        <TrampolineMinigame
          onGameEnd={(score) => handleMinigameEnd(score, "trampoline")}
        />
      )}
      {showSwingMinigame && (
        <SwingMinigame
          onGameEnd={(score) => handleMinigameEnd(score, "swing")}
        />
      )}
      {showGrindMinigame && (
        <GrindMinigame
          onGameEnd={(score) => handleMinigameEnd(score, "grind")}
        />
      )}
      {showRepairMinigame && (
        <RepairMinigame
          onGameEnd={(success) => handleMinigameEnd({ success }, "repair")}
        />
      )}

      {animateIceCream && <div className="ice-cream-animation">🍦</div>}

      {notification && <div className="notification-toast">{notification}</div>}

      {isGameOver && (
        <div className="game-over-overlay">
          <h2>Game Over</h2>
          <p>Skor Akhir Kamu: {score}</p>
          <div className="activity-summary">
            <h3>Ringkasan Aktivitas</h3>
            <ul>
              {Object.keys(activityLog).length > 0 ? (
                Object.entries(activityLog).map(([activity, count]) => (
                  <li key={activity}>
                    {activity}: {count} kali
                  </li>
                ))
              ) : (
                <li>Tidak ada aktivitas yang tercatat.</li>
              )}
            </ul>
          </div>
          <button onClick={handleRestartGame}>Mulai Lagi</button>
        </div>
      )}

      {isShopOpen && (
        <div className="shop-overlay">
          <div className="shop-modal">
            <h2>Toko Serba Ada</h2>
            <ul className="shop-item-list">
              {SHOP_ITEMS.map((item) => (
                <li key={item.id} className="shop-item">
                  <span>
                    {item.name} (+{item.effect.value} {item.effect.stat})
                  </span>
                  <button onClick={() => handleBuyItem(item)}>
                    Beli (${item.price})
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="shop-close-button"
              onClick={() => setIsShopOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="stats-bar">
        <div>
          {getGreeting(gameTime.hours)}, {playerInfo.name}
        </div>
        <div>
          {dayNames[gameTime.day % 7]} | Day {gameTime.day} |{" "}
          {String(gameTime.hours).padStart(2, "0")}:
          {String(gameTime.minutes).padStart(2, "0")}
        </div>
        <div className="stats-container">
          <div className="stat-item" data-tooltip={`Meal: ${stats.meal}/100`}>
            <span>🍴{stats.meal}%</span>
          </div>
          <div className="stat-item" data-tooltip={`Sleep: ${stats.sleep}/100`}>
            <span>😴{stats.sleep}%</span>
          </div>
          <div
            className={`stat-item ${animateIceCream ? "stat-pulse" : ""}`}
            data-tooltip={`Happiness: ${stats.happiness}/100`}
          >
            <span>😊{stats.happiness}%</span>
          </div>
          <div
            className="stat-item"
            data-tooltip={`Cleanliness: ${stats.cleanliness}/100`}
          >
            <span>🧼{stats.cleanliness}%</span>
          </div>
        </div>
        <div className="right-controls-container">
          <div>💰 ${stats.money.toLocaleString()}</div>
          <div className="volume-control">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>
      </div>

      {showInventory && (
        <div
          className={`inventory-panel ${isInventoryExpanded ? "expanded" : ""}`}
        >
          <div
            className="inventory-header"
            onClick={() => setIsInventoryExpanded((prev) => !prev)}
          >
            <h3>
              Inventory ({inventory.length}/{MAX_INVENTORY_SIZE})
            </h3>
            <button className="expand-button">
              {isInventoryExpanded ? "▲" : "▼"}
            </button>
          </div>
          {isInventoryExpanded && (
            <ul className="inventory-list">
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <li key={item.instanceId} className="inventory-item">
                    <span className="item-name">{item.name}</span>
                    <div className="item-actions">
                      {(item.id === "misteri_apel" || item.effect) && (
                        <button
                          className="item-button use"
                          onClick={() => handleUseItem(item)}
                        >
                          Pakai
                        </button>
                      )}
                      {isInsideShop && item.sellable && (
                        <button
                          className="item-button sell"
                          onClick={() => handleSellItem(item)}
                        >
                          Jual (${Math.floor(item.price / 2)})
                        </button>
                      )}
                      <button
                        className="item-button discard"
                        onClick={() => handleDiscardItem(item)}
                      >
                        Buang
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li>(kosong)</li>
              )}
            </ul>
          )}
        </div>
      )}

      <div className="main-game-body">
        <div className="arena-viewport">
          <div
            className={`map-area ${getTimeOfDayClass(gameTime.hours)}`}
            style={{ backgroundImage: `url(${map1Background})` }}
          >
            <div className={`weather-effect ${currentWeather}`}>
              {weatherParticles.map((p) => (
                <div
                  key={p.id}
                  className={p.type === "rainy" ? "rain-drop" : "snowflake"}
                  style={p.style}
                ></div>
              ))}
            </div>
            <div className="time-overlay"></div>
            <div className="score-display">
              <div>Skor: {score}</div>
              <div>High Score: {highScore}</div>
            </div>

            {!isInsideShop &&
              !isInsideHome &&
              !isInsidePlayground &&
              !isInsideWindmill &&
              !isLoading && (
                <>
                  {spawnedItems.map((item) => (
                    <img
                      key={item.instanceId}
                      src={item.image}
                      alt={item.name}
                      className="spawned-item"
                      style={{
                        left: `${item.x * TILE_SIZE + (TILE_SIZE / 2 - 20)}px`,
                        top: `${item.y * TILE_SIZE + (TILE_SIZE / 2 - 20)}px`,
                      }}
                    />
                  ))}
                  <div
                    className={`player-character ${direction} ${
                      isWalking ? "walking" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${playerSpritesheet})`,
                      left: `${position.x * TILE_SIZE}px`,
                      top: `${position.y * TILE_SIZE}px`,
                      width: `${CHARACTER_SIZE}px`,
                      height: `${CHARACTER_SIZE}px`,
                    }}
                  ></div>
                </>
              )}

            {showDebugGrid && (
              <DebugGrid mapLayout={mapLayout} tileSize={TILE_SIZE} />
            )}

            {isInsideShop && (
              <div
                className={`shop-interior-container ${shopAnimationClass}`}
                style={{ backgroundImage: `url(${shopInteriorImage})` }}
              >
                <div className="shop-buy-zone" onClick={handleBuyZoneClick}>
                  <div className="shop-zone-text">
                    <h3>BELI</h3>
                    <p>Beli berbagai item untuk petualanganmu.</p>
                  </div>
                </div>
                <div className="shop-sell-zone" onClick={handleSellZoneClick}>
                  <div className="shop-zone-text">
                    <h3>JUAL</h3>
                    <p>Jual item dari tas untuk mendapat gold.</p>
                  </div>
                </div>
                <button
                  className="interior-back-button"
                  onClick={handleExitShop}
                >
                  Kembali ke Peta
                </button>
              </div>
            )}

            {isInsideHome && (
              <div
                className={`home-interior-container ${homeAnimationClass}`}
                style={{ backgroundImage: `url(${homeInteriorImage})` }}
              >
                <div
                  className="home-bed-zone"
                  onClick={() => handleActivityClick({ id: "tidur" })}
                >
                  <div className="interior-zone-text">
                    <h3>TIDUR</h3>
                    <p>Pulihkan energi dengan tidur nyenyak.</p>
                  </div>
                </div>
                <div
                  className="home-wardrobe-zone"
                  onClick={() => handleActivityClick({ id: "ganti_baju" })}
                >
                  <div className="interior-zone-text">
                    <h3>GANTI BAJU</h3>
                    <p>Tingkatkan kebersihan dan penampilan.</p>
                  </div>
                </div>
                <div
                  className="home-table-zone"
                  onClick={() => handleActivityClick({ id: "makan_di_rumah" })}
                >
                  <div className="interior-zone-text">
                    <h3>MAKAN</h3>
                    <p>Isi perut dengan makanan rumahan.</p>
                  </div>
                </div>
                <button
                  className="interior-back-button"
                  onClick={handleExitHome}
                >
                  Kembali ke Peta
                </button>
              </div>
            )}

            {isInsidePlayground && (
              <div
                className={`playground-interior-container ${playgroundAnimationClass}`}
                style={{ backgroundImage: `url(${playgroundInteriorImage})` }}
              >
                <div
                  className="playground-swing-zone"
                  onClick={() => handleActivityClick({ id: "main_ayunan" })}
                >
                  <div className="interior-zone-text">
                    <h3>MAIN AYUNAN</h3>
                    <p>Tingkatkan kebahagiaan dengan bermain ayunan.</p>
                  </div>
                </div>
                <div
                  className="playground-icecream-zone"
                  onClick={() => handleActivityClick({ id: "beli_es_krim" })}
                >
                  <div className="interior-zone-text">
                    <h3>BELI ES KRIM</h3>
                    <p>Beli es krim untuk menyegarkan diri.</p>
                  </div>
                </div>
                <div
                  className="playground-trampoline-zone"
                  onClick={() =>
                    handleActivityClick({ id: "lompat_trampolin" })
                  }
                >
                  <div className="interior-zone-text">
                    <h3>LOMPAT TRAMPOLIN</h3>
                    <p>Bersenang-senang dan bakar sedikit energi.</p>
                  </div>
                </div>
                <div
                  className="playground-cave-zone"
                  onClick={() => handleActivityClick({ id: "jelajahi_goa" })}
                >
                  <div className="interior-zone-text">
                    <h3>JELAJAHI GOA</h3>
                    <p>Siapa tahu ada harta karun di dalamnya?</p>
                  </div>
                </div>
                <button
                  className="interior-back-button"
                  onClick={handleExitPlayground}
                >
                  Kembali ke Peta
                </button>
              </div>
            )}

            {isInsideWindmill && (
              <div
                className={`windmill-interior-container ${windmillAnimationClass}`}
                style={{ backgroundImage: `url(${windmillInteriorImage})` }}
              >
                <div
                  className="windmill-grind-zone"
                  onClick={() => handleActivityClick({ id: "giling_gandum" })}
                >
                  <div className="interior-zone-text">
                    <h3>GILING GANDUM</h3>
                    <p>Kerja sampingan untuk mendapat uang.</p>
                  </div>
                </div>
                <div
                  className="windmill-repair-zone"
                  onClick={() => handleActivityClick({ id: "perbaiki_kincir" })}
                >
                  <div className="interior-zone-text">
                    <h3>PERBAIKI KINCIR</h3>
                    <p>Pekerjaan berat dengan upah besar.</p>
                  </div>
                </div>
                <button
                  className="interior-back-button"
                  onClick={handleExitWindmill}
                >
                  Kembali ke Peta
                </button>
              </div>
            )}

            {showVideoPlayer && (
              <div className="mini-video-player-container">
                <video
                  ref={videoRef}
                  src={caveVideo}
                  onEnded={handleVideoEnd}
                  autoPlay
                  muted
                  className="mini-video-player"
                ></video>
                <button
                  className="video-ff-button"
                  onClick={handleFastForwardVideo}
                >
                  Percepat &gt;&gt;
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="right-sidebar">
          <div className="activity-container">
            {currentZone ? (
              <>
                <h4>{currentZone.zoneName}</h4>
                {currentZone.actions.length > 0 ? (
                  <ul className="activity-list">
                    {currentZone.actions.map((action) => (
                      <li key={action.id}>
                        <button onClick={() => handleActivityClick(action)}>
                          {action.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="activity-placeholder">
                    <p>Masuk untuk berinteraksi.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="activity-placeholder">
                <p>Berjalanlah ke sebuah gedung untuk berinteraksi.</p>
              </div>
            )}
          </div>
          <div className="controls-container">
            <button
              onMouseDown={() => handleButtonPress("up")}
              onMouseUp={() => handleButtonRelease("up")}
              onMouseLeave={() => handleButtonRelease("up")}
            >
              ▲
            </button>
            <div className="controls-middle-row">
              <button
                onMouseDown={() => handleButtonPress("left")}
                onMouseUp={() => handleButtonRelease("left")}
                onMouseLeave={() => handleButtonRelease("left")}
              >
                ◀
              </button>
              <button
                onMouseDown={() => handleButtonPress("down")}
                onMouseUp={() => handleButtonRelease("down")}
                onMouseLeave={() => handleButtonRelease("down")}
              >
                ▼
              </button>
              <button
                onMouseDown={() => handleButtonPress("right")}
                onMouseUp={() => handleButtonRelease("right")}
                onMouseLeave={() => handleButtonRelease("right")}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainGameArena;
