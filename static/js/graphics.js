/**
 * Arquivo JavaScript para a funcionalidade de visualização de Gráficos.
 * Este arquivo contém a lógica para a visualização de gráficos dos resultados
 * de cálculos de Emergy, incluindo a criação e atualização de gráficos usando Chart.js.
 * Atualizado para visualizar dados de consumo de energia de arquivos TXT.
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
    // Para demonstração, vamos retornar true para mostrar os gráficos
    return true;
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
    
    // Cria um gráfico de consumo de energia usando Chart.js
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['17:24', '17:25', '17:26', '17:27', '17:28', '17:29', '17:30', '17:31', '17:32'],
            datasets: [
                {
                    label: 'Potência Ativa (kW)',
                    data: [4.216, 5.360, 5.374, 5.388, 3.666, 3.520, 3.702, 3.700, 3.668],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Potência Reativa (kVAR)',
                    data: [0.418, 0.436, 0.498, 0.502, 0.528, 0.522, 0.520, 0.520, 0.510],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo de Energia ao Longo do Tempo'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Potência (kW/kVAR)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Horário'
                    }
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
    // Limpa o contêiner
    container.innerHTML = '';
    
    // Cria um canvas para o gráfico
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    container.appendChild(canvas);
    
    // Cria um gráfico usando Chart.js
    const ctx = canvas.getContext('2d');
    
    // Dados de exemplo para diferentes tipos de gráficos
    let chartData, chartOptions;
    
    if (chartType === 'line') {
        // Gráfico de linha para mostrar tendências ao longo do tempo
        chartData = {
            labels: ['17:24', '17:25', '17:26', '17:27', '17:28', '17:29', '17:30', '17:31', '17:32'],
            datasets: [
                {
                    label: 'Potência Ativa (kW)',
                    data: [4.216, 5.360, 5.374, 5.388, 3.666, 3.520, 3.702, 3.700, 3.668],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Potência Reativa (kVAR)',
                    data: [0.418, 0.436, 0.498, 0.502, 0.528, 0.522, 0.520, 0.520, 0.510],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
        
        chartOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo de Energia ao Longo do Tempo'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Potência (kW/kVAR)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Horário'
                    }
                }
            }
        };
    } else if (chartType === 'bar') {
        // Gráfico de barras para comparar valores
        chartData = {
            labels: ['Sub Metering 1', 'Sub Metering 2', 'Sub Metering 3'],
            datasets: [{
                label: 'Consumo por Área (Wh)',
                data: [0, 1, 17],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        chartOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo de Energia por Área'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const labels = ['Cozinha', 'Lavanderia', 'Aquecedor de Água e AC'];
                            return 'Área: ' + labels[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumo (Wh)'
                    }
                }
            }
        };
    } else if (chartType === 'pie') {
        // Gráfico de pizza para mostrar distribuição
        chartData = {
            labels: ['Cozinha (Sub Metering 1)', 'Lavanderia (Sub Metering 2)', 'Aquecedor de Água e AC (Sub Metering 3)'],
            datasets: [{
                data: [0, 1, 17],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        chartOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição do Consumo de Energia por Área'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} Wh (${percentage}%)`;
                        }
                    }
                }
            }
        };
    }
    
    // Cria gráfico com base no tipo selecionado
    new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}
