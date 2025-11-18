/**
 * Sistema de pontuação do jogo
 */

export interface RiskAttempt {
  correct: boolean;
  timeSpent: number; // tempo em segundos para esta jogada
  pointsEarned: number;
  comboMultiplier: number;
}

export interface PhaseScore {
  basePoints: number; // Pontos base (acertos e erros)
  comboBonus: number; // Bônus de combo
  timeBonus: number; // Bônus de tempo total
  performanceBonus: number; // Bônus final por acertos
  totalPoints: number; // Total da fase
  correctCount: number; // Total de acertos
  errorCount: number; // Total de erros
  totalTime: number; // Tempo total da fase em segundos
  attempts: RiskAttempt[]; // Histórico de todas as 10 jogadas
}

export interface GameScore {
  phase1: PhaseScore | null;
  phase2: PhaseScore | null;
  phase3: PhaseScore | null;
  grandTotal: number;
}

/**
 * Constantes do sistema de pontuação
 */
export const SCORING = {
  CORRECT_POINTS: 100,
  ERROR_PENALTY: -30,

  COMBO_MULTIPLIERS: {
    LOW: { min: 1, max: 2, multiplier: 1.0 },
    MEDIUM: { min: 3, max: 4, multiplier: 1.5 },
    HIGH: { min: 5, max: 7, multiplier: 2.0 },
    MEGA: { min: 8, max: 10, multiplier: 3.0 },
  },

  TIME_BONUS: {
    EXCELLENT: { maxTime: 20, bonus: 300 },
    GOOD: { maxTime: 40, bonus: 200 },
    AVERAGE: { maxTime: 60, bonus: 100 },
    POOR: { maxTime: 80, bonus: 50 },
    NONE: { maxTime: Infinity, bonus: 0 },
  },

  PERFORMANCE_BONUS: {
    PERFECT: { correctCount: 10, bonus: 500 },
    EXCELLENT: { correctCount: 8, bonus: 250 },
    GOOD: { correctCount: 6, bonus: 100 },
    POOR: { correctCount: 0, bonus: 0 },
  },
};

/**
 * Calcula o multiplicador de combo baseado no número de acertos seguidos
 */
export function getComboMultiplier(combo: number): number {
  const { COMBO_MULTIPLIERS } = SCORING;

  if (combo >= COMBO_MULTIPLIERS.MEGA.min)
    return COMBO_MULTIPLIERS.MEGA.multiplier;
  if (combo >= COMBO_MULTIPLIERS.HIGH.min)
    return COMBO_MULTIPLIERS.HIGH.multiplier;
  if (combo >= COMBO_MULTIPLIERS.MEDIUM.min)
    return COMBO_MULTIPLIERS.MEDIUM.multiplier;
  return COMBO_MULTIPLIERS.LOW.multiplier;
}

/**
 * Retorna o nome do nível de combo
 */
export function getComboLevel(combo: number): string {
  const { COMBO_MULTIPLIERS } = SCORING;

  if (combo >= COMBO_MULTIPLIERS.MEGA.min) return "MEGA";
  if (combo >= COMBO_MULTIPLIERS.HIGH.min) return "ALTO";
  if (combo >= COMBO_MULTIPLIERS.MEDIUM.min) return "MÉDIO";
  return "BÁSICO";
}

/**
 * Calcula o bônus de tempo baseado no tempo total
 */
export function getTimeBonus(totalTimeInSeconds: number): number {
  const { TIME_BONUS } = SCORING;

  if (totalTimeInSeconds <= TIME_BONUS.EXCELLENT.maxTime)
    return TIME_BONUS.EXCELLENT.bonus;
  if (totalTimeInSeconds <= TIME_BONUS.GOOD.maxTime)
    return TIME_BONUS.GOOD.bonus;
  if (totalTimeInSeconds <= TIME_BONUS.AVERAGE.maxTime)
    return TIME_BONUS.AVERAGE.bonus;
  if (totalTimeInSeconds <= TIME_BONUS.POOR.maxTime)
    return TIME_BONUS.POOR.bonus;
  return TIME_BONUS.NONE.bonus;
}

/**
 * Calcula o bônus final por performance (total de acertos)
 */
export function getPerformanceBonus(correctCount: number): number {
  const { PERFORMANCE_BONUS } = SCORING;

  if (correctCount >= PERFORMANCE_BONUS.PERFECT.correctCount)
    return PERFORMANCE_BONUS.PERFECT.bonus;
  if (correctCount >= PERFORMANCE_BONUS.EXCELLENT.correctCount)
    return PERFORMANCE_BONUS.EXCELLENT.bonus;
  if (correctCount >= PERFORMANCE_BONUS.GOOD.correctCount)
    return PERFORMANCE_BONUS.GOOD.bonus;
  return PERFORMANCE_BONUS.POOR.bonus;
}

/**
 * Calcula a pontuação total da fase
 */
export function calculatePhaseScore(
  attempts: RiskAttempt[],
  totalTime: number
): PhaseScore {
  const correctCount = attempts.filter((a) => a.correct).length;
  const errorCount = attempts.filter((a) => !a.correct).length;

  // Pontos base (soma de todos os pontos das tentativas)
  const basePoints = attempts.reduce(
    (sum, attempt) => sum + attempt.pointsEarned,
    0
  );

  // Bônus de combo já está incluído no basePoints
  const comboBonus = 0;

  // Bônus de tempo
  const timeBonus = getTimeBonus(totalTime);

  // Bônus de performance
  const performanceBonus = getPerformanceBonus(correctCount);

  // Total
  const totalPoints = basePoints + timeBonus + performanceBonus;

  return {
    basePoints,
    comboBonus,
    timeBonus,
    performanceBonus,
    totalPoints,
    correctCount,
    errorCount,
    totalTime,
    attempts,
  };
}
