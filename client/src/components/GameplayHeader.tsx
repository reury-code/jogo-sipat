import { ArrowLeft, Settings2 } from "lucide-react";
import { Phase } from "@/types/phase";

interface GameplayHeaderProps {
  phase: Phase;
  stars: number;
  maxStars: number;
  coins: number;
  time: number;
  score: number;
  scoreChange: number | null;
  correctCount: number;
  errorCount: number;
  totalRisks: number;
  combo: number;
  onBack: () => void;
  onSettings?: () => void;
}

export default function GameplayHeader({
  phase,
  stars,
  maxStars,
  coins,
  time,
  score,
  scoreChange,
  correctCount,
  errorCount,
  totalRisks,
  combo,
  onBack,
  onSettings,
}: GameplayHeaderProps) {
  const difficultyColors: Record<string, string> = {
    fácil: "bg-green-500",
    médio: "bg-yellow-500",
    difícil: "bg-red-500",
  };

  const difficultyLabels: Record<string, string> = {
    fácil: "FÁCIL",
    médio: "MÉDIO",
    difícil: "DIFÍCIL",
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (correctCount / totalRisks) * 100;

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-b-4 border-purple-700 shadow-2xl py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Layout em uma linha única */}
        <div className="flex items-center justify-between gap-4">
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="btn-3d flex items-center justify-center w-8 h-8 bg-gradient-to-b from-slate-400 to-slate-600 hover:from-slate-300 hover:to-slate-500 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-105"
            title="Voltar"
            aria-label="Voltar para seleção de fases"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          {/* Título da Fase */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-game-title text-white text-stroke">
              FASE {phase.id}
            </span>
            <span
              className={`px-2 py-0.5 ${difficultyColors[phase.difficulty]} rounded-full text-white font-game-title text-xs border border-white shadow-md`}
            >
              {difficultyLabels[phase.difficulty]}
            </span>
          </div>

          {/* Pontuação */}
          <div className="flex items-center gap-1">
            <span className="font-game-title text-cyan-200 text-xs uppercase">
              PONTOS:
            </span>
            <div className="text-2xl font-game-title text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 text-stroke">
              {score}
            </div>
            {scoreChange !== null && scoreChange !== 0 && (
              <div
                className={`text-sm font-game-title animate-bounce-soft text-stroke-sm ${
                  scoreChange > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {scoreChange > 0 ? "+" : ""}
                {scoreChange}
              </div>
            )}
          </div>

          {/* Barra de Progresso Compacta */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <span className="font-game-title text-white text-xs uppercase whitespace-nowrap">
              PROGRESSO:
            </span>
            <div className="flex-1 relative h-4 bg-slate-900/60 rounded-full border border-slate-300 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-game-title text-white text-xs font-bold text-stroke-sm">
                  {correctCount}/{totalRisks}
                </span>
              </div>
            </div>
          </div>

          {/* Indicadores de Acertos e Erros */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600/80 px-2 py-0.5 rounded-full border border-green-400 shadow-lg">
              <span className="text-sm">✓</span>
              <span className="font-game-title text-white text-xs">
                {correctCount}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-red-600/80 px-2 py-0.5 rounded-full border border-red-400 shadow-lg">
              <span className="text-sm">✗</span>
              <span className="font-game-title text-white text-xs">
                {errorCount}
              </span>
            </div>
          </div>

          {/* Indicadores à direita */}
          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-1 bg-blue-600/80 px-2 py-0.5 rounded-full border border-blue-400 shadow-lg">
              <span className="text-sm">⏱️</span>
              <span className="font-game-title text-white text-xs">
                {formatTime(time)}
              </span>
            </div>

            {/* Combo */}
            {combo > 1 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-500 px-2 py-0.5 rounded-full border border-yellow-300 shadow-lg animate-pulse-soft">
                <span className="text-sm">🔥</span>
                <span className="font-game-title text-white text-xs">
                  x{combo}
                </span>
              </div>
            )}

            {/* Settings */}
            {onSettings && (
              <button
                onClick={onSettings}
                className="btn-3d flex items-center justify-center w-8 h-8 bg-gradient-to-b from-slate-400 to-slate-600 hover:from-slate-300 hover:to-slate-500 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-105"
                title="Configurações"
                aria-label="Abrir configurações"
              >
                <Settings2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
