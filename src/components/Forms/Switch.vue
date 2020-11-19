<template>
  <div @click="flipSwitch" :class="calculatedClass" class="relative rounded-full cursor-pointer transition-all duration-200 w-10 h-5 flex items-center">
      <div class="bg-white rounded-full w-4 h-4 transition-all duration-200 absolute" style="top: 50%; transform: translateY(-50%)" :style="{left: value ? '50%' : '5%'}">

      </div>
  </div>
</template>

<script>
export default {
    name: 'VSwitch',
    props: ['value'],
    data() {
        return {
        }
    }, 
    methods: {
        flipSwitch() {
            this.$emit('input', !this.value)
        }
    },
    computed: {
        calculatedClass() {
            let calcArr = []
            calcArr.push(this.value ? ['bg-brand-blue-500', 'hover:bg-brand-blue-600'] : ['hover:bg-gray-500','bg-gray-400'])
            return calcArr
        }
    }
}
</script>

<style>
</style>