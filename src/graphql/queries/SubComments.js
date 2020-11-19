const getSubCommentsByComment = `query subcomment($cardcommentId: String) {
    subcomments(cardcommentId: $cardcommentId){
        content
        dateCreated
        userId
    }
    
}`

export { getSubCommentsByComment }