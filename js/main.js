// Funções utilitárias compartilhadas
function showTempMessage(message, isPositive) {
    const messageElement = document.createElement('div');
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

    setTimeout(() => {
        messageElement.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 1500);
}

