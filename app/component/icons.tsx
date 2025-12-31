// components/icons.tsx
import React from 'react';

export const ProfileImage = ({ size = 32 }: { size?: number }) => (
  <div 
    style={{ width: size, height: size }} 
    className="rounded-full bg-[#c4c7c5] flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
  >
    <svg viewBox="0 0 24 24" fill="#727775" width="80%" height="80%">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

export const GeminiLogo = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="animate-pulse"
  >
    <path 
      d="M12 2C12 2 12.5 7.5 15 10C17.5 12.5 22 12 22 12C22 12 16.5 12.5 14 15C11.5 17.5 12 22 12 22C12 22 11.5 16.5 9 14C6.5 11.5 2 12 2 12C2 12 7.5 11.5 10 9C12.5 6.5 12 2 12 2Z" 
      fill="url(#gemini-grad-real)" 
    />
    <defs>
      <linearGradient id="gemini-grad-real" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1A73E8" />
        <stop offset="0.3" stopColor="#4285F4" /> 
        <stop offset="0.6" stopColor="#9B72CB" /> 
        <stop offset="0.8" stopColor="#D96570" /> 
        <stop offset="1" stopColor="#F4AF94" /> 
      </linearGradient>
    </defs>
  </svg>
);