<template>
  <div class="flex ml-4">
    <button
      v-if="currentUser.deckIds.includes(deck.id)"
      class="button is-danger ml-6" :class="sending ? 'is-loading' : ''"
      @click="editUserDeckIds(-1)"
    >
      Leave
    </button>
    <button 
        v-else
        class="button is-success ml-6" :class="sending ? 'is-loading' : ''"
        @click="editUserDeckIds(1)">
      Join
    </button>
  </div>
</template>

<script>
import { editUserDeckIds } from "../../graphql/mutations/Users";
import graphQL from "../../util/graphql";

export default {
  props: ["deck", "currentUser"],
  data() {
    return {
      sending: false,
    };
  },
  methods: {
    editUserDeckIds(operation) {
      this.sending = true
      this.$store.dispatch('editUserDeckIds', {deckId: this.deck.id, operation}).then(() => {
        this.sending = false
      })
    },
  },
};
</script>

<style>
</style>