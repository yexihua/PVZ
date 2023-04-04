<template>
    <div v-if="props.visable">
        <div class="left-card">
            <div class="card" v-for="i in usestore.gameCard" :key="i.name"
                :style="{ backgroundImage: `url(${getImageUrl(i.path)})` }" @click="createPlant(i.plantPath, i.name)">
                {{ i.consume }}
            </div>
            <!-- <img src="../assets/plant/Peashooter/Peashooter.gif" alt=""> -->
            <div v-show="cardStatus.illusion.have" class="illusion"
                :style="{ backgroundImage: `url(${getImageUrl(cardStatus.illusion.path)})`, left: cardStatus.illusion.x + 'px', top: cardStatus.illusion.y + 'px' }">
            </div>
        </div>
        <div class="Sun">{{ usestore.initialSun }}</div>
        <div v-show="cardStatus.plant[0] != null" class="planting" v-for="i in cardStatus.plant" :key="i.identifier"
            :style="{ backgroundImage: `url(${getImageUrl(i.plantPath)})`, left: 150 + (85 * i.x) - i.x * 5 + 'px', top: 70 + (100 * i.y) + 'px' }">
            <div v-show="i.product[0]" class="product" v-for="k in i.product" :key="k.identifier"
                @click="i.kind == 'produce' && sunAdd(k.identifier)"
                :style="{ background: `url(${getImageUrl(i.productPath)})`, width: i.productWidth + 'px', height: i.productHeigth + 'px', left: k.x + 'px', top: k.y + 'px', }">
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStore } from "../stores/counter"
import { reactive } from "vue";
import * as _ from 'lodash'
import { onBeforeRouteLeave } from "vue-router";
const usestore = useStore()
const props = defineProps({
    visable: Boolean,
});
const cardStatus = reactive({
    illusion: {//选中植物的虚影
        name: null,
        path: null,
        have: false,
        x: null,
        y: null
    },
    plant: []//要种植的植物
})
const sunAdd = (e) => {
    for (let i in cardStatus.plant) {
        for (let k in cardStatus.plant[i].product) {
            if (cardStatus.plant[i].product[k].identifier == e) {
                cardStatus.plant[i].product.splice(k, 1)
            }
        }
    }
    usestore.sunChange(25)
}
const plantMain = setInterval(() => {
    if (cardStatus.plant[0] != null) {
        for (let i in cardStatus.plant) {
            cardStatus.plant[i].time += 100
            if (cardStatus.plant[i].time >= cardStatus.plant[i].interval) {
                cardStatus.plant[i].time = 0
                cardStatus.plant[i].product.push({ x: 50, y: 30, identifier: _.uniqueId("product_"), })
            }
            if (cardStatus.plant[i].kind == "produce" && cardStatus.plant[i].product[0] != null) {
                for (let k in cardStatus.plant[i].product) {
                    let sunDisable = setTimeout(() => {
                        cardStatus.plant[i].product.splice(k,1)
                        clearTimeout(sunDisable)
                    }, 3000)
                }



            }
        }
    }
}, 100)
const getImageUrl = (path) => {
    return new URL(`../assets/${path}`, import.meta.url).href
}
const createPlant = (a, b) => {
    cardStatus.illusion.path = a
    cardStatus.illusion.have = true
    cardStatus.illusion.name = b
    // console.log(1);
    document.addEventListener('mousemove', function (e) {
        //鼠标只要移动,就会触发事件
        cardStatus.illusion.x = e.pageX;
        cardStatus.illusion.y = e.pageY;

    })
    document.addEventListener('mousedown', function (e) {
        if (cardStatus.illusion.have) {
            if (e.button == 2) {
                cardStatus.illusion.have = false
            } else if (e.button == 0 && 150 < e.pageX && e.pageX < 900 && e.pageY > 70 && e.pageY < 600) {
                let horizontal = Math.floor((e.pageX - 150) / 85)
                let perpendicular = Math.floor((e.pageY - 70) / 100)
                for (let i in cardStatus.plant) {
                    if (cardStatus.plant[i].x == horizontal && cardStatus.plant[i].y == perpendicular) {
                        return
                    }
                }
                for (let i in usestore.has) {
                    if (usestore.has[i].name == cardStatus.illusion.name) {
                        cardStatus.plant.push(JSON.parse(JSON.stringify({ identifier: _.uniqueId("plant_"), x: horizontal, y: perpendicular, ...usestore.has[i] })))
                    }
                }
                cardStatus.illusion.have = false
            }
        }

    })
}
onBeforeRouteLeave((to, from) => {
    clearInterval(plantMain)
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
}
</style>