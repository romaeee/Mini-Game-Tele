import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import Character from './icons/Hamster';
import { dollarCoin, mainCharacter } from './images';
import ShopWindow from './ShopWindow';

const App: React.FC = () => {
  const [isShopWindowOpen, setIsShopWindowOpen] = useState(false);

  const levelNames = [
    "Bronze Poop",    // From 0 to 4999 coins
    "Silver Poop",    // From 5000 coins to 24,999 coins
    "Gold Poop",      // From 25,000 coins to 99,999 coins
    "Platinum Poop",  // From 100,000 coins to 999,999 coins
    "Diamond Poop",   // From 1,000,000 coins to 2,000,000 coins
    "Epic Poop",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary Poop", // From 10,000,000 coins to 50,000,000 coins
    "Master Poop",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster Poop", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord Poop"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    100,     // Silver
    200,    // Gold
    500,   // Platinum
    1000,  // Diamond
    2000,  // Epic
    10000, // Legendary
    50000, // Master
    100000,// GrandMaster
    1000000// Lord
  ];

  const [userData, setUserData] = useState<UserData | null>(null);
  const [levelIndex, setLevelIndex] = useState(1);
  const [points, setPoints] = useState<number>(1);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1; // numbers of points to add
  const profitPerHour = 1;

  interface UserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code: string;
    is_premium?: boolean;
  }

  useEffect(() => {
    WebApp.expand();
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  // Загружаем данные из webapp.CloudStorage
  useEffect(() => {
    const loadPoints = async () => {
      try {
        const storedPoints = await WebApp.CloudStorage.get('points');
        if (storedPoints !== null) {
          setPoints(Number(storedPoints));
        }
      } catch (error) {
        console.error('Ошибка загрузки очков:', error);
      }
    };
    loadPoints();
  }, []);

  // Сохраняем данные в webapp.CloudStorage при изменении points
  useEffect(() => {
    const savePoints = async () => {
      try {
        await WebApp.CloudStorage.set('points', points.toString());
      } catch (error) {
        console.error('Ошибка сохранения очков:', error);
      }
    };
    savePoints();
  }, [points]);
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const resetProgress = async () => {
    setPoints(0);
    setLevelIndex(1);
    try {
      await WebApp.CloudStorage.set('points', '0');
    } catch (error) {
      console.error('Ошибка сброса очков:', error);
    }
  };

  const openShop = () => setIsShopWindowOpen(true);

  const updatePoints = async (newPoints: number) => {
    setPoints(newPoints);
    try {
      await WebApp.CloudStorage.set('points', newPoints.toString());
    } catch (error) {
      console.error('Ошибка обновления очков:', error);
    }
  };
  
  return (
    <>
       {isShopWindowOpen ? (
        <ShopWindow points={points} onClose={() => setIsShopWindowOpen(false)} onPointsChange={updatePoints} />
      ) : (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-[100vh] font-bold flex flex-col max-w-xl"> 
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Character size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
            <p className="text-sm">{userData?.first_name || 'Player'}{' poop id: '}{userData?.id}</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
            </div>
            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-center p-4 mt-4" onClick={handleCardClick}>
              <img src={mainCharacter} alt="Main Character" className="w-32 h-32" />
            </div>

            <div className="absolute bottom-5 w-full px-4 flex justify-between items-center">
              <button className="flex items-center justify-center p-3 bg-[#343941] rounded-full text-[#f3ba2f]" onClick={resetProgress}>
                <span>Reset Progress</span>
              </button>
              <button className="flex items-center justify-center p-3 bg-[#343941] rounded-full text-[#f3ba2f]" onClick={openShop}>
                <span>Shop</span>
              </button>
            </div>
          </div>
        </div>

        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-2xl text-white"
            style={{ left: click.x, top: click.y }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            +{pointsToAdd}
          </div>
        ))}
      </div>
    </div>
       )}
    </>
  );
};

export default App;
