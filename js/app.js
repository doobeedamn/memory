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
var openCards = [];
var openCardsMax = 2;

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

// Create a card prototype
var Card = function(name) {
    this.element = $("<li class='card'><i></i></li>");
    $(".deck").append(this.element);
    this.child = $(this.element[0].children[0]);
    this.child.attr("class", name);
    var card = this;
    $(this.element[0]).click(function() {
        setupTimer();
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
    $(this.element[0]).attr("class", "card open display");
};

Card.prototype.match = function() {
    $(this.element[0]).attr("class", "card match");
};

Card.prototype.close = function() {
    $(this.element[0]).attr("class", "card");
};

// Create instances of the Card prototype and assign card values to them
function makeCards() {
    for (n = 0; n < listOfCards.length; n++) {
        cards[n] = new Card(listOfCards[n]);
    }
    return cards;
}

function addToOpenCards(x) {
    openCards.push(x);
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
            $(".modal-body p").empty().append("in " + endTime + " with " + moves + " moves and " + stars + " stars");
            $(".modal-footer button").click(function() {
                setupGame();
                $(".modal").modal("hide");
            });
            $(".modal").modal("show");
        }
    }
}

// Display number of moves
var moves = 0;
var stars = 3;
function updateMoves() {
    $(".moves").empty().append(moves);
    if (moves == 20) {
        $(".star3 i").attr("class", "fa fa-star-o");
        stars--;
    }
    if (moves == 28) {
        $(".star2 i").attr("class", "fa fa-star-o");
        stars--;
    }
    if (moves == 36) {
        $(".star1 i").attr("class", "fa fa-star-o");
        stars--;
    }
}

// Timer settings
var startTime = 0;
var endTime = 0;
var timer = null;

var time = function() {
    if (cards.every(checkMatch) == false) {
        updateTime(new Date() - startTime);
    }
    else {
    }
};

function updateTime(interval) {
    var seconds = interval / 1000;
    var sec = Math.floor(seconds) % 60;
    var min = Math.floor(seconds / 60) % 60;
    var hr = Math.floor(seconds / 3600);
    endTime = hr + ":" + ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);
    $(".timer").empty().append(endTime);
}

function setupTimer() {
  if (timer == null) {
    startTime = new Date();
    timer = setInterval(time, 1000);
  }
}

function clearTimer() {
    clearInterval(timer);
    timer = null;
    updateTime(0);

}

function checkMatch(card) {
    return $(card.element[0]).attr("class") == "card match";
}

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
    clearTimer();
}

// Game reset
function reset() {
    $(".restart").click(setupGame);
}

setupGame();
reset();
