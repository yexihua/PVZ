import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {

  const initialSun = ref(50);//阳光数目
  const plant = reactive({//植物
    Peashooter: {
      name: "豌豆射手",
      burial: 7500,//冷却
      consume: 100,//消耗阳光
      aggressivity: 10,//攻击力
      Blood: 50,//血量
      have: true,//是否拥有
      choose: false,//是否被选中
      interval: 1400,//攻击间隔
      path: "plantCard/Peashooter.png",//卡片路径
      choosePath: "plantCard/PeashooterG.png",//选中状态下的卡片路径

    },
    SunFlower: {
      name: "向日葵",
      consume: 50,//消耗阳光
      aggressivity: 0,//攻击力
      have: true,
      Blood: 300,
      choose: false,//是否被选中
      burial: 7500,//冷却
      interval: 24000,//生产间隔

      path: "plantCard/SunFlower.png",
      choosePath: "plantCard/SunFlowerG.png",//选中状态下的卡片路径

    },
    WallNut: {
      name: "坚果墙",
      consume: 50,//消耗阳光
      aggressivity: 0,//攻击力
      have: true,
      choose: false,//是否被选中
      burial: 3000,//冷却
      Blood: 4000,
      path: "plantCard/WallNut.png",
      choosePath: "plantCard/WallNutG.png",//选中状态下的卡片路径

    },
    CherryBomb: {
      name: "樱桃炸弹",
      consume: 150,//消耗阳光
      aggressivity: 1800,//攻击力
      have: false,
      choose: false,//是否被选中
      Blood: 300,
      burial: 5000,//冷却
      path: "plantCard/CherryBomb.png",
      choosePath: "plantCard/CherryBombG.png",//选中状态下的卡片路径

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
  const plantReserved=plant

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
  return { has, chooseChange, start, gameCard, initialSun, sunChange, corpse,plantReserved }
})
