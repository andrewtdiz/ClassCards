const addSubComment = `mutation subcomment($content: String, $userId: String, $cardCommentId: String) {
    addSubComment(content: $content, userId: $userId, cardCommentId: $cardCommentId){
        userId
        content
        dateCreated
    }
    
}`

export default addSubComment