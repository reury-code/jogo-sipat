import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";

interface GameCanvasProps {
  phase: number;
  onGameOver: (score: number) => void;
  onPhaseComplete: (score: number) => void;
  onScoreChange: (score: number) => void;
  onComboChange?: (combo: number) => void;
  onCorrectCountChange?: (count: number) => void;
  onErrorCountChange?: (count: number) => void;
}

export interface GameCanvasHandle {
  pause: () => void;
  resume: () => void;
  isPaused: () => boolean;
}

const RISKS = {
  1: {
    name: "Físico",
    color: "#22c55e",
    icon: "⚡",
    risks: [
      { name: "Ruído", icon: "🔊" },
      { name: "Calor", icon: "🔥" },
      { name: "Frio", icon: "❄️" },
      { name: "Vibrações", icon: "📳" },
      { name: "Pressões", icon: "💨" },
      { name: "Umidade", icon: "💧" },
    ],
  },
  2: {
    name: "Químico",
    color: "#ef4444",
    icon: "☢️",
    risks: [
      { name: "Poeiras", icon: "💨" },
      { name: "Gases", icon: "☁️" },
      { name: "Vapores", icon: "🌫️" },
      { name: "Névoas", icon: "🌁" },
      { name: "Fumos", icon: "💨" },
      { name: "Neblinas", icon: "🌫️" },
    ],
  },
  3: {
    name: "Biológico",
    color: "#92400e",
    icon: "🦠",
    risks: [
      { name: "Vírus", icon: "🦠" },
      { name: "Bactérias", icon: "🧫" },
      { name: "Fungos", icon: "🍄" },
      { name: "Parasitas", icon: "🪱" },
      { name: "Protozoários", icon: "🦠" },
      { name: "Insetos", icon: "🦗" },
    ],
  },
  4: {
    name: "Ergonômico",
    color: "#eab308",
    icon: "🪑",
    risks: [
      { name: "Postura Inadequada", icon: "🧍" },
      { name: "Repetitividade", icon: "🔄" },
      { name: "Levantamento de Peso", icon: "🏋️" },
      { name: "Ritmo Excessivo", icon: "⚡" },
      { name: "Monotonia", icon: "😴" },
      { name: "Turnos", icon: "🕐" },
    ],
  },
  5: {
    name: "Acidente",
    color: "#3b82f6",
    icon: "⚠️",
    risks: [
      { name: "Eletricidade", icon: "⚡" },
      { name: "Máquinas", icon: "⚙️" },
      { name: "Quedas", icon: "🪜" },
      { name: "Incêndio", icon: "🔥" },
      { name: "Arranjo Físico", icon: "📦" },
      { name: "Iluminação", icon: "💡" },
    ],
  },
};

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  (
    {
      phase,
      onGameOver,
      onPhaseComplete,
      onScoreChange,
      onComboChange,
      onCorrectCountChange,
      onErrorCountChange,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [risksCount, setRisksCount] = useState(0);
    const [feedback, setFeedback] = useState<{
      text: string;
      type: "correct" | "error";
      timestamp: number;
    } | null>(null);
    const gameStateRef = useRef({
      score: 0,
      correctCount: 0,
      errorCount: 0,
      risksCompleted: 0,
      maxRisks: 10,
      riskX: 0, // Posição X livre (não preso em coluna)
      riskY: 0,
      riskSpeed: 0.6, // Velocidade base de queda (reduzida de 1.2 para 0.8)
      riskSize: 120, // Tamanho do card do risco (para compatibilidade - usado para altura)
      riskWidth: 0, // Largura dinâmica baseada no texto
      riskHeight: 60, // Altura fixa retangular
      padding: 16, // Padding interno do card
      keys: {} as Record<string, boolean>,
      gameActive: true,
      isPaused: false,
      combo: 0,
      lastFeedback: null as any,
      currentRisk: null as any,
      columnWidth: 0,
      columnGap: 16,
      canvasHeight: 0,
      spawnY: 30, // Zona de spawn maior (de 60 para 120px)
      baseY: 0,
      categoryHeights: [0, 0, 0, 0, 0] as number[],
      waitingForNextRisk: false, // Controle de spawn
    });

    // Expose pause/resume methods
    useImperativeHandle(ref, () => ({
      pause: () => {
        gameStateRef.current.isPaused = true;
      },
      resume: () => {
        gameStateRef.current.isPaused = false;
      },
      isPaused: () => gameStateRef.current.isPaused,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Configurar canvas responsivo
      const updateCanvasSize = () => {
        const maxWidth = Math.min(window.innerWidth - 40, 1200);
        const maxHeight = 600; // Altura fixa para área de jogo
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        const gameState = gameStateRef.current;
        gameState.canvasHeight = maxHeight;
        gameState.columnWidth = Math.floor(
          (maxWidth - gameState.columnGap * 6) / 5
        );
        gameState.baseY = maxHeight - 70; // 70px para as caixas de categoria (ainda mais reduzido)
      };

      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);

      // Funções auxiliares (DENTRO do useEffect para evitar recriação)
      const generateNewRisk = () => {
        const gameState = gameStateRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Gerar risco de qualquer categoria
        const riskCategory = Math.floor(Math.random() * 5) + 1;
        const riskData = RISKS[riskCategory as keyof typeof RISKS];
        const riskIndex = Math.floor(Math.random() * riskData.risks.length);
        const riskInfo = riskData.risks[riskIndex];

        gameState.currentRisk = {
          category: riskCategory,
          name: riskInfo.name,
          icon: riskInfo.icon,
          color: riskData.color,
          categoryIcon: riskData.icon,
        };

        // Calcular largura baseada no texto
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.font = "bold 18px Arial";
          const textWidth = ctx.measureText(riskInfo.name).width;
          gameState.riskWidth = textWidth + gameState.padding * 2;

          // Largura mínima e máxima
          gameState.riskWidth = Math.max(
            100,
            Math.min(250, gameState.riskWidth)
          );
        }

        // SPAWN ALEATÓRIO em X (dentro dos limites do canvas)
        const maxX = canvas.width - gameState.riskWidth;
        gameState.riskX = Math.random() * maxX;
        gameState.riskY = gameState.spawnY;
      };

      const showFeedback = (risk: any, type: "correct" | "error") => {
        const gameState = gameStateRef.current;
        let text = "";

        if (type === "correct") {
          const categoryName = RISKS[risk.category as keyof typeof RISKS].name;
          text = `✅ CORRETO! ${risk.name}`;
          if (gameState.combo >= 3) {
            text = `🔥 COMBO x${gameState.combo}! ${risk.name}`;
          }
        } else {
          text = `❌ ERROU! Tente outra!`;
        }

        gameState.lastFeedback = { text, type, timestamp: Date.now() };
        setFeedback({ text, type, timestamp: Date.now() });
      };

      const playSound = (type: "correct" | "error") => {
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          if (type === "correct") {
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.2
            );
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
          } else {
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.15
            );
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
          }
        } catch (e) {
          // Falhar silenciosamente
        }
      };

      // Gerar primeiro risco
      generateNewRisk();

      // Event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        const gameState = gameStateRef.current;
        gameState.keys[e.key] = true;

        // Pausar com ESPAÇO
        if (e.key === " " || e.key === "Escape") {
          e.preventDefault();
          gameState.isPaused = !gameState.isPaused;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key] = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Game loop
      let frameCount = 0;
      const gameLoop = setInterval(() => {
        const gameState = gameStateRef.current;

        if (!gameState.gameActive || gameState.isPaused) {
          if (!gameState.gameActive) {
            clearInterval(gameLoop);
          }
          return;
        }

        frameCount++;

        // MOVIMENTO HORIZONTAL LIVRE (não preso em colunas)
        const moveSpeed = 5;
        if (gameState.keys["ArrowLeft"] || gameState.keys["a"]) {
          gameState.riskX = Math.max(0, gameState.riskX - moveSpeed);
        }
        if (gameState.keys["ArrowRight"] || gameState.keys["d"]) {
          gameState.riskX = Math.min(
            canvas!.width - gameState.riskWidth,
            gameState.riskX + moveSpeed
          );
        }

        // Velocidade de queda
        let currentSpeed = gameState.riskSpeed;
        if (gameState.keys["ArrowDown"]) {
          currentSpeed = gameState.riskSpeed * 5; // 5x mais rápido ao pressionar ↓
        }

        // Atualizar posição Y (queda)
        gameState.riskY += currentSpeed;

        // Verificar colisão com base (detectar qual coluna o risco está sobre)
        if (
          gameState.riskY + gameState.riskHeight >= gameState.baseY &&
          !gameState.waitingForNextRisk
        ) {
          gameState.waitingForNextRisk = true; // BLOQUEIA SPAWN ATÉ CONTABILIZAR

          // Calcular qual coluna o risco está centralizado sobre
          const riskCenterX = gameState.riskX + gameState.riskWidth / 2;
          let droppedColumn = -1;

          for (let i = 0; i < 5; i++) {
            const colX = 20 + i * (gameState.columnWidth + gameState.columnGap);
            const colCenterX = colX + gameState.columnWidth / 2;
            const tolerance = gameState.columnWidth / 2;

            if (Math.abs(riskCenterX - colCenterX) <= tolerance) {
              droppedColumn = i + 1; // 1-5
              break;
            }
          }

          if (droppedColumn > 0) {
            const isCorrect = gameState.currentRisk.category === droppedColumn;

            if (isCorrect) {
              // ACERTO!
              gameState.score += 10;
              gameState.correctCount++;
              gameState.combo++;

              // Bônus de combo
              if (gameState.combo >= 2) {
                gameState.score += 5;
              }
              if (gameState.combo >= 3) {
                gameState.score += 10;
              }

              playSound("correct");
              showFeedback(gameState.currentRisk, "correct");

              // Incrementar contador da categoria
              if (gameState.categoryHeights[droppedColumn - 1] < 2) {
                gameState.categoryHeights[droppedColumn - 1]++;
              }
            } else {
              // ERRO!
              gameState.errorCount++;
              gameState.score = Math.max(0, gameState.score - 5);
              gameState.combo = 0;
              playSound("error");
              showFeedback(gameState.currentRisk, "error");
              setErrorCount(gameState.errorCount);
              onErrorCountChange?.(gameState.errorCount);
            }
          } else {
            // Caiu fora de qualquer coluna
            gameState.errorCount++;
            gameState.score = Math.max(0, gameState.score - 5);
            gameState.combo = 0;
            playSound("error");
            showFeedback(gameState.currentRisk, "error");
            setErrorCount(gameState.errorCount);
            onErrorCountChange?.(gameState.errorCount);
          }

          gameState.risksCompleted++;

          if (gameState.risksCompleted >= gameState.maxRisks) {
            gameState.gameActive = false;
            onPhaseComplete(gameState.score);
          } else {
            // Esperar 800ms antes de spawnar novo risco
            setTimeout(() => {
              generateNewRisk();
              gameState.waitingForNextRisk = false;
            }, 800);
          }
        }

        // Atualizar estado a cada 10 frames
        if (frameCount % 10 === 0) {
          setScore(gameState.score);
          setCorrectCount(gameState.correctCount);
          setRisksCount(gameState.risksCompleted);
          onScoreChange(gameState.score);
          onComboChange?.(gameState.combo);
          onCorrectCountChange?.(gameState.correctCount);
        }

        // Limpar feedback após 1.5 segundos
        if (
          gameState.lastFeedback &&
          Date.now() - gameState.lastFeedback.timestamp > 1500
        ) {
          gameState.lastFeedback = null;
          setFeedback(null);
        }

        // Renderizar
        render(ctx, canvas!, gameState, phase);
      }, 1000 / 60); // 60 FPS

      return () => {
        clearInterval(gameLoop);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("resize", updateCanvasSize);
      };
    }, [
      phase,
      onGameOver,
      onPhaseComplete,
      onScoreChange,
      onComboChange,
      onCorrectCountChange,
    ]); // Agora as callbacks são estáveis

    const render = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      gameState: any,
      difficulty: number
    ) => {
      // Fundo do jogo
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e293b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar colunas de fundo com gradiente sutil
      const categoryColors = [
        "#22c55e",
        "#ef4444",
        "#92400e",
        "#eab308",
        "#3b82f6",
      ];
      const categoryNames = [
        "FÍSICO",
        "QUÍMICO",
        "BIOLÓGICO",
        "ERGONÔMICO",
        "ACIDENTE",
      ];
      const categoryIcons = ["⚡", "☢️", "🦠", "🪑", "⚠️"];

      for (let i = 0; i < 5; i++) {
        const x =
          gameState.columnGap +
          i * (gameState.columnWidth + gameState.columnGap);
        const color = categoryColors[i];

        // Coluna de fundo (gradiente vertical sutil)
        const colGradient = ctx.createLinearGradient(x, 0, x, gameState.baseY);
        colGradient.addColorStop(0, "rgba(100, 150, 200, 0.02)");
        colGradient.addColorStop(1, color + "20");
        ctx.fillStyle = colGradient;
        ctx.fillRect(
          x,
          gameState.spawnY,
          gameState.columnWidth,
          gameState.baseY - gameState.spawnY
        );

        // Highlight da coluna se risco está sobre ela (detector por proximidade)
        if (gameState.riskY < gameState.baseY) {
          const riskCenterX = gameState.riskX + gameState.riskWidth / 2;
          const colCenterX = x + gameState.columnWidth / 2;
          const tolerance = gameState.columnWidth / 2;

          if (Math.abs(riskCenterX - colCenterX) <= tolerance) {
            ctx.fillStyle = color + "15";
            ctx.fillRect(
              x,
              gameState.spawnY,
              gameState.columnWidth,
              gameState.baseY - gameState.spawnY
            );

            // Borda brilhante
            ctx.strokeStyle = color + "80";
            ctx.lineWidth = 3;
            ctx.strokeRect(
              x,
              gameState.spawnY,
              gameState.columnWidth,
              gameState.baseY - gameState.spawnY
            );
          }
        }

        // Linhas guia verticais pontilhadas
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(x + gameState.columnWidth / 2, gameState.spawnY);
        ctx.lineTo(x + gameState.columnWidth / 2, gameState.baseY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Caixa de categoria na base (retangular, menos alta)
        const boxY = gameState.baseY;
        const boxHeight = 70;

        // Sombra da caixa
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(x + 3, boxY + 3, gameState.columnWidth, boxHeight);

        // Gradiente da caixa
        const boxGradient = ctx.createLinearGradient(
          x,
          boxY,
          x,
          boxY + boxHeight
        );
        boxGradient.addColorStop(0, color + "B0");
        boxGradient.addColorStop(1, color);
        ctx.fillStyle = boxGradient;
        ctx.fillRect(x, boxY, gameState.columnWidth, boxHeight);

        // Borda da caixa
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, boxY, gameState.columnWidth, boxHeight);

        // Inner glow no topo
        const innerGlow = ctx.createLinearGradient(x, boxY, x, boxY + 30);
        innerGlow.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        innerGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = innerGlow;
        ctx.fillRect(x, boxY, gameState.columnWidth, 30);

        // Nome da categoria (centralizado)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeText(
          categoryNames[i],
          x + gameState.columnWidth / 2,
          boxY + 35
        );
        ctx.fillText(
          categoryNames[i],
          x + gameState.columnWidth / 2,
          boxY + 35
        );

        // Contador (menor, embaixo) - removido para economizar espaço
      }

      // Desenhar risco caindo (POSIÇÃO LIVRE - não preso em coluna)
      if (gameState.currentRisk && !gameState.waitingForNextRisk) {
        const riskWidth = gameState.riskWidth;
        const riskHeight = gameState.riskHeight;
        const riskX = gameState.riskX;
        const riskY = gameState.riskY;

        // Sombra do risco (dinâmica com velocidade)
        const shadowOffset = gameState.keys["ArrowDown"] ? 8 : 4;
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(
          riskX + shadowOffset,
          riskY + shadowOffset,
          riskWidth,
          riskHeight
        );

        if (difficulty === 1) {
          // FÁCIL: Fundo com cor da categoria + texto
          ctx.fillStyle = gameState.currentRisk.color;
          ctx.fillRect(riskX, riskY, riskWidth, riskHeight);

          // Borda
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.strokeRect(riskX, riskY, riskWidth, riskHeight);

          // Texto (sem emoji)
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "rgb(30, 30, 60)";
          ctx.lineWidth = 3;
          const text = gameState.currentRisk.name;
          ctx.strokeText(text, riskX + riskWidth / 2, riskY + riskHeight / 2);
          ctx.fillText(text, riskX + riskWidth / 2, riskY + riskHeight / 2);
        } else if (difficulty === 2) {
          // MÉDIO: Fundo neutro + texto apenas
          ctx.fillStyle = "#374151";
          ctx.fillRect(riskX, riskY, riskWidth, riskHeight);

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.strokeRect(riskX, riskY, riskWidth, riskHeight);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.strokeText(
            gameState.currentRisk.name,
            riskX + riskWidth / 2,
            riskY + riskHeight / 2
          );
          ctx.fillText(
            gameState.currentRisk.name,
            riskX + riskWidth / 2,
            riskY + riskHeight / 2
          );
        } else if (difficulty === 3) {
          // DIFÍCIL: Apenas primeira letra grande
          ctx.fillStyle = "#374151";
          ctx.fillRect(riskX, riskY, riskWidth, riskHeight);

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.strokeRect(riskX, riskY, riskWidth, riskHeight);

          // Primeira letra do nome do risco
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 36px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "rgb(30, 30, 60)";
          ctx.lineWidth = 3;
          const firstLetter = gameState.currentRisk.name
            .charAt(0)
            .toUpperCase();
          ctx.strokeText(
            firstLetter,
            riskX + riskWidth / 2,
            riskY + riskHeight / 2
          );
          ctx.fillText(
            firstLetter,
            riskX + riskWidth / 2,
            riskY + riskHeight / 2
          );
        }

        // Indicador de velocidade (quando acelera)
        if (gameState.keys["ArrowDown"]) {
          ctx.fillStyle = "rgba(255, 100, 100, 0.3)";
          ctx.fillRect(riskX - 2, riskY - 2, riskWidth + 4, riskHeight + 4);
        }
      }

      // Zona de spawn (topo) com borda pontilhada
      ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.strokeRect(10, 10, canvas.width - 20, gameState.spawnY - 20);
      ctx.setLineDash([]);

      // Setas indicando para baixo (centro)
      ctx.font = "24px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.textAlign = "center";
      const centerX = canvas.width / 2;
      ctx.fillText("↓", centerX - 30, gameState.spawnY - 10);
      ctx.fillText("↓", centerX, gameState.spawnY - 10);
      ctx.fillText("↓", centerX + 30, gameState.spawnY - 10);

      // Feedback visual
      if (gameState.lastFeedback) {
        const alpha = Math.max(
          0,
          1 - (Date.now() - gameState.lastFeedback.timestamp) / 1500
        );
        ctx.globalAlpha = alpha;
        ctx.fillStyle =
          gameState.lastFeedback.type === "correct" ? "#22c55e" : "#ef4444";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeText(
          gameState.lastFeedback.text,
          canvas.width / 2,
          canvas.height / 2 - 150
        );
        ctx.fillText(
          gameState.lastFeedback.text,
          canvas.width / 2,
          canvas.height / 2 - 150
        );
        ctx.globalAlpha = 1;
      }

      // Indicador de pausa
      if (gameState.isPaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⏸️ PAUSADO", canvas.width / 2, canvas.height / 2);

        ctx.font = "24px Arial";
        ctx.fillText(
          "Pressione ESPAÇO para continuar",
          canvas.width / 2,
          canvas.height / 2 + 60
        );
      }
    };

    return (
      <div className="w-full flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          className="border-4 border-cyan-400 rounded-2xl bg-slate-900 shadow-2xl w-full"
        />
        <div className="text-white text-center text-sm font-game-title">
          <p>
            Use ← → para MOVER entre colunas | ↓ para ACELERAR queda | ESPAÇO
            para PAUSAR
          </p>
        </div>
      </div>
    );
  }
);

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
