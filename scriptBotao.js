const botaoGerarNum = document.querySelector('#botaoGerarNum'); 
const textoResultado = document.querySelector('#Resultado');

botaoGerarNum.addEventListener('click', function(){
    let valorGerado;
    valorGerado = Math.random();
    valorGerado = Math.floor(valorGerado * 100) + 1;
    textoResultado.textContent = valorGerado;
});