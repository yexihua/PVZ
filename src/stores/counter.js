import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const bgm = ref(false)
  function bgmChange() {
    bgm.value=!bgm.value
  }

  return { bgm,bgmChange }
})
