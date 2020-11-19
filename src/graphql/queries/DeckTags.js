const getDeckTags = `query decktag($deckId: String){
    decktags (deckId: $deckId){
        id
        name
        deckId
        handIdsOrder
        parentTag
    }
}`

export { getDeckTags }