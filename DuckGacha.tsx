import React, { useState } from 'react';
import { Duck, DuckRarity } from '../types';
import { MOCK_DUCKS_DB, RARITY_COLORS } from '../constants';
import { Sparkles, X, RotateCcw, Star, Ticket } from 'lucide-react';

interface DuckGachaProps {
  tickets: number;
  pityCounter: number;
  onSpendTickets: (amount: number) => void;
  onObtainDucks: (ducks: Duck[], newPityCounter: number) => void;
  onClose: () => void;
}

const DuckGacha: React.FC<DuckGachaProps> = ({ tickets, pityCounter, onSpendTickets, onObtainDucks, onClose }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<Duck[]>([]);

  const generateDuck = (currentPity: number): { duck: Duck, isLegendary: boolean } => {
      let rarity = DuckRarity.COMMON;
      const rand = Math.random() * 100;

      // PITY SYSTEM: Guaranteed Legendary at 150
      if (currentPity >= 149) {
          rarity = DuckRarity.LEGENDARY;
      } else {
          // Standard Rates
          if (rand > 98) rarity = DuckRarity.LEGENDARY; // 2%
          else if (rand > 85) rarity = DuckRarity.EPIC; // 13%
          else if (rand > 55) rarity = DuckRarity.RARE; // 30%
          // else Common 55%
      }

      const pool = MOCK_DUCKS_DB.filter(d => d.rarity === rarity);
      const template = pool[Math.floor(Math.random() * pool.length)];

      const newDuck: Duck = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        obtainedAt: new Date().toISOString(),
        stars: 1
      };

      return { duck: newDuck, isLegendary: rarity === DuckRarity.LEGENDARY };
  };

  const roll = (amount: number) => {
    if (tickets < amount) return;
    
    setIsRolling(true);
    onSpendTickets(amount);

    // Simulate Animation Delay
    setTimeout(() => {
      const newDucks: Duck[] = [];
      let tempPity = pityCounter;

      for(let i=0; i<amount; i++) {
        const { duck, isLegendary } = generateDuck(tempPity);
        newDucks.push(duck);
        
        // Update Pity Logic
        if (isLegendary) {
            tempPity = 0;
        } else {
            tempPity++;
        }
      }

      setResults(newDucks);
      onObtainDucks(newDucks, tempPity);
      setIsRolling(false);
    }, 1500);
  };

  const reset = () => {
    setResults([]);
  };

  const hasResults = results.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`bg-white dark:bg-dark-surface rounded-3xl shadow-2xl w-full ${hasResults && results.length > 1 ? 'max-w-2xl' : 'max-w-md'} overflow-hidden relative border-b-8 border-brand-dark dark:border-amber-700 animate-pop transition-all`}>
        
        {/* Header */}
        <div className="bg-brand dark:bg-amber-600 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
          <h2 className="text-2xl font-bold drop-shadow-md flex items-center gap-2">
            <span>🎰</span> Duck Gacha
          </h2>
          
          <div className="flex items-center gap-3">
            {/* Prominent Ticket Counter */}
            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/30 shadow-sm animate-pop">
                <Ticket className="w-5 h-5 fill-current text-yellow-100" />
                <span className="text-xl font-extrabold text-white drop-shadow-md">{tickets}</span>
            </div>

            <button onClick={onClose} className="hover:bg-black/20 rounded-full p-2 transition">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[400px] bg-sky-50 dark:bg-slate-900 relative">
          
          {/* Machine Graphic (Hidden when results shown) */}
          {!hasResults && (
            <div className={`relative mb-8 transition-transform duration-100 ${isRolling ? 'animate-bounce-short' : ''}`}>
               <div className="w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-600 dark:to-orange-700 rounded-3xl shadow-xl flex items-center justify-center border-4 border-orange-500 dark:border-orange-800 relative z-10 group">
                  <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform">🎁</span>
                  {/* Lights */}
                  <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping delay-75" />
                  
                  {/* Pity Display */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap backdrop-blur-sm">
                     Pity: {pityCounter}/150
                  </div>
               </div>
               {isRolling && <div className="absolute inset-0 bg-white/50 animate-pulse rounded-3xl z-20" />}
            </div>
          )}

          {/* Result Display */}
          {hasResults && (
            <div className={`w-full ${results.length > 1 ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3' : 'flex justify-center'}`}>
              {results.map((duck, idx) => (
                <div key={idx} className={`bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border-2 animate-pop ${RARITY_COLORS[duck.rarity].replace('bg-', 'border-')}`} style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-900 group">
                     <img src={duck.imageUrl} alt={duck.name} className="w-full h-full object-cover" />
                     {duck.rarity === DuckRarity.LEGENDARY && <Sparkles className="absolute top-1 right-1 text-yellow-500 w-4 h-4 animate-spin-slow" />}
                  </div>
                  <div className="text-center">
                     <p className={`text-[10px] font-bold uppercase px-1 rounded ${RARITY_COLORS[duck.rarity]}`}>{duck.rarity}</p>
                     <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate mt-1">{duck.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="mt-8 w-full space-y-3 relative z-20">
            {!hasResults ? (
              <div className="grid grid-cols-2 gap-4">
                {/* 1x Roll */}
                <button 
                  onClick={() => roll(1)}
                  disabled={tickets < 1 || isRolling}
                  className={`py-4 rounded-xl font-bold text-white shadow-lg btn-3d flex flex-col items-center justify-center gap-1 transition-all
                    ${tickets >= 1 
                        ? 'bg-blue-500 border-blue-700 hover:bg-blue-400' 
                        : 'bg-gray-300 border-gray-400 dark:bg-slate-700 dark:border-slate-800 text-gray-500 cursor-not-allowed opacity-70 scale-95'}
                  `}
                >
                  <span className="text-lg">Roll 1x</span>
                  <div className={`px-2 py-0.5 rounded text-xs flex items-center ${tickets >= 1 ? 'bg-black/20' : 'bg-black/10'}`}>
                      🎟️ 1
                  </div>
                </button>

                {/* 10x Roll */}
                <button 
                  onClick={() => roll(10)}
                  disabled={tickets < 10 || isRolling}
                  className={`py-4 rounded-xl font-bold text-white shadow-lg btn-3d flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-all
                    ${tickets >= 10 
                        ? 'bg-purple-500 border-purple-700 hover:bg-purple-400' 
                        : 'bg-gray-300 border-gray-400 dark:bg-slate-700 dark:border-slate-800 text-gray-500 cursor-not-allowed opacity-70 scale-95'}
                  `}
                >
                  {tickets >= 10 && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
                  <span className="text-lg">Roll 10x</span>
                  <div className={`px-2 py-0.5 rounded text-xs flex items-center ${tickets >= 10 ? 'bg-black/20' : 'bg-black/10'}`}>
                      🎟️ 10
                  </div>
                </button>
              </div>
            ) : (
              <button 
                onClick={reset}
                className="w-full py-3 rounded-xl text-lg font-bold text-white shadow-lg btn-3d bg-brand dark:bg-amber-600 border-brand-dark dark:border-amber-800 hover:bg-brand-light flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> Play Again
              </button>
            )}

            {!hasResults && tickets === 0 && (
                <p className="text-center text-red-500 font-bold text-sm animate-pulse">
                    Not enough tickets! Complete tasks to earn more.
                </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DuckGacha;