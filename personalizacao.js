
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

const seletorCor = document.querySelector('#seletorCor');
const peixe = document.querySelector('#peixe');

seletorCor.addEventListener('input', function() {
    peixe.style.backgroundColor = seletorCor.value;
});

const itens = [
    { id: 'chapeuMario', nome: 'Chapéu do Mario', imagem: 'imagens/chapeu_do_mario.png', preco: 1003, tipo: 'chapeu' },
    { id: 'bigode', nome: 'Bigode', imagem: 'imagens/bigode.png', preco: 700, tipo: 'bigode' },
    { id: 'laco', nome: 'Laço', imagem: 'imagens/laco.png', preco: 550, tipo: 'laco' },
    { id: 'rosa', nome: 'Rosa', imagem: 'imagens/rosa.png', preco: 1000, tipo: 'rosa' }
];

const loja = document.querySelector('#itensLoja');
const saldo = document.querySelector('#saldoMoedas');
const peixeAcessorio = document.querySelector('#acessorioEquipado');

let comprados = JSON.parse(localStorage.getItem('acessoriosComprados') || '[]');

function atualizar() {
    saldo.textContent = Number(localStorage.getItem('dinheiro')) || 0;

    loja.innerHTML = itens.map(item => `
        <div class="itemLoja">
            <img src="${item.imagem}" alt="${item.nome}">
            <h3>${item.nome}</h3>
            <p>${item.preco} moedas</p>
            <button data-id="${item.id}">
                ${!comprados.includes(item.id) ? 'Comprar' :
                localStorage.getItem('acessorioEquipado') === item.id ? 'Remover' : 'Equipar'}
            </button>
        </div>
    `).join('');
}


document.querySelector('#botaoAcessorios').onclick = () => {
    loja.hidden = !loja.hidden;
    if (!loja.hidden) atualizar();
};


loja.onclick = e => {
    const id = e.target.dataset.id;
    if (!id) return;

    const item = itens.find(i => i.id === id);
    const dinheiro = Number(localStorage.getItem('dinheiro')) || 0;

    if (!comprados.includes(id)) {
        if (dinheiro < item.preco) {
            alert('Moedas insuficientes!');
            return;
        }

        localStorage.setItem('dinheiro', dinheiro - item.preco);
        comprados.push(id);
        localStorage.setItem('acessoriosComprados', JSON.stringify(comprados));

    } else if (localStorage.getItem('acessorioEquipado') === id) {
        localStorage.removeItem('acessorioEquipado');
        peixeAcessorio.hidden = true;

    } else {
        localStorage.setItem('acessorioEquipado', id);
        peixeAcessorio.src = item.imagem;
        peixeAcessorio.className = item.tipo;
        peixeAcessorio.hidden = false;
    }

    atualizar();
};


const equipado = itens.find(i => i.id === localStorage.getItem('acessorioEquipado'));

if (equipado && comprados.includes(equipado.id)) {
    peixeAcessorio.src = equipado.imagem;
    peixeAcessorio.className = equipado.tipo;
    peixeAcessorio.hidden = false;
}

loja.hidden = true;
atualizar();
