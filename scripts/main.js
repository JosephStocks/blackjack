// window.addEventListener("click", (e) => {
//     if (e.target.id === "deal-button") {
//         let img = document.createElement('img')
//         img.src = "images/10_of_spades.png"
//         let dealer_hand = document.querySelector('#dealer-hand')
//         dealer_hand.appendChild(img)
//     }
// })
const rankToName = (rank) => {
    let rankToName = { 1: "ace", 11: "jack", 12: "queen", 13: "king" };
    let cardName;
    if (rank >= 2 && rank <= 10) {
        cardName = rank;
    } else {
        cardName = rankToName[rank];
    }
    return cardName;
};

const fillNewDeck = () => {
    let imageDir = "images";
    for (const suit of ["clubs", "diamonds", "hearts", "spades"]) {
        for (let rank = 1; rank <= 13; rank++) {
            let name = rankToName(rank).toString();

            if (rank === 1) {
                value = [1, 11];
            } else if (rank > 10) {
                value = [10];
            } else {
                value = [rank];
            }
            deck.push({
                rank: rank,
                suit: suit,
                name: name,
                fullName: `${name[0].toUpperCase()}${name.slice(
                    1
                )} of ${suit[0].toUpperCase()}${suit.slice(1)}`,
                imageFilePath: `${imageDir}/${name}_of_${suit}.png`,
                value: value,
            });
        }
    }
};

const shuffleCards = () => {
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
};

const renderNewCard = (hand, card) => {
    let img = document.createElement("img");
    img.src = card.imageFilePath;
    img.className = "card";
    let div = document.createElement("div");
    div.className = "cardWrapper";
    div.appendChild(img);
    let handDiv = document.querySelector(`#${hand.owner}-hand`);
    handDiv.appendChild(div);

    let numCardsToCardsClassWidth = [
        66.12,
        90.0,
        113.89,
        137.77,
        161.66,
        185.54,
        209.43,
        233.31,
        257.2,
        281.08,
        304.97,
        328.85,
    ];
    let cardsDiv = document.querySelector(`#${hand.owner}-hand.cards`);
    cardsDiv.style.width =
        numCardsToCardsClassWidth[cardsDiv.childElementCount - 1].toString() +
        "px";
};

const dealOneCard = (hand) => {
    card = deck.pop();
    hand.cards.push(card);
};

const clearImagesFromHandDiv = (hand) => {
    const handDiv = document.getElementById(`${hand.owner}-hand`);
    while (handDiv.firstChild) {
        handDiv.firstChild.remove();
    }
};

const renderHand = (hand) => {
    clearImagesFromHandDiv(hand);
    for (const card of hand.cards) {
        renderNewCard(hand, card);
    }
};

const initialDeal = () => {
    shuffleCards();
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
    renderHand(playerHand);
    renderHand(dealerHand);
    let dealButton = document.querySelector("#deal-button");
    dealButton.classList.toggle("disabled");
};

function createPointCombinationArrays(array) {
    var results = [[]];
    for (var i = 0; i < array.length; i++) {
        var currentSubArray = array[i];
        var temp = [];
        for (var j = 0; j < results.length; j++) {
            for (var k = 0; k < currentSubArray.length; k++) {
                temp.push(results[j].concat(currentSubArray[k]));
            }
        }
        results = temp;
    }
    return results;
}

const sumArray = (arr) => {
    return arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
};

const calculatePoints = (hand) => {
    valuesArr = [];
    for (const card of hand.cards) {
        valuesArr.push(card.value);
    }
    valueCombosArr = createPointCombinationArrays(valuesArr);
    let sums = [];
    for (const valueArr of valueCombosArr) {
        sums.push(sumArray(valueArr));
    }
    let minimumTotal = Math.min(...sums);
    let totalsLessThan21 = sums.filter((num) => num <= 21);
    if (totalsLessThan21.length === 0) {
        pointTotals[hand.owner] = [minimumTotal];
    } else {
        pointTotals[hand.owner] = totalsLessThan21;
    }
};

const calculateAndRenderPoints = (hand) => {
    calculatePoints(hand);
    renderPointsForHand(hand);
};

