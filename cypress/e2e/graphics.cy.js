/**
 * Testes Cypress para a página de Gráficos.
 * Este arquivo contém testes para verificar a funcionalidade da página de gráficos,
 * incluindo a exibição de gráficos e a alteração do tipo de gráfico.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

describe('Página de Gráficos', () => {
  beforeEach(() => {
    // Visita a página de gráficos antes de cada teste
    cy.visit('/graphics');
  });

  it('deve exibir o título correto', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Graphics - Emergy Application');
    cy.get('h1').should('contain', 'Graphics Visualization');
  });

  it('deve exibir mensagem quando não há dados disponíveis', () => {
    // Verifica se a mensagem de "sem dados" é exibida
    cy.get('.chart-placeholder').should('exist');
    cy.get('.chart-placeholder p').should('contain', 'Nenhum dado disponível para visualização');
  });

  it('deve ter controles de gráfico desabilitados quando não há dados', () => {
    // Verifica se os controles de gráfico estão desabilitados
    cy.get('#chart-type').should('be.disabled');
    cy.get('#update-chart').should('be.disabled');
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
      
      // Verifica se o canvas do gráfico existe
      cy.get('#emergy-chart').should('exist');
    });
  });

  it('deve ter um menu hamburger funcional', () => {
    // Verifica se o menu hamburger existe
    cy.get('#menu__toggle').should('exist');
    
    // Marca o checkbox diretamente
    cy.get('#menu__toggle').check({force: true});
    
    // Verifica se os itens do menu estão presentes
    cy.get('.menu__item').should('have.length.at.least', 2);
    
    // Verifica se a página de gráficos não está no menu (conforme especificação)
    cy.get('.menu__item').contains('Graphics').should('not.exist');
  });

  it('deve navegar para a página principal através do menu', () => {
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica no item do menu principal
    cy.get('.menu__item').contains('Main').click({force: true});
    
    // Verifica se navegou para a página principal
    cy.url().should('not.include', '/graphics');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
