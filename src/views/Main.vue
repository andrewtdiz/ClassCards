<template>
  <div class="flex w-screen h-screen">
    <ModalViewer />
    <div class="min-w-56 bg-gray-100 flex flex-col">
      <div class="media flex items-center hover:bg-gray-200 cursor-pointer p-2">
        <div class="media-left">
          <figure class="image is-32x32">
            <img
              src="https://bulma.io/images/placeholders/64x64.png"
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div class="media-content flex items-center h-full">
          <p v-if="Object.keys(currentUser).length > 0" class="title is-6">
            {{ currentUser.name }}
          </p>
          <b-skeleton v-else width="60%"></b-skeleton>
        </div>
      </div>

      <div class="px-2 flex flex-col mt-2">
        <div class="flex flex-col" v-if="loaded">
          <SidebarButton
            v-for="(route, ind3) in Object.keys(routes)"
            :key="ind3"
            :label="route"
            @sidebarbuttonclicked="goToConsole"
          />
        </div>
        <div class="flex flex-col" v-else>
          <div
            class="mt-2"
            v-for="(route, ind3) in Object.keys(routes)"
            :key="ind3"
          >
            <b-skeleton width="60%"></b-skeleton>
          </div>
        </div>
      </div>

      <div class="px-2 flex flex-col mt-4" v-if="decks.length !== 0">
        <p class="uppercase text-xs font-medium text-gray-900">Decks</p>
        <div
          class="w-full rounded mt-2"
          v-for="(deck, ind) in userDecks"
          :key="ind"
        >
          <SidebarButton
            :label="deck.name"
            @sidebarbuttonclicked="
              $store.dispatch('changeDeck', { id: deck.id })
            "
          />
        </div>
      </div>
      <div v-else class="px-2 flex flex-col mt-4">
        <p class="label">Decks</p>
        <div v-for="(val, ind2) in [0, 1, 2, 3, 4]" :key="ind2 + 150">
          <b-skeleton width="60%"></b-skeleton>
        </div>
      </div>

      <div
        class="flex mt-2 rounded transition-all hover:text-gray-900 text-gray-600 duration-100"
      >
        <button
          @click="$store.commit('changeModal', 'createDeck')"
          class="py-1 pl-2 pr-2 rounded text-xs font-medium"
        >
          + Create New Deck
        </button>
      </div>
    </div>
    <div class="bg-white flex-1 pt-20 px-20 flex flex-col">
      <div
        class="w-full flex items-center justify-between"
        style="min-width: 800px"
      >
        <h1 class="text-4xl text-gray-900 font-bold">{{ currentDeck.name }}</h1>
        <div class="flex">
          <DefaultButton
            :type="'brand'"
            :label="'Study'"
            @clicked="addUser"
            class="mr-4"
          />
          <DefaultButton
            :type="'default'"
            :label="'+ Add Card'"
            @clicked="addCard"
            class="mr-4"
          />
          <button
            @click="dropDown = !dropDown"
            :class="
              dropDown ? 'bg-gray-200' : ['hover:bg-gray-100', 'bg-gray-100']
            "
            class="w-full relative font-bold ml-auto shadow-sm transition-all duration-100 inline-flex justify-center rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            ⋮
            <transition name="fade-in">
              <div
                v-if="dropDown"
                v-on-clickaway="clickAwayDrop"
                class="flex flex-col py-2 w-56 bg-white rounded shadow-outline absolute right-0"
                style="top: 110%"
              >
                <div
                  v-for="(thing, ind) in [
                    {
                        image: 'fas fa-user-plus',
                        name: 'Invite People',
                        modal: 'addUser',
                    },
                    {
                        image: 'fas fa-cog',
                        name: 'Settings',
                    },
                    {
                        image: 'fas fa-sign-out-alt',
                        name: 'Leave Deck',
                        modal: 'leaveDeck'
                    },
                  ]"
                  :key="ind"
                  class="py-1 flex items-center hover:bg-gray-100"
                  @click="updateModal(thing.modal)"
                >
                  <div
                    class="w-12 flex items-center justify-center h-full"
                  >
                    <i :class="thing.image"></i>
                  </div>
                  <p class="font-normal text-base text-gray-800">{{ thing.name }}</p>
                </div>
              </div>
            </transition>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarButton from "../components/Sidebar/SidebarButton";
import DefaultButton from "../components/Buttons/DefaultButton";
import ModalViewer from "../components/ModalViewer";
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  components: {
    SidebarButton,
    ModalViewer,
    DefaultButton,
  },
  data() {
    return {
      routes: {
        Home: "/home",
        Browse: "/browse",
        Study: "/study",
      },
      loaded: false,
      dropDown: false,
    };
  },
  methods: {
    updateModal(thing) {
      console.log('here i am', thing)
      this.$store.commit('changeModal', thing)
    },
    addCard(thing) {
      this.$store.commit('changeModal', 'addCard')
    },
    goToConsole() {},
    addUser() {
      console.log("here ia m");
    },
    clickAwayDrop() {
      if (this.dropDown) this.dropDown = false;
    },
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch("changeUser", { id: "5fb1e4bbd8836c44408e2128" });
      this.$store.dispatch("getDecks");
      this.loaded = true;
    }, 1000);
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
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
    hands() {
      return this.$store.getters.getHands;
    },
    viewingHand() {
      return this.$store.getters.getViewingHand;
    },
    userDecks() {
      let userDecks = [];
      for (let i = 0; i < this.decks.length; i++) {
        if (this.currentUser.deckIds.includes(this.decks[i].id)) {
          userDecks.push(this.decks[i]);
        }
      }
      return userDecks;
    },
  },
};
</script>

<style>
.fade-in-enter-active {
  transition: opacity 0.5s;
  transition: transform 0.2s;
}
.fade-in-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-10px);
}
</style>