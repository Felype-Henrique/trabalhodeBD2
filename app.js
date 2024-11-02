const express = require('express');
const session = require('express-session');
const { Client } = require('pg');
const path = require('path');

const app = express();

// Configurações da sessão
app.use(
    session({
        secret: 'sua_chave_secreta',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Defina como `true` se estiver usando HTTPS
    })
);

// Middleware para parsing de JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (JavaScript, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para exibir a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota de login para autenticação e criação da sessão
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client = new Client({
        user: username,
        host: 'localhost',
        database: 'jurassic',
        password: password,
        port: 5432,
    });

    try {
        await client.connect();
        req.session.user = username;
        req.session.password = password;
        res.send({ message: 'Login realizado com sucesso!' });
    } catch (err) {
        res.status(401).send({ message: 'Erro de autenticação: credenciais inválidas' });
    } finally {
        await client.end();
    }
});

// Rota de consulta para acessar dados protegidos
app.get('/consulta', async (req, res) => {
    if (!req.session.user || !req.session.password) {
        return res.status(401).send({ message: 'Usuário não autenticado' });
    }

    const client = new Client({
        user: req.session.user,
        host: 'localhost',
        database: 'jurassic',
        password: req.session.password,
        port: 5432,
    });

    try {
        await client.connect();
        const result = await client.query('SELECT * FROM sua_tabela_exemplo');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send({ message: 'Erro ao executar a consulta' });
    } finally {
        await client.end();
    }
});

// Rota de logout para destruir a sessão
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send({ message: 'Erro ao realizar logout' });
        res.send({ message: 'Logout realizado com sucesso!' });
    });
});

// Inicia o servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
