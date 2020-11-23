<template>
  <div class="bg-white flex-1 pt-12 px-20 flex flex-col">
    <h1 class="text-4xl text-gray-900 font-bold">Browse</h1>
    <div class="flex flex-wrap items-stretch">
      <div
        v-for="(deck, ind) in decks"
        :key="ind"
        style="width: 300px; height: 360px"
        class="mr-5 "
      >
        <ViewDeck :deck="deck" />
      </div>
    </div>
  </div>
</template>

<script>
import ViewDeck from '../components/ViewDeck'

export default {
  components: {
    ViewDeck,
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    users() {
      return this.$store.getters.getUsers;
    },
    decks() {
      return this.$store.getters.getDecks;
    },
  },
};
</script>

<style>
</style>