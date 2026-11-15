import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const botaoMultiplicador = document.querySelector('#aumentarMult');
const botaoModoEscuro = document.querySelector('#botaoModoEscuro');

const textoResultado = document.querySelector('#Resultado');
const textoTotalAtual = document.querySelector('#dinheiroAtual');
const textoCliquesTotal = document.querySelector('#totalGerNum');
const textoMultiplicador = document.querySelector('#totalMultiplicador');

const nomeContaHeader = document.querySelector('#nomeContaHeader');
const fotoContaHeader = document.querySelector('#fotoContaHeader');

let dinheiroAtual = Number(localStorage.getItem("dinheiro")) || 0;
/* Esse código busca nos valores salvos o "dinheiro", e se não achar, o valor é 0 */
let cliques = Number(localStorage.getItem("cliques")) || 0;
let valorMultiplicador = Number(localStorage.getItem("multiplicador")) || 1;

let modoEscuro = false;

/* === Fim das Declarações === */



/* === Inicialização dos valores de estatísticas == */

textoTotalAtual.textContent = dinheiroAtual;
textoCliquesTotal.textContent = cliques;

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

botaoGerarNum.addEventListener('click', function(){
    let valorGerado, aux = 0;
    cliques++;
    for(let i = 0; i < valorMultiplicador; i++) {
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

    textoResultado.textContent = aux;
    textoTotalAtual.textContent = dinheiroAtual;
    textoCliquesTotal.textContent = cliques;
});


//botaoMultiplicador.addEventListener('click', function() {
//    valorMultiplicador++;
//    textoMultiplicador.textContent = valorMultiplicador;
//});

//O código funciona, agora falta mudar o jeito que aumenta o multiplicador :P

botaoModoEscuro.addEventListener('click', function() {
    if(modoEscuro)
        modoEscuro = false;
    else
        modoEscuro = true;

    if (modoEscuro) 
        document.documentElement.setAttribute("data-tema", "escuro");
    else 
        document.documentElement.removeAttribute("data-tema");
    
});

let botaoSalvar = document.getElementById("botaoSalvar");
let inputNome = document.getElementById("inputNome");
let visorNome = document.getElementById("visorNome");

botaoSalvar.addEventListener("click", () => {
    const novoNome = inputNome.value.trim();

    if (novoNome !== "") {
        visorNome.textContent = novoNome;
        
        localStorage.setItem("nomeUsuario", novoNome);
    }
});