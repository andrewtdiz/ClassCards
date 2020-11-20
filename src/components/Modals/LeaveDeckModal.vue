<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative"
      style="width: 450px; height: 250px"
    >
      <p class="font-medium uppercase p-5">Leave Deck</p>
      <p class="p-2 px-5">Are you sure you want to leave this deck?</p>
      <p class="text-xs pb-6 px-5 font-light text-black">
          Note: Your review history will be saved for 90 days.
        </p>
      <div class="bg-gray-200 w-full" style="min-height: 1px"></div>
      <div class="w-full p-4 items-center flex-1 flex justify-end">
        <DefaultButton
          :type="'default-2'"
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