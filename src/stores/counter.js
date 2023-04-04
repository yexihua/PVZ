import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {

  const initialSun = ref(50);//阳光数目
  const plant = reactive({//植物
    Peashooter: {
      name: "豌豆射手",
      burial: 7500,//冷却
      kind:"fight",//种类

      consume: 100,//消耗阳光
      aggressivity: 10,//攻击力
      Blood: 50,//血量
      have: true,//是否拥有
      choose: false,//是否被选中
      interval: 1400,//攻击间隔
      path: "plantCard/Peashooter.png",//卡片路径
      choosePath: "plantCard/PeashooterG.png",//选中状态下的卡片路径
      plantPath: 'plant/Peashooter/Peashooter.gif',
      product: [],//生成物
      time:0,//生成物计时
      productPath:"product/PB00.gif",//生成物路径
      productWidth:56,//生成物宽度
      productHeigth:34,//生成物高度
    },
    SunFlower: {
      name: "向日葵",
      kind:"produce",
      consume: 50,//消耗阳光
      aggressivity: 0,//攻击力
      have: true,
      Blood: 300,
      choose: false,//是否被选中
      burial: 7500,//冷却
      interval: 24000,//攻击间隔
      plantPath: 'plant/SunFlower/SunFlower.gif',
      path: "plantCard/SunFlower.png",
      choosePath: "plantCard/SunFlowerG.png",//选中状态下的卡片路径
      product: [],//生成物
      time:0,
      productPath:"product/Sun.gif",
      productWidth:78,//生成物宽度
      productHeigth:78,//生成物高度
    },
  })
  const corpse = reactive({
    normalZombie: {
      id: 1,
      name: '普通僵尸',
      standPath: 'corpse/Zombie/Zombie.gif'
    },
    ConeheadZombie: {
      id: 2,
      name: '路障僵尸',
      standPath: 'corpse/ConeheadZombie/ConeheadZombie.gif'
    },
  })

  const has = computed(() => {//已经拥有的植物
    let arr = []
    for (let i in plant) {
      if (plant[i].have) {
        arr.push(plant[i])
      }
    }
    return arr
  })
  const start = computed(() => {//至少选中一个植物开始闯关
    const allow = ref(false)
    for (let i in plant) {
      if (plant[i].choose) {
        allow.value = true
        return allow
      }
    }
    return allow.value
  })
  const gameCard = computed(() => {//选择进行闯关的植物
    const arr = []
    for (let i in plant) {
      if (plant[i].choose) {
        arr.push(plant[i])
      }
    }
    return arr
  })

  function chooseChange(e) {//选中植物取消
    for (let i in plant) {
      if (plant[i].name == e) {
        plant[i].choose = !plant[i].choose
      }
    }
  }
  function sunChange(e) {//阳光数目变更
    initialSun.value += e
  }
  function initializationPlant() {
    for (let i in plant) {
      plant[i].choose = false
    }
  }
  return { has, start, gameCard, initialSun, corpse, chooseChange, sunChange, initializationPlant }
})
