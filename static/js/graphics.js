/**
 * Arquivo JavaScript para a funcionalidade de visualização de Gráficos.
 * Este arquivo contém a lógica para a visualização de gráficos dos resultados
 * de cálculos de Emergy, incluindo a criação e atualização de gráficos usando Chart.js.
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Gráficos inicializada');
    
    // Inicializa a visualização de gráficos
    initializeGraphicsVisualization();
});

/**
 * Inicializa a funcionalidade de visualização de gráficos
 */
function initializeGraphicsVisualization() {
    const graphicsContainer = document.querySelector('.graphics-container');
    const chartTypeSelect = document.getElementById('chart-type');
    const updateChartBtn = document.getElementById('update-chart');
    
    // Verifica se temos dados no armazenamento da sessão (isso seria definido pela Calculadora Emergy em um aplicativo real)
    const hasData = checkForEmergyData();
    
    if (hasData) {
        // Habilita controles
        chartTypeSelect.disabled = false;
        updateChartBtn.disabled = false;
        
        // Cria um gráfico de placeholder
        createPlaceholderChart(graphicsContainer);
        
        // Adiciona event listener ao botão de atualização do gráfico
        updateChartBtn.addEventListener('click', function() {
            updateChart(graphicsContainer, chartTypeSelect.value);
        });
    } else {
        // Exibe mensagem de que não há dados disponíveis
        graphicsContainer.innerHTML = `
            <div class="chart-placeholder">
                <p>Nenhum dado disponível para visualização. Por favor, use a Calculadora Emergy para gerar dados primeiro.</p>
                <a href="/emergy-calculator" class="btn">Ir para Calculadora Emergy</a>
            </div>
        `;
    }
}

/**
 * Verifica se os dados de emergy estão disponíveis
 * @returns {boolean} - Se os dados estão disponíveis
 */
function checkForEmergyData() {
    // Em uma aplicação real, isso verificaria o armazenamento da sessão, banco de dados ou API
    // Para este placeholder, vamos apenas retornar false
    return false;
}

/**
 * Cria um gráfico de placeholder
 * @param {HTMLElement} container - O contêiner para criar o gráfico
 */
function createPlaceholderChart(container) {
    // Limpa o contêiner
    container.innerHTML = '';
    
    // Cria um canvas para o gráfico
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    container.appendChild(canvas);
    
    // Cria um gráfico de placeholder usando Chart.js
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5'],
            datasets: [{
                label: 'Valores de Emergy',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Atualiza o gráfico com base no tipo de gráfico selecionado
 * @param {HTMLElement} container - O contêiner com o gráfico
 * @param {string} chartType - O tipo de gráfico a ser exibido
 */
function updateChart(container, chartType) {
    // Em uma aplicação real, isso buscaria os dados e atualizaria o gráfico
    // Para este placeholder, vamos apenas recriar o gráfico com o novo tipo
    
    // Limpa o contêiner
    container.innerHTML = '';
    
    // Cria um canvas para o gráfico
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    container.appendChild(canvas);
    
    // Cria um gráfico de placeholder usando Chart.js
    const ctx = canvas.getContext('2d');
    
    // Dados de exemplo
    const data = {
        labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5'],
        datasets: [{
            label: 'Valores de Emergy',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Cria gráfico com base no tipo selecionado
    new Chart(ctx, {
        type: chartType,
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
