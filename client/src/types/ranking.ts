export interface RankingEntry {
  name: string;
  score: number;
  date: string;
  phases: {
    phase1: number;
    phase2: number;
    phase3: number;
  };
}

const RANKING_KEY = "missao_prevencao_ranking";

export function getRanking(): RankingEntry[] {
  try {
    const data = localStorage.getItem(RANKING_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    return [];
  }
}

export function saveRankingEntry(entry: RankingEntry): void {
  try {
    const ranking = getRanking();
    ranking.push(entry);
    // Ordenar por pontuação (maior para menor)
    ranking.sort((a, b) => b.score - a.score);
    // Manter apenas top 10
    const top10 = ranking.slice(0, 10);
    localStorage.setItem(RANKING_KEY, JSON.stringify(top10));
  } catch (error) {
    console.error("Erro ao salvar ranking:", error);
  }
}

export function clearRanking(): void {
  try {
    localStorage.removeItem(RANKING_KEY);
  } catch (error) {
    console.error("Erro ao limpar ranking:", error);
  }
}
