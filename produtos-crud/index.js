require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const server = express();
server.use(express.json());

//Middleware
server.use(
  express.urlencoded({
    extended: true,
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Produtos",
      version: "1.0.0",
      description:
        "Uma API simples para gerenciar produtos, documentada com Swagger",
    },

    components: {
      schemas: {
        Produto: {
          type: "object",
          required: ["nome", "descricao", "cor", "peso", "tipo", "preco"],
          properties: {
            id: {
              type: "string",
              description: "ID gerado automaticamente pelo MongoDB.",
              example: "60d0fe4f5311236168a109ca",
            },
            nome: {
              type: "string",
              description: "O nome do produto.",
              example: "Cadeira Gamer",
            },
            descricao: {
              type: "string",
              description: "Uma breve descrição sobre o produto.",
              example: "Cadeira ergonômica para longas sessões de jogos.",
            },
            cor: {
              type: "string",
              description: "A cor do produto.",
              example: "Preto e Vermelho",
            },
            peso: {
              type: "number",
              description: "O peso do produto em kg.",
              example: 18.5,
            },
            tipo: {
              type: "string",
              description: "A categoria ou tipo do produto.",
              example: "Móveis",
            },
            preco: {
              type: "number",
              format: "float",
              description: "O preço do produto.",
              example: 1250.99,
            },
            dataCadastro: {
              type: "string",
              format: "date-time",
              description: "A data em que o produto foi cadastrado.",
              example: "2025-06-13T18:20:00.000Z",
            },
          },
        },
      },
      requestBodies: {
        UpdateProductBody: {
          description:
            "Dados para atualizar um produto existente. Pelo menos um campo deve ser fornecido.",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  descricao: { type: "string" },
                  cor: { type: "string" },
                  peso: { type: "number" },
                  tipo: { type: "string" },
                  preco: { type: "number" },
                },
                example: {
                  descricao: "Cadeira ergonômica com apoio lombar ajustável.",
                  preco: 1350.0,
                },
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
      {
        url: `http://localhost:10000`,
      },
      {
        url: `https://jubilant-telegram-x46xqppgxpr2vg6j-3000.app.github.dev`,
      },
      {
        url: "https://products-crud-7qyd.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

//Conexão com o MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@marciobackend.b1m6vcg.mongodb.net/?retryWrites=true&w=majority&appName=MarcioBackend`
  )
  .then(console.log("Conectado ao MongoDB Atlas com sucesso!"))
  .catch((e) => {
    console.log("Erro ao conectar ao MongoDB Atlas:", e);
  });

const swaggerSpec = swaggerJsdoc(options);

const produtoRoutes = require("./routes/produtoRoutes");

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use("/produto", produtoRoutes);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
  console.log(
    "Documentação da API disponível em http://localhost:3000/api-docs"
  );
});
