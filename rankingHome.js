import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const listaHome = document.querySelector('#rankingPagInicial ol');

/* Mostra os 10 maiores do ranking global na página inicial */
if (listaHome) {
    onValue(ref(db, 'ranking'), function(snapshot) {
        const jogadores = [];
        snapshot.forEach(function(filho) {
            const dados = filho.val();
            if (dados && Number(dados.pontos) > 0) {
                jogadores.push({ nome: String(dados.nome || 'Jogador'), pontos: Number(dados.pontos) });
            }
        });
        jogadores.sort(function(a, b) {
            return b.pontos - a.pontos;
        });

        listaHome.replaceChildren();
        if (jogadores.length === 0) {
            const vazio = document.createElement('li');
            vazio.textContent = 'Ninguém ainda. Seja o primeiro!';
            listaHome.appendChild(vazio);
            return;
        }
        jogadores.slice(0, 10).forEach(function(jogador) {
            const item = document.createElement('li');
            item.textContent = jogador.nome + ' - ' + jogador.pontos.toLocaleString('pt-BR');
            listaHome.appendChild(item);
        });
    });
}