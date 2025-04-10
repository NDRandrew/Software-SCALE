"""
Serviço de domínio para cálculos de Emergy.
Este arquivo implementa o serviço de domínio para cálculos de Emergy,
que encapsula a lógica de negócios relacionada aos cálculos de Emergy
e atua como uma fachada para a camada de domínio. O serviço utiliza
o repositório para persistir e recuperar os cálculos.

Feito por André Carbonieri Silva T839FC9
"""

from typing import List, Dict, Any, Optional
from domain.models.emergy_model import EmergyInput, EmergyCalculation
from domain.repositories.emergy_repository import EmergyRepository


class EmergyService:
    """
    Serviço de domínio para lidar com cálculos de Emergy.
    
    Este serviço encapsula a lógica de negócios relacionada aos cálculos de emergy
    e atua como uma fachada para a camada de domínio.
    """
    
    def __init__(self, repository: EmergyRepository):
        """
        Inicializa o serviço com um repositório.
        
        Args:
            repository: Uma implementação de EmergyRepository
        """
        self._repository = repository
    
    def create_calculation(self, inputs: List[Dict[str, Any]], metadata: Dict[str, Any]) -> EmergyCalculation:
        """
        Cria um novo cálculo de emergy a partir dos dados de entrada.
        
        Args:
            inputs: Lista de dicionários contendo dados de entrada
            metadata: Metadados adicionais para o cálculo
            
        Returns:
            Uma nova instância de EmergyCalculation
        """
        # Converte dicionários de entrada para objetos EmergyInput
        emergy_inputs = [
            EmergyInput(
                name=input_data.get('name', ''),
                value=float(input_data.get('value', 0)),
                unit=input_data.get('unit', ''),
                category=input_data.get('category', ''),
                description=input_data.get('description')
            )
            for input_data in inputs
        ]
        
        # Cria o cálculo
        calculation = EmergyCalculation.create(emergy_inputs, metadata)
        
        # Salva no repositório
        self._repository.save(calculation)
        
        return calculation
    
    def get_calculation(self, calculation_id: str) -> Optional[EmergyCalculation]:
        """
        Recupera um cálculo pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser recuperado
            
        Returns:
            O EmergyCalculation se encontrado, None caso contrário
        """
        return self._repository.get_by_id(calculation_id)
    
    def get_all_calculations(self) -> List[EmergyCalculation]:
        """
        Recupera todos os cálculos.
        
        Returns:
            Uma lista de todos os objetos EmergyCalculation
        """
        return self._repository.get_all()
    
    def delete_calculation(self, calculation_id: str) -> bool:
        """
        Exclui um cálculo pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser excluído
            
        Returns:
            True se o cálculo foi excluído, False caso contrário
        """
        return self._repository.delete(calculation_id)
