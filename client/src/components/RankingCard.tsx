import { useEffect, useState } from "react";
import { RankingEntry, getRanking } from "@/types/ranking";

export default function RankingCard() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    setRanking(getRanking());
  }, []);

  const getMedalEmoji = (position: number) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return `${position}º`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="card-3d w-full bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4 rounded-3xl border-4 border-yellow-300 max-h-[95vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center mb-3 flex-shrink-0">
        <div className="text-4xl mb-1">🏆</div>
        <h2 className="text-3xl font-game-title text-white text-stroke">
          RANKING TOP 10
        </h2>
      </div>

      {/* Lista de ranking - scrollable */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-purple-800/50">
        {ranking.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70 font-game-body text-sm">
              Nenhum jogador ainda.
              <br />
              Seja o primeiro! 🚀
            </p>
          </div>
        ) : (
          ranking.map((entry, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${
                index === 0
                  ? "from-yellow-400 to-yellow-600"
                  : index === 1
                  ? "from-gray-300 to-gray-400"
                  : index === 2
                  ? "from-orange-400 to-orange-600"
                  : "from-purple-400 to-purple-500"
              } rounded-xl p-2.5 border-2 ${
                index < 3 ? "border-white" : "border-purple-300"
              } shadow-lg hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Posição */}
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-xl font-game-title text-purple-900">
                    {getMedalEmoji(index + 1)}
                  </span>
                </div>

                {/* Nome e Data */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-game-title text-purple-900 truncate">
                    {entry.name}
                  </p>
                  <p className="text-xs text-purple-800">
                    {formatDate(entry.date)}
                  </p>
                </div>

                {/* Pontuação */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-game-title text-purple-900">
                    {entry.score}
                  </p>
                  <p className="text-xs text-purple-800">pontos</p>
                </div>
              </div>

              {/* Detalhes das fases (opcional, compacto) */}
              <div className="mt-1 flex gap-1 text-xs text-purple-800">
                <span>⚡{entry.phases.phase1}</span>
                <span>☢️{entry.phases.phase2}</span>
                <span>🦠{entry.phases.phase3}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-3 flex-shrink-0">
        <p className="text-xs text-white/80 font-game-body">
          Continue jogando para subir no ranking! 🎯
        </p>
      </div>
    </div>
  );
}
