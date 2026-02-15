const express = require('express');
const Router = require('./application/router/Router.js');
const CONFIG = require('./config.js');
const Answer = require('./application/router/Answer.js');

const app = express();

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роутер
app.use('/', Router());

app.use((err, req, res, next) => {
    console.error('Cringe error:', err);
    res.json(Answer.response({ error: 9000 }));
});

// Запуск сервака
const PORT = CONFIG.SERVER_PORT;
const NAME = CONFIG.SERVER_NAME;
app.listen(PORT, () => {
    console.log(`Server ${NAME} running on port ${PORT}`);
});

module.exports = app;