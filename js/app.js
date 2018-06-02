// Lists that holds all of the cards
var listOfCards = [
 "fa fa-anchor", "fa fa-anchor",
 "fa fa-bicycle", "fa fa-bicycle",
 "fa fa-bolt", "fa fa-bolt",
 "fa fa-bomb", "fa fa-bomb",
 "fa fa-cube", "fa fa-cube",
 "fa fa-diamond", "fa fa-diamond",
 "fa fa-leaf", "fa fa-leaf",
 "fa fa-paper-plane-o", "fa fa-paper-plane-o"
];
var cards =[];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create the cards
var Card = function(name) {
    this.element = $("<li class='card'><i></i></li>");
    $(".deck").append(this.element);
    this.child = this.element.children();
    this.child.attr("class", name);
    var card = this;
    this.element.click(function() {
        timer.setup();
        if (openCards.length < openCardsMax) {
            if ($(this).attr("class") == "card") {
                card.open();
                addToOpenCards(card);
                moves++;
                updateMoves();
                setTimeout(isMatch, 1500);
            }
        }
    });
};

// Set up three stages for card: opened, matched, closed
Card.prototype.open = function() {
    this.element.attr("class", "card open display");
};

Card.prototype.match = function() {
    this.element.attr("class", "card match");
};

Card.prototype.close = function() {
    this.element.attr("class", "card");
};

// Create instances of the card prototype and assign card values to them
function makeCards() {
    var n = 0;
    for (n = 0; n < listOfCards.length; n++) {
        cards[n] = new Card(listOfCards[n]);
    }
    return cards;
}

// Display number of moves and stars
var moves = 0;
var stars = 3;
function updateMoves() {
    $(".moves").empty().append(moves);
    if (moves == 25) {
        $(".star3 i").attr("class", "fa fa-star-o");
        stars--;
    }
    if (moves == 33) {
        $(".star2 i").attr("class", "fa fa-star-o");
        stars--;
    }
}

// Timer settings
var Timer = function() {
};

var intervalHandler = null;
var startTime = 0;
var displayTime = 0;

Timer.prototype.setup = function() {
  if (intervalHandler == null) {
    startTime = new Date();
    intervalHandler = setInterval(this.ticker, 1000);
  }
};

Timer.prototype.display = function(interval) {
    var seconds = interval / 1000;
    var sec = Math.floor(seconds) % 60;
    var min = Math.floor(seconds / 60) % 60;
    displayTime = ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);
    $(".timer").text(displayTime);
};

Timer.prototype.ticker = function() {
    if (cards.every(checkMatch) == false) {
        timer.display(new Date() - startTime);
    }
};

Timer.prototype.clear = function() {
    clearInterval(intervalHandler);
    intervalHandler = null;
    timer.display(0);
};

var timer = new Timer();

// Game basic settings: declare the deck, shuffle cards, display cards, start tracking moves and time
// Game start
function setupGame() {
    $(".deck").empty();
    shuffle(listOfCards);
    makeCards();
    moves = 0;
    updateMoves();
    stars = 3;
    $(".stars").each(function() {
        $(this).find("i").attr("class", "fa fa-star");
    });
    timer.clear();
}

//Game reset
function reset() {
    $(".restart").click(setupGame);
}

// Cards behaviour: if they are a match, they stay opened; if they are not a match, they turn back
var openCards = [];
var openCardsMax = 2;

function addToOpenCards(x) {
    openCards.push(x);
}

function checkMatch(card) {
    return $(card.element[0]).attr("class") == "card match";
}

function isMatch() {
    if (openCards.length == 2) {
        if (openCards[0].child.attr("class") == openCards[1].child.attr("class")) {
            openCards[0].match();
            openCards[1].match();
        }
        else {
            openCards[0].close();
            openCards[1].close();
        }
        openCards = [];
        cards.every(checkMatch);
        if (cards.every(checkMatch)) {
            $(".modal-body p").text("In " + displayTime + " with " + moves + " moves and " + stars + " stars.");
            $(".modal-footer button").click(function() {
                setupGame();
                $(".modal").modal("hide");
            });
            $(".modal").modal("show");
        }
    }
}

// Start new game
setupGame();
reset();
