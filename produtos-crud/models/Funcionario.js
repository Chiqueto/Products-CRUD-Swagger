const mongoose = require("mongoose");

const Funcionario = new mongoose.model("Funcionario", {
  nome: String,
  cargo: String,
  salario: Number,
  contratado: Boolean,
});

module.exports = Funcionario;
