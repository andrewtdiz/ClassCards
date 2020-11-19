const getCardCommentsByHand = `query cardcomment($handId: String) {
    cardcomments(handId: $handId){
        content
        dateCreated
        userId
        id
        subComments {
            userId
            content
            dateCreated
        }
    }
    
}`

export { getCardCommentsByHand }