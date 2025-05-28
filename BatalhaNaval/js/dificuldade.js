function startGame(minScore) {
    localStorage.setItem('minScore', minScore);
    window.location.href = 'jogo.html';
}