import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Settings, RotateCcw } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { DEFAULT_SETTINGS } from "@/types/settings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  const handleClose = () => {
    setLocalSettings(settings); // Reverter mudanças se cancelar
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-4 border-purple-400 rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-600 to-gray-800 p-3 flex items-center gap-2">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          <div className="relative z-10 flex items-center gap-2 w-full">
            {/* Ícone */}
            <div className="animate-pulse-soft drop-shadow-2xl">
              <Settings className="w-8 h-8 text-yellow-300" />
            </div>

            {/* Textos */}
            <div className="flex flex-col text-left flex-1">
              <div className="text-yellow-300 font-game-title text-[10px] tracking-widest uppercase">
                Personalizar Jogo
              </div>
              <h2 className="text-white font-game-title text-xl text-stroke leading-none">
                ⚙️ CONFIGURAÇÕES
              </h2>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Itens por Fase */}
          <div className="card-3d bg-gradient-to-br from-purple-700 to-purple-900 p-2.5 rounded-lg border-2 border-purple-400">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <h3 className="text-white font-game-title text-sm">
                  📦 Itens por Fase
                </h3>
                <p className="text-purple-200 text-[9px] font-game-body">
                  Quantos riscos cairão em cada fase
                </p>
              </div>
              <span className="text-xl font-game-title text-yellow-300 text-stroke-sm min-w-[40px] text-right">
                {localSettings.itemsPerPhase}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={localSettings.itemsPerPhase}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  itemsPerPhase: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-purple-900 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Quantidade de itens por fase"
            />
            <div className="flex justify-between text-[9px] text-purple-300 font-game-body mt-0.5">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          {/* Velocidade Normal */}
          <div className="card-3d bg-gradient-to-br from-blue-700 to-blue-900 p-2.5 rounded-lg border-2 border-blue-400">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <h3 className="text-white font-game-title text-sm">
                  🐌 Velocidade Normal
                </h3>
                <p className="text-blue-200 text-[9px] font-game-body">
                  Velocidade de queda padrão dos itens
                </p>
              </div>
              <span className="text-xl font-game-title text-yellow-300 text-stroke-sm min-w-[40px] text-right">
                {localSettings.normalFallSpeed.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0.3}
              max={2}
              step={0.1}
              value={localSettings.normalFallSpeed}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  normalFallSpeed: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-blue-900 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Velocidade normal de queda"
            />
            <div className="flex justify-between text-[9px] text-blue-300 font-game-body mt-0.5">
              <span>0.3</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Multiplicador de Velocidade Rápida */}
          <div className="card-3d bg-gradient-to-br from-red-700 to-red-900 p-2.5 rounded-lg border-2 border-red-400">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <h3 className="text-white font-game-title text-sm">
                  🚀 Turbo ao Apertar ↓
                </h3>
                <p className="text-red-200 text-[9px] font-game-body">
                  Quantas vezes mais rápido ao pressionar seta
                </p>
              </div>
              <span className="text-xl font-game-title text-yellow-300 text-stroke-sm min-w-[40px] text-right">
                {localSettings.fastFallMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={localSettings.fastFallMultiplier}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  fastFallMultiplier: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-red-900 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Multiplicador de velocidade rápida"
            />
            <div className="flex justify-between text-[9px] text-red-300 font-game-body mt-0.5">
              <span>2x</span>
              <span>10x</span>
            </div>
          </div>

          {/* Dicas por Jogo */}
          <div className="card-3d bg-gradient-to-br from-green-700 to-green-900 p-2.5 rounded-lg border-2 border-green-400">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <h3 className="text-white font-game-title text-sm">
                  💡 Dicas por Jogo
                </h3>
                <p className="text-green-200 text-[9px] font-game-body">
                  Número de ajudas disponíveis durante o jogo
                </p>
              </div>
              <span className="text-xl font-game-title text-yellow-300 text-stroke-sm min-w-[40px] text-right">
                {localSettings.hintsPerGame}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={localSettings.hintsPerGame}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  hintsPerGame: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-green-900 rounded-full appearance-none cursor-pointer accent-yellow-400"
              aria-label="Número de dicas por jogo"
            />
            <div className="flex justify-between text-[9px] text-green-300 font-game-body mt-0.5">
              <span>0</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="p-3 bg-gradient-to-t from-black/40 to-transparent flex gap-2">
          <button
            onClick={handleReset}
            className="btn-3d flex-1 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 text-white font-game-title text-xs py-2 rounded-lg uppercase border-2 border-orange-300 transition-all hover:scale-105 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-stroke-sm">RESTAURAR</span>
          </button>

          <button
            onClick={handleSave}
            className="btn-3d flex-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-sm py-2 rounded-lg uppercase border-2 border-green-300 transition-all hover:scale-105 animate-pulse-soft"
          >
            <span className="text-stroke-sm">✅ SALVAR</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
