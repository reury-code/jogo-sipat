interface ControlsHUDProps {
  isMinimized?: boolean;
  onToggle?: () => void;
}

export default function ControlsHUD({
  isMinimized = false,
  onToggle,
}: ControlsHUDProps) {
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={onToggle}
          className="btn-3d w-12 h-12 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          title="Mostrar controles"
          aria-label="Mostrar controles"
        >
          <span className="text-2xl">❓</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="card-3d bg-slate-800/95 p-6 rounded-2xl border-4 border-cyan-400 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-game-title text-white text-xl uppercase">
            CONTROLES:
          </h3>
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-white/60 hover:text-white text-xl"
              title="Minimizar"
              aria-label="Minimizar controles"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Mover */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <kbd className="kbd-key">←</kbd>
              <kbd className="kbd-key">→</kbd>
            </div>
            <span className="font-game-title text-white text-base">Mover</span>
          </div>

          {/* Acelerar */}
          <div className="flex items-center gap-3">
            <kbd className="kbd-key">↓</kbd>
            <span className="font-game-title text-white text-base">
              Acelerar
            </span>
          </div>

          {/* Pausar */}
          <div className="flex items-center gap-3">
            <kbd className="kbd-key px-4">ESPAÇO</kbd>
            <span className="font-game-title text-white text-base">Pausar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
