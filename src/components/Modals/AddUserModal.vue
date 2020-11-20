<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative p-5"
      style="width: 500px"
    >
      <p class="font-medium uppercase text-sm">
        Invite people to {{ currentDeck.name }}
      </p>
      <div class="flex mt-3 items-center">
        <div class="flex-1">
          <input
            class="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
            type="text"
            placeholder="Add friends or enter email address"
          />
        </div>
        <div class="w-6 h-6 ml-3" style="top: 30%">
          <i
            class="fas fa-plus-circle text-blue-500 cursor-pointer hover:text-blue-600 text-xl"
          ></i>
        </div>
      </div>
      <div class="bg-gray-300 w-full mt-5" style="height: 1px"></div>
      <div class="flex flex-col overflow-y-scroll" style="height: 200px"></div>
      <p class="font-medium uppercase text-sm">Or use a link</p>
      <div @click="flipCol = !flipCol" :class="flipCol ? 'border-blue-500' : 'border-gray-300'" class="mt-2 relative p-3 rounded border flex transition-all duration-200 bg-gray-100">
        <input onClick="this.select();" class="bg-transparent flex-1" value="https://class.cards/knT58aRf" />
        <DefaultButton
            :type="'brand'"
            :label="'Copy'"
            class="absolute right-0 px-5" style="top: 50%; margin-right: 0.4rem; transform: translateY(-50%)"
          />
      </div>
    </div>
  </transition>
</template>

<script>
import DefaultButton from '../Buttons/DefaultButton'

export default {
  props: ["modalDelay"],
  components: {
      DefaultButton
  },
  computed: {
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
  },
  data() {
      return {
          flipCol: false
      }
  },
  methods: {
      doThing(thing) {
          console.log(thing)
      }
  }
};
</script>

<style>
</style>