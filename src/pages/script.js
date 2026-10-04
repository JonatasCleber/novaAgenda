const form = document.getElementById('form-agendar')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = Object.fromEntries(new FormData(form)) //ler todos os inputs com name 
    dados.aceite = form.aceite.checked

    const resposta = await fetch('http://localhost:3000/agendamentos',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(dados)
    })
    const resultado = await resposta.json()

    if (!resposta.ok){
        alert(resultado.erro)
        return
    }
    alert('Agendamento realizado!')
    form.reset()
})