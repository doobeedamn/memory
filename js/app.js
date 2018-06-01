// List that holds the cards
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

shuffle(listOfCards);

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
};

// Set up three stages for card: opened, matcged, closed
Card.prototype.open = function() {
    $(this.element[0]).attr("class", "card open show");
};

Card.prototype.match = function() {
    $(this.element[0]).attr("class", "card match");
};

Card.prototype.close = function() {
    $(this.element[0]).attr("class", "card");
};

// Create instances of the Card prototype and assign card values to them
function makeCards() {
    var n = 0
    for (n = 0; n < listOfCards.length; n++) {
      cards[n] = new Card(listOfCards[n]);
    }
    return cards;
}

function addToOpenCards(x) {
    openCards.push(x);
}

function isMatch() {
    if (openCards[0].child.attr("class") == openCards[1].child.attr("class")) {
        openCards[0].match();
        openCards[1].match();
    }
    else {
        openCards[0].close();
        openCards[1].close();
    }
}

// Display number of moves
var moves = 0;
function updateMoves() {
    $(".moves").empty().append(moves);
}

// Reset number of moves
function reset() {
    $(".restart").click(function() {
        moves = 0;
        updateMoves();
        $(".deck").empty();
        shuffle(listOfCards);
        game();
    });
}

function game() {
    makeCards();
    $.each(cards, function(i, card
        $(card.element[0]).click(function() {
            if (openCards.length < 2) {
                card.open();
                addToOpenCards(card);
                moves++;
                updateMoves();
                console.log(moves);
            }
            else {
                isMatch(card);
                openCards = [];
            }
        });
    });
}

game();
reset();
