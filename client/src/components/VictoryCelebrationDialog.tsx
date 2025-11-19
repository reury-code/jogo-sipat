import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Trophy, Medal, Award, Sparkles, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VictoryCelebrationDialogProps {
  isOpen: boolean;
  position: number; // 1, 2 ou 3
  score: number;
  playerName: string;
  onClose: () => void;
}

export default function VictoryCelebrationDialog({
  isOpen,
  position,
  score,
  playerName,
  onClose,
}: VictoryCelebrationDialogProps) {
  const [showContent, setShowContent] = useState(false);

  // Configurações baseadas na posição
  type PositionConfig = {
    icon: any;
    color: string;
    textColor: string;
    borderColor: string;
    title: string;
    subtitle: string;
    medal: string;
    confettiColors: string[];
  };

  const configs: Record<number, PositionConfig> = {
    1: {
      icon: Trophy,
      color: "from-yellow-400 via-yellow-500 to-amber-600",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400",
      title: "🥇 CAMPEÃO!",
      subtitle: "VOCÊ É O NÚMERO 1!",
      medal: "🥇",
      confettiColors: ["#FFD700", "#FFA500", "#FF8C00"],
    },
    2: {
      icon: Medal,
      color: "from-gray-300 via-gray-400 to-gray-500",
      textColor: "text-gray-300",
      borderColor: "border-gray-300",
      title: "🥈 VICE-CAMPEÃO!",
      subtitle: "INCRÍVEL DESEMPENHO!",
      medal: "🥈",
      confettiColors: ["#C0C0C0", "#A8A8A8", "#808080"],
    },
    3: {
      icon: Award,
      color: "from-orange-400 via-orange-500 to-orange-700",
      textColor: "text-orange-400",
      borderColor: "border-orange-400",
      title: "🥉 3º LUGAR!",
      subtitle: "VOCÊ ESTÁ NO PÓDIO!",
      medal: "🥉",
      confettiColors: ["#CD7F32", "#B87333", "#A0522D"],
    },
  };

  const positionConfig = configs[position] || configs[3];

  const Icon = positionConfig.icon;

  useEffect(() => {
    if (isOpen) {
      // Tocar som de vitória
      playVictorySound();

      // Delay para animação de entrada
      setTimeout(() => setShowContent(true), 300);

      // Confete explosivo inicial
      fireConfetti();

      // Confete contínuo durante 3 segundos (reduzido)
      const interval = setInterval(() => {
        fireConfetti();
      }, 800); // Aumentado intervalo

      setTimeout(() => {
        clearInterval(interval);
      }, 3000); // Reduzido de 5s para 3s

      return () => clearInterval(interval);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const fireConfetti = () => {
    const count = 100; // Reduzido de 200 para 100
    const defaults = {
      origin: { y: 0.7 },
      colors: positionConfig.confettiColors,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        scalar: 1.2,
        gravity: 1,
        ticks: 400,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
  };

  const playVictorySound = () => {
    try {
      // Criar sequência de notas musicais vitoriosas
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const notes = [
        { freq: 523.25, duration: 0.15 }, // C5
        { freq: 659.25, duration: 0.15 }, // E5
        { freq: 783.99, duration: 0.15 }, // G5
        { freq: 1046.5, duration: 0.4 }, // C6
      ];

      let time = audioContext.currentTime;

      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);

        oscillator.start(time);
        oscillator.stop(time + note.duration);

        time += note.duration;
      });
    } catch (error) {
      console.log("Áudio não disponível:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-md bg-black/50" />
      <DialogContent
        className="max-w-md max-h-[85vh] border-0 bg-transparent shadow-none p-0 overflow-visible focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        showCloseButton={false}
      >
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateZ: -10 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="relative max-h-[85vh] overflow-hidden"
            >
              {/* Brilhos de fundo */}
              <div className="absolute inset-0 -z-10">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${positionConfig.color} blur-3xl rounded-full`}
                />
              </div>

              {/* Card Principal */}
              <div
                className={`card-3d relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-5 rounded-3xl border-4 ${positionConfig.borderColor} shadow-2xl overflow-hidden`}
              >
                {/* Padrão de fundo animado - mais sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Brilhos sutis */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
                </div>

                {/* Botão Fechar */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-2 right-2 z-20 text-white hover:bg-white/30 rounded-full w-8 h-8"
                >
                  <X className="h-5 w-5" />
                </Button>

                <div className="relative z-10">
                  {/* Header com ícone animado - compacto */}
                  <div className="text-center mb-3">
                    <motion.div
                      animate={{
                        rotateZ: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="flex justify-center mb-2"
                    >
                      <div
                        className={`relative bg-gradient-to-br ${positionConfig.color} p-3 rounded-full shadow-2xl border-3 border-white/30`}
                      >
                        <Icon
                          className="w-10 h-10 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                    </motion.div>

                    <h2 className="text-2xl font-game-title text-white text-stroke mb-0.5">
                      {positionConfig.title}
                    </h2>
                    <p
                      className={`text-lg font-game-title ${positionConfig.textColor} drop-shadow-lg`}
                    >
                      {positionConfig.subtitle}
                    </p>
                  </div>

                  {/* Medalha animada - menor */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotateY: [0, 360],
                    }}
                    transition={{
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotateY: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="text-6xl text-center my-3 drop-shadow-2xl"
                  >
                    {positionConfig.medal}
                  </motion.div>

                  {/* Informações do jogador - compactas */}
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 mb-3 border-2 border-white/40 shadow-lg">
                    <div className="text-center space-y-1.5">
                      <div>
                        <p className="text-white/90 text-[10px] font-game-title mb-0.5 tracking-wider uppercase">
                          🏆 Jogador
                        </p>
                        <p className="text-xl font-game-title text-white text-stroke">
                          {playerName}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 py-1">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/90 text-[10px] font-game-title mb-0.5 tracking-wider uppercase">
                            💎 Pontos
                          </p>
                          <motion.p
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="text-2xl font-game-title text-yellow-300 text-stroke drop-shadow-lg"
                          >
                            {score.toLocaleString()}
                          </motion.p>
                        </div>

                        <div>
                          <p className="text-white/90 text-[10px] font-game-title mb-0.5 tracking-wider uppercase">
                            📊 Posição
                          </p>
                          <motion.p
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                            }}
                            className={`text-3xl font-game-title ${positionConfig.textColor} text-stroke drop-shadow-lg`}
                          >
                            #{position}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mensagem motivacional - compacta */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-2.5 mb-3 border border-white/20"
                  >
                    <p className="text-white font-game-body text-xs drop-shadow-md leading-snug">
                      {position === 1 &&
                        "🎉 Parabéns! Você é o campeão da Missão Prevenção!"}
                      {position === 2 &&
                        "🌟 Incrível! Você está entre os melhores agentes!"}
                      {position === 3 &&
                        "🚀 Fantástico! Você conquistou o pódio!"}
                    </p>
                  </motion.div>

                  {/* Botão de continuar - compacto */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={onClose}
                      className={`btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-base py-4 rounded-2xl uppercase border-4 border-green-300 shadow-2xl transition-all hover:scale-105`}
                    >
                      <span className="text-stroke-sm flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        CONTINUAR
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
