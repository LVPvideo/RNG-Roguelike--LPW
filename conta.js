import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const areaLogin = document.getElementById("areaLogin");
const informacoesConta = document.getElementById("informacoesConta");
const inputEmail = document.getElementById("inputEmail");
const inputSenha = document.getElementById("inputSenha");
const botaoEntrar = document.getElementById("botaoEntrar");
const botaoCadastrar = document.getElementById("botaoCadastrar");
const statusAuth = document.getElementById("statusAuth");

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

if (botaoCadastrar) {
    botaoCadastrar.addEventListener("click", async () => {
        try {
            statusAuth.textContent = "Criando conta...";
            await createUserWithEmailAndPassword(auth, inputEmail.value, inputSenha.value);
            statusAuth.textContent = "";
        } catch (erro) {
            statusAuth.textContent = "Erro ao cadastrar: " + erro.message;
        }
    });
}

if (botaoEntrar) {
    botaoEntrar.addEventListener("click", async () => {
        try {
            statusAuth.textContent = "Entrando...";
            await signInWithEmailAndPassword(auth, inputEmail.value, inputSenha.value);
            statusAuth.textContent = "";
        } catch (erro) {
            statusAuth.textContent = "E-mail ou senha inválidos.";
        }
    });
}

onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
        if (areaLogin) areaLogin.style.display = "none";
        if (informacoesConta) informacoesConta.style.display = "flex";

        const snapshot = await get(ref(db, "usuarios/" + usuario.uid));
        if (snapshot.exists()) {
            const dados = snapshot.val();
            if (dados.nome) visorNome.textContent = dados.nome;
            if (dados.arroba) visorArroba.textContent = dados.arroba;
            if (dados.bio) visorBio.textContent = dados.bio;
        }
    } else {
        if (areaLogin) areaLogin.style.display = "block";
        if (informacoesConta) informacoesConta.style.display = "none";
    }
});

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
    botaoSalvar.addEventListener("click", async () => {
        const usuario = auth.currentUser;
        if (!usuario) return alert("Faça login primeiro!");

        const novoNome = inputNome.value;
        const novoArroba = inputArroba.value;
        const novaBio = inputBio.value;

        try {
            await set(ref(db, "usuarios/" + usuario.uid), {
                nome: novoNome,
                arroba: novoArroba,
                bio: novaBio
            });

            localStorage.setItem("usuarioNome", novoNome);
            visorNome.textContent = novoNome;
            visorArroba.textContent = novoArroba;
            visorBio.textContent = novaBio;

            if (modoEdicao) modoEdicao.style.display = "none";
            if (modoVisualizacao) modoVisualizacao.style.display = "block";
        } catch (erro) {
            alert("Erro ao salvar: " + erro.message);
        }
    });
}

if (localStorage.getItem("usuarioFoto") && pfp) {
    pfp.src = localStorage.getItem("usuarioFoto");
}

if (botaoTrocarFoto && inputFoto) {
    botaoTrocarFoto.addEventListener("click", () => inputFoto.click());
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