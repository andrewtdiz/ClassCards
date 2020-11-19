const editHandThumb = `mutation subcomment($userId: String, $handId: String, $cardId: String, $operation: Int) {
    editHandThumb(userId: $userId, handId: $handId, cardId: $cardId, operation: $operation){
        userId
        handId
        cardId
    }
}`

export default editHandThumb