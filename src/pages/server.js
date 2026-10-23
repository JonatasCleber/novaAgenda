const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())

const ARQUIVO = path.join(__dirname, 'agendamento.json')
function lerAgendamento() {
    try{
        const conteudo = fs.readFileSync(ARQUIVO, 'utf-8')
        return JSON.parse(conteudo)
    }catch(erro){
        return[]
    }
}

function salvarAgendamento(lista) {
    fs.writeFileSync(ARQUIVO, JSON.stringify(lista, null, 2))
}



app.post("/agendamentos", (req, res) => {
    console.log(req.body)
    const {nome, cpf, telefone, email} = req.body

    if (!nome || !cpf || !telefone || !email){
        return res.status(400).json({erro: 'preencha todos os campos'})
    }
    const novo = {
        ...req.body, //tudo que veio do formulario
        id: Date.now(), // indentificador unico simples
        criadoEm: new Date().toISOString() // data/hora do envio
    }
    const lista = lerAgendamento()
    lista.push(novo)
    salvarAgendamento(lista)
    res.status(201).json({mensagem: 'Recebi'})
})

app.get('/agendamentos', (req, res) => {
    const lista = lerAgendamento()
    res.json(lista)
})
app.listen(3000, () => {
    console.log("servidor rodando")
})