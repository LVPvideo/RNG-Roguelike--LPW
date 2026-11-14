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

function removerJogador(nome) {
    salvarRanking(carregarRanking().filter(function(jogador) {
        return jogador.nome !== nome;
    }));
}

const MEDALHAS = ['🥇', '🥈', '🥉'];

const listaRanking = document.querySelector('#listaRanking');
const mensagemVazio = document.querySelector('#mensagemVazio');
const botaoLimpar = document.querySelector('#botaoLimpar');

function criarItemRanking(jogador, posicao) {
    const item = document.createElement('li');
    item.className = 'itemRanking';
    if (posicao <= MEDALHAS.length) {
        item.classList.add('lugar' + posicao);
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

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'botaoRemover';
    botaoRemover.textContent = '✕';
    botaoRemover.title = 'Remover do ranking';
    botaoRemover.setAttribute('aria-label', 'Remover ' + jogador.nome + ' do ranking');
    botaoRemover.dataset.nome = jogador.nome;

    item.append(textoPosicao, textoNome, textoPontos, botaoRemover);
    return item;
}

function mostrarRanking() {
    const ranking = ordenarRanking(carregarRanking());

    listaRanking.replaceChildren();
    ranking.forEach(function(jogador, indice) {
        listaRanking.appendChild(criarItemRanking(jogador, indice + 1));
    });

    mensagemVazio.hidden = ranking.length > 0;
    botaoLimpar.hidden = ranking.length === 0;
}

listaRanking.addEventListener('click', function(evento) {
    const botao = evento.target.closest('.botaoRemover');
    if (botao) {
        removerJogador(botao.dataset.nome);
        mostrarRanking();
    }
});

let temporizadorLimpar;

botaoLimpar.addEventListener('click', function() {
    if (!botaoLimpar.classList.contains('confirmando')) {
        botaoLimpar.classList.add('confirmando');
        botaoLimpar.textContent = 'Clique de novo para apagar tudo';
        temporizadorLimpar = setTimeout(restaurarBotaoLimpar, 3000);
        return;
    }

    salvarRanking([]);
    restaurarBotaoLimpar();
    mostrarRanking();
});

function restaurarBotaoLimpar() {
    clearTimeout(temporizadorLimpar);
    botaoLimpar.classList.remove('confirmando');
    botaoLimpar.textContent = 'Limpar ranking';
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

const botaoModoEscuro = document.querySelector('#botaoModoEscuro');

function aplicarTema(escuro) {
    if (escuro) {
        document.documentElement.setAttribute('data-tema', 'escuro');
    } else {
        document.documentElement.removeAttribute('data-tema');
    }
}

aplicarTema(localStorage.getItem('tema') === 'escuro');

botaoModoEscuro.addEventListener('click', function() {
    const escuro = !document.documentElement.hasAttribute('data-tema');
    aplicarTema(escuro);
    localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
});

document.addEventListener("DOMContentLoaded", () => {
    const campoNome = document.getElementById("campoNome");
    const nomeSalvo = localStorage.getItem("usuarioNome");

    if (campoNome && nomeSalvo) {
        campoNome.value = nomeSalvo;
        campoNome.readOnly = true;
    }
});