const editDeckTag = `mutation decktag($id: String, $parentTag: String, $handIdsOrder: [String]) {
    editDeckTag(id: $id, parentTag: $parentTag, handIdsOrder: $handIdsOrder){
        id
        name
        deckId
        handIdsOrder
        parentTag
    }
}`

const addDeckTag = `mutation decktag($deckId: String, $parentTag: String, $name: String) {
    addDeckTag(parentTag: $parentTag, name: $name){
        id
        name
        deckId
        handIdsOrder
        parentTag
    }
}`

export { editDeckTag, addDeckTag }