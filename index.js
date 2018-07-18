const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { nome, dataNasc } = req.body;
  const dataFormatada = `${dataNasc.substr(8, 2)}/${dataNasc.substr(5, 2)}/${dataNasc.substr(0, 4)}`;
  const idade = moment().diff(moment(dataFormatada, 'DD/MM/YYYY'), 'years');

  if (idade > 18) {
    res.redirect(`/major?nome=${nome}`);
  } else {
    res.redirect(`/minor?nome=${nome}`);
  }
});

const idadeMiddleware = (req, res, next) => {
  if (req.query.nome) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/major', idadeMiddleware, (req, res) => {
  res.render('major', req.query);
});

app.get('/minor', idadeMiddleware, (req, res) => {
  res.render('minor', req.query);
});

app.listen(3000);
