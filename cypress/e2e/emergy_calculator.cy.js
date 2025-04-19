/**
 * Testes Cypress para a página da Calculadora Emergy.
 * Este arquivo contém testes para verificar a funcionalidade da calculadora,
 * incluindo o upload de arquivos TXT e a exibição de resultados.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

describe('Calculadora Emergy', () => {
  beforeEach(() => {
    // Visita a página da calculadora antes de cada teste
    cy.visit('/emergy-calculator');
  });

  it('deve exibir o título correto', () => {
    // Verifica se o título da página está correto
    cy.title().should('include', 'Emergy Calculator');
    cy.get('h1').should('contain', 'Emergy Calculator');
  });

  it('deve ter um formulário de upload de arquivo', () => {
    // Verifica se o formulário de upload existe
    cy.get('.upload-form').should('exist');
    cy.get('#txt_file').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('deve exibir mensagem de erro quando nenhum arquivo é selecionado', () => {
    // Tenta enviar o formulário sem selecionar um arquivo
    cy.get('.upload-form').submit();
    
    // Verifica se a mensagem de erro é exibida
    cy.get('.message-error').should('be.visible');
    cy.get('.message-error').should('contain', 'Por favor, selecione um arquivo TXT');
  });

  it('deve exibir mensagem de erro quando um arquivo não-TXT é selecionado', () => {
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
      
      // Verifica se a mensagem de erro é exibida
      cy.get('.message-error').should('be.visible');
      cy.get('.message-error').should('contain', 'Por favor, envie um arquivo TXT válido');
    });
  });

  it('deve processar um arquivo TXT válido e exibir resultados', () => {
    // Cria um arquivo TXT de teste
    const txtContent = 'Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3\n16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000';
    
    // Simula o upload de um arquivo TXT válido
    cy.get('#txt_file').attachFile({
      fileContent: txtContent,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });
    
    // Envia o formulário
    cy.get('.upload-form').submit();
    
    // Verifica se a mensagem de carregamento é exibida
    cy.get('.message-info').should('be.visible');
    cy.get('.message-info').should('contain', 'Processando');
    
    // Verifica se os resultados são exibidos após o processamento
    cy.get('.message-success', { timeout: 10000 }).should('be.visible');
    cy.get('.results-summary').should('exist');
    cy.get('.results-summary h3').should('contain', 'Resultados do Cálculo de Emergy');
    
    // Verifica se os botões de ação estão presentes
    cy.get('#view-graphics').should('exist');
    cy.get('#download-results').should('exist');
  });

  it('deve navegar para a página de gráficos ao clicar no botão "Ver Gráficos"', () => {
    // Simula o processamento de um arquivo TXT
    const txtContent = 'Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3\n16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000';
    cy.get('#txt_file').attachFile({
      fileContent: txtContent,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });
    cy.get('.upload-form').submit();
    
    // Espera pelos resultados
    cy.get('.results-actions', { timeout: 10000 }).should('be.visible');
    
    // Clica no botão "Ver Gráficos"
    cy.get('#view-graphics').click();
    
    // Verifica se navegou para a página de gráficos
    cy.url().should('include', '/graphics');
  });

  it('deve exibir alerta ao clicar no botão "Baixar Resultados"', () => {
    // Simula o processamento de um arquivo TXT
    const txtContent = 'Date;Time;Global_active_power;Global_reactive_power;Voltage;Global_intensity;Sub_metering_1;Sub_metering_2;Sub_metering_3\n16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000';
    cy.get('#txt_file').attachFile({
      fileContent: txtContent,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });
    cy.get('.upload-form').submit();
    
    // Espera pelos resultados
    cy.get('.results-actions', { timeout: 10000 }).should('be.visible');
    
    // Intercepta o alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contain('placeholder');
    });
    
    // Clica no botão "Baixar Resultados"
    cy.get('#download-results').click();
  });
});
