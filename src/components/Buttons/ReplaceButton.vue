<template>
  <button @click="editHandThumb(card.id)" :class="sending ? 'is-loading' : ''" class="button is-info is-small ml-auto">Replace</button>
</template>

<script>
export default {
    props: ["card"],
    data() {
        return {
            sending: false,
        }
    },
    methods: {
        editHandThumb(id) {
            this.sending = true
            this.$store.dispatch('editHandThumb', id).then(() => {
                this.sending = false
            })
        },
    }
}
</script>

<style>

</style>