const getHandReviewsByUser = `query handreview($handId: String, $userId: String) {
    handreviews(handId: $handId, userId: $userId){
        review
        dateCreated
    }
    
}`

export { getHandReviewsByUser }