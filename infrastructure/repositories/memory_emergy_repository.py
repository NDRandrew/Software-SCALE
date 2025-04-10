"""
Implementação em memória do EmergyRepository.
Este arquivo implementa uma versão em memória do repositório de cálculos de Emergy,
que armazena os cálculos em um dicionário na memória. Em uma aplicação real,
esta implementação seria substituída por uma implementação baseada em banco de dados.

Feito por André Carbonieri Silva T839FC9
"""

from typing import Dict, List, Optional
from domain.models.emergy_model import EmergyCalculation
from domain.repositories.emergy_repository import EmergyRepository


class MemoryEmergyRepository(EmergyRepository):
    """
    Implementação em memória do EmergyRepository.
    
    Esta é uma implementação simples que armazena cálculos na memória.
    Em uma aplicação real, isso seria substituído por uma implementação baseada em banco de dados.
    """
    
    def __init__(self):
        """
        Inicializa o repositório com um dicionário vazio.
        """
        self._calculations: Dict[str, EmergyCalculation] = {}
    
    def save(self, calculation: EmergyCalculation) -> None:
        """
        Salva um cálculo de emergy no repositório.
        
        Args:
            calculation: O EmergyCalculation para salvar
        """
        self._calculations[calculation.id] = calculation
    
    def get_by_id(self, calculation_id: str) -> Optional[EmergyCalculation]:
        """
        Recupera um cálculo de emergy pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser recuperado
            
        Returns:
            O EmergyCalculation se encontrado, None caso contrário
        """
        return self._calculations.get(calculation_id)
    
    def get_all(self) -> List[EmergyCalculation]:
        """
        Recupera todos os cálculos de emergy.
        
        Returns:
            Uma lista de todos os objetos EmergyCalculation
        """
        return list(self._calculations.values())
    
    def delete(self, calculation_id: str) -> bool:
        """
        Exclui um cálculo de emergy pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser excluído
            
        Returns:
            True se o cálculo foi excluído, False caso contrário
        """
        if calculation_id in self._calculations:
            del self._calculations[calculation_id]
            return True
        return False
