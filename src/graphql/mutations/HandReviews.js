const addHandReview = `mutation handreview($review: Int, $userId: String, $handId: String) {
    addHandReview(review: $review, userId: $userId, handId: $handId){
        review
        handId
        dateCreated
    }
    
}`

export default addHandReview