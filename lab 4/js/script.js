const API_BASE = "https://csumb.space/api/";

const zipInput = document.querySelector("#zipInput");
const zipMessage = document.querySelector("#zipMessage");
const cityDisplay = document.querySelector("#cityDisplay");
const latDisplay = document.querySelector("#latDisplay");
const lonDisplay = document.querySelector("#lonDisplay");

const stateSelect = document.querySelector("#stateSelect");
const countySelect = document.querySelector("#countySelect");

const usernameInput = document.querySelector("#usernameInput");
const usernameMessage = document.querySelector("#usernameMessage");

const passwordInput = document.querySelector("#passwordInput");
const passwordSuggestion = document.querySelector("#passwordSuggestion");
const confirmPasswordInput = document.querySelector("#confirmPasswordInput");
const confirmMessage = document.querySelector("#confirmMessage");

const form = document.querySelector("#signupForm");
const formMessage = document.querySelector("#formMessage");

const statusClasses = ["status-success", "status-error", "status-info"];

let usernameLookupTimer;

zipInput.addEventListener("input", handleZipInput);
stateSelect.addEventListener("change", handleStateChange);
usernameInput.addEventListener("input", handleUsernameInput);
passwordInput.addEventListener("focus", suggestPassword);
form.addEventListener("submit", handleSubmit);

fetchStates();
resetLocationPanel();
setStatus(zipMessage, "info", "Enter a 5-digit ZIP code to auto-fill your city");
setStatus(usernameMessage, "info", "Usernames must be at least 3 characters");

function setStatus(element, type, message) {
    if (!element) {
        return;
    }
    element.classList.remove(...statusClasses);
    if (type) {
        element.classList.add(`status-${type}`);
    }
    element.textContent = message ?? "";
}

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Unable to reach API endpoint");
    }
    return response.json();
}

async function fetchStates() {
    try {
        const states = await fetchJSON(`${API_BASE}allStatesAPI.php`);
        stateSelect.innerHTML = "<option value=\"\" disabled selected>Select your state</option>";
        states.forEach((state) => {
            const option = document.createElement("option");
            option.value = state.usps;
            option.textContent = `${state.state} (${state.usps})`;
            stateSelect.append(option);
        });
    } catch (error) {
        stateSelect.innerHTML = "<option value=\"\" disabled selected>States unavailable</option>";
        console.error(error);
    }
}

async function handleStateChange(event) {
    const selectedState = event.target.value;
    countySelect.disabled = true;
    countySelect.innerHTML = "<option value=\"\">Loading counties…</option>";

    if (!selectedState) {
        countySelect.innerHTML = "<option value=\"\">Select a state first</option>";
        return;
    }

    try {
        const counties = await fetchJSON(`${API_BASE}countyListAPI.php?state=${selectedState}`);
        countySelect.innerHTML = "";
        counties.forEach((county) => {
            const option = document.createElement("option");
            option.value = county.county;
            option.textContent = county.county;
            countySelect.append(option);
        });

        if (counties.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No counties found";
            option.value = "";
            countySelect.append(option);
        }
    } catch (error) {
        countySelect.innerHTML = "<option value=\"\">Unable to load counties</option>";
        console.error(error);
    } finally {
        countySelect.disabled = false;
    }
}

function handleZipInput() {
    const digitsOnly = zipInput.value.replace(/[^0-9]/g, "");
    const sanitizedZip = digitsOnly.slice(0, 5);
    zipInput.value = sanitizedZip;

    if (sanitizedZip.length < 5) {
        setStatus(zipMessage, "info", "ZIP must be exactly 5 digits");
        resetLocationPanel();
        return;
    }

    fetchCityInfo(sanitizedZip);
}

