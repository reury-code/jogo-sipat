import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import {
  SCORING,
  getComboMultiplier,
  RiskAttempt,
  PhaseScore,
  calculatePhaseScore,
} from "@/types/scoring";
import { useSettings } from "@/contexts/SettingsContext";

interface GameCanvasProps {
  phase: number;
  onGameOver: (score: number) => void;
  onPhaseComplete: (phaseScore: PhaseScore) => void;
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
      {
        name: "Ruído",
        icon: "🔊",
        image: "/icons/risks/fisico/ruido.jpg",
        hint: "Barulho alto que machuca os ouvidos! Pense: CONSTRUÇÃO, FÁBRICA, BRITADEIRA",
      },
      {
        name: "Vibrações",
        icon: "📳",
        image: "/icons/risks/fisico/vibracoes.jpg",
        hint: "Máquinas que TREMEM muito! Pense: BRITADEIRA, MOTOSSERRA, LIXADEIRA",
      },
      {
        name: "Radiações ionizantes",
        icon: "☢️",
        image: "/icons/risks/fisico/radiacoes.jpg",
        hint: "Raios perigosos invisíveis! Pense: RAIO-X, USINA NUCLEAR, HOSPITAL",
      },
      {
        name: "Radiações não ionizantes",
        icon: "📡",
        hint: "Ondas e raios mais fracos! Pense: MICRO-ONDAS, SOLDA, LUZ ULTRAVIOLETA",
      },
      {
        name: "Frio",
        icon: "❄️",
        image: "/icons/risks/fisico/frio.jpg",
        hint: "Muito gelado que pode congelar! Pense: FRIGORÍFICO, CÂMARA FRIA",
      },
      {
        name: "Calor",
        icon: "🔥",
        hint: "Muito quente que pode queimar! Pense: FORNO, FUNDIÇÃO, PADARIA",
      },
      {
        name: "Pressões anormais",
        icon: "💨",
        hint: "Ar muito comprimido ou vácuo! Pense: MERGULHO, TÚNEL SUBTERRÂNEO",
      },
      {
        name: "Umidade",
        icon: "💧",
        hint: "Lugar muito molhado ou úmido! Pense: LAVANDERIA, LIMPEZA, MOFO",
      },
      {
        name: "Temperaturas extremas",
        icon: "🌡️",
        image: "/icons/risks/fisico/temperaturas-extremas.jpg",
        hint: "MUITO quente ou MUITO frio! Pense: extremos de temperatura",
      },
    ],
    gameTip: "🎮 DICA: Se BATE, CORTA, QUEIMA ou faz BARULHO = VERDE!",
  },
  2: {
    name: "Químico",
    color: "#ef4444",
    icon: "☢️",
    risks: [
      {
        name: "Poeiras",
        icon: "💨",
        image: "/icons/risks/quimico/poeiras.png",
        hint: "Pó no ar que você respira! Pense: SERRAGEM, CIMENTO, FARINHA",
      },
      {
        name: "Fumos metálicos",
        icon: "🏭",
        image: "/icons/risks/quimico/fumos-metalicos.png",
        hint: "Fumacinha de metal derretido! Pense: SOLDA, FUNDIÇÃO",
      },
      {
        name: "Névoas",
        icon: "🌁",
        image: "/icons/risks/quimico/nevoas.png",
        hint: "Gotinhas no ar como spray! Pense: PINTURA A SPRAY, AGROTÓXICO",
      },
      {
        name: "Neblinas",
        icon: "🌫️",
        image: "/icons/risks/quimico/neblinas.png",
        hint: "Nuvenzinha de líquido no ar! Pense: SPRAY, NÉVOA QUÍMICA",
      },
      {
        name: "Gases",
        icon: "☁️",
        image: "/icons/risks/quimico/gases.png",
        hint: "Ar invisível e perigoso! Pense: GÁS DE COZINHA, CLORO, AMÔNIA",
      },
      {
        name: "Vapores",
        icon: "💭",
        image: "/icons/risks/quimico/vapores.png",
        hint: "Fumacinha que evapora! Pense: GASOLINA, ÁLCOOL, TINNER, COLA",
      },
    ],
    gameTip:
      "🎮 DICA: Se tem CHEIRO FORTE, FUMAÇA ou é PRODUTO QUÍMICO = VERMELHO!",
  },
  3: {
    name: "Biológico",
    color: "#92400e",
    icon: "🦠",
    risks: [
      {
        name: "Vírus",
        icon: "🦠",
        image: "/icons/risks/biologico/virus.png",
        hint: "Bichinhos invisíveis que causam doenças! Pense: GRIPE, COVID, DENGUE",
      },
      {
        name: "Bactérias",
        icon: "🧫",
        image: "/icons/risks/biologico/bacterias.png",
        hint: "Micróbios que causam infecção! Pense: HOSPITAL, LIXO, ESGOTO",
      },
      {
        name: "Protozoários",
        icon: "🔬",
        image: "/icons/risks/biologico/protozoarios.png",
        hint: "Seres microscópicos de água suja! Pense: MALÁRIA, AMEBA",
      },
      {
        name: "Fungos",
        icon: "🍄",
        image: "/icons/risks/biologico/fungos.png",
        hint: "Mofo e bolor que cresce! Pense: PAREDE ÚMIDA, MADEIRA VELHA",
      },
      {
        name: "Parasitas",
        icon: "🪱",
        image: "/icons/risks/biologico/parasitas.png",
        hint: "Vermes que vivem em outros! Pense: LOMBRIGA, SOLITÁRIA",
      },
      {
        name: "Bacilos",
        icon: "🧬",
        hint: "Bactérias em forma de bastão! Pense: TUBERCULOSE, TÉTANO",
      },
      {
        name: "Animais peçonhentos",
        icon: "🐍",
        image: "/icons/risks/biologico/animais-peconhentos.png",
        hint: "Bichos com veneno perigoso! Pense: COBRA, ARANHA, ESCORPIÃO",
      },
    ],
    gameTip: "🎮 DICA: Se é VIVO e pode te deixar DOENTE = MARROM!",
  },
  4: {
    name: "Ergonômico",
    color: "#eab308",
    icon: "🪑",
    risks: [
      {
        name: "Esforço intenso",
        icon: "💪",
        hint: "Trabalho pesado que cansa muito! Pense: CARREGADOR, MUDANÇA",
      },
      {
        name: "Levantamento de peso",
        icon: "🏋️",
        image: "/icons/risks/ergonomico/levantamento-transporte-peso.png",
        hint: "Pegar peso demais nas costas! Pense: CARREGAR CAIXAS PESADAS",
      },
      {
        name: "Postura inadequada",
        icon: "🧍",
        image: "/icons/risks/ergonomico/postura-inadequada.png",
        hint: "Ficar torto ou curvado! Pense: COMPUTADOR MAL POSICIONADO, AGACHADO",
      },
      {
        name: "Pressão de produtividade",
        icon: "📊",
        hint: "Pressão demais por resultado! Pense: METAS IMPOSSÍVEIS, COBRANÇA",
      },
      {
        name: "Ritmos excessivos",
        icon: "⚡",
        hint: "Ter que trabalhar rápido demais! Pense: LINHA DE PRODUÇÃO VELOZ",
      },
      {
        name: "Varios turnos",
        icon: "🌙",
        image: "/icons/risks/ergonomico/trabalho-turno-noturno.png",
        hint: "Trabalhar de madrugada! Pense: VIGIA NOTURNO, PLANTÃO",
      },
      {
        name: "Trabalho prolongado",
        icon: "⏰",
        image: "/icons/risks/ergonomico/jornada-prolongada.png",
        hint: "Trabalhar horas demais seguidas! Pense: HORA EXTRA EXCESSIVA",
      },
      {
        name: "Repetitividade",
        icon: "🔄",
        image: "/icons/risks/ergonomico/monotonia-repetitividade.png",
        hint: "Fazer a mesma coisa sempre! Pense: DIGITAÇÃO, LINHA DE MONTAGEM",
      },
    ],
    gameTip: "🎮 DICA: Se CANSA o corpo, dá DOR ou ESTRESSA = AMARELO!",
  },
  5: {
    name: "Acidente",
    color: "#3b82f6",
    icon: "⚠️",
    risks: [
      {
        name: "Arranjo inadequado",
        icon: "📦",
        image: "/icons/risks/acidente/arranjo-fisico-inadequado.png",
        hint: "Local bagunçado e desorganizado! Pense: CORREDOR ENTUPIDO, TUDO FORA DO LUGAR",
      },
      {
        name: "Máquinas sem proteção",
        icon: "⚙️",
        image: "/icons/risks/acidente/maquinas-sem-protecao.png",
        hint: "Máquina perigosa sem grade! Pense: SERRA SEM PROTEÇÃO, ENGRENAGEM EXPOSTA",
      },
      {
        name: "Ferramentas defeituosas",
        icon: "🔧",
        hint: "Ferramenta quebrada ou errada! Pense: ALICATE COM CABO SOLTO, CHAVE TORTA",
      },
      {
        name: "Iluminação inadequada",
        icon: "💡",
        hint: "Muito escuro pra trabalhar! Pense: LÂMPADA QUEIMADA, POUCA LUZ",
      },
      {
        name: "Eletricidade",
        icon: "⚡",
        image: "/icons/risks/acidente/eletricidade.png",
        hint: "Risco de tomar choque! Pense: FIO DESENCAPADO, TOMADA QUEBRADA",
      },
      {
        name: "Incêndio ou explosão",
        icon: "🔥",
        image: "/icons/risks/acidente/incendio-explosao.png",
        hint: "Pode pegar fogo ou explodir! Pense: GASOLINA, GÁS, MATERIAL INFLAMÁVEL",
      },
      {
        name: "Armazenamento inadequado",
        icon: "📦",
        hint: "Guardar errado e perigoso! Pense: CAIXAS MAL EMPILHADAS, PRODUTOS MISTURADOS",
      },
      {
        name: "Picadas de insetos",
        icon: "🕷️",
        image: "/icons/risks/acidente/picadas-insetos.png",
        hint: "Bichos perigosos no trabalho! Pense: CAMPO, MATA, ÁREA RURAL",
      },
    ],
    gameTip: "🎮 DICA: Se pode causar ACIDENTE GRAVE agora = AZUL!",
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
    const { settings } = useSettings();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [risksCount, setRisksCount] = useState(0);
    const [hintsRemaining, setHintsRemaining] = useState(settings.hintsPerGame);
    const [showHint, setShowHint] = useState(false);
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
      maxRisks: settings.itemsPerPhase,
      attempts: [] as RiskAttempt[],
      phaseStartTime: Date.now(),
      currentRiskStartTime: Date.now(),
      riskX: 0, // Posição X livre (não preso em coluna)
      riskY: 0,
      riskSpeed: settings.normalFallSpeed, // Velocidade base configurável
      riskSize: 120, // Tamanho do card do risco (para compatibilidade - usado para altura)
      riskWidth: 0, // Largura dinâmica baseada no texto
      riskHeight: 60, // Altura padrão retangular (Fase 1 e 2)
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
      usedRisks: new Set<string>(), // Rastrear riscos já usados nesta fase
      imageCache: new Map<string, HTMLImageElement>(), // Cache de imagens carregadas
      currentHint: "", // Dica do risco atual
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

    // Resetar ajudas ao iniciar nova fase
    useEffect(() => {
      setHintsRemaining(settings.hintsPerGame);
      setShowHint(false);
    }, [phase, settings.hintsPerGame]);

    // Pré-carregar todas as imagens da fase atual
    useEffect(() => {
      const gameState = gameStateRef.current;

      // Buscar todas as imagens da fase
      const imagesToPreload: string[] = [];
      Object.values(RISKS).forEach((categoryData) => {
        categoryData.risks.forEach((risk) => {
          if (risk.image) {
            imagesToPreload.push(risk.image);
          }
        });
      });

      // Pré-carregar todas as imagens
      imagesToPreload.forEach((imagePath) => {
        if (!gameState.imageCache.has(imagePath)) {
          const img = new Image();
          img.src = imagePath;
          img.onload = () => {
            gameState.imageCache.set(imagePath, img);
          };
          // Adicionar ao cache imediatamente (mesmo que não carregada)
          // para evitar múltiplas requisições
          gameState.imageCache.set(imagePath, img);
        }
      });
    }, [phase]);

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

        // Criar pool de todos os riscos disponíveis
        const allRisks: Array<{
          category: number;
          name: string;
          icon: string;
          color: string;
          categoryIcon: string;
          key: string;
          image?: string; // Adicionar campo opcional image
          hint?: string; // Adicionar campo opcional hint
        }> = [];

        // Montar lista de todos os riscos
        Object.entries(RISKS).forEach(([categoryKey, categoryData]) => {
          const category = parseInt(categoryKey);
          categoryData.risks.forEach((risk) => {
            // Na Fase 3, incluir apenas riscos que têm imagem
            if (phase === 3 && !risk.image) {
              return; // Pular riscos sem imagem na Fase 3
            }

            const riskKey = `${category}-${risk.name}`;
            allRisks.push({
              category,
              name: risk.name,
              icon: risk.icon,
              color: categoryData.color,
              categoryIcon: categoryData.icon,
              key: riskKey,
              image: risk.image, // Incluir image se disponível
              hint: risk.hint, // Incluir hint se disponível
            });
          });
        });

        // Filtrar riscos que ainda não foram usados
        const availableRisks = allRisks.filter(
          (risk) => !gameState.usedRisks.has(risk.key)
        );

        // Se não houver mais riscos disponíveis, resetar o pool
        if (availableRisks.length === 0) {
          gameState.usedRisks.clear();
          availableRisks.push(...allRisks);
        }

        // Escolher um risco aleatório dos disponíveis
        const randomIndex = Math.floor(Math.random() * availableRisks.length);
        const selectedRisk = availableRisks[randomIndex];

        // Marcar como usado
        gameState.usedRisks.add(selectedRisk.key);

        gameState.currentRisk = {
          category: selectedRisk.category,
          name: selectedRisk.name,
          icon: selectedRisk.icon,
          color: selectedRisk.color,
          categoryIcon: selectedRisk.categoryIcon,
          image: selectedRisk.image, // Adicionar caminho da imagem se disponível
        };

        // Armazenar hint do risco atual
        gameState.currentHint = selectedRisk.hint || "";

        // Pré-carregar imagem se existir e ainda não estiver no cache
        if (
          selectedRisk.image &&
          !gameState.imageCache.has(selectedRisk.image)
        ) {
          const img = new Image();
          const imagePath = selectedRisk.image; // Armazenar em variável local
          img.src = imagePath;

          // Aguardar carregamento antes de spawnar (especialmente importante na Fase 3)
          img.onload = () => {
            gameState.imageCache.set(imagePath, img);
            // Calcular dimensões após imagem carregada
            finishRiskSetup();
          };
          img.onerror = () => {
            // Se erro ao carregar, spawnar sem imagem
            finishRiskSetup();
          };
        } else {
          // Sem imagem ou já carregada, spawnar imediatamente
          finishRiskSetup();
        }

        function finishRiskSetup() {
          if (!canvas) return;

          // Calcular largura e altura baseada no tipo de conteúdo
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Se for Fase 3 (difficulty 3) e tem imagem, usar tamanho maior
            if (phase === 3 && selectedRisk.image) {
              gameState.riskWidth = 180; // Largura maior para imagem
              gameState.riskHeight = 140; // Altura maior para imagem
            } else {
              // Fases 1 e 2: largura baseada no texto
              ctx.font = "bold 18px Arial";
              const textWidth = ctx.measureText(selectedRisk.name).width;
              gameState.riskWidth = textWidth + gameState.padding * 2;

              // Largura mínima e máxima
              gameState.riskWidth = Math.max(
                100,
                Math.min(250, gameState.riskWidth)
              );
              gameState.riskHeight = 60; // Altura padrão para texto
            }
          }

          // SPAWN ALEATÓRIO em X (dentro dos limites do canvas)
          const maxX = canvas.width - gameState.riskWidth;
          gameState.riskX = Math.random() * maxX;
          gameState.riskY = gameState.spawnY;
        }
      };

      const showFeedback = (
        risk: any,
        type: "correct" | "error",
        correctCategory?: number
      ) => {
        const gameState = gameStateRef.current;
        let text = "";

        if (type === "correct") {
          const categoryName = RISKS[risk.category as keyof typeof RISKS].name;
          text = `✅ CORRETO! ${risk.name}`;
          if (gameState.combo >= 3) {
            text = `🔥 COMBO x${gameState.combo}! ${risk.name}`;
          }
        } else {
          // Mostrar qual era a categoria correta
          if (correctCategory) {
            const correctCategoryName =
              RISKS[correctCategory as keyof typeof RISKS].name;
            const correctCategoryIcon =
              RISKS[correctCategory as keyof typeof RISKS].icon;
            text = `❌ ERROU! Era ${correctCategoryIcon} ${correctCategoryName}`;
          } else {
            text = `❌ ERROU! Tente outra!`;
          }
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
          currentSpeed = gameState.riskSpeed * settings.fastFallMultiplier; // Multiplicador configurável
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
              gameState.correctCount++;
              gameState.combo++;

              // Calcular pontos com multiplicador de combo
              const multiplier = getComboMultiplier(gameState.combo);
              const pointsEarned = Math.floor(
                SCORING.CORRECT_POINTS * multiplier
              );
              gameState.score += pointsEarned;

              // Registrar tentativa
              const timeSpent =
                (Date.now() - gameState.currentRiskStartTime) / 1000;
              gameState.attempts.push({
                correct: true,
                timeSpent,
                pointsEarned,
                comboMultiplier: multiplier,
              });

              playSound("correct");
              showFeedback(gameState.currentRisk, "correct");

              // Incrementar contador da categoria
              if (gameState.categoryHeights[droppedColumn - 1] < 2) {
                gameState.categoryHeights[droppedColumn - 1]++;
              }
            } else {
              // ERRO!
              gameState.errorCount++;
              gameState.combo = 0;

              // Penalidade por erro
              const pointsLost = SCORING.ERROR_PENALTY;
              const scoreBeforeError = gameState.score;
              gameState.score = Math.max(0, gameState.score + pointsLost);
              const actualPointsApplied = gameState.score - scoreBeforeError; // Pode ser 0 ou negativo, mas nunca deixa score < 0

              // Registrar tentativa com o valor realmente aplicado
              const timeSpent =
                (Date.now() - gameState.currentRiskStartTime) / 1000;
              gameState.attempts.push({
                correct: false,
                timeSpent,
                pointsEarned: actualPointsApplied,
                comboMultiplier: 1,
              });

              playSound("error");
              showFeedback(
                gameState.currentRisk,
                "error",
                gameState.currentRisk.category
              );
              setErrorCount(gameState.errorCount);
              onErrorCountChange?.(gameState.errorCount);
            }
          } else {
            // Caiu fora de qualquer coluna
            gameState.errorCount++;
            gameState.combo = 0;

            const pointsLost = SCORING.ERROR_PENALTY;
            const scoreBeforeError = gameState.score;
            gameState.score = Math.max(0, gameState.score + pointsLost);
            const actualPointsApplied = gameState.score - scoreBeforeError; // Pode ser 0 ou negativo, mas nunca deixa score < 0

            // Registrar tentativa com o valor realmente aplicado
            const timeSpent =
              (Date.now() - gameState.currentRiskStartTime) / 1000;
            gameState.attempts.push({
              correct: false,
              timeSpent,
              pointsEarned: actualPointsApplied,
              comboMultiplier: 1,
            });

            playSound("error");
            showFeedback(
              gameState.currentRisk,
              "error",
              gameState.currentRisk.category
            );
            setErrorCount(gameState.errorCount);
            onErrorCountChange?.(gameState.errorCount);
          }

          gameState.risksCompleted++;

          if (gameState.risksCompleted >= gameState.maxRisks) {
            gameState.gameActive = false;

            // Calcular tempo total da fase
            const totalTime = (Date.now() - gameState.phaseStartTime) / 1000;

            // Calcular pontuação completa da fase
            const phaseScore = calculatePhaseScore(
              gameState.attempts,
              totalTime
            );

            onPhaseComplete(phaseScore);
          } else {
            // Esperar 800ms antes de spawnar novo risco
            setTimeout(() => {
              generateNewRisk();
              gameState.currentRiskStartTime = Date.now(); // Resetar tempo da jogada
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
          // DIFÍCIL: Imagem do risco (se disponível) ou primeira letra
          ctx.fillStyle = "#374151";
          ctx.fillRect(riskX, riskY, riskWidth, riskHeight);

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.strokeRect(riskX, riskY, riskWidth, riskHeight);

          // Tentar exibir imagem se disponível
          if (gameState.currentRisk.image) {
            const cachedImage = gameState.imageCache.get(
              gameState.currentRisk.image
            );
            if (cachedImage && cachedImage.complete) {
              // Calcular dimensões para manter aspect ratio dentro do card com padding maior
              const padding = 12; // Padding maior para imagens
              const imgAspect = cachedImage.width / cachedImage.height;
              const availableWidth = riskWidth - padding * 2;
              const availableHeight = riskHeight - padding * 2;
              const cardAspect = availableWidth / availableHeight;
              let drawWidth, drawHeight, drawX, drawY;

              if (imgAspect > cardAspect) {
                // Imagem mais larga - ajustar pela largura
                drawWidth = availableWidth;
                drawHeight = drawWidth / imgAspect;
                drawX = riskX + padding;
                drawY = riskY + (riskHeight - drawHeight) / 2;
              } else {
                // Imagem mais alta - ajustar pela altura
                drawHeight = availableHeight;
                drawWidth = drawHeight * imgAspect;
                drawX = riskX + (riskWidth - drawWidth) / 2;
                drawY = riskY + padding;
              }

              ctx.drawImage(cachedImage, drawX, drawY, drawWidth, drawHeight);
            } else {
              // Fallback: Primeira letra enquanto carrega
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 48px Arial";
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
          } else {
            // Sem imagem: Primeira letra maior
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 48px Arial";
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

    const handleHintClick = () => {
      if (hintsRemaining > 0 && gameStateRef.current.isPaused) {
        setShowHint(true);
        setHintsRemaining((prev) => prev - 1);
      }
    };

    return (
      <div className="w-full flex flex-col items-center gap-4 relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-cyan-400 rounded-2xl bg-slate-900 shadow-2xl w-full"
        />

        {/* Botão de Ajuda - Aparece apenas quando pausado */}
        {gameStateRef.current.isPaused && hintsRemaining > 0 && (
          <button
            onClick={handleHintClick}
            className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg border-2 border-yellow-400 shadow-lg transition-colors duration-200"
          >
            Ajuda ({hintsRemaining})
          </button>
        )}

        {/* Painel de Dica */}
        {showHint &&
          gameStateRef.current.isPaused &&
          gameStateRef.current.currentHint && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-yellow-400 p-6 rounded-lg shadow-xl max-w-lg border-2 border-yellow-500">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      Dica
                    </h3>
                    <p className="text-base text-gray-800 leading-relaxed">
                      {gameStateRef.current.currentHint}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowHint(false)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

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
