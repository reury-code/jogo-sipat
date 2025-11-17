# 🎮 Missão Prevenção (SIPAT 2025)

## Visão Geral

**Missão Prevenção** é um jogo educativo 2D desenvolvido para conscientizar sobre riscos ambientais ocupacionais segundo a classificação da SIPAT (Semana Interna de Prevenção de Acidentes do Trabalho) e da Segurança do Trabalho. O jogo foi desenvolvido para ser apresentado em um evento presencial do IFPA – Campus Abaetetuba.

## 🎯 Objetivo do Jogo

O jogador assume o papel de um **agente da prevenção** que deve classificar corretamente os **riscos ocupacionais** que caem do topo da tela, movendo a **caixa de classificação** correta até o local onde o risco vai cair.

## 🧩 Mecânicas Principais

### Controles

- **Setas ← →** ou **A/D**: Mover a caixa de classificação horizontalmente
- **Seta ↓**: Acelerar a queda do risco

### Sistema de Pontuação

- **Acerto**: +100 pontos
- **Erro**: -50 pontos
- **Combo de 3 acertos consecutivos**: +300 bônus
- **Fase concluída sem erros**: Bônus adicional

### Sistema de Energia

A barra de energia diminui com erros:

- **Acerto**: +10% de energia
- **Erro**: -20% de energia
- **Risco não capturado**: -15% de energia
- **Game Over**: Quando a energia chega a 0%

## 🎓 Categorias de Riscos

O jogo apresenta 5 categorias de riscos ocupacionais, cada uma com uma cor específica:

|    Categoria    |     Cor     | Exemplos                                                                                     |
| :-------------: | :---------: | :------------------------------------------------------------------------------------------- |
|   **Físicos**   |  🟩 Verde   | Ruído, Calor, Frio, Vibrações, Pressões, Umidade                                             |
|  **Químicos**   | 🟥 Vermelho | Poeiras, Gases, Vapores, Névoas, Fumos, Neblinas                                             |
| **Biológicos**  |  🟫 Marrom  | Vírus, Bactérias, Fungos, Parasitas, Protozoários, Insetos                                   |
| **Ergonômicos** | 🟨 Amarelo  | Postura Inadequada, Repetitividade, Levantamento de Peso, Ritmo Excessivo, Monotonia, Turnos |
|  **Acidentes**  |   🟦 Azul   | Eletricidade, Máquinas, Quedas, Incêndio, Arranjo Físico, Iluminação                         |

## 🧮 Sistema de Fases

### 🟢 Fase 1 — Iniciante (Fácil)

- **Duração**: 10 riscos
- **Velocidade da queda**: Lenta
- **Dica visual**: Cada risco tem a mesma cor da sua caixa correspondente
- **Objetivo**: Acertar pelo menos 7 riscos para avançar
- **Foco pedagógico**: Associação entre cor e tipo de risco

### 🟡 Fase 2 — Intermediário (Médio)

- **Duração**: 15 riscos
- **Velocidade da queda**: Média
- **Dificuldade**: Os riscos caem sem cor (apenas texto e ícone neutro)
- **Objetivo**: Acertar 10 ou mais riscos
- **Foco pedagógico**: Memorização dos grupos de risco e suas características

### 🔴 Fase 3 — Avançado (Difícil)

- **Duração**: 20 riscos
- **Velocidade da queda**: Alta
- **Dificuldade**: Os riscos são apenas imagens (sem texto)
- **Objetivo**: Completar a fase com sucesso
- **Foco pedagógico**: Reconhecimento visual e tomada rápida de decisão

## 🎨 Elementos Visuais

- **Interface colorida e limpa** com visual semelhante a jogos educativos modernos (flat, vibrante, responsivo)
- **Fundo com tons industriais leves** (cinza, verde-água, amarelo)
- **Tipografia legível** e ícones claros
- **Feedback visual** com mensagens educativas contextuais
- **Animações suaves** para movimento e colisões
- **Barra de energia** com cores indicadoras de status

## 🔊 Feedback Educacional

### Acertos

Quando o jogador acerta, aparece uma mensagem educativa curta:

- "Ótimo! Ruído é um risco físico. Use protetor auricular!"
- "Excelente! Vapores são riscos químicos. Use sempre máscara e ventilação adequada!"

### Erros

Quando o jogador erra, aparece um alerta:

- "Ops! Esse é um risco biológico. Ele pertence à caixa marrom!"
- "Atenção! Calor é um risco físico, e deve ser classificado na cor verde."

## 🏁 Conclusão

Ao concluir as 3 fases, o jogador recebe um **certificado virtual** como "Agente SIPAT 2025" e a mensagem final:

> "Parabéns! Você concluiu a Missão Prevenção e agora é um Agente SIPAT 2025!
> Segurança do Trabalho é um **Direito Humano** — proteja a vida, a saúde e o meio ambiente!"

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Canvas 2D** para renderização do jogo
- **Tailwind CSS 4** para estilo
- **Web Audio API** para efeitos sonoros
- **Vite** como bundler

## 📱 Responsividade

O jogo se adapta automaticamente a diferentes tamanhos de tela, mantendo a jogabilidade em:

- Desktops (1920x1080 e acima)
- Tablets (768px a 1024px)
- Telas menores (com ajuste de escala)

## 📖 Tela "COMO JOGAR"

O jogo possui uma **tela tutorial completa** acessível através do botão destacado **"❓ COMO JOGAR"** na tela de seleção de fases.

### Funcionalidades:

- **3 Abas Interativas**:
  - 🎮 **CONTROLES**: Explicação das mecânicas e controles do jogo
  - 📚 **GRUPOS**: Detalhes dos 5 grupos de riscos com exemplos e dicas
  - 💡 **DICAS**: Macetes para memorização e estratégias de jogo

- **Design Visual**: Segue o mesmo estilo do jogo com gradientes, efeitos 3D e animações
- **Accordion Expansível**: Cards dos grupos podem ser expandidos para ver detalhes
- **CTA Direto**: Botão "ENTENDI - JOGAR!" inicia automaticamente a Fase 1

Para mais detalhes técnicos, consulte [`COMO_JOGAR.md`](./COMO_JOGAR.md).

## 🎮 Como Jogar

1. Acesse o jogo e escolha uma fase no menu inicial
2. **[NOVO]** Clique em "❓ COMO JOGAR" para acessar o tutorial completo
3. Use as setas do teclado para mover a caixa de classificação
4. Posicione a caixa correta sob o risco que está caindo
5. Ganhe pontos ao acertar e perca energia ao errar
6. Complete as 3 fases para se tornar um Agente SIPAT 2025!

---

**Desenvolvido para o evento SIPAT 2025 — IFPA Campus Abaetetuba**
