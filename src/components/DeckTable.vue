<template>
  <table>
    <thead>
      <tr>
        <th
          class="font-normal border-t border-r border-gray-200 p-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          scope="col"
        >
          Front
        </th>
        <th
          class="font-normal border-t border-r border-gray-200 p-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          scope="col"
        >
          Back
        </th>
        <th
          class="font-normal border-t border-r border-gray-200 p-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          scope="col"
        >
          Reviews
        </th>
        <th
          class="font-normal border-t border-r border-gray-200 p-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          scope="col"
        >
          Comments
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(card, ind) in cards" :key="ind" @mouseleave="hovering=-1" @mouseenter="hovering = ind"  @mousemove="hovering=ind" class="hover:bg-gray-100 bg-opacity-25">
        <th
          v-for="(val, ind2) in Object.keys(card)"
          :key="ind2"
          class="border-t relative border-r border-gray-200 p-1" :class="ind2==0 ? 'font-medium' : 'font-normal'"
        >
          {{ card[val] }}
          <div :class="(ind2==0 && hovering==ind) ? 'opacity-100' : 'opacity-0'" class="absolute left-0 h-full text-lg p-1 cursor-move" @mouseleave="hovering=-1" @mouseenter="hovering = ind" style="top: 50%; transform: translate(-100%, -50%)"> ⋮⋮</div>

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
      columns: [""],
      hovering: -1,
    };
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
        if(holdVal.length==0) return hand.cards[0]
        else return holdVal[0]
      });
      return result
    },
  },
};
</script>

<style>
</style>