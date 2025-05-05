/**
 * Testes Cypress para a página principal da aplicação Emergy.
 * Este arquivo contém testes para verificar a funcionalidade da página principal,
 * incluindo a navegação e o menu hamburger.
 * 
 * Feito por André Carbonieri Silva T839FC9
 * Atualizado para a nova interface em português por Kauã e Juan
 */

describe('Página Principal', () => {
  beforeEach(() => {
    // Visita a página principal antes de cada teste
    cy.visit('/');
  });

  it('deve exibir o título correto em português', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Emergia - Energia Renovável');
    cy.get('h2').should('contain', 'Energia Renovável');
    cy.get('p').should('contain', 'Preservando nosso ecossistema');
  });

  it('deve exibir o logo da Emergia', () => {
    // Verifica se o logo está presente
    cy.get('.logo').should('exist');
    cy.get('.logo').should('have.attr', 'alt', 'Emergia Logo');
  });

  it('deve ter um botão para a calculadora', () => {
    // Verifica se o botão para a calculadora existe e tem o texto correto
    cy.get('.btn-primary').should('exist');
    cy.get('.btn-primary').should('contain', 'Faça o cálculo');
    
    // Verifica se o botão leva para a página da calculadora
    cy.get('.btn-primary').click();
    cy.url().should('include', '/emergy-calculator');
  });

  it('deve ter um menu hamburger funcional', () => {
    // Verifica se o menu hamburger existe
    cy.get('#menu__toggle').should('exist');
    
    // Marca o checkbox diretamente
    cy.get('#menu__toggle').check({force: true});
    
    // Verifica se os itens do menu estão presentes e em português
    cy.get('.menu__item').should('have.length.at.least', 2);
    cy.get('.menu__item').should('contain', 'Início');
    cy.get('.menu__item').should('contain', 'Calculadora de Emergia');
  });

  it('deve navegar para a página da calculadora através do menu', () => {
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Clica no item do menu da calculadora
    cy.get('.menu__item').contains('Calculadora de Emergia').click({force: true});
    
    // Verifica se navegou para a página da calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('header').should('contain', 'Calculadora de Emergia');
  });

  it('deve exibir informações sobre a empresa em português', () => {
    // Verifica se a seção de informações existe
    cy.get('.info-section').should('exist');
    
    // Verifica se o texto está em português
    cy.get('.info-text').should('contain', 'Somos uma empresa voltada para eficiência');
    cy.get('.info-text').should('contain', 'cálculos de Emergia');
    cy.get('.info-text').should('contain', 'Acreditamos que o futuro depende de decisões conscientes');
  });

  it('deve exibir a seção de valores em português', () => {
    // Verifica se a seção de valores existe
    cy.get('.values-section').should('exist');
    
    // Verifica se os valores estão em português
    cy.get('.values-block h3').should('contain', 'Valores');
    cy.get('.values-block li').should('have.length', 5);
    cy.get('.values-block li').eq(0).should('contain', 'Inovação');
    cy.get('.values-block li').eq(1).should('contain', 'Educação');
  });

  it('deve exibir a seção de missão e visão em português', () => {
    // Verifica se as seções de missão e visão existem
    cy.get('.mission-block').should('exist');
    cy.get('.vision-block').should('exist');
    
    // Verifica se os títulos estão em português
    cy.get('.mission-block h3').should('contain', 'Missão');
    cy.get('.vision-block h3').should('contain', 'Visão');
  });

  it('deve exibir o rodapé com o slogan da empresa', () => {
    // Verifica se o rodapé existe e contém o slogan
    cy.get('footer').should('exist');
    cy.get('.slogan-section h2').should('contain', 'Porque a Natureza não é só energia, é Emergia!');
    
    // Verifica se as informações de contato estão presentes
    cy.get('.footer-info h4').should('contain', 'Visite-nos:');
    cy.get('.footer-contact h4').should('contain', 'Inquéritos em:');
    cy.get('.footer-contact p').should('contain', 'Contato@emergia.com');
  });
});
