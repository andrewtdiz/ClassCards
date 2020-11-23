<template>
  <div
    class="flex flex-col items-start my-3 justify-between"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="flex w-full items-center mb-1" style="width: 400px">
      <div class="bg-blue-500 rounded-full h-5 w-5 mr-2"></div>
      <p class="text-xs text-gray-700">User 1</p>
      <p class="text-xs text-gray-600 ml-auto">
        {{ dateFormater(hand.dateCreated) }}
      </p>
    </div>
    <div class="flex relative">
      <div
        class="flex flex-col relative shadow bg-white rounded p-4"
        style="min-width: 400px"
      >
        <button
          class="absolute bg-brand-blue-500 hover:bg-brand-blue-600 px-2 py-1 mt-1 mr-1 text-white rounded-sm top-0 right-0 text-xs"
          v-if="hovering && !isMain"
        >
          Use
        </button>
        <h1 class="text-black" v-html="card.front"></h1>
        <h1 class="text-black mt-4" v-html="card.back"></h1>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistance } from "date-fns";

export default {
  props: ["card", "isMain"],
  data() {
    return {
      hovering: false,
    };
  },
  methods: {
    dateFormater(cardDate) {
      cardDate = Date.parse(cardDate);
      if (cardDate) {
        cardDate = formatDistance(cardDate, new Date(), { addSuffix: true });
        cardDate = cardDate
          .split(" ")
          .filter((val) => val != "about")
          .join(" ");
        return cardDate;
      }
      return "";
    },
  },
  computed: {
    hands() {
      return this.$store.getters.getHands;
    },
    viewingHand() {
      return this.$store.getters.getViewingHand;
    },
    hand() {
      return this.$store.getters.getHands.filter(
        (hand) => hand.id == this.viewingHand
      )[0];
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    mainCard() {
      console.log("in the checker", this.hand.userThumb);
      if (this.hand.userThumb !== undefined) {
        return this.hand.cards.filter(
          (card) => card.id == this.hand.userThumb
        )[0];
      }
      console.log("should return: ", this.hand.cards[0]);
      return this.hand.cards[0];
    },
    otherCards() {
      return this.hand.cards.filter((card) => card.id !== this.mainCard.id);
    },
  },
};
</script>

<style>
</style>