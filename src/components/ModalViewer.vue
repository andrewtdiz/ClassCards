<template>
  <transition name="fade">
    <div
      v-if="viewingModal !== ''"
      class="absolute z-10 w-screen h-screen flex flex-col items-center duration-100 transition-all justify-center"
    >
      <CreateDeckModal v-if="viewingModal == 'createDeck'" :modalDelay="modalDelay" />
      <AddUserModal v-if="viewingModal == 'addUser'"  :modalDelay="modalDelay" />
      <AddCardModal v-if="viewingModal == 'addCard'" :modalDelay="modalDelay" />
      <LeaveDeckModal v-if="viewingModal == 'leaveDeck'" :modalDelay="modalDelay" />
      <div
        @click="$store.commit('changeModal', '')"
        class="absolute w-full h-full bg-black bg-opacity-50 blur"
      ></div>
    </div>
  </transition>
</template>

<script>
import CreateDeckModal from './Modals/CreateDeckModal'
import AddUserModal from './Modals/AddUserModal'
import AddCardModal from './Modals/AddCardModal'
import LeaveDeckModal from './Modals/LeaveDeckModal'

export default {
    components: {
        CreateDeckModal,
        AddUserModal,
        AddCardModal,
        LeaveDeckModal
    },
  watch: {
    viewingModal() {
      if (this.viewingModal == "") {
        this.modalDelay = false;
      } else {
        setTimeout(() => {
          this.modalDelay = true;
        }, 100);
      }
    },
  },
  data() {
    return {
        modalDelay: false
    };
  },
  computed: {
    viewingModal() {
      return this.$store.getters.getViewingModal;
    },
  },
  methods: {
  },
};
</script>

<style>
.blur {
  background: rgba(15, 15, 15, 0.6);
}

input::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgb(170, 170, 170);
}
textarea,
input {
  outline: none;
}

.duration-100 {
  transition: opacity 100ms;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>