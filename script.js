// DEFINIR ELEMENTOS HTML

const tabuleiro = document.getElementById('tabuleiro-jogo');
const textoInstrucoes = document.getElementById('texto-instrucoes');
const logo = document.getElementById('logo');
const pontuacao = document.getElementById('pontos');
const textoRecorde = document.getElementById('recorde');

// DEFINIR VARIÁVEIS

const tamanhoGrade = 20;
let cobrinha = [{ x: 10, y: 10 }];
let comida = gerarComida();
let recorde = 0;
let direcao = 'direita'; 
let intervaloJogo;
let delayIntervaloJogo = 200;
let jogoIniciado = false;

// DESENHAR ELEMENTOS NO TABULEIRO (MAPA, COBRINHA, COMIDA)

function desenharElementos() {
    tabuleiro.innerHTML = '';

    desenharCobrinha();
    desenharComida();
    atualizarPontuacao();
}

// DESENHAR COBRINHA

function desenharCobrinha() {
    cobrinha.forEach((segmento) => {
        const elementoCobrinha = criarElementoJogo('div', 'cobrinha');
        definirPosicao(elementoCobrinha, segmento);
        tabuleiro.appendChild(elementoCobrinha);
    })
}

// DESENHAR COMIDA

function desenharComida() {
    if (jogoIniciado) {
        const elementoComida = criarElementoJogo('div', 'comida');
        definirPosicao(elementoComida, comida);
        tabuleiro.appendChild(elementoComida);
    }
}

// GERAR POSIÇÃO ALEATÓRIA PARA A COMIDA

function gerarComida() {
    const x = Math.floor(Math.random() * tamanhoGrade) + 1;
    const y = Math.floor(Math.random() * tamanhoGrade) + 1;
    return {x, y};
}


// CRIAR CUBE/DIV DA COBRINHA OU COMIDA

function criarElementoJogo(tag, nomeDaClase) {
    const elemento = document.createElement(tag);
    elemento.className = nomeDaClase;
    return elemento;
}

// DEFINIR A POSIÇÃO DA COBRINHA OU COMIDA

function definirPosicao(elemento, posicao) {
    elemento.style.gridColumn = posicao.x;
    elemento.style.gridRow = posicao.y;
}

// MOVER COBRINHA

function mover() {
    const cabeca = { ...cobrinha[0] };
    switch (direcao) {
        case 'esquerda':
            cabeca.x --;
            break;
        case 'direita':
            cabeca.x ++;
            break;
        case 'cima':
            cabeca.y --;
            break;
        case 'baixo':
            cabeca.y ++;
            break;
    }

    cobrinha.unshift(cabeca);

    // cobrinha.pop();

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        comida = gerarComida();
        aumentarVelocidade();
        clearInterval(intervaloJogo);
        intervaloJogo = setInterval(() => {
            mover();
            conferirColisoes();
            desenharElementos();
        }, delayIntervaloJogo);
    } else {
        cobrinha.pop();
    }
}

// AJUSTAR VELOCIDADE

function aumentarVelocidade() {
    if (delayIntervaloJogo > 150) {
        delayIntervaloJogo -= 5;
    } else if (delayIntervaloJogo > 100) {
        delayIntervaloJogo -= 3;
    } else if (delayIntervaloJogo > 50) {
        delayIntervaloJogo -= 2;
    } else if (delayIntervaloJogo > 25) {
        delayIntervaloJogo -= 1;
    }
}

// DETECTAR COLISÕES

function conferirColisoes() {
    const cabeca = cobrinha[0];

    if (cabeca.x < 1 || cabeca.x > tamanhoGrade || cabeca.y < 1 || cabeca.y > tamanhoGrade) {
        resetarJogo();
    }

    for (let i = 1; i < cobrinha.length; i++) {
        if (cabeca.x === cobrinha[i].x && cabeca.y === cobrinha[i].y) {
            resetarJogo();
        }
    }
}

// ATUALIZAR PONTUAÇÃO

function atualizarPontuacao() {
    const pontuacaoAtual = cobrinha.length - 1;
    pontuacao.textContent = pontuacaoAtual.toString().padStart(3, '0');
}

// ATUALIZAR RECORDE

function atualizarRecorde() {
    const pontuacaoAtual = cobrinha.length - 1;
    if (pontuacaoAtual > recorde) {
        recorde = pontuacaoAtual;
        textoRecorde.textContent = recorde.toString().padStart(3, '0');
    }

    textoRecorde.style.display = 'block';
}

// FUNÇÃO PARA INICIAR O JOGO

function iniciarJogo() {
    jogoIniciado = true;
    textoInstrucoes.style.display = 'none';
    logo.style.display = 'none';
    intervaloJogo = setInterval(() => {
        mover();
        conferirColisoes();
        desenharElementos();
    }, delayIntervaloJogo);
}

// FUNÇÃO PARA RESETAR O JOGO

function resetarJogo() {
    atualizarRecorde();
    jogoIniciado = false;
    pararJogo();
    cobrinha = [{ x: 10, y: 10 }];
    comida = gerarComida();
    direcao = 'direita';
    delayIntervaloJogo = 200;
    atualizarPontuacao();
}

// PARAR JOGO

function pararJogo() {
    clearInterval(intervaloJogo);
    jogoIniciado = false;
    textoInstrucoes.style.display = 'block';
    logo.style.display = 'block';
}

// DETECTAR TECLAS PRESSIONADAS

function detectarTeclas(evento) {
    if ((!jogoIniciado && evento.code === 'Space') || (!jogoIniciado && evento.key === ' ')) {
        iniciarJogo();
    } else {
        switch (evento.key) {
            case 'ArrowUp':
                if (direcao !== 'baixo') direcao = 'cima';
                break;
            case 'ArrowDown':
                if (direcao !== 'cima') direcao = 'baixo';
                break;
            case 'ArrowLeft':
                if (direcao !== 'direita') direcao = 'esquerda';
                break;
            case 'ArrowRight':
                if (direcao !== 'esquerda') direcao = 'direita';
                break;
        }
    }
}

// LER TECLADO

document.addEventListener('keydown', detectarTeclas);