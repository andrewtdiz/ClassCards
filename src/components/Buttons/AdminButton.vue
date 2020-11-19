<template>
  <div class="flex ml-4">
    <button
      v-if="deck.adminIds.includes(currentUser.id)"
      class="button is-success ml-6"
      :class="sending ? 'is-loading' : ''"
      @click="editAdmin(-1)"
    >
      Is Admin
    </button>
    <button
      v-else
      class="button is-danger ml-6"
      :class="sending ? 'is-loading' : ''"
      @click="editAdmin(1)"
    >
      Not Admin
    </button>
  </div>
</template>

<script>
import graphQL from "../../util/graphql";

export default {
  props: ["deck"],
  data() {
    return {
      sending: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
  },
  methods: {
    editAdmin(operation) {
      this.sending = true
      this.$store.dispatch('editAdminDeck', {operation, deckId: this.deck.id}).then(() => {
        this.sending = false
      })
    },
  },
};
</script>

<style>
</style>