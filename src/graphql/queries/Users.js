const getUsers = `query {
    user{
        name
        userImage
        id
    }
    
}`

const getUserById = `query user($userId: String){
    userById(userId: $userId){
        name
        userImage
        id
        deckIds
        likedHands
        userThumbs(userId: $userId) {
            handId
            cardId
            userId
        }
    }
    
}`

export { getUsers, getUserById }