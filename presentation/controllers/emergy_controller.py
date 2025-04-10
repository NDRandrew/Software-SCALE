"""
Controlador para rotas relacionadas a Emergy.
Este arquivo implementa o controlador para as rotas relacionadas aos cálculos de Emergy,
seguindo o padrão MVC. O controlador é responsável por lidar com as requisições HTTP
relacionadas aos cálculos de Emergy, incluindo o upload de arquivos CSV, visualização
de gráficos e acesso à API para obter e excluir cálculos.

Feito por André Carbonieri Silva T839FC9
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from application.services.emergy_application_service import EmergyApplicationService
from typing import Dict, Any


class EmergyController:
    """
    Controlador para lidar com rotas relacionadas a Emergy.
    
    Este controlador segue o padrão MVC e é responsável por
    lidar com requisições HTTP relacionadas a cálculos de emergy.
    """
    
    def __init__(self, app_service: EmergyApplicationService):
        """
        Inicializa o controlador com um serviço de aplicação.
        
        Args:
            app_service: Uma instância de EmergyApplicationService
        """
        self._app_service = app_service
        self._blueprint = Blueprint('emergy', __name__)
        self._register_routes()
    
    def _register_routes(self) -> None:
        """
        Registra rotas com o blueprint.
        """
        self._blueprint.route('/emergy-calculator', methods=['GET', 'POST'])(self.emergy_calculator)
        self._blueprint.route('/graphics')(self.graphics)
        self._blueprint.route('/api/calculations', methods=['GET'])(self.get_calculations)
        self._blueprint.route('/api/calculations/<calculation_id>', methods=['GET'])(self.get_calculation)
        self._blueprint.route('/api/calculations/<calculation_id>', methods=['DELETE'])(self.delete_calculation)
    
    def get_blueprint(self) -> Blueprint:
        """
        Obtém o blueprint do controlador.
        
        Returns:
            O blueprint Flask para este controlador
        """
        return self._blueprint
    
    def emergy_calculator(self):
        """
        Lida com a página da calculadora de emergy.
        
        Returns:
            O template renderizado ou um redirecionamento
        """
        if request.method == 'POST':
            # Verifica se um arquivo foi enviado
            if 'csv_file' not in request.files:
                flash('Nenhuma parte do arquivo')
                return redirect(request.url)
            
            file = request.files['csv_file']
            
            # Verifica se o arquivo está vazio
            if file.filename == '':
                flash('Nenhum arquivo selecionado')
                return redirect(request.url)
            
            # Verifica se o arquivo é um CSV
            if not file.filename.endswith('.csv'):
                flash('Por favor, envie um arquivo CSV')
                return redirect(request.url)
            
            # Lê o conteúdo do arquivo
            csv_data = file.read().decode('utf-8')
            
            # Processa os dados CSV
            metadata: Dict[str, Any] = {
                'filename': file.filename,
                'user_agent': request.user_agent.string
            }
            
            try:
                calculation = self._app_service.process_csv_data(csv_data, metadata)
                # Armazena o ID do cálculo na sessão para uso posterior
                # Em um aplicativo real, isso seria tratado por um gerenciador de sessão
                # Por enquanto, vamos apenas retornar uma mensagem de sucesso
                return jsonify({
                    'success': True,
                    'calculation_id': calculation.id,
                    'message': 'Arquivo CSV processado com sucesso'
                })
            except Exception as e:
                return jsonify({
                    'success': False,
                    'message': f'Erro ao processar arquivo CSV: {str(e)}'
                })
        
        # Requisição GET - renderiza o template
        return render_template('emergy_calculator.html')
    
    def graphics(self):
        """
        Lida com a página de gráficos.
        
        Returns:
            O template renderizado
        """
        return render_template('graphics.html')
    
    def get_calculations(self):
        """
        Endpoint da API para obter todos os cálculos.
        
        Returns:
            Resposta JSON com todos os cálculos
        """
        calculations = self._app_service.get_all_calculations()
        return jsonify({
            'calculations': [self._serialize_calculation(calc) for calc in calculations]
        })
    
    def get_calculation(self, calculation_id):
        """
        Endpoint da API para obter um cálculo específico.
        
        Args:
            calculation_id: O ID do cálculo a ser recuperado
            
        Returns:
            Resposta JSON com o cálculo ou um erro
        """
        calculation = self._app_service.get_calculation(calculation_id)
        
        if calculation is None:
            return jsonify({
                'success': False,
                'message': f'Cálculo com ID {calculation_id} não encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'calculation': self._serialize_calculation(calculation)
        })
    
    def delete_calculation(self, calculation_id):
        """
        Endpoint da API para excluir um cálculo específico.
        
        Args:
            calculation_id: O ID do cálculo a ser excluído
            
        Returns:
            Resposta JSON indicando sucesso ou falha
        """
        success = self._app_service.delete_calculation(calculation_id)
        
        if not success:
            return jsonify({
                'success': False,
                'message': f'Cálculo com ID {calculation_id} não encontrado'
            }), 404
        
        return jsonify({
            'success': True,
                'message': f'Cálculo com ID {calculation_id} excluído com sucesso'
        })
    
    def _serialize_calculation(self, calculation):
        """
        Serializa um objeto de cálculo para um dicionário.
        
        Args:
            calculation: O EmergyCalculation para serializar
            
        Returns:
            Uma representação em dicionário do cálculo
        """
        return {
            'id': calculation.id,
            'total_emergy': calculation.total_emergy,
            'created_at': calculation.created_at.isoformat(),
            'inputs': [
                {
                    'name': input_item.name,
                    'value': input_item.value,
                    'unit': input_item.unit,
                    'category': input_item.category,
                    'description': input_item.description
                }
                for input_item in calculation.inputs
            ],
            'metadata': calculation.metadata
        }
