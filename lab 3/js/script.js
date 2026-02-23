const ATTEMPT_STORAGE_KEY = "lab3QuizAttempts";
const ICONS = {
    correct: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232f9e44' d='M9.5 16.6 4.8 12l1.4-1.4 3.3 3.3 8.5-8.7 1.4 1.4z'/%3E%3C/svg%3E",
    incorrect: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23d64545' stroke-width='2' stroke-linecap='round' d='M6 6l12 12M18 6 6 18'/%3E%3C/svg%3E"
};

const quizForm = document.getElementById("quizForm");
const attemptDisplay = document.getElementById("attemptCount");
const scoreDisplay = document.getElementById("scoreDisplay");
const messageDisplay = document.getElementById("message");

let attemptCount = Number(localStorage.getItem(ATTEMPT_STORAGE_KEY)) || 0;
attemptDisplay.textContent = attemptCount;

renderChoices(["Paris", "Berlin", "Madrid", "Rome"], "q1Choices", "radio", "q1");
renderChoices(["Earth", "Mars", "Jupiter", "Venus"], "q5Choices", "checkbox", "q5");

quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    gradeQuiz();
});

function renderChoices(options, containerId, inputType, inputName) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    shuffle(options).forEach((choice, index) => {
        const optionId = `${inputName}-${index}`;
        const wrapper = document.createElement("div");
        wrapper.className = "choice-option";

        const input = document.createElement("input");
        input.type = inputType;
        input.id = optionId;
        input.name = inputName;
        input.value = choice;

        const label = document.createElement("label");
        label.setAttribute("for", optionId);
        label.textContent = choice;

        wrapper.append(input, label);
        container.appendChild(wrapper);
    });
}

function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function gradeQuiz() {
    let correctAnswers = 0;

    const q1Selection = document.querySelector("input[name='q1']:checked");
    const q1Correct = q1Selection?.value === "Paris";
    updateFeedback(
        "q1",
        q1Correct,
        q1Correct ? "Correct! Paris is the capital of France." : "Paris is the right answer. Pick it next time."
    );
    if (q1Correct) {
        correctAnswers++;
    }

    const q2Value = document.getElementById("q2Input").value.trim().toLowerCase();
    const q2Correct = q2Value === "oxygen";
    updateFeedback(
        "q2",
        q2Correct,
        q2Correct ? "Nice! Chemical symbol O stands for oxygen." : "O stands for oxygen. Spelling counts."
    );
    if (q2Correct) {
        correctAnswers++;
    }

    const q3Value = document.getElementById("q3Select").value;
    const q3Correct = q3Value === "blue_whale";
    updateFeedback(
        "q3",
        q3Correct,
        q3Correct ? "Yep! The blue whale is the biggest mammal." : "The blue whale is the largest mammal."
    );
    if (q3Correct) {
        correctAnswers++;
    }

    const q4Raw = document.getElementById("q4Input").value.trim();
    const q4Number = Number(q4Raw);
    const q4Correct = !Number.isNaN(q4Number) && q4Number >= 7800000000 && q4Number <= 8200000000;
    updateFeedback(
        "q4",
        q4Correct,
        q4Correct ? "Great estimate! Earth has roughly 8,000,000,000 people." : "Aim for about 8,000,000,000 people."
    );
    if (q4Correct) {
        correctAnswers++;
    }

    const q5Selections = Array.from(document.querySelectorAll("input[name='q5']:checked")).map((input) => input.value);
    const q5Correct = q5Selections.length === 1 && q5Selections[0] === "Mars";
    updateFeedback(
        "q5",
        q5Correct,
        q5Correct ? "Mars is called the Red Planet." : "Only select Mars for the Red Planet."
    );
    if (q5Correct) {
        correctAnswers++;
    }

    const totalPoints = correctAnswers * 20;
    scoreDisplay.textContent = `Score: ${totalPoints} / 100`;
    updateFinalMessage(totalPoints);
    incrementAttempts();
}

function updateFeedback(questionId, isCorrect, message) {
    const textEl = document.getElementById(`${questionId}Text`);
    const iconEl = document.getElementById(`${questionId}Icon`);
    const feedbackRow = document.getElementById(`${questionId}Feedback`);

    if (!textEl || !iconEl || !feedbackRow) {
        return;
    }

    textEl.textContent = message;
    iconEl.src = isCorrect ? ICONS.correct : ICONS.incorrect;
    iconEl.alt = isCorrect ? "Answer is correct" : "Answer is incorrect";
    iconEl.classList.remove("hidden");

    feedbackRow.classList.toggle("is-correct", isCorrect);
    feedbackRow.classList.toggle("is-incorrect", !isCorrect);
}

function updateFinalMessage(points) {
    messageDisplay.classList.remove("success-message", "try-again");

    if (points > 80) {
        messageDisplay.textContent = "Congrats! You scored above 80!";
        messageDisplay.classList.add("success-message");
    } else if (points === 80) {
        messageDisplay.textContent = "So close! One more correct answer beats 80.";
        messageDisplay.classList.add("try-again");
    } else {
        messageDisplay.textContent = "Keep practicing and try again.";
        messageDisplay.classList.add("try-again");
    }
}

function incrementAttempts() {
    attemptCount += 1;
    localStorage.setItem(ATTEMPT_STORAGE_KEY, attemptCount);
    attemptDisplay.textContent = attemptCount;
}

