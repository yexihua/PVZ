<template>
    <div>
        <div class="left-card">
            <!-- 左侧卡片 -->
            <div class="card" v-for="(i, index) in interaction.plantCard" :key="i.name"
                :style="{ backgroundImage: `url(${getImageUrl(i.path)})` }"
                @click="!i.inBurial && createPlant(i.plantPath, i.name, i.consume, index)">
                {{ i.consume }}
            </div>
            <!-- 植物虚影 -->
            <div v-show="interaction.illusion.have" class="illusion"
                :style="{ backgroundImage: `url(${getImageUrl(interaction.illusion.path)})`, left: interaction.illusion.x + 'px', top: interaction.illusion.y + 'px' }">
            </div>
        </div>
        <!-- 阳光总数 -->
        <div class="Sun">{{ usestore.initialSun }}</div>
        <!-- 生成植物 -->
        <div v-show="interaction.plant[0] != null" class="planting" v-for="i in interaction.plant" :key="i.identifier"
            :style="{ backgroundImage: `url(${getImageUrl(i.plantPath)})`, left: 150 + (80 * i.x) + 'px', top: 70 + (100 * i.y) + 'px' }">
        </div>
        <!-- 生成植物的生成物 -->
        <div v-show="interaction.product[0]" class="product" v-for="i in interaction.product" :key="i.identifier"
            @click="i.kind == 'produce' && sunAdd(i.identifier)"
            :style="{ background: `url(${getImageUrl(i.path)})`, width: i.long + 'px', height: i.tall + 'px', left: i.x + 'px', top: i.y + 'px', }">
        </div>
        <div class="grass">
            <!-- 生成僵尸 -->
            <template v-if="interaction.corpse.entrance[0]">
                <div class="corpse" v-for="i in interaction.corpse.entrance" :key="i.identifier"
                    :style="{ left: i.x + 'px', top: i.y + 'px', background: `url(${getImageUrl(i.path)})`, width: i.long + 'px' }">
                </div>
            </template>
        </div>
        <!-- 关卡失败提示语 -->
        <div @click="gameback" class="fail" v-if="interaction.success == false"></div>
        <!-- 胜利弹窗 -->
        <a-modal v-model:visible="interaction.success" align-center hide-cancel closable ok-text="返回主菜单" @ok="gameback"
            @cancel="gameback">
            <div class="success">恭喜通关</div>
        </a-modal>
        <!--  -->
        <div class="win">胜利条件：击败{{ interaction.corpse.number }}/50只僵尸</div>
    </div>
</template>
<script setup>
import { useStore } from "../stores/counter"
import { onMounted, reactive } from "vue";
import * as _ from 'lodash'
import { onBeforeRouteLeave } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter()
const usestore = useStore()
const interaction = reactive({
    plantCard: [],//植物卡片
    illusion: {//选中植物的虚影
        consume: null,
        name: null,
        path: null,
        have: false,
        x: null,
        y: null,
        index: null,
    },
    plant: [],//要种植的植物
    product: [],//植物生成物
    corpse: {//僵尸
        entrance: [],//要生成的僵尸
        entranceNumber: 1,//要生成的僵尸数
        wave: 1,//第几波僵尸
        number: 0,//以及出现僵尸数量
        time: 0
    },
    success: null
})
var cardBalck, sunDisable
const sunAdd = (e) => {//阳光拾取
    for (let i in interaction.product) {
        if (interaction.product[i].identifier == e) {
            interaction.product.splice(i, 1)
        }
    }
    usestore.sunChange(25)
    clearTimeout(sunDisable)
}

