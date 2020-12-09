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
                imageFilePath: `${imageDir}/${name}_of_${suit}.png`,
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
    renderNewCard(hand, card);
};

const initialDeal = () => {
    shuffleCards();
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
    dealOneCard(playerHand);
    dealOneCard(dealerHand);
};

const clearImagesFromHandDiv = (hand) => {
    const handDiv = document.getElementById(`${hand.owner}-hand`)
    while (handDiv.firstChild) {
        handDiv.firstChild.remove()
    }
}

const renderHand = (hand) => {
    clearImagesFromHandDiv(hand)
    for (const card of hand.cards) {
        renderNewCard(hand, card)
    }
}

let deck = [];
fillNewDeck();
let dealerHand = { owner: "dealer", cards: [] };
let playerHand = { owner: "player", cards: [] };
initialDeal();
// renderHand(dealerHand)
// renderHand(playerHand)

console.log(deck);
console.log(playerHand);
console.log(dealerHand);

const calculatePoints = (hand) => {
    
}
