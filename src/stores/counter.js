import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const bgm = ref(false)
  // const doubleCount = computed(() => count.value * 2)
  function bgmChange() {
    bgm.value=!bgm.value
  }

  return { bgm,bgmChange }
})
