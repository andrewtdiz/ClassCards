<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative"
      style="width: 450px; height: 250px"
    >
      <p class="font-medium uppercase p-5">Leave Deck</p>
      <div class="bg-gray-200 w-full" style="min-height: 1px"></div>
      <p class="px-5 py-8">Are you sure you want to leave this deck?</p>
      <div class="bg-gray-200 w-full" style="min-height: 1px"></div>
      <div class="w-full p-4 items-center flex justify-end">
        <DefaultButton
          :type="'default'"
          @clicked="$store.commit('changeModal', '')"
          :label="'Cancel'"
          class="mr-4"
        />
        <DefaultButton
          :type="'brand'"
          @clicked="leaveDeck"
          :label="'Leave Deck'"
        />
      </div>
      <div class="flex-1 flex p-1 rounded-b bg-gray-200">
        <p class="text-xs font-light text-black ml-2">
          Note that none of your reviews will be lost if you decide to come
          back.
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import DefaultButton from "../Buttons/DefaultButton";

export default {
  props: ["modalDelay"],
  components: {
    DefaultButton,
  },
  computed: {
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
  },
  data() {
    return {
      flipCol: false,
    };
  },
  methods: {
    doThing(thing) {
      console.log(thing);
    },
    leaveDeck() {
      this.$store
        .dispatch("editUserDeckIds", {
          deckId: this.currentDeck.id,
          operation: -1,
        })
        .then(() => {
          this.$store.commit("changeModal", "");
        });
    },
  },
};
</script>

<style>
</style>