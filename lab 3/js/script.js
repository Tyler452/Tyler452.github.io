//Event listeners
let submitBtn = document.querySelector("button");
submitBtn.addEventListener("click", gradeQuiz);

function shuffleQ1Choices() {
    let choices = ["Berlin", "Madrid", "Paris", "Rome"];
    choices = _.shuffle(choices);
    console.log(choices);

    for (let i of choices) {
        let radioElements = document.createElement("input");
        radioElements.type = "radio";
        radioElements.name = "q1";
        radioElements.value = i;

        let labelElements = document.createElement("label");
        labelElements.textContent = i;

        labelElements.append(radioElements);

        document.querySelector("#q1Choices").append(labelElements);
    }

}

shuffleQ1Choices();

function shuffleQ5Choices() {
    let choices = ["Earth", "Mars", "Jupiter", "Venus"];
    choices = _.shuffle(choices);
    console.log(choices);

    for (let i of choices) {
        let checkboxElements = document.createElement("input");
        checkboxElements.type = "checkbox";
        checkboxElements.name = "q5";
        checkboxElements.value = i;
        let labelElements = document.createElement("label");
        labelElements.textContent = i;
        labelElements.append(checkboxElements);
        document.querySelector("#q5Choices").append(labelElements);
    }

}

shuffleQ5Choices();

function gradeQuiz() {
    let answer1 = document.querySelector("input[name='q1']:checked").value;
    let answer2 = document.querySelector("#q2").value;
    let answer3 = document.querySelector("#q3").value;
    let answer4 = document.querySelector("#q4").value;
    let answer5a = document.querySelector("#q5a").checked;
    let answer5b = document.querySelector("#q5b").checked;
    let answer5c = document.querySelector("#q5c").checked;
    let answer5d = document.querySelector("#q5d").checked;
    let score = 0;
    
    if (answer1.toLowerCase() === "paris") {
        score++;
    }
    if (answer2.toLowerCase() === "oxygen") {
            score++;
        }
    if (answer3 === "blue_whale") {
        score++;
    }
    if (answer4 == 8000000000) {
        score++;
    }
    if(answer5b === true && answer5a === false && answer5c === false && answer5d === false) {
        score++;
    }

    alert("Your score is: " + score + "/5");
}

