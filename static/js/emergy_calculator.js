/**
 * Arquivo JavaScript para a funcionalidade da Calculadora Emergy.
 * Este arquivo contém a lógica para o formulário de upload de arquivos TXT,
 * validação de arquivos e redirecionamento para a página de gráficos.
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
    const uploadForm = document.getElementById('energy-data-form');
    const fileInput = document.getElementById('txt_file');
    const uploadStatus = document.getElementById('upload-status');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Valida o arquivo
            if (fileInput.files.length === 0) {
                alert('Por favor, selecione um arquivo TXT para enviar.');
                return;
            }
            
            const file = fileInput.files[0];
            
            // Verifica o tipo de arquivo
            if (!file.name.endsWith('.txt')) {
                alert('Por favor, envie um arquivo TXT válido.');
                return;
            }
            
            // Mostra indicador de carregamento
            uploadStatus.style.display = 'block';
            
            // Lê o conteúdo do arquivo
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContent = e.target.result;
                
                try {
                    // Armazena os dados do arquivo no sessionStorage para uso na página de gráficos
                    sessionStorage.setItem('energyData', fileContent);
                    sessionStorage.setItem('energyDataFilename', file.name);
                    
                    // Redireciona para a página de gráficos após um pequeno atraso
                    // para permitir que o usuário veja o indicador de carregamento
                    setTimeout(function() {
                        window.location.href = '/graphics';
                    }, 1000);
                } catch (error) {
                    console.error('Erro ao processar o arquivo:', error);
                    alert('Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.');
                    uploadStatus.style.display = 'none';
                }
            };
            
            reader.onerror = function() {
                alert('Erro ao ler o arquivo. Por favor, tente novamente.');
                uploadStatus.style.display = 'none';
            };
            
            reader.readAsText(file);
        });
    }
}
