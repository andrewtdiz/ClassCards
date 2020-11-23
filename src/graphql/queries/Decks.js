const getDeckByID = `query deck($id: String, $userId: String) {
    deck(id: $id, userId: $userId){
        name
        id
        deckDescription
        adminIds
        userIds
        everyone
        inviteOnly
        usersEdit
        anonymousPosting
        tags {
            name
            parentTag
            id
            handIdsOrder
        }
    }
}`

const getDecks = `query {
    decks{
        name
        id
        deckDescription
        adminIds
        userIds
        everyone
        inviteOnly
        usersEdit
        anonymousPosting
        tags {
            name
            parentTag
            id
            handIdsOrder
        }
    }
}`

export { getDeckByID, getDecks }