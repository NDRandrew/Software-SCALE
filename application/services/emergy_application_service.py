"""
Serviço de aplicação para cálculos de Emergy.
Este arquivo implementa o serviço de aplicação para cálculos de Emergy,
que atua como uma fachada para a camada de aplicação, coordenando o uso
de serviços de domínio e fornecendo uma interface simplificada para a
camada de apresentação. Este serviço é responsável por processar dados
<<<<<<< HEAD
TXT e convertê-los em cálculos de Emergy.
=======
CSV e convertê-los em cálculos de Emergy.
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f

Feito por André Carbonieri Silva T839FC9
"""

from typing import List, Dict, Any, Optional
from domain.services.emergy_service import EmergyService
from domain.models.emergy_model import EmergyCalculation


class EmergyApplicationService:
    """
    Serviço de aplicação para lidar com cálculos de Emergy.
    
    Este serviço atua como uma fachada para a camada de aplicação, coordenando
    o uso de serviços de domínio e fornecendo uma interface simplificada para
    a camada de apresentação.
    """
    
    def __init__(self, emergy_service: EmergyService):
        """
        Inicializa o serviço com um serviço de domínio.
        
        Args:
            emergy_service: Uma instância de EmergyService
        """
        self._emergy_service = emergy_service
    
    def process_csv_data(self, csv_data: str, metadata: Dict[str, Any]) -> EmergyCalculation:
        """
        Processa dados CSV para criar um cálculo de emergy.
        
        Args:
            csv_data: Dados CSV como uma string
            metadata: Metadados adicionais para o cálculo
            
        Returns:
            Uma nova instância de EmergyCalculation
        """
        # Analisa dados CSV
        inputs = self._parse_csv(csv_data)
        
        # Cria cálculo usando serviço de domínio
        return self._emergy_service.create_calculation(inputs, metadata)
    
<<<<<<< HEAD
    def process_txt_data(self, txt_data: str, metadata: Dict[str, Any]) -> EmergyCalculation:
        """
        Processa dados TXT para criar um cálculo de emergy.
        
        Args:
            txt_data: Dados TXT como uma string
            metadata: Metadados adicionais para o cálculo
            
        Returns:
            Uma nova instância de EmergyCalculation
        """
        # Analisa dados TXT
        inputs = self._parse_txt(txt_data)
        
        # Cria cálculo usando serviço de domínio
        return self._emergy_service.create_calculation(inputs, metadata)
    
=======
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
    def get_calculation(self, calculation_id: str) -> Optional[EmergyCalculation]:
        """
        Recupera um cálculo pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser recuperado
            
        Returns:
            O EmergyCalculation se encontrado, None caso contrário
        """
        return self._emergy_service.get_calculation(calculation_id)
    
    def get_all_calculations(self) -> List[EmergyCalculation]:
        """
        Recupera todos os cálculos.
        
        Returns:
            Uma lista de todos os objetos EmergyCalculation
        """
        return self._emergy_service.get_all_calculations()
    
    def delete_calculation(self, calculation_id: str) -> bool:
        """
        Exclui um cálculo pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser excluído
            
        Returns:
            True se o cálculo foi excluído, False caso contrário
        """
        return self._emergy_service.delete_calculation(calculation_id)
    
    def _parse_csv(self, csv_data: str) -> List[Dict[str, Any]]:
        """
        Analisa dados CSV em uma lista de dicionários.
        
        Args:
            csv_data: Dados CSV como uma string
            
        Returns:
            Uma lista de dicionários representando as linhas CSV
        """
        # Esta é uma implementação de placeholder
        # Em uma aplicação real, isso usaria uma biblioteca de análise CSV
        
        # Por enquanto, vamos apenas retornar alguns dados fictícios
        return [
            {
                'name': 'Input 1',
                'value': 10.0,
                'unit': 'kg',
                'category': 'Material',
                'description': 'Entrada de amostra 1'
            },
            {
                'name': 'Input 2',
                'value': 20.0,
                'unit': 'kWh',
                'category': 'Energy',
                'description': 'Entrada de amostra 2'
            }
        ]
<<<<<<< HEAD
    
    def _parse_txt(self, txt_data: str) -> List[Dict[str, Any]]:
        """
        Analisa dados TXT em uma lista de dicionários.
        
        Args:
            txt_data: Dados TXT como uma string
            
        Returns:
            Uma lista de dicionários representando as linhas TXT
        """
        # Dividir linhas
        lines = txt_data.strip().split('\n')
        
        # Obter cabeçalhos
        headers = lines[0].split(';')
        
        # Processar linhas de dados
        inputs = []
        for i, line in enumerate(lines[1:]):  # Processa todas as linhas de dados
            values = line.split(';')
            if len(values) != len(headers):
                continue  # Pula linhas com número incorreto de valores
                
            # Criar um dicionário com os valores
            row_data = dict(zip(headers, values))
            
            try:
                # Converter valores numéricos
                global_active_power = float(row_data.get('Global_active_power', 0))
                global_reactive_power = float(row_data.get('Global_reactive_power', 0))
                voltage = float(row_data.get('Voltage', 0))
                global_intensity = float(row_data.get('Global_intensity', 0))
                sub_metering_1 = float(row_data.get('Sub_metering_1', 0))
                sub_metering_2 = float(row_data.get('Sub_metering_2', 0))
                sub_metering_3 = float(row_data.get('Sub_metering_3', 0))
                
                # Criar entradas para cada tipo de medição
                inputs.append({
                    'name': f"Active Power {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': global_active_power,
                    'unit': 'kW',
                    'category': 'Active Power',
                    'description': f"Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                inputs.append({
                    'name': f"Reactive Power {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': global_reactive_power,
                    'unit': 'kVAR',
                    'category': 'Reactive Power',
                    'description': f"Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                inputs.append({
                    'name': f"Voltage {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': voltage,
                    'unit': 'V',
                    'category': 'Voltage',
                    'description': f"Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                inputs.append({
                    'name': f"Intensity {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': global_intensity,
                    'unit': 'A',
                    'category': 'Intensity',
                    'description': f"Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                # Adicionar sub-medições
                inputs.append({
                    'name': f"Sub Metering 1 {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': sub_metering_1,
                    'unit': 'Wh',
                    'category': 'Sub Metering',
                    'description': f"Kitchen - Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                inputs.append({
                    'name': f"Sub Metering 2 {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': sub_metering_2,
                    'unit': 'Wh',
                    'category': 'Sub Metering',
                    'description': f"Laundry Room - Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
                inputs.append({
                    'name': f"Sub Metering 3 {row_data.get('Date', '')} {row_data.get('Time', '')}",
                    'value': sub_metering_3,
                    'unit': 'Wh',
                    'category': 'Sub Metering',
                    'description': f"Water Heater & AC - Date: {row_data.get('Date', '')}, Time: {row_data.get('Time', '')}"
                })
                
            except (ValueError, TypeError) as e:
                # Pula linhas com valores inválidos
                continue
        
        return inputs
=======
>>>>>>> ecb21e436744d3bcbf9248c9b6e2c7680d3bd20f
