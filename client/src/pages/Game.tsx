import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import GameCanvas, { GameCanvasHandle } from "@/components/GameCanvas";
import GameplayHeader from "@/components/GameplayHeader";
import { Phase } from "@/types/phase";
import PhaseSelection from "./PhaseSelection";

export default function Game() {
  const [gameState, setGameState] = useState<
    "selection" | "playing" | "gameover" | "victory"
  >("selection");
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [unlockedPhases, setUnlockedPhases] = useState<number[]>([1]); // Apenas fase 1 desbloqueada
  const [score, setScore] = useState(0);
  const [phaseScore, setPhaseScore] = useState(0);
  const [nextPhaseToShow, setNextPhaseToShow] = useState<Phase | null>(null);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [time, setTime] = useState(0);
  const [stars, setStars] = useState(0);
  const [coins, setCoins] = useState(0);
  const gameRef = useRef<GameCanvasHandle>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeValueRef = useRef(0); // Valor real do timer (não causa re-render)
  const headerUpdateRef = useRef<(() => void) | null>(null); // Callback para atualizar apenas o header
  const accumulatedScoreRef = useRef(0); // Pontuação acumulada de fases anteriores

  const handleStartPhase = (phase: Phase) => {
    setCurrentPhase(phase);
    setGameState("playing");
    timeValueRef.current = 0;
    setTime(0);
    setCombo(0);
    setCorrectCount(0);
    setErrorCount(0);
    setStars(0);
    setCoins(0);

    // Iniciar timer (APENAS incrementa ref, não causa re-render)
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      timeValueRef.current += 1;
      // Atualizar state apenas a cada 1 segundo para o header (mas de forma otimizada)
      setTime(timeValueRef.current);
    }, 1000);
  };

  const handleGameOver = useCallback(
    (finalScore: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhaseScore(finalScore);

      // Desbloquear próxima fase se completou a atual
      if (currentPhase && currentPhase.id < 3) {
        const nextPhaseId = currentPhase.id + 1;
        setUnlockedPhases((prev) => {
          if (!prev.includes(nextPhaseId)) {
            return [...prev, nextPhaseId];
          }
          return prev;
        });
        setGameState("gameover"); // Vai para tela de conclusão de fase
      } else if (currentPhase && currentPhase.id === 3) {
        // Se completou fase 3, vai direto para certificado
        setGameState("victory");
      }
    },
    [currentPhase]
  );

  const handlePhaseComplete = useCallback(
    (finalScore: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhaseScore(finalScore);

      // Acumular pontos para próxima fase
      accumulatedScoreRef.current += finalScore;
      setScore(accumulatedScoreRef.current);

      // Calcular estrelas baseado na taxa de acerto
      setCorrectCount((count) => {
        const accuracy = count / 10;
        if (accuracy >= 0.6) setStars(1);
        if (accuracy >= 0.8) setStars(2);
        if (accuracy === 1.0) setStars(3);
        return count;
      });

      // Desbloquear próxima fase se completou a atual
      if (currentPhase && currentPhase.id < 3) {
        const nextPhaseId = currentPhase.id + 1;
        setUnlockedPhases((prev) => {
          if (!prev.includes(nextPhaseId)) {
            return [...prev, nextPhaseId];
          }
          return prev;
        });
        setGameState("gameover"); // Vai para tela de conclusão de fase
      } else if (currentPhase && currentPhase.id === 3) {
        // Se completou fase 3, vai direto para certificado
        setGameState("victory");
      }
    },
    [currentPhase]
  );

  const handleScoreChange = useCallback((phaseCurrentScore: number) => {
    // Somar pontos acumulados + pontos da fase atual
    setScore(accumulatedScoreRef.current + phaseCurrentScore);
    // Calcular moedas baseado no total
    setCoins(
      Math.floor((accumulatedScoreRef.current + phaseCurrentScore) / 10) * 25
    );
  }, []);

  const handleComboChange = useCallback((c: number) => {
    setCombo(c);
  }, []);

  const handleCorrectCountChange = useCallback((c: number) => {
    setCorrectCount(c);
  }, []);

  const handleErrorCountChange = useCallback((c: number) => {
    setErrorCount(c);
  }, []);

  const resetToSelection = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("selection");
    setCurrentPhase(null);
    setTime(0);
  };

  const playAgain = () => {
    if (currentPhase) {
      setGameState("playing");
      timeValueRef.current = 0;
      setTime(0);
      setCombo(0);
      setCorrectCount(0);
      setCoins(0);

      // Reiniciar timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        timeValueRef.current += 1;
        setTime(timeValueRef.current);
      }, 1000);
    }
  };

  // Mapear dificuldade para inglês
  const getDifficultyEnglish = (diff: string): "easy" | "medium" | "hard" => {
    const map: Record<string, "easy" | "medium" | "hard"> = {
      fácil: "easy",
      médio: "medium",
      difícil: "hard",
    };
    return map[diff] || "easy";
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {gameState === "selection" && (
        <PhaseSelection
          onStartPhase={handleStartPhase}
          unlockedPhases={unlockedPhases}
        />
      )}

      {gameState === "playing" && currentPhase && (
        <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col overflow-hidden">
          {/* Header */}
          <GameplayHeader
            phase={currentPhase}
            stars={stars}
            maxStars={3}
            coins={coins}
            time={time}
            score={score}
            scoreChange={null}
            correctCount={correctCount}
            errorCount={errorCount}
            totalRisks={10}
            combo={combo}
            onBack={resetToSelection}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col px-4 py-6 gap-6 max-w-7xl mx-auto w-full overflow-hidden">
            {/* Game Canvas */}
            <GameCanvas
              ref={gameRef}
              phase={currentPhase.id}
              onGameOver={handleGameOver}
              onPhaseComplete={handlePhaseComplete}
              onScoreChange={handleScoreChange}
              onComboChange={handleComboChange}
              onCorrectCountChange={handleCorrectCountChange}
              onErrorCountChange={handleErrorCountChange}
            />
          </div>
        </div>
      )}

      {gameState === "gameover" && currentPhase && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
          <div className="card-3d max-w-2xl bg-gradient-to-br from-purple-800 to-indigo-900 p-8 rounded-3xl border-4 border-purple-400 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h1 className="text-5xl font-game-title text-white text-stroke mb-4">
              FASE CONCLUÍDA!
            </h1>
            <div className="text-4xl mb-6">{currentPhase.thumbnail}</div>
            <p className="text-2xl text-yellow-400 font-game-title mb-8">
              Pontuação: {phaseScore}
            </p>
            <div className="space-y-4">
              {currentPhase.id < 3 ? (
                <button
                  onClick={resetToSelection}
                  className="btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-green-300 animate-pulse-soft"
                >
                  <span className="text-stroke-sm">
                    ➡️ CONTINUAR PARA FASE {currentPhase.id + 1}
                  </span>
                </button>
              ) : null}
              <button
                onClick={playAgain}
                className="btn-3d w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-blue-300"
              >
                <span className="text-stroke-sm">🔄 JOGAR NOVAMENTE</span>
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
            <h1 className="text-6xl font-game-title text-white text-stroke mb-4">
              VITÓRIA!
            </h1>
            <div className="text-6xl mb-6">{currentPhase.thumbnail}</div>

            <div className="card-3d bg-yellow-400/90 p-6 rounded-2xl mb-8 border-4 border-yellow-200">
              <p className="text-2xl font-game-title text-purple-900 mb-2">
                🏆 CERTIFICADO VIRTUAL
              </p>
              <p className="text-xl font-game-title text-purple-800 mb-4">
                Agente SIPAT 2025
              </p>
              <p className="text-3xl font-game-title text-green-700">
                Pontuação Total: {score + phaseScore}
              </p>
            </div>

            <p className="text-white font-game-body text-lg mb-8">
              Segurança do Trabalho é um Direito Humano — proteja a vida, a
              saúde e o meio ambiente!
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setUnlockedPhases([1]);
                  setScore(0);
                  setCurrentPhase(null);
                  setGameState("selection");
                }}
                className="btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-4 rounded-2xl uppercase border-4 border-green-300"
              >
                <span className="text-stroke-sm">🔄 JOGAR NOVAMENTE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
