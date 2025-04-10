@echo off
echo Verificando testes Cypress para a Aplicação Emergy
echo.
echo Instalando dependências...
npm install

echo.
echo Verificando se o Cypress está instalado corretamente...
npx cypress verify

echo.
echo Executando um teste simples para verificar a configuração...
npx cypress run --spec "cypress/e2e/main_page.cy.js" --browser chrome --headless

echo.
echo Verificação concluída!
