<template>
  <div class="flex ml-4">
    <button
      v-if="
        currentUser.likedHands
          ? currentUser.likedHands.includes(hand.id)
          : false
      "
      class="button is-danger"
      :class="sending ? 'is-loading' : ''"
      @click.stop="editHandLike({handId: hand.id, operation: -1})"
    >
      dislike
    </button>
    <button
      v-else
      class="button is-info"
      :class="sending ? 'is-loading' : ''"
      @click.stop="editHandLike({handId: hand.id, operation: 1})"
    >
      like
    </button>
  </div>
</template>

<script>
import graphQL from "../../util/graphql";

export default {
  props: ["hand", "currentUser"],
  data() {
    return {
      sending: false,
    };
  },
  methods: {
    editHandLike({handId, operation}) {
      this.sending = true
      this.$store.dispatch('editHandLike', {handId, operation}).then(() => {
        this.sending = false
      })
    },
  },
};
</script>

<style>
</style>