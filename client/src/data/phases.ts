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
    theme: "Prevenção",
    duration: "1-2 min",
    thumbnail: "🛡️",
    objectives: [
      "Identificar situações de risco",
      "Conhecer métodos de prevenção",
      "Completar o desafio básico"
    ],
    tips: [
      "Leia com atenção cada situação",
      "Use as dicas disponíveis"
    ]
  },
  {
    id: 2,
    name: "FASE 2",
    title: "Nível Médio",
    description: "Riscos com texto apenas. Teste sua memória!",
    difficulty: "médio",
    theme: "Saúde",
    duration: "2-3 min",
    thumbnail: "❤️",
    objectives: [
      "Aplicar conhecimentos de saúde",
      "Tomar decisões rápidas",
      "Alcançar pontuação mínima"
    ],
    tips: [
      "Velocidade conta pontos extras",
      "Nem sempre a resposta óbvia é a correta"
    ]
  },
  {
    id: 3,
    name: "FASE 3",
    title: "Nível Difícil",
    description: "Riscos com ícones apenas. Desafio final!",
    difficulty: "difícil",
    theme: "Desafio",
    duration: "3-4 min",
    thumbnail: "🏆",
    objectives: [
      "Resolver situações complexas",
      "Demonstrar domínio total",
      "Conquistar a vitória"
    ],
    tips: [
      "Combine todos os conhecimentos",
      "Fique atento aos detalhes"
    ]
  }
];

// Recursos visuais fixos (não mudam, apenas para UI)
export const STATIC_RESOURCES = {
  coins: 9999,
  gems: 888,
  hearts: 5
};
