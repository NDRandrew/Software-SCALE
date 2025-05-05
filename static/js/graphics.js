/**
 * Arquivo JavaScript para a funcionalidade de Gráficos.
 * Este arquivo contém a lógica para visualização de gráficos de dados de energia, incluindo
 * Gráficos de Linha de Séries Temporais, Gráficos de Dispersão e Mapas de Calor de Correlação.
 * Otimizado para lidar com grandes conjuntos de dados (mais de 300.000 linhas).
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

// Variáveis globais para armazenar dados analisados e instância atual do gráfico
let parsedData = null;
let currentChart = null;
let isProcessing = false;
let worker = null;

// Constantes para amostragem de dados
const MAX_POINTS_TIME_SERIES = 1000;
const MAX_POINTS_SCATTER = 2000;
const MAX_POINTS_HEATMAP = 5000;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de gráficos inicializada');
    
    // Inicializa a visualização de gráficos
    initializeGraphicsVisualization();
    
    // Inicializa o web worker para processamento de dados
    initWorker();
    
    // Verifica se há dados de energia no sessionStorage (redirecionado da página da calculadora)
    checkForEnergyData();
});

/**
 * Verifica se há dados de energia no sessionStorage e os processa
 */
function checkForEnergyData() {
    const energyDataStr = sessionStorage.getItem('energyData');
    const filename = sessionStorage.getItem('energyDataFilename');
    
    if (energyDataStr) {
        console.log(`Dados de energia encontrados no sessionStorage: ${filename}`);
        
        // Limpa os dados do sessionStorage para evitar processamento duplicado em recargas da página
        sessionStorage.removeItem('energyData');
        sessionStorage.removeItem('energyDataFilename');
        
        try {
            // Converte a string JSON de volta para um objeto
            const energyData = JSON.parse(energyDataStr);
            
            // Processa os dados
            processEnergyData(energyData);
        } catch (error) {
            console.error('Erro ao analisar dados do sessionStorage:', error);
            showError(document.querySelector('.graphics-container'), 'Erro ao analisar dados. Por favor, tente novamente.');
        }
    }
}

/**
 * Processa os dados de energia e cria os gráficos
 * @param {Object} processedData - Os dados de energia processados
 */
function processEnergyData(processedData) {
    // Mostra indicador de carregamento
    showLoadingIndicator('Processando dados de energia...');
    
    // Desativa controles durante o processamento
    disableControls();
    
    try {
        // Extrai os dados do objeto processado
        parsedData = processedData.data;
        
        // Adiciona informações sobre amostragem, se aplicável
        if (processedData.isSampled) {
            console.log(`Dados amostrados: ${processedData.processedLines} de ${processedData.totalLines} linhas`);
            
            // Adiciona uma mensagem de aviso sobre amostragem
            const graphicsContainer = document.querySelector('.graphics-container');
            const samplingWarning = document.createElement('div');
            samplingWarning.className = 'sampling-warning';
            samplingWarning.style.backgroundColor = '#fff3cd';
            samplingWarning.style.color = '#856404';
            samplingWarning.style.padding = '10px';
            samplingWarning.style.borderRadius = '5px';
            samplingWarning.style.marginBottom = '20px';
            samplingWarning.style.textAlign = 'center';
            samplingWarning.innerHTML = `
                <strong>Nota:</strong> O arquivo é muito grande (${processedData.totalLines.toLocaleString()} linhas). 
                Mostrando uma amostra de ${processedData.processedLines.toLocaleString()} linhas para melhor desempenho.
            `;
            
            // Insere o aviso no início do container
            if (graphicsContainer.firstChild) {
                graphicsContainer.insertBefore(samplingWarning, graphicsContainer.firstChild);
            } else {
                graphicsContainer.appendChild(samplingWarning);
            }
        }
        
        // Ativa controles após o carregamento dos dados
        enableControls();
        hideLoadingIndicator();
        
        // Cria o gráfico inicial (Time Series por padrão)
        createTimeSeriesChart(document.querySelector('.graphics-container'), parsedData);
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        showError(document.querySelector('.graphics-container'), 'Erro ao processar dados. Verifique se o arquivo está no formato correto.');
        hideLoadingIndicator();
    }
}

/**
 * Inicializa um web worker para processamento de dados
 */
