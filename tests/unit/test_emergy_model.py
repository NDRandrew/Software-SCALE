"""
Testes unitários para o modelo de emergy.
Este arquivo contém testes para as classes EmergyInput e EmergyCalculation,
verificando a criação de objetos e o cálculo correto dos valores de emergy.

Feito por André Carbonieri Silva T839FC9
"""

import unittest
from datetime import datetime
from domain.models.emergy_model import EmergyInput, EmergyCalculation


class TestEmergyModel(unittest.TestCase):
    """
    Casos de teste para as classes EmergyInput e EmergyCalculation.
    """
    
    def test_emergy_input_creation(self):
        """
        Testa a criação de um EmergyInput.
        """
        # Preparar
        name = "Entrada de Teste"
        value = 10.5
        unit = "kg"
        category = "Material"
        description = "Descrição de teste"
        
        # Agir
        input_item = EmergyInput(name, value, unit, category, description)
        
        # Verificar
        self.assertEqual(input_item.name, name)
        self.assertEqual(input_item.value, value)
        self.assertEqual(input_item.unit, unit)
        self.assertEqual(input_item.category, category)
        self.assertEqual(input_item.description, description)
    
    def test_emergy_calculation_creation(self):
        """
        Testa a criação de um EmergyCalculation.
        """
        # Preparar
        inputs = [
            EmergyInput("Entrada 1", 10.0, "kg", "Material", "Descrição 1"),
            EmergyInput("Entrada 2", 20.0, "kWh", "Energia", "Descrição 2")
        ]
        metadata = {"fonte": "teste"}
        
        # Agir
        calculation = EmergyCalculation.create(inputs, metadata)
        
        # Verificar
        self.assertIsNotNone(calculation.id)
        self.assertEqual(len(calculation.inputs), 2)
        self.assertEqual(calculation.total_emergy, 30.0)  # 10.0 + 20.0
        self.assertIsInstance(calculation.created_at, datetime)
        self.assertEqual(calculation.metadata, metadata)
    
    def test_emergy_calculation_with_empty_inputs(self):
        """
        Testa a criação de um EmergyCalculation com entradas vazias.
        """
        # Preparar
        inputs = []
        metadata = {"fonte": "teste"}
        
        # Agir
        calculation = EmergyCalculation.create(inputs, metadata)
        
        # Verificar
        self.assertIsNotNone(calculation.id)
        self.assertEqual(len(calculation.inputs), 0)
        self.assertEqual(calculation.total_emergy, 0.0)
        self.assertIsInstance(calculation.created_at, datetime)
        self.assertEqual(calculation.metadata, metadata)


if __name__ == '__main__':
    unittest.main()
