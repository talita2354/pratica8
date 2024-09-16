const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 80;
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta';

// Middleware para verificar o JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token não fornecido.');

  // Verifica o token JWT
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Token inválido.');
    req.user = decoded;
    next();
  });
};

// Rota para gerar o JWT
app.post('/jwt/auth', (req, res) => {
  const { email, password } = req.body;
  
  // Exemplo simples de validação de credenciais
  if (email === 'user@example.com' && password === '123456') {
    const token = jwt.sign(
      { id: 1, email: email }, // Dados que você quer incluir no payload do JWT
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rota protegida que retorna os métodos HTTP
app.get('/jwt/metodosHttp', verifyJWT, (req, res) => {
  const httpMethods = {
    get: {
      "objetivo_principal": "Recuperar dados de um recurso",
      "limite_caracteres": "Ilimitado",
      "aceita_https": true,
      "aceita_http": true,
    },
    post: {
      "objetivo_principal": "Criar um novo recurso",
      "limite_caracteres": "Ilimitado",
      "aceita_https": true,
      "aceita_http": true,
    },
    put: {
      "objetivo_principal": "Atualizar um recurso existente",
      "limite_caracteres": "Ilimitado",
      "aceita_https": true,
      "aceita_http": true,
    },
    patch: {
      "objetivo_principal": "Atualização parcial de um recurso",
      "limite_caracteres": "Ilimitado",
      "aceita_https": true,
      "aceita_http": true,
    },
    delete: {
      "objetivo_principal": "Deletar um recurso",
      "limite_caracteres": "Ilimitado",
      "aceita_https": true,
      "aceita_http": true,
    }
  };

  res.json(httpMethods);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});