const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.post("/agendamentos", (req, res) => {
    console.log(req.body)
    const {nome, cpf, telefone, email} = req.body

    if (!nome || !cpf || !telefone || !email){
        return res.status(400).json({erro: 'preencha todos os campos'})
    }
    res.status(201).json({mensagem: 'Recebi'})
})

app.listen(3000, () => {
    console.log("servidor rodando")
})