/**
 * Comandos personalizados do Cypress para testes da aplicação Emergy.
 * Este arquivo contém comandos personalizados que podem ser usados em todos os testes.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

// Nota: O comando 'attachFile' é fornecido pelo plugin cypress-file-upload
// que é importado em cypress/support/e2e.js

// Comando para verificar se o menu hamburger está aberto
Cypress.Commands.add('menuShouldBeOpen', () => {
  cy.get('.menu__box').should('be.visible');
});

// Comando para verificar se o menu hamburger está fechado
Cypress.Commands.add('menuShouldBeClosed', () => {
  cy.get('.menu__box').should('not.be.visible');
});

// Comando para abrir o menu hamburger
Cypress.Commands.add('openMenu', () => {
  cy.get('#menu__toggle').then($toggle => {
    if (!$toggle.prop('checked')) {
      cy.get('.menu__btn').click();
    }
  });
  cy.menuShouldBeOpen();
});

// Comando para fechar o menu hamburger
Cypress.Commands.add('closeMenu', () => {
  cy.get('#menu__toggle').then($toggle => {
    if ($toggle.prop('checked')) {
      cy.get('.menu__btn').click();
    }
  });
  cy.menuShouldBeClosed();
});

// Comando para navegar para uma página através do menu hamburger
Cypress.Commands.add('navigateViaMenu', (pageName) => {
  cy.openMenu();
  cy.get('.menu__item').contains(pageName).click();
  cy.menuShouldBeClosed();
});

// Comando para simular o processamento de um arquivo CSV
Cypress.Commands.add('processCSV', (csvContent = 'nome,valor,unidade,categoria,descricao\nEntrada 1,10,kg,Material,Descrição 1\nEntrada 2,20,kWh,Energia,Descrição 2') => {
  cy.get('#csv_file').attachFile({
    fileContent: csvContent,
    fileName: 'test.csv',
    mimeType: 'text/csv'
  });
  cy.get('.upload-form').submit();
  cy.get('.results-actions', { timeout: 10000 }).should('be.visible');
});
