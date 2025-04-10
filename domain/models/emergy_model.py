"""
Modelo de domínio para cálculos de Emergy.
Este arquivo contém as classes de domínio principais para os cálculos de Emergy.
A classe EmergyInput representa uma entrada para o cálculo de Emergy, enquanto
a classe EmergyCalculation representa um cálculo de Emergy completo com suas entradas
e resultados. Estas classes são o núcleo do domínio da aplicação e encapsulam
as regras de negócio relacionadas aos cálculos de Emergy.

Feito por André Carbonieri Silva T839FC9
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime


@dataclass
class EmergyInput:
    """
    Representa uma entrada para o cálculo de Emergy.
    """
    name: str
    value: float
    unit: str
    category: str
    description: Optional[str] = None


@dataclass
class EmergyCalculation:
    """
    Representa um resultado de cálculo de Emergy.
    """
    id: str
    inputs: List[EmergyInput]
    total_emergy: float
    created_at: datetime
    metadata: Dict[str, Any]

    @classmethod
    def create(cls, inputs: List[EmergyInput], metadata: Dict[str, Any]) -> 'EmergyCalculation':
        """
        Método de fábrica para criar um novo EmergyCalculation.
        
        Args:
            inputs: Lista de objetos EmergyInput
            metadata: Metadados adicionais para o cálculo
            
        Returns:
            Uma nova instância de EmergyCalculation
        """
        # Em uma implementação real, isso realizaria o cálculo real
        # Por enquanto, vamos apenas somar os valores de entrada como um placeholder
        total_emergy = sum(input_item.value for input_item in inputs)
        
        # Gerar um ID único (em um aplicativo real, isso pode vir de um banco de dados)
        import uuid
        calculation_id = str(uuid.uuid4())
        
        return cls(
            id=calculation_id,
            inputs=inputs,
            total_emergy=total_emergy,
            created_at=datetime.now(),
            metadata=metadata
        )
