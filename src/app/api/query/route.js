// Caminho: src/app/api/query/route.js

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
    // Pega as credenciais e a query do corpo da requisição do frontend
    const { host, user, password, database, query } = await request.json();

    // Monta o objeto de configuração para a conexão.
    // Se o frontend não enviar algum dado, ele usa o que está no .env.local como padrão.
    const dbConfig = {
        host: host || process.env.DB_HOST,
        user: user || process.env.DB_USER,
        password: password || process.env.DB_PASSWORD,
        database: database || process.env.DB_DATABASE,
    };

    let connection;
    try {
        // Tenta se conectar ao banco de dados MySQL com as credenciais
        connection = await mysql.createConnection(dbConfig);

        // Executa a consulta SQL que veio do frontend
        const [results, fields] = await connection.execute(query);

        // Se a consulta for bem-sucedida, retorna os resultados
        return NextResponse.json({ results });

    } catch (error) {
        // Se houver qualquer erro (senha errada, banco não existe, erro de SQL), retorna a mensagem de erro real
        console.error("ERRO NA API DO BANCO DE DADOS:", error);
        return NextResponse.json({ error: `Erro no banco de dados: ${error.message}` }, { status: 500 });

    } finally {
        // Garante que a conexão com o banco seja sempre fechada, mesmo se der erro
        if (connection) {
            await connection.end();
        }
    }
}