<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-gray-100 z-20 rounded flex flex-col relative p-5"
      style="width: 650px"
    >
      <transition name="fade">
        <div
          v-if="creatingDeck"
          class="w-full top-0 left-0 h-full z-20 absolute"
        >
          <div class="absolute w-full h-full bg-gray-200 opacity-50"></div>
          <div
            class="absolute"
            style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
          >
            <div class="loader-2"></div>
          </div>
        </div>
      </transition>

      <input
        placeholder="Deck Name"
        v-model="deckName"
        class="hover:border-gray-30 focus:bg-white bg-transparent px-2 transition-all duration-200 focus:border-brand-blue-500 rounded border-transparent border text-4xl appearance-none font-bold text-gray-800"
      />
      <input
        placeholder="Description..."
        v-model="deckDescription"
        class="hover:border-gray-30 focus:bg-white bg-transparent px-2 transition-all duration-200 focus:border-brand-blue-500 rounded border-transparent border appearance-none text-gray-800"
      />
      <div class="flex flex-col ml-4">
        <h1 class="font-medium text-xs mt-6 uppercase text-gray-600">
          Who can access this deck?
        </h1>
        <div class="flex items-center my-3 justify-between">
          <h1 class="font-medium text-black is-danger" type="is-danger">
            Everyone
          </h1>
          <VSwitch v-model="everyone" />
        </div>
        <div class="bg-gray-200 my-2" style="height: 1px"></div>
        <div class="flex items-center my-3 justify-between">
          <h1 class="font-medium text-black is-danger" type="is-danger">
            Invite only
          </h1>
          <VSwitch v-model="inviteOnly" />
        </div>
        <div class="bg-gray-200" style="height: 1px"></div>
        <div class="my-5"></div>
        <div class="flex items-start my-3 justify-between">
          <div class="flex flex-col pr-12">
            <h1 class="font-medium text-black">
              Allow all users to edit the deck
            </h1>
            <h1 class="text-sm">
              This setting allows users to collaborate on developing all deck
              content
            </h1>
          </div>
          <VSwitch v-model="usersEdit" />
        </div>
        <div class="bg-gray-200 my-2" style="height: 1px"></div>
        <div class="flex items-center my-3 justify-between">
          <div class="flex flex-col w-4/5">
            <h1 class="font-medium text-black" type="is-danger">
              Anonymous posting
            </h1>
            <h1 class="text-sm">
              This setting allows users post comments anonymously. Note that
              comments must not break our
              <a class="hover:underline">Terms of Service</a>
            </h1>
          </div>
          <VSwitch v-model="anonymousPosting" />
        </div>
      </div>
      <div class="flex items-center mt-4 w-full">
        <button
          type="button"
          @click="$store.commit('changeModal', '')"
          class="w-full ml-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="addDeck"
          class="w-full relative inline-flex justify-center rounded-md border border-brand-blue-500 shadow-sm px-4 py-2 bg-brand-blue-500 text-base font-medium text-white hover:bg-brand-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          <p :class="creatingDeck ? 'opacity-0' : ''">Create Deck</p>
          <div
            :class="!creatingDeck ? 'opacity-0' : ''"
            class="absolute"
            style="top: 50%; transform: translateY(-50%)"
          >
            <div class="loader"></div>
          </div>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import VSwitch from "../Forms/Switch";

export default {
  props: ["modalDelay"],
  components: {
    VSwitch,
  },
  data() {
    return {
      everyone: true,
      inviteOnly: false,
      usersEdit: true,
      anonymousPosting: true,
      deckName: "",
      deckDescription: "",
      creatingDeck: false,
    };
  },
  watch: {
    inviteOnly() {
      if (this.inviteOnly) this.everyone = false;
      else this.everyone = true;
    },
    everyone() {
      if (this.everyone) this.inviteOnly = false;
      else this.inviteOnly = true;
    },
  },
  methods: {
    async addDeck() {
      this.creatingDeck = true;
      if(this.deckName =="") return
      this.$store
        .dispatch("addDeck", {
          deckName: this.deckName,
          deckDescription: this.deckDescription,
          everyone: this.everyone,
          inviteOnly: this.inviteOnly,
          usersEdit: this.usersEdit,
          anonymousPosting: this.anonymousPosting,
        })
        .then(() => {
          console.log("deck added");
          this.creatingDeck = false;
          this.$store.commit("changeModal", "");
        });
    },
  },
};
</script>

<style>
.size-up-enter-active {
  transition: transform 0.15s;
}

.size-up-enter /* .fade-leave-active below version 2.1.8 */ {
  transform: scale(0.97);
}
.loader {
  border: 16px solid #ffffff; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

.loader-2 {
  border: 8px solid #ffffff; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>