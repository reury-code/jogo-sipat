import { Phase } from "@/types/phase";

/**
 * Dados estáticos das fases do jogo
 * NÃO há progresso salvo - todas as fases estão sempre disponíveis
 */

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "FASE 1",
    title: "Nível Fácil",
    description: "Riscos com cor e texto. Aprenda as categorias!",
    difficulty: "fácil",
    theme: "Aprendizagem", // Foco: Aprender rápido
    duration: "1-2 min",
    thumbnail: "🛡️",
    objectives: [
      "Aprender a classificar cada categoria de risco",
      "Associar as cores e os textos aos riscos corretos",
      "Completar o desafio para desbloquear o próximo nível",
    ],
    tips: [
      "Preste atenção nas cores, elas são a principal dica",
      "Não se preocupe com o tempo, o objetivo é aprender",
    ],
  },
  {
    id: 2,
    name: "FASE 2",
    title: "Nível Médio",
    description: "Riscos com texto apenas. Teste sua memória!",
    difficulty: "médio",
    theme: "Memória", // Foco: Lembrar e raciocinar
    duration: "2-3 min",
    thumbnail: "🔧",
    objectives: [
      "Lembrar qual risco corresponde a cada descrição",
      "Raciocinar rapidamente sem a ajuda das cores",
      "Atingir a pontuação necessária para avançar",
    ],
    tips: [
      "Tente memorizar as categorias da fase anterior",
      "Leia a descrição com cuidado para não se confundir",
    ],
  },
  {
    id: 3,
    name: "FASE 3",
    title: "Nível Difícil",
    description: "Classifique os riscos através das imagens. Desafio final!",
    difficulty: "difícil",
    theme: "Atenção", // Foco: Atenção aos detalhes visuais
    duration: "3-4 min",
    thumbnail: "🏆",
    objectives: [
      "Analisar e interpretar o risco contido em cada imagem",
      "Aplicar todo o conhecimento adquirido nas fases anteriores",
      "Provar sua maestria completando o desafio final",
    ],
    tips: [
      "Observe cada detalhe da imagem, a resposta está lá",
      "Confie na sua intuição e no que você já aprendeu",
    ],
  },
];

// Mensagens curtas sobre os ODS relacionados ao evento SIPAT
// Textos curtos baseados nos pilares do objetivo da SIPAT
export const STATIC_RESOURCES = {
  coins: 0,
  gems: 0,
  hearts: 5,
};
