"""
Interface de repositório para cálculos de Emergy.
Este arquivo define a interface do repositório para os cálculos de Emergy,
seguindo o padrão Repository do Domain-Driven Design. Esta interface
abstrata define os métodos que qualquer implementação de repositório
deve fornecer para armazenar, recuperar e gerenciar objetos de domínio
EmergyCalculation.

Feito por André Carbonieri Silva T839FC9
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from domain.models.emergy_model import EmergyCalculation


class EmergyRepository(ABC):
    """
    Interface abstrata de repositório para cálculos de Emergy.
    
    Isso segue o padrão Repository do Domain-Driven Design,
    fornecendo uma interface semelhante a uma coleção para acessar objetos de domínio.
    """
    
    @abstractmethod
    def save(self, calculation: EmergyCalculation) -> None:
        """
        Salva um cálculo de emergy no repositório.
        
        Args:
            calculation: O EmergyCalculation para salvar
        """
        pass
    
    @abstractmethod
    def get_by_id(self, calculation_id: str) -> Optional[EmergyCalculation]:
        """
        Recupera um cálculo de emergy pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser recuperado
            
        Returns:
            O EmergyCalculation se encontrado, None caso contrário
        """
        pass
    
    @abstractmethod
    def get_all(self) -> List[EmergyCalculation]:
        """
        Recupera todos os cálculos de emergy.
        
        Returns:
            Uma lista de todos os objetos EmergyCalculation
        """
        pass
    
    @abstractmethod
    def delete(self, calculation_id: str) -> bool:
        """
        Exclui um cálculo de emergy pelo seu ID.
        
        Args:
            calculation_id: O ID do cálculo a ser excluído
            
        Returns:
            True se o cálculo foi excluído, False caso contrário
        """
        pass
