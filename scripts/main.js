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
            deck.push({
                rank: rank,
                suit: suit,
                name: name,
                fullName: `${name[0].toUpperCase()}${name.slice(
                    1
                )} of ${suit[0].toUpperCase()}${suit.slice(1)}`,
                imageFilePath: `${imageDir}/${name}_of_${suit}.png`
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

// const varName = obj => Object.keys(obj)[0];

// const renderNewCard = (hand) => {
//     handName = varName({hand})
//     console.log(handName.slice(0, 7));
// }

const dealOneCard = (hand) => {
    card = deck.pop()
    hand.push();
    renderNewCard(hand)
};

const initialDeal = () => {
    shuffleCards();
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
};

let deck = [];
fillNewDeck();
let dealerHand = [];
let playerHand = [];
initialDeal();

// console.log(deck);
// console.log(playerHand);
// console.log(dealerHand);

renderNewCard(dealerHand)