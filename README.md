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
- **Calculadora Emergy**: Upload de arquivos TXT para cálculos de emergy.
- **Gráficos**: Visualização dos resultados dos cálculos de emergy.
- **Menu Hamburger**: Navegação entre páginas com funcionalidade de abrir/fechar ao clicar no ícone, no botão X ou fora do menu.

### Processamento de Dados de Consumo de Energia

A aplicação agora suporta o processamento de dados de consumo de energia a partir de arquivos TXT. Esta funcionalidade permite:

- **Upload de Arquivos TXT**: Carregue arquivos TXT contendo dados de consumo de energia no formato específico.
- **Processamento de Dados**: Análise automática dos dados para extrair informações relevantes sobre consumo de energia.
- **Visualização Gráfica**: Visualize os dados processados em diferentes tipos de gráficos:
  - Gráficos de linha para mostrar tendências de consumo ao longo do tempo
  - Gráficos de barras para comparar diferentes medições
  - Gráficos de pizza para visualizar a distribuição do consumo

#### Formato dos Dados

O arquivo TXT deve seguir o seguinte formato (valores separados por ponto e vírgula):

```
Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3
16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000
```

Onde:
- **Date**: Data da medição (DD/MM/AAAA)
- **Time**: Hora da medição (HH:MM:SS)
- **Global_active_power**: Potência ativa global (kilowatts)
- **Global_reactive_power**: Potência reativa global (kilowatts)
- **Voltage**: Tensão (volts)
- **Global_intensity**: Intensidade global (amperes)
- **Sub_metering_1**: Energia ativa sub-medição 1 (watt-hora) - Cozinha
- **Sub_metering_2**: Energia ativa sub-medição 2 (watt-hora) - Lavanderia
- **Sub_metering_3**: Energia ativa sub-medição 3 (watt-hora) - Aquecedor de água e ar-condicionado

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
- Implementar análise preditiva para dados de consumo de energia
- Adicionar mais tipos de visualizações para análise de dados
- Permitir que o usuario faça upload de arquivos .csv e .xls



## Melhorias Recentes

### Integração entre Calculadora Emergy e Visualização de Gráficos

- **Upload e Redirecionamento Automático**: Agora ao fazer upload de um arquivo na página "Emergy Calculator", o usuário é automaticamente redirecionado para a página "Gráficos" onde os dados são visualizados.
- **Remoção da Seção de Resultados**: A seção de resultados na página da calculadora foi removida, simplificando a interface.
- **Processamento de Dados via SessionStorage**: Os dados do arquivo são transferidos entre páginas usando sessionStorage, permitindo uma experiência mais fluida.

### Melhorias na Visualização de Gráficos

- **Layout Vertical Otimizado**: Os gráficos de séries temporais agora são exibidos um abaixo do outro, ocupando toda a largura da área de visualização.
- **Tamanho Aumentado dos Gráficos**: Cada gráfico agora tem 500px de altura para melhor visualização de grandes conjuntos de dados.
- **Configuração Padrão do Gráfico de Dispersão**: O eixo X é definido como Global_intensity e o eixo Y como Global_active_power.
- **Seleção de Intervalo de Tempo**: Adicionados controles para selecionar o intervalo de tempo a ser visualizado nos gráficos de séries temporais.
- **Resumo de Dados em Seção Separada**: O resumo dos dados agora é exibido em uma seção dedicada abaixo dos gráficos.
- **Tradução para Português**: Todos os comentários no código e elementos da interface foram traduzidos para português brasileiro.

### Arquivos Modificados

- `templates/emergy_calculator.html`: Atualizado para remover a seção de resultados e modificar o formulário de upload.
- `static/js/emergy_calculator.js`: Modificado para processar o arquivo e redirecionar para a página de gráficos.
- `static/js/graphics.js`: Atualizado para carregar dados do sessionStorage e melhorar a visualização dos gráficos.
- `templates/graphics.html`: Modificado para melhorar o layout e a organização dos elementos.

## Atualizações de UI/UX - Maio 2025

### Fonte Personalizada

- **Implementação da Fonte TT Firs Neue**: Adicionamos a fonte TT Firs Neue em todo o site para uma aparência mais moderna e profissional.
- **Múltiplos Estilos de Fonte**: Incluímos diferentes pesos e estilos da fonte (regular, bold, italic, light, medium) para uma hierarquia visual adequada.

### Tradução para Português Brasileiro

- **Interface Completamente em Português**: Todos os textos da interface foram traduzidos para português brasileiro, incluindo botões, mensagens e instruções.
- **Consistência Linguística**: Mantivemos uma terminologia consistente em toda a aplicação para melhorar a experiência do usuário.

### Controle de Intervalo de Tempo Aprimorado

- **Controle Deslizante Interativo**: Substituímos os seletores de dropdown por um controle deslizante interativo para seleção de intervalo de tempo.
- **Ajuste Visual de Intervalo**: Os usuários agora podem ajustar visualmente o intervalo de tempo arrastando os controles deslizantes mínimo e máximo.
- **Feedback Visual Imediato**: O intervalo selecionado é destacado visualmente no controle deslizante para melhor feedback ao usuário.

### Rodapé Consistente

- **Rodapé em Todas as Páginas**: Adicionamos um rodapé consistente em todas as páginas com o slogan da empresa e informações de contato.
- **Identidade Visual Reforçada**: O rodapé ajuda a manter uma identidade visual consistente em toda a aplicação.

### Arquivos Modificados

- `static/css/style.css`: Atualizado para incluir as declarações de fonte e estilos globais.
- `templates/base.html`: Modificado para incluir o rodapé em todas as páginas.
- `templates/emergy_calculator.html`: Traduzido para português brasileiro.
- `templates/graphics.html`: Atualizado com o novo controle deslizante de intervalo de tempo.
- `static/js/graphics.js`: Modificado para implementar a funcionalidade do controle deslizante.

### Developers
- `Base`: [André Carbonieri Silva] (https://github.com/NDRandrew) 
- `Menu Hamburger`: [Kauã de Souza Pereira] (https://github.com/KauaDeSouzaPereira)
- `Lógica da Calculadora e dos gráficos`: [André Carbonieri Silva] (https://github.com/NDRandrew)
- `UI/UX`: [Kauã de Souza Pereira] (https://github.com/KauaDeSouzaPereira) e [Juan Santos de Oliveira] (https://github.com/Jplay-code)
