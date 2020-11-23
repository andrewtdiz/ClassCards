<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative pt-5 pl-5 pr-5 pb-2"
      style="max-width: 80%; min-width: 60%; height: 60%"
    >
      <transition name="fade">
        <div
          v-if="creatingDeck"
          class="w-full top-0 left-0 h-full z-20 absolute"
        >
          <div class="absolute w-full h-full bg-gray-200 opacity-50"></div>
          <div
            class="absolute"
            style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
          >
            <div class="loader-2"></div>
          </div>
        </div>
      </transition>
      <div class="flex w-full h-full">
        <div class="flex flex-col border-r border-gray-200">
          <h1 class="font-medium px-8 text-xs mt-5 uppercase text-gray-600">
            Current Card
          </h1>
          <ModalViewCard :card="mainCard" class="px-8" :isMain="true" />
          <div class="bg-gray-200 w-full my-2" style="height: 1px"></div>
          <div class="flex flex-col p-5">
            <div class="flex items-center">
              <h1 class="font-medium text-xs w-24 uppercase text-gray-600">
                Created by
              </h1>
              <div class="bg-blue-500 rounded-full h-5 w-5 mr-2"></div>
              <p class="text-xs text-gray-700">User 1</p>
            </div>
            <div class="flex items-center">
              <h1 class="font-medium w-24 text-xs uppercase text-gray-600">
                Date Created
              </h1>
              <p class="">{{ dateFormater(hand.dateCreated) }}</p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col relative overflow-hidden flex-1 items-stretch"
        >
          <div class="flex absolute mt-1 w-full px-8">
            <button
              v-for="(button, ind) in buttons"
              :key="ind"
              :class="
                button == selectedButton
                  ? ['bg-gray-200', 'text-gray-900']
                  : ['hover:bg-gray-200']
              "
              @click="selectedButton = button"
              class="py-1 px-2 transition-default text-sm mr-2 hover:text-gray-900 rounded text-gray-700 text-left flex items-center"
            >
              {{ button }}
            </button>
          </div>
          <div class="flex flex-col mt-8 h-full">
            <div class="bg-gray-200 w-full mt-2" style="height: 1px"></div>
            <div
              v-if="selectedButton == 'Cards'"
              class="px-8 bg-gray-100 h-full"
            >
              <div
                class="flex flex-col"
                v-for="(card, ind) in otherCards"
                :key="ind"
              >
                <ModalViewCard :card="card" :isMain="false" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mt-2 w-full">
        <button
          type="button"
          @click="$store.commit('changeModal', '')"
          class="w-full ml-auto transition-all duration-100 inline-flex justify-center rounded-md shadow-sm px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import ModalViewCard from "../ModalViewCard";
import { formatDistance, format } from "date-fns";

export default {
  props: ["modalDelay"],
  components: {
    ModalViewCard,
  },
  data() {
    return {
      creatingDeck: false,
      buttons: ["Cards", "Comments", "Reviews", "Extras"],
      selectedButton: "Cards",
    };
  },
  methods: {
    dateFormater(cardDate) {
      cardDate = Date.parse(cardDate);
      if (cardDate) {
        cardDate = format(cardDate, "MM/dd/yyyy");
        cardDate = cardDate
          .split(" ")
          .filter((val) => val != "about")
          .join(" ");
        return cardDate;
      }
      return "";
    },
  },
  watch: {},
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