/**
 * Arquivo JavaScript para a funcionalidade da Calculadora Emergy.
 * Este arquivo contém a lógica para o formulário de upload de arquivos CSV,
 * validação de arquivos e exibição de resultados na página da calculadora.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página da Calculadora Emergy inicializada');
    
    // Inicializa o formulário de upload de arquivos
    initializeFileUploadForm();
});

/**
 * Inicializa o formulário de upload de arquivos com validação e tratamento de envio
 */
function initializeFileUploadForm() {
    const uploadForm = document.querySelector('.upload-form');
    const fileInput = document.getElementById('csv_file');
    const resultsContainer = document.querySelector('.results-container');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Valida o arquivo
            if (fileInput.files.length === 0) {
                showMessage(resultsContainer, 'Por favor, selecione um arquivo CSV para enviar.', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            
            // Verifica o tipo de arquivo
            if (!file.name.endsWith('.csv')) {
                showMessage(resultsContainer, 'Por favor, envie um arquivo CSV válido.', 'error');
                return;
            }
            
            // Mostra mensagem de carregamento
            showMessage(resultsContainer, 'Processando seu arquivo...', 'info');
            
            // Em uma aplicação real, enviaríamos o formulário para o servidor
            // Por enquanto, vamos apenas simular uma resposta após um atraso
            setTimeout(function() {
                // Este é um placeholder para a resposta real do servidor
                showPlaceholderResults(resultsContainer);
            }, 1500);
        });
    }
}

/**
 * Exibe uma mensagem no contêiner especificado
 * @param {HTMLElement} container - O contêiner para mostrar a mensagem
 * @param {string} message - A mensagem a ser exibida
 * @param {string} type - O tipo de mensagem (info, success, error)
 */
function showMessage(container, message, type) {
    container.innerHTML = '';
    
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    container.appendChild(messageElement);
}

/**
 * Exibe resultados de placeholder para fins de demonstração
 * @param {HTMLElement} container - O contêiner para mostrar os resultados
 */
function showPlaceholderResults(container) {
    container.innerHTML = `
        <div class="message message-success">
            <p>Arquivo CSV processado com sucesso!</p>
        </div>
        <div class="results-summary">
            <h3>Resultados do Cálculo de Emergy</h3>
            <p>Este é um placeholder para os resultados reais do cálculo.</p>
            <p>Na implementação completa, isso exibiria os valores de emergy calculados com base nos dados CSV enviados.</p>
        </div>
        <div class="results-actions">
            <button class="btn" id="view-graphics">Ver Gráficos</button>
            <button class="btn" id="download-results">Baixar Resultados</button>
        </div>
    `;
    
    // Adiciona event listeners aos botões
    const viewGraphicsBtn = document.getElementById('view-graphics');
    if (viewGraphicsBtn) {
        viewGraphicsBtn.addEventListener('click', function() {
            window.location.href = '/graphics';  // Isso deve corresponder à rota definida no EmergyController
        });
    }
    
    const downloadResultsBtn = document.getElementById('download-results');
    if (downloadResultsBtn) {
        downloadResultsBtn.addEventListener('click', function() {
            alert('Este é um placeholder. Na implementação completa, isso baixaria os resultados como um arquivo CSV.');
        });
    }
}
