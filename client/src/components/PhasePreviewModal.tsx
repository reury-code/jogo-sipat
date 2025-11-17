import { Phase } from "@/types/phase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, X, Play } from "lucide-react";

interface PhasePreviewModalProps {
  phase: Phase | null;
  open: boolean;
  onClose: () => void;
  onStart: (phase: Phase) => void;
}

export default function PhasePreviewModal({ phase, open, onClose, onStart }: PhasePreviewModalProps) {
  if (!phase) return null;

  const handleStart = () => {
    onStart(phase);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-4 border-purple-400 rounded-3xl p-0 overflow-hidden">
        
        {/* Header com thumbnail */}
        <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-8 pb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          <div className="relative z-10 text-center">
            <div className="text-8xl mb-4 animate-bounce-soft drop-shadow-2xl">
              {phase.thumbnail}
            </div>
            
            <div className="text-yellow-300 font-game-title text-lg mb-2 tracking-widest">
              {phase.name}
            </div>
            
            <h2 className="text-white font-game-title text-4xl text-stroke mb-3">
              {phase.title}
            </h2>
            
            <p className="text-purple-100 font-game-body text-lg max-w-md mx-auto">
              {phase.description}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8 space-y-6">
          
          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-3d bg-gradient-to-b from-orange-400 to-orange-600 p-4 rounded-2xl text-center border-3 border-orange-300">
              <div className="text-white font-game-title text-sm mb-1">DIFICULDADE</div>
              <div className="text-white font-game-title text-xl uppercase text-stroke-sm">
                {phase.difficulty}
              </div>
            </div>
            
            <div className="card-3d bg-gradient-to-b from-blue-400 to-blue-600 p-4 rounded-2xl text-center border-3 border-blue-300">
              <div className="text-white font-game-title text-sm mb-1">TEMA</div>
              <div className="text-white font-game-title text-xl text-stroke-sm">
                {phase.theme}
              </div>
            </div>
            
            <div className="card-3d bg-gradient-to-b from-green-400 to-green-600 p-4 rounded-2xl text-center border-3 border-green-300">
              <div className="text-white font-game-title text-sm mb-1">DURAÇÃO</div>
              <div className="text-white font-game-title text-xl text-stroke-sm">
                {phase.duration}
              </div>
            </div>
          </div>

          {/* Objetivos */}
          <div className="card-3d bg-purple-800/50 p-6 rounded-2xl border-2 border-purple-400">
            <h3 className="text-yellow-300 font-game-title text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              OBJETIVOS
            </h3>
            <ul className="space-y-2">
              {phase.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-400 font-bold text-xl">✓</span>
                  <span className="text-white font-game-body">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dicas (se houver) */}
          {phase.tips && phase.tips.length > 0 && (
            <div className="card-3d bg-blue-800/50 p-6 rounded-2xl border-2 border-blue-400">
              <h3 className="text-yellow-300 font-game-title text-xl mb-4">💡 DICAS</h3>
              <ul className="space-y-2">
                {phase.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl">•</span>
                    <span className="text-white font-game-body text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="btn-3d flex-1 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-red-300 transition-all hover:scale-105"
            >
              <span className="text-stroke-sm flex items-center justify-center gap-2">
                <X className="w-6 h-6" />
                CANCELAR
              </span>
            </button>
            
            <button
              onClick={handleStart}
              className="btn-3d flex-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-green-300 transition-all hover:scale-105 animate-pulse-soft"
            >
              <span className="text-stroke-sm flex items-center justify-center gap-2">
                <Play className="w-6 h-6" />
                COMEÇAR
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
