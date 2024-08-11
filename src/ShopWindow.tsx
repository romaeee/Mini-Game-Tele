import React, { useState } from 'react';

interface ShopWindowProps {
  onClose: () => void;
  points: number; // Add points prop
  onPointsChange: (newPoints: number) => void; // Callback to update points in App
}

// Example items for the shop
const shopItems = [
  { emoji: '🍎', price: 10 },
  { emoji: '🍌', price: 15 },
  { emoji: '🍇', price: 20 },
  { emoji: '🍉', price: 25 },
  { emoji: '🍓', price: 30 },
  { emoji: '🍈', price: 35 },
  { emoji: '🍒', price: 40 },
  { emoji: '🍍', price: 45 },
  { emoji: '🥭', price: 50 }
];

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, { passive: false });

const ShopWindow: React.FC<ShopWindowProps> = ({ onClose, points, onPointsChange }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handlePurchase = (price: number) => {
    if (price <= points) {
      onPointsChange(points - price); // Deduct the points
      setSelectedItem(null); // Clear selection after purchase
    } else {
      alert('Not enough points!');
    }
  };

  return (
    <div className="bg-black text-white w-full h-screen flex flex-col p-4">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-center mb-4">Shop</h1>
        <p className="text-center text-lg mb-4">Current Points: {points.toLocaleString()}</p>
        <div className="grid grid-cols-3 gap-4">
          {shopItems.map((item, index) => (
            <div
              key={index}
              className={`bg-gray-800 p-4 rounded-lg text-center cursor-pointer ${selectedItem === index ? 'bg-gray-700' : ''}`}
              onClick={() => handlePurchase(item.price)}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className="text-lg font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full"
          onClick={onClose}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ShopWindow;
