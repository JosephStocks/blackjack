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
            name = rankToName(rank);

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
    let handDiv = document.querySelector(`#${hand.owner}-hand`);
    handDiv.appendChild(img);
};

const dealOneCard = (hand) => {
    card = deck.pop();
    hand.cards.push(card);
    renderHand(hand)
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
    renderHand(dealerHand)
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
        ((accumulator, currentValue) => accumulator + currentValue), 0
    );
};

const calculatePoints = (hand) => {
    valuesArr = [];
    for (const card of hand.cards) {
        valuesArr.push(card.value);
    }
    valueCombosArr = createPointCombinationArrays(valuesArr);
    let sums = []
    for (const valueArr of valueCombosArr) {
        sums.push(sumArray(valueArr))
    }
    let minimumTotal = Math.min(...sums)
    let totalsLessThan21 = sums.filter(num => num <= 21)
    if (totalsLessThan21.length === 0) {
        pointTotals[hand.owner] = [minimumTotal]
    } else {
        pointTotals[hand.owner] = totalsLessThan21
    }
};

const calculateAndRenderPoints = (hand) => {
    calculatePoints(hand)
    renderPointsForHand(hand)
}

const isHandBusted = (hand) => {
    const isUnder21 = (pointTotal) => pointTotal < 22;
    return !pointTotals[hand.owner].some(isUnder21);
}

let deck = [];
fillNewDeck();
let dealerHand = { owner: "dealer", cards: [] };
let playerHand = { owner: "player", cards: [] };
let pointTotals = { dealer: 0, player: 0}

const renderPointsForHand = (hand) => {
    let pointsSpan = document.getElementById(`${hand.owner}-points`)
    pointsSpan.textContent = pointTotals[hand.owner].toString().replace(',', ', ')
}

window.addEventListener("click", (e) => {
    if (e.target.id === "deal-button") {
        initialDeal()
        calculateAndRenderPoints(dealerHand);
        calculateAndRenderPoints(playerHand);
        // console.log(calculatePoints(playerHand))
        console.log(isHandBusted(playerHand))
    } else if (e.target.id === "hit-button") {
        dealOneCard(playerHand)
        calculateAndRenderPoints(playerHand);
        console.log(isHandBusted(playerHand))
    } else if (e.target.id === "stand-button") {
        console.log("stand");
    }
})