function initWorker() {
    // Create a blob URL for the worker script
    const workerScript = `
        self.onmessage = function(e) {
            const { action, data } = e.data;
            
            if (action === 'parse') {
                const result = parseData(data.fileContent);
                self.postMessage({ action: 'parseComplete', data: result });
            } else if (action === 'correlationMatrix') {
                const result = calculateCorrelationMatrix(data.parsedData, data.fields);
                self.postMessage({ action: 'correlationMatrixComplete', data: result });
            }
        };
        
        function parseData(data) {
            // Split the data into lines
            const lines = data.trim().split('\\n');
            
            // Determine the separator (semicolon or space)
            let separator = ';';
            const firstLine = lines[0];
            
            // Check if this is a .txt file with the expected fields
            const expectedFields = ['Date', 'Time', 'Global_active_power', 'Global_reactive_power', 
                                   'Voltage', 'Global_intensity', 'Sub_metering_1', 
                                   'Sub_metering_2', 'Sub_metering_3'];
            
            // Try to detect the separator
            if (firstLine.includes(';')) {
                separator = ';';
            } else if (firstLine.includes(',')) {
                separator = ',';
            } else if (firstLine.includes('\\t')) {
                separator = '\\t';
            } else {
                // If no common separator is found, assume it's space-separated
                separator = ' ';
            }
            
            // Extract headers (first line)
            let headers = lines[0].split(separator);
            
            // If the headers don't match expected fields, use the expected fields
            // This is useful for .txt files that might not have headers
            const headerMatch = headers.some(header => 
                expectedFields.includes(header.trim())
            );
            
            let startIndex = 0;
            if (!headerMatch) {
                headers = expectedFields;
                // Start parsing from the first line if headers aren't present
                startIndex = 0;
            } else {
                // Start parsing from the second line if headers are present
                startIndex = 1;
            }
            
            // Parse the data lines
            const parsedData = [];
            const totalLines = lines.length;
            
            // Process in chunks to avoid blocking
            const chunkSize = 10000;
            for (let i = startIndex; i < totalLines; i += chunkSize) {
                const endIndex = Math.min(i + chunkSize, totalLines);
                
                for (let j = i; j < endIndex; j++) {
                    // Skip empty lines
                    if (!lines[j].trim()) continue;
                    
                    const values = lines[j].split(separator);
                    
                    // Skip lines that don't have enough values
                    if (values.length < 3) continue; // At least need date, time, and some values
                    
                    const dataPoint = {};
                    for (let k = 0; k < Math.min(headers.length, values.length); k++) {
                        const header = headers[k].trim();
                        // Convert numeric values to numbers
                        const value = values[k].replace(',', '.').trim();
                        
                        if (header !== 'Date' && header !== 'Time') {
                            dataPoint[header] = parseFloat(value) || 0; // Default to 0 if parsing fails
                        } else {
                            dataPoint[header] = value;
                        }
                    }
                    
                    parsedData.push(dataPoint);
                }
                
                // Report progress
                const progress = Math.min(100, Math.round((endIndex / totalLines) * 100));
                self.postMessage({ action: 'progress', data: progress });
            }
            
            return parsedData;
        }
        
        function calculateCorrelationMatrix(data, fields) {
            const n = fields.length;
            const matrix = Array(n).fill().map(() => Array(n).fill(0));
            
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i === j) {
                        matrix[i][j] = 1; // Correlation of a variable with itself is 1
                    } else {
                        matrix[i][j] = calculateCorrelation(
                            data.map(item => item[fields[i]]),
                            data.map(item => item[fields[j]])
                        );
                    }
                }
                
                // Report progress
                const progress = Math.min(100, Math.round(((i + 1) / n) * 100));
                self.postMessage({ action: 'correlationProgress', data: progress });
            }
            
            return matrix;
        }
        
        function calculateCorrelation(x, y) {
            const n = x.length;
            
            // Calculate means
            const meanX = x.reduce((sum, val) => sum + val, 0) / n;
            const meanY = y.reduce((sum, val) => sum + val, 0) / n;
            
            // Calculate covariance and standard deviations
            let covariance = 0;
            let varX = 0;
            let varY = 0;
            
            for (let i = 0; i < n; i++) {
                const diffX = x[i] - meanX;
                const diffY = y[i] - meanY;
                covariance += diffX * diffY;
                varX += diffX * diffX;
                varY += diffY * diffY;
            }
            
            // Avoid division by zero
            if (varX === 0 || varY === 0) return 0;
            
            // Calculate correlation
            return covariance / Math.sqrt(varX * varY);
        }
    `;
    
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Create the worker
    worker = new Worker(workerUrl);
    
    // Set up message handler
    worker.onmessage = function(e) {
        const { action, data } = e.data;
        
        if (action === 'parseComplete') {
            parsedData = data;
            hideLoadingIndicator();
            enableControls();
            createTimeSeriesChart(document.querySelector('.graphics-container'), sampleData(parsedData, MAX_POINTS_TIME_SERIES));
        } else if (action === 'progress') {
            updateLoadingProgress(data);
        } else if (action === 'correlationMatrixComplete') {
            hideLoadingIndicator();
            createHeatmapFromMatrix(document.querySelector('.graphics-container'), data, getNumericFields(parsedData[0]));
        } else if (action === 'correlationProgress') {
            updateLoadingProgress(data);
        }
    };
    
    // Handle worker errors
    worker.onerror = function(error) {
        console.error('Worker error:', error);
        showError(document.querySelector('.graphics-container'), 'Error processing data. Please try again with a smaller file.');
        hideLoadingIndicator();
    };
}

/**
 * Initializes the graphics visualization functionality
 */
function initializeGraphicsVisualization() {
    const graphicsContainer = document.querySelector('.graphics-container');
    const chartTypeSelect = document.getElementById('chart-type');
    const updateChartBtn = document.getElementById('update-chart');
    const dataFileInput = document.getElementById('data-file');
    const timeRangeControls = document.getElementById('time-range-controls');
    
    // Create loading indicator
    createLoadingIndicator(graphicsContainer);
    
    // Enable controls for file upload
    dataFileInput.disabled = false;
    
    // For testing purposes, show the time range controls
    if (timeRangeControls) {
        timeRangeControls.style.display = 'block';
        
        // Get the time range selectors
        const startTimeSelect = document.getElementById('start-time');
        const endTimeSelect = document.getElementById('end-time');
        const updateTimeRangeBtn = document.getElementById('update-time-range');
        
        // Enable the controls
        if (startTimeSelect) startTimeSelect.disabled = false;
        if (endTimeSelect) endTimeSelect.disabled = false;
        if (updateTimeRangeBtn) updateTimeRangeBtn.disabled = false;
        
        // Add some sample times for testing
        const sampleTimes = ['00:00:00', '06:00:00', '12:00:00', '18:00:00', '23:59:59'];
        
        if (startTimeSelect && endTimeSelect) {
            // Clear existing options
            startTimeSelect.innerHTML = '';
            endTimeSelect.innerHTML = '';
            
            // Add sample times
            sampleTimes.forEach((time, index) => {
                const startOption = document.createElement('option');
                startOption.value = time;
                startOption.textContent = time;
                // Select first time by default
                if (index === 0) {
                    startOption.selected = true;
                }
                startTimeSelect.appendChild(startOption);
                
                const endOption = document.createElement('option');
                endOption.value = time;
                endOption.textContent = time;
                // Select last time by default
                if (index === sampleTimes.length - 1) {
                    endOption.selected = true;
                }
                endTimeSelect.appendChild(endOption);
            });
        }
    }
    
    // Add event listener for file upload
    dataFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // Show loading indicator
            showLoadingIndicator('Reading file...');
            
            // Disable controls during processing
            disableControls();
            
            readFile(file)
                .then(data => {
                    // Update loading message
                    updateLoadingMessage('Processing data...');
                    
                    // Use web worker for large files
                    if (data.length > 1000000) { // ~1MB
                        // Process in web worker
                        worker.postMessage({
                            action: 'parse',
                            data: {
                                fileContent: data
                            }
                        });
                    } else {
                        // Process in main thread for smaller files
                        try {
                            parsedData = parseData(data);
                            
                            // Enable controls once data is loaded
                            enableControls();
                            hideLoadingIndicator();
                            
                            // Create initial chart (Time Series by default)
                            createTimeSeriesChart(graphicsContainer, sampleData(parsedData, MAX_POINTS_TIME_SERIES));
                        } catch (error) {
                            console.error('Error parsing data:', error);
                            showError(graphicsContainer, 'Error parsing data. Please make sure the file has the correct format.');
                            hideLoadingIndicator();
                        }
                    }
                })
                .catch(error => {
                    console.error('Error reading file:', error);
                    showError(graphicsContainer, 'Error reading file. Please make sure it has the correct format.');
                    hideLoadingIndicator();
                    enableControls();
                });
        }
    });
    
    // Add event listener to update chart button
    updateChartBtn.addEventListener('click', function() {
        if (!parsedData) {
            showError(graphicsContainer, 'No data available. Please upload a file first.');
            return;
        }
        
        if (isProcessing) {
            showError(graphicsContainer, 'Please wait for the current operation to complete.');
            return;
        }
        
        const chartType = chartTypeSelect.value;
        
        // Show loading indicator for potentially slow operations
        if (chartType === 'heatmap' && parsedData.length > 10000) {
            showLoadingIndicator('Calculating correlation matrix...');
            isProcessing = true;
            
            // Use web worker for correlation matrix calculation
            const numericFields = getNumericFields(parsedData[0]);
            const sampledData = sampleData(parsedData, MAX_POINTS_HEATMAP);
            
            worker.postMessage({
                action: 'correlationMatrix',
                data: {
                    parsedData: sampledData,
                    fields: numericFields
                }
            });
        } else {
            updateChart(graphicsContainer, chartType);
        }
    });
}

