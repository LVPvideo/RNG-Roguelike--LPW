const botaoModoEscuro = document.querySelector('#botaoModoEscuro"');

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