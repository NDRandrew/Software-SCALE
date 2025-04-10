"""
Testes unitários para o repositório de emergy em memória.
Este arquivo contém testes para a classe MemoryEmergyRepository,
verificando a funcionalidade de salvar, recuperar e excluir cálculos de emergy.

Feito por André Carbonieri Silva T839FC9
"""

import unittest
from datetime import datetime
from domain.models.emergy_model import EmergyInput, EmergyCalculation
from infrastructure.repositories.memory_emergy_repository import MemoryEmergyRepository


class TestMemoryEmergyRepository(unittest.TestCase):
    """
    Casos de teste para a classe MemoryEmergyRepository.
    """
    
    def setUp(self):
        """
        Configura o caso de teste.
        """
        self.repository = MemoryEmergyRepository()
        
        # Cria um cálculo de exemplo
        inputs = [
            EmergyInput("Entrada 1", 10.0, "kg", "Material", "Descrição 1"),
            EmergyInput("Entrada 2", 20.0, "kWh", "Energia", "Descrição 2")
        ]
        metadata = {"fonte": "teste"}
        self.sample_calculation = EmergyCalculation.create(inputs, metadata)
    
    def test_save_and_get_by_id(self):
        """
        Testa salvar um cálculo e recuperá-lo pelo ID.
        """
        # Preparar
        calculation = self.sample_calculation
        
        # Agir
        self.repository.save(calculation)
        retrieved_calculation = self.repository.get_by_id(calculation.id)
        
        # Verificar
        self.assertIsNotNone(retrieved_calculation)
        self.assertEqual(retrieved_calculation.id, calculation.id)
        self.assertEqual(retrieved_calculation.total_emergy, calculation.total_emergy)
        self.assertEqual(len(retrieved_calculation.inputs), len(calculation.inputs))
    
    def test_get_by_id_nonexistent(self):
        """
        Testa recuperar um cálculo inexistente pelo ID.
        """
        # Agir
        retrieved_calculation = self.repository.get_by_id("id-inexistente")
        
        # Verificar
        self.assertIsNone(retrieved_calculation)
    
    def test_get_all(self):
        """
        Testa recuperar todos os cálculos.
        """
        # Preparar
        calculation1 = self.sample_calculation
        
        inputs2 = [EmergyInput("Entrada 3", 30.0, "L", "Água", "Descrição 3")]
        metadata2 = {"fonte": "teste2"}
        calculation2 = EmergyCalculation.create(inputs2, metadata2)
        
        # Agir
        self.repository.save(calculation1)
        self.repository.save(calculation2)
        all_calculations = self.repository.get_all()
        
        # Verificar
        self.assertEqual(len(all_calculations), 2)
        self.assertTrue(any(calc.id == calculation1.id for calc in all_calculations))
        self.assertTrue(any(calc.id == calculation2.id for calc in all_calculations))
    
    def test_delete(self):
        """
        Testa excluir um cálculo.
        """
        # Preparar
        calculation = self.sample_calculation
        self.repository.save(calculation)
        
        # Agir
        result = self.repository.delete(calculation.id)
        retrieved_calculation = self.repository.get_by_id(calculation.id)
        
        # Verificar
        self.assertTrue(result)
        self.assertIsNone(retrieved_calculation)
    
    def test_delete_nonexistent(self):
        """
        Testa excluir um cálculo inexistente.
        """
        # Agir
        result = self.repository.delete("id-inexistente")
        
        # Verificar
        self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()
