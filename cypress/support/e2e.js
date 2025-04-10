/**
 * Arquivo de suporte para testes e2e do Cypress.
 * Este arquivo é carregado automaticamente antes dos testes e2e.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

// Importa o plugin de upload de arquivos
import 'cypress-file-upload';

// Importa comandos personalizados
import './commands';

// Oculta erros de XHR não relacionados aos testes
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
