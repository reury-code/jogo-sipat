import { useState } from "react";
import { Phase } from "@/types/phase";
import { PHASES, STATIC_RESOURCES } from "@/data/phases";
import GameHeader from "@/components/GameHeader";
import PhaseCard from "@/components/PhaseCard";
import PhasePreviewModal from "@/components/PhasePreviewModal";
import HowToPlay from "./HowToPlay";
import { Sparkles, Trophy } from "lucide-react";

interface PhaseSelectionProps {
  onStartPhase: (phase: Phase) => void;
  unlockedPhases: number[];
}

export default function PhaseSelection({
  onStartPhase,
  unlockedPhases,
}: PhaseSelectionProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
    setPreviewOpen(true);
  };

  const handleStartPhase = (phase: Phase) => {
    onStartPhase(phase);
  };

  const handleStartFromHowToPlay = () => {
    setHowToPlayOpen(false);
    // Iniciar na fase 1
    const phase1 = PHASES.find((p) => p.id === 1);
    if (phase1) {
      onStartPhase(phase1);
    }
  };

  // Se o modal "Como Jogar" estiver aberto, mostra só ele
  if (howToPlayOpen) {
    return (
      <HowToPlay
        onClose={() => setHowToPlayOpen(false)}
        onStartGame={handleStartFromHowToPlay}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex flex-col">
      {/* Background decorativo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse-soft [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl animate-pulse-soft [animation-delay:2s]"></div>
      </div>

      {/* Header */}
      <GameHeader
        resources={STATIC_RESOURCES}
        onSettings={() => console.log("Settings")}
        onSound={() => console.log("Sound")}
        onHome={() => console.log("Home")}
        onHowToPlay={() => setHowToPlayOpen(true)}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 py-6 overflow-hidden">
        {/* Card Motivacional */}
        <div className="card-3d flex max-w-4xl mx-auto mt-1 mb-3 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-5 rounded-3xl border-4 border-yellow-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <Trophy className="w-28 h-28 text-white" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="text-6xl">
              <Sparkles className="w-7 h-7 text-white animate-pulse-soft" />
            </div>

            <div>
              <p className="text-white font-game-body text-base">
                Sua missão: mova cada risco para o seu tipo correto!
              </p>
            </div>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center space-y-3">
          <p className="text-purple-200 font-game-body text-lg max-w-2xl mx-auto">
            Selecione uma fase para jogar e testar seus conhecimentos!
          </p>
        </div>

        {/* Grid de Fases */}
        <div className="grid grid-cols-3 gap-6 mt-6 mb-3">
          {PHASES.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              onPlay={handlePhaseClick}
              isLocked={!unlockedPhases.includes(phase.id)}
            />
          ))}
        </div>

        {/* Footer decorativo */}
        <div className="text-center mt-2">
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
            <span className="text-purple-300 font-game-body text-sm">
              Boa sorte!
            </span>
            <div className="h-1 w-24 bg-gradient-to-l from-transparent to-purple-500 rounded-full"></div>
          </div>
        </div>
      </main>

      {/* Modal de Preview */}
      <PhasePreviewModal
        phase={selectedPhase}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onStart={handleStartPhase}
      />
    </div>
  );
}
