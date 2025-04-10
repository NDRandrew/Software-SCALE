/**
 * Testes Cypress para a página principal da aplicação Emergy.
 * Este arquivo contém testes para verificar a funcionalidade da página principal,
 * incluindo a navegação e o menu hamburger.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

describe('Página Principal', () => {
  beforeEach(() => {
    // Visita a página principal antes de cada teste
    cy.visit('/');
  });

  it('deve exibir o título correto', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Main - Emergy Application');
    cy.get('h2').should('contain', 'Welcome to the Emergy Application');
  });

  it('deve ter um menu hamburger funcional', () => {
    // Verifica se o menu hamburger existe
    cy.get('#menu__toggle').should('exist');
    
    // Marca o checkbox diretamente
    cy.get('#menu__toggle').check({force: true});
    
    // Verifica se os itens do menu estão presentes
    cy.get('.menu__item').should('have.length.at.least', 2);
    cy.get('.menu__item').should('contain', 'Main');
    cy.get('.menu__item').should('contain', 'Emergy Calculator');
  });

  it('deve navegar para a página da calculadora através do menu', () => {
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica no item do menu da calculadora
    cy.get('.menu__item').contains('Emergy Calculator').click({force: true});
    
    // Verifica se navegou para a página da calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('h1').should('contain', 'Emergy Calculator');
  });

  it('deve exibir informações sobre a aplicação', () => {
    // Verifica se a página principal contém informações sobre a aplicação
    cy.get('.container').should('exist');
    cy.get('.welcome-section p').should('contain', 'emergy calculation');
  });
});
