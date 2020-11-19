const addCardComment = `mutation cardcomment($content: String, $userId: String, $handId: String) {
    addCardComment(content: $content, userId: $userId, handId: $handId){
        content
        id
        dateCreated
        handId
        userId
    }
    
}`

export default addCardComment