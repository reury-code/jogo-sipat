export interface GameSettings {
  itemsPerPhase: number; // Quantidade de itens por fase
  normalFallSpeed: number; // Velocidade normal de queda
  fastFallMultiplier: number; // Multiplicador de velocidade ao apertar seta para baixo
  hintsPerGame: number; // Número de dicas disponíveis por jogo
}

export const DEFAULT_SETTINGS: GameSettings = {
  itemsPerPhase: 10, // Valor original do jogo
  normalFallSpeed: 0.6, // Valor original do jogo
  fastFallMultiplier: 5, // Valor original do jogo (5x)
  hintsPerGame: 3, // Valor original do jogo
};
