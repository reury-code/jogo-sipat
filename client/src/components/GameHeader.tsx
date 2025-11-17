import { HelpCircle, Settings, Volume2, Home } from "lucide-react";
import { GameResources } from "@/types/phase";

interface GameHeaderProps {
  resources: GameResources;
  onSettings?: () => void;
  onSound?: () => void;
  onHome?: () => void;
  onHowToPlay?: () => void;
}

export default function GameHeader({
  resources,
  onSettings,
  onSound,
  onHome,
  onHowToPlay,
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

        {/* Center - Como Jogar Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onHowToPlay}
            className="btn-3d bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 px-3 sm:px-4 py-2 rounded-2xl border-4 border-yellow-300 transition-all hover:scale-110 flex items-center gap-2"
            aria-label="Como Jogar"
          >
            <HelpCircle className="w-4 h-4 text-yellow-900" />
            <span className="font-game-title text-white text-stroke-sm text-sm sm:text-base">
              COMO JOGAR
            </span>
          </button>
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
