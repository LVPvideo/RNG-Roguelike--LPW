document.addEventListener("DOMContentLoaded", () => {
    // 1. MODO ESCURO (Executa em qualquer página que tenha o botão)
    const botaoModoEscuro = document.getElementById("botaoModoEscuro");
    const body = document.body;

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo) {
        body.setAttribute("data-tema", temaSalvo);
    }

    if (botaoModoEscuro) {
        botaoModoEscuro.addEventListener("click", () => {
            if (body.getAttribute("data-tema") === "escuro") {
                body.removeAttribute("data-tema");
                localStorage.setItem("tema", "claro");
            } else {
                body.setAttribute("data-tema", "escuro");
                localStorage.setItem("tema", "escuro");
            }
        });
    }

    // 2. EDIÇÃO DA CONTA (Só roda se os elementos da página de conta existirem)
    const visorNome = document.getElementById("visorNome");
    const visorArroba = document.getElementById("visorArroba");
    const visorBio = document.getElementById("visorBio");
    const pfp = document.getElementById("pfp");

    const modoVisualizacao = document.getElementById("modoVisualizacao");
    const modoEdicao = document.getElementById("modoEdicao");

    const inputNome = document.getElementById("inputNome");
    const inputArroba = document.getElementById("inputArroba");
    const inputBio = document.getElementById("inputBio");
    const inputFoto = document.getElementById("inputFoto");

    const botaoEditar = document.getElementById("botaoEditar");
    const botaoSalvar = document.getElementById("botaoSalvar");
    const botaoCancelar = document.getElementById("botaoCancelar");
    const botaoTrocarFoto = document.getElementById("botaoTrocarFoto");

    // Verifica se estamos na página da conta antes de executar
    if (visorNome && visorArroba && visorBio) {
        // Carrega dados salvos
        if (localStorage.getItem("usuarioNome")) visorNome.textContent = localStorage.getItem("usuarioNome");
        if (localStorage.getItem("usuarioArroba")) visorArroba.textContent = localStorage.getItem("usuarioArroba");
        if (localStorage.getItem("usuarioBio")) visorBio.textContent = localStorage.getItem("usuarioBio");
        if (localStorage.getItem("usuarioFoto") && pfp) pfp.src = localStorage.getItem("usuarioFoto");

        if (botaoEditar) {
            botaoEditar.addEventListener("click", () => {
                inputNome.value = visorNome.textContent;
                inputArroba.value = visorArroba.textContent;
                inputBio.value = visorBio.textContent;

                if (modoVisualizacao) modoVisualizacao.style.display = "none";
                if (modoEdicao) modoEdicao.style.display = "block";
            });
        }

        if (botaoCancelar) {
            botaoCancelar.addEventListener("click", () => {
                if (modoEdicao) modoEdicao.style.display = "none";
                if (modoVisualizacao) modoVisualizacao.style.display = "block";
            });
        }

        if (botaoSalvar) {
            botaoSalvar.addEventListener("click", () => {
                const novoNome = inputNome.value;
                const novoArroba = inputArroba.value;
                const novaBio = inputBio.value;

                localStorage.setItem("usuarioNome", novoNome);
                localStorage.setItem("usuarioArroba", novoArroba);
                localStorage.setItem("usuarioBio", novaBio);

                visorNome.textContent = novoNome;
                visorArroba.textContent = novoArroba;
                visorBio.textContent = novaBio;

                if (modoEdicao) modoEdicao.style.display = "none";
                if (modoVisualizacao) modoVisualizacao.style.display = "block";
            });
        }

        if (botaoTrocarFoto && inputFoto) {
            botaoTrocarFoto.addEventListener("click", () => {
                inputFoto.click();
            });
        }

        if (inputFoto && pfp) {
            inputFoto.addEventListener("change", (event) => {
                const arquivo = event.target.files[0];
                if (arquivo) {
                    const leitor = new FileReader();
                    leitor.onload = function(e) {
                        const base64Image = e.target.result;
                        pfp.src = base64Image;
                        localStorage.setItem("usuarioFoto", base64Image);
                    };
                    leitor.readAsDataURL(arquivo);
                }
            });
        }
    }
});