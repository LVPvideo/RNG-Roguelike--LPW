import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const botaoMultiplicador = document.querySelector('#aumentarMult');
const botaoModoEscuro = document.querySelector('.botaoModoEscuro');

const textoResultado = document.querySelector('#Resultado');
const textoTotalAtual = document.querySelector('#dinheiroAtual');
const textoCliquesTotal = document.querySelector('#totalGerNum');
const textoMultiplicador = document.querySelector('#totalMultiplicador');

const nomeContaHeader = document.querySelector('#nomeContaHeader');
const fotoContaHeader = document.querySelector('#fotoContaHeader');

let dinheiroAtual = Number(localStorage.getItem("dinheiro")) || 0;
let cliques = Number(localStorage.getItem("cliques")) || 0;
let valorMultiplicador = Number(localStorage.getItem("multiplicador")) || 1;

let modoEscuro = localStorage.getItem("tema") === "escuro";

/* === Fim das Declarações === */


/* === Aplica o tema salvo ao carregar a página === */
if (modoEscuro) {
    document.body.setAttribute("data-tema", "escuro");
} else {
    document.body.setAttribute("data-tema", "claro");
}


/* === Inicialização dos valores de estatísticas === */
if (textoTotalAtual) textoTotalAtual.textContent = dinheiroAtual;
if (textoCliquesTotal) textoCliquesTotal.textContent = cliques;
if (textoMultiplicador) textoMultiplicador.textContent = valorMultiplicador;

if (localStorage.getItem("usuarioNome") && nomeContaHeader) {
    nomeContaHeader.textContent = localStorage.getItem("usuarioNome");
}
if (localStorage.getItem("usuarioFoto") && fotoContaHeader) {
    fotoContaHeader.src = localStorage.getItem("usuarioFoto");
}


/* === Carrega dinheiro, cliques e multiplicador da conta logada === */
onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
        const snapshot = await get(ref(db, "usuarios/" + usuario.uid));
        if (snapshot.exists()) {
            const dados = snapshot.val();
            if (dados.dinheiro !== undefined) dinheiroAtual = Number(dados.dinheiro);
            if (dados.cliques !== undefined) cliques = Number(dados.cliques);
            if (dados.multiplicador !== undefined) valorMultiplicador = Number(dados.multiplicador);

            if (dados.nome && nomeContaHeader) {
                nomeContaHeader.textContent = dados.nome;
                localStorage.setItem("usuarioNome", dados.nome);
            }
            if (dados.foto && fotoContaHeader) {
                fotoContaHeader.src = dados.foto;
                localStorage.setItem("usuarioFoto", dados.foto);
            }

            localStorage.setItem("dinheiro", dinheiroAtual);
            localStorage.setItem("cliques", cliques);
            localStorage.setItem("multiplicador", valorMultiplicador);

            if (textoTotalAtual) textoTotalAtual.textContent = dinheiroAtual;
            if (textoCliquesTotal) textoCliquesTotal.textContent = cliques;
            if (textoMultiplicador) textoMultiplicador.textContent = valorMultiplicador;
        }
    }
});


/* === Botão Gerar Número (só roda se existir na página) === */
if (botaoGerarNum) {
    botaoGerarNum.addEventListener('click', function() {
        let valorGerado, aux = 0;
        cliques++;
        for (let i = 0; i < valorMultiplicador; i++) {
            valorGerado = Math.random();
            valorGerado = (Math.floor(valorGerado * 100) + 1);
            aux += valorGerado;
        }

        dinheiroAtual += aux;
        localStorage.setItem("dinheiro", dinheiroAtual);
        localStorage.setItem("cliques", cliques);

        /* === Salva na nuvem se houver conta logada === */
        if (auth.currentUser) {
            update(ref(db, "usuarios/" + auth.currentUser.uid), {
                dinheiro: dinheiroAtual,
                cliques: cliques,
                multiplicador: valorMultiplicador
            });
        }

        if (textoResultado) textoResultado.textContent = aux;
        if (textoTotalAtual) textoTotalAtual.textContent = dinheiroAtual;
        if (textoCliquesTotal) textoCliquesTotal.textContent = cliques;
    });
}


/* === Botão Modo Escuro === */
if (botaoModoEscuro) {
    botaoModoEscuro.addEventListener('click', function() {
        modoEscuro = !modoEscuro;

        if (modoEscuro) {
            document.body.setAttribute("data-tema", "escuro");
            localStorage.setItem("tema", "escuro");
        } else {
            document.body.setAttribute("data-tema", "claro");
            localStorage.setItem("tema", "claro");
        }
    });
}


/* === Edição de Nome (só roda se existir na página) === */
const botaoSalvar = document.getElementById("botaoSalvar");
const inputNome = document.getElementById("inputNome");
const visorNome = document.getElementById("visorNome");

if (botaoSalvar && inputNome && visorNome) {
    botaoSalvar.addEventListener("click", () => {
        const novoNome = inputNome.value.trim();

        if (novoNome !== "") {
            visorNome.textContent = novoNome;
            localStorage.setItem("nomeUsuario", novoNome);
        }
    });
}