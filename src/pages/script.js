const form = document.getElementById('form-agendar')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = Object.fromEntries(new FormData(form)) //ler todos os inputs com name 
    dados.aceite = form.aceite.checked

    const resposta = await fetch('http://localhost:3000/agendamentos', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(dados)
    })
    const resultado = await resposta.json()

    if (!resposta.ok) {
        alert(resultado.erro)
        return
    }
    alert('Agendamento realizado!')
    form.reset()
})

if (form) {
    const nomeCompleto = document.getElementById("nome");     // Guarda o input do nome
    const dataNascimento = document.getElementById("data-nascimento"); // Guarda o input de data de nascimento
    const campoCpf = document.getElementById("cpf");                  // Guarda o input de CPF
    const email = document.getElementById("email");
    const campoTelefone = document.getElementById("telefone");                  // Guarda o input de e-mail            // Guarda a caixa de texto (textarea) da mensagem


    const hoje = new Date()

    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const dataAtual = `${ano}-${mes}-${dia}`;

    dataNascimento.setAttribute("min", "1900-01-01");
    dataNascimento.setAttribute("max", dataAtual);


    function validarDataNascimento() {
        if (
            dataNascimento.value !== "" &&
            (
                dataNascimento.value < "1900-01-01" ||
                dataNascimento.value > dataAtual
            )
        ) {
            dataNascimento.setCustomValidity(
                "Escolha uma data entre 01/01/1900 e hoje."
            );
        } else {

            dataNascimento.setCustomValidity("");
        }
    }


    function validarNome() {
        const nome = nomeCompleto.value.trim();
        const partesNome = nome
            .split(/\s+/)
            .filter(Boolean);


        if (nome === "") {
            nomeCompleto.setCustomValidity("");
            return;
        }

        if (nome.length < 5 || partesNome.length < 2) {
            // Se violar a regra, exibe a mensagem de erro customizada.
            nomeCompleto.setCustomValidity(
                "Digite seu nome completo, incluindo nome e sobrenome."
            );
        } else {
            // Caso contrário, limpa o erro.
            nomeCompleto.setCustomValidity("");
        }

    }
    nomeCompleto.addEventListener("input", validarNome)

    function formatarCPF(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 3) {
            return numeros;
        }

        if (numeros.length <= 6) {
            return numeros.replace(
                /^(\d{3})(\d+)/,
                "$1.$2"
            );
        }
        if (numeros.length <= 9) {
            return numeros.replace(
                /^(\d{3})(\d{3})(\d+)/,
                "$1.$2.$3"
            );
        }
        return numeros.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
            "$1.$2.$3-$4"
        );
    }
    function cpfValido(valor) {
        const cpf = valor.replace(/\D/g, "");

        if (cpf.length !== 11) {
            return false;
        }
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            // 'Number(cpf[i])' converte o caractere da posição 'i' em número inteiro.
            // Multiplica por '(10 - i)' e acumula o valor somando na variável 'soma'.
            soma += Number(cpf[i]) * (10 - i);
        }

        let resto = (soma * 10) % 11;
        if (resto === 10) {
            resto = 0;
        }

        if (resto !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        resto = (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }
        return resto === Number(cpf[10]);
    }
    campoCpf.addEventListener("input", function () {

        campoCpf.value = formatarCPF(campoCpf.value);

        if (campoCpf.value === "") {
            campoCpf.setCustomValidity("");
        } else if (!cpfValido(campoCpf.value)) {
            campoCpf.setCustomValidity(
                "Digite um CPF válido e confira os números."
            );
        } else {
            campoCpf.setCustomValidity("");
        }
    })

    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 7) {
            return numeros.replace(/^(\d{2})(\d+)/, "($1) $2");
        }

        return numeros.replace(/^(\d{2})(\d{5})(\d{1,4})$/, "($1) $2-$3");
    }

    function telefoneValido(valor) {
        const numeros = valor.replace(/\D/g, "");

        // 11 dígitos: DDD (2) + 9 + número (8)
        if (numeros.length !== 11) {
            return false;
        }

        // DDD não pode começar com 0
        if (numeros[0] === "0") {
            return false;
        }

        // celular/WhatsApp sempre começa com 9 depois do DDD
        if (numeros[2] !== "9") {
            return false;
        }

        return true;
    }

    campoTelefone.addEventListener("input", function () {
        campoTelefone.value = formatarTelefone(campoTelefone.value);

        if (campoTelefone.value === "") {
            campoTelefone.setCustomValidity("");
        } else if (!telefoneValido(campoTelefone.value)) {
            campoTelefone.setCustomValidity(
                "Digite um número com DDD, ex: (75) 99999-9999."
            );
        } else {
            campoTelefone.setCustomValidity("");
        }
    });


}