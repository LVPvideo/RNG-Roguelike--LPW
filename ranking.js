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