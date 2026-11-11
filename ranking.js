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