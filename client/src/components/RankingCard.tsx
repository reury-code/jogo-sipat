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
    <div className="card-3d w-full h-full bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-800 rounded-3xl border-4 border-purple-400 shadow-2xl flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0 border-b-2 border-purple-400/40 pb-3">
          <div className="text-4xl mb-1">🏆</div>
          <h2 className="text-3xl font-game-title text-yellow-300 text-stroke">
            RANKING TOP 10
          </h2>
          <p className="text-xs text-purple-200 font-game-body mt-1">
            Os melhores agentes de segurança
          </p>
        </div>

        {/* Lista de ranking - scrollable */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-900/50 min-h-0">
          {ranking.length === 0 ? (
            <div className="text-center py-12 bg-purple-900/30 rounded-xl border-2 border-dashed border-purple-400/40">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-purple-200 font-game-body text-sm">
                Nenhum jogador ainda.
                <br />
                <span className="text-yellow-300 font-game-title">
                  Seja o primeiro! 🚀
                </span>
              </p>
            </div>
          ) : (
            ranking.map((entry, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${
                  index === 0
                    ? "from-yellow-500 to-amber-600"
                    : index === 1
                      ? "from-slate-300 to-slate-400"
                      : index === 2
                        ? "from-orange-400 to-orange-600"
                        : "from-purple-500 to-indigo-600"
                } rounded-xl p-3 border-2 ${
                  index === 0
                    ? "border-yellow-300"
                    : index === 1
                      ? "border-slate-200"
                      : index === 2
                        ? "border-orange-300"
                        : "border-purple-300"
                } shadow-lg backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Posição */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <span
                      className={`text-2xl font-game-title ${
                        index < 3 ? "drop-shadow-lg" : "text-white"
                      }`}
                    >
                      {getMedalEmoji(index + 1)}
                    </span>
                  </div>

                  {/* Nome e Data */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-base font-game-title truncate ${
                        index < 3 ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {entry.name}
                    </p>
                    <p
                      className={`text-xs ${
                        index < 3 ? "text-slate-700" : "text-purple-100"
                      }`}
                    >
                      {formatDate(entry.date)}
                    </p>
                  </div>

                  {/* Pontuação */}
                  <div className="flex-shrink-0 text-right bg-black/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                    <p
                      className={`text-xl font-game-title ${
                        index === 0
                          ? "text-yellow-100"
                          : index === 1
                            ? "text-slate-100"
                            : index === 2
                              ? "text-orange-100"
                              : "text-white"
                      }`}
                    >
                      {entry.score}
                    </p>
                    <p
                      className={`text-[10px] ${
                        index < 3 ? "text-slate-200" : "text-purple-100"
                      }`}
                    >
                      pontos
                    </p>
                  </div>
                </div>

                {/* Detalhes das fases */}
                <div
                  className={`mt-2 flex gap-2 text-xs font-game-body ${
                    index < 3 ? "text-slate-800" : "text-purple-100"
                  } bg-black/10 rounded-lg px-2 py-1`}
                >
                  <span className="flex items-center gap-1">
                    <span>⚡</span>
                    <span className="font-semibold">{entry.phases.phase1}</span>
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1">
                    <span>☢️</span>
                    <span className="font-semibold">{entry.phases.phase2}</span>
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1">
                    <span>🦠</span>
                    <span className="font-semibold">{entry.phases.phase3}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 flex-shrink-0 border-t-2 border-purple-400/40 pt-3">
          <p className="text-xs text-purple-200 font-game-body">
            💪 Continue jogando para subir no ranking!
          </p>
        </div>
      </div>
    </div>
  );
}
