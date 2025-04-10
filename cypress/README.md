# Testes End-to-End com Cypress

Este diretório contém testes end-to-end (E2E) para a Aplicação Emergy usando o framework Cypress.

## Estrutura de Diretórios

```
cypress/
├── e2e/                  # Arquivos de teste
│   ├── main_page.cy.js   # Testes para a página principal
│   ├── emergy_calculator.cy.js # Testes para a calculadora Emergy
│   ├── graphics.cy.js    # Testes para a página de gráficos
│   └── navigation.cy.js  # Testes para navegação entre páginas
├── fixtures/             # Arquivos de dados para testes
│   ├── sample.csv        # Arquivo CSV de exemplo
│   └── test.txt          # Arquivo de texto para testar validação
└── support/              # Arquivos de suporte
    ├── commands.js       # Comandos personalizados do Cypress
    └── e2e.js            # Configuração para testes E2E
```

## Comandos Personalizados

Os seguintes comandos personalizados estão disponíveis para uso nos testes:

- `cy.attachFile()`: Simula o upload de um arquivo
- `cy.menuShouldBeOpen()`: Verifica se o menu hamburger está aberto
- `cy.menuShouldBeClosed()`: Verifica se o menu hamburger está fechado
- `cy.openMenu()`: Abre o menu hamburger
- `cy.closeMenu()`: Fecha o menu hamburger
- `cy.navigateViaMenu(pageName)`: Navega para uma página através do menu hamburger
- `cy.processCSV(csvContent)`: Simula o processamento de um arquivo CSV

## Executando os Testes

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Instalação

```bash
npm install
```

### Executando os Testes

Para abrir o Cypress Test Runner:

```bash
npm run cypress:open
```

Para executar os testes em modo headless (sem interface gráfica):

```bash
npm run cypress:run
```

Para iniciar o servidor e executar os testes automaticamente:

```bash
npm run test:e2e
```

### Verificando a Configuração dos Testes

Para verificar se os testes Cypress estão configurados corretamente:

No Windows:
```bash
verify_cypress_tests.bat
```

No Linux/macOS:
```bash
chmod +x verify_cypress_tests.sh  # Torna o script executável (apenas na primeira vez)
./verify_cypress_tests.sh
```

Este script irá:
1. Instalar todas as dependências necessárias
2. Verificar se o Cypress está instalado corretamente
3. Executar um teste simples para confirmar que a configuração está funcionando

## Boas Práticas

1. **Seletores Estáveis**: Use seletores de elementos que não mudam com frequência, como IDs e classes específicas.
2. **Testes Independentes**: Cada teste deve ser independente e não depender do estado de outros testes.
3. **Esperas Explícitas**: Use `cy.wait()` apenas quando necessário. Prefira asserções que esperam automaticamente.
4. **Comandos Personalizados**: Crie comandos personalizados para ações repetitivas.
5. **Dados de Teste**: Use fixtures para dados de teste em vez de codificá-los diretamente nos testes.

## Adicionando Novos Testes

Para adicionar novos testes:

1. Crie um novo arquivo `.cy.js` no diretório `cypress/e2e/`
2. Siga o padrão dos testes existentes
3. Use os comandos personalizados quando apropriado
4. Execute os testes para verificar se estão funcionando corretamente

Feito por André Carbonieri Silva T839FC9
