import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import GameCanvas, { GameCanvasHandle } from "@/components/GameCanvas";
import GameplayHeader from "@/components/GameplayHeader";
import { Phase } from "@/types/phase";
import { PhaseScore, GameScore } from "@/types/scoring";
import { saveRankingEntry } from "@/types/ranking";
import PhaseSelection from "./PhaseSelection";
import PlayerNameDialog from "@/components/PlayerNameDialog";
import RankingCard from "@/components/RankingCard";
import VictoryCelebrationDialog from "@/components/VictoryCelebrationDialog";
import { useSettings } from "@/contexts/SettingsContext";

export default function Game() {
  const { settings } = useSettings();
  const [gameState, setGameState] = useState<
    "selection" | "playing" | "gameover" | "victory"
  >("selection");
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [unlockedPhases, setUnlockedPhases] = useState<number[]>([1]); // Apenas fase 1 desbloqueada
  const [score, setScore] = useState(0);
  const [currentPhaseScore, setCurrentPhaseScore] = useState<PhaseScore | null>(
    null
  );
  const [gameScore, setGameScore] = useState<GameScore>({
    phase1: null,
    phase2: null,
    phase3: null,
    grandTotal: 0,
  });
  const [nextPhaseToShow, setNextPhaseToShow] = useState<Phase | null>(null);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [time, setTime] = useState(0);
  const [stars, setStars] = useState(0);
  const [coins, setCoins] = useState(0);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingPhase, setPendingPhase] = useState<Phase | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationPosition, setCelebrationPosition] = useState<number>(0);
  const gameRef = useRef<GameCanvasHandle>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeValueRef = useRef(0); // Valor real do timer (não causa re-render)
  const headerUpdateRef = useRef<(() => void) | null>(null); // Callback para atualizar apenas o header

  const handlePlayerNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameDialog(false);
    if (pendingPhase) {
      startPhase(pendingPhase);
      setPendingPhase(null);
    }
  };

  const startPhase = (phase: Phase) => {
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

  const handleStartPhase = (phase: Phase) => {
    // Se não tem nome do jogador, pedir antes de começar
    if (!playerName) {
      setPendingPhase(phase);
      setShowNameDialog(true);
      return;
    }
    startPhase(phase);
  };

  const handleGameOver = useCallback(
    (finalScore: number) => {
      if (timerRef.current) clearInterval(timerRef.current);

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
    (phaseScore: PhaseScore) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentPhaseScore(phaseScore);

      // Atualizar gameScore com a pontuação da fase
      setGameScore((prev) => {
        const updated = { ...prev };
        if (currentPhase?.id === 1) updated.phase1 = phaseScore;
        if (currentPhase?.id === 2) updated.phase2 = phaseScore;
        if (currentPhase?.id === 3) updated.phase3 = phaseScore;

        // Calcular total acumulado (garantir que nunca seja negativo)
        updated.grandTotal = Math.max(
          0,
          (updated.phase1?.totalPoints || 0) +
            (updated.phase2?.totalPoints || 0) +
            (updated.phase3?.totalPoints || 0)
        );

        return updated;
      });

      // Atualizar score total na UI
      setScore((prev) => prev + phaseScore.totalPoints);

      // Calcular estrelas baseado na taxa de acerto
      const accuracy = phaseScore.correctCount / settings.itemsPerPhase;
      if (accuracy >= 0.6) setStars(1);
      if (accuracy >= 0.8) setStars(2);
      if (accuracy === 1.0) setStars(3);

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
        // Se completou fase 3, salvar no ranking e ir para certificado
        setGameScore((prev) => {
          const updated = { ...prev };
          if (currentPhase?.id === 3) updated.phase3 = phaseScore;
          updated.grandTotal = Math.max(
            0,
            (updated.phase1?.totalPoints || 0) +
              (updated.phase2?.totalPoints || 0) +
              (updated.phase3?.totalPoints || 0)
          );

          // Salvar no ranking e verificar se entrou no Top 3
          if (playerName) {
            const position = saveRankingEntry({
              name: playerName,
              score: updated.grandTotal,
              date: new Date().toISOString(),
              phases: {
                phase1: updated.phase1?.totalPoints || 0,
                phase2: updated.phase2?.totalPoints || 0,
                phase3: updated.phase3?.totalPoints || 0,
              },
            });

            // Se entrou no Top 3, mostrar popup de celebração
            if (position && position <= 3) {
              setCelebrationPosition(position);
              setShowCelebration(true);
            }
          }

          return updated;
        });
        setGameState("victory");
      }
    },
    [currentPhase, playerName]
  );

  const handleScoreChange = useCallback(
    (phaseCurrentScore: number) => {
      // Atualizar o score em tempo real com os pontos base da fase atual
      // (soma com pontos acumulados das fases anteriores)
      const previousPhasesScore =
        (gameScore.phase1?.totalPoints || 0) +
        (gameScore.phase2?.totalPoints || 0) +
        (gameScore.phase3?.totalPoints || 0);

      setScore(previousPhasesScore + phaseCurrentScore);
      setCoins(Math.floor((previousPhasesScore + phaseCurrentScore) / 10) * 25);
    },
    [gameScore]
  );

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
          gameScore={gameScore}
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
            totalRisks={settings.itemsPerPhase}
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

      {gameState === "gameover" && currentPhase && currentPhaseScore && (
        <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
          <div className="card-3d max-w-2xl w-full bg-gradient-to-br from-purple-800 to-indigo-900 p-6 rounded-3xl border-4 border-purple-400 max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">⭐</div>
              <h1 className="text-4xl font-game-title text-white text-stroke mb-2">
                FASE CONCLUÍDA!
              </h1>
              <div className="text-3xl mb-1">{currentPhase.thumbnail}</div>
              <p className="text-base text-purple-200">{currentPhase.name}</p>
            </div>

            {/* Detalhamento de Pontuação - Scrollable se necessário */}
            <div className="bg-black/30 rounded-2xl p-4 mb-4 flex-shrink-0">
              <h2 className="text-xl font-game-title text-yellow-400 text-center mb-3">
                📊 DETALHAMENTO DE PONTOS
              </h2>

              <div className="space-y-2 text-white font-game-body text-sm">
                <div className="flex justify-between items-center">
                  <span>
                    💯 Pontos Base ({currentPhaseScore.correctCount} acertos,{" "}
                    {currentPhaseScore.errorCount} erros):
                  </span>
                  <span
                    className={`text-xl font-game-title ${
                      currentPhaseScore.basePoints >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {currentPhaseScore.basePoints >= 0 ? "+" : ""}
                    {currentPhaseScore.basePoints}
                  </span>
                </div>

                {currentPhaseScore.timeBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span>
                      ⚡ Bônus de Tempo (
                      {Math.floor(currentPhaseScore.totalTime)}s):
                    </span>
                    <span className="text-xl font-game-title text-blue-400">
                      +{currentPhaseScore.timeBonus}
                    </span>
                  </div>
                )}

                {currentPhaseScore.performanceBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span>🏆 Bônus de Performance:</span>
                    <span className="text-xl font-game-title text-purple-400">
                      +{currentPhaseScore.performanceBonus}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-purple-400 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-game-title">
                      🎯 TOTAL DA FASE:
                    </span>
                    <span className="text-3xl font-game-title text-yellow-300">
                      {currentPhaseScore.totalPoints}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2">
                  <span className="text-base font-game-title">
                    💰 PONTUAÇÃO ACUMULADA:
                  </span>
                  <span className="text-2xl font-game-title text-yellow-400">
                    {gameScore.grandTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3 flex-shrink-0">
              {currentPhase.id < 3 ? (
                <button
                  onClick={resetToSelection}
                  className="btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-lg py-3 rounded-2xl uppercase border-4 border-green-300 animate-pulse-soft"
                >
                  <span className="text-stroke-sm">
                    ➡️ CONTINUAR PARA FASE {currentPhase.id + 1}
                  </span>
                </button>
              ) : null}
              <button
                onClick={playAgain}
                className="btn-3d w-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white font-game-title text-lg py-3 rounded-2xl uppercase border-4 border-blue-300"
              >
                <span className="text-stroke-sm">🔄 JOGAR NOVAMENTE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === "victory" && currentPhase && (
        <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Confetti effect (visual only) */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-bounce-soft opacity-40"
              />
            ))}
          </div>

          {/* Layout lado a lado: Card de Vitória + Ranking */}
          <div className="flex gap-4 w-full max-w-6xl h-[calc(100vh-2rem)] relative z-10">
            {/* Card de Vitória */}
            <div className="card-3d flex-1 h-full bg-gradient-to-br from-purple-800 to-indigo-900 p-4 rounded-3xl border-4 border-purple-400 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="text-center mb-2 flex-shrink-0">
                <div className="text-5xl mb-1 animate-pulse-soft">🎉</div>
                <h1 className="text-3xl font-game-title text-white text-stroke mb-1">
                  VITÓRIA COMPLETA!
                </h1>
                <div className="text-3xl mb-1">{currentPhase.thumbnail}</div>
              </div>

              {/* Resumo das 3 Fases - Compacto */}
              <div className="bg-black/40 rounded-2xl p-3 mb-3 flex-shrink-0 overflow-y-auto">
                <h2 className="text-base font-game-title text-yellow-300 text-center mb-2">
                  📊 RESUMO DAS FASES
                </h2>

                <div className="space-y-1.5">
                  {gameScore.phase1 && (
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-game-title text-white">
                          ⚡ FASE 1 - Aprendizagem
                        </span>
                        <span className="text-lg font-game-title text-green-400">
                          {gameScore.phase1.totalPoints} pts
                        </span>
                      </div>
                      <div className="text-xs text-white/70 mt-0.5">
                        {gameScore.phase1.correctCount}/{settings.itemsPerPhase}{" "}
                        acertos • {Math.floor(gameScore.phase1.totalTime)}s
                      </div>
                    </div>
                  )}

                  {gameScore.phase2 && (
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-game-title text-white">
                          ☢️ FASE 2 - Memória
                        </span>
                        <span className="text-lg font-game-title text-red-400">
                          {gameScore.phase2.totalPoints} pts
                        </span>
                      </div>
                      <div className="text-xs text-white/70 mt-0.5">
                        {gameScore.phase2.correctCount}/{settings.itemsPerPhase}{" "}
                        acertos • {Math.floor(gameScore.phase2.totalTime)}s
                      </div>
                    </div>
                  )}

                  {gameScore.phase3 && (
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-game-title text-white">
                          🦠 FASE 3 - Atenção
                        </span>
                        <span className="text-lg font-game-title text-orange-400">
                          {gameScore.phase3.totalPoints} pts
                        </span>
                      </div>
                      <div className="text-xs text-white/70 mt-0.5">
                        {gameScore.phase3.correctCount}/{settings.itemsPerPhase}{" "}
                        acertos • {Math.floor(gameScore.phase3.totalTime)}s
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificado */}
              <div className="card-3d bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-2xl mb-3 border-4 border-yellow-400 flex-shrink-0">
                <p className="text-lg font-game-title text-purple-900 mb-0.5">
                  🏆 CERTIFICADO VIRTUAL
                </p>
                <p className="text-base font-game-title text-purple-900 mb-1">
                  Agente SIPAT 2025
                </p>
                <p className="text-2xl font-game-title text-green-800 mb-0.5">
                  {gameScore.grandTotal} PONTOS
                </p>
                <p className="text-xs text-purple-800">
                  Tempo total:{" "}
                  {Math.floor(
                    (gameScore.phase1?.totalTime || 0) +
                      (gameScore.phase2?.totalTime || 0) +
                      (gameScore.phase3?.totalTime || 0)
                  )}
                  s
                </p>
              </div>

              {/* Mensagem */}
              <p className="text-purple-200 font-game-body text-xs mb-3 text-center flex-shrink-0">
                Segurança do Trabalho é um Direito Humano — proteja a vida, a
                saúde e o meio ambiente!
              </p>

              {/* Botão */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    // Resetar todos os estados do jogo
                    setUnlockedPhases([1]);
                    setScore(0);
                    setGameScore({
                      phase1: null,
                      phase2: null,
                      phase3: null,
                      grandTotal: 0,
                    });
                    setCurrentPhase(null);
                    setPlayerName(null); // Limpar nome do jogador
                    setGameState("selection");
                  }}
                  className="btn-3d w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-game-title text-base py-2.5 rounded-2xl uppercase border-4 border-green-400"
                >
                  <span className="text-stroke-sm">🏠 VOLTAR PARA HOME</span>
                </button>
              </div>
            </div>

            {/* Card de Ranking */}
            <div className="flex-1 h-full">
              <RankingCard />
            </div>
          </div>
        </div>
      )}

      {/* Dialog de Nome do Jogador */}
      <PlayerNameDialog
        isOpen={showNameDialog}
        onConfirm={handlePlayerNameSubmit}
        onCancel={() => {
          setShowNameDialog(false);
          setPendingPhase(null);
        }}
      />

      {/* Dialog de Celebração Top 3 */}
      <VictoryCelebrationDialog
        isOpen={showCelebration}
        position={celebrationPosition}
        score={gameScore.grandTotal}
        playerName={playerName || "Jogador"}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
