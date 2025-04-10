"""
Ponto de entrada principal da aplicação.
Este arquivo é responsável por inicializar a aplicação Flask, configurar os repositórios,
serviços e controladores, e registrar os blueprints para as rotas.
A aplicação segue os princípios de Domain-Driven Design (DDD), Test-Driven Development (TDD)
e SOLID, com uma clara separação de responsabilidades entre as camadas.

Feito por André Carbonieri Silva T839FC9
"""

from flask import Flask
from infrastructure.repositories.memory_emergy_repository import MemoryEmergyRepository
from domain.services.emergy_service import EmergyService
from application.services.emergy_application_service import EmergyApplicationService
from presentation.controllers.main_controller import MainController
from presentation.controllers.emergy_controller import EmergyController


def create_app():
    """
    Cria e configura a aplicação Flask.
    
    Returns:
        A aplicação Flask configurada
    """
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key'
    
    # Set up repositories
    emergy_repository = MemoryEmergyRepository()
    
    # Set up domain services
    emergy_service = EmergyService(emergy_repository)
    
    # Set up application services
    emergy_app_service = EmergyApplicationService(emergy_service)
    
    # Set up controllers
    main_controller = MainController()
    emergy_controller = EmergyController(emergy_app_service)
    
    # Register blueprints
    app.register_blueprint(main_controller.get_blueprint())
    app.register_blueprint(emergy_controller.get_blueprint())
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
