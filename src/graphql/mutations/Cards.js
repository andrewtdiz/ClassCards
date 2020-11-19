const addCard = `mutation card($front: String, $back: String, $handId: String, $userId: String, $deckId: String) {
    addCard(front: $front, back: $back, handId: $handId, userId: $userId, deckId: $deckId){
        front
        back
        userId
        dateCreated
        id
    }
    
}`

export default addCard