// 获取随机数整数
const getNumber = (m, n) => {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
// 关卡失败返回主界面
const gameback = () => {
    router.push("/")
}
// 卡片点击后执行函数
const createPlant = (nowPath, has, c, index) => {
    interaction.illusion.consume = c
    interaction.illusion.path = nowPath
    interaction.illusion.have = true
    interaction.illusion.name = has
    interaction.illusion.index = index
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
                if (usestore.initialSun >= interaction.illusion.consume) {
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
                    usestore.sunChange(-interaction.illusion.consume)
                    interaction.illusion.have = false
                    let cardIndex = interaction.illusion.index
                    interaction.plantCard[cardIndex].path = interaction.plantCard[cardIndex].choosePath
                    interaction.plantCard[cardIndex].inBurial = true
                    cardBalck = setTimeout(() => {
                        interaction.plantCard[cardIndex].path = interaction.plantCard[cardIndex].defaultPath
                        interaction.plantCard[cardIndex].inBurial = false
                    }, interaction.plantCard[cardIndex].burial)
                } else {
                    interaction.illusion.have = false
                }

            }
        }

    })
}

const Main = setInterval(() => {//游戏运行函数
    // 僵尸生成
    if (interaction.corpse.number < 50) {
        interaction.corpse.time += 100
        if (interaction.corpse.time >= 20000) {
            interaction.corpse.time = 0
            interaction.corpse.entranceNumber = Math.ceil(interaction.corpse.wave / 2)
            interaction.corpse.wave += 1
            for (let i = 0; i < interaction.corpse.entranceNumber; i++) {
                let random = getNumber(2, 1)
                for (let k in usestore.corpse) {
                    if (usestore.corpse[k].id == random) {
                        const corpseY = getNumber(4, 0)
                        interaction.corpse.entrance.push({ ...usestore.corpse[k], move: true, x: 850, y: corpseY * 100 + 10, perpendicular: corpseY, identifier: _.uniqueId(), })
                    }
                }
            }
        }
    }
    // 僵尸移动以及失败控制
    if (interaction.corpse.entrance[0]) {
        for (let i in interaction.corpse.entrance) {
            for (let j in interaction.plant) {
                if (interaction.plant[j].y == interaction.corpse.entrance[i].perpendicular && 80 * interaction.plant[j].x + 150 >= interaction.corpse.entrance[i].x && interaction.corpse.entrance[i].x >= 80 * interaction.plant[j].x + 150 - interaction.corpse.entrance[i].long / 4 * 3) {
                    if (interaction.corpse.entrance[i].normalPath && interaction.corpse.entrance[i].path == interaction.corpse.entrance[i].normalPath) {
                        interaction.corpse.entrance[i].path = interaction.corpse.entrance[i].normalFightPath
                    } else {
                        interaction.corpse.entrance[i].path = interaction.corpse.entrance[i].fightPath

                    }
                    interaction.plant[j].Blood -= interaction.corpse.entrance[i].fight
                    interaction.corpse.entrance[i].move = false
                    if (interaction.plant[j].Blood <= 0) {
                        interaction.plant.splice(j, 1)
                        interaction.corpse.entrance[i].move = true
                        if (interaction.corpse.entrance[i].normalPath && interaction.corpse.entrance[i].path == interaction.corpse.entrance[i].normalFightPath) {
                            interaction.corpse.entrance[i].path = interaction.corpse.entrance[i].normalPath
                        } else {
                            interaction.corpse.entrance[i].path = interaction.corpse.entrance[i].standPath
                        }

                    }
                }
            }
            // 是否能够移动
            if (interaction.corpse.entrance[i].move) {
                interaction.corpse.entrance[i].x -= 1.5
            }
            // 僵尸进入屋子
            if (interaction.corpse.entrance[i].x <= -20) {
                interaction.success = false
                clearInterval(Main)
            }
        }
    }

    // 植物生成物控制
    if (interaction.plant[0] != null) {
        for (let i in interaction.plant) {
            if (interaction.plant[i].kind == "produce") {
                interaction.plant[i].time += 100
                if (interaction.plant[i].time >= interaction.plant[i].interval) {
                    interaction.plant[i].time = 0
                    interaction.product.push({
                        kind: interaction.plant[i].kind,
                        perpendicular: interaction.plant[i].y,
                        x: 150 + (80 * interaction.plant[i].x),
                        y: 70 + (100 * interaction.plant[i].y),
                        identifier: _.uniqueId("product_"),
                        path: interaction.plant[i].productPath,
                        long: interaction.plant[i].productWidth,
                        tall: interaction.plant[i].productHeigth
                    })
                }
            } else if (interaction.plant[i].kind == "fight" && interaction.corpse.entrance[0]) {
                for (let k in interaction.corpse.entrance) {
                    if (interaction.corpse.entrance[k].perpendicular == interaction.plant[i].y && 80 * interaction.plant[i].x + 150 <= interaction.corpse.entrance[k].x) {
                        interaction.plant[i].time += 100
                        if (interaction.plant[i].time >= interaction.plant[i].interval) {
                            interaction.plant[i].time = 0
                            interaction.product.push({
                                kind: interaction.plant[i].kind,
                                perpendicular: interaction.plant[i].y,
                                x: 150 + (80 * interaction.plant[i].x),
                                y: 100 + (100 * interaction.plant[i].y),
                                identifier: _.uniqueId("product_"),
                                path: interaction.plant[i].productPath,
                                long: interaction.plant[i].productWidth,
                                tall: interaction.plant[i].productHeigth,
                                fight: interaction.plant[i].aggressivity,
                                fatherX: 150 + (80 * interaction.plant[i].x),
                            })
                        }
                    }
                }
            }
        }
    }
    // 植物生成物行为控制
    if (interaction.product[0]) {
        for (let i in interaction.product) {
            if (interaction.product[i].kind == "produce") {
                sunDisable = setTimeout(() => {
                    interaction.product.splice(i, 1)
                }, 3000)
            } else if (interaction.product[i].kind == "fight") {
                interaction.product[i].x += 50
                if (interaction.product[i].x >= 900) {
                    interaction.product.splice(i, 1)
                } else {
                    for (let j in interaction.corpse.entrance) {
                        if (interaction.corpse.entrance[j].perpendicular === interaction.product[i].perpendicular && interaction.corpse.entrance[j].x > interaction.product[i].fatherX && interaction.product[i].x >= interaction.corpse.entrance[j].x + 80) {
                            if (interaction.corpse.entrance[j].ornaments > 0) {
                                interaction.corpse.entrance[j].ornaments -= interaction.product[i].fight
                                interaction.product.splice(i, 1)
                                if (interaction.corpse.entrance[j].ornaments <= 0) {
                                    interaction.corpse.entrance[j].path = interaction.corpse.entrance[j].normalPath;
                                }
                            } else {
                                interaction.corpse.entrance[j].blood -= interaction.product[i].fight
                                interaction.product.splice(i, 1)
                                switch (true) {
                                    case (interaction.corpse.entrance[j].blood > 0 && interaction.corpse.entrance[j].blood <= 20): interaction.corpse.entrance[j].path = interaction.corpse.entrance[j].diePath; break
                                    case (interaction.corpse.entrance[j].blood <= 0): interaction.corpse.entrance.splice(j, 1), interaction.corpse.number++; break;
                                }
                            }

                        }
                    }
                }


            }
        }
    }
    if (interaction.corpse.number = 50) {
        interaction.success = true
        clearInterval(Main)
    }
}, 100)
const getImageUrl = (path) => {
    return new URL(`../assets/${path}`, import.meta.url).href
}
onMounted(() => {
    for (let i = 0; i < usestore.gameCard.length; i++) {
        interaction.plantCard.push(usestore.gameCard[i])
    }
})
onBeforeRouteLeave((to, from) => {
    clearInterval(Main)
    clearTimeout(cardBalck, sunDisable)
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
    z-index: 998;
    transition: all 0.1s linear;
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
    height: 144px;
    transition: all 0.1s;
    z-index: 7;
}

.fail {
    background: url("../assets/bgc/ZombiesWon.png") no-repeat center center;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 999;
    width: 100%;
    height: 100%;
}

.success {
    text-align: center;
    font-size: 24px;
    letter-spacing: 2px;
}

.win {
    position: absolute;
    right: 10px;
    bottom: 5px;
    letter-spacing: 2px;
    font-size: 16px;
    font-weight: 700;
}</style>