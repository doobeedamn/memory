// Variables
const starOne = document.querySelector('.star-one');
const starTwo = document.querySelector('.star-two');
const starThree = document.querySelector('.star-three');
const starRating = document.querySelector('.stars');
const cards = document.querySelectorAll('.card');
const gameBoard = document.querySelector('.deck');
const movesCounter = document.querySelector('.moves');
const popUp = document.querySelector('.pop-up-modal');
const timerContent = document.querySelector('.time');

let cardDeck = [...cards];
let clickedCards = [];
let matchedCards = [];
let moves = 0;
let matches = 0;
let stars = [];
let time = 0;
let minutes = 0;
let seconds = 0;
let timeTrigger = true;

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

// Game basic settings: declare the deck, shuffle cards, display cards, start tracking moves and time
// Game start
const newGame = () => {
	let partialId = 0;
	let shuffledDeck = shuffle(cardDeck);

	for(card of shuffledDeck) {
		card.id = 'card-' + partialId;
		gameBoard.appendChild(card);
		card.classList.remove('open','show','match');
		card.addEventListener('click', cardClick);
		partialId++;
	}
};

// Reset game settings
const reset = () => {
    let resetBtn = document.querySelector('.restart');
	timerEnd();
	moves = 0;
	matches = 0;
	seconds = 0;
	minutes = 0;
	clickedCards = [];
	matchedCards = [];
	stars = [];
	timeTrigger = true;
	setRating(moves);
	resetBtn.addEventListener('click', newGame());
	timerContent.innerHTML = `<span class="time">Time: 0${minutes}:0${seconds}</span>`;
	movesCounter.innerHTML = `<span class="moves">${moves} Moves</span>`;
	popUp.classList.add('display-none');
};

// Rules for cards behaviour when clicked
function cardClick() {
	if (clickedCards.length === 2 || matchedCards.includes(this.id)) {
		return;
	}
	if(clickedCards.length === 0 || this.id != clickedCards[0].id){

		if(timeTrigger){
			timerStart();
			timeTrigger = false;
		}
		this.classList.add('show', 'open');
		clickedCards.push(event.target);
		determineAction();
	}
	else {
		return;
	}
	setRating(moves);
}

// Display number of moves
const determineAction = () => {
	if(clickedCards.length ===2 ){
		moves++;
		movesScoring(moves);
		if(clickedCards[0].innerHTML === clickedCards[1].innerHTML){
			matchingCards();
		} else {
			wrongCards();
		}
	}
};

// Rules for cards behaviour when matched
const matchingCards = () => {
    matches++;
	clickedCards[0].classList.remove('open', 'show');
	clickedCards[0].classList.add('match', 'pulse');
	event.target.classList.remove('open', 'show');
	event.target.classList.add('match', 'pulse');
	matchedCards.push(clickedCards[0].id);
	matchedCards.push(clickedCards[1].id);
	clickedCards = [];

	checkForWin();
};

const wrongCards = () => {
    setTimeout(function(){
		clickedCards[0].classList.remove('open', 'show');
		clickedCards[1].classList.remove('open', 'show');
		clickedCards = [];
	}, 750);
};

// Display number of stars
const setRating = (moves) => {
	// Check For the Potential Reset
	if (moves === 0){
		starThree.classList.remove('far', 'fa-star');
		starTwo.classList.remove('far', 'fa-star');
		starOne.classList.remove('far', 'fa-star');
		starThree.classList.add('fas', 'fa-star');
		starTwo.classList.add('fas', 'fa-star');
		starOne.classList.add('fas', 'fa-star');
	}

// Scoring
	if(moves >= 11 && moves <= 14){
		starThree.classList.remove('fas', 'fa-star');
		starThree.classList.add('far', 'fa-star');
	} else if(moves >= 15 && moves <= 20){
		starTwo.classList.remove('fas', 'fa-star');
		starTwo.classList.add('far', 'fa-star');
	} else if(moves >= 21){
		starOne.classList.remove('fas', 'fa-star');
		starOne.classList.add('far', 'fa-star');
	}
};

const finalScore = (moves) => {
    stars.push(starOne.outerHTML + starTwo.outerHTML + starThree.outerHTML);
};

// Moves rating
const movesScoring = (moves) => {
	if (moves >= 1 && moves <= 10) {
		movesCounter.innerHTML = `<span class="moves green">${moves} Moves</span>`;
	} else if (moves >= 11 && moves <= 15) {
		movesCounter.innerHTML = `<span class="moves gold">${moves} Moves</span>`;
	} else {
		movesCounter.innerHTML = `<span class="moves red">${moves} Moves</span>`;
	}
};

// "Congrats" popup settings
const displayModal = () => {
    popUp.innerHTML =
	`<h1 class="heading-one">Congratulations!</h1>
	<h2 class="heading-three">You won!</h2>
	<p class="sub-heading">Your Moves:  ${moves}</p>
	<p class="sub-heading">Your time:  ${minutes} min and ${seconds} sec!</p>
	<p class="sub-heading">Your score:</p><p class="stars-modal text-white">${stars}</p>
	<p class="text-white">Play Again?</p>
	<div class="restart" onclick="reset()">
    <i class="fas fa-redo text-white"></i>
  	</div>
	 `;
};

// Timer settings
const displayTimer = () => {
    seconds++;
	if(seconds === 60){
		minutes++;
		seconds = 0;
	}

	if(minutes > 9 && seconds > 9){
		timerContent.innerHTML = `<span class="time">Time: ${minutes}:${seconds}</span>`;
	}
	else if(minutes > 9 && seconds < 9){
		timerContent.innerHTML = `<span class="time">Time: ${minutes}:0${seconds}</span>`;
	}
	else if(minutes < 9 && seconds > 9){
		timerContent.innerHTML = `<span class="time">Time: 0${minutes}:${seconds}</span>`;
	}
	else{
		timerContent.innerHTML = `<span class="time">Time: 0${minutes}:0${seconds}</span>`;
	}
};

const timerStart = () => {
	clearInterval(time);
	seconds = 0;
	minutes = 0;
	time = setInterval(displayTimer, 1000);
};

const timerEnd = () => {
	clearInterval(time);
};

// Game win settings
const checkForWin = () => {
	if(matches === 8){
		displayWin();
	}
};

const displayWin = () => {
	timerEnd();
	finalScore(moves);
	displayModal();
	popUp.classList.remove('display-none');
};

// Game start
newGame();
