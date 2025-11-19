import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trophy, Trash2, AlertTriangle } from "lucide-react";
import {
  getRanking,
  deleteRankingEntry,
  clearRanking,
  RankingEntry,
} from "@/types/ranking";

interface RankingManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RankingManagementDialog({
  open,
  onOpenChange,
}: RankingManagementDialogProps) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);

  useEffect(() => {
    if (open) {
      loadRanking();
    }
  }, [open]);

  const loadRanking = () => {
    setRanking(getRanking());
  };

  const handleDeleteEntry = (index: number) => {
    deleteRankingEntry(index);
    loadRanking();
  };

  const handleClearAll = () => {
    clearRanking();
    loadRanking();
    setShowConfirmClearAll(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-4 border-purple-400 rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-yellow-600 to-yellow-800 p-3 flex items-center gap-2">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          <div className="relative z-10 flex items-center gap-2 w-full">
            <div className="animate-pulse-soft drop-shadow-2xl">
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>

            <div className="flex flex-col text-left flex-1">
              <div className="text-yellow-300 font-game-title text-[10px] tracking-widest uppercase">
                Gerenciamento
              </div>
              <h2 className="text-white font-game-title text-xl text-stroke leading-none">
                🏆 RANKING
              </h2>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {ranking.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-purple-300 font-game-body text-lg">
                Nenhum registro no ranking ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {ranking.map((entry, index) => (
                <div
                  key={index}
                  className="card-3d bg-gradient-to-r from-purple-700 to-purple-900 p-3 rounded-lg border-2 border-purple-400 flex items-center gap-3"
                >
                  {/* Posição */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300">
                    <span className="text-2xl font-game-title text-purple-900 text-stroke-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-game-title text-lg truncate">
                      {entry.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-purple-200 font-game-body">
                      <span>📅 {formatDate(entry.date)}</span>
                      <span className="hidden sm:inline">
                        F1: {entry.phases.phase1} • F2: {entry.phases.phase2} •
                        F3: {entry.phases.phase3}
                      </span>
                    </div>
                  </div>

                  {/* Pontuação */}
                  <div className="flex-shrink-0 text-right mr-2">
                    <div className="text-2xl font-game-title text-yellow-300 text-stroke-sm">
                      {entry.score}
                    </div>
                    <div className="text-[10px] text-purple-300 font-game-body">
                      pontos
                    </div>
                  </div>

                  {/* Botão Excluir */}
                  <button
                    onClick={() => handleDeleteEntry(index)}
                    className="btn-3d flex-shrink-0 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white p-2 rounded-lg border-2 border-red-400 transition-all hover:scale-110"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <div className="p-3 bg-gradient-to-t from-black/40 to-transparent flex gap-2">
          {!showConfirmClearAll ? (
            <>
              <button
                onClick={() => setShowConfirmClearAll(true)}
                disabled={ranking.length === 0}
                className="btn-3d flex-1 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-game-title text-xs py-2 rounded-lg uppercase border-2 border-red-400 disabled:border-gray-500 transition-all hover:scale-105 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-stroke-sm">LIMPAR TUDO</span>
              </button>

              <button
                onClick={() => onOpenChange(false)}
                className="btn-3d flex-1 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-game-title text-sm py-2 rounded-lg uppercase border-2 border-blue-300 transition-all hover:scale-105"
              >
                <span className="text-stroke-sm">✅ FECHAR</span>
              </button>
            </>
          ) : (
            <div className="w-full space-y-2">
              <div className="bg-red-900/50 border-2 border-red-400 rounded-lg p-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <p className="text-white font-game-body text-xs">
                  Tem certeza? Esta ação não pode ser desfeita!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmClearAll(false)}
                  className="btn-3d flex-1 bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-300 hover:to-gray-500 text-white font-game-title text-xs py-2 rounded-lg uppercase border-2 border-gray-300 transition-all hover:scale-105"
                >
                  <span className="text-stroke-sm">CANCELAR</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="btn-3d flex-1 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-game-title text-xs py-2 rounded-lg uppercase border-2 border-red-400 transition-all hover:scale-105 animate-pulse-soft"
                >
                  <span className="text-stroke-sm">✅ CONFIRMAR EXCLUSÃO</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
