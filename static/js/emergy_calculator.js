/**
 * Arquivo JavaScript para a funcionalidade da Calculadora Emergy.
<<<<<<< HEAD
 * Este arquivo contém a lógica para o formulário de upload de arquivos TXT,
=======
 * Este arquivo contém a lógica para o formulário de upload de arquivos CSV,
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
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
<<<<<<< HEAD
    const fileInput = document.getElementById('txt_file');
=======
    const fileInput = document.getElementById('csv_file');
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
    const resultsContainer = document.querySelector('.results-container');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Valida o arquivo
            if (fileInput.files.length === 0) {
<<<<<<< HEAD
                showMessage(resultsContainer, 'Por favor, selecione um arquivo TXT para enviar.', 'error');
=======
                showMessage(resultsContainer, 'Por favor, selecione um arquivo CSV para enviar.', 'error');
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
                return;
            }
            
            const file = fileInput.files[0];
            
            // Verifica o tipo de arquivo
<<<<<<< HEAD
            if (!file.name.endsWith('.txt')) {
                showMessage(resultsContainer, 'Por favor, envie um arquivo TXT válido.', 'error');
=======
            if (!file.name.endsWith('.csv')) {
                showMessage(resultsContainer, 'Por favor, envie um arquivo CSV válido.', 'error');
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
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
<<<<<<< HEAD
 * Exibe resultados do arquivo processado
 * @param {HTMLElement} container - O contêiner para mostrar os resultados
 */
function showPlaceholderResults(container) {
    const fileInput = document.getElementById('txt_file');
    const file = fileInput.files[0];
    
    // Cria o HTML básico para os resultados
    container.innerHTML = `
        <div class="message message-success">
            <p>Arquivo TXT processado com sucesso!</p>
        </div>
        <div class="results-summary">
            <h3>Resultados do Cálculo de Emergy</h3>
            <div class="file-data">
                <h4>Dados do Arquivo:</h4>
                <div class="data-preview">Carregando dados do arquivo...</div>
            </div>
=======
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
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
        </div>
        <div class="results-actions">
            <button class="btn" id="view-graphics">Ver Gráficos</button>
            <button class="btn" id="download-results">Baixar Resultados</button>
        </div>
    `;
    
<<<<<<< HEAD
    // Lê o conteúdo do arquivo e exibe os primeiros 10 registros
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Limita a exibição a 10 linhas para não sobrecarregar a página
        const displayLines = lines.slice(0, Math.min(10, lines.length));
        
        // Formata os dados para exibição
        let dataHTML = '<table class="data-table"><thead>';
        
        // Cabeçalhos
        if (displayLines.length > 0) {
            const headers = displayLines[0].split(';');
            dataHTML += '<tr>';
            headers.forEach(header => {
                dataHTML += `<th>${header}</th>`;
            });
            dataHTML += '</tr></thead><tbody>';
            
            // Dados
            for (let i = 1; i < displayLines.length; i++) {
                const values = displayLines[i].split(';');
                dataHTML += '<tr>';
                values.forEach(value => {
                    dataHTML += `<td>${value}</td>`;
                });
                dataHTML += '</tr>';
            }
            
            dataHTML += '</tbody></table>';
            
            if (lines.length > 10) {
                dataHTML += `<p class="more-data">... e mais ${lines.length - 10} linhas de dados</p>`;
            }
        } else {
            dataHTML = '<p>Nenhum dado encontrado no arquivo.</p>';
        }
        
        // Atualiza o conteúdo
        document.querySelector('.data-preview').innerHTML = dataHTML;
    };
    
    reader.readAsText(file);
    
=======
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
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
<<<<<<< HEAD
            alert('Este é um placeholder. Na implementação completa, isso baixaria os resultados como um arquivo TXT.');
=======
            alert('Este é um placeholder. Na implementação completa, isso baixaria os resultados como um arquivo CSV.');
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
        });
    }
}
