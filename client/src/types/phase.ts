/**
 * Tipos para o sistema de fases - SEM progresso salvo
 * Tudo é puramente visual para exposição
 */

export type PhaseDifficulty = "fácil" | "médio" | "difícil";

export interface Phase {
  id: number;
  name: string;
  title: string;
  description: string;
  difficulty: PhaseDifficulty;
  theme: string;
  duration: string; // ex: "1-2 min"
  thumbnail: string; // URL ou emoji como fallback
  objectives: string[];
  tips?: string[];
}

export interface GameResources {
  coins: number;
  gems: number;
  hearts: number;
}
