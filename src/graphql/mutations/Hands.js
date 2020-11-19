const addHand = `mutation hand($front: String, $back: String, $deckId: String, $userId: String) {
    addHand(front: $front, back: $back, deckId: $deckId, userId: $userId){
        deckId
        dateCreated
        id
        likeTotal
        cards {
            front
            back
            id
            dateCreated
            userId
        }
        comments {
            id
            content
            userId
            dateCreated
            subComments {
                userId
                content
                dateCreated
            }
        }
    }
    
}`

export default addHand