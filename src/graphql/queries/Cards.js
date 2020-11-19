const getCardsByHand = `query card($handId: String) {
    cards(handId: $handId){
        front
        back
        id
        dateCreated
        userId
    }
    
}`

const getCards = `query card($deckID: String){
    cards(deckId: $deckID){
        front
        back
        id
        dateCreated
        userId
    }
    
}`

export { getCardsByHand, getCards }