const cards = document.querySelectorAll('.card');
const moveCounter = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');
const victoryMessage = document.querySelector('.victory-message');
const finalMoves = document.querySelector('.final-moves');
const playAgainButton = document.querySelector('.play-again');
const gameContainer = document.querySelector('.game-container');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;

    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    if (isMatch) {
        matchedPairs++;
        disableCards();
        if (matchedPairs === 6) { // 6 pairs in total
            setTimeout(showVictory, 500);
        }
    } else {
        unflipCards();
    }
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function showVictory() {
    gameContainer.classList.add('victory');
    victoryMessage.classList.add('show');
    finalMoves.textContent = moves;
    createConfetti();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');

    setTimeout(() => {
        firstCard.classList.remove('flip', 'wrong');
        secondCard.classList.remove('flip', 'wrong');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

function restartGame() {
    moves = 0;
    matchedPairs = 0;
    moveCounter.textContent = 'Moves: 0';
    victoryMessage.classList.remove('show');
    gameContainer.classList.remove('victory');
    cards.forEach(card => {
        card.classList.remove('flip', 'matched', 'wrong');
        card.addEventListener('click', flipCard);
    });
    shuffle();
}

// Initial setup
cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', restartGame);
shuffle();
