const cards = document.querySelectorAll('.card');
const moveCounter = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;

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
    isMatch ? disableCards() : unflipCards();
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

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
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
    moveCounter.textContent = 'Moves: 0';
    cards.forEach(card => {
        card.classList.remove('flip', 'matched');
        card.addEventListener('click', flipCard);
    });
    shuffle();
}

// Initial setup
cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restartGame);
shuffle();
