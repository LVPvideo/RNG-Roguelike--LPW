const CHAVE_RANKING = "ranking";


function carregarRanking() {
    try {
        const lista = JSON.parse(localStorage.getItem(CHAVE_RANKING));
        return Array.isArray(lista) ? lista : [];
    } catch (erro) {
        return [];
    }
}

function salvarRanking(lista) {
    localStorage.setItem(CHAVE_RANKING, JSON.stringify(lista));
}

function ordenarRanking(lista) {
    return lista.slice().sort(function(a, b) {
        return b.pontos - a.pontos;
    });
}

function registrarPontuacao(nome, pontos) {
    const lista = carregarRanking();
    const existente = lista.find(function(jogador) {
        return jogador.nome.toLowerCase() === nome.toLowerCase();
    });

    if (!existente) {
        lista.push({ nome: nome, pontos: pontos, data: new Date().toISOString() });
    } else if (pontos > existente.pontos) {
        existente.pontos = pontos;
        existente.data = new Date().toISOString();
    }

    salvarRanking(lista);
}

const listaRanking = document.querySelector('#listaRanking');
const mensagemVazio = document.querySelector('#mensagemVazio');

function criarItemRanking(jogador, posicao) {
    const item = document.createElement('li');
    item.className = 'itemRanking';

    const textoPosicao = document.createElement('span');
    textoPosicao.className = 'posicao';
    textoPosicao.textContent = posicao + 'º';

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
    const ranking = ordenarRanking(carregarRanking());

    listaRanking.replaceChildren();
    ranking.forEach(function(jogador, indice) {
        listaRanking.appendChild(criarItemRanking(jogador, indice + 1));
    });

    mensagemVazio.hidden = ranking.length > 0;
}

mostrarRanking();

const formRegistro = document.querySelector('#formRegistro');
const campoNome = document.querySelector('#campoNome');
const textoPontosAtuais = document.querySelector('#pontosAtuais');
const mensagemFormulario = document.querySelector('#mensagemFormulario');

const pontosAtuais = Number(localStorage.getItem('dinheiro')) || 0;
textoPontosAtuais.textContent = pontosAtuais.toLocaleString('pt-BR');

function mostrarMensagem(texto, ehErro) {
    mensagemFormulario.textContent = texto;
    mensagemFormulario.classList.toggle('erro', ehErro);
}

formRegistro.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();

    if (nome === '') {
        mostrarMensagem('Digite um nome para entrar no ranking.', true);
        return;
    }
    if (pontosAtuais <= 0) {
        mostrarMensagem('Gere alguns números no jogo antes de registrar.', true);
        return;
    }

    registrarPontuacao(nome, pontosAtuais);
    mostrarRanking();
    mostrarMensagem('Pontuação registrada!', false);
});