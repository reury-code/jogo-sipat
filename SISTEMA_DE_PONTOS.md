# 📊 Sistema de Pontuação - Jogo Missão Prevenção

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Componentes do Sistema](#componentes-do-sistema)
3. [Pontuação Base](#pontuação-base)
4. [Sistema de Combo](#sistema-de-combo)
5. [Bônus de Tempo](#bônus-de-tempo)
6. [Bônus de Performance](#bônus-de-performance)
7. [Cálculo Final da Fase](#cálculo-final-da-fase)
8. [Exemplos Práticos](#exemplos-práticos)
9. [Estrutura de Dados](#estrutura-de-dados)

---

## 🎯 Visão Geral

O sistema de pontuação do jogo foi projetado para **recompensar velocidade, precisão e consistência**. Cada fase possui **10 riscos** a serem classificados, e a pontuação final é calculada com base em:

- ✅ **Acertos e erros** (pontuação base)
- 🔥 **Combos** (acertos consecutivos com multiplicadores)
- ⏱️ **Tempo total** da fase (bônus por rapidez)
- 🏆 **Performance geral** (bônus por quantidade de acertos)

---

## 🧩 Componentes do Sistema

### Constantes Principais

```typescript
export const SCORING = {
  CORRECT_POINTS: 100,      // Pontos por acerto
  ERROR_PENALTY: -30,       // Penalidade por erro

  COMBO_MULTIPLIERS: {...}, // Multiplicadores de combo
  TIME_BONUS: {...},        // Bônus por tempo
  PERFORMANCE_BONUS: {...}  // Bônus por acertos totais
}
```

---

## ✅ Pontuação Base

### Regras Básicas

| Ação       | Pontos | Observação                      |
| ---------- | ------ | ------------------------------- |
| **Acerto** | +100   | Base (sem multiplicador)        |
| **Erro**   | -30    | Penalidade e quebra o combo     |
| **Mínimo** | 0      | A pontuação nunca fica negativa |

### Como Funciona

1. **Acerto sem combo:** +100 pontos
2. **Acerto com combo:** 100 × multiplicador do combo
3. **Erro:** -30 pontos + quebra o combo atual
4. **Timeout:** -30 pontos + quebra o combo atual

---

## 🔥 Sistema de Combo

O combo é o **número de acertos consecutivos** sem erros. Quanto maior o combo, maior o multiplicador de pontos!

### Níveis de Combo

| Nível         | Acertos Consecutivos | Multiplicador | Nome   |
| ------------- | -------------------- | ------------- | ------ |
| 🟢 **Básico** | 1-2                  | **1.0×**      | BÁSICO |
| 🟡 **Médio**  | 3-4                  | **1.5×**      | MÉDIO  |
| 🟠 **Alto**   | 5-7                  | **2.0×**      | ALTO   |
| 🔴 **Mega**   | 8-10                 | **3.0×**      | MEGA   |

### Exemplos de Combo

```
Acerto #1: 100 × 1.0 = 100 pontos (Básico)
Acerto #2: 100 × 1.0 = 100 pontos (Básico)
Acerto #3: 100 × 1.5 = 150 pontos (Médio) ⬆️
Acerto #4: 100 × 1.5 = 150 pontos (Médio)
Acerto #5: 100 × 2.0 = 200 pontos (Alto) ⬆️⬆️
Acerto #6: 100 × 2.0 = 200 pontos (Alto)
Acerto #7: 100 × 2.0 = 200 pontos (Alto)
Acerto #8: 100 × 3.0 = 300 pontos (Mega) 🔥🔥🔥
```

### Quebra de Combo

❌ **O combo é ZERADO quando:**

- O jogador erra uma classificação
- O tempo de resposta se esgota (timeout)

---

## ⏱️ Bônus de Tempo

Bônus concedido **ao final da fase** baseado no **tempo total** gasto para completar os 10 riscos.

### Tabelas de Bônus

| Categoria        | Tempo Total   | Bônus           | Descrição            |
| ---------------- | ------------- | --------------- | -------------------- |
| 🏆 **Excelente** | ≤ 20 segundos | **+300 pontos** | Extremamente rápido! |
| 🥈 **Bom**       | ≤ 40 segundos | **+200 pontos** | Muito bom tempo      |
| 🥉 **Regular**   | ≤ 60 segundos | **+100 pontos** | Tempo razoável       |
| 📊 **Fraco**     | ≤ 80 segundos | **+50 pontos**  | Precisa melhorar     |
| ❌ **Nenhum**    | > 80 segundos | **0 pontos**    | Muito lento          |

### Exemplos

```
Tempo: 18s → Bônus: +300 pontos (Excelente) 🏆
Tempo: 35s → Bônus: +200 pontos (Bom) 🥈
Tempo: 55s → Bônus: +100 pontos (Regular) 🥉
Tempo: 75s → Bônus: +50 pontos (Fraco) 📊
Tempo: 95s → Bônus: 0 pontos (Nenhum) ❌
```

---

## 🏆 Bônus de Performance

Bônus concedido **ao final da fase** baseado na **quantidade total de acertos** (de 0 a 10).

### Tabelas de Bônus

| Categoria        | Acertos | Bônus           | Descrição              |
| ---------------- | ------- | --------------- | ---------------------- |
| 💯 **Perfeito**  | 10/10   | **+500 pontos** | Performance impecável! |
| ⭐ **Excelente** | 8-9/10  | **+250 pontos** | Muito bem!             |
| ✅ **Bom**       | 6-7/10  | **+100 pontos** | Bom desempenho         |
| ❌ **Fraco**     | 0-5/10  | **0 pontos**    | Precisa estudar mais   |

### Exemplos

```
10 acertos → Bônus: +500 pontos (Perfeito) 💯
9 acertos  → Bônus: +250 pontos (Excelente) ⭐
8 acertos  → Bônus: +250 pontos (Excelente) ⭐
7 acertos  → Bônus: +100 pontos (Bom) ✅
6 acertos  → Bônus: +100 pontos (Bom) ✅
5 acertos  → Bônus: 0 pontos (Fraco) ❌
```

---

## 🧮 Cálculo Final da Fase

### Fórmula

```
PONTUAÇÃO TOTAL = Pontos Base + Bônus de Tempo + Bônus de Performance
```

Onde:

- **Pontos Base** = Soma de todos os pontos ganhos/perdidos durante as 10 tentativas (já incluindo multiplicadores de combo)
- **Bônus de Tempo** = Baseado no tempo total da fase
- **Bônus de Performance** = Baseado no total de acertos

### Componentes Detalhados

```typescript
interface PhaseScore {
  basePoints: number; // Pontos base (acertos/erros com combos)
  comboBonus: number; // DEPRECATED (já incluído no basePoints)
  timeBonus: number; // Bônus de tempo
  performanceBonus: number; // Bônus de performance
  totalPoints: number; // TOTAL FINAL
  correctCount: number; // Total de acertos (0-10)
  errorCount: number; // Total de erros
  totalTime: number; // Tempo total em segundos
  attempts: RiskAttempt[]; // Histórico das 10 tentativas
}
```

---

## 🎮 Exemplos Práticos

### Exemplo 1: Performance Perfeita 🏆

**Cenário:**

- 10 acertos consecutivos (combo máximo!)
- Tempo total: 25 segundos
- Sem erros

**Cálculo Detalhado:**

| Tentativa  | Combo | Multiplicador | Pontos | Pontos Acumulados |
| ---------- | ----- | ------------- | ------ | ----------------- |
| Acerto #1  | 1     | 1.0×          | 100    | 100               |
| Acerto #2  | 2     | 1.0×          | 100    | 200               |
| Acerto #3  | 3     | 1.5×          | 150    | 350               |
| Acerto #4  | 4     | 1.5×          | 150    | 500               |
| Acerto #5  | 5     | 2.0×          | 200    | 700               |
| Acerto #6  | 6     | 2.0×          | 200    | 900               |
| Acerto #7  | 7     | 2.0×          | 200    | 1100              |
| Acerto #8  | 8     | 3.0×          | 300    | 1400              |
| Acerto #9  | 9     | 3.0×          | 300    | 1700              |
| Acerto #10 | 10    | 3.0×          | 300    | 2000              |

**Bônus:**

- **Pontos Base:** 2000
- **Bônus de Tempo (25s):** +200 (Bom)
- **Bônus de Performance (10 acertos):** +500 (Perfeito)

**Pontuação Final:** **2700 pontos** 🎉

---

### Exemplo 2: Boa Performance com 1 Erro

**Cenário:**

- 9 acertos, 1 erro
- Erro na tentativa #5
- Tempo total: 45 segundos

**Cálculo Detalhado:**

| Tentativa | Resultado | Combo | Multiplicador | Pontos  | Pontos Acumulados |
| --------- | --------- | ----- | ------------- | ------- | ----------------- |
| #1        | Acerto    | 1     | 1.0×          | +100    | 100               |
| #2        | Acerto    | 2     | 1.0×          | +100    | 200               |
| #3        | Acerto    | 3     | 1.5×          | +150    | 350               |
| #4        | Acerto    | 4     | 1.5×          | +150    | 500               |
| #5        | **ERRO**  | 0     | —             | **-30** | **470** ❌        |
| #6        | Acerto    | 1     | 1.0×          | +100    | 570               |
| #7        | Acerto    | 2     | 1.0×          | +100    | 670               |
| #8        | Acerto    | 3     | 1.5×          | +150    | 820               |
| #9        | Acerto    | 4     | 1.5×          | +150    | 970               |
| #10       | Acerto    | 5     | 2.0×          | +200    | 1170              |

**Bônus:**

- **Pontos Base:** 1170
- **Bônus de Tempo (45s):** +100 (Regular)
- **Bônus de Performance (9 acertos):** +250 (Excelente)

**Pontuação Final:** **1520 pontos**

---

### Exemplo 3: Performance Média

**Cenário:**

- 6 acertos, 4 erros
- Erros nas tentativas #2, #4, #7, #9
- Tempo total: 70 segundos

**Cálculo Detalhado:**

| Tentativa | Resultado | Combo | Multiplicador | Pontos | Pontos Acumulados |
| --------- | --------- | ----- | ------------- | ------ | ----------------- |
| #1        | Acerto    | 1     | 1.0×          | +100   | 100               |
| #2        | **ERRO**  | 0     | —             | -30    | 70 ❌             |
| #3        | Acerto    | 1     | 1.0×          | +100   | 170               |
| #4        | **ERRO**  | 0     | —             | -30    | 140 ❌            |
| #5        | Acerto    | 1     | 1.0×          | +100   | 240               |
| #6        | Acerto    | 2     | 1.0×          | +100   | 340               |
| #7        | **ERRO**  | 0     | —             | -30    | 310 ❌            |
| #8        | Acerto    | 1     | 1.0×          | +100   | 410               |
| #9        | **ERRO**  | 0     | —             | -30    | 380 ❌            |
| #10       | Acerto    | 1     | 1.0×          | +100   | 480               |

**Bônus:**

- **Pontos Base:** 480
- **Bônus de Tempo (70s):** +50 (Fraco)
- **Bônus de Performance (6 acertos):** +100 (Bom)

**Pontuação Final:** **630 pontos**

---

### Exemplo 4: Performance Fraca

**Cenário:**

- 4 acertos, 6 erros
- Tempo total: 90 segundos (muito lento)

**Cálculo Detalhado:**

| Tentativa | Resultado | Combo | Multiplicador | Pontos | Pontos Acumulados |
| --------- | --------- | ----- | ------------- | ------ | ----------------- |
| #1        | **ERRO**  | 0     | —             | -30    | 0 (mínimo) ❌     |
| #2        | Acerto    | 1     | 1.0×          | +100   | 100               |
| #3        | **ERRO**  | 0     | —             | -30    | 70 ❌             |
| #4        | **ERRO**  | 0     | —             | -30    | 40 ❌             |
| #5        | Acerto    | 1     | 1.0×          | +100   | 140               |
| #6        | Acerto    | 2     | 1.0×          | +100   | 240               |
| #7        | **ERRO**  | 0     | —             | -30    | 210 ❌            |
| #8        | **ERRO**  | 0     | —             | -30    | 180 ❌            |
| #9        | Acerto    | 1     | 1.0×          | +100   | 280               |
| #10       | **ERRO**  | 0     | —             | -30    | 250 ❌            |

**Bônus:**

- **Pontos Base:** 250
- **Bônus de Tempo (90s):** 0 (Nenhum)
- **Bônus de Performance (4 acertos):** 0 (Fraco)

**Pontuação Final:** **250 pontos**

---

## 📊 Estrutura de Dados

### Interface RiskAttempt

Armazena cada tentativa individual:

```typescript
interface RiskAttempt {
  correct: boolean; // Se acertou ou errou
  timeSpent: number; // Tempo em segundos nesta jogada
  pointsEarned: number; // Pontos ganhos/perdidos
  comboMultiplier: number; // Multiplicador do combo usado
}
```

**Exemplo:**

```typescript
{
  correct: true,
  timeSpent: 3.5,
  pointsEarned: 300,        // 100 × 3.0 (Mega Combo)
  comboMultiplier: 3.0
}
```

---

### Interface PhaseScore

Resultado final de uma fase:

```typescript
interface PhaseScore {
  basePoints: number; // Pontos base (soma de todos os attempts)
  comboBonus: number; // DEPRECATED (sempre 0)
  timeBonus: number; // Bônus por tempo
  performanceBonus: number; // Bônus por acertos
  totalPoints: number; // SOMA FINAL
  correctCount: number; // Total de acertos (0-10)
  errorCount: number; // Total de erros (0-10)
  totalTime: number; // Tempo total em segundos
  attempts: RiskAttempt[]; // Array com as 10 tentativas
}
```

**Exemplo:**

```typescript
{
  basePoints: 2000,
  comboBonus: 0,
  timeBonus: 200,
  performanceBonus: 500,
  totalPoints: 2700,
  correctCount: 10,
  errorCount: 0,
  totalTime: 25,
  attempts: [/* 10 RiskAttempt objects */]
}
```

---

### Interface GameScore

Pontuação de todas as 3 fases:

```typescript
interface GameScore {
  phase1: PhaseScore | null;
  phase2: PhaseScore | null;
  phase3: PhaseScore | null;
  grandTotal: number; // Soma das 3 fases
}
```

**Exemplo:**

```typescript
{
  phase1: { totalPoints: 2700, ... },
  phase2: { totalPoints: 1850, ... },
  phase3: { totalPoints: 2100, ... },
  grandTotal: 6650
}
```

---

## 🎯 Estratégias para Maximizar Pontos

### 1. 🔥 Mantenha o Combo!

- **Evite erros** a todo custo nos primeiros acertos
- A partir do **8º acerto consecutivo**, cada acerto vale **300 pontos**!
- Um erro no meio quebra todo o multiplicador

### 2. ⚡ Seja Rápido!

- Tente completar em **menos de 20 segundos** para ganhar +300 pontos
- Cada segundo conta!
- Mas não sacrifique precisão por velocidade

### 3. 🎯 Foque em Acertos

- **10 acertos** = +500 pontos de bônus
- **8-9 acertos** = +250 pontos de bônus
- A diferença entre 9 e 10 acertos é de **+250 pontos**!

### 4. 📈 Comparação de Estratégias

| Estratégia            | Acertos | Tempo | Pontos Base | Bônus Tempo | Bônus Perf. | **TOTAL**    |
| --------------------- | ------- | ----- | ----------- | ----------- | ----------- | ------------ |
| **Perfeito Rápido**   | 10      | 18s   | ~2000       | +300        | +500        | **~2800** 🏆 |
| **Perfeito Lento**    | 10      | 65s   | ~2000       | +100        | +500        | **~2600**    |
| **Rápido com Erros**  | 7       | 15s   | ~900        | +300        | +100        | **~1300**    |
| **Médio Equilibrado** | 8       | 35s   | ~1300       | +200        | +250        | **~1750**    |

---

## 🏆 Ranking e Classificação

O jogo salva as **melhores pontuações** em um ranking local. Os 3 melhores jogadores recebem destaque especial:

| Posição         | Medalha           | Recompensa Visual                        |
| --------------- | ----------------- | ---------------------------------------- |
| 🥇 **1º Lugar** | Troféu de Ouro    | Confete dourado + Título "CAMPEÃO"       |
| 🥈 **2º Lugar** | Medalha de Prata  | Confete prateado + Título "VICE-CAMPEÃO" |
| 🥉 **3º Lugar** | Medalha de Bronze | Confete bronze + Título "3º LUGAR"       |

---

## 💡 Dicas Finais

1. **Estude as categorias** antes de jogar para evitar erros
2. **Pratique a Fase 1** para pegar o jeito sem pressão
3. **Mantenha o foco** para não quebrar o combo
4. **Equilibre velocidade e precisão** - não adianta ser rápido e errar tudo
5. **10 acertos perfeitos** podem render mais de **2700 pontos**!

---

## 📝 Notas Técnicas

- A pontuação **nunca fica negativa** (mínimo é 0)
- O `comboBonus` no `PhaseScore` é **deprecated** (sempre 0), pois os multiplicadores já estão aplicados no `basePoints`
- Cada fase tem exatamente **10 riscos** a serem classificados
- O tempo é medido em **segundos**
- Todas as funções de cálculo estão em `client/src/types/scoring.ts`

---

**Desenvolvido para o Jogo Missão Prevenção - SIPAT** 🎮🛡️
