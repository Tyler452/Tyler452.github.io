const guessForm = document.getElementById("guessForm");
const userGuessInput = document.getElementById("userGuess");
const guessButton = document.getElementById("guessButton");
const resetButton = document.getElementById("resetButton");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");
const hintMessage = document.getElementById("hintMessage");
const revealMessage = document.getElementById("revealMessage");
const guessList = document.getElementById("guessList");
const attemptCount = document.getElementById("attemptCount");
const winsCount = document.getElementById("winsCount");
const lossesCount = document.getElementById("lossesCount");
const gamesPlayed = document.getElementById("gamesPlayed");

const MAX_ATTEMPTS = 7;
let secretNumber = 0;
let attempts = [];
let wins = 0;
let losses = 0;

function getRandomNumber() {
    return Math.floor(Math.random() * 99) + 1;
}

function updateScoreboard() {
    winsCount.textContent = wins;
    lossesCount.textContent = losses;
    gamesPlayed.textContent = wins + losses;
}

function updateAttemptList() {
    let items = "";

    for (let i = 0; i < attempts.length; i++) {
        items += "<li>Attempt " + (i + 1) + ": <strong>" + attempts[i] + "</strong></li>";
    }

    guessList.innerHTML = items;
    attemptCount.textContent = attempts.length;
}

function setGameActive(isActive) {
    guessButton.disabled = !isActive;
    userGuessInput.disabled = !isActive;

    if (isActive) {
        guessButton.classList.remove("disabled");
        resetButton.classList.add("hidden");
    } else {
        guessButton.classList.add("disabled");
        resetButton.classList.remove("hidden");
    }
}

function resetMessages() {
    statusMessage.textContent = "Start by entering your first guess.";
    statusMessage.classList.remove("won");
    hintMessage.textContent = "";
    revealMessage.textContent = "";
    revealMessage.classList.remove("lost");
    errorMessage.textContent = "";
}

function finishGame(didWin) {
    if (didWin) {
        wins += 1;
        statusMessage.textContent = "Great job! You guessed it in " + attempts.length + " attempts.";
        statusMessage.classList.add("won");
        revealMessage.textContent = "Secret number: " + secretNumber;
        revealMessage.classList.remove("lost");
    } else {
        losses += 1;
        statusMessage.textContent = "You lost this round.";
        statusMessage.classList.remove("won");
        revealMessage.textContent = "You Lost! The number was " + secretNumber + ".";
        revealMessage.classList.add("lost");
    }

    updateScoreboard();
    setGameActive(false);
}

function startNewRound() {
    secretNumber = getRandomNumber();
    attempts = [];
    userGuessInput.value = "";
    userGuessInput.focus();
    updateAttemptList();
    updateScoreboard();
    resetMessages();
    setGameActive(true);
}

function handleGuess(event) {
    event.preventDefault();

    if (guessButton.disabled) {
        return;
    }

    const guessValue = Number(userGuessInput.value.trim());

    if (!Number.isInteger(guessValue) || guessValue < 1) {
        errorMessage.textContent = "Please enter a whole number between 1 and 99.";
        return;
    }

    if (guessValue > 99) {
        errorMessage.textContent = "Numbers higher than 99 are not allowed.";
        return;
    }

    errorMessage.textContent = "";
    attempts.push(guessValue);
    updateAttemptList();

    if (guessValue === secretNumber) {
        hintMessage.textContent = "Perfect guess!";
        finishGame(true);
        return;
    }

    if (guessValue < secretNumber) {
        statusMessage.textContent = "Too low! Try a larger number.";
    } else {
        statusMessage.textContent = "Too high! Try something smaller.";
    }

    const attemptsLeft = MAX_ATTEMPTS - attempts.length;

    if (attemptsLeft > 0) {
        const suffix = attemptsLeft === 1 ? " attempt" : " attempts";
        hintMessage.textContent = "You have " + attemptsLeft + suffix + " remaining.";
    } else {
        hintMessage.textContent = "No attempts remaining.";
        finishGame(false);
    }
}

guessForm.addEventListener("submit", handleGuess);
resetButton.addEventListener("click", startNewRound);

startNewRound();

