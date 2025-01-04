import React, { useEffect, useState } from 'react';


const defaultStats = {
    played:0,
    win:0,
    currentStreak:0,
    maxStreak:0
}
const StatsPopup = ({ isOpen, close, newGame}) => {
  const [stats,setStats] = useState(defaultStats);
  const getStats = () => {
    const stats = localStorage.getItem('hardword-stats');
    if(stats){
        setStats(stats);
    }
  }

  useEffect(()=>{
    getStats();
  })

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-lg p-8 relative max-w-md w-full mx-4">
        <button 
          onClick={close}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{stats.played}</span>
            <span className="text-sm text-gray-400">Played</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{stats.win}</span>
            <span className="text-sm text-gray-400">Win %</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{stats.currentStreak}</span>
            <span className="text-sm text-gray-400">Current Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{stats.maxStreak}</span>
            <span className="text-sm text-gray-400">Max Streak</span>
          </div>
        </div>

        {/* Next game section */}
        <div className="text-center">
          <button className="bg-[#1d9bf0] text-white px-6 py-2 rounded-md hover:bg-[#1a8cd8] transition-colors">
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPopup;