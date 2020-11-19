<template>
  <div
    @click="$store.dispatch('changeViewingHand', { handId: hand.id })"
    class="cursor-pointer bg-white flex items-center justify-around hover:bg-gray-100 p-3 rounded w-1/2 mt-1"
  >
    <p
      :class="
        currentUser.likedHands.includes(hand.id) ? 'text-orange-500' : ''
      "
    >
      {{ hand.likeTotal }}
    </p>
    <p v-if="hand.userThumb !== undefined">
      {{ hand.cards.filter((card) => card.id == hand.userThumb)[0].front }},
      {{ hand.cards.filter((card) => card.id == hand.userThumb)[0].back }},
    </p>
    <p v-else>
      {{ hand.cards[0].front }}, {{ hand.cards[0].back }},
    </p>
    <button
      class="button" v-if="handTotal!==1 && handIdsOrder.indexOf(hand.id)!==0"
      @click.stop="editDeckTag({ handId: hand.id, tagId: tag.id, operation: -1 })"
    >
      ↑
    </button>
    <button
      class="button" v-if="handTotal!==1 && handIdsOrder.indexOf(hand.id)!==(handIdsOrder.length-1)"
      @click.stop="editDeckTag({ handId: hand.id, tagId: tag.id, operation: 1 })"
    >
      ↓
    </button>
  </div>
</template>

<script>
export default {
    props: ["hand", "handTotal", "tag"],
    computed: {
        currentUser() {
            return this.$store.getters.getCurrentUser;
        },
        currentDeck() {
            return this.$store.getters.getCurrentDeck;
        },
        handIdsOrder() {
            return this.tag.handIdsOrder
        },
    },
    methods: {
        editDeckTag({ handId, tagId, operation }) {
            let handIdsOrder = this.currentDeck.tags.filter(tag=>tag.id==tagId)[0].handIdsOrder.slice()
            let ind = handIdsOrder.indexOf(handId)
            let handIdHold = handIdsOrder.splice(ind, 1)[0]
            handIdsOrder.splice(operation==1 ? ind+1 : ind-1, 0, handIdHold)
            this.$store.dispatch('editDeckTag', {id: tagId, handIdsOrder: handIdsOrder})
        },
    }
};
</script>

<style>
</style>