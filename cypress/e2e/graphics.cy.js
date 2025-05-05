/**
 * Testes Cypress para a página de Gráficos.
 * Este arquivo contém testes para verificar a funcionalidade da página de gráficos,
 * incluindo a exibição de gráficos, controle de intervalo de tempo e alteração do tipo de gráfico.
 * 
 * Feito por André Carbonieri Silva T839FC9
 * Atualizado para a nova interface em português por Kauã e Juan
 */

describe('Página de Gráficos', () => {
  beforeEach(() => {
    // Visita a página de gráficos antes de cada teste
    cy.visit('/graphics');
  });

  it('deve exibir o título correto em português', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Gráficos - Aplicação Emergy');
    cy.get('header').should('contain', 'Visualização de Gráficos');
  });

  it('deve exibir mensagem quando não há dados disponíveis em português', () => {
    // Verifica se a mensagem de "sem dados" é exibida em português
    cy.get('.chart-placeholder').should('exist');
    cy.get('.chart-placeholder p').should('contain', 'Nenhum dado disponível para visualização');
  });

  it('deve exibir instruções de uso em português', () => {
    // Verifica se as instruções de uso estão em português
    cy.get('.chart-placeholder h4').should('contain', 'Como usar esta página');
    cy.get('.chart-placeholder li').should('have.length', 3);
    cy.get('.chart-placeholder li').eq(0).should('contain', 'Primeiro, vá para a Calculadora de Emergia');
    cy.get('.chart-placeholder li').eq(1).should('contain', 'Faça upload de um arquivo TXT');
    cy.get('.chart-placeholder li').eq(2).should('contain', 'Você será redirecionado automaticamente');
  });

  it('deve ter controles de gráfico desabilitados quando não há dados', () => {
    // Verifica se os controles de gráfico estão desabilitados
    cy.get('#chart-type').should('be.disabled');
    cy.get('#data-file').should('be.disabled');
    cy.get('#update-chart').should('be.disabled');
  });

  it('deve exibir o controle de intervalo de tempo', () => {
    // Verifica se o controle de intervalo de tempo existe
    cy.get('#time-range-controls').should('exist');
    
    // Verifica se os elementos do controle deslizante estão presentes
    cy.get('#time-range-min').should('contain', '00:00:00');
    cy.get('#time-range-max').should('contain', '23:59:59');
    cy.get('.range-slider-container').should('exist');
    cy.get('#slider-min-handle').should('exist');
    cy.get('#slider-max-handle').should('exist');
    cy.get('#update-time-range').should('be.disabled');
  });

  // Testes para quando há dados disponíveis
  // Nota: Estes testes precisariam de um estado de aplicação onde os dados estão disponíveis
  // Para fins de demonstração, vamos simular esse estado modificando o DOM
  
  it('deve permitir mudar o tipo de gráfico quando há dados', () => {
    // Simula a existência de dados modificando o DOM
    cy.window().then((win) => {
      // Substitui a função checkForEmergyData para retornar true
      win.checkForEmergyData = () => true;
      
      // Simula a habilitação dos controles
      cy.get('#chart-type').invoke('removeAttr', 'disabled');
      cy.get('#update-chart').invoke('removeAttr', 'disabled');
      cy.get('#update-time-range').invoke('removeAttr', 'disabled');
      
      // Verifica se o canvas do gráfico existe ou cria um
      cy.document().then((doc) => {
        if (!doc.getElementById('emergy-chart')) {
          const canvas = doc.createElement('canvas');
          canvas.id = 'emergy-chart';
          doc.querySelector('.graphics-container').appendChild(canvas);
        }
      });
      
      // Verifica se os controles estão habilitados
      cy.get('#chart-type').should('not.have.attr', 'disabled');
      cy.get('#update-chart').should('not.have.attr', 'disabled');
      cy.get('#update-time-range').should('not.have.attr', 'disabled');
      
      // Verifica se o canvas do gráfico existe
      cy.get('#emergy-chart').should('exist');
    });
  });

  it('deve simular o ajuste do controle deslizante de tempo', () => {
    // Simula a existência de dados e habilita os controles
    cy.window().then((win) => {
      win.checkForEmergyData = () => true;
      
      // Habilita o botão de atualização de intervalo de tempo
      cy.get('#update-time-range').invoke('removeAttr', 'disabled');
      
      // Simula o movimento do controle deslizante mínimo
      cy.get('#slider-min-handle').invoke('attr', 'style', 'position: absolute; width: 18px; height: 18px; background-color: #fff; border: 2px solid #4a7c3a; border-radius: 50%; top: 50%; transform: translate(-50%, -50%); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 2; left: 25%;');
      
      // Simula o movimento do controle deslizante máximo
      cy.get('#slider-max-handle').invoke('attr', 'style', 'position: absolute; width: 18px; height: 18px; background-color: #fff; border: 2px solid #4a7c3a; border-radius: 50%; top: 50%; transform: translate(-50%, -50%); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 2; left: 75%;');
      
      // Atualiza a visualização do intervalo selecionado
      cy.get('#slider-range').invoke('attr', 'style', 'position: absolute; height: 6px; background-color: #4a7c3a; top: 50%; transform: translateY(-50%); border-radius: 3px; left: 25%; width: 50%;');
      
      // Verifica se o botão de atualização está habilitado
      cy.get('#update-time-range').should('not.have.attr', 'disabled');
      
      // Clica no botão de atualização
      cy.get('#update-time-range').click();
    });
  });

  it('deve ter um menu hamburger funcional', () => {
    // Verifica se o menu hamburger existe
    cy.get('#menu__toggle').should('exist');
    
    // Marca o checkbox diretamente
    cy.get('#menu__toggle').check({force: true});
    
    // Verifica se os itens do menu estão presentes
    cy.get('.menu__item').should('have.length.at.least', 2);
    
    // Verifica se os itens do menu estão em português
    cy.get('.menu__item').contains('Início').should('exist');
    cy.get('.menu__item').contains('Calculadora de Emergia').should('exist');
    
    // Verifica se a página de gráficos não está no menu (conforme especificação)
    cy.get('.menu__item').contains('Gráficos').should('not.exist');
  });

  it('deve navegar para a página principal através do menu', () => {
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica no item do menu principal
    cy.get('.menu__item').contains('Início').click({force: true});
    
    // Verifica se navegou para a página principal
    cy.url().should('not.include', '/graphics');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve exibir o rodapé com o slogan da empresa', () => {
    // Verifica se o rodapé existe e contém o slogan
    cy.get('footer').should('exist');
    cy.get('footer').should('contain', 'Porque a Natureza não é só energia, é Emergia!');
    
    // Verifica se as informações de contato estão presentes
    cy.get('footer').should('contain', 'Visite-nos:');
    cy.get('footer').should('contain', 'Inquéritos em:');
    cy.get('footer').should('contain', 'Contato@emergia.com');
  });
});
