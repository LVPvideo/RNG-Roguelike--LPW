import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const MEDALHAS = ['🥇', '🥈', '🥉'];
const LIMITE = 100;

const listaRanking = document.querySelector('#listaRanking');
const mensagemVazio = document.querySelector('#mensagemVazio');
const nomeLogado = document.querySelector('#nomeLogado');
const posicaoAtual = document.querySelector('#posicaoAtual');
const linkConta = document.querySelector('#linkConta');

let uidAtual = null;
let jogadores = [];

function criarItemRanking(jogador, posicao) {
    const item = document.createElement('li');
    item.className = 'itemRanking';
    if (posicao <= MEDALHAS.length) {
        item.classList.add('lugar' + posicao);
    }
    if (jogador.uid === uidAtual) {
        item.classList.add('meuItem');
    }

    const textoPosicao = document.createElement('span');
    textoPosicao.className = 'posicao';
    textoPosicao.textContent = MEDALHAS[posicao - 1] || posicao + 'º';

    const textoNome = document.createElement('span');
    textoNome.className = 'nomeJogador';
    textoNome.textContent = jogador.nome;

    const textoPontos = document.createElement('span');
    textoPontos.className = 'pontosJogador';
    textoPontos.textContent = jogador.pontos.toLocaleString('pt-BR');

    item.append(textoPosicao, textoNome, textoPontos);
    return item;
}

function mostrarRanking() {
    listaRanking.replaceChildren();
    jogadores.slice(0, LIMITE).forEach(function(jogador, indice) {
        listaRanking.appendChild(criarItemRanking(jogador, indice + 1));
    });
    mensagemVazio.hidden = jogadores.length > 0;

    const indiceMeu = jogadores.findIndex(function(jogador) {
        return jogador.uid === uidAtual;
    });

    if (!uidAtual) {
        nomeLogado.textContent = 'Entre na sua conta para aparecer aqui.';
        posicaoAtual.textContent = '-';
        linkConta.hidden = false;
    } else if (indiceMeu === -1) {
        nomeLogado.textContent = 'Você ainda não está no ranking. Gere alguns números!';
        posicaoAtual.textContent = '-';
        linkConta.hidden = true;
    } else {
        nomeLogado.textContent = jogadores[indiceMeu].nome;
        posicaoAtual.textContent = (indiceMeu + 1) + 'º lugar';
        linkConta.hidden = true;
    }
}

onValue(ref(db, 'ranking'), function(snapshot) {
    jogadores = [];
    snapshot.forEach(function(filho) {
        const dados = filho.val();
        if (dados && Number(dados.pontos) > 0) {
            jogadores.push({
                uid: filho.key,
                nome: String(dados.nome || 'Jogador'),
                pontos: Number(dados.pontos)
            });
        }
    });
    jogadores.sort(function(a, b) {
        return b.pontos - a.pontos;
    });
    mostrarRanking();
}, function() {
    mensagemVazio.textContent = 'Não foi possível carregar o ranking agora.';
    mensagemVazio.hidden = false;
});

onAuthStateChanged(auth, function(usuario) {
    uidAtual = usuario ? usuario.uid : null;
    mostrarRanking();
});

const botaoModoEscuro = document.querySelector('.botaoModoEscuro');

function aplicarTema(escuro) {
    if (escuro) {
        document.documentElement.setAttribute('data-tema', 'escuro');
    } else {
        document.documentElement.removeAttribute('data-tema');
    }
}

aplicarTema(localStorage.getItem('tema') === 'escuro');

if (botaoModoEscuro) {
    botaoModoEscuro.addEventListener('click', function() {
        const escuro = !document.documentElement.hasAttribute('data-tema');
        aplicarTema(escuro);
        localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    });
}