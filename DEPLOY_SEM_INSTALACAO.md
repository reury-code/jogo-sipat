# 🎮 GUIA RÁPIDO - Executar em PC sem nada instalado

## ⚡ SOLUÇÃO MAIS RÁPIDA

### Passo 1: Gerar versão standalone

No PC atual (com internet), execute:

```bash
pnpm run build:standalone
```

### Passo 2: Escolha uma opção

---

## 🟢 OPÇÃO A - Node.js Portátil (Recomendada)

**Tamanho total: ~50MB**

### O que fazer AGORA (PC com internet):

1. Execute: `pnpm run build:standalone`

2. Baixe Node.js portátil:
   - Link direto: https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip
   - Extraia na pasta: `standalone/nodejs/`

3. Copie a pasta `standalone` completa para um pendrive

### No PC sem internet:

1. Copie a pasta `standalone` para o desktop
2. Clique duas vezes em `INICIAR.bat`
3. Abra o navegador em: http://localhost:3000

**Estrutura final:**

```
standalone/
├── nodejs/              ← Node.js portátil
│   ├── node.exe
│   └── ...
├── node_modules/       ← Dependências
├── public/             ← Arquivos do jogo
├── server.js           ← Servidor
├── INICIAR.bat         ← CLIQUE AQUI
└── package.json
```

---

## 🔵 OPÇÃO B - Executável Único (.exe)

**Tamanho total: ~50MB (tudo em 1 arquivo + pasta public)**

### O que fazer AGORA (PC com internet):

1. Instale o pkg:

```bash
npm install -g pkg
```

2. Execute:

```bash
pnpm run build:standalone
cd standalone
pkg . --target node20-win-x64 --output MissaoSIPAT.exe
```

3. Copie para pendrive:
   - `MissaoSIPAT.exe`
   - pasta `public/` completa

### No PC sem internet:

1. Copie tudo para uma pasta
2. Clique duas vezes em `MissaoSIPAT.exe`
3. Abra o navegador em: http://localhost:3000

---

## 🟡 OPÇÃO C - HTML Único (Mais limitada)

**Tamanho: ~5MB | Sem servidor | Roda direto no navegador**

### Limitações:

- Sem persistência de dados entre PCs
- Precisa de navegador moderno (Chrome, Edge, Firefox)
- Funcionalidades de multiplayer não funcionarão

### O que fazer:

Vou criar esta versão se você quiser. É só me avisar!

---

## 📊 Comparação das Opções

| Critério        | Node Portátil | .exe único | HTML único      |
| --------------- | ------------- | ---------- | --------------- |
| Facilidade      | ⭐⭐⭐⭐      | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐      |
| Tamanho         | ~50MB         | ~50MB      | ~5MB            |
| Funcionalidades | ✅ Todas      | ✅ Todas   | ⚠️ Limitadas    |
| Multiplayer     | ✅ Sim        | ✅ Sim     | ❌ Não          |
| Salvamento      | ✅ Sim        | ✅ Sim     | ⚠️ Local apenas |

---

## 🚀 COMANDO ÚNICO PARA COMEÇAR

```bash
pnpm run build:standalone
```

Depois escolha a opção A ou B acima!

---

## ❓ Qual você quer?

Responda qual opção prefere:

- **A** - Node.js portátil (mais confiável)
- **B** - Executável .exe único (mais prático)
- **C** - HTML único (mais leve, mas limitado)
