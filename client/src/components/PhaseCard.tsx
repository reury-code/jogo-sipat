import { Phase } from "@/types/phase";
import { Zap, Clock, Target } from "lucide-react";

interface PhaseCardProps {
  phase: Phase;
  onPlay: (phase: Phase) => void;
  isLocked?: boolean;
}

const difficultyColors = {
  fácil: "bg-gradient-to-br from-green-400 to-green-600",
  médio: "bg-gradient-to-br from-orange-400 to-orange-600",
  difícil: "bg-gradient-to-br from-red-500 to-purple-600",
};

const difficultyBadgeColors = {
  fácil: "bg-green-500",
  médio: "bg-orange-500",
  difícil: "bg-red-500",
};

export default function PhaseCard({
  phase,
  onPlay,
  isLocked = false,
}: PhaseCardProps) {
  return (
    <div className="group relative">
      {/* Card Container com efeito 3D */}
      <div
        className={`card-3d relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-3xl overflow-hidden transform transition-all duration-300 ${!isLocked ? "hover:scale-105 hover:-translate-y-2" : ""}`}
      >
        {/* Badge de Dificuldade - Canto superior direito */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className={`${difficultyBadgeColors[phase.difficulty]} px-4 py-2 rounded-full shadow-lg`}
          >
            <span className="text-white font-game-body font-bold text-sm uppercase tracking-wide">
              {phase.difficulty}
            </span>
          </div>
        </div>

        {/* Thumbnail/Ícone da fase - Grande e centralizado */}
        <div
          className={`${difficultyColors[phase.difficulty]} h-40 flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="text-7xl animate-bounce-soft relative z-10 drop-shadow-2xl">
            {phase.thumbnail}
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 animate-shine"></div>
        </div>

        {/* Conteúdo do Card */}
        <div className="p-5 space-y-3">
          {/* Nome da Fase */}
          <div className="text-center">
            <div className="text-yellow-400 font-game-title text-sm mb-1 tracking-widest">
              {phase.name}
            </div>
            <h3 className="text-white font-game-title text-2xl text-stroke-sm">
              {phase.title}
            </h3>
          </div>

          {/* Descrição */}
          <p className="text-purple-100 text-center text-sm font-game-body leading-snug">
            {phase.description}
          </p>

          {/* Métricas - Tema e Duração */}
          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1 bg-purple-800/50 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-game-body">{phase.theme}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-800/50 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white font-game-body">
                {phase.duration}
              </span>
            </div>
          </div>

          {/* Número de objetivos */}
          <div className="flex items-center justify-center gap-2 bg-purple-800/30 px-4 py-1.5 rounded-xl">
            <Target className="w-4 h-4 text-pink-400" />
            <span className="text-white font-game-body text-sm">
              {phase.objectives.length} objetivos
            </span>
          </div>

          {/* Botão JOGAR - CTA Principal */}
          <button
            onClick={() => !isLocked && onPlay(phase)}
            disabled={isLocked}
            className={`btn-3d w-full text-white font-game-title text-lg py-3 px-6 rounded-2xl uppercase tracking-wider border-4 transition-all duration-200 ${
              isLocked
                ? "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-300 cursor-not-allowed opacity-60"
                : "bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 border-green-300 hover:scale-105 active:scale-95"
            }`}
          >
            <span className="text-stroke-sm drop-shadow-lg">
              {isLocked ? "🔒 BLOQUEADO" : "▶ JOGAR"}
            </span>
          </button>
        </div>

        {/* Brilho no hover - overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
