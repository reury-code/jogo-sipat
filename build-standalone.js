import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STANDALONE_DIR = path.join(__dirname, "standalone");
const DIST_DIR = path.join(__dirname, "dist");

console.log("🚀 Criando versão standalone...\n");

// 1. Limpar diretório standalone
if (fs.existsSync(STANDALONE_DIR)) {
  console.log("📦 Limpando diretório standalone...");
  fs.rmSync(STANDALONE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STANDALONE_DIR, { recursive: true });

// 2. Build do projeto
console.log("🔨 Compilando projeto...");
try {
  execSync("pnpm run build", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Erro ao compilar projeto");
  process.exit(1);
}

// 3. Copiar arquivos compilados
console.log("📋 Copiando arquivos...");
fs.cpSync(path.join(DIST_DIR, "public"), path.join(STANDALONE_DIR, "public"), {
  recursive: true,
});
fs.cpSync(
  path.join(DIST_DIR, "index.js"),
  path.join(STANDALONE_DIR, "server.js")
);

// 4. Criar package.json mínimo
const minimalPackage = {
  name: "missao-prevencao-standalone",
  version: "1.0.0",
  type: "module",
  main: "server.js",
  scripts: {
    start: "node server.js",
  },
  dependencies: {
    express: "^4.21.2",
  },
};

fs.writeFileSync(
  path.join(STANDALONE_DIR, "package.json"),
  JSON.stringify(minimalPackage, null, 2)
);

// 5. Instalar apenas dependências de produção
console.log("📦 Instalando dependências de produção...");
try {
  execSync("pnpm install --prod --no-optional", {
    cwd: STANDALONE_DIR,
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Erro ao instalar dependências");
  process.exit(1);
}

// 6. Criar script de inicialização para Windows
const startBat = `@echo off
title Missao Prevencao - SIPAT
echo.
echo ========================================
echo   MISSAO PREVENCAO - SIPAT
echo ========================================
echo.
echo Iniciando servidor...
echo.

node server.js

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao iniciar o servidor!
    echo.
    pause
    exit /b 1
)
`;

fs.writeFileSync(path.join(STANDALONE_DIR, "INICIAR.bat"), startBat);

// 7. Criar arquivo README
const readme = `# Missão Prevenção - SIPAT (Versão Standalone)

## Como executar (OPÇÃO 1 - Recomendada se puder baixar Node.js portátil)

### Primeira vez - Configuração:

1. Baixe o Node.js portátil:
   - Acesse: https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip
   - Extraia o conteúdo na pasta "nodejs" dentro desta pasta standalone

2. A estrutura deve ficar assim:
   \`\`\`
   standalone/
   ├── nodejs/
   │   ├── node.exe
   │   └── ...
   ├── node_modules/
   ├── public/
   ├── server.js
   ├── INICIAR.bat
   └── package.json
   \`\`\`

3. Clique duas vezes em \`INICIAR.bat\`

4. Abra o navegador e acesse: http://localhost:3000

### Para fechar:
- Feche a janela do terminal (CMD)

---

## Como executar (OPÇÃO 2 - Se não puder baixar nada)

Neste caso, você precisará gerar um executável único com tudo embutido.
Veja o arquivo BUILD_EXECUTABLE.md para instruções.

---

## Observações:

- O jogo roda completamente offline
- Não precisa de internet após a configuração inicial
- Os dados ficam salvos no navegador
- Para compartilhar, copie toda a pasta "standalone"
`;

fs.writeFileSync(path.join(STANDALONE_DIR, "README.md"), readme);

// 8. Criar script .bat melhorado que procura Node.js
const smartBat = `@echo off
setlocal EnableDelayedExpansion

title Missao Prevencao - SIPAT
cls
echo.
echo ========================================
echo   MISSAO PREVENCAO - SIPAT
echo ========================================
echo.

REM Procurar Node.js na pasta local
if exist "%~dp0nodejs\\node.exe" (
    echo [OK] Node.js portatil encontrado!
    set "NODE_PATH=%~dp0nodejs\\node.exe"
    goto :run
)

REM Procurar Node.js no PATH do sistema
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js do sistema encontrado!
    set "NODE_PATH=node"
    goto :run
)

REM Node.js não encontrado
echo [ERRO] Node.js nao encontrado!
echo.
echo Para executar este jogo, voce precisa de uma das opcoes:
echo.
echo OPCAO 1 - Node.js Portatil (Recomendado):
echo   1. Baixe: https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip
echo   2. Extraia o conteudo na pasta "nodejs" aqui dentro
echo   3. Execute este arquivo novamente
echo.
echo OPCAO 2 - Node.js Instalado:
echo   1. Instale o Node.js do site: https://nodejs.org/
echo   2. Execute este arquivo novamente
echo.
pause
exit /b 1

:run
echo.
echo Iniciando servidor...
echo.
echo Apos iniciar, abra seu navegador em: http://localhost:3000
echo.
echo Para fechar o servidor, feche esta janela.
echo.
echo ========================================
echo.

"%NODE_PATH%" server.js

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao iniciar o servidor!
    echo.
    pause
    exit /b 1
)
`;

fs.writeFileSync(path.join(STANDALONE_DIR, "INICIAR.bat"), smartBat);

console.log("\n✅ Versão standalone criada com sucesso!");
console.log(`📁 Localização: ${STANDALONE_DIR}`);
console.log("\n📖 Próximos passos:");
console.log("1. Leia o arquivo README.md na pasta standalone");
console.log("2. Baixe o Node.js portátil (link no README)");
console.log("3. Execute INICIAR.bat\n");
