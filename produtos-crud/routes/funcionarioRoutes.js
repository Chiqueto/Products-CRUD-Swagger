const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Funcionario = require("../models/funcionario");

router.post("/", (req, res) => {
  const { nome, cargo, salario, contratado } = req.body;

  if (!nome || !cargo || !salario || contratado === undefined) {
    res.status(422).json({ error: "Todos os campos são obrigatórios!" });
    return;
  }

  const funcionario = {
    nome,
    cargo,
    salario,
    contratado,
  };
  try {
    Funcionario.create(funcionario);
    res.status(201).json({ message: "Funcionário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const funcionarios = await Funcionario.find();
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:nome", async (req, res) => {
  const { nome } = req.params;
  if (!nome) {
    return res
      .status(400)
      .json({ message: "O parâmetro 'nome' é obrigatório!" });
  }

  try {
    const funcionarioExistente = await Funcionario.findOne({ nome });

    if (!funcionarioExistente) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    const result = await Funcionario.deleteOne({ nome });
    res
      .status(200)
      .json({ result, message: "Funcionário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:nome", async (req, res) => {
  const { nome } = req.params;
  const { cargo, salario, contratado } = req.body;

  if (!cargo && salario === undefined && contratado === undefined) {
    return res.status(400).json({
      error: "Ao menos um campo para atualização deve ser fornecido!",
    });
  }

  const updates = {};
  if (cargo) {
    updates.cargo = cargo;
  }
  if (salario !== undefined) {
    updates.salario = salario;
  }
  if (contratado !== undefined) {
    updates.contratado = contratado;
  }

  try {
    const funcionarioAtualizado = await Funcionario.findOneAndUpdate(
      { nome: nome },
      { $set: updates },
      { new: true } // Retorna o documento modificado em vez do original
    );

    if (!funcionarioAtualizado) {
      return res.status(404).json({ message: "Funcionário não encontrado!" });
    }

    res.status(200).json({
      message: "Funcionário atualizado com sucesso!",
      funcionario: funcionarioAtualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
