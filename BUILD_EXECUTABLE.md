# Como criar um EXECUTÁVEL ÚNICO (.exe)

Se você não pode nem baixar o Node.js portátil, você pode criar um único arquivo `.exe` que contenha tudo.

## Opção 1: Usando pkg (Recomendado)

### No PC com internet (onde você está agora):

1. Instale o pkg globalmente:

```bash
pnpm add -g pkg
```

2. Execute o script de build standalone:

```bash
node build-standalone.js
```

3. Entre na pasta standalone:

```bash
cd standalone
```

4. Crie o executável:

```bash
pkg . --target node20-win-x64 --output MissaoSIPAT.exe
```

5. Isso criará um arquivo `MissaoSIPAT.exe` que você pode copiar para qualquer PC Windows

6. **IMPORTANTE**: Copie também a pasta `public` junto com o .exe:

```
MissaoSIPAT/
├── MissaoSIPAT.exe
└── public/
    ├── index.html
    └── assets/
```

### No PC sem internet:

1. Copie a pasta `MissaoSIPAT` completa
2. Clique duas vezes em `MissaoSIPAT.exe`
3. Abra o navegador em http://localhost:3000

---

## Opção 2: Usando Electron (App de Desktop)

### Vantagens:

- Interface de aplicativo nativo
- Não precisa abrir navegador manualmente
- Pode criar ícone na área de trabalho

### Passos:

1. Crie um projeto Electron (fornecerei os arquivos se escolher esta opção)
2. Empacote com electron-builder
3. Gere um instalador .exe ou versão portátil

---

## Opção 3: Página HTML única (Mais simples, mas limitada)

Se o jogo não precisar de servidor backend, podemos converter para uma única página HTML que roda direto no navegador.

### Limitações:

- Sem salvamento no servidor
- Tudo no localStorage do navegador
- Precisa de navegador moderno

Quer que eu crie esta versão?

---

## Qual opção você prefere?

Responda com o número da opção que prefere:

1. Executável com pkg (simples, mas precisa da pasta public)
2. App Electron (mais profissional)
3. Página HTML única (mais limitada)
