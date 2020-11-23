<template>
  <div
    class="h-full w-full relative fast-transition rounded-md bg-gray-100 transition-all duration-300 cursor-pointer flex flex-col items-stretch"
    :class="hovering ? 'bg-opacity-50' : 'bg-opacity-50'"
    @mouseleave="hovering = false"
    @mouseenter="hovering = true"
  >
    <div class="bg-blue-500 w-full h-48 rounded-t-md default overflow-hidden">
      <img
        src="https://cdn.technologynetworks.com/tn/images/thumbs/jpeg/640_360/annual-conference-on-biochemistry_960.jpg"
        class="object-cover transition-default h-full"
        :style="{ transform: 'scale(' + (hovering ? 1.03 : 1) + ')' }"
      />
    </div>
    <div
      class="flex flex-1 flex-col transition-default pt-2 mx-4 mb-1 mt-1"
      :style="{transform: 'translateY(' + (hovering ? '-3px' : '0px') +')'}"
    >
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="bold"
          enable-background="new 0 0 24 24"
          viewBox="0 0 24 24"
          class="h-5 w-5 fill-current text-brand-blue-500"
        >
          <path
            d="m12 0c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12zm6.082 9.457-6.5 6.5c-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-3.25-3.25c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l2.543 2.543 5.793-5.793c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414z"
          />
        </svg>
        <h1 class="ml-1 font-bold">{{ deck.name }}</h1>
      </div>
      <h1 class="text-xs mb-3 font-normal text-gray-800">
        {{ deck.deckDescription }}
      </h1>
      <div class="mt-auto flex justify-between w-full">
        <p class="text-xs">120 Users</p>
        <p class="text-xs">500 Cards</p>
        <p class="text-xs">1,230 Comments</p>
      </div>
      <DefaultButton @clicked="hereIAm" v-if="!includesDeck" :type="'brand'" :label="'Join'" class="mx-auto" />
      <div v-else
        class="border bg-transparent rounded-md text-sm text-center text-brand-blue-500 mx-auto px-4 py-2 border-brand-blue-500"
      >
        Joined
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from "../components/Buttons/DefaultButton";

export default {
  props: ["deck"],
  components: {
    DefaultButton,
  },
  data() {
    return {
      hovering: false,
    };
  },
  methods: {
      hereIAm() {
          console.log('here ia m')
          this.$store.dispatch('editUserDeckIds', {deckId: this.deck.id, operation: 1}).then(() =>{
              console.log('done')
          })
      }
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    includesDeck() {
        return this.currentUser.deckIds.includes(this.deck.id)
    },
  },
};
</script>

<style>
.fast-transition {
  position: relative; /* For positioning the pseudo-element */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.fast-transition::before {
  /* Position the pseudo-element. */
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  /* Create the box shadow at expanded size. */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Hidden by default. */
  opacity: 0;
  transition: opacity 500ms;
}

.fast-transition:hover::before {
  /* Show the pseudo-element on hover. */
  opacity: 1;
}
</style>