/**
 * Testes Cypress para a página da Calculadora Emergy.
 * Este arquivo contém testes para verificar a funcionalidade da calculadora,
 * incluindo o upload de arquivos TXT e o redirecionamento para a página de gráficos.
 * 
 * Feito por André Carbonieri Silva T839FC9
 * Atualizado para a nova interface em português por Kauã e Juan
 */

describe('Calculadora Emergy', () => {
  beforeEach(() => {
    // Visita a página da calculadora antes de cada teste
    cy.visit('/emergy-calculator');
  });

  it('deve exibir o título correto em português', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Calculadora de Emergia');
    cy.get('header').should('contain', 'Calculadora de Emergia');
  });

  it('deve ter um formulário de upload de arquivo', () => {
    // Verifica se o formulário de upload existe
    cy.get('.upload-form').should('exist');
    cy.get('#txt_file').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Visualizar Dados');
  });

  it('deve exibir a seção de dados de exemplo', () => {
    // Verifica se a seção de dados de exemplo existe
    cy.get('.sample-data-section').should('exist');
    cy.get('.sample-data-section h4').should('contain', 'Precisa de dados de exemplo?');
    cy.get('.sample-data-section a').should('contain', 'Download Sample Data');
  });

  it('deve exibir a seção de instruções em português', () => {
    // Verifica se a seção de instruções existe e está em português
    cy.get('.instructions-section').should('exist');
    cy.get('.instructions-section h4').should('contain', 'Como funciona');
    cy.get('.instructions-section li').should('have.length', 3);
    cy.get('.instructions-section li').eq(0).should('contain', 'Faça upload de um arquivo TXT');
    cy.get('.instructions-section li').eq(1).should('contain', 'Clique em "Visualizar Dados"');
    cy.get('.instructions-section li').eq(2).should('contain', 'Você será redirecionado');
  });

  it('deve exibir alerta quando nenhum arquivo é selecionado', () => {
    // Intercepta o alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Por favor, selecione um arquivo TXT para enviar');
    });
    
    // Tenta enviar o formulário sem selecionar um arquivo
    cy.get('.upload-form').submit();
  });

  it('deve exibir alerta quando um arquivo não-TXT é selecionado', () => {
    // Intercepta o alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Por favor, envie um arquivo TXT válido');
    });
    
    // Cria um arquivo de teste que não é TXT
    cy.fixture('sample.csv', 'base64').then(fileContent => {
      // Simula o upload de um arquivo não-TXT
      cy.get('#txt_file').attachFile({
        fileContent,
        fileName: 'sample.csv',
        mimeType: 'text/csv'
      });
      
      // Envia o formulário
      cy.get('.upload-form').submit();
    });
  });

  it('deve processar um arquivo TXT válido e redirecionar para a página de gráficos', () => {
    // Cria um arquivo TXT de teste
    const txtContent = 'Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3\n16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000';
    
    // Simula o upload de um arquivo TXT válido
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
    cy.get('#upload-status span').should('contain', 'Processando seu arquivo');
    
    // Verifica se foi redirecionado para a página de gráficos
    cy.url().should('include', '/graphics', { timeout: 10000 });
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
