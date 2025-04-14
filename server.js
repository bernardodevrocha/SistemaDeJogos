const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get("/games", (req, res) => {
    db.query('SELECT * FROM games', (err, rows) => {
        if(err){
            res.status(500).json({error: "Erro ao buscar os jogos"});
        }else{
            res.status(200).json(rows);
        }
    })
})

app.get("/games/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(req.params.id)){
        res.sendStatus(400).json({error: "Digite um número ao invés de letras"});
    }else{
        db.query('SELECT * FROM games WHERE id = ?', [id], (err, rows) => {
            if(err){
                res.status(500).json({error: "Erro ao buscar o jogo"});
            }else{
                res.status(200).json(rows);
            }
        })

    }
})

app.post('/game', (req, res) => {
    var { title, price, year } = req.body;
    if(!title || !price || !year){
        res.status(400).json({error: "Preencha todos os campos"});
    }else{
        db.query('insert into games (title, price, year) VALUES(?, ?, ?)', [title, price, year], (err, rows) => {
            if(err){
                res.status(500).json({error: "Erro ao criar um novo jogo!"});
            }else{
                res.status(200).json({message: "Jogo criado com sucesso!"});
            }
        })
    }
})

app.delete('/game/:id', (req, res) => {
    var id = req.params.id;
    if(id == - 1 || id === 0) {
        res.status(400).json({error: "Digite um número positivo maior que 0"});
    }
    if(isNaN(req.params.id)){
        res.sendStatus(400).json({error: "Digite um número ao invés de letras"});
    }else{
        db.query('DELETE FROM GAMES WHERE ID = ?', [id], (err, rows) => {
            if(err){
                res.status(500).json({error: "Erro ao deletar o jogo"});
            }else{
                res.status(200).json({message: "Jogo deletado com sucesso!"});
            }
        })
    }
})

app.put("/game/:id", (req, res) => {
    var id = req.params.id;
    if(id == -1 || id === 0) {
        res.status(400).json({error: "Digite um número positivo maior que 0"});
    }
    if(isNaN(req.params.id)){
       res.sendStatus(400).json({error:"Digite um número ao invés de letras"});
    }

    var { title, price, year } = req.body;

    if(!title || !price || !year){
        return res.status(400).json({error: "Preencha todos os campos necessários!!!"});
    }

    db.query("UPDATE games SET title = ?, price = ?, year = ? WHERE id = ?", [title, price, year, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar o jogo" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Jogo não encontrado!" });
        }

        return res.status(200).json({ message: "Jogo atualizado com sucesso!" });
    });
})

app.listen(3000, () => {
  console.log("Servidor em execução!");
  console.log("http://localhost:3000");
});