/**
 * Creates a loading indicator in the container
 * @param {HTMLElement} container - The container for the loading indicator
 */
function createLoadingIndicator(container) {
    // Create loading indicator if it doesn't exist
    if (!document.getElementById('loading-indicator')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.style.display = 'none';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        loadingDiv.style.padding = '20px';
        loadingDiv.style.borderRadius = '5px';
        loadingDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        loadingDiv.style.zIndex = '1000';
        loadingDiv.style.textAlign = 'center';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.animation = 'spin 2s linear infinite';
        spinner.style.margin = '0 auto 10px auto';
        
        const loadingText = document.createElement('p');
        loadingText.id = 'loading-text';
        loadingText.textContent = 'Loading...';
        
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.backgroundColor = '#ddd';
        progressContainer.style.marginTop = '10px';
        progressContainer.style.borderRadius = '5px';
        progressContainer.style.overflow = 'hidden';
        
        const progressBar = document.createElement('div');
        progressBar.id = 'loading-progress';
        progressBar.style.width = '0%';
        progressBar.style.height = '10px';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.transition = 'width 0.3s';
        
        progressContainer.appendChild(progressBar);
        loadingDiv.appendChild(spinner);
        loadingDiv.appendChild(loadingText);
        loadingDiv.appendChild(progressContainer);
        
        // Add the loading indicator to the body
        document.body.appendChild(loadingDiv);
        
        // Add the spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Shows the loading indicator with a message
 * @param {string} message - The message to display
 */
function showLoadingIndicator(message = 'Loading...') {
    const loadingIndicator = document.getElementById('loading-indicator');
    const loadingText = document.getElementById('loading-text');
    const loadingProgress = document.getElementById('loading-progress');
    
    if (loadingIndicator && loadingText) {
        loadingText.textContent = message;
        loadingProgress.style.width = '0%';
        loadingIndicator.style.display = 'block';
    }
}

/**
 * Updates the loading message
 * @param {string} message - The new message to display
 */
function updateLoadingMessage(message) {
    const loadingText = document.getElementById('loading-text');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
}

/**
 * Updates the loading progress bar
 * @param {number} progress - The progress percentage (0-100)
 */
function updateLoadingProgress(progress) {
    const loadingProgress = document.getElementById('loading-progress');
    
    if (loadingProgress) {
        loadingProgress.style.width = `${progress}%`;
    }
}

/**
 * Hides the loading indicator
 */
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    isProcessing = false;
}

/**
 * Disables the controls during processing
 */
function disableControls() {
    const chartTypeSelect = document.getElementById('chart-type');
    const updateChartBtn = document.getElementById('update-chart');
    const dataFileInput = document.getElementById('data-file');
    
    if (chartTypeSelect) chartTypeSelect.disabled = true;
    if (updateChartBtn) updateChartBtn.disabled = true;
    if (dataFileInput) dataFileInput.disabled = true;
}

/**
 * Enables the controls after processing
 */
function enableControls() {
    const chartTypeSelect = document.getElementById('chart-type');
    const updateChartBtn = document.getElementById('update-chart');
    const dataFileInput = document.getElementById('data-file');
    
    if (chartTypeSelect) chartTypeSelect.disabled = false;
    if (updateChartBtn) updateChartBtn.disabled = false;
    if (dataFileInput) dataFileInput.disabled = false;
}

/**
 * Gets the numeric fields from a data point
 * @param {Object} dataPoint - A single data point
 * @returns {Array} - Array of numeric field names
 */
function getNumericFields(dataPoint) {
    return Object.keys(dataPoint).filter(key => 
        key !== 'Date' && key !== 'Time' && key !== 'DateTime'
    );
}

/**
 * Samples the data to reduce the number of points
 * @param {Array} data - The full dataset
 * @param {number} maxPoints - The maximum number of points to include
 * @returns {Array} - The sampled dataset
 */
function sampleData(data, maxPoints) {
    if (!data || data.length === 0) return [];
    
    // If data is smaller than maxPoints, return all data
    if (data.length <= maxPoints) return data;
    
    const sampledData = [];
    const step = Math.ceil(data.length / maxPoints);
    
    for (let i = 0; i < data.length; i += step) {
        sampledData.push(data[i]);
    }
    
    return sampledData;
}

/**
 * Creates a heatmap from a correlation matrix
 * @param {HTMLElement} container - The container for the chart
 * @param {Array} matrix - The correlation matrix
 * @param {Array} fields - The field names
 */
function createHeatmapFromMatrix(container, matrix, fields) {
    // Clear the container
    container.innerHTML = '';
    
    // Create a canvas for the chart
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    container.appendChild(canvas);
    
    // Prepare data for the heatmap
    const heatmapData = [];
    for (let i = 0; i < fields.length; i++) {
        for (let j = 0; j < fields.length; j++) {
            heatmapData.push({
                x: fields[j],
                y: fields[i],
                v: matrix[i][j]
            });
        }
    }
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: 'Correlation Matrix',
                data: heatmapData,
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = Math.abs(value);
                    return value > 0 
                        ? `rgba(0, 0, 255, ${alpha})` 
                        : `rgba(255, 0, 0, ${alpha})`;
                },
                borderColor: 'white',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / fields.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / fields.length - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Correlation Heatmap'
                },
                tooltip: {
                    callbacks: {
                        title() {
                            return '';
                        },
                        label(context) {
                            const v = context.dataset.data[context.dataIndex];
                            return [
                                `${v.y} vs ${v.x}`,
                                `Correlation: ${v.v.toFixed(2)}`
                            ];
                        }
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    formatter: (value, context) => {
                        return value.v.toFixed(2);
                    },
                    color: function(context) {
                        const value = context.dataset.data[context.dataIndex].v;
                        return Math.abs(value) > 0.5 ? 'white' : 'black';
                    },
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: fields,
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'category',
                    labels: fields,
                    offset: true,
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    
    // Adjust canvas height to make it square
    canvas.parentNode.style.height = '600px';
}

/**
 * Reads the uploaded file and returns its contents
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - Promise resolving to the file contents
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        
        reader.onerror = function(event) {
            reject(new Error('File could not be read'));
        };
        
        reader.readAsText(file);
    });
}

/**
 * Parses the data from the file
 * @param {string} data - The raw data from the file
 * @returns {Array} - Array of parsed data objects
 */
function parseData(data) {
    // Split the data into lines
    const lines = data.trim().split('\n');
    
    // Determine the separator (semicolon or space)
    let separator = ';';
    const firstLine = lines[0];
    
    // Check if this is a .txt file with the expected fields
    const expectedFields = ['Date', 'Time', 'Global_active_power', 'Global_reactive_power', 
                           'Voltage', 'Global_intensity', 'Sub_metering_1', 
                           'Sub_metering_2', 'Sub_metering_3'];
    
    // Try to detect the separator
    if (firstLine.includes(';')) {
        separator = ';';
    } else if (firstLine.includes(',')) {
        separator = ',';
    } else if (firstLine.includes('\t')) {
        separator = '\t';
    } else {
        // If no common separator is found, assume it's space-separated
        separator = ' ';
    }
    
    // Extract headers (first line)
    let headers = lines[0].split(separator);
    
    // If the headers don't match expected fields, use the expected fields
    // This is useful for .txt files that might not have headers
    const headerMatch = headers.some(header => 
        expectedFields.includes(header.trim())
    );
    
    let startIndex = 0;
    if (!headerMatch) {
        headers = expectedFields;
        // Start parsing from the first line if headers aren't present
        startIndex = 0;
    } else {
        // Start parsing from the second line if headers are present
        startIndex = 1;
    }
    
    // Parse the data lines
    const parsedData = [];
    for (let i = startIndex; i < lines.length; i++) {
        // Skip empty lines
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(separator);
        
        // Skip lines that don't have enough values
        if (values.length < 3) continue; // At least need date, time, and some values
        
        const dataPoint = {};
        for (let j = 0; j < Math.min(headers.length, values.length); j++) {
            const header = headers[j].trim();
            // Convert numeric values to numbers
            const value = values[j].replace(',', '.').trim();
            
            if (header !== 'Date' && header !== 'Time') {
                dataPoint[header] = parseFloat(value) || 0; // Default to 0 if parsing fails
            } else {
                dataPoint[header] = value;
            }
        }
        
        // Combine Date and Time into a single datetime field
        if (dataPoint['Date'] && dataPoint['Time']) {
            try {
                dataPoint['DateTime'] = new Date(`${dataPoint['Date']} ${dataPoint['Time']}`);
            } catch (e) {
                console.error('Error parsing date:', e);
                // Use current date as fallback
                dataPoint['DateTime'] = new Date();
            }
        }
        
        parsedData.push(dataPoint);
    }
    
    return parsedData;
}

/**
 * Updates the chart based on the selected chart type
 * @param {HTMLElement} container - The container for the chart
 * @param {string} chartType - The type of chart to create
 */
function updateChart(container, chartType) {
    // Destroy existing chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Sample data based on chart type for better performance
    let sampledData;
    
    switch (chartType) {
        case 'timeseries':
            sampledData = sampleData(parsedData, MAX_POINTS_TIME_SERIES);
            createTimeSeriesChart(container, sampledData);
            break;
        case 'scatter':
            sampledData = sampleData(parsedData, MAX_POINTS_SCATTER);
            createScatterPlot(container, sampledData);
            break;
        case 'heatmap':
            // For smaller datasets, process in main thread
            if (parsedData.length <= 10000) {
                sampledData = sampleData(parsedData, MAX_POINTS_HEATMAP);
                createCorrelationHeatmap(container, sampledData);
            } else {
                // For larger datasets, processing is handled by the web worker
                // (This case is handled in the event listener for the update button)
                showLoadingIndicator('Preparing heatmap...');
            }
            break;
        default:
            sampledData = sampleData(parsedData, MAX_POINTS_TIME_SERIES);
            createTimeSeriesChart(container, sampledData);
    }
    
    // Update the data summary section
    if (parsedData && parsedData.length > 0) {
        // Get the data summary container
        const dataSummaryContainer = document.getElementById('data-summary-container');
        const dataSummarySection = document.querySelector('.data-summary-section');
        
        if (dataSummaryContainer && dataSummarySection) {
            // Clear existing content
            dataSummaryContainer.innerHTML = '';
            
            // Add data summary to the dedicated section
            addDataSummaryPanel(dataSummaryContainer, parsedData, sampledData);
            
            // Show the data summary section
            dataSummarySection.style.display = 'block';
        }
    }
}

/**
 * Creates a Time Series Line Chart
 * @param {HTMLElement} container - The container for the chart
 * @param {Array} data - The parsed data
 */
function createTimeSeriesChart(container, data) {
    // Clear the container
    container.innerHTML = '';
    
    // Show time range controls in the controls section
    const timeRangeControls = document.getElementById('time-range-controls');
    timeRangeControls.style.display = 'block';
    
    // Get the time range elements
    const timeRangeMin = document.getElementById('time-range-min');
    const timeRangeMax = document.getElementById('time-range-max');
    const sliderMinHandle = document.getElementById('slider-min-handle');
    const sliderMaxHandle = document.getElementById('slider-max-handle');
    const sliderRange = document.getElementById('slider-range');
    const timeTicks = document.getElementById('time-ticks');
    const updateTimeRangeBtn = document.getElementById('update-time-range');
    
    // Enable the update button
    updateTimeRangeBtn.disabled = false;
    
    // Get unique times from data
    const uniqueTimes = [...new Set(data.map(item => item.Time))].sort();
    
    // Store the times for later use
    window.timeRangeData = {
        times: uniqueTimes,
        currentMinIndex: 0,
        currentMaxIndex: uniqueTimes.length - 1,
        sliderWidth: document.querySelector('.range-slider-container').offsetWidth - 18, // Subtract handle width
    };
    
    // Set initial values
    timeRangeMin.textContent = uniqueTimes[0];
    timeRangeMax.textContent = uniqueTimes[uniqueTimes.length - 1];
    
    // Position the handles
    sliderMinHandle.style.left = '0%';
    sliderMaxHandle.style.left = '100%';
    sliderRange.style.left = '0%';
    sliderRange.style.width = '100%';
    
    // Create time ticks
    timeTicks.innerHTML = '';
    
    // Add ticks for better visualization (max 10 ticks)
    const tickCount = Math.min(10, uniqueTimes.length);
    const tickStep = Math.max(1, Math.floor(uniqueTimes.length / tickCount));
    
    for (let i = 0; i < uniqueTimes.length; i += tickStep) {
        if (i < uniqueTimes.length) {
            const tick = document.createElement('div');
            tick.textContent = uniqueTimes[i];
            timeTicks.appendChild(tick);
        }
    }
    
    // Make sure the last tick is always shown
    if (uniqueTimes.length > 1 && timeTicks.children.length > 0) {
        const lastTick = document.createElement('div');
        lastTick.textContent = uniqueTimes[uniqueTimes.length - 1];
        timeTicks.appendChild(lastTick);
    }
    
    // Initialize drag functionality for the min handle
    initDragHandle(sliderMinHandle, (newLeft) => {
        // Calculate the new index based on position
        const newIndex = Math.round((newLeft / window.timeRangeData.sliderWidth) * (uniqueTimes.length - 1));
        const boundedIndex = Math.max(0, Math.min(newIndex, window.timeRangeData.currentMaxIndex - 1));
        
        // Update the current min index
        window.timeRangeData.currentMinIndex = boundedIndex;
        
        // Update the min time display
        timeRangeMin.textContent = uniqueTimes[boundedIndex];
        
        // Update the range display
        updateRangeDisplay();
    });
    
    // Initialize drag functionality for the max handle
    initDragHandle(sliderMaxHandle, (newLeft) => {
        // Calculate the new index based on position
        const newIndex = Math.round((newLeft / window.timeRangeData.sliderWidth) * (uniqueTimes.length - 1));
        const boundedIndex = Math.max(window.timeRangeData.currentMinIndex + 1, Math.min(newIndex, uniqueTimes.length - 1));
        
        // Update the current max index
        window.timeRangeData.currentMaxIndex = boundedIndex;
        
        // Update the max time display
        timeRangeMax.textContent = uniqueTimes[boundedIndex];
        
        // Update the range display
        updateRangeDisplay();
    });
    
    // Function to update the range display
    function updateRangeDisplay() {
        const minPercent = (window.timeRangeData.currentMinIndex / (uniqueTimes.length - 1)) * 100;
        const maxPercent = (window.timeRangeData.currentMaxIndex / (uniqueTimes.length - 1)) * 100;
        
        sliderRange.style.left = minPercent + '%';
        sliderRange.style.width = (maxPercent - minPercent) + '%';
    }
    
    // Function to initialize drag functionality for a handle
    function initDragHandle(handle, onDrag) {
        let isDragging = false;
        let startX, startLeft;
        
        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            
            // Get the starting position
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
            } else {
                startX = e.clientX;
            }
            
            startLeft = parseFloat(handle.style.left) / 100 * window.timeRangeData.sliderWidth;
            
            // Add event listeners for drag and end
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Calculate the new position
            let clientX;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            const deltaX = clientX - startX;
            let newLeft = Math.max(0, Math.min(startLeft + deltaX, window.timeRangeData.sliderWidth));
            
            // Update the handle position
            handle.style.left = (newLeft / window.timeRangeData.sliderWidth * 100) + '%';
            
            // Call the callback with the new position
            onDrag(newLeft);
        }
        
        function endDrag() {
            isDragging = false;
            
            // Remove event listeners
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
        }
    }
    
    // Create chart containers with better layout - larger for 2M+ data points
    const chartsContainer = document.createElement('div');
    chartsContainer.style.display = 'flex';
    chartsContainer.style.flexDirection = 'column';
    chartsContainer.style.gap = '40px'; // Increased gap between charts
    chartsContainer.style.width = '100%'; // Ensure full width
    
    // Create first chart container with title
    const mainChartSection = document.createElement('div');
    mainChartSection.style.width = '100%';
    
    const mainChartTitle = document.createElement('h3');
    mainChartTitle.textContent = 'Consumo de Energia ao Longo do Tempo';
    mainChartTitle.style.textAlign = 'center';
    mainChartTitle.style.marginBottom = '15px';
    mainChartTitle.style.color = '#2c3e50';
    mainChartTitle.style.fontSize = '20px';
    mainChartSection.appendChild(mainChartTitle);
    
    // Create first chart container - much larger for better readability
    const mainChartContainer = document.createElement('div');
    mainChartContainer.style.width = '100%';
    mainChartContainer.style.height = '500px'; // Increased height for better visibility
    mainChartContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    mainChartContainer.style.borderRadius = '8px';
    mainChartContainer.style.padding = '15px';
    mainChartContainer.style.backgroundColor = '#fff';
    mainChartContainer.style.boxSizing = 'border-box'; // Include padding in width calculation
    
    // Create a canvas for the main chart
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mainChartContainer.appendChild(canvas);
    
    mainChartSection.appendChild(mainChartContainer);
    
    // Create second chart container with title
    const subMeteringSection = document.createElement('div');
    subMeteringSection.style.width = '100%';
    
    const subMeteringTitle = document.createElement('h3');
    subMeteringTitle.textContent = 'Consumo de Energia Sub-Medição';
    subMeteringTitle.style.textAlign = 'center';
    subMeteringTitle.style.marginBottom = '15px';
    subMeteringTitle.style.color = '#2c3e50';
    subMeteringTitle.style.fontSize = '20px';
    subMeteringSection.appendChild(subMeteringTitle);
    
    // Create second chart container - much larger for better readability
    const subMeteringContainer = document.createElement('div');
    subMeteringContainer.style.width = '100%';
    subMeteringContainer.style.height = '500px'; // Increased height for better visibility
    subMeteringContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    subMeteringContainer.style.borderRadius = '8px';
    subMeteringContainer.style.padding = '15px';
    subMeteringContainer.style.backgroundColor = '#fff';
    subMeteringContainer.style.boxSizing = 'border-box'; // Include padding in width calculation
    
    // Create a canvas for the sub-metering chart
    const subMeteringCanvas = document.createElement('canvas');
    subMeteringCanvas.id = 'sub-metering-chart';
    subMeteringCanvas.style.width = '100%';
    subMeteringCanvas.style.height = '100%';
    subMeteringContainer.appendChild(subMeteringCanvas);
    
    // Add chart containers to the main container
    chartsContainer.appendChild(mainChartSection);
    chartsContainer.appendChild(subMeteringSection);
    
    // Add the sub-metering canvas to its container
    subMeteringSection.appendChild(subMeteringContainer);
    container.appendChild(chartsContainer);
    
    // Function to filter data by time range
    function filterDataByTimeRange(startTime, endTime) {
        return data.filter(item => {
            return item.Time >= startTime && item.Time <= endTime;
        });
    }
    
    // Function to update charts with filtered data
    function updateCharts() {
        const startTime = uniqueTimes[window.timeRangeData.currentMinIndex];
        const endTime = uniqueTimes[window.timeRangeData.currentMaxIndex];
        
        // Filter data by selected time range
        const filteredData = filterDataByTimeRange(startTime, endTime);
        
        // Update charts with filtered data
        renderCharts(filteredData);
    }
    
    // Function to render both charts
    function renderCharts(chartData) {
        // Prepare data for the chart
        const timeLabels = chartData.map(item => {
            if (item.Time) {
                return item.Time;
            } else if (item.DateTime) {
                return item.DateTime.toLocaleTimeString();
            }
            return '';
        });
        
        // Create datasets for the main chart
        const datasets = [
            {
                label: 'Global Active Power (kW)',
                data: chartData.map(item => item.Global_active_power),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'Global Reactive Power (kVAR)',
                data: chartData.map(item => item.Global_reactive_power),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'Voltage (V)',
                data: chartData.map(item => item.Voltage),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 2,
                tension: 0.1,
                hidden: true
            },
            {
                label: 'Global Intensity (A)',
                data: chartData.map(item => item.Global_intensity),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.1,
                hidden: true
            }
        ];
        
        // Destroy existing chart if it exists
        if (currentChart) {
            currentChart.destroy();
        }
        
        // Create the main chart
        const ctx = canvas.getContext('2d');
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Energy Consumption Over Time'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
        
        // Destroy existing sub-metering chart if it exists
        if (window.subMeteringChart) {
            window.subMeteringChart.destroy();
        }
        
        // Create the sub-metering chart
        const subMeteringCtx = subMeteringCanvas.getContext('2d');
        window.subMeteringChart = new Chart(subMeteringCtx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: 'Sub Metering 1 (Wh)',
                        data: chartData.map(item => item.Sub_metering_1),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        tension: 0.1
                    },
                    {
                        label: 'Sub Metering 2 (Wh)',
                        data: chartData.map(item => item.Sub_metering_2),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        tension: 0.1
                    },
                    {
                        label: 'Sub Metering 3 (Wh)',
                        data: chartData.map(item => item.Sub_metering_3),
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderWidth: 2,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sub-Metering Energy Consumption'
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
                            text: 'Energy (Wh)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
    }
    
    // Add event listener to the update time range button
    updateTimeRangeBtn.addEventListener('click', updateCharts);
    
    // Initial render with all data
    renderCharts(data);
}

