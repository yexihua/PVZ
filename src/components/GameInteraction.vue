<template>
    <div>
        <div class="left-card">
            <div class="card" v-for="i in usestore.gameCard" :key="i.name"
                :style="{ backgroundImage: `url(${getImageUrl(i.path)})` }" @click="createPlant(i.plantPath, i.name)">
                {{ i.consume }}
            </div>
            <!-- <img src="../assets/plant/Peashooter/Peashooter.gif" alt=""> -->
            <div v-show="interaction.illusion.have" class="illusion"
                :style="{ backgroundImage: `url(${getImageUrl(interaction.illusion.path)})`, left: interaction.illusion.x + 'px', top: interaction.illusion.y + 'px' }">
            </div>
        </div>
        <div class="Sun">{{ usestore.initialSun }}</div>
        <div v-show="interaction.plant[0] != null" class="planting" v-for="i in interaction.plant" :key="i.identifier"
            :style="{ backgroundImage: `url(${getImageUrl(i.plantPath)})`, left: 150 + (85 * i.x) - i.x * 5 + 'px', top: 70 + (100 * i.y) + 'px' }">
            <div v-show="i.product[0]" class="product" v-for="k in i.product" :key="k.identifier"
                @click="i.kind == 'produce' && sunAdd(k.identifier)"
                :style="{ background: `url(${getImageUrl(i.productPath)})`, width: i.productWidth + 'px', height: i.productHeigth + 'px', left: k.x + 'px', top: k.y + 'px', }">
            </div>
        </div>
        <div class="grass">
            <!-- 生成僵尸 -->
            <template v-if="interaction.corpse.entrance[0]">
                <div class="corpse" v-for="i in interaction.corpse.entrance" :key="i.identifier"
                    :style="{ left: i.x + 'px', top: i.y + 'px', background: `url(${getImageUrl(i.standPath)})` }"></div>
            </template>
        </div>
        <!-- 关卡失败提示语 -->
        <div @click="gameback" class="fail" v-if="interaction.success == false"></div>

    </div>
</template>
<script setup>
import { useStore } from "../stores/counter"
import { reactive } from "vue";
import * as _ from 'lodash'
import { onBeforeRouteLeave } from "vue-router";
const usestore = useStore()

const interaction = reactive({
    illusion: {//选中植物的虚影
        name: null,
        path: null,
        have: false,
        x: null,
        y: null
    },
    plant: [],//要种植的植物
    corpse: {//僵尸
        entrance: [],//要生成的僵尸
        entranceNumber: 1,//要生成的僵尸数
        wave: 1,//第几波僵尸
    },
    success: null

})
const sunAdd = (e) => {//阳光拾取
    for (let i in interaction.plant) {
        for (let k in interaction.plant[i].product) {
            if (interaction.plant[i].product[k].identifier == e) {
                interaction.plant[i].product.splice(k, 1)
            }
        }
    }
    usestore.sunChange(25)
}

