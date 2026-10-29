const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const botaoMultiplicador = document.querySelector('#aumentarMult');

const textoResultado = document.querySelector('#Resultado');
const textoTotalAtual = document.querySelector('#dinheiroAtual');
const textoCliquesTotal = document.querySelector('#totalGerNum');
const textoMultiplicador = document.querySelector('#totalMultiplicador');

 let totalAtual = 0, qtdGeracoes = 0, valorMultiplicador = 1;

botaoGerarNum.addEventListener('click', function(){
    let valorGerado, aux = 0;
    qtdGeracoes++;
    for(let i = 0; i < valorMultiplicador; i++) {
        valorGerado = Math.random();
        valorGerado = (Math.floor(valorGerado * 100) + 1);
        totalAtual += valorGerado;
        aux += valorGerado;
    }
    textoResultado.textContent = aux;
    textoTotalAtual.textContent = totalAtual;
    textoCliquesTotal.textContent = qtdGeracoes;
});

/* ====ISSO É UM TESTE PARA O MULTIPLICADOR==== */

botaoMultiplicador.addEventListener('click', function() {
    valorMultiplicador++;
    textoMultiplicador.textContent = valorMultiplicador;
});

//O código funciona, agora falta mudar o jeito que aumenta o multiplicador :P