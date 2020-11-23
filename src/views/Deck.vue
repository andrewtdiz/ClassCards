<template>
  <div
    class="bg-white flex-1 flex flex-col relative max-h-screen" 
    @mouseenter="showButton = true"
    @mouseleave="showButton = false"
  >
    <div v-if="!contentLoaded" class="w-full flex items-center justify-center">
      <div class="loader-2"></div>
    </div>
    <div v-else class="flex flex-col  bg-cool-gray-100  max-h-screen overflow-y-auto" id="style-1" ref="deck">
      <div class="flex-1"  >
        <div class="h-64 w-full"></div>
        <div class="px-20 min-h-screen w-full flex flex-col">
          <DeckTableCards />
        </div>
      </div>

      <!-- <div v-else-if="Object.keys(currentUser).length!==0 && !currentDeck.userIds.includes(currentUser.id)">
      <h1 class="text-4xl font-bold">404: Access Denied</h1>
    </div> -->
    </div>
    <div v-if="contentLoaded"
        class="absolute w-full top-0 flex flex-col border-b border-gray-200 bg-white items-start transition-default" style="right: 8px;" 
      >
        <div
          class="w-full flex px-20 transition-default items-center justify-between"
          :class="
            scrollTopBool
              ? ['pt-8', 'pb-2', 'px-20']
              : ['pt-6', 'pb-4', 'px-20']
          "
          style="min-width: 800px"
        >
          <div class="flex flex-col flex-1 items-start relative">
            <div class="absolute flex flex-grow" style="bottom: 100%">
              <button
                class="text-sm hover:bg-gray-200 text-gray-400 font-normal p-1 rounded"
                :class="!showButton ? 'hidden' : ''"
              >
                Refresh
              </button>
              <button
                @click="showDescription = !showDescription"
                class="ml-6 text-sm hover:bg-gray-200 text-gray-400 font-normal p-1 rounded"
                :class="!showButton ? 'hidden' : ''"
              >
                {{ showDescription ? "Hide" : "Show" }} Description
              </button>
            </div>
            <div class="flex items-start">
              <div
                class="bg-blue-500 mr-4 h-20 w-20 rounded-md overflow-hidden"
                @mouseenter="hovering = true"
                @mouseleave="hovering = false"
              >
                <img
                  src="https://cdn.technologynetworks.com/tn/images/thumbs/jpeg/640_360/annual-conference-on-biochemistry_960.jpg"
                  class="object-cover transform-all duration-300 ease-in-out h-full"
                  :style="{ transform: 'scale(' + (hovering ? 1.03 : 1) + ')' }"
                />
              </div>
              <div class="flex flex-col items-start">
                <h1 class="text-4xl text-gray-900 font-bold">
                  {{ currentDeck.name }}
                </h1>
                <h1 v-if="showDescription" class="text-sm text-gray-900">
                  {{ currentDeck.deckDescription }}
                </h1>
              </div>
            </div>
          </div>
          <div class="flex">
            <DefaultButton
              :type="'brand'"
              :label="'Study'"
              @clicked="addUser"
              class="mr-4"
            />
            <DefaultButton
              :type="'default-2'"
              :label="'+ Add Card'"
              @clicked="addCard"
              class="mr-4"
            />
            <button
              @click="dropDown = !dropDown"
              :class="
                dropDown ? 'bg-gray-200' : ['hover:bg-gray-100', 'bg-white']
              "
              class="w-full relative font-bold ml-auto shadow transition-all duration-100 inline-flex justify-center rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
                        modal: 'leaveDeck',
                      },
                    ]"
                    :key="ind"
                    class="py-1 flex items-center hover:bg-gray-100"
                    @click="updateModal(thing.modal)"
                  >
                    <div class="w-12 flex items-center justify-center h-full">
                      <i :class="thing.image"></i>
                    </div>
                    <p class="font-normal text-base text-gray-800">
                      {{ thing.name }}
                    </p>
                  </div>
                </div>
              </transition>
            </button>
          </div>
        </div>
        <div
          class="w-full px-20 transition-default"
          :class="!scrollTopBool ? 'h-8' : 'h-4'"
        >

        </div>
      </div>
  </div>
</template>

<script>
import SidebarButton from "../components/Sidebar/SidebarButton";
import DefaultButton from "../components/Buttons/DefaultButton";
import ModalViewer from "../components/ModalViewer";
import { mixin as clickaway } from "vue-clickaway";
import DeckTable from '../components/DeckTable'
import DeckTableCards from '../components/DeckTableCards'

export default {
  mixins: [clickaway],
  components: {
    SidebarButton,
    ModalViewer,
    DefaultButton,
    DeckTable,
    DeckTableCards
  },
  data() {
    return {
      routes: {
        Home: "/home",
        Study: "/study",
        Notifications: "notifications",
        Messages: "messages",
      },
      dropDown: false,
      showButton: false,
      showDescription: true,
      hovering: false,
      userAuthenticated: false,
      scrollTop: 0,
      scrollTracking: false,
    };
  },
  watch: {
    contentLoaded() {
      if (this.contentLoaded && !this.scrollTracking) {
        setTimeout(() => {
          this.$refs["deck"].addEventListener("scroll", this.updateScroll);
          this.scrollTracking = true
        }, 200);
      }
    },
    currentDeck() {
      if(this.contentLoaded) {
        this.$store.dispatch('getHands')
      }
    },
  },
  methods: {
    updateScroll() {
      this.scrollTop = this.$refs["deck"].scrollTop;
    },
    updateModal(thing) {
      this.$store.commit("changeModal", thing);
    },
    addCard(thing) {
      this.$store.commit("changeModal", "addCard");
    },
    addUser() {
      console.log("here ia m");
    },
    clickAwayDrop() {
      if (this.dropDown) this.dropDown = false;
    },
  },
  created() {
    if (!Object.keys(this.currentDeck).length > 0) {
      this.$store
        .dispatch("changeDeck", { id: this.$route.params.id })
        .then((res) => {});
    }
  },
  computed: {
    scrollTopBool() {
      if (this.scrollTop > 50) return true;
      return false;
    },
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
      if (this.contentLoaded && !this.scrollTracking) {
        setTimeout(() => {
          this.$refs["deck"].addEventListener("scroll", this.updateScroll);
        }, 200);
      }
      return this.$store.getters.getCurrentDeck;
    },
    hands() {
      return this.$store.getters.getHands;
    },
    contentLoaded() {
      return this.$store.getters.getContentLoaded;
    },
    viewingHand() {
      return this.$store.getters.getViewingHand;
    },
  },
};
</script>

<style>
.loader-03 {
  border: 0.2em solid currentcolor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: 1s loader-03 linear infinite;
  position: relative;
}

@keyframes loader-03 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>