/**
 * Creates a Scatter Plot
 * @param {HTMLElement} container - The container for the chart
 * @param {Array} data - The parsed data
 */
function createScatterPlot(container, data) {
    // Clear the container
    container.innerHTML = '';
    
    // Create a canvas for the chart
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    canvas.style.height = '600px';
    container.appendChild(canvas);
    
    // Get available numeric fields (excluding Date and Time)
    const numericFields = Object.keys(data[0]).filter(key => 
        key !== 'Date' && key !== 'Time' && key !== 'DateTime'
    );
    
    // Fixed X and Y fields as requested
    const xField = 'Global_intensity';
    const yField = 'Global_active_power';
    
    // Prepare data for the chart
    const scatterData = data.map(item => ({
        x: item[xField],
        y: item[yField]
    }));
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: `${yField} vs ${xField}`,
                data: scatterData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Gráfico de Dispersão: ${yField} vs ${xField}`,
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${xField}: ${context.parsed.x}, ${yField}: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xField,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yField,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
    
    // Add regression line if there are enough data points
    if (scatterData.length > 2) {
        addRegressionLine(scatterData, xField, yField);
    }
    
    // Function to add a regression line to the scatter plot
    function addRegressionLine(scatterData, xField, yField) {
        // Calculate linear regression
        const n = scatterData.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += scatterData[i].x;
            sumY += scatterData[i].y;
            sumXY += scatterData[i].x * scatterData[i].y;
            sumXX += scatterData[i].x * scatterData[i].x;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Find min and max x values
        const xValues = scatterData.map(point => point.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        
        // Create regression line data
        const regressionData = [
            { x: minX, y: slope * minX + intercept },
            { x: maxX, y: slope * maxX + intercept }
        ];
        
        // Add regression line to the chart
        currentChart.data.datasets.push({
            label: 'Linha de Regressão',
            data: regressionData,
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0
        });
        
        // Calculate R-squared
        const meanY = sumY / n;
        let totalVariation = 0;
        let residualVariation = 0;
        
        for (let i = 0; i < n; i++) {
            totalVariation += Math.pow(scatterData[i].y - meanY, 2);
            const predictedY = slope * scatterData[i].x + intercept;
            residualVariation += Math.pow(scatterData[i].y - predictedY, 2);
        }
        
        const rSquared = 1 - (residualVariation / totalVariation);
        
        // Add R-squared to the chart title
        currentChart.options.plugins.title.text = 
            `Gráfico de Dispersão: ${yField} vs ${xField} (R² = ${rSquared.toFixed(3)})`;
        
        currentChart.update();
    }
}

/**
 * Creates a Correlation Heatmap
 * @param {HTMLElement} container - The container for the chart
 * @param {Array} data - The parsed data
 */
function createCorrelationHeatmap(container, data) {
    // Clear the container
    container.innerHTML = '';
    
    // Create a canvas for the chart
    const canvas = document.createElement('canvas');
    canvas.id = 'emergy-chart';
    container.appendChild(canvas);
    
    // Get numeric fields for correlation
    const numericFields = Object.keys(data[0]).filter(key => 
        key !== 'Date' && key !== 'Time' && key !== 'DateTime'
    );
    
    // Calculate correlation matrix
    const correlationMatrix = calculateCorrelationMatrix(data, numericFields);
    
    // Prepare data for the heatmap
    const heatmapData = [];
    for (let i = 0; i < numericFields.length; i++) {
        for (let j = 0; j < numericFields.length; j++) {
            heatmapData.push({
                x: numericFields[j],
                y: numericFields[i],
                v: correlationMatrix[i][j]
            });
        }
    }
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: 'Correlation Matrix',
                data: heatmapData,
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = Math.abs(value);
                    return value > 0 
                        ? `rgba(0, 0, 255, ${alpha})` 
                        : `rgba(255, 0, 0, ${alpha})`;
                },
                borderColor: 'white',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / numericFields.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / numericFields.length - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Correlation Heatmap'
                },
                tooltip: {
                    callbacks: {
                        title() {
                            return '';
                        },
                        label(context) {
                            const v = context.dataset.data[context.dataIndex];
                            return [
                                `${v.y} vs ${v.x}`,
                                `Correlation: ${v.v.toFixed(2)}`
                            ];
                        }
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    formatter: (value, context) => {
                        return value.v.toFixed(2);
                    },
                    color: function(context) {
                        const value = context.dataset.data[context.dataIndex].v;
                        return Math.abs(value) > 0.5 ? 'white' : 'black';
                    },
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: numericFields,
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'category',
                    labels: numericFields,
                    offset: true,
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    
    // Adjust canvas height to make it square
    canvas.parentNode.style.height = '600px';
}

/**
 * Calculates the correlation matrix for the given data and fields
 * @param {Array} data - The parsed data
 * @param {Array} fields - The fields to calculate correlation for
 * @returns {Array} - The correlation matrix
 */
function calculateCorrelationMatrix(data, fields) {
    const n = fields.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 1; // Correlation of a variable with itself is 1
            } else {
                matrix[i][j] = calculateCorrelation(
                    data.map(item => item[fields[i]]),
                    data.map(item => item[fields[j]])
                );
            }
        }
    }
    
    return matrix;
}

/**
 * Calculates the Pearson correlation coefficient between two arrays
 * @param {Array} x - First array of values
 * @param {Array} y - Second array of values
 * @returns {number} - The correlation coefficient
 */
function calculateCorrelation(x, y) {
    const n = x.length;
    
    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate covariance and standard deviations
    let covariance = 0;
    let varX = 0;
    let varY = 0;
    
    for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;
        covariance += diffX * diffY;
        varX += diffX * diffX;
        varY += diffY * diffY;
    }
    
    // Avoid division by zero
    if (varX === 0 || varY === 0) return 0;
    
    // Calculate correlation
    return covariance / Math.sqrt(varX * varY);
}

/**
 * Adds a data summary panel to the container
 * @param {HTMLElement} container - The container to add the panel to
 * @param {Array} fullData - The full dataset
 * @param {Array} sampledData - The sampled dataset used for visualization
 */
function addDataSummaryPanel(container, fullData, sampledData) {
    // Create data summary panel
    const summaryPanel = document.createElement('div');
    summaryPanel.className = 'data-summary-panel';
    summaryPanel.style.backgroundColor = '#f8f9fa';
    summaryPanel.style.borderRadius = '8px';
    summaryPanel.style.padding = '15px';
    summaryPanel.style.marginTop = '20px';
    summaryPanel.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Data Summary';
    header.style.marginTop = '0';
    header.style.marginBottom = '15px';
    header.style.color = '#2c3e50';
    header.style.fontSize = '18px';
    header.style.borderBottom = '1px solid #ddd';
    header.style.paddingBottom = '8px';
    
    summaryPanel.appendChild(header);
    
    // Create data visualization
    const dataVisDiv = document.createElement('div');
    dataVisDiv.style.display = 'flex';
    dataVisDiv.style.flexWrap = 'wrap';
    dataVisDiv.style.gap = '20px';
    dataVisDiv.style.justifyContent = 'space-between';
    dataVisDiv.style.alignItems = 'center';
    
    // Data size visualization
    const dataSizeDiv = document.createElement('div');
    dataSizeDiv.style.flex = '1';
    dataSizeDiv.style.minWidth = '200px';
    
    // Format the data size in a human-friendly way
    const totalPoints = fullData.length;
    let dataSizeText;
    
    if (totalPoints >= 1000000) {
        dataSizeText = `${(totalPoints / 1000000).toFixed(2)} million data points`;
    } else if (totalPoints >= 1000) {
        dataSizeText = `${(totalPoints / 1000).toFixed(1)}K data points`;
    } else {
        dataSizeText = `${totalPoints} data points`;
    }
    
    // Create visual representation of data size
    const dataVisual = document.createElement('div');
    dataVisual.style.display = 'flex';
    dataVisual.style.alignItems = 'flex-end';
    dataVisual.style.height = '60px';
    dataVisual.style.marginBottom = '10px';
    
    // Create a bar to represent the full dataset
    const fullDataBar = document.createElement('div');
    fullDataBar.style.backgroundColor = '#3498db';
    fullDataBar.style.width = '100%';
    fullDataBar.style.height = '100%';
    fullDataBar.style.borderRadius = '4px 4px 0 0';
    fullDataBar.style.position = 'relative';
    
    // If data is sampled, add a visual indicator
    if (sampledData && sampledData.length < fullData.length) {
        const samplingRatio = sampledData.length / fullData.length;
        const sampledDataBar = document.createElement('div');
        sampledDataBar.style.backgroundColor = '#2ecc71';
        sampledDataBar.style.width = '100%';
        sampledDataBar.style.height = `${samplingRatio * 100}%`;
        sampledDataBar.style.borderRadius = '4px 4px 0 0';
        sampledDataBar.style.position = 'absolute';
        sampledDataBar.style.bottom = '0';
        sampledDataBar.style.left = '0';
        
        fullDataBar.appendChild(sampledDataBar);
        
        // Add tooltip-like label
        const sampledLabel = document.createElement('div');
        sampledLabel.textContent = `${sampledData.length.toLocaleString()} samples shown`;
        sampledLabel.style.position = 'absolute';
        sampledLabel.style.top = '-25px';
        sampledLabel.style.left = '0';
        sampledLabel.style.fontSize = '12px';
        sampledLabel.style.color = '#2ecc71';
        sampledLabel.style.fontWeight = 'bold';
        
        fullDataBar.appendChild(sampledLabel);
    }
    
    dataVisual.appendChild(fullDataBar);
    dataSizeDiv.appendChild(dataVisual);
    
    // Add data size text
    const sizeText = document.createElement('p');
    sizeText.textContent = dataSizeText;
    sizeText.style.textAlign = 'center';
    sizeText.style.margin = '5px 0';
    sizeText.style.fontWeight = 'bold';
    sizeText.style.fontSize = '16px';
    sizeText.style.color = '#3498db';
    
    dataSizeDiv.appendChild(sizeText);
    
    // Add sampling info if applicable
    if (sampledData && sampledData.length < fullData.length) {
        const samplingInfo = document.createElement('p');
        samplingInfo.innerHTML = `<span style="color: #2ecc71;">&#9679;</span> Showing ${Math.round((sampledData.length / fullData.length) * 100)}% of data for optimal performance`;
        samplingInfo.style.textAlign = 'center';
        samplingInfo.style.margin = '5px 0';
        samplingInfo.style.fontSize = '14px';
        
        dataSizeDiv.appendChild(samplingInfo);
    }
    
    // Data range information
    const dataRangeDiv = document.createElement('div');
    dataRangeDiv.style.flex = '1';
    dataRangeDiv.style.minWidth = '200px';
    
    // Get date range if available
    let dateRangeText = 'No date information available';
    if (fullData[0].Date && fullData[fullData.length - 1].Date) {
        const startDate = fullData[0].Date;
        const endDate = fullData[fullData.length - 1].Date;
        dateRangeText = `Date range: ${startDate} to ${endDate}`;
    }
    
    const dateRangeP = document.createElement('p');
    dateRangeP.textContent = dateRangeText;
    dateRangeP.style.margin = '5px 0';
    dateRangeP.style.fontSize = '14px';
    
    dataRangeDiv.appendChild(dateRangeP);
    
    // Get time range if available
    let timeRangeText = 'No time information available';
    if (fullData[0].Time && fullData[fullData.length - 1].Time) {
        const startTime = fullData[0].Time;
        const endTime = fullData[fullData.length - 1].Time;
        timeRangeText = `Time range: ${startTime} to ${endTime}`;
    }
    
    const timeRangeP = document.createElement('p');
    timeRangeP.textContent = timeRangeText;
    timeRangeP.style.margin = '5px 0';
    timeRangeP.style.fontSize = '14px';
    
    dataRangeDiv.appendChild(timeRangeP);
    
    // Add fields information
    const fieldsInfo = document.createElement('p');
    const numericFields = Object.keys(fullData[0]).filter(key => 
        key !== 'Date' && key !== 'Time' && key !== 'DateTime'
    );
    
    fieldsInfo.textContent = `Available metrics: ${numericFields.join(', ')}`;
    fieldsInfo.style.margin = '5px 0';
    fieldsInfo.style.fontSize = '14px';
    
    dataRangeDiv.appendChild(fieldsInfo);
    
    // Add all sections to the data visualization div
    dataVisDiv.appendChild(dataSizeDiv);
    dataVisDiv.appendChild(dataRangeDiv);
    
    // Add data preview button
    const previewButtonDiv = document.createElement('div');
    previewButtonDiv.style.textAlign = 'center';
    previewButtonDiv.style.marginTop = '15px';
    
    const previewButton = document.createElement('button');
    previewButton.className = 'btn btn-sm';
    previewButton.textContent = 'Show Data Preview';
    previewButton.style.backgroundColor = '#3498db';
    previewButton.style.color = 'white';
    previewButton.style.border = 'none';
    previewButton.style.padding = '5px 10px';
    previewButton.style.borderRadius = '4px';
    previewButton.style.cursor = 'pointer';
    
    // Create data preview container (initially hidden)
    const previewContainer = document.createElement('div');
    previewContainer.className = 'data-preview-container';
    previewContainer.style.display = 'none';
    previewContainer.style.marginTop = '15px';
    previewContainer.style.maxHeight = '200px';
    previewContainer.style.overflowY = 'auto';
    previewContainer.style.border = '1px solid #ddd';
    previewContainer.style.borderRadius = '4px';
    
    // Toggle preview on button click
    previewButton.addEventListener('click', function() {
        if (previewContainer.style.display === 'none') {
            // Show preview
            previewContainer.style.display = 'block';
            previewButton.textContent = 'Hide Data Preview';
            
            // Create preview table if it doesn't exist
            if (previewContainer.children.length === 0) {
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                
                // Create header row
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                
                // Get all fields
                const fields = Object.keys(fullData[0]);
                
                // Add headers
                fields.forEach(field => {
                    if (field !== 'DateTime') { // Skip DateTime as it's derived
                        const th = document.createElement('th');
                        th.textContent = field;
                        th.style.padding = '8px';
                        th.style.textAlign = 'left';
                        th.style.borderBottom = '2px solid #ddd';
                        th.style.backgroundColor = '#f2f2f2';
                        headerRow.appendChild(th);
                    }
                });
                
                thead.appendChild(headerRow);
                table.appendChild(thead);
                
                // Create table body
                const tbody = document.createElement('tbody');
                
                // Add first 5 rows
                const previewRows = Math.min(5, fullData.length);
                for (let i = 0; i < previewRows; i++) {
                    const row = document.createElement('tr');
                    
                    fields.forEach(field => {
                        if (field !== 'DateTime') { // Skip DateTime as it's derived
                            const td = document.createElement('td');
                            td.textContent = fullData[i][field];
                            td.style.padding = '8px';
                            td.style.borderBottom = '1px solid #ddd';
                            row.appendChild(td);
                        }
                    });
                    
                    tbody.appendChild(row);
                }
                
                // Add ellipsis row if there are more than 5 rows
                if (fullData.length > 5) {
                    const ellipsisRow = document.createElement('tr');
                    const ellipsisCell = document.createElement('td');
                    ellipsisCell.colSpan = fields.length - 1; // Subtract 1 for DateTime
                    ellipsisCell.textContent = '...';
                    ellipsisCell.style.textAlign = 'center';
                    ellipsisCell.style.padding = '8px';
                    
                    ellipsisRow.appendChild(ellipsisCell);
                    tbody.appendChild(ellipsisRow);
                    
                    // Add last row
                    const lastRow = document.createElement('tr');
                    
                    fields.forEach(field => {
                        if (field !== 'DateTime') { // Skip DateTime as it's derived
                            const td = document.createElement('td');
                            td.textContent = fullData[fullData.length - 1][field];
                            td.style.padding = '8px';
                            td.style.borderBottom = '1px solid #ddd';
                            lastRow.appendChild(td);
                        }
                    });
                    
                    tbody.appendChild(lastRow);
                }
                
                table.appendChild(tbody);
                previewContainer.appendChild(table);
            }
        } else {
            // Hide preview
            previewContainer.style.display = 'none';
            previewButton.textContent = 'Show Data Preview';
        }
    });
    
    previewButtonDiv.appendChild(previewButton);
    
    // Add all elements to the summary panel
    summaryPanel.appendChild(dataVisDiv);
    summaryPanel.appendChild(previewButtonDiv);
    summaryPanel.appendChild(previewContainer);
    
    // Add the summary panel to the container
    container.appendChild(summaryPanel);
}

/**
 * Shows an error message in the container
 * @param {HTMLElement} container - The container to show the error in
 * @param {string} message - The error message to display
 */
function showError(container, message) {
    container.innerHTML = `
        <div class="chart-placeholder">
            <p class="error-message" style="color: red;">${message}</p>
        </div>
    `;
}
