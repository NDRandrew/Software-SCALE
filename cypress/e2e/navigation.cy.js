/**
 * Testes Cypress para a navegação entre páginas da aplicação Emergy.
 * Este arquivo contém testes para verificar a navegação entre as diferentes páginas
 * da aplicação, incluindo o menu hamburger e links diretos.
 * 
 * Feito por André Carbonieri Silva T839FC9
 * Atualizado para a nova interface em português por Kauã e Juan
 */

describe('Navegação entre Páginas', () => {
  it('deve navegar da página principal para a calculadora e de volta', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Verifica se está na página principal
    cy.get('h2').should('contain', 'Energia Renovável');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Navega para a calculadora
    cy.get('.menu__item').contains('Calculadora de Emergia').click({force: true});
    
    // Verifica se está na página da calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('header').should('contain', 'Calculadora de Emergia');
    
    // Abre o menu hamburger novamente
    cy.get('.menu__btn').click({force: true});
    
    // Navega de volta para a página principal
    cy.get('.menu__item').contains('Início').click({force: true});
    
    // Verifica se voltou para a página principal
    cy.url().should('not.include', '/emergy-calculator');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h2').should('contain', 'Energia Renovável');
  });

  it('deve navegar da calculadora para os gráficos através do upload de arquivo', () => {
    // Visita a página da calculadora
    cy.visit('/emergy-calculator');
    
    // Simula o processamento de um arquivo TXT
    const txtContent = 'Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3\n16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000';
    cy.get('#txt_file').attachFile({
      fileContent: txtContent,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });
    
    // Intercepta a chamada de redirecionamento
    cy.intercept('GET', '/graphics').as('redirectToGraphics');
    
    // Envia o formulário
    cy.get('.upload-form').submit();
    
    // Verifica se o indicador de carregamento é exibido
    cy.get('#upload-status').should('be.visible');
    
    // Verifica se foi redirecionado para a página de gráficos
    cy.url().should('include', '/graphics', { timeout: 10000 });
    cy.get('header').should('contain', 'Visualização de Gráficos');
  });

  it('deve navegar dos gráficos para a calculadora através do link', () => {
    // Visita a página de gráficos
    cy.visit('/graphics');
    
    // Verifica se está na página de gráficos
    cy.get('header').should('contain', 'Visualização de Gráficos');
    
    // Clica no link para a calculadora
    cy.get('.chart-placeholder a').contains('Calculadora de Emergia').click();
    
    // Verifica se navegou para a calculadora
    cy.url().should('include', '/emergy-calculator');
    cy.get('header').should('contain', 'Calculadora de Emergia');
  });

  it('deve navegar para a página de gráficos através do botão na página de upload', () => {
    // Visita a página de gráficos
    cy.visit('/graphics');
    
    // Clica no botão para ir para a página de upload
    cy.get('a').contains('Ir para a página de upload').click();
    
    // Verifica se navegou para a calculadora
    cy.url().should('include', '/emergy-calculator');
  });

  it('deve verificar que a página de gráficos não está no menu hamburger', () => {
    // Visita a página principal
    cy.visit('/');
    
    // Abre o menu hamburger
    cy.get('.menu__btn').click({force: true});
    
    // Verifica se o menu contém os itens esperados
    cy.get('.menu__item').should('have.length', 2); // Início e Calculadora
    cy.get('.menu__item').eq(0).should('contain', 'Início');
    cy.get('.menu__item').eq(1).should('contain', 'Calculadora de Emergia');
    
    // Verifica que não há item de menu para Gráficos
    cy.get('.menu__item').contains('Gráficos').should('not.exist');
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
    cy.get('.menu__item').contains('Calculadora de Emergia').click({force: true});
    
    // Verifica se navegou para a página correta
    cy.url().should('include', '/emergy-calculator');
    
    // Verifica se o menu foi fechado (o checkbox deve estar desmarcado)
    cy.get('#menu__toggle').should('not.be.checked');
  });

  it('deve exibir o rodapé com o slogan da empresa em todas as páginas', () => {
    // Verifica o rodapé na página principal
    cy.visit('/');
    cy.get('footer').should('exist');
    cy.get('footer').should('contain', 'Porque a Natureza não é só energia, é Emergia!');
    
    // Verifica o rodapé na página da calculadora
    cy.visit('/emergy-calculator');
    cy.get('footer').should('exist');
    cy.get('footer').should('contain', 'Porque a Natureza não é só energia, é Emergia!');
    
    // Verifica o rodapé na página de gráficos
    cy.visit('/graphics');
    cy.get('footer').should('exist');
    cy.get('footer').should('contain', 'Porque a Natureza não é só energia, é Emergia!');
  });
});
