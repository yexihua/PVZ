import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const bgm = ref(false)
  function bgmChange() {
    bgm.value=!bgm.value
  }
  function setBgm(e){
    bgm.value=e
  }
  return { bgm,bgmChange,setBgm }
})
