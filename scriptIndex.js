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
<<<<<<< HEAD

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
=======
if (modoEscuro) {
    document.documentElement.setAttribute("data-tema", "escuro");
}

const baralhoDeCartas = [
    {
        titulo: "Multiplicador +1",
        descricao: "Aumente seu multiplicador em +1x!",
        efeito: () => {
            valorMultiplicador++;
            document.querySelector('.dica').textContent = `Os números variam de 1 a ${maximoDado}, e são multiplicados por ${valorMultiplicador}`
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
            document.querySelector('.dica').textContent = `Os números variam de 1 a ${maximoDado}, e são multiplicados por ${valorMultiplicador}`;
            if(valorMultiplicador <= 1){
                document.querySelector('.dica').textContent = `Os números variam de 1 a ${maximoDado}`
                valorMultiplicador = 1;
            }
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
        }
    },
    {
        titulo: "Tudo. Ou. Nada...",
        descricao: 'Tenha uma chance de multiplicar seu dinheiro atual por 100, mas caso não consiga... você perde tudo. Chance "1/500"',
        efeito: () => {
            let valorGerado;

            
            valorGerado = Math.random();
            valorGerado = (Math.floor(valorGerado * 500) === 0);
            

            if(valorGerado)
                dinheiroAtual = Math.floor(dinheiroAtual * 100);
            else {
                dinheiroAtual = 0;
                valorMultiplicador = 1;
                maximoDado = 100;
                cliques = Math.max(0, cliques - 1);
                alert("Vish... não foi dessa vez");
                proximaMeta = 1895;

                localStorage.setItem("maximoDado", maximoDado);
            }
        }
    }
];

/* === Fim das Declarações === */

/* === Inicialização dos valores de estatísticas == */

textoTotalAtual.textContent = dinheiroAtual;
textoCliquesTotal.textContent = cliques;
document.querySelector('.dica').textContent = `Os números variam de 1 a ${maximoDado}, e são multiplicados por ${valorMultiplicador}`

if(valorMultiplicador <= 1){
    document.querySelector('.dica').textContent = `Os números variam de 1 a ${maximoDado}`
    valorMultiplicador = 1;
}
>>>>>>> 8d71c4ffab37b4a0ddac1e38b8061213cbc0893e

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

<<<<<<< HEAD

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
=======
botaoGerarNum.addEventListener('click', function() {
    let aux = 0;
    cliques++;

    for (let i = 0; i < valorMultiplicador; i++) {
        const valorGerado = Math.floor(Math.random() * maximoDado) + 1;
        aux += valorGerado;
    }

    aux += bonusFixoPorClique;
    dinheiroAtual += aux;
    textoResultado.textContent = aux;

    if (dinheiroAtual >= proximaMeta) {
        const metaAtual = proximaMeta;
        proximaMeta = Math.floor(proximaMeta * 2.2);
        abrirPopUpCartas(metaAtual);
    }

    atualizarInterfaceESalvar();
});


botaoModoEscuro.addEventListener('click', function() {
    modoEscuro = !modoEscuro;

    if (modoEscuro) {
        document.documentElement.setAttribute("data-tema", "escuro");
        localStorage.setItem("tema", "escuro");
    } else {
        document.documentElement.removeAttribute("data-tema");
        localStorage.setItem("tema", "claro");
    }
    
});
>>>>>>> 8d71c4ffab37b4a0ddac1e38b8061213cbc0893e

if (botaoSalvar && inputNome && visorNome) {
    botaoSalvar.addEventListener("click", () => {
        const novoNome = inputNome.value.trim();

<<<<<<< HEAD
=======
if (botaoSalvar && inputNome && visorNome) {
    botaoSalvar.addEventListener("click", () => {
        const novoNome = inputNome.value.trim();
>>>>>>> 8d71c4ffab37b4a0ddac1e38b8061213cbc0893e
        if (novoNome !== "") {
            visorNome.textContent = novoNome;
            localStorage.setItem("nomeUsuario", novoNome);
        }
    });
<<<<<<< HEAD
=======
}

function abrirPopUpCartas(metaAtingida) {
    spanValorAdquirido.textContent = metaAtingida;

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

function atualizarInterfaceESalvar() {
    textoTotalAtual.textContent = dinheiroAtual;
    textoCliquesTotal.textContent = cliques;
    textoMultiplicador.textContent = valorMultiplicador;

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
>>>>>>> 8d71c4ffab37b4a0ddac1e38b8061213cbc0893e
}