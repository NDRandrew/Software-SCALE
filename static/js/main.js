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
    
    // Fecha o menu quando um item do menu é clicado
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.checked = false;
        });
    });
    
    // Fecha o menu quando clicar fora
    document.addEventListener('click', function(event) {
        const isMenuBtn = event.target.closest('.menu__btn');
        const isMenuBox = event.target.closest('.menu__box');
        
        if (!isMenuBtn && !isMenuBox && menuToggle.checked) {
            menuToggle.checked = false;
        }
    });
}
