import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {

  const initialSun = ref(50);//阳光数目
  const plant = reactive({//植物
    Peashooter: {
      name: "豌豆射手",
      inBurial:false,//是否在冷却中
      burial: 7500,//冷却
      kind:"fight",//种类
      consume: 100,//消耗阳光
      aggressivity: 20,//攻击力
      Blood: 50,//血量
      have: true,//是否拥有
      choose: false,//是否被选中
      interval: 1400,//攻击间隔
      path: "plantCard/Peashooter.png",//当前卡片路径
      defaultPath:"plantCard/Peashooter.png",//默认卡片路径
      choosePath: "plantCard/PeashooterG.png",//选中状态下的卡片路径
      plantPath: 'plant/Peashooter/Peashooter.gif',
      time:0,//生成物计时
      productPath:"product/PB00.gif",//生成物路径
      productWidth:56,//生成物宽度
      productHeigth:34,//生成物高度
    },
    SunFlower: {
      name: "向日葵",
      kind:"produce",
      inBurial:false,//是否在冷却中
      consume: 50,//消耗阳光
      aggressivity: 0,//攻击力
      have: true,
      Blood: 300,
      choose: false,//是否被选中
      burial: 7500,//冷却
      interval: 24000,//攻击间隔
      plantPath: 'plant/SunFlower/SunFlower.gif',
      path: "plantCard/SunFlower.png",
      defaultPath:"plantCard/SunFlower.png",//默认卡片路径
      choosePath: "plantCard/SunFlowerG.png",//选中状态下的卡片路径
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
      path: 'corpse/Zombie/Zombie.gif',
      standPath:'corpse/Zombie/Zombie.gif',
      fightPath:'corpse/Zombie/ZombieAttack.gif',
      diePath:'corpse/Zombie/ZombieDie.gif',
      fight:10,//攻击力，单位为0.1s
      blood:200,//血量
      ornaments:0,//饰品血量
    },
    ConeheadZombie: {
      id: 2,
      name: '路障僵尸',
      path: 'corpse/ConeheadZombie/ConeheadZombie.gif',
      standPath:'corpse/ConeheadZombie/ConeheadZombie.gif',
      fightPath:'corpse/ConeheadZombie/ConeheadZombieAttack.gif',
      diePath:'corpse/Zombie/ZombieDie.gif',
      fight:10,//攻击力，单位为0.1s
      blood:200,//血量
      ornaments:370,//饰品血量



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
