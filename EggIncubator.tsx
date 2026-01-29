import React, { useState, useEffect } from 'react';
import { Egg, Flame, ThermometerSun } from 'lucide-react';
import { Duck } from '../types';

interface EggIncubatorProps {
  progress: number;
  onHatch: () => void;
}

const EggIncubator: React.FC<EggIncubatorProps> = ({ progress, onHatch }) => {
  const [isWobbling, setIsWobbling] = useState(false);
  const isReady = progress >= 100;

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setIsWobbling(true);
      const timer = setTimeout(() => setIsWobbling(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-xl border-4 border-wood dark:border-slate-700 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />

      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-lg font-bold text-wood dark:text-amber-500 mb-4 flex items-center gap-2">
          <ThermometerSun size={20} /> Incubation Station
        </h3>

        {/* The Egg */}
        <div 
          className={`relative cursor-pointer transition-transform duration-300 ${isWobbling ? 'animate-wiggle' : ''} ${isReady ? 'animate-bounce cursor-pointer' : ''}`}
          onClick={isReady ? onHatch : undefined}
        >
          {/* Nest */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-800/40 blur-sm rounded-full" />
          
          <div className={`w-32 h-40 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden transition-all
            ${isReady 
               ? 'bg-gradient-to-br from-yellow-100 to-amber-200 border-4 border-yellow-400 shadow-[0_0_30px_rgba(255,200,0,0.5)]' 
               : 'bg-gradient-to-br from-stone-100 to-stone-300 border-4 border-stone-200'}
          `}>
             <Egg 
               size={80} 
               className={`${isReady ? 'text-yellow-600' : 'text-stone-400'} opacity-20 absolute rotate-12`} 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
             
             {isReady && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                   ⚡
                </div>
             )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-6 space-y-2">
           <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              <span>Heat Level</span>
              <span>{Math.min(progress, 100)}%</span>
           </div>
           <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden border border-gray-300 dark:border-slate-600 relative">
              <div 
                className={`h-full transition-all duration-1000 ease-out relative ${isReady ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-orange-300 to-red-400'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                 {/* Shiny effect on bar */}
                 <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/30" />
              </div>
           </div>
           
           <p className="text-center text-xs text-gray-400 mt-2 h-4">
              {isReady 
                ? "TAP THE EGG TO HATCH!" 
                : "Complete tasks to speed up hatching!"}
           </p>
        </div>

        {/* Hatch Button (Mobile Friendly) */}
        {isReady && (
           <button 
             onClick={onHatch}
             className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-full shadow-lg btn-3d animate-pop"
           >
             HATCH NOW!
           </button>
        )}
      </div>
    </div>
  );
};

export default EggIncubator;
