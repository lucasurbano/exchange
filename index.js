require('dotenv').config();

const express = require('express');

const Datastore = require('nedb');

const db = new Datastore({ filename: './data/data.db', autoload: true });

const app = express();

app.get('/exchange', (req, res) => {
  db.find({}, (err, docs) => {
    res.send(docs);
  });
});

app.use('/exchange/:amount/:from/:to/:rate', (req, res) => {
  const exchangeRequest = req.params; // Possui todos os parametros da requisicao.
  const conversion = exchangeRequest.amount * exchangeRequest.rate; // Valor convertido

  db.findOne({ moeda: exchangeRequest.to }, (err, docs) => {
    res.send({
      valorConvertido: conversion,
      simboloMoeda: docs.simboloMoeda,
    });
  });
});

// Passamos a porta onde o servidor ficará ouvindo
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

app.use((req, res, next) => {
  const erro = new Error('Não encontrado');
  erro.status = 404;
  next(erro);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});
