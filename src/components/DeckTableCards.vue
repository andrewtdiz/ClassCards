<template>
  <table>
    <thead>
      <tr class="" >
        <th
          class="font-normal p-2 border-gray-200 text-sm text-gray-600 hover:bg-gray-200 hover:bg-opacity-50 cursor-pointer"
          scope="col"
          v-for="(key, ind) in columns" :key="ind"
        >
          {{key}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr @click="viewCard(card)" v-for="(card, ind) in cards" :key="ind" @mouseleave="hovering=-1" @mouseenter="hovering = ind"  @mousemove="hovering=ind" class="hover:bg-gray-50 shadow bg-white hover:bg-opacity-25 rounded">
        <th
          v-for="(val, ind2) in columns"
          :key="ind2"
          class="relative cursor-auto border-gray-200 hover:bg-gray-100 hover:bg-opacity-50 p-2 text-base font-normal" :class="ind2==0 ? ['rounded-l-md'] : (val==Object.keys(card).slice(-1)[0]) ? ['rounded-r-md'] : ''"
          v-html="card[val]"
        >
          <div class="absolute cursor-move left-0 bg-red-500  p-1 h-6 w-6 text-gray-500" @mouseleave="hovering=-1" @mouseenter="hovering = ind" style="top: 50%; transform: translate(-100%, -50%)"> ⋮⋮</div>

        </th>

      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th
          class="border-t border-b border-gray-200 hover:bg-gray-100 font-normal text-sm text-gray-500 cursor-pointer hover:text-gray-700 p-1"
          scope="row"
          colspan="4"
        >
          + Add card
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<script>
export default {
  data() {
    return {
      columns: ['front', 'back', 'id', 'userId', 'handId', 'commentTotal', 'likeTotal'],
      hovering: -1,
    };
  },
  methods: {
      viewCard(hand) {
          this.$store.dispatch('changeViewingHand', {handId: hand.handId})
          this.$store.commit("changeModal", "viewCard")
      },
  },
  computed: {
    hands() {
      return this.$store.getters.getHands;
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    cards() {
      let result = this.hands.map((hand) => {
        let holdVal = hand.cards.filter((card) => {
          if (
            this.currentUser.userThumbs
              .map((thumb) => thumb.cardId)
              .includes(card.id)
          ) {
            return true;
          }
          return false;
        })
        if(holdVal.length==0) {
            let hold = hand.cards[0]
            hold.handId = hand.id
            hold.commentTotal = hand.commentTotal
            hold.likeTotal = hand.likeTotal
            return hold
        }
        else {
            holdVal.handId = hand.id
            return holdVal[0]
        }
      });
      return result
    },
  },
};
</script>

<style>
table {
    border-collapse: separate !important;
    border-spacing: 0 0.25em !important;
}

</style>