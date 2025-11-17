import { useState } from "react";
import { Phase } from "@/types/phase";
import { PHASES, STATIC_RESOURCES } from "@/data/phases";
import GameHeader from "@/components/GameHeader";
import PhaseCard from "@/components/PhaseCard";
import PhasePreviewModal from "@/components/PhasePreviewModal";
import { Sparkles, Trophy } from "lucide-react";

interface PhaseSelectionProps {
  onStartPhase: (phase: Phase) => void;
}

export default function PhaseSelection({ onStartPhase }: PhaseSelectionProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
    setPreviewOpen(true);
  };

  const handleStartPhase = (phase: Phase) => {
    onStartPhase(phase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      
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
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Título Principal */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <h1 className="font-game-title text-5xl sm:text-6xl text-white text-stroke mb-2 animate-bounce-soft">
              🎯 ESCOLHA SUA MISSÃO
            </h1>
            <div className="h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
          </div>
          
          <p className="text-purple-200 font-game-body text-xl max-w-2xl mx-auto">
            Selecione uma fase para jogar e testar seus conhecimentos!
          </p>
        </div>

        {/* Card Motivacional */}
        <div className="card-3d max-w-3xl mx-auto bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-6 rounded-3xl border-4 border-yellow-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <Trophy className="w-32 h-32 text-white" />
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="text-6xl">
              <Sparkles className="w-12 h-12 text-white animate-pulse-soft" />
            </div>
            
            <div>
              <h2 className="font-game-title text-2xl text-white text-stroke-sm mb-2">
                APRENDA E AVANCE!
              </h2>
              <p className="text-white font-game-body">
                Todas as fases estão disponíveis. Treine seus conhecimentos e divirta-se!
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Fases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {PHASES.map((phase) => (
            <PhaseCard 
              key={phase.id}
              phase={phase}
              onPlay={handlePhaseClick}
            />
          ))}
        </div>

        {/* Footer decorativo */}
        <div className="text-center py-8 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
            <span className="text-purple-300 font-game-body">Boa sorte!</span>
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