async function fetchCityInfo(zip) {
    try {
        const data = await fetchJSON(`${API_BASE}cityInfoAPI.php?zip=${zip}`);

        if (!data || data.error || !data.city) {
            throw new Error("Zip code not found");
        }

        cityDisplay.textContent = data.city;
        latDisplay.textContent = formatCoordinate(data.latitude);
        lonDisplay.textContent = formatCoordinate(data.longitude);
        setStatus(zipMessage, "success", "Location found!");
    } catch (error) {
        resetLocationPanel();
        setStatus(zipMessage, "error", "Zip code not found");
        console.error(error);
    }
}

function resetLocationPanel() {
    cityDisplay.textContent = "—";
    latDisplay.textContent = "—";
    lonDisplay.textContent = "—";
}

function formatCoordinate(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toFixed(4) : "—";
}

function handleUsernameInput() {
    const username = usernameInput.value.trim();

    if (usernameLookupTimer) {
        clearTimeout(usernameLookupTimer);
    }

    if (username.length === 0) {
        setStatus(usernameMessage, "info", "Usernames must be at least 3 characters");
        return;
    }

    if (username.length < 3) {
        setStatus(usernameMessage, "error", "Add a few more characters");
        return;
    }

    setStatus(usernameMessage, "info", "Checking availability…");

    usernameLookupTimer = setTimeout(() => {
        checkUsername(username);
    }, 350);
}

async function checkUsername(username) {
    try {
        const data = await fetchJSON(`${API_BASE}usernamesAPI.php?username=${encodeURIComponent(username)}`);
        const isAvailable = getAvailabilityFlag(data);

        if (usernameInput.value.trim() !== username) {
            return;
        }

        if (isAvailable) {
            setStatus(usernameMessage, "success", `${username} is available ✨`);
        } else {
            setStatus(usernameMessage, "error", `${username} is taken, try another`);
        }
    } catch (error) {
        setStatus(usernameMessage, "error", "Unable to check username right now");
        console.error(error);
    }
}

function getAvailabilityFlag(payload) {
    if (payload == null) {
        return false;
    }

    if (typeof payload === "boolean") {
        return payload;
    }

    if (typeof payload.available !== "undefined") {
        return Boolean(payload.available);
    }

    if (typeof payload.username !== "undefined") {
        return payload.username === true || payload.username === "available";
    }

    return false;
}

async function suggestPassword() {
    try {
        const data = await fetchJSON(`${API_BASE}suggestedPassword.php?length=10`);
        if (data && data.password) {
            setStatus(passwordSuggestion, "success", `Suggested password: ${data.password}`);
        }
    } catch (error) {
        setStatus(passwordSuggestion, "error", "Unable to fetch a password suggestion");
        console.error(error);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let valid = true;

    if (username.length < 3) {
        setStatus(usernameMessage, "error", "Username must have at least 3 characters");
        valid = false;
    }

    if (password.length < 6) {
        setStatus(passwordSuggestion, "error", "Password must be at least 6 characters long");
        valid = false;
    }

    if (password !== confirmPassword || confirmPassword.length === 0) {
        setStatus(confirmMessage, "error", "Passwords must match exactly");
        valid = false;
    } else {
        setStatus(confirmMessage, "success", "Passwords match");
    }

    if (!valid) {
        showFormAlert("danger", "Please fix the highlighted issues and try again.");
        return;
    }

    showFormAlert("success", "All set! Your information has been validated.");
    form.reset();
    resetLocationPanel();
    countySelect.innerHTML = "<option value=\"\">Select a state first</option>";
    countySelect.disabled = true;
    setStatus(zipMessage, "info", "Enter a 5-digit ZIP code to auto-fill your city");
    setStatus(usernameMessage, "info", "Usernames must be at least 3 characters");
    setStatus(passwordSuggestion, null, "");
    setStatus(confirmMessage, null, "");
}

function showFormAlert(type, message) {
    formMessage.classList.remove("d-none", "alert-success", "alert-danger", "alert-info");
    formMessage.classList.add(`alert-${type}`);
    formMessage.textContent = message;
}
