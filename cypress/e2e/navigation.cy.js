/**
 * Testes Cypress para a navegação entre páginas da aplicação Emergy.
 * Este arquivo contém testes para verificar a navegação entre as diferentes páginas
 * da aplicação, incluindo o menu hamburger e links diretos.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

describe('Navegação entre Páginas', () => {
  it('deve navegar da página principal para a calculadora e de volta', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Verifica se está na página principal
    cy.get('h2').should('contain', 'Welcome to the Emergy Application');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Navega para a calculadora
    cy.get('.menu__item').contains('Emergy Calculator').click({force: true});
    
    // Verifica se está na página da calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('h1').should('contain', 'Emergy Calculator');
    
    // Abre o menu hamburger novamente
    cy.get('.menu__btn').click({force: true});
    
    // Navega de volta para a página principal
    cy.get('.menu__item').contains('Main').click({force: true});
    
    // Verifica se voltou para a página principal
    cy.url().should('not.include', '/emergy-calculator');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h2').should('contain', 'Welcome to the Emergy Application');
  });

  it('deve navegar da calculadora para os gráficos através do botão', () => {
    // Visita a página da calculadora
    cy.visit('/emergy-calculator');
    
    // Simula o processamento de um arquivo CSV
    const csvContent = 'nome,valor,unidade,categoria,descricao\nEntrada 1,10,kg,Material,Descrição 1\nEntrada 2,20,kWh,Energia,Descrição 2';
    cy.get('#csv_file').attachFile({
      fileContent: csvContent,
      fileName: 'test.csv',
      mimeType: 'text/csv'
    });
    cy.get('.upload-form').submit();
    
    // Espera pelos resultados
    cy.get('.results-actions', { timeout: 10000 }).should('be.visible');
    
    // Clica no botão "Ver Gráficos"
    cy.get('#view-graphics').click();
    
    // Verifica se navegou para a página de gráficos
    cy.url().should('include', '/graphics');
    cy.get('h1').should('contain', 'Graphics');
  });

  it('deve navegar dos gráficos para a calculadora através do link', () => {
    // Visita a página de gráficos
    cy.visit('/graphics');
    
    // Verifica se está na página de gráficos
    cy.get('h1').should('contain', 'Graphics');
    
    // Clica no link para a calculadora
    cy.get('.chart-placeholder a').click();
    
    // Verifica se navegou para a calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('h1').should('contain', 'Emergy Calculator');
  });

  it('deve verificar que a página de gráficos não está no menu hamburger', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Verifica se o menu contém os itens esperados
    cy.get('.menu__item').should('have.length', 2); // Principal e Calculadora
    cy.get('.menu__item').eq(0).should('contain', 'Main');
    cy.get('.menu__item').eq(1).should('contain', 'Emergy Calculator');
    
    // Verifica que não há item de menu para Gráficos
    cy.get('.menu__item').contains('Graphics').should('not.exist');
  });

  it('deve fechar o menu hamburger ao clicar fora dele', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica fora do menu (no conteúdo principal)
    cy.get('.container').click();
    
    // Verifica se o menu foi fechado (o checkbox deve estar desmarcado)
    cy.get('#menu__toggle').should('not.be.checked');
  });

  it('deve fechar o menu hamburger ao clicar em um item do menu', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica em um item do menu
    cy.get('.menu__item').contains('Emergy Calculator').click({force: true});
    
    // Verifica se navegou para a página correta
    cy.url().should('include', '/emergy-calculator');
    
    // Verifica se o menu foi fechado (o checkbox deve estar desmarcado)
    cy.get('#menu__toggle').should('not.be.checked');
  });
});