const isHandBusted = (hand) => {
    const isUnder21 = (pointTotal) => pointTotal < 22;
    if (!pointTotals[hand.owner].some(isUnder21)) {
        if (hand.owner == "player") {
            document
                .querySelector("#busted-message")
                .classList.remove("invisible");
            document
                .querySelector("#background-opacity")
                .classList.remove("invisible");
            let buttons = document.querySelectorAll(".game");
            for (const button of buttons) {
                button.classList.add("disabled");
            }
        } else {
            document
                .querySelector("#winner-message")
                .classList.remove("invisible");
            document
                .querySelector("#background-opacity")
                .classList.remove("invisible");
            let buttons = document.querySelectorAll(".game");
            for (const button of buttons) {
                button.classList.add("disabled");
            }
        }
    }
};

let deck = [];
fillNewDeck();
let dealerHand = { owner: "dealer", cards: [] };
let playerHand = { owner: "player", cards: [] };
let pointTotals = { dealer: 0, player: 0 };

const renderPointsForHand = (hand) => {
    let pointsSpan = document.getElementById(`${hand.owner}-points`);
    pointsSpan.textContent = pointTotals[hand.owner]
        .toString()
        .replace(",", ", ");
};

const resetEverything = () => {
    clearImagesFromHandDiv(dealerHand);
    clearImagesFromHandDiv(playerHand);
    deck = [];
    fillNewDeck();
    dealerHand = { owner: "dealer", cards: [] };
    playerHand = { owner: "player", cards: [] };
    pointTotals = { dealer: 0, player: 0 };
    renderPointsForHand(dealerHand);
    renderPointsForHand(playerHand);
    document.querySelector("#busted-message").classList.add("invisible");
    document.querySelector("#draw-message").classList.add("invisible");
    document.querySelector("#winner-message").classList.add("invisible");
    document.querySelector("#lost-message").classList.add("invisible");
    document.querySelector("#background-opacity").classList.add("invisible");
    let buttons = document.querySelectorAll(".game");
    for (const button of buttons) {
        button.classList.remove("disabled");
    }
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const isOneCardAnAce = (hand) => {
    for (const card of hand.cards) {
        if (card.rank === 1) {
            return true;
        }
    }
    return false;
};

const dealForDealer = () => {
    let stillDealing = true;
    while (stillDealing) {
        if (pointTotals["dealer"] <= 16) {
            // sleep(1500)
            dealOneCard(dealerHand);
            calculateAndRenderPoints(dealerHand);
            isHandBusted(dealerHand);
        } else if (pointTotals["dealer"] === 17 && isOneCardAnAce(dealerHand)) {
            // sleep(1500)
            dealOneCard(dealerHand);
            calculateAndRenderPoints(dealerHand);
            isHandBusted(dealerHand);
        } else {
            stillDealing = false;
            isHandBusted(dealerHand);
        }
    }
    if (
        pointTotals["dealer"] <= 21 &&
        pointTotals["dealer"] > pointTotals["player"]
    ) {
        document.querySelector("#lost-message").classList.remove("invisible");
        document
            .querySelector("#background-opacity")
            .classList.remove("invisible");
        let buttons = document.querySelectorAll(".game");
        for (const button of buttons) {
            button.classList.add("disabled");
        }
    } else if (
        pointTotals["dealer"] <= 21 &&
        pointTotals["dealer"] === pointTotals["player"]
    ) {
        document.querySelector("#draw-message").classList.remove("invisible");
        document
            .querySelector("#background-opacity")
            .classList.remove("invisible");
        let buttons = document.querySelectorAll(".game");
        for (const button of buttons) {
            button.classList.add("disabled");
        }
    }
};

window.addEventListener("click", (e) => {
    if (e.target.id === "deal-button") {
        initialDeal();
        calculateAndRenderPoints(dealerHand);
        calculateAndRenderPoints(playerHand);
        isHandBusted(playerHand);
    } else if (e.target.id === "hit-button") {
        dealOneCard(playerHand);
        renderHand(playerHand);
        calculateAndRenderPoints(playerHand);
        isHandBusted(playerHand);
    } else if (e.target.id === "stand-button") {
        let buttons = document.querySelectorAll(".game");
        for (const button of buttons) {
            button.classList.add("disabled");
        }
        dealForDealer();
    } else if (e.target.id === "reset-button") {
        resetEverything();
    }
});
