import React from 'react';
import { IconProps } from "../utils/types"; // Adjust the path as needed

const Hamster: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  const emoji = "💩"; // Unicode character for the poop emoji

  return (
    <div
      className={className}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        fontSize: `${size * 0.8}px`, // Adjust fontSize to fit well inside the square
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '4px', // Optional: adds rounded corners to the square
        backgroundColor: 'transparent' // Optional: sets background color to transparent
      }}
      role="img"
      aria-label="poop emoji"
    >
      {emoji}
    </div>
  );
};

export default Hamster;
