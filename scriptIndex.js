import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const botaoMultiplicador = document.querySelector('#aumentarMult');
const botaoModoEscuro = document.querySelector('#botaoModoEscuro, .botaoModoEscuro');

const textoResultado = document.querySelector('#Resultado');
const textoTotalAtual = document.querySelector('#dinheiroAtual');
const textoCliquesTotal = document.querySelector('#totalGerNum');
const textoMultiplicador = document.querySelector('#totalMultiplicador');
const textoDica = document.querySelector('.dica');

const cartasDiv = document.querySelector('#cartasDiv');
const spanValorAdquirido = document.querySelector('.valorAdquirido');
const botoesCarta = document.querySelectorAll('.carta');

const nomeContaHeader = document.querySelector('#nomeContaHeader');
const fotoContaHeader = document.querySelector('#fotoContaHeader');

let dinheiroAtual = Number(localStorage.getItem("dinheiro")) || 0;
let cliques = Number(localStorage.getItem("cliques")) || 0;
let valorMultiplicador = Number(localStorage.getItem("multiplicador")) || 1;
let proximaMeta = Number(localStorage.getItem("proximaMeta")) || 1000;
let bonusFixoPorClique = Number(localStorage.getItem("bonusFixo")) || 0;
let maximoDado = Number(localStorage.getItem("maximoDado")) || 100;

let modoEscuro = localStorage.getItem("tema") === "escuro";

const baralhoDeCartas = [
    {
        titulo: "Multiplicador +1",
        descricao: "Aumente seu multiplicador em +1x!",
        efeito: () => {
            valorMultiplicador++;
            atualizarTextoDica();
        }
    },
    {
        titulo: "Sorte Grande",
        descricao: "Ganha instantaneamente +25% do seu dinheiro atual.",
        efeito: () => {
            dinheiroAtual = Math.floor(dinheiroAtual * 1.25);
        }
    },
    {
        titulo: "Dado Aprimorado",
        descricao: "Os números sorteados agora vão até +15 a mais no limite máximo.",
        efeito: () => {
            maximoDado += 15;
            localStorage.setItem("maximoDado", maximoDado);
            atualizarTextoDica();
        }
    },
    {
        titulo: "Renda Passiva",
        descricao: "Ganha +25 de dinheiro garantido a cada clique.",
        efeito: () => {
            bonusFixoPorClique += 25;
            localStorage.setItem("bonusFixo", bonusFixoPorClique);
        }
    },
    {
        titulo: "Décimo Terceiro",
        descricao: "Multiplica seu multiplicador atual por 1.5x.",
        efeito: () => {
            valorMultiplicador = Math.max(valorMultiplicador + 1, Math.floor(valorMultiplicador * 1.5));
            atualizarTextoDica();
        }
    },
    {
        titulo: "Tudo. Ou. Nada...",
        descricao: 'Tenha uma chance de multiplicar seu dinheiro atual por 100, mas caso não consiga... você perde tudo. Chance "1/500"',
        efeito: () => {
            const ganhou = Math.floor(Math.random() * 500) === 0;

            if (ganhou) {
                dinheiroAtual = Math.floor(dinheiroAtual * 100);
            } else {
                dinheiroAtual = 0;
                valorMultiplicador = 1;
                maximoDado = 100;
                bonusFixoPorClique = 0;
                cliques = Math.max(0, cliques - 1);
                proximaMeta = 1895;

                localStorage.setItem("maximoDado", maximoDado);
                localStorage.setItem("bonusFixo", bonusFixoPorClique);
                atualizarTextoDica();
                alert("Vish... não foi dessa vez");
            }
        }
    }
];

/* === Funções Auxiliares === */
function atualizarTextoDica() {
    if (!textoDica) return;
    if (valorMultiplicador <= 1) {
        valorMultiplicador = 1;
        textoDica.textContent = `Os números variam de 1 a ${maximoDado}`;
    } else {
        textoDica.textContent = `Os números variam de 1 a ${maximoDado}, e são multiplicados por ${valorMultiplicador}`;
    }
}

function atualizarInterfaceESalvar() {
    if (textoTotalAtual) textoTotalAtual.textContent = dinheiroAtual;
    if (textoCliquesTotal) textoCliquesTotal.textContent = cliques;
    if (textoMultiplicador) textoMultiplicador.textContent = valorMultiplicador;

    localStorage.setItem("dinheiro", dinheiroAtual);
    localStorage.setItem("cliques", cliques);
    localStorage.setItem("multiplicador", valorMultiplicador);
    localStorage.setItem("proximaMeta", proximaMeta);

    if (auth.currentUser) {
        update(ref(db, "usuarios/" + auth.currentUser.uid), {
            dinheiro: dinheiroAtual,
            cliques: cliques,
            multiplicador: valorMultiplicador
        });
    }
}

function abrirPopUpCartas(metaAtingida) {
    if (!cartasDiv) return;
    if (spanValorAdquirido) spanValorAdquirido.textContent = metaAtingida;

    const cartasSorteadas = [...baralhoDeCartas]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    botoesCarta.forEach((botao, index) => {
        const carta = cartasSorteadas[index];
        const tituloEl = botao.querySelector('h3');
        const descEl = botao.querySelector('p');

        tituloEl.textContent = carta.titulo;
        descEl.textContent = carta.descricao;

        botao.onclick = () => {
            carta.efeito();
            atualizarInterfaceESalvar();
            cartasDiv.classList.add('esconder');
        };
    });

    cartasDiv.classList.remove('esconder');
}

/* === Inicialização ao carregar a página === */
document.body.setAttribute("data-tema", modoEscuro ? "escuro" : "claro");

if (textoTotalAtual) textoTotalAtual.textContent = dinheiroAtual;
if (textoCliquesTotal) textoCliquesTotal.textContent = cliques;
if (textoMultiplicador) textoMultiplicador.textContent = valorMultiplicador;
atualizarTextoDica();

if (localStorage.getItem("usuarioNome") && nomeContaHeader) {
    nomeContaHeader.textContent = localStorage.getItem("usuarioNome");
}
if (localStorage.getItem("usuarioFoto") && fotoContaHeader) {
    fotoContaHeader.src = localStorage.getItem("usuarioFoto");
}

/* === Carrega dados da conta logada === */
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
            atualizarTextoDica();
        }
    }
});

/* === Botão Gerar Número === */
if (botaoGerarNum) {
    botaoGerarNum.addEventListener('click', function() {
        let aux = 0;
        cliques++;

        for (let i = 0; i < valorMultiplicador; i++) {
            const valorGerado = Math.floor(Math.random() * maximoDado) + 1;
            aux += valorGerado;
        }

        aux += bonusFixoPorClique;
        dinheiroAtual += aux;
        if (textoResultado) textoResultado.textContent = aux;

        if (dinheiroAtual >= proximaMeta) {
            const metaAtual = proximaMeta;
            proximaMeta = Math.floor(proximaMeta * 2.2);
            abrirPopUpCartas(metaAtual);
        }

        atualizarInterfaceESalvar();
    });
}

/* === Botão Modo Escuro === */
if (botaoModoEscuro) {
    botaoModoEscuro.addEventListener('click', function() {
        modoEscuro = !modoEscuro;
        const tema = modoEscuro ? "escuro" : "claro";
        document.body.setAttribute("data-tema", tema);
        localStorage.setItem("tema", tema);
    });
}

/* === Edição de Nome === */
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