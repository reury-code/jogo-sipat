import { Coins, Gem, Heart, Settings, Volume2, Home } from "lucide-react";
import { GameResources } from "@/types/phase";

interface GameHeaderProps {
  resources: GameResources;
  onSettings?: () => void;
  onSound?: () => void;
  onHome?: () => void;
}

export default function GameHeader({
  resources,
  onSettings,
  onSound,
  onHome,
}: GameHeaderProps) {
  return (
    <header className="relative bg-gradient-to-b from-purple-900 via-purple-800 to-transparent py-4 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side - Logo/Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={onHome}
            className="btn-3d bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 p-3 rounded-2xl border-4 border-blue-300 transition-all hover:scale-110"
            aria-label="Menu Principal"
          >
            <Home className="w-6 h-6 text-white" />
          </button>

          <div className="hidden sm:block">
            <h1 className="font-game-title text-2xl text-white text-stroke-sm drop-shadow-lg">
              RiskZone
            </h1>
          </div>
        </div>

        {/* Center - Resources */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins */}
          <div className="card-3d bg-gradient-to-b from-yellow-400 to-yellow-600 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 border-3 border-yellow-300">
            <Coins className="w-5 h-5 text-yellow-900 animate-pulse-soft" />
            <span className="font-game-title text-white text-stroke-sm text-lg sm:text-xl">
              {resources.coins.toLocaleString()}
            </span>
          </div>

          {/* Gems */}
          <div className="card-3d bg-gradient-to-b from-pink-400 to-purple-600 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 border-3 border-pink-300">
            <Gem className="w-5 h-5 text-white animate-pulse-soft" />
            <span className="font-game-title text-white text-stroke-sm text-lg sm:text-xl">
              {resources.gems}
            </span>
          </div>

          {/* Hearts */}
          <div className="card-3d bg-gradient-to-b from-red-400 to-red-600 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 border-3 border-red-300">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse-soft" />
            <span className="font-game-title text-white text-stroke-sm text-lg sm:text-xl">
              {resources.hearts}
            </span>
          </div>
        </div>

        {/* Right Side - Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSound}
            className="btn-3d bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 p-3 rounded-2xl border-4 border-orange-300 transition-all hover:scale-110"
            aria-label="Som"
          >
            <Volume2 className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={onSettings}
            className="btn-3d bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-300 hover:to-gray-500 p-3 rounded-2xl border-4 border-gray-300 transition-all hover:scale-110"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
    </header>
  );
}
