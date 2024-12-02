const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper"),
    timeTag = document.querySelector(".time span"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    tryAgainBtn = document.querySelector("button");

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;

const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Life is like riding a bicycle. To keep your balance, you must keep moving forward.",
    "Programming is the art of telling another human being what one wants the computer to do. It's about thinking carefully and clearly about solving problems.",
    "The best way to predict the future is to create it. Everything you can imagine is real. What we know is a drop, what we don't know is an ocean.",
    "Learning to code is learning to create and innovate. The only way to do great work is to love what you do. Stay hungry, stay foolish."
];

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => typingText.focus());
    typingText.addEventListener("click", () => typingText.focus());
}

function initTyping(e) {
    const characters = typingText.querySelectorAll("span");
    let typedChar = String.fromCharCode(e.keyCode);
    if(!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }
    if(charIndex < characters.length && timeLeft > 0) {
        if(e.key === characters[charIndex].innerText) {
            characters[charIndex].classList.add("correct");
            charIndex++;
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
    }
}

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

loadParagraph();
document.addEventListener("keydown", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
