#!/bin/bash

echo "Executando testes Cypress para a Aplicação Emergy"
echo ""
echo "Iniciando o servidor Flask..."
python app.py &
SERVER_PID=$!
echo "Aguardando o servidor iniciar..."
sleep 5

echo "Executando testes Cypress..."
npx cypress run

echo "Encerrando o servidor Flask..."
kill $SERVER_PID

echo ""
echo "Testes concluídos!"
