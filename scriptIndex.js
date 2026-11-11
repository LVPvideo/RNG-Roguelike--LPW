const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const botaoMultiplicador = document.querySelector('#aumentarMult');
const botaoModoEscuro = document.querySelector('#botaoModoEscuro');

const textoResultado = document.querySelector('#Resultado');
const textoTotalAtual = document.querySelector('#dinheiroAtual');
const textoCliquesTotal = document.querySelector('#totalGerNum');
const textoMultiplicador = document.querySelector('#totalMultiplicador');

let dinheiroAtual = Number(localStorage.getItem("dinheiro")) || 0;
/* Esse código busca nos valores salvos o "dinheiro", e se não achar, o valor é 0 */
let cliques = Number(localStorage.getItem("cliques")) || 0;
let valorMultiplicador = Number(localStorage.getItem("multiplicador")) || 1;

let modoEscuro = false;

/* === Fim das Declarações === */



/* === Inicialização dos valores de estatísticas == */

textoTotalAtual.textContent = dinheiroAtual;
textoCliquesTotal.textContent = cliques;


botaoGerarNum.addEventListener('click', function(){
    let valorGerado, aux = 0;
    cliques++;
    for(let i = 0; i < valorMultiplicador; i++) {
        valorGerado = Math.random();
        valorGerado = (Math.floor(valorGerado * 100) + 1);
        aux += valorGerado;
    }

    dinheiroAtual += aux;
    localStorage.setItem("dinheiro", dinheiroAtual);
    localStorage.setItem("cliques", cliques);

    textoResultado.textContent = aux;
    textoTotalAtual.textContent = dinheiroAtual;
    textoCliquesTotal.textContent = cliques;
});


//botaoMultiplicador.addEventListener('click', function() {
//    valorMultiplicador++;
//    textoMultiplicador.textContent = valorMultiplicador;
//});

//O código funciona, agora falta mudar o jeito que aumenta o multiplicador :P

botaoModoEscuro.addEventListener('click', function() {
    if(modoEscuro)
        modoEscuro = false;
    else
        modoEscuro = true;

    if (modoEscuro) 
        document.documentElement.setAttribute("data-tema", "escuro");
    else 
        document.documentElement.removeAttribute("data-tema");
    
});

