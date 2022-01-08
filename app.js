// Carrega a framework express e body-parser
const express = require('express');
const bodyParser = require('body-parser');

// instancia do express
const app = express();

// carrega o suporte a ficheiros do node
const fs = require('fs');

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Onde se encontra as rotas
const routes = require('./routes/routes.js')(app, fs);

// Lançamento do servidor no porto 3001.
const server = app.listen(3001, () => {
  console.log('à escuta no porto %s...', server.address().port);
});