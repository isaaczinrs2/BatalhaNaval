// Configurações do jogo
var numRows = 10;
var numCols = 10;
var tableContainer = document.getElementById('table-container');
var table = document.createElement('table');
var board = [];
var numElements = numRows * numCols;
var numbarco1 = Math.floor(numElements / 5);
var numbarco2 = Math.floor(numElements / 6);
var numbarco3 = Math.floor(numElements / 10);
var numWater = numElements - numbarco1 - numbarco2 - numbarco3;
var score = 500;
var maxJogadas = 30;
var pontuacaoMinima = localStorage.getItem('minScore') || 2500;
var jogadasRealizadas = 0;

// Elementos da UI
var scoreElement = document.getElementById('score');
var jogadasRestantesElement = document.getElementById('jogadasRestantes');
var targetScoreElement = document.getElementById('targetScore');
var targetProgressElement = document.getElementById('targetProgress');
var resetBtn = document.getElementById('reset-btn');
var resultModal = document.getElementById('resultModal');
var modalTitle = document.getElementById('modalTitle');
var modalMessage = document.getElementById('modalMessage');
var modalButton = document.getElementById('modalButton');

// Inicializa o tabuleiro
function initBoard() {
    board = [];
    for (var i = 0; i < numRows; i++) {
        var row = [];
        for (var j = 0; j < numCols; j++) {
            row.push('fire');
        }
        board.push(row);
    }

    distributeElements('barco1', numbarco1);
    distributeElements('barco2', numbarco2);
    distributeElements('barco3', numbarco3);
}

// Distribui elementos aleatoriamente
function distributeElements(elementType, numElements) {
    for (var e = 0; e < numElements; e++) {
        var x = Math.floor(Math.random() * numRows);
        var y = Math.floor(Math.random() * numCols);
        if (board[x][y] === 'fire') {
            board[x][y] = elementType;
        } else {
            e--;
        }
    }
}

// Realiza um ataque
function attack(x, y) {
    var cellType = board[x][y];
    if (cellType === 'fire') {
        if (Math.random() < 1) {
            cellType = 'agua';
        } else {
            cellType = 'fire';
        }
    }
    
    switch (cellType) {
        case 'barco1':
            score += 300;
            return { type: 'barco1', score: score, image: 'assets/images/barco1.png', class: 'hit' };
        case 'barco2':
            score += 400;
            return { type: 'barco2', score: score, image: 'assets/images/barco2.png', class: 'hit' };
        case 'barco3':
            score += 500;
            return { type: 'barco3', score: score, image: 'assets/images/barco3.png', class: 'hit' };
        case 'agua':
            score -= 100;
            return { type: 'agua', score: score, image: 'assets/images/agua.png', class: 'miss' };
    }
}

// Atualiza a pontuação
function updateScore() {
    scoreElement.textContent = score;
    
    var progressPercent = Math.min((score / pontuacaoMinima) * 100, 100);
    targetProgressElement.style.width = progressPercent + '%';
    
    var jogadasRestantes = maxJogadas - jogadasRealizadas;
    jogadasRestantesElement.textContent = jogadasRestantes;
    
    if (score <= 0 || (jogadasRestantes <= 0 && score < pontuacaoMinima)) {
        endGame(false);
    } else if (score >= pontuacaoMinima) {
        endGame(true);
    }
}

// Finaliza o jogo
function endGame(isVictory) {
    var cells = document.querySelectorAll('td');
    cells.forEach(function(cell) {
        cell.style.pointerEvents = 'none';
    });
    
    if (isVictory) {
        modalTitle.textContent = 'VITÓRIA!';
        modalMessage.textContent = `Parabéns! Você alcançou ${score} pontos e venceu o jogo!`;
    } else {
        modalTitle.textContent = 'DERROTA';
        modalMessage.textContent = `Você terminou com ${score} pontos. Tente novamente!`;
    }
    
    resultModal.style.display = 'block';
}

// Exibe mensagem temporária
function showTempMessage(message, isPositive) {
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = isPositive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '15px 25px';
    messageElement.style.borderRadius = '8px';
    messageElement.style.fontSize = '1.2rem';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    messageElement.style.zIndex = '1000';
    messageElement.style.animation = 'fadeIn 0.3s ease';
    document.body.appendChild(messageElement);

    setTimeout(function() {
        messageElement.style.animation = 'fadeOut 0.5s ease';
        setTimeout(function() {
            document.body.removeChild(messageElement);
        }, 500);
    }, 1500);
}

// Trata clique na célula
function handleCellClick(event) {
    var x = event.target.parentNode.rowIndex - 1;
    var y = event.target.cellIndex - 1;
    
    if (board[x][y] !== 'agua') {
        var previousScore = score;
        var attackResult = attack(x, y);
        
        var img = document.createElement('img');
        img.src = attackResult.image;
        img.className = 'cell-image';
        event.target.innerHTML = '';
        event.target.appendChild(img);
        event.target.classList.add(attackResult.class);
        
        board[x][y] = 'agua';
        score = attackResult.score;
        jogadasRealizadas++;
        updateScore();

        var pontosDiferenca = score - previousScore;
        var message = attackResult.type === 'agua' ? '-100 PONTOS' : `+${pontosDiferenca} PONTOS!`;
        showTempMessage(message, attackResult.type !== 'agua');
    }
}

// Cria a tabela do jogo
function createTable() {
    table.innerHTML = '';
    var letters = 'ABCDEFGHIJ';
    
    var headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    
    for (var i = 0; i < numCols; i++) {
        var headerCell = document.createElement('th');
        headerCell.textContent = i + 1;
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    for (var i = 0; i < numRows; i++) {
        var row = document.createElement('tr');
        var letterCell = document.createElement('th');
        letterCell.textContent = letters[i];
        row.appendChild(letterCell);

        for (var j = 0; j < numCols; j++) {
            var cell = document.createElement('td');
            cell.addEventListener('click', handleCellClick);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    
    tableContainer.appendChild(table);
}

// Reinicia o jogo
function resetGame() {
    board = [];
    score = 500;
    jogadasRealizadas = 0;
    
    tableContainer.removeChild(table);
    table = document.createElement('table');
    
    initBoard();
    createTable();
    updateUI();
}

// Atualiza a UI
function updateUI() {
    scoreElement.textContent = score;
    jogadasRestantesElement.textContent = maxJogadas;
    targetScoreElement.textContent = pontuacaoMinima;
    targetProgressElement.style.width = '0%';
}

// Inicializa o jogo
function initGame() {
    initBoard();
    createTable();
    updateUI();
    
    resetBtn.addEventListener('click', resetGame);
    
    modalButton.addEventListener('click', function() {
        resultModal.style.display = 'none';
        window.location.href = 'resultado.html?resultado=' + 
            (score >= pontuacaoMinima ? 'vitoria' : 'derrota') + 
            '&score=' + score;
    });
}

// Inicia quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});