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
                    // Processa o arquivo para extrair apenas os dados necessários
                    // em vez de armazenar o arquivo inteiro
                    const processedData = processFileData(fileContent);
                    
                    // Armazena os dados processados no sessionStorage
                    sessionStorage.setItem('energyData', JSON.stringify(processedData));
                    sessionStorage.setItem('energyDataFilename', file.name);
                    
                    // Redireciona para a página de gráficos após um pequeno atraso
                    // para permitir que o usuário veja o indicador de carregamento
                    setTimeout(function() {
                        window.location.href = '/graphics';
                    }, 1000);
                } catch (error) {
                    console.error('Erro ao processar o arquivo:', error);
                    alert('Ocorreu um erro ao processar o arquivo: ' + error.message + '. Por favor, tente novamente com um arquivo menor ou entre em contato com o suporte.');
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

/**
 * Processa os dados do arquivo para reduzir o tamanho e evitar exceder a cota de armazenamento
 * @param {string} fileContent - O conteúdo do arquivo
 * @returns {Object} - Os dados processados
 */
function processFileData(fileContent) {
    // Divide o conteúdo em linhas
    const lines = fileContent.trim().split('\n');
    
    // Determina o separador (ponto e vírgula ou espaço)
    let separator = ';';
    const firstLine = lines[0];
    
    // Verifica se este é um arquivo .txt com os campos esperados
    const expectedFields = ['Date', 'Time', 'Global_active_power', 'Global_reactive_power', 
                           'Voltage', 'Global_intensity', 'Sub_metering_1', 
                           'Sub_metering_2', 'Sub_metering_3'];
    
    // Tenta detectar o separador
    if (firstLine.includes(';')) {
        separator = ';';
    } else if (firstLine.includes(',')) {
        separator = ',';
    } else if (firstLine.includes('\t')) {
        separator = '\t';
    } else {
        // Se nenhum separador comum for encontrado, assume que é separado por espaço
        separator = ' ';
    }
    
    // Extrai os cabeçalhos (primeira linha)
    let headers = firstLine.split(separator);
    
    // Se os cabeçalhos não corresponderem aos campos esperados, use os campos esperados
    // Isso é útil para arquivos .txt que podem não ter cabeçalhos
    const headerMatch = headers.some(header => 
        expectedFields.includes(header.trim())
    );
    
    let startIndex = 0;
    if (!headerMatch) {
        headers = expectedFields;
        // Começa a análise a partir da primeira linha se os cabeçalhos não estiverem presentes
        startIndex = 0;
    } else {
        // Começa a análise a partir da segunda linha se os cabeçalhos estiverem presentes
        startIndex = 1;
    }
    
    // Limita o número de linhas para evitar exceder a cota de armazenamento
    const MAX_LINES = 5000; // Ajuste este valor conforme necessário
    const endIndex = Math.min(lines.length, startIndex + MAX_LINES);
    
    // Processa as linhas de dados
    const parsedData = [];
    for (let i = startIndex; i < endIndex; i++) {
        // Pula linhas vazias
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(separator);
        
        // Pula linhas que não têm valores suficientes
        if (values.length < 3) continue; // Precisa pelo menos de data, hora e alguns valores
        
        const dataPoint = {};
        for (let j = 0; j < Math.min(headers.length, values.length); j++) {
            const header = headers[j].trim();
            // Converte valores numéricos para números
            const value = values[j].replace(',', '.').trim();
            
            if (header !== 'Date' && header !== 'Time') {
                dataPoint[header] = parseFloat(value) || 0; // Padrão para 0 se a análise falhar
            } else {
                dataPoint[header] = value;
            }
        }
        
        // Combina Date e Time em um único campo datetime
        if (dataPoint['Date'] && dataPoint['Time']) {
            try {
                dataPoint['DateTime'] = new Date(`${dataPoint['Date']} ${dataPoint['Time']}`);
            } catch (e) {
                console.error('Erro ao analisar data:', e);
                // Usa a data atual como fallback
                dataPoint['DateTime'] = new Date();
            }
        }
        
        parsedData.push(dataPoint);
    }
    
    // Retorna um objeto com os dados processados e metadados
    return {
        headers: headers,
        data: parsedData,
        totalLines: lines.length,
        processedLines: parsedData.length,
        isSampled: lines.length > MAX_LINES
    };
}
