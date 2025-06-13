const mongoose = require("mongoose");

const Produto = new mongoose.model("Produto", {
  id: String,
  nome: String,
  descrição: String,
  cor: String,
  peso: Number,
  tipo: String,
  preco: Number,
  dataCadastro: Date
});

module.exports = Produto;
