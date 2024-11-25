import time
from flask import Flask, render_template, request, jsonify, url_for
import requests
import mysql.connector

# Cria uma instância da aplicação Flask
app = Flask(__name__)

# Função para ler as instruções gerais do arquivo 'instrucoes.txt'
def ler_instrucoes_gerais():
    with open('C:/Users/andre.goncalves/Documents/Autur/IAutur/instrucoes.txt', 'r', encoding='UTF-8') as file:
        return file.read()

# Função para ler as instruções do departamento Digital do arquivo 'rotas.txt'
def ler_instrucoes_Rotas():
    with open('C:/Users/andre.goncalves/Documents/Autur/IAutur/rotas.txt', 'r', encoding='UTF-8') as file:
        return file.read()

# Função para ler as instruções do departamento Digital do arquivo 'aeroportos.txt'
def ler_instrucoes_aero():
    with open('C:/Users/andre.goncalves/Documents/Autur/IAutur/aeroportos.txt', 'r', encoding='UTF-8') as file:
        return file.read()

# Função para inserir dados (pergunta e resposta) no banco de dados MySQL
def inserir_dados(question, answer):
    try:
        # Estabelece conexão com o banco de dados MySQL
        connection = mysql.connector.connect(
            host='10.100.12.236',
            user='datastudio-w',
            password='*r-T%!2#xb9uuJrO',
            database='datastudio'
        )
        cursor = connection.cursor()

        # Prepara e executa a query de inserção
        query = "INSERT INTO faqs (question, answer, created_at) VALUES (%s, %s, NOW())"
        values = (question, answer)
        cursor.execute(query, values)

        # Confirma a transação e fecha a conexão
        connection.commit()
        cursor.close()
        connection.close()
    except Exception as e:
        # Trata qualquer exceção que possa ocorrer durante a inserção
        print('Erro ao inserir os dados no banco de dados:', str(e))

# Rota para obter as perguntas e respostas armazenadas no banco de dados
@app.route('/faq', methods=['GET'])
def obter_perguntas_respostas():
    try:
        # Estabelece conexão com o banco de dados MySQL
        connection = mysql.connector.connect(
            host='10.100.12.236',
            port='3306',
            user='datastudio-w',
            password='*r-T%!2#xb9uuJrO',
            database='datastudio'
        )
        cursor = connection.cursor()

        # Prepara e executa a query para obter as perguntas e respostas
        query = "SELECT id, question, answer, department, created_at FROM faqs ORDER BY created_at DESC"
        cursor.execute(query)

        # Obtém os resultados da consulta
        results = cursor.fetchall()

        # Fecha a conexão
        cursor.close()
        connection.close()

        # Retorna os resultados no formato JSON
        return jsonify({'results': results})

    except Exception as e:
        # Trata qualquer exceção que possa ocorrer durante a obtenção das perguntas e respostas
        print('Erro ao obter as perguntas e respostas:', str(e))
        return jsonify({'error': 'Erro ao obter as perguntas e respostas'})

# Rota para processar a pergunta do usuário e retornar a resposta
@app.route('/chat', methods=['POST'])
def chat():
    # Obtém a pergunta enviada pelo usuário
    question = request.form['question']

    # Lê as instruções gerais e rotas e aeroportos
    instrucoesGerais = ler_instrucoes_gerais()
    instrucoesRotas = ler_instrucoes_Rotas()
    instrucoesAero = ler_instrucoes_aero()

    # Define os cabeçalhos para a solicitação à API do OpenAI
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-proj-hM8b11Qdb2WgfBg39kLeT3BlbkFJ6BanxThY129MOV3S3pkm',
    }

    # Prepara os dados para a solicitação à API do OpenAI
    data = {
        'messages': [
            {'role': 'system', 'content': instrucoesGerais},
            {'role': 'system', 'content': instrucoesRotas},
            {'role': 'system', 'content': instrucoesAero},
            {'role': 'user', 'content': question}
        ],
        'model': 'gpt-3.5-turbo'
    }

    # Envia a solicitação à API do OpenAI
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)

    # Obtém a resposta da API do OpenAI
    result = response.json()

    # Verifica se a solicitação foi bem-sucedida
    if response.status_code == 200:
        # Obtém a resposta da API do OpenAI
        answer = result['choices'][0]['message']['content']

        # Insere a pergunta e a resposta no banco de dados
        inserir_dados(question, answer)

        # Aguarda um breve período de tempo (0 segundos)
        time.sleep(0)

    # Trata o caso de quota insuficiente na API do OpenAI
    elif result['error']['code'] == 'insufficient_quota':
        answerJson = result
        answerCode = result['error']['code']
        answerDetails = result['error']['message']
        answer = 'Infelizmente não foi possivel consultar os dados solicitados, tente novamente mais tarde.'
        print('Erro ao obter resposta:', answerDetails)

    # Trata outros erros que possam ocorrer
    else:
        answerJson = result
        answerCode = result['error']['code']
        answer = 'Infelizmente ocorreu um erro na solicitação'
        answerDetails = result['error']['message']
        print('JSON:', answerJson)
        print('Erro inesperado:', answerCode, '-', answerDetails)
        print('Erro ao obter resposta:', answerDetails)

    # Retorna a resposta no formato JSON
    return jsonify({'answer': answer})

# Rota raiz para renderizar a página HTML
@app.route('/')
def index():
    return render_template('index.html', styles=url_for('static', filename='styles.css'), scripts=url_for('static', filename='scripts.js'))

# Executa a aplicação Flask
if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)