// 获取随机数整数
const getNumber = (m, n) => {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
// 关卡失败返回主界面
const gameback = () => {
    router.push("/")
}
// 僵尸生成定时器
const corpseGo = setInterval(() => {
    interaction.corpse.entranceNumber = Math.ceil(interaction.corpse.wave / 2)
    interaction.corpse.wave += 1
    for (let i = 0; i < interaction.corpse.entranceNumber; i++) {
        let random = getNumber(2, 1)
        for (let i in usestore.corpse) {
            if (usestore.corpse[i].id == random) {
                interaction.corpse.entrance.push(JSON.parse(JSON.stringify({ x: 850, y: getNumber(4, 0) * 100 + 10, identifier: _.uniqueId(), ...usestore.corpse[i] })))
            }
        }
    }
}, 20000)
const Main = setInterval(() => {//游戏运行函数
    if (interaction.corpse.entrance[0]) {
        for (let i in interaction.corpse.entrance) {
            interaction.corpse.entrance[i].x -= 1.5
            if (interaction.corpse.entrance[i].x <= -50) {
                interaction.success = false
                clearInterval(Main)
            }
        }
    }
    if (interaction.plant[0] != null) {
        for (let i in interaction.plant) {
            interaction.plant[i].time += 100
            if (interaction.plant[i].time >= interaction.plant[i].interval) {
                interaction.plant[i].time = 0
                interaction.plant[i].product.push({ x: 0, y: 30, identifier: _.uniqueId("product_"), })
            }
            if (interaction.plant[i].kind == "produce" && interaction.plant[i].product[0] != null) {
                for (let k in interaction.plant[i].product) {
                    let sunDisable = setTimeout(() => {
                        interaction.plant[i].product.splice(k, 1)
                        clearTimeout(sunDisable)
                    }, 3000)
                }
            }
            else if (interaction.plant[i].kind == "fight" && interaction.plant[i].product[0] != null) {
                for (let k in interaction.plant[i].product) {
                    interaction.plant[i].product[k].x += 50
                    if (interaction.plant[i].product[k].x >= 900 - (150 + (85 * interaction.plant[i].x) - interaction.plant[i].x * 5)) {
                        interaction.plant[i].product.splice(k, 1)
                    }
                }
            }
        }
    }
}, 100)
const getImageUrl = (path) => {
    return new URL(`../assets/${path}`, import.meta.url).href
}
const createPlant = (a, b) => {
    interaction.illusion.path = a
    interaction.illusion.have = true
    interaction.illusion.name = b
    // console.log(1);
    document.addEventListener('mousemove', function (e) {
        //鼠标只要移动,就会触发事件
        interaction.illusion.x = e.pageX;
        interaction.illusion.y = e.pageY;

    })
    document.addEventListener('mousedown', function (e) {
        if (interaction.illusion.have) {
            if (e.button == 2) {
                interaction.illusion.have = false
            } else if (e.button == 0 && 150 < e.pageX && e.pageX < 900 && e.pageY > 70 && e.pageY < 600) {
                let horizontal = Math.floor((e.pageX - 150) / 85)
                let perpendicular = Math.floor((e.pageY - 70) / 100)
                for (let i in interaction.plant) {
                    if (interaction.plant[i].x == horizontal && interaction.plant[i].y == perpendicular) {
                        return
                    }
                }
                for (let i in usestore.has) {
                    if (usestore.has[i].name == interaction.illusion.name) {
                        interaction.plant.push(JSON.parse(JSON.stringify({ identifier: _.uniqueId("plant_"), x: horizontal, y: perpendicular, ...usestore.has[i] })))
                    }
                }
                interaction.illusion.have = false
            }
        }

    })
}
onBeforeRouteLeave((to, from) => {
    clearInterval(Main, corpseGo)
})
</script>
<style scoped>
.left-card {
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column
}

.Sun {
    position: absolute;
    width: 125px;
    height: 35px;
    left: 110px;
    top: 0px;
    font-size: 20px;
    font-weight: 700;
    background: url('../assets/bgc/SunBack.png') no-repeat;
    text-align: center;
    box-sizing: border-box;
    padding-top: 5px;
    padding-left: 10px;
}

.card {
    width: 100px;
    height: 60px;
    box-sizing: border-box;
    padding-left: 60px;
    padding-top: 40px;
    z-index: 6;
}

.illusion {
    position: absolute;
    opacity: 0.5;
    width: 100px;
    height: 100px;
    background: no-repeat;
    transform: translate(-30%, -50%);
}

.planting {
    position: absolute;
    width: 84px;
    height: 100px;
    background: no-repeat 100% 100%;
    z-index: 4;

}

.product {
    position: absolute;
    z-index: 999;
    transition: all 0.1s;
}

.grass {
    position: absolute;
    top: 0px;
    width: 900px;
    height: 600px;
    overflow: hidden;
}

.corpse {
    position: absolute;
    width: 166px;
    height: 144px;
}

.fail {
    background: url("../assets/bgc/ZombiesWon.png") no-repeat center center;
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
}
</style>