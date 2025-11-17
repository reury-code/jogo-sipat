import { forwardRef, useEffect, useRef, useState } from "react";

interface GameCanvasProps {
  phase: number;
  onGameOver: (score: number) => void;
  onPhaseComplete: (score: number) => void;
  onScoreChange: (score: number) => void;
}

const RISKS = {
  1: {
    name: "Físico",
    color: "#22c55e",
    risks: ["Ruído", "Calor", "Frio", "Vibrações", "Pressões", "Umidade"],
  },
  2: {
    name: "Químico",
    color: "#ef4444",
    risks: ["Poeiras", "Gases", "Vapores", "Névoas", "Fumos", "Neblinas"],
  },
  3: {
    name: "Biológico",
    color: "#92400e",
    risks: ["Vírus", "Bactérias", "Fungos", "Parasitas", "Protozoários", "Insetos"],
  },
  4: {
    name: "Ergonômico",
    color: "#eab308",
    risks: ["Postura Inadequada", "Repetitividade", "Levantamento de Peso", "Ritmo Excessivo", "Monotonia", "Turnos"],
  },
  5: {
    name: "Acidente",
    color: "#3b82f6",
    risks: ["Eletricidade", "Máquinas", "Quedas", "Incêndio", "Arranjo Físico", "Iluminação"],
  },
};

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ phase, onGameOver, onPhaseComplete, onScoreChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [risksCount, setRisksCount] = useState(0);
    const [feedback, setFeedback] = useState<{ text: string; type: "correct" | "error"; timestamp: number } | null>(null);
    const gameStateRef = useRef({
      score: 0,
      energy: 100,
      risksCompleted: 0,
      maxRisks: 10,
      riskX: 0,
      riskY: 0,
      riskSize: 80,
      keys: {} as Record<string, boolean>,
      gameActive: true,
      combo: 0,
      lastFeedback: null as any,
      currentRisk: null as any,
      imagesLoaded: false,
      images: {} as Record<string, HTMLImageElement>,
    });

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Configurar canvas responsivo
      const updateCanvasSize = () => {
        const maxWidth = Math.min(window.innerWidth - 40, 1200);
        const maxHeight = Math.min(window.innerHeight - 250, 700);
        canvas.width = maxWidth;
        canvas.height = maxHeight;
      };

      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);

      // Carregar imagens dos ícones
      const gameState = gameStateRef.current;
      const iconPaths = [
        "/icons/risk-physical.png",
        "/icons/risk-chemical.png",
        "/icons/risk-biological.png",
        "/icons/risk-ergonomic.png",
        "/icons/risk-accident.png",
      ];

      let loadedCount = 0;
      iconPaths.forEach((path) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === iconPaths.length) {
            gameState.imagesLoaded = true;
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === iconPaths.length) {
            gameState.imagesLoaded = true;
          }
        };
        img.src = path;
        gameState.images[path] = img;
      });

      // Gerar primeiro risco
      generateNewRisk();

      // Event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        gameState.keys[e.key] = true;
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        gameState.keys[e.key] = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Game loop
      let frameCount = 0;
      const gameLoop = setInterval(() => {
        if (!gameState.gameActive) {
          clearInterval(gameLoop);
          return;
        }

        frameCount++;

        // Atualizar posição do risco (jogador move o risco que cai)
        const speed = 6;
        if (gameState.keys["ArrowLeft"] || gameState.keys["a"]) {
          gameState.riskX = Math.max(0, gameState.riskX - speed);
        }
        if (gameState.keys["ArrowRight"] || gameState.keys["d"]) {
          gameState.riskX = Math.min(canvas!.width - gameState.riskSize, gameState.riskX + speed);
        }

        // Atualizar posição vertical do risco (MUITO MAIS LENTA)
        let riskSpeed = 0.8; // Velocidade base muito reduzida
        if (gameState.keys["ArrowDown"]) {
          riskSpeed = 2.5; // Aceleração com DOWN
        }
        gameState.riskY += riskSpeed;

        // Verificar colisão com as caixas fixas na base
        const boxHeight = 80;
        const boxY = canvas!.height - boxHeight - 10;
        const boxWidth = Math.floor((canvas!.width - 50) / 5);
        const boxGap = 10;

        // Calcular qual caixa o risco está sobre
        let collidedBox = -1;
        for (let i = 0; i < 5; i++) {
          const boxX = 20 + i * (boxWidth + boxGap);
          if (
            gameState.riskX + gameState.riskSize > boxX &&
            gameState.riskX < boxX + boxWidth &&
            gameState.riskY + gameState.riskSize > boxY
          ) {
            collidedBox = i + 1;
            break;
          }
        }

        // Se colidiu com uma caixa
        if (collidedBox > 0 && gameState.riskY + gameState.riskSize > boxY) {
          const isCorrect = gameState.currentRisk.category === collidedBox;
          if (isCorrect) {
            gameState.score += 100;
            gameState.combo++;
            if (gameState.combo >= 3) {
              gameState.score += 300;
              gameState.combo = 0;
            }
            gameState.energy = Math.min(100, gameState.energy + 10);
            playSound("correct");
            showFeedback(gameState.currentRisk, "correct");
          } else {
            gameState.score = Math.max(0, gameState.score - 50);
            gameState.combo = 0;
            gameState.energy = Math.max(0, gameState.energy - 20);
            playSound("error");
            showFeedback(gameState.currentRisk, "error");
          }
          gameState.risksCompleted++;

          if (gameState.risksCompleted >= gameState.maxRisks) {
            gameState.gameActive = false;
            onPhaseComplete(gameState.score);
          } else {
            generateNewRisk();
          }
        }

        // Verificar se risco saiu da tela
        if (gameState.riskY > canvas!.height) {
          gameState.score = Math.max(0, gameState.score - 50);
          gameState.combo = 0;
          gameState.energy = Math.max(0, gameState.energy - 15);
          gameState.risksCompleted++;

          if (gameState.risksCompleted >= gameState.maxRisks) {
            gameState.gameActive = false;
            onPhaseComplete(gameState.score);
          } else {
            generateNewRisk();
          }
        }

        // Verificar game over
        if (gameState.energy <= 0) {
          gameState.gameActive = false;
          onGameOver(gameState.score);
        }

        // Atualizar estado a cada 10 frames
        if (frameCount % 10 === 0) {
          setScore(gameState.score);
          setEnergy(gameState.energy);
          setRisksCount(gameState.risksCompleted);
          onScoreChange(gameState.score);
        }

        // Limpar feedback após 2 segundos
        if (gameState.lastFeedback && Date.now() - gameState.lastFeedback.timestamp > 2000) {
          gameState.lastFeedback = null;
          setFeedback(null);
        }

        // Renderizar
        render(ctx, canvas, gameState, boxWidth, boxGap, boxY, boxHeight, phase);
      }, 1000 / 60); // 60 FPS

      return () => {
        clearInterval(gameLoop);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("resize", updateCanvasSize);
      };
    }, [phase, onGameOver, onPhaseComplete, onScoreChange]);

    const generateNewRisk = () => {
      const gameState = gameStateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Gerar risco de qualquer categoria
      const riskCategory = Math.floor(Math.random() * 5) + 1;
      const riskData = RISKS[riskCategory as keyof typeof RISKS];
      const riskIndex = Math.floor(Math.random() * riskData.risks.length);

      gameState.currentRisk = {
        category: riskCategory,
        name: riskData.risks[riskIndex],
        color: riskData.color,
        iconPath: `/icons/risk-${["physical", "chemical", "biological", "ergonomic", "accident"][riskCategory - 1]}.png`,
      };
      gameState.riskX = Math.random() * (canvas.width - gameState.riskSize);
      gameState.riskY = -gameState.riskSize - 20;
    };

    const showFeedback = (risk: any, type: "correct" | "error") => {
      const gameState = gameStateRef.current;
      let text = "";

      if (type === "correct") {
        text = `ACERTO! ${risk.name} é ${RISKS[risk.category as keyof typeof RISKS].name}!`;
      } else {
        text = `ERRO! ${risk.name} é ${RISKS[risk.category as keyof typeof RISKS].name}!`;
      }

      gameState.lastFeedback = { text, type, timestamp: Date.now() };
      setFeedback({ text, type, timestamp: Date.now() });
    };

    const playSound = (type: "correct" | "error") => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === "correct") {
          oscillator.frequency.value = 800;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        } else {
          oscillator.frequency.value = 300;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        }
      } catch (e) {
        // Falhar silenciosamente
      }
    };

    const measureText = (ctx: CanvasRenderingContext2D, text: string, fontSize: number): number => {
      ctx.font = `bold ${fontSize}px Arial`;
      return ctx.measureText(text).width;
    };

    const render = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      gameState: any,
      boxWidth: number,
      boxGap: number,
      boxY: number,
      boxHeight: number,
      difficulty: number
    ) => {
      // Fundo do jogo (estilo arcade)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e293b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grade de fundo (estilo arcade)
      ctx.strokeStyle = "rgba(100, 150, 200, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Desenhar as 5 caixas fixas na base
      const categoryColors = ["#22c55e", "#ef4444", "#92400e", "#eab308", "#3b82f6"];
      const categoryNames = ["FÍSICO", "QUÍMICO", "BIOLÓGICO", "ERGONÔMICO", "ACIDENTE"];

      for (let i = 0; i < 5; i++) {
        const boxX = 20 + i * (boxWidth + boxGap);
        const color = categoryColors[i];

        // Sombra da caixa
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(boxX + 2, boxY + 2, boxWidth, boxHeight);

        // Caixa principal
        ctx.fillStyle = color;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Borda da caixa
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Texto da categoria
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(categoryNames[i], boxX + boxWidth / 2, boxY + boxHeight / 2);
      }

      // Desenhar risco caindo
      if (gameState.currentRisk) {
        const riskColor = categoryColors[gameState.currentRisk.category - 1];
        const fontSize = 24;
        const padding = 12;

        if (difficulty === 1) {
          // FÁCIL: Fundo retangular com cor da caixa + texto
          const textWidth = measureText(ctx, gameState.currentRisk.name, fontSize);
          const rectWidth = textWidth + padding * 2;
          const rectHeight = fontSize + padding * 2;
          const rectX = gameState.riskX + (gameState.riskSize - rectWidth) / 2;
          const rectY = gameState.riskY + (gameState.riskSize - rectHeight) / 2;

          // Sombra do retângulo
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.fillRect(rectX + 2, rectY + 2, rectWidth, rectHeight);

          // Fundo retangular com cor da caixa
          ctx.fillStyle = riskColor;
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

          // Borda
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

          // Texto
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(gameState.currentRisk.name, rectX + rectWidth / 2, rectY + rectHeight / 2);
        } else if (difficulty === 2) {
          // MÉDIO: Fundo retangular NEUTRO (cinza escuro) + texto branco
          const textWidth = measureText(ctx, gameState.currentRisk.name, fontSize);
          const rectWidth = textWidth + padding * 2;
          const rectHeight = fontSize + padding * 2;
          const rectX = gameState.riskX + (gameState.riskSize - rectWidth) / 2;
          const rectY = gameState.riskY + (gameState.riskSize - rectHeight) / 2;

          // Sombra do retângulo
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.fillRect(rectX + 2, rectY + 2, rectWidth, rectHeight);

          // Fundo retangular NEUTRO (cinza escuro)
          ctx.fillStyle = "#374151";
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

          // Borda
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

          // Texto branco
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(gameState.currentRisk.name, rectX + rectWidth / 2, rectY + rectHeight / 2);
        } else if (difficulty === 3) {
          // DIFÍCIL: Apenas ícone/imagem (MAIOR)
          const iconSize = gameState.riskSize * 0.9; // 90% do tamanho do risco
          const iconX = gameState.riskX + (gameState.riskSize - iconSize) / 2;
          const iconY = gameState.riskY + (gameState.riskSize - iconSize) / 2;

          // Fundo neutro para melhor visualização
          ctx.fillStyle = "#374151";
          ctx.fillRect(gameState.riskX, gameState.riskY, gameState.riskSize, gameState.riskSize);

          // Borda
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(gameState.riskX, gameState.riskY, gameState.riskSize, gameState.riskSize);

          if (gameState.imagesLoaded && gameState.images[gameState.currentRisk.iconPath]) {
            try {
              ctx.drawImage(gameState.images[gameState.currentRisk.iconPath], iconX, iconY, iconSize, iconSize);
            } catch (e) {
              // Fallback: desenhar abreviação
              ctx.fillStyle = "#ffffff";
              ctx.font = `bold 36px Arial`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("?", gameState.riskX + gameState.riskSize / 2, gameState.riskY + gameState.riskSize / 2);
            }
          }
        }
      }

      // Desenhar UI (pontuação, energia, etc.)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`PONTUAÇÃO: ${gameState.score}`, 20, 30);
      ctx.fillText(`RISCOS: ${gameState.risksCompleted}/${gameState.maxRisks}`, 20, 60);

      // Desenhar nível de dificuldade
      const difficultyNames = ["", "FÁCIL", "MÉDIO", "DIFÍCIL"];
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 14px Arial";
      ctx.fillText(`NÍVEL: ${difficultyNames[difficulty]}`, 20, 85);

      // Desenhar barra de energia
      const barWidth = 200;
      const barHeight = 20;
      ctx.fillStyle = gameState.energy > 30 ? "#22c55e" : gameState.energy > 10 ? "#eab308" : "#ef4444";
      ctx.fillRect(20, 105, barWidth * (gameState.energy / 100), barHeight);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 105, barWidth, barHeight);
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(gameState.energy)}%`, 20 + barWidth / 2, 120);

      // Desenhar feedback
      if (gameState.lastFeedback) {
        const alpha = Math.max(0, 1 - (Date.now() - gameState.lastFeedback.timestamp) / 2000);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gameState.lastFeedback.type === "correct" ? "#22c55e" : "#ef4444";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(gameState.lastFeedback.text, canvas.width / 2, canvas.height / 2 - 100);
        ctx.globalAlpha = 1;
      }

      // Desenhar instruções
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText("← → Mover Risco | ↓ Acelerar Queda", 20, canvas.height - 10);
    };

    return (
      <div className="w-full flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-lg bg-slate-900 shadow-2xl w-full"
          style={{ maxWidth: "1200px", height: "auto" }}
        />
        <div className="text-white text-center text-sm">
          <p>Mova o risco para a caixa correta antes que ele caia!</p>
        </div>
      </div>
    );
  }
);

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
