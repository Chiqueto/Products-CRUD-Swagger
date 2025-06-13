const express = require("express");
const mongoose = require("mongoose");

const server = express();
server.use(express.json());

//Middleware
server.use(
  express.urlencoded({
    extended: true,
  })
);

const DB_USER = "lfchiqueto";
const DB_PASSWORD = "TGv186WuZiqDtl95";

//Conexão com o MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@marciobackend.b1m6vcg.mongodb.net/?retryWrites=true&w=majority&appName=MarcioBackend`
  )
  .then(console.log("Conectado ao MongoDB Atlas com sucesso!"))
  .catch((e) => {
    console.log("Erro ao conectar ao MongoDB Atlas:", e);
  });

const funcionarioRoutes = require("./routes/funcionarioRoutes");

server.use("/funcionario", funcionarioRoutes);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

/*

const cursos = [
  "NodeJS",
  "ReactJS",
  "React Native",
  "JavaScript",
  "TypeScript",
];

// 1 – Middleware para verificar Request Body em PUT
function verificarRequestBodyPut(req, res, next) {
  if (req.method === "PUT" && Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Erro: Requisição PUT sem Request Body.",
      orientacao:
        "Envie os dados a serem atualizados no corpo da requisição (Request Body) no formato JSON.",
    });
  }
  next();
}

// 2 – Middleware para formatar a resposta do DELETE
function formatarRespostaDelete(req, res, next) {
  res.formatarRespostaDelete = (mensagem, cursos) => {
    return res.json({ mensagem, cursos });
  };
  next();
}

// 3 – Middleware para log de inserção de cursos
function logCursoInserido(req, res, next) {
  res.on("finish", () => {
    if (
      req.method === "POST" &&
      req.route.path === "/curso" &&
      res.statusCode >= 200 &&
      res.statusCode < 300
    ) {
      console.log(
        "Lista de cursos atualizada (após POST):",
        res.locals.cursosAtualizado
      );
    }
  });
  next();
}

// 4 – Middleware para log de deleção de cursos
function logCursoDeletado(req, res, next) {
  res.on("finish", () => {
    if (
      req.method === "DELETE" &&
      req.route.path.startsWith("/curso/") &&
      res.statusCode >= 200 &&
      res.statusCode < 300
    ) {
      console.log(
        "Lista de cursos atualizada (após DELETE):",
        res.locals.cursosAtualizado
      );
    }
  });
  next();
}

// Middleware de log geral (opcional)
// server.use((req, res, next) => {
//   console.log(`Método: ${req.method} | URL: ${req.url}`);
//   next();
// });

function checkCurso(req, res, next) {
  if (!req.body.novo_curso) {
    return res.status(400).json({
      error:
        "O campo 'novo_curso' é obrigatório! Nesse formato: {'novo_curso': 'Lua'}",
    });
  }
  return next();
}

function checkIdCurso(req, res, next) {
  const index = req.params.index;
  if (!cursos[index]) {
    return res
      .status(400)
      .json({ error: "Curso não encontrado no ID solicitado!" });
  }
  req.cursoIndex = parseInt(index); // Passando o índice para a rota
  next();
}

server.get("/curso/:index", checkIdCurso, (req, res) => {
  return res.json(cursos[req.params.index]);
});

server.get("/curso", (req, res) => {
  return res.json(cursos);
});

server.post("/curso", checkCurso, logCursoInserido, (req, res) => {
  const { novo_curso } = req.body;
  cursos.push(novo_curso);
  res.locals.cursosAtualizado = [...cursos]; // Passando a lista atualizada para o middleware de log
  return res.json(cursos);
});

server.put(
  "/curso/:index",
  verificarRequestBodyPut,
  checkIdCurso,
  (req, res) => {
    const { curso } = req.body;
    cursos[req.cursoIndex] = curso;
    return res.json(cursos);
  }
);

server.delete(
  "/curso/:index",
  checkIdCurso,
  formatarRespostaDelete,
  logCursoDeletado,
  (req, res) => {
    const cursoDeletado = cursos.splice(req.cursoIndex, 1);
    res.locals.cursosAtualizado = [...cursos]; // Passando a lista atualizada para o middleware de log
    res.formatarRespostaDelete(
      `Curso "${cursoDeletado[0]}" deletado com sucesso!`,
      cursos
    );
  }
);

*/
