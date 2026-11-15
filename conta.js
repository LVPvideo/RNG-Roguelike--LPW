import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
            if (dados.foto && pfp) pfp.src = dados.foto;
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
            await update(ref(db, "usuarios/" + usuario.uid), {
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

function comprimirImagem(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const tamanho = 150;
                canvas.width = tamanho;
                canvas.height = tamanho;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, tamanho, tamanho);

                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.onerror = () => reject(new Error("Formato de imagem inválido."));
            img.src = e.target.result;
        };
        leitor.onerror = () => reject(new Error("Erro ao ler o arquivo."));
        leitor.readAsDataURL(arquivo);
    });
}

if (inputFoto && pfp) {
    inputFoto.addEventListener("change", async (event) => {
        const arquivo = event.target.files[0];
        const usuario = auth.currentUser;

        if (!arquivo) return;
        if (!usuario) return alert("Faça login antes de trocar a foto!");

        try {
            const fotoComprimida = await comprimirImagem(arquivo);

            pfp.src = fotoComprimida;
            localStorage.setItem("usuarioFoto", fotoComprimida);

            await update(ref(db, "usuarios/" + usuario.uid), {
                foto: fotoComprimida
            });
        } catch (erro) {
            alert("Erro ao trocar foto: " + erro.message);
        } finally {
            inputFoto.value = ""; 
        }
    });
}