import { useState } from "react";
import { ArrowLeft, X, Gamepad2, BookOpen, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HowToPlayProps {
  onClose: () => void;
  onStartGame?: () => void;
}

type Tab = "controles" | "grupos" | "dicas";

type GrupoInfo = {
  id: number;
  emoji: string;
  cor: string;
  titulo: string;
  subtitulo: string;
  gradiente: string;
  borda: string;
  oQueSao: string;
  dica: string;
  exemplos: string[];
  pergunta: string;
  corTexto: string;
  corFundo: string;
};

const grupos: GrupoInfo[] = [
  {
    id: 1,
    emoji: "🟢",
    cor: "VERDE",
    titulo: "GRUPO I - VERDE",
    subtitulo: "RISCOS FÍSICOS",
    gradiente: "from-green-400 to-green-600",
    borda: "border-green-300",
    corTexto: "text-green-700",
    corFundo: "bg-green-50",
    oQueSao:
      "São riscos que podem MACHUCAR ou FERIR seu corpo através de CONTATO FÍSICO ou energia.",
    dica: "Tudo que pode te BATER, CORTAR, QUEIMAR ou fazer BARULHO demais!",
    exemplos: [
      "Ruído",
      "Vibrações",
      "Radiações ionizantes",
      "Radiações não ionizantes",
      "Frio",
      "Calor",
      "Pressões anormais",
      "Umidade",
      "Temperaturas extremas",
    ],
    pergunta: "Posso me machucar fisicamente com isso?",
  },
  {
    id: 2,
    emoji: "🔴",
    cor: "VERMELHO",
    titulo: "GRUPO II - VERMELHO",
    subtitulo: "RISCOS QUÍMICOS",
    gradiente: "from-red-400 to-red-600",
    borda: "border-red-300",
    corTexto: "text-red-700",
    corFundo: "bg-red-50",
    oQueSao:
      "São SUBSTÂNCIAS químicas (líquidas, gasosas ou em pó) que você pode RESPIRAR, TOCAR ou ENGOLIR.",
    dica: "Tudo que tem CHEIRO FORTE, FUMAÇA ou é PRODUTO QUÍMICO!",
    exemplos: [
      "Poeiras",
      "Fumos metálicos",
      "Névoas",
      "Neblinas",
      "Gases",
      "Vapores",
      "Substâncias, compostos ou produtos químicos em geral",
    ],
    pergunta: "É algo que posso inalar ou tocar e faz mal à saúde?",
  },
  {
    id: 3,
    emoji: "🟤",
    cor: "MARROM",
    titulo: "GRUPO III - MARROM",
    subtitulo: "RISCOS BIOLÓGICOS",
    gradiente: "from-amber-700 to-amber-900",
    borda: "border-amber-600",
    corTexto: "text-amber-800",
    corFundo: "bg-amber-50",
    oQueSao:
      "São SERES VIVOS microscópicos (bichinhos minúsculos) que podem causar DOENÇAS.",
    dica: "Coisas VIVAS que podem te deixar DOENTE - vírus, bactérias, fungos!",
    exemplos: [
      "Vírus",
      "Bactérias",
      "Protozoários",
      "Fungos",
      "Parasitas",
      "Bacilos",
      "Animais peçonhentos",
    ],
    pergunta: "É um organismo vivo que pode me contaminar?",
  },
  {
    id: 4,
    emoji: "🟡",
    cor: "AMARELO",
    titulo: "GRUPO IV - AMARELO",
    subtitulo: "RISCOS ERGONÔMICOS",
    gradiente: "from-yellow-400 to-yellow-600",
    borda: "border-yellow-300",
    corTexto: "text-yellow-700",
    corFundo: "bg-yellow-50",
    oQueSao:
      "São riscos relacionados à forma como você TRABALHA e usa seu CORPO. Causam CANSAÇO e DOR.",
    dica: "Tudo que deixa seu corpo CANSADO, com DOR ou ESTRESSADO no trabalho!",
    exemplos: [
      "Esforço físico intenso",
      "Levantamento e transporte manual de peso",
      "Exigência de postura inadequada",
      "Controle rígido de produtividade",
      "Imposição de ritmos excessivos",
      "Trabalho em turno e noturno",
      "Jornada de trabalho prolongadas",
      "Monotonia e repetitividade",
      "Outras situações causadoras de estresse físico e/ou psíquico",
    ],
    pergunta: "Isso pode cansar meu corpo ou causar estresse no trabalho?",
  },
  {
    id: 5,
    emoji: "🔵",
    cor: "AZUL",
    titulo: "GRUPO V - AZUL",
    subtitulo: "RISCOS DE ACIDENTES",
    gradiente: "from-blue-400 to-blue-600",
    borda: "border-blue-300",
    corTexto: "text-blue-700",
    corFundo: "bg-blue-50",
    oQueSao:
      "São situações PERIGOSAS que podem causar ACIDENTES GRAVES de repente.",
    dica: "Coisas que podem causar um ACIDENTE GRAVE rapidamente - fogo, choque, quedas!",
    exemplos: [
      "Arranjo físico inadequado",
      "Máquinas e equipamentos sem proteção",
      "Ferramentas inadequadas ou defeituosas",
      "Iluminação inadequada",
      "Eletricidade",
      "Probabilidade de incêndio ou explosão",
      "Armazenamento inadequado",
      "Picadas de insetos, cobras, aranhas, etc.",
      "Outras situações de risco que poderão contribuir para a ocorrência de acidentes",
    ],
    pergunta: "Pode causar um acidente sério agora mesmo?",
  },
];

export default function HowToPlay({ onClose, onStartGame }: HowToPlayProps) {
  const [activeTab, setActiveTab] = useState<Tab>("controles");
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGrupoClick = (grupo: GrupoInfo) => {
    setSelectedGrupo(grupo);
    setDialogOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Efeitos de background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse-soft [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl animate-pulse-soft [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-b from-purple-900 via-purple-800 to-transparent py-4 px-4 shadow-2xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-3d bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 p-3 rounded-2xl border-4 border-blue-300 transition-all hover:scale-110"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            <h1 className="font-game-title text-2xl sm:text-3xl text-white text-stroke-sm drop-shadow-lg">
              COMO JOGAR
            </h1>

            <button
              onClick={onClose}
              className="btn-3d bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 p-3 rounded-2xl border-4 border-red-300 transition-all hover:scale-110"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-purple-900/50 backdrop-blur-sm py-4 px-4 sticky top-[88px] z-10">
          <div className="max-w-4xl mx-auto flex gap-3 justify-center">
            <button
              onClick={() => setActiveTab("controles")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-game-title text-sm sm:text-base transition-all duration-300 ${
                activeTab === "controles"
                  ? "btn-3d bg-white text-purple-900 border-4 border-purple-300 shadow-xl scale-105"
                  : "bg-purple-800/50 text-white hover:bg-purple-700/70 border-2 border-purple-600"
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="hidden sm:inline">CONTROLES</span>
            </button>

            <button
              onClick={() => setActiveTab("grupos")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-game-title text-sm sm:text-base transition-all duration-300 ${
                activeTab === "grupos"
                  ? "btn-3d bg-white text-purple-900 border-4 border-purple-300 shadow-xl scale-105"
                  : "bg-purple-800/50 text-white hover:bg-purple-700/70 border-2 border-purple-600"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">GRUPOS</span>
            </button>

            <button
              onClick={() => setActiveTab("dicas")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-game-title text-sm sm:text-base transition-all duration-300 ${
                activeTab === "dicas"
                  ? "btn-3d bg-white text-purple-900 border-4 border-purple-300 shadow-xl scale-105"
                  : "bg-purple-800/50 text-white hover:bg-purple-700/70 border-2 border-purple-600"
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span className="hidden sm:inline">DICAS</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-hidden px-4 py-6 flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col pb-6">
            {/* Tab: Controles */}
            {activeTab === "controles" && (
              <div className="space-y-6 animate-fade-in overflow-y-auto flex-1 pr-2">
                {/* Resumo Ultra Simples */}
                <div className="card-3d bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-3xl border-4 border-purple-300 text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="font-game-title text-4xl text-white text-stroke-sm mb-6">
                    MUITO SIMPLES!
                  </h2>
                  <div className="space-y-3 text-white font-game-body text-xl">
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-game-title text-2xl">1.</span>
                      <span>Risco cai do topo</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-game-title text-2xl">2.</span>
                      <span>Você move com ← →</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-game-title text-2xl">3.</span>
                      <span>Coloca na cor certa</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-game-title text-2xl">4.</span>
                      <span>Ganha pontos! ⭐</span>
                    </div>
                  </div>
                </div>

                {/* Título Principal */}
                {/* <div className="card-3d bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl border-4 border-blue-300 text-center">
                  <div className="text-6xl mb-3">🎮</div>
                  <h2 className="font-game-title text-3xl text-white text-stroke-sm mb-2">
                    COMO JOGAR
                  </h2>
                </div> */}

                {/* Objetivo do Jogo */}
                {/* <div className="card-3d bg-white/95 backdrop-blur-sm p-6 rounded-3xl border-4 border-purple-300">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">🎯</div>
                    <div>
                      <h3 className="font-game-title text-2xl text-purple-900 mb-3">
                        SEU OBJETIVO:
                      </h3>
                      <p className="font-game-body text-lg text-gray-700 leading-relaxed">
                        Identificar e classificar os{" "}
                        <strong>riscos de trabalho</strong> nas categorias
                        corretas antes que caiam!
                      </p>
                      <div className="mt-4 flex items-center gap-2 bg-yellow-400/20 p-3 rounded-2xl border-2 border-yellow-400">
                        <span className="text-3xl">⭐</span>
                        <span className="font-game-title text-yellow-700">
                          Acerte todos para ganhar!
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Como Funciona */}
                {/* <div className="card-3d bg-white/95 backdrop-blur-sm p-6 rounded-3xl border-4 border-purple-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">⚙️</div>
                    <h3 className="font-game-title text-2xl text-purple-900">
                      COMO FUNCIONA:
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start bg-purple-50 p-4 rounded-2xl">
                      <div className="text-3xl flex-shrink-0">1️⃣</div>
                      <p className="font-game-body text-gray-700 text-lg">
                        Um risco aparece no <strong>TOPO</strong> da tela e
                        começa a <strong>CAIR</strong> automaticamente
                      </p>
                    </div>

                    <div className="flex gap-4 items-start bg-blue-50 p-4 rounded-2xl">
                      <div className="text-3xl flex-shrink-0">2️⃣</div>
                      <p className="font-game-body text-gray-700 text-lg">
                        Você move o risco para <strong>ESQUERDA</strong> ou{" "}
                        <strong>DIREITA</strong> usando as setas ← →
                      </p>
                    </div>

                    <div className="flex gap-4 items-start bg-green-50 p-4 rounded-2xl">
                      <div className="text-3xl flex-shrink-0">3️⃣</div>
                      <p className="font-game-body text-gray-700 text-lg">
                        Quando estiver sobre a caixa <strong>CERTA</strong>,
                        deixe cair ou acelere com ↓
                      </p>
                    </div>

                    <div className="flex gap-4 items-start bg-yellow-50 p-4 rounded-2xl">
                      <div className="text-3xl flex-shrink-0">4️⃣</div>
                      <p className="font-game-body text-gray-700 text-lg">
                        Acertou? Ganhe pontos! ✅ Errou? Perde pontos e tenta de
                        novo ❌
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Controles do Teclado */}
                {/* <div className="card-3d bg-white/95 backdrop-blur-sm p-6 rounded-3xl border-4 border-purple-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">⌨️</div>
                    <h3 className="font-game-title text-2xl text-purple-900">
                      CONTROLES:
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="card-3d bg-gray-100 border-4 border-gray-300 p-4 rounded-xl w-16 h-16 flex items-center justify-center">
                        <span className="font-game-title text-2xl text-gray-700">
                          ←
                        </span>
                      </div>
                      <span className="font-game-body text-lg text-gray-700">
                        MOVER PARA ESQUERDA
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="card-3d bg-gray-100 border-4 border-gray-300 p-4 rounded-xl w-16 h-16 flex items-center justify-center">
                        <span className="font-game-title text-2xl text-gray-700">
                          →
                        </span>
                      </div>
                      <span className="font-game-body text-lg text-gray-700">
                        MOVER PARA DIREITA
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="card-3d bg-gray-100 border-4 border-gray-300 p-4 rounded-xl w-16 h-16 flex items-center justify-center">
                        <span className="font-game-title text-2xl text-gray-700">
                          ↓
                        </span>
                      </div>
                      <span className="font-game-body text-lg text-gray-700">
                        ACELERAR A QUEDA
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="card-3d bg-gray-100 border-4 border-gray-300 px-4 py-2 rounded-xl flex items-center justify-center">
                        <span className="font-game-title text-sm text-gray-700">
                          ESPAÇO
                        </span>
                      </div>
                      <span className="font-game-body text-lg text-gray-700">
                        PAUSAR O JOGO
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Pontuação */}
                {/* <div className="card-3d bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl border-4 border-yellow-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">💯</div>
                    <h3 className="font-game-title text-2xl text-white text-stroke-sm">
                      PONTUAÇÃO:
                    </h3>
                  </div>

                  <div className="space-y-3 text-white font-game-body text-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <span>
                        Acertou → <strong>+10 pontos</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❌</span>
                      <span>
                        Errou → <strong>-5 pontos</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <span>
                        Combo (2+) → <strong>Pontos extras!</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span>
                        Rápido → <strong>Bônus de tempo</strong>
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-white/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <span className="font-game-title text-xl">
                          META: 10 riscos corretos
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {/* Tab: Grupos */}
            {activeTab === "grupos" && (
              <div className="space-y-6 animate-fade-in overflow-y-auto flex-1 pr-2">
                {/* Título Principal */}
                <div className="card-3d bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl border-4 border-blue-300 text-center">
                  <h2 className="font-game-title text-3xl text-white text-stroke-sm mb-2">
                    CONHEÇA OS GRUPOS
                  </h2>
                  <p className="font-game-body text-white/90 text-sm">
                    Clique em um grupo para ver detalhes
                  </p>
                </div>

                {/* Grid de Cards dos Grupos */}
                <div className="grid grid-cols-5 gap-4">
                  {grupos.map((grupo) => (
                    <button
                      key={grupo.id}
                      onClick={() => handleGrupoClick(grupo)}
                      className={`card-3d bg-gradient-to-br ${grupo.gradiente} p-6 rounded-3xl border-4 ${grupo.borda} hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3">{grupo.emoji}</div>
                        <h3 className="font-game-title text-lg text-white text-stroke-sm mb-1">
                          {grupo.cor}
                        </h3>
                        <p className="font-game-body text-xs text-white/90">
                          {grupo.subtitulo}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Dicas */}
            {activeTab === "dicas" && (
              <div className="animate-fade-in overflow-y-auto flex-1 pr-2">
                <div className="card-3d bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-3xl border-4 border-purple-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-green-50 p-2 sm:p-3 rounded-2xl border-l-4 border-green-500">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg sm:text-xl">🟢</span>
                        <span className="font-game-title text-xs sm:text-sm text-green-700">
                          VERDE
                        </span>
                      </div>
                      <p className="font-game-body text-xs sm:text-sm text-gray-700">
                        👊 <strong>"Bate, corta, queima"</strong>
                      </p>
                      <p className="font-game-body text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        AGRESSÃO FÍSICA
                      </p>
                    </div>

                    <div className="bg-red-50 p-2 sm:p-3 rounded-2xl border-l-4 border-red-500">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg sm:text-xl">🔴</span>
                        <span className="font-game-title text-xs sm:text-sm text-red-700">
                          VERMELHO
                        </span>
                      </div>
                      <p className="font-game-body text-xs sm:text-sm text-gray-700">
                        💨 <strong>"Cheira ou fumaça"</strong>
                      </p>
                      <p className="font-game-body text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        RESPIRA OU TOCA
                      </p>
                    </div>

                    <div className="bg-amber-50 p-2 sm:p-3 rounded-2xl border-l-4 border-amber-700">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg sm:text-xl">🟤</span>
                        <span className="font-game-title text-xs sm:text-sm text-amber-800">
                          MARROM
                        </span>
                      </div>
                      <p className="font-game-body text-xs sm:text-sm text-gray-700">
                        🦠 <strong>"Vivo e contamina"</strong>
                      </p>
                      <p className="font-game-body text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        CAUSA DOENÇA
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-2 sm:p-3 rounded-2xl border-l-4 border-yellow-500">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg sm:text-xl">🟡</span>
                        <span className="font-game-title text-xs sm:text-sm text-yellow-700">
                          AMARELO
                        </span>
                      </div>
                      <p className="font-game-body text-xs sm:text-sm text-gray-700">
                        😫 <strong>"Cansa e estressa"</strong>
                      </p>
                      <p className="font-game-body text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        POSTURA E ESFORÇO
                      </p>
                    </div>

                    <div className="bg-blue-50 p-2 sm:p-3 rounded-2xl border-l-4 border-blue-500 sm:col-span-2">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-lg sm:text-xl">🔵</span>
                        <span className="font-game-title text-xs sm:text-sm text-blue-700">
                          AZUL
                        </span>
                      </div>
                      <p className="font-game-body text-xs sm:text-sm text-gray-700">
                        ⚠️ <strong>"Acidente agora!"</strong>
                      </p>
                      <p className="font-game-body text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        PERIGOS E SITUAÇÕES RUINS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer com botão de ação */}
        <div className="bg-gradient-to-t from-purple-900 via-purple-800 to-transparent py-4 px-4 z-20 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="font-game-title text-white text-base mb-3">
                Entendeu tudo?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                {onStartGame && (
                  <button
                    onClick={onStartGame}
                    className="btn-3d bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-4 px-8 rounded-2xl border-4 border-green-300 transition-all hover:scale-105 w-full sm:w-auto"
                  >
                    ✅ ENTENDI - JOGAR!
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-purple-700/50 hover:bg-purple-600/70 text-white font-game-body px-6 py-2 rounded-xl transition-all"
                >
                  ← Voltar para o Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para detalhes do Grupo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          {selectedGrupo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-4xl">{selectedGrupo.emoji}</span>
                  <div>
                    <h3 className="font-game-title text-2xl">
                      {selectedGrupo.titulo}
                    </h3>
                    <p className="font-game-body text-sm text-gray-600">
                      {selectedGrupo.subtitulo}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <h4
                    className={`font-game-title text-lg ${selectedGrupo.corTexto} mb-2`}
                  >
                    📖 O QUE SÃO?
                  </h4>
                  <p className="font-game-body text-gray-700 leading-relaxed">
                    {selectedGrupo.oQueSao}
                  </p>
                </div>

                <div className={`${selectedGrupo.corFundo} p-4 rounded-xl`}>
                  <h4
                    className={`font-game-title text-lg ${selectedGrupo.corTexto} mb-2`}
                  >
                    💡 DICA PARA LEMBRAR:
                  </h4>
                  <p className="font-game-body text-gray-700 italic">
                    {selectedGrupo.dica}
                  </p>
                </div>

                <div>
                  <h4
                    className={`font-game-title text-lg ${selectedGrupo.corTexto} mb-2`}
                  >
                    📋 RISCOS:
                  </h4>
                  <ul className="space-y-2 font-game-body text-gray-700">
                    {selectedGrupo.exemplos.map((exemplo, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{exemplo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-100 p-4 rounded-xl">
                  <h4
                    className={`font-game-title text-lg ${selectedGrupo.corTexto} mb-2`}
                  >
                    🎯 PENSE ASSIM:
                  </h4>
                  <p className="font-game-body text-gray-700 font-semibold">
                    "{selectedGrupo.pergunta}"
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
