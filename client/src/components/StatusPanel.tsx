import { getComboMultiplier, getComboLevel } from "@/types/scoring";

interface StatusPanelProps {
  score: number;
  scoreChange: number | null;
  correctCount: number;
  errorCount: number;
  totalRisks: number;
  combo: number;
  difficulty: "easy" | "medium" | "hard";
}

export default function StatusPanel({
  score,
  scoreChange,
  correctCount,
  errorCount,
  totalRisks,
  combo,
  difficulty,
}: StatusPanelProps) {
  const completedRisks = correctCount + errorCount;
  const correctPercentage = (correctCount / totalRisks) * 100;
  const errorPercentage = (errorCount / totalRisks) * 100;
  const multiplier = getComboMultiplier(combo);
  const comboLevel = getComboLevel(combo);

  const difficultyConfig = {
    easy: {
      label: "FÁCIL",
      color: "from-green-400 to-green-600",
      icon: "⚡",
    },
    medium: {
      label: "MÉDIO",
      color: "from-yellow-400 to-yellow-600",
      icon: "⚡⚡",
    },
    hard: {
      label: "DIFÍCIL",
      color: "from-red-400 to-red-600",
      icon: "⚡⚡⚡",
    },
  };

  const config = difficultyConfig[difficulty];

  // Configuração de cores do combo baseado no nível
  const comboConfig = {
    BÁSICO: { bg: "from-gray-400 to-gray-600", text: "1x" },
    MÉDIO: { bg: "from-blue-400 to-blue-600", text: "1.5x" },
    ALTO: { bg: "from-purple-400 to-purple-600", text: "2x" },
    MEGA: { bg: "from-orange-400 to-red-500", text: "3x" },
  };

  const currentCombo = comboConfig[comboLevel as keyof typeof comboConfig];

  return (
    <div className="card-3d bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl border-4 border-cyan-400 shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-6">
        {/* Pontuação Principal */}
        <div className="flex-1 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl animate-pulse-soft">💯</span>
            <h3 className="text-lg font-game-title text-cyan-200 uppercase tracking-wide">
              PONTOS
            </h3>
          </div>

          <div className="relative">
            <div className="text-6xl font-game-title text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-500 text-stroke mb-2">
              {score}
            </div>

            {/* Feedback de pontuação (+10, -5, etc.) */}
            {scoreChange !== null && scoreChange !== 0 && (
              <div
                className={`absolute -top-2 -right-2 text-2xl font-game-title animate-bounce-soft text-stroke-sm ${
                  scoreChange > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {scoreChange > 0 ? "+" : ""}
                {scoreChange}
              </div>
            )}
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="font-game-title text-white text-sm uppercase">
                PROGRESSO
              </span>
            </div>
            <span className="font-game-title text-white text-lg">
              {completedRisks}/{totalRisks}
            </span>
          </div>

          {/* Container da Barra */}
          <div className="relative h-7 bg-slate-900/60 rounded-full border-2 border-slate-300 overflow-hidden shadow-inner">
            {/* Barra de Acertos (Verde) */}
            <div
              className="absolute left-0 h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${correctPercentage}%` }}
            >
              {/* Pattern de listras (diagonal) */}
              <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.3)_10px,rgba(255,255,255,0.3)_20px)]" />
              {/* Brilho/glow na borda */}
              <div className="absolute inset-0 shadow-[inset_0_-2px_8px_rgba(255,255,255,0.5)]" />
            </div>

            {/* Barra de Erros (Vermelho) */}
            <div
              className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
              style={{
                left: `${correctPercentage}%`,
                width: `${errorPercentage}%`,
              }}
            >
              {/* Pattern de X's para indicar erros */}
              <div className="absolute inset-0 opacity-40 text-white text-xs flex items-center justify-center font-bold">
                {errorCount > 0 && "✕".repeat(Math.min(errorCount, 3))}
              </div>
            </div>

            {/* Indicador de Progresso */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-1">
                {correctCount > 0 && (
                  <span className="font-game-title text-white text-sm font-bold text-stroke-sm">
                    ✓{correctCount}
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="font-game-title text-white text-sm font-bold text-stroke-sm">
                    ✕{errorCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Badge de Nível + Combo */}
        <div className="flex-1 flex flex-col gap-2 items-center">
          <div
            className={`px-6 py-3 bg-gradient-to-b ${config.color} rounded-full border-3 border-white shadow-lg`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <span className="font-game-title text-white text-base uppercase">
                {config.label}
              </span>
            </div>
          </div>

          {/* Combo Counter */}
          {combo > 0 && (
            <div
              className={`px-4 py-2 bg-gradient-to-r ${currentCombo.bg} rounded-full border-2 border-yellow-300 shadow-lg ${combo >= 3 ? "animate-pulse-soft" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span className="font-game-title text-white text-sm uppercase">
                  {comboLevel} {currentCombo.text}
                </span>
                <span className="font-game-title text-white text-xs">
                  ({combo} combo)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
