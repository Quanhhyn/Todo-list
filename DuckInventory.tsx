import React from 'react';
import { Duck } from '../types';
import { RARITY_COLORS } from '../constants';
import { Star } from 'lucide-react';

interface DuckInventoryProps {
  ducks: Duck[];
}

const DuckInventory: React.FC<DuckInventoryProps> = ({ ducks }) => {
  if (ducks.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-dark-surface/50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-dark-border">
        <p className="text-gray-500 dark:text-gray-400">Your pond is empty. Complete tasks to roll for ducks!</p>
      </div>
    );
  }

  // Helper to render stars
  const renderStars = (count: number) => {
      // If stars > 5, show number instead of icons to save space
      if (count > 5) {
          return (
              <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Star size={10} fill="currentColor" /> <span>x{count}</span>
              </div>
          );
      }
      return (
          <div className="flex gap-0.5">
              {[...Array(count)].map((_, i) => (
                  <Star key={i} size={12} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />
              ))}
          </div>
      );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {ducks.map((duck) => (
        <div key={duck.id} className="bg-white dark:bg-dark-surface rounded-xl p-3 shadow-md border-b-4 border-gray-200 dark:border-dark-border hover:-translate-y-1 transition-transform relative group">
          
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-900 mb-3 relative">
             <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold border ${RARITY_COLORS[duck.rarity]}`}>
                {duck.rarity[0]}
             </div>
             <img src={duck.imageUrl} alt={duck.name} className="w-full h-full object-cover" />
             
             {/* Stars Overlay */}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-center">
                {renderStars(duck.stars || 1)}
             </div>
          </div>
          
          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">{duck.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{new Date(duck.obtainedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default DuckInventory;