import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const avatarSalvo = JSON.parse(
    localStorage.getItem('avatarSalvo') || 'null'
);

if (avatarSalvo && avatarSalvo.cor) {
    seletorCor.value = avatarSalvo.cor;
    peixe.style.backgroundColor = avatarSalvo.cor;
}

seletorCor.addEventListener('input', function() {
    peixe.style.backgroundColor = seletorCor.value;
});

const itens = [
    { id: 'chapeuMario', nome: 'Chapéu do Mario', imagem: 'imagens/chapeu_do_mario.png', preco: 1003, tipo: 'chapeu' },
    { id: 'bigode', nome: 'Bigode', imagem: 'imagens/bigode.png', preco: 700, tipo: 'bigode' },
    { id: 'laco', nome: 'Laço', imagem: 'imagens/laco.png', preco: 550, tipo: 'laco' },
    { id: 'rosa', nome: 'Rosa', imagem: 'imagens/rosa.png', preco: 1000, tipo: 'rosa' }
];


const molduras = [
    { id: 'recife', nome: 'Recife colorido', imagem: 'imagens/recife.png', preco: 300 },
    { id: 'perolas', nome: 'Pérolas', imagem: 'imagens/perolas.png', preco: 500 },
    { id: 'abismo', nome: 'Abismo', imagem: 'imagens/Moldura Pixel Art Submarina.png', preco: 600 },
    { id: 'tesouro', nome: 'Águas Vivas', imagem: 'imagens/aguas_vivas.png', preco: 700 },
];

const molduraEquipado = document.querySelector('#molduraEquipado');
const botaoMolduras = document.querySelector('#botaoMolduras');

let categoriaLoja = 'acessorios';

let moldurasCompradas = JSON.parse(
    localStorage.getItem('moldurasCompradas') || '[]'
);

const loja = document.querySelector('#itensLoja');
const saldo = document.querySelector('#saldoMoedas');
const peixeAcessorio = document.querySelector('#acessorioEquipado');

let comprados = JSON.parse(localStorage.getItem('acessoriosComprados') || '[]');

function atualizar() {
    saldo.textContent = Number(localStorage.getItem('dinheiro')) || 0;

    let lista = categoriaLoja === 'acessorios' ? itens : molduras;
    let compradosAtuais = categoriaLoja === 'acessorios' ? comprados : moldurasCompradas;
    let equipadoAtual = categoriaLoja === 'acessorios'
        ? localStorage.getItem('acessorioEquipado')
        : localStorage.getItem('molduraEquipado');

    loja.innerHTML = lista.map(item => `
        <div class="itemLoja">
            <img src="${item.imagem}" alt="${item.nome}">
            <h3>${item.nome}</h3>
            <p>${item.preco} moedas</p>
            <button data-id="${item.id}">
                ${!compradosAtuais.includes(item.id) ? 'Comprar' :
                equipadoAtual === item.id ? 'Remover' : 'Equipar'}
            </button>
        </div>
    `).join('');
}

function abrirLoja(categoria) {
    if (!loja.hidden && categoriaLoja === categoria) {
        loja.hidden = true;
        return;
    }

    categoriaLoja = categoria;
    loja.hidden = false;
    atualizar();
}

document.querySelector('#botaoAcessorios').onclick = () => {
    abrirLoja('acessorios');
};

botaoMolduras.onclick = () => {
    abrirLoja('molduras');
};

loja.onclick = e => {
    const id = e.target.dataset.id;
    if (!id) return;

    const lista = categoriaLoja === 'acessorios' ? itens : molduras;
    const compradosAtuais = categoriaLoja === 'acessorios' ? comprados : moldurasCompradas;
    const chaveComprados = categoriaLoja === 'acessorios'
        ? 'acessoriosComprados' : 'moldurasCompradas';
    const chaveEquipado = categoriaLoja === 'acessorios'
        ? 'acessorioEquipado' : 'molduraEquipado';

    const item = lista.find(i => i.id === id);
    const dinheiro = Number(localStorage.getItem('dinheiro')) || 0;

    if (!compradosAtuais.includes(id)) {
        if (dinheiro < item.preco) {
            alert('Moedas insuficientes!');
            return;
        }

        const novoSaldo = dinheiro - item.preco;
        localStorage.setItem('dinheiro', novoSaldo);
        compradosAtuais.push(id);
        localStorage.setItem(chaveComprados, JSON.stringify(compradosAtuais));

        /* === Atualiza o saldo gasto e o item comprado na nuvem === */
        if (auth.currentUser) {
            update(ref(db, "usuarios/" + auth.currentUser.uid), {
                dinheiro: novoSaldo,
                [chaveComprados]: compradosAtuais
            });
        }

    } else if (localStorage.getItem(chaveEquipado) === id) {
        localStorage.removeItem(chaveEquipado);

        if (categoriaLoja === 'acessorios') {
            peixeAcessorio.hidden = true;
        } else {
            molduraEquipado.hidden = true;
        }

    } else {
        localStorage.setItem(chaveEquipado, id);

        if (categoriaLoja === 'acessorios') {
            peixeAcessorio.src = item.imagem;
            peixeAcessorio.className = item.tipo;
            peixeAcessorio.hidden = false;
        } else {
            molduraEquipado.src = item.imagem;
            molduraEquipado.hidden = false;
        }
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

const molduraSalva = molduras.find(
    m => m.id === localStorage.getItem('molduraEquipado')
);

if (molduraSalva && moldurasCompradas.includes(molduraSalva.id)) {
    molduraEquipado.src = molduraSalva.imagem;
    molduraEquipado.hidden = false;
}



const botaoSalvarAvatar = document.querySelector('#botaoSalvarAvatar');

botaoSalvarAvatar.addEventListener('click', function() {

    const avatar = {
        cor: seletorCor.value,
        acessorio: localStorage.getItem('acessorioEquipado'),
        moldura: localStorage.getItem('molduraEquipado')
    };

    localStorage.setItem('avatarSalvo', JSON.stringify(avatar));

    /* === Salva o avatar escolhido na nuvem === */
    if (auth.currentUser) {
        update(ref(db, "usuarios/" + auth.currentUser.uid), {
            avatarSalvo: avatar
        });
    }

    alert('Seu avatar foi salvo com sucesso! :D');

});

/* === Sincroniza saldo, compras e avatar da conta ao abrir a página === */
onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
        const snapshot = await get(ref(db, "usuarios/" + usuario.uid));
        if (snapshot.exists()) {
            const dados = snapshot.val();

            if (dados.dinheiro !== undefined) {
                localStorage.setItem('dinheiro', dados.dinheiro);
            }
            if (dados.acessoriosComprados) {
                comprados = dados.acessoriosComprados;
                localStorage.setItem('acessoriosComprados', JSON.stringify(comprados));
            }
            if (dados.moldurasCompradas) {
                moldurasCompradas = dados.moldurasCompradas;
                localStorage.setItem('moldurasCompradas', JSON.stringify(moldurasCompradas));
            }
            if (dados.avatarSalvo) {
                localStorage.setItem('avatarSalvo', JSON.stringify(dados.avatarSalvo));
                if (dados.avatarSalvo.cor) {
                    seletorCor.value = dados.avatarSalvo.cor;
                    peixe.style.backgroundColor = dados.avatarSalvo.cor;
                }
            }

            atualizar();
        }
    }
});