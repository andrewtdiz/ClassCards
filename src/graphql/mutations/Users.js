const addUser = `mutation users($name: String, $email: String) {
    addUser(name: $name, email: $email){
        name
    }
    
}`

const editUserDeckIds = `mutation edit($userId: String, $deckId: String, $operation: Int) {
    editUserDeckIds(userId: $userId, deckId: $deckId, operation: $operation){
        name
        id
        deckIds
    }
}`

const updateUser = `mutation user($userId: String){
    updateUser(userId: $userId){
        name
        userImage
        id
        deckIds
    }
    
}`

const editHandLike = `
mutation handlike($userId: String, $handId: String, $operation: Int){
  editHandLike(userId: $userId, handId: $handId, operation: $operation){
    id
    userImage
    name
    email
    deckIds
    likedHands
  }
}
`

export { addUser, editUserDeckIds, updateUser, editHandLike }