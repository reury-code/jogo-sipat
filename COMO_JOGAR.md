# 🎮 Tela "COMO JOGAR" - Documentação

## 📋 Visão Geral

A tela "COMO JOGAR" foi implementada seguindo o design visual do jogo, oferecendo um tutorial completo e intuitivo para os jogadores aprenderem sobre:

- ✅ Controles e mecânicas do jogo
- 📚 Os 5 grupos de riscos (cores e categorias)
- 💡 Dicas e macetes para memorização

---

## 🎨 Design e Estilo Visual

### Características Principais:

- **Identidade Visual**: Mantém o mesmo gradiente roxo/rosa/azul do jogo
- **Tipografia**: Utiliza `font-game-title` e `font-game-body` para consistência
- **Efeitos 3D**: Cards com classe `card-3d` e `btn-3d`
- **Animações**:
  - `animate-pulse-soft` para elementos pulsantes
  - `animate-fade-in` para transições suaves entre abas
  - `animate-bounce-soft` para ícones
- **Responsivo**: Funciona em desktop e mobile

---

## 📱 Estrutura da Interface

### 1. **Header Fixo**

- Botão "← VOLTAR" (esquerda)
- Título "COMO JOGAR" (centro)
- Botão "× FECHAR" (direita)
- Background com gradiente roxo

### 2. **Sistema de Abas** (Sticky)

Três abas principais:

- 🎮 **CONTROLES**: Como jogar, objetivo, teclas
- 📚 **GRUPOS**: Os 5 grupos de riscos detalhados
- 💡 **DICAS**: Macetes, tabela rápida e estratégias

### 3. **Conteúdo Scrollável**

- Cards informativos com bordas arredondadas
- Ícones grandes (emojis 48-72px)
- Texto hierarquizado (títulos, subtítulos, corpo)
- Exemplos práticos e visuais

### 4. **Footer com CTA**

- Botão principal: "✅ ENTENDI - JOGAR!" (verde)
- Link secundário: "← Voltar para o Menu"

---

## 🎯 Conteúdo das Abas

### **ABA 1: CONTROLES** 🎮

#### Resumo Ultra Simples (Topo)

Card roxo destacado com 4 passos básicos:

1. Risco cai do topo
2. Você move com ← →
3. Coloca na cor certa
4. Ganha pontos! ⭐

#### Seções:

1. **Objetivo do Jogo** 🎯
   - Explicação clara da missão
   - Destaque para "acerte todos"

2. **Como Funciona** ⚙️
   - 4 passos numerados (1️⃣ 2️⃣ 3️⃣ 4️⃣)
   - Cores alternadas nos cards

3. **Controles do Teclado** ⌨️
   - Teclas estilizadas (←, →, ↓, ESPAÇO)
   - Visual de botão 3D para cada tecla

4. **Pontuação** 💯
   - Sistema de pontos (+10, -5)
   - Combos e bônus
   - Meta: 10 riscos corretos

---

### **ABA 2: GRUPOS** 📚

Accordion expansível com os 5 grupos de riscos:

#### 🟢 **GRUPO I - VERDE** (Riscos Físicos)

- **Cor**: Verde (#22c55e)
- **Dica**: "Bate, corta, queima ou faz barulho"
- **Exemplos**: Ruído, vibrações, calor, radiações
- **Pergunta-chave**: "Posso me machucar fisicamente?"

#### 🔴 **GRUPO II - VERMELHO** (Riscos Químicos)

- **Cor**: Vermelho (#ef4444)
- **Dica**: "Cheira, tem fumaça ou é produto"
- **Exemplos**: Poeiras, fumos, gases, vapores
- **Pergunta-chave**: "Posso inalar ou tocar e faz mal?"

#### 🟤 **GRUPO III - MARROM** (Riscos Biológicos)

- **Cor**: Marrom/Âmbar (#b45309)
- **Dica**: "É vivo e pode contaminar"
- **Exemplos**: Vírus, bactérias, fungos, parasitas
- **Pergunta-chave**: "É organismo vivo que contamina?"

#### 🟡 **GRUPO IV - AMARELO** (Riscos Ergonômicos)

- **Cor**: Amarelo (#eab308)
- **Dica**: "Cansa o corpo ou estressa"
- **Exemplos**: Esforço físico, postura, repetição
- **Pergunta-chave**: "Cansa meu corpo ou causa estresse?"

#### 🔵 **GRUPO V - AZUL** (Riscos de Acidentes)

- **Cor**: Azul (#3b82f6)
- **Dica**: "Pode dar acidente agora!"
- **Exemplos**: Fogo, choque, quedas, máquinas
- **Pergunta-chave**: "Pode causar acidente sério agora?"

**Estrutura de cada card:**

- 📖 O QUE SÃO?
- 💡 DICA PARA LEMBRAR
- 📋 EXEMPLOS (lista com emojis)
- 🎯 PENSE ASSIM (pergunta-chave)

---

### **ABA 3: DICAS** 💡

#### 1. **Macetes para Memorizar** 🧠

Cards coloridos (um por grupo) com:

- Emoji do grupo
- Frase mnemônica
- Conceito-chave

#### 2. **Tabela Rápida** 📊

Tabela de referência:
| PALAVRA-CHAVE | COR |
|---------------|-----|
| Ruído, Calor | 🟢 VERDE |
| Gases, Fumos | 🔴 VERMELHO |
| Vírus, Fungos | 🟤 MARROM |
| Postura, Peso | 🟡 AMARELO |
| Fogo, Choque | 🔵 AZUL |

#### 3. **Dicas Pro** 🎮

5 estratégias numeradas:

1. 👀 Leia rápido a palavra-chave
2. 🎯 Use o tempo da queda para pensar
3. 🔥 Faça combos
4. 📖 Jogue Fase 1 primeiro
5. 🧠 Lembre das cores da Fase 1

---

## 🔧 Implementação Técnica

### Arquivos Criados/Modificados:

1. **`client/src/pages/HowToPlay.tsx`** ✨ NOVO
   - Componente principal da tela
   - Props: `onClose`, `onStartGame`
   - Estado: `activeTab` (controles | grupos | dicas)

2. **`client/src/pages/PhaseSelection.tsx`** 📝 MODIFICADO
   - Adicionado botão "COMO JOGAR" destacado
   - Gerenciamento do estado `howToPlayOpen`
   - Integração com componente `HowToPlay`

3. **`client/src/index.css`** 📝 MODIFICADO
   - Adicionada animação `fade-in` para transições

### Componentes Utilizados:

- `Accordion` (Radix UI) - Para cards expansíveis dos grupos
- `Button` (Shadcn UI) - Botões de ação
- `lucide-react` - Ícones (ArrowLeft, X, Gamepad2, BookOpen, Lightbulb, etc)

---

## 🎮 Fluxo de Uso

```
TELA DE SELEÇÃO DE FASES
         ↓
   [Clica "COMO JOGAR"]
         ↓
MODAL "COMO JOGAR" ABRE
         ↓
   Navega pelas Abas:
   - Controles
   - Grupos
   - Dicas
         ↓
[Clica "ENTENDI - JOGAR!"]
         ↓
INICIA FASE 1 AUTOMATICAMENTE
```

---

## 🎨 Classes CSS Customizadas

```css
/* Efeitos 3D */
.btn-3d          /* Botões com efeito pressionável */
.card-3d         /* Cards com sombra e profundidade */

/* Animações */
.animate-pulse-soft   /* Pulso suave (2s) */
.animate-bounce-soft  /* Bounce suave (1.5s) */
.animate-fade-in      /* Fade in com translateY */

/* Tipografia do Jogo */
.font-game-title /* Títulos (Hamberger/Lilita One) */
.font-game-body  /* Corpo de texto */
.text-stroke-sm  /* Contorno de texto */
```

---

## 📱 Responsividade

### Desktop (> 768px):

- Conteúdo centralizado (max-width: 900px)
- 3 abas horizontais visíveis
- Textos maiores (18-24px)

### Mobile (< 768px):

- Abas mostram apenas ícones
- Cards ocupam 100% largura
- Fonte reduzida (16px base)
- Padding reduzido (16px)

---

## ✨ Destaques Visuais

### Cores dos Grupos (Consistência):

```javascript
Verde    (Físico):      from-green-400 to-green-600
Vermelho (Químico):     from-red-400 to-red-600
Marrom   (Biológico):   from-amber-700 to-amber-900
Amarelo  (Ergonômico):  from-yellow-400 to-yellow-600
Azul     (Acidentes):   from-blue-400 to-blue-600
```

### Bordas:

- Todos os cards: `border-4`
- Cor da borda: cor primária mais clara (+200)

---

## 🚀 Funcionalidades Futuras (Opcional)

- [ ] Badge "NOVO" se primeira vez acessando
- [ ] GIFs/animações dos riscos caindo
- [ ] Progress bar de leitura
- [ ] Botão "Baixar Guia PDF"
- [ ] Tooltips ao passar mouse em palavras-chave
- [ ] Som de "click" nos botões

---

## 🎯 Objetivos Pedagógicos Alcançados

✅ **Clareza**: Linguagem simples e direta  
✅ **Visual**: Cores, ícones e hierarquia clara  
✅ **Memorização**: Macetes e frases mnemônicas  
✅ **Prática**: Dicas de estratégia para o jogo  
✅ **Acessibilidade**: Informação organizada e fácil de navegar

---

## 📞 Uso no Código

```tsx
import HowToPlay from "./pages/HowToPlay";

// Exemplo de uso:
<HowToPlay
  onClose={() => setShowTutorial(false)}
  onStartGame={() => {
    setShowTutorial(false);
    startPhase(1); // Inicia Fase 1
  }}
/>;
```

---

**Desenvolvido com 💜 seguindo o design do Jogo Missão Prevenção**
