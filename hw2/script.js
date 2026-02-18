const STARTING_BANKROLL = 150;
const HISTORY_LIMIT = 6;

const cherryIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f352.svg';
const cloverIcon = 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f340.svg';
const sevenIcon = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="%23f97316"/><path d="M28 26h64L54 98H36l37-66H34z" fill="white"/></svg>';
const barIcon = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80"><rect width="140" height="80" rx="12" fill="%230f172a"/><rect x="12" y="16" width="116" height="12" rx="6" fill="%23facc15"/><rect x="12" y="34" width="116" height="12" rx="6" fill="white"/><rect x="12" y="52" width="116" height="12" rx="6" fill="%2322d3ee"/></svg>';

const symbols = [
	{ name: 'Lucky Seven', multiplier: 10, image: sevenIcon },
	{ name: 'Emerald Clover', multiplier: 6, image: cloverIcon },
	{ name: 'Cherry Burst', multiplier: 4, image: cherryIcon },
	{ name: 'Bar Stack', multiplier: 3, image: barIcon }
];

const betForm = document.getElementById('bet-form');
const betInput = document.getElementById('bet-amount');
const bankrollDisplay = document.getElementById('bankroll');
const statusPanel = document.getElementById('message-panel');
const resultText = document.getElementById('result-text');
const resetButton = document.getElementById('reset-btn');
const historyList = document.getElementById('history-list');
const reelImages = document.querySelectorAll('.reel img');
const reelNames = document.querySelectorAll('.reel .symbol-name');
const reelContainers = document.querySelectorAll('.reel');

let bankroll = STARTING_BANKROLL;
const spinHistory = [];

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

const formatCurrency = amount => currencyFormatter.format(amount);

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const updateBankrollDisplay = () => {
	bankrollDisplay.textContent = formatCurrency(bankroll);
};

const setStatus = (stateClass, message) => {
	statusPanel.classList.remove('win', 'lose');
	if (stateClass) {
		statusPanel.classList.add(stateClass);
	}
	resultText.textContent = message;
};

const renderHistory = () => {
	if (!spinHistory.length) {
		historyList.innerHTML = '<li class="muted">No spins yet.</li>';
		return;
	}

	historyList.innerHTML = spinHistory
		.map(entry => {
			const prefix = entry.delta > 0 ? '+' : '-';
			const amount = formatCurrency(Math.abs(entry.delta));
			const cls = entry.delta > 0 ? 'win' : 'lose';
			return `<li class="${cls}"><span>${entry.combo}</span><span>${prefix}${amount}</span></li>`;
		})
		.join('');
};

const animateReels = () => {
	reelContainers.forEach(container => {
		container.classList.remove('new');
		void container.offsetWidth;
		container.classList.add('new');
		setTimeout(() => container.classList.remove('new'), 400);
	});
};

const handleSpin = event => {
	event.preventDefault();
	const bet = Number(betInput.value);

	if (Number.isNaN(bet) || bet < 5) {
		setStatus('lose', 'Enter a valid bet of at least $5.');
		return;
	}

	if (bet > bankroll) {
		setStatus('lose', 'Not enough bankroll for that spin.');
		return;
	}

	const rolledSymbols = [];
	for (let i = 0; i < reelImages.length; i += 1) {
		const symbol = getRandomSymbol();
		rolledSymbols.push(symbol);
		reelImages[i].src = symbol.image;
		reelImages[i].alt = symbol.name;
		reelNames[i].textContent = symbol.name;
	}

	bankroll -= bet;

	const allMatch = rolledSymbols.every(symbol => symbol.name === rolledSymbols[0].name);
	let payout = 0;

	if (allMatch) {
		payout = bet * rolledSymbols[0].multiplier;
		bankroll += payout;
		setStatus('win', `Jackpot! Three ${rolledSymbols[0].name}s paid ${formatCurrency(payout)}.`);
	} else {
		setStatus('lose', `No match. You lost ${formatCurrency(bet)}.`);
	}

	const comboText = rolledSymbols.map(symbol => symbol.name).join(' | ');
	const delta = payout - bet;
	spinHistory.unshift({ combo: comboText, delta });
	if (spinHistory.length > HISTORY_LIMIT) {
		spinHistory.pop();
	}

	animateReels();
	updateBankrollDisplay();
	renderHistory();
};

const resetGame = () => {
	bankroll = STARTING_BANKROLL;
	betForm.reset();
	spinHistory.length = 0;
	reelImages.forEach(img => {
		img.src = img.dataset.default;
		img.alt = 'Idle slot icon';
	});
	reelNames.forEach(label => {
		label.textContent = '---';
	});
	setStatus('', 'Fresh credits loaded. Place a bet to spin.');
	updateBankrollDisplay();
	renderHistory();
};

betForm.addEventListener('submit', handleSpin);
resetButton.addEventListener('click', resetGame);

resetGame();
