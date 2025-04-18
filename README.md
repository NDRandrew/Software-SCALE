# Aplicação Emergy

Uma aplicação web baseada em Flask para cálculos e visualização de emergy, construída seguindo os princípios de Desenvolvimento Orientado a Testes (TDD), Design Orientado ao Domínio (DDD) e princípios SOLID.

## Estrutura do Projeto

O projeto segue uma abordagem de arquitetura limpa com as seguintes camadas:

- **Camada de Domínio**: Contém a lógica de negócios principal, entidades e interfaces.
- **Camada de Aplicação**: Coordena as tarefas da aplicação e delega trabalho para a camada de domínio.
- **Camada de Infraestrutura**: Implementa as interfaces definidas na camada de domínio.
- **Camada de Apresentação**: Lida com requisições e respostas HTTP, e renderiza a interface do usuário.

```
.
├── app.py                  # Ponto de entrada principal da aplicação
├── domain/                 # Camada de domínio
│   ├── models/             # Entidades de domínio
│   ├── repositories/       # Interfaces de repositório
│   └── services/           # Serviços de domínio
├── application/            # Camada de aplicação
│   └── services/           # Serviços de aplicação
├── infrastructure/         # Camada de infraestrutura
│   └── repositories/       # Implementações de repositório
├── presentation/           # Camada de apresentação
│   ├── controllers/        # Controladores web
│   └── forms/              # Definições de formulários
├── static/                 # Ativos estáticos
│   ├── css/                # Arquivos CSS
│   ├── js/                 # Arquivos JavaScript
│   └── images/             # Arquivos de imagem
├── templates/              # Templates HTML
└── tests/                  # Suite de testes
    ├── unit/               # Testes unitários
    ├── integration/        # Testes de integração
    └── functional/         # Testes funcionais
```

## Funcionalidades

- **Página Principal**: Visão geral da aplicação e suas funcionalidades.
- **Calculadora Emergy**: Upload de arquivos CSV para cálculos de emergy.
- **Gráficos**: Visualização dos resultados dos cálculos de emergy.
- **Menu Hamburger**: Navegação entre páginas.

## Princípios de Design

### Design Orientado ao Domínio (DDD)

A aplicação é estruturada em torno do modelo de domínio, com clara separação de responsabilidades entre diferentes camadas. A camada de domínio contém a lógica de negócios principal e é independente de outras camadas.

### Desenvolvimento Orientado a Testes (TDD)

Os testes são escritos antes do código de implementação, garantindo que o código atenda aos requisitos e seja testável.

### Princípios SOLID

- **Princípio da Responsabilidade Única**: Cada classe tem uma única responsabilidade.
- **Princípio Aberto/Fechado**: Classes são abertas para extensão, mas fechadas para modificação.
- **Princípio da Substituição de Liskov**: Subtipos podem ser substituídos por seus tipos base.
- **Princípio da Segregação de Interface**: Clientes não devem ser forçados a depender de interfaces que não utilizam.
- **Princípio da Inversão de Dependência**: Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

## Começando

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/aplicacao-emergy.git
   cd aplicacao-emergy
   ```

2. Crie um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

### Executando a Aplicação

```bash
python app.py
```

A aplicação estará disponível em http://localhost:5000.

### Executando Testes

```bash
pytest
```

## Testes

### Testes Unitários

Os testes unitários são escritos usando o framework unittest do Python e seguem a abordagem TDD (Test-Driven Development). Eles verificam o comportamento das classes e funções individuais.

Para executar os testes unitários:

```bash
python run_tests.py
```

### Testes End-to-End com Cypress

A aplicação inclui testes end-to-end usando Cypress para verificar a funcionalidade da interface do usuário e a integração entre os componentes.

#### Pré-requisitos para Testes E2E

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

#### Instalação das Dependências do Cypress

```bash
npm install
```

#### Executando os Testes Cypress

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

Também fornecemos scripts para facilitar a execução dos testes:

No Windows:
```bash
run_cypress_tests.bat
```

No Linux/macOS:
```bash
chmod +x run_cypress_tests.sh  # Torna o script executável (apenas na primeira vez)
./run_cypress_tests.sh
```

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

#### Estrutura dos Testes Cypress

Os testes Cypress estão organizados da seguinte forma:

- `cypress/e2e/main_page.cy.js`: Testes para a página principal
- `cypress/e2e/emergy_calculator.cy.js`: Testes para a calculadora Emergy
- `cypress/e2e/graphics.cy.js`: Testes para a página de gráficos
- `cypress/e2e/navigation.cy.js`: Testes para navegação entre páginas

## Melhorias Futuras

- Implementar persistência em banco de dados para cálculos de emergy
- Adicionar autenticação e autorização de usuários
- Aprimorar o algoritmo de cálculo de emergy
- Melhorar as capacidades de visualização
- Adicionar funcionalidade de exportação para resultados de cálculos
- Expandir a cobertura de testes automatizados


Feito por ndrAndré Carbonieri Silva T839FC9, JOAn, KEVEN, Pedro MAIffra, HugoN
