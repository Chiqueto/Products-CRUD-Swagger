const router = require("express").Router();
const mongoose = require("mongoose");
const Produto = require("../models/Produto");

/**
 * @swagger
 * tags:
 * name: Produtos
 * description: API para gerenciamento de produtos.
 */

/**
 * @swagger
 * /produto:
 *  post:
 *    summary: Cria um novo produto
 *    tags: [Produtos]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Produto'
 *          example:
 *            nome: "Teclado Mecânico RGB"
 *            descricao: "Teclado com switches blue e iluminação customizável"
 *            cor: "Preto"
 *            peso: 1.2
 *            tipo: "Periféricos"
 *            preco: 450.00
 *    responses:
 *      '201':
 *        description: Produto cadastrado com sucesso!
 *      '422':
 *        description: Erro de validação. Campos obrigatórios ausentes.
 *      '500':
 *        description: Ocorreu um erro no servidor.
 */
router.post("/", async (req, res) => {
  const { nome, descricao, cor, peso, tipo, preco } = req.body;
  if (
    !nome ||
    !descricao ||
    !cor ||
    peso === undefined ||
    !tipo ||
    preco === undefined
  ) {
    return res.status(422).json({ error: "Todos os campos são obrigatórios!" });
  }
  const produto = {
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
    dataCadastro: new Date(),
  };
  try {
    await Produto.create(produto);
    res.status(201).json({ message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produto:
 *  get:
 *    summary: Retorna a lista de todos os produtos.
 *    tags: [Produtos]
 *    responses:
 *      200:
 *        description: Lista de produtos retornada com sucesso.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Produto'
 *      500:
 *        description: Ocorreu um erro no servidor.
 */
router.get("/", async (req, res) => {
  try {
    const produtos = await Produto.find();
    // ATENÇÃO: seu código estava retornando 'funcionarios' aqui, corrigi para 'produtos'
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produto/{nome}:
 *  get:
 *    summary: Retorna o produto pelo nome.
 *    tags: [Produtos]
 *    parameters:
 *         - in: path
 *           name: nome
 *           schema:
 *             type: string
 *           required: true
 *           description: O nome do produto a ser buscado.
 *    responses:
 *      200:
 *        description: produto retornada com sucesso.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Produto'
 *      404:
 *        description: Nenhum produto encontrado.
 *      500:
 *        description: Ocorreu um erro no servidor.
 */
router.get("/:nome", async (req, res) => {
  const { nome } = req.params;
  try {
    const produtos = await Produto.findOne({ nome });

    if (!produtos) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produto/{nome}:
 *  delete:
 *    summary: Deleta um produto pelo nome.
 *    tags: [Produtos]
 *    parameters:
 *      - in: path
 *        name: nome
 *        schema:
 *          type: string
 *        required: true
 *        description: O nome do produto a ser deletado.
 *    responses:
 *      200:
 *        description: Produto deletado com sucesso.
 *      404:
 *        description: Produto não encontrado.
 *      500:
 *        description: Ocorreu um erro no servidor.
 */
router.delete("/:nome", async (req, res) => {
  const { nome } = req.params;

  try {
    const produtoExistente = await Produto.findOne({ nome });

    if (!produtoExistente) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }
    const result = await Produto.deleteOne({ nome });
    res.status(200).json({ result, message: "Produto deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /produto/{nome}:
 *  put:
 *    summary: Atualiza um produto existente pelo nome.
 *    tags: [Produtos]
 *    parameters:
 *      - in: path
 *        name: nome
 *        schema:
 *          type: string
 *        required: true
 *        description: O nome do produto a ser atualizado.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              descricao:
 *                type: string
 *              cor:
 *                type: string
 *              peso:
 *                type: number
 *              tipo:
 *                type: string
 *              preco:
 *                type: number
 *    responses:
 *      200:
 *        description: Produto atualizado com sucesso!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Produto'
 *      400:
 *        description: Requisição inválida, nenhum campo para atualizar foi fornecido.
 *      404:
 *        description: Produto não encontrado.
 *      500:
 *        description: Ocorreu um erro no servidor.
 */
router.put("/:nome", async (req, res) => {
  const { nome } = req.params;
  const { descricao, cor, peso, tipo, preco } = req.body;

  if (
    !descricao &&
    !cor &&
    peso === undefined &&
    !tipo &&
    preco === undefined
  ) {
    return res.status(400).json({
      error: "Ao menos um campo para atualização deve ser fornecido!",
    });
  }

  const updates = {};
  if (descricao) {
    updates.descricao = descricao;
  }
  if (cor) {
    updates.cor = cor;
  }
  if (peso !== undefined) {
    updates.peso = peso;
  }
  if (tipo) {
    updates.tipo = tipo;
  }
  if (preco !== undefined) {
    updates.preco = preco;
  }
  try {
    const produtoAtualizado = await Produto.findOneAndUpdate(
      { nome: nome },
      { $set: updates },
      { new: true } // Retorna o documento modificado em vez do original
    );

    if (!produtoAtualizado) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    res.status(200).json({
      message: "Produto atualizado com sucesso!",
      produto: produtoAtualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
