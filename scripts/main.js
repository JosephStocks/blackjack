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

const addInvisibleCard = (hand) => {
    let img = document.createElement("img");
    img.src = "images/jack_of_hearts.png";
    img.className = "card";
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper not-visible";
    cardWrapper.appendChild(img);
    let handDiv = document.querySelector(`#${hand.owner}-hand`);
    handDiv.appendChild(cardWrapper);
    console.log("Adding invisible card");
};

const renderNewCard = (hand, card) => {
    let img = document.createElement("img");
    img.src = card.imageFilePath;
    img.className = "card";
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";
    cardWrapper.appendChild(img);
    let handDiv = document.querySelector(`#${hand.owner}-hand`);
    handDiv.appendChild(cardWrapper);
};

const dealOneCard = (hand) => {
    card = deck.pop();
    hand.cards.push(card);
};

const clearAllImageDivsFromHandDiv = (hand) => {
    const handDiv = document.getElementById(`${hand.owner}-hand`);
    while (handDiv.firstChild) {
        handDiv.firstChild.remove();
    }
};

const clearOnlyVisibleImagesFromHandDiv = (hand) => {
    document
        .querySelectorAll(
            `#${hand.owner}-hand > .card-wrapper:not(.not-visible)`
        )
        .forEach((e) => e.parentNode.removeChild(e));
};

const renderHand = (hand) => {
    clearAllImageDivsFromHandDiv(hand);
    for (const card of hand.cards) {
        renderNewCard(hand, card);
    }
};

const renderHiddenCard = (hand) => {
    let img = document.createElement("img");
    img.src = "images/back_of_card1_bicycle.png";
    img.className = "card";
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";
    cardWrapper.appendChild(img);
    let handDiv = document.querySelector(`#${hand.owner}-hand`);
    handDiv.appendChild(cardWrapper);
};

const renderHandWHiddenCard = (hand) => {
    clearAllImageDivsFromHandDiv(hand);
    renderHiddenCard(hand);
    for (const card of hand.cards.slice(1)) {
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
    renderHandWHiddenCard(dealerHand);
    let dealButton = document.querySelector("#deal-button");
    dealButton.classList.remove("disabled");
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

const setHandBustStatus = (hand) => {
    const isUnder21 = (pointTotal) => pointTotal < 22;
    if (!pointTotals[hand.owner].some(isUnder21)) {
        hand.busted = true;
    }
};

let deck = [];
fillNewDeck();
let dealerHand = { owner: "dealer", cards: [], busted: false };
let playerHand = { owner: "player", cards: [], busted: false };
let pointTotals = { dealer: 0, player: 0 };

const renderPointsForHand = (hand) => {
    let pointsSpan = document.getElementById(`${hand.owner}-points`);
    pointsSpan.textContent = pointTotals[hand.owner]
        .toString()
        .replace(",", ", ");
};

const calculateAndRenderPossiblePointRange = (hand) => {
    let pointsSpan = document.getElementById(`${hand.owner}-points`);
    shownCardPoints = hand.cards[1].value;
    if (shownCardPoints.length === 1) {
        pointsSpan.textContent = `Range of Possible Points: ${
            shownCardPoints[0] + 1
        } to ${shownCardPoints[0] + 11}`;
    } else if (shownCardPoints.length === 2) {
        pointsSpan.textContent = `Possible Point Totals: ${1 + 1} to ${
            1 + 11
        } OR ${11 + 1} to ${11 + 11}`;
    }
};

const resetEverything = () => {
    clearAllImageDivsFromHandDiv(dealerHand);
    clearAllImageDivsFromHandDiv(playerHand);
    deck = [];
    fillNewDeck();
    dealerHand = { owner: "dealer", cards: [], busted: false };
    playerHand = { owner: "player", cards: [], busted: false };
    pointTotals = { dealer: 0, player: 0 };
    renderPointsForHand(dealerHand);
    renderPointsForHand(playerHand);
    document.querySelector("#busted-message").classList.add("invisible");
    document.querySelector("#draw-message").classList.add("invisible");
    document.querySelector("#winner-message").classList.add("invisible");
    document.querySelector("#lost-message").classList.add("invisible");
    document.querySelector("#background-opacity").classList.add("invisible");
    document.querySelector("#deal-button").classList.remove("disabled");
    document.querySelector("#hit-button").classList.add("disabled");
    document.querySelector("#stand-button").classList.add("disabled");
};

const isOneCardAnAce = (hand) => {
    for (const card of hand.cards) {
        if (card.rank === 1) {
            return true;
        }
    }
    return false;
};

const handHasBlackJack = (hand) => pointTotals[hand.owner].includes(21);

const dealForDealer = () => {
    renderHand(dealerHand);
    calculateAndRenderPoints(dealerHand);
    while (Math.max(...pointTotals["dealer"]) < 17) {
        dealOneCard(dealerHand);
        renderHand(dealerHand);
        calculateAndRenderPoints(dealerHand);
        setHandBustStatus(dealerHand);
    }
    if (dealerHand.busted) {
        signalWin();
    } else {
        if (
            Math.max(...pointTotals["dealer"]) >
            Math.max(...pointTotals["player"])
        ) {
            signalLoss();
        } else if (
            Math.max(...pointTotals["dealer"]) <
            Math.max(...pointTotals["player"])
        ) {
            signalWin();
        } else {
            signalDraw();
        }
    }
};

const signalDraw = () => {
    document.querySelector("#draw-message").classList.remove("invisible");
    document.querySelector("#background-opacity").classList.remove("invisible");
    let buttons = document.querySelectorAll(".game");
    for (const button of buttons) {
        button.classList.add("disabled");
    }
};

const signalLoss = () => {
    document.querySelector("#lost-message").classList.remove("invisible");
    document.querySelector("#background-opacity").classList.remove("invisible");
    let buttons = document.querySelectorAll(".game");
    for (const button of buttons) {
        button.classList.add("disabled");
    }
};
const signalWin = () => {
    document.querySelector("#winner-message").classList.remove("invisible");
    document.querySelector("#background-opacity").classList.remove("invisible");
    let buttons = document.querySelectorAll(".game");
    for (const button of buttons) {
        button.classList.add("disabled");
    }
};

window.addEventListener("click", (e) => {
    if (e.target.id === "deal-button") {
        resetEverything();
        initialDeal();
        // calculateAndRenderPoints(dealerHand);
        calculatePoints(dealerHand);
        calculateAndRenderPossiblePointRange(dealerHand);
        calculateAndRenderPoints(playerHand);
        document.querySelector("#hit-button").classList.remove("disabled");
        document.querySelector("#stand-button").classList.remove("disabled");
        document.querySelector("#deal-button").classList.add("disabled");
        console.log(pointTotals["dealer"]);
        console.log(pointTotals["player"]);
        if (handHasBlackJack(dealerHand) && handHasBlackJack(playerHand)) {
            renderHand(dealerHand);
            signalDraw();
        } else if (
            handHasBlackJack(dealerHand) &&
            !handHasBlackJack(playerHand)
        ) {
            renderHand(dealerHand);
            signalLoss();
        } else if (handHasBlackJack(playerHand)) {
            renderHand(dealerHand);
            signalWin();
        }
    } else if (e.target.id === "hit-button") {
        dealOneCard(playerHand);
        renderHand(playerHand);
        calculateAndRenderPoints(playerHand);
        setHandBustStatus(playerHand);
        if (playerHand.busted) {
            renderHand(dealerHand);
            calculateAndRenderPoints(dealerHand);
            setTimeout(signalLoss, 500);
        }
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
