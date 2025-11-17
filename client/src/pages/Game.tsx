import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import GameCanvas from "@/components/GameCanvas";
import { Phase } from "@/types/phase";
import PhaseSelection from "./PhaseSelection";

export default function Game() {
  const [gameState, setGameState] = useState<"selection" | "playing" | "gameover" | "victory">("selection");
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [score, setScore] = useState(0);
  const [phaseScore, setPhaseScore] = useState(0);
  const gameRef = useRef<any>(null);

  const handleStartPhase = (phase: Phase) => {
    setCurrentPhase(phase);
    setScore(0);
    setGameState("playing");
  };

  const handleGameOver = (finalScore: number) => {
    setPhaseScore(finalScore);
    setGameState("gameover");
  };

  const handlePhaseComplete = (finalScore: number) => {
    setPhaseScore(finalScore);
    setGameState("victory");
    setScore(score + finalScore);
  };

  const resetToSelection = () => {
    setGameState("selection");
    setCurrentPhase(null);
    setScore(0);
  };

  const playAgain = () => {
    if (currentPhase) {
      setScore(0);
      setGameState("playing");
    }
  };

  return (
    <div className="min-h-screen">
      {gameState === "selection" && (
        <PhaseSelection onStartPhase={handleStartPhase} />
      )}

      {gameState === "playing" && currentPhase && (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="mb-4 text-white">
              <h2 className="text-2xl font-bold">{currentPhase.name} — {currentPhase.title}</h2>
              <p className="text-lg">Pontuação: {score}</p>
            </div>
            <GameCanvas
              ref={gameRef}
              phase={currentPhase.id}
              onGameOver={handleGameOver}
              onPhaseComplete={handlePhaseComplete}
              onScoreChange={setScore}
            />
          </div>
        </div>
      )}

      {gameState === "gameover" && currentPhase && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
          <div className="card-3d max-w-2xl bg-gradient-to-br from-purple-800 to-indigo-900 p-8 rounded-3xl border-4 border-purple-400 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h1 className="text-5xl font-game-title text-white text-stroke mb-4">FASE CONCLUÍDA!</h1>
            <div className="text-4xl mb-6">{currentPhase.thumbnail}</div>
            <p className="text-2xl text-yellow-400 font-game-title mb-8">
              Pontuação: {phaseScore}
            </p>
            <div className="space-y-4">
              <button
                onClick={playAgain}
                className="btn-3d w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-blue-300"
              >
                <span className="text-stroke-sm">🔄 JOGAR NOVAMENTE</span>
              </button>
              <button
                onClick={resetToSelection}
                className="btn-3d w-full bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-300 hover:to-purple-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-purple-300"
              >
                <span className="text-stroke-sm">◀ ESCOLHER OUTRA FASE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === "victory" && currentPhase && (
        <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Confetti effect (visual only) */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-full animate-bounce-soft opacity-70"
              />
            ))}
          </div>

          <div className="card-3d max-w-2xl bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 rounded-3xl border-4 border-yellow-300 text-center relative z-10">
            <div className="text-8xl mb-4 animate-pulse-soft">🎉</div>
            <h1 className="text-6xl font-game-title text-white text-stroke mb-4">VITÓRIA!</h1>
            <div className="text-6xl mb-6">{currentPhase.thumbnail}</div>
            
            <div className="card-3d bg-yellow-400/90 p-6 rounded-2xl mb-8 border-4 border-yellow-200">
              <p className="text-2xl font-game-title text-purple-900 mb-2">🏆 CERTIFICADO VIRTUAL</p>
              <p className="text-xl font-game-title text-purple-800 mb-4">Agente SIPAT 2025</p>
              <p className="text-3xl font-game-title text-green-700">
                Pontuação Total: {score + phaseScore}
              </p>
            </div>

            <p className="text-white font-game-body text-lg mb-8">
              Segurança do Trabalho é um Direito Humano — proteja a vida, a saúde e o meio ambiente!
            </p>

            <div className="space-y-4">
              <button
                onClick={playAgain}
                className="btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-green-300"
              >
                <span className="text-stroke-sm">🔄 JOGAR NOVAMENTE</span>
              </button>
              <button
                onClick={resetToSelection}
                className="btn-3d w-full bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-300 hover:to-purple-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-purple-300"
              >
                <span className="text-stroke-sm">◀ ESCOLHER OUTRA FASE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

