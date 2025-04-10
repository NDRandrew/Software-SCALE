@echo off
echo Executando testes Cypress para a Aplicação Emergy
echo.
echo Iniciando o servidor Flask...
start /B python app.py
echo Aguardando o servidor iniciar...
timeout /t 5 /nobreak > nul

echo Executando testes Cypress...
npx cypress run

echo Encerrando o servidor Flask...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a
)

echo.
echo Testes concluídos!
