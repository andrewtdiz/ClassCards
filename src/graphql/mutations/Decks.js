const addDeck = `mutation deck($deckName: String, $userId: String, $deckDescription: String, $everyone: Boolean, $inviteOnly: Boolean, $usersEdit: Boolean, $anonymousPosting: Boolean) {
    addDeck(deckName: $deckName, userId: $userId, deckDescription: $deckDescription, everyone: $everyone, inviteOnly: $inviteOnly, usersEdit: $usersEdit, anonymousPosting: $anonymousPosting){
        name
        deckDescription
        dateCreated
        userIds
        adminIds
        id
        everyone
        inviteOnly
        usersEdit
        anonymousPosting
    }
    
}`

const updateDeck = `mutation deck($deckId: String) {
    updateDeck(deckId: $deckId){
        name    
        deckDescription    
        dateCreated
        userIds
        adminIds
        id
        everyone
        inviteOnly
        usersEdit
        anonymousPosting
    }
    
}`

const updateAdmin = `mutation deck($userId: String, $deckId: String, $operation: Int) {
    updateDeckAdmin(userId: $userId, deckId: $deckId, operation: $operation){
        name
        deckDescription  
        dateCreated
        userIds
        adminIds
        id
        everyone
        inviteOnly
        usersEdit
        anonymousPosting
    }
    
}`

export {addDeck, updateAdmin, updateDeck}