/**
 * Arquivo JavaScript principal para a Aplicação Emergy.
 * Este arquivo contém a inicialização da aplicação e a configuração
 * do menu de navegação responsivo (hamburger menu).
 * 
 * Feito por André Carbonieri Silva T839FC9
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicação Emergy inicializada');
    
    // Inicializa qualquer funcionalidade global aqui
    initializeResponsiveNavigation();
});

/**
 * Inicializa a funcionalidade de navegação responsiva
 */
function initializeResponsiveNavigation() {
    const menuToggle = document.getElementById('menu__toggle');
    const menuItems = document.querySelectorAll('.menu__item');
    const menuClose = document.querySelector('.menu__close');
    
    // Fecha o menu quando um item do menu é clicado
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.checked = false;
        });
    });
    
    // Fecha o menu quando o botão X é clicado
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            menuToggle.checked = false;
        });
    }
    
    // Fecha o menu quando clicar fora
    document.addEventListener('click', function(event) {
        // Verifica se o clique foi no botão do menu, dentro da caixa do menu, ou no próprio checkbox
        const isMenuBtn = event.target.closest('.menu__btn');
        const isMenuBox = event.target.closest('.menu__box');
        const isMenuToggle = event.target === menuToggle;
        
        // Se o menu estiver aberto e o clique não foi em nenhum elemento do menu, fecha o menu
        if (!isMenuBtn && !isMenuBox && !isMenuToggle && menuToggle.checked) {
            menuToggle.checked = false;
        }
    }, true); // Usando a fase de captura para garantir que o evento seja processado antes da propagação
}
