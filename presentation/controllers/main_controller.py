"""
Controlador para a página principal.
Este arquivo implementa o controlador para a página principal da aplicação,
seguindo o padrão MVC. O controlador é responsável por lidar com as requisições
HTTP relacionadas à página principal e renderizar o template correspondente.

Feito por André Carbonieri Silva T839FC9
"""

from flask import Blueprint, render_template


class MainController:
    """
    Controlador para lidar com a página principal.
    
    Este controlador segue o padrão MVC e é responsável por
    lidar com requisições HTTP relacionadas à página principal.
    """
    
    def __init__(self):
        """
        Inicializa o controlador.
        """
        self._blueprint = Blueprint('main', __name__)
        self._register_routes()
    
    def _register_routes(self) -> None:
        """
        Registra rotas com o blueprint.
        """
        self._blueprint.route('/')(self.index)
    
    def get_blueprint(self) -> Blueprint:
        """
        Obtém o blueprint do controlador.
        
        Returns:
            O blueprint Flask para este controlador
        """
        return self._blueprint
    
    def index(self):
        """
        Lida com a página principal.
        
        Returns:
            O template renderizado
        """
        return render_template('main.html')
