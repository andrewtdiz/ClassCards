<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative p-5"
      style="width: 650px; min-height: 280px"
    >
      <p class="uppercase text-xs">Content</p>
      <div class="relative w-full">
        <textarea
          type="text"
          id="text"
          class="text-3xl w-full border-gray-200 hover:border-gray-400 focus:border-blue-500 flex-1 border rounded px-2 py-1"
          ref="card"
          :input="cardContentDisplay"
          @input="cardContent = $event.target.value"
        />
        <h1
          class="text-3xl pointer-events-none text-transparent mx-2 my-1 absolute top-0 left-0"
          v-html="cardContent"
        ></h1>
      </div>

      <p class="uppercase text-xs mt-2">Tags</p>
      <input
        type="text"
        class="text-base border-gray-200 hover:border-gray-400 focus:border-blue-500 border rounded px-2 py-1"
      />
      <div class="flex w-full justify-end mt-4">
        <DefaultButton
          :type="'default-2'"
          @clicked="addCloze"
          :label="'Cloze'"
          class="mr-4"
        />
        <DefaultButton
          :type="'default-2'"
          @clicked="$store.commit('changeModal', '')"
          :label="'Cancel'"
          class="mr-4"
        />
        <DefaultButton :type="'brand'" :label="'Add Card'" />
      </div>
    </div>
  </transition>
</template>

<script>
import DefaultButton from "../Buttons/DefaultButton";

export default {
  props: ["modalDelay"],
  components: {
    DefaultButton,
  },
  data() {
    return {
      flipCol: false,
      cardContent: '',
      cardContentDisplay: '',
    }
  },
  computed: {
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
    
  },
  watch: {
    modalDelay() {
      if (this.modalDelay) {
        setTimeout(() => {
          this.$refs["card"].focus();
        }, 100);
      }
    },
  },
  methods: {
    doThing(thing) {
      if(thing.data==null) return 
      this.cardContent += thing.data
    },
    addCloze() {
      let text = document.getElementById("text");
      console.log(text)
      let ind = text.selectionStart
      console.log(ind)
      console.log('here ia m', this.cardContent, this.cardContent.indexOf('<span')==-1)
      this.cardContent = this.cardContent.slice(0,ind) + '<span class="text-white bg-blue-500" style="padding: 1px">' + this.cardContent.slice(ind,text.selectionEnd) + '</span>'
      this.cardContentDisplay = this.cardContent.replace('<span class="text-white bg-blue-500">','')
      this.cardContentDisplay = this.cardContentDisplay.replace('</span>','')
    },
  },
};
</script>

<style>
</style>