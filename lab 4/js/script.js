//Eventlisteners
let zipElement = document.querySelector("#zipCode");
let cityElement = document.querySelector("#city");
let countryElement = document.querySelector("#country");
let stateElement = document.querySelector("#state");
let latElement = document.querySelector("#lat");
let longElement = document.querySelector("#long");
let passwordElement = document.querySelector("#passwordId");
let passwordMessageElement = document.querySelector("#passwordMessage");
let usernameElement = document.querySelector("#usernameId");
let usernameMessageElement = document.querySelector("#usernameMessage");


zipElement.addEventListener("change", displayCity);
passwordElement.addEventListener("click", displayPasswordMessage);
usernameElement.addEventListener("change", displayUsernameMessage);

displayStates();

async function displayStates() {
    let url = "https://csumb.space/api/allStatesAPI.php";;
    let urlCountry = " https://csumb.space/api/countyListAPI.php?state="+ stateElement.value.usps;
    try {
        const response = await fetch(url);
        const responseCountry = await fetch(urlCountry);
            if (!response.ok) {
                throw new Error("Error accessing API endpoint")
            }
        const data = await response.json();
        const dataCountry = await responseCountry.json();
        console.log(data);
        console.log(dataCountry);

        for (let i of data){
            let optionEl = document.createElement("option");
            optionEl.textContent = i.state;
            optionEl.value = i.usps;

            document.querySelector("#state").append(optionEl);
        }

        for (let i of dataCountry){
            let optionEl = document.createElement("option");
            optionEl.textContent = i.county;
            optionEl.value = i.county;

            countryElement.append(optionEl);
        }

        } catch (err) {
                if (err instanceof TypeError) {
                    alert("Error accessing API endpoint (network failure)");
                } else {
                    alert(err.message);
                }
        } //catch    

}

async function displayCity() {
    let zipCode = zipElement.value;
    let url = "https://csumb.space/api/cityInfoAPI.php?zip=" + zipCode;
    let response = await fetch(url)
    let data = await response.json();
    console.log(data);
    
    cityElement.textContent = data.city;
    latElement.textContent = data.latitude;
    longElement.textContent = data.longitude;
}


async function displayPasswordMessage() {
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url)
    let data = await response.json();
    console.log(data);
    passwordMessageElement.textContent = "Suggested Password: " + data.password;
}

async function displayUsernameMessage() {
    let url = " https://csumb.space/api/usernamesAPI.php?username=eeny";
    let response = await fetch(url)
    let data = await response.json();
    console.log(data);
    if (data.username == true) {
        usernameMessageElement.textContent = "Username is available";
    } else {
        usernameMessageElement.textContent = "Username is not available";
    }
}
