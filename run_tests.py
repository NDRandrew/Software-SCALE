"""
Script para executar todos os testes para a Aplicação Emergy.
Este arquivo contém a lógica para descobrir e executar todos os testes
unitários, de integração e funcionais da aplicação.

Feito por André Carbonieri Silva T839FC9 10/04/2025
"""

import unittest
import sys
import os


def run_tests():
    """
    Descobre e executa todos os testes no diretório de testes.
    
    Returns:
        int: 0 se todos os testes passarem, 1 caso contrário
    """
    # Adiciona a raiz do projeto ao caminho Python
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    
    # Descobre e executa testes
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('tests')
    
    test_runner = unittest.TextTestRunner(verbosity=2)
    result = test_runner.run(test_suite)
    
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(run_tests())
