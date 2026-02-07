//event listener 
document.getElementById("guessInput").addEventListener("click", guess);

//Global variables
let randomNum = Math.floor(Math.random() * 99) + 1;
console.log(randomNum);
//generates a random number between 1 and 99. 
let numAttempts = 0;


function guess(){
    numAttempts++;
    let userGuess = document.getElementById("userGuess").value;
    //value is ONLY for input elements.
    //document.getElementById("guesses").textContent += " " + userGuess;
    document.getElementById("guesses").textContent += ` ${userGuess} `;

    if(numAttempts >= 6){
        document.getElementById("isWin").textContent = "You lose!";
        document.getElementById("isWin").style.color = "yellow";
    } else if (userGuess < randomNum){
       document.getElementById("isWin").textContent = "Too low!";
       document.getElementById("isWin").style.color = "orange";
    } else if (userGuess > randomNum){
        document.getElementById("isWin").textContent = "Too high!";
        document.getElementById("isWin").style.color = "red";
    } else {
        document.getElementById("isWin").textContent = `You Win! Number guessed: ${randomNum}`;
        document.getElementById("isWin").style.color = "green";
    }
    console.log(numAttempts);
}

