require("dotenv").config();

const express = require("express");

const app = express();

const exchangesDB = require("./data/date.json");

const { exchanges: exchangesMock } = exchangesDB;

app.get("/exchange", (req, res) => {
  res.status(200).json(exchangesDB);
  console.dir(req.originalUrl);
});

app.use("/exchange/:amount/:from/:to/:rate", function (req, res) {
  const exchangeRequest = req.params; // Possui todos os parametros da requisicao.
  const conversion = exchangeRequest.amount * exchangeRequest.rate; // Valor convertido

  console.dir(conversion);

  const bind = exchangesMock.data.find(
    (exchange) => exchange.moeda === exchangeRequest.to
  );

  res.send({ valorConvertido: conversion, simboloMoeda: bind.simboloMoeda });
});

// Passamos a porta onde o servidor ficará ouvindo
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

app.use((req, res, next) => {
  const erro = new Error("Não encontrado");
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
