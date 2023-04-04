<template>
    <div :class="chooseOver == false ? 'game' : 'game game0'" ref="gameRef">
        <!-- 背景音乐 -->
        <audio loop ref="audioGame">
            <source src="../assets/music/game-bgc.ogg" type="audio/ogg" />
        </audio>
        <!-- 游戏开始提示语 -->
        <img src="../assets/bgc/game-tip.gif" alt="" v-if="tipStart" class="game-tip">
        <!-- 出场僵尸展示 -->
        <div class="zombie" v-if="gameStatus.chooseVisable">
            <span class="zombiePeople" v-for="i in createCorpse()" :key="i.name"
                :style="{ background: `url(${getImageUrl(i.standPath)})`, left: getNumber(230, 0) + 'px', top: getNumber(380, 0) + 'px' }"></span>
        </div>
        <!-- 菜单 -->
        <div class="menuOpen" @click="menuOpen" v-show="gameStatus.menuVisable">菜单</div>
        <!-- 植物卡片选择 -->
        <ChooseCard :visable="gameStatus.chooseVisable" @choose-close="chooseVisableChange"></ChooseCard>
        <!-- 菜单打开 -->
        <MessageBox :visable="visable" @close="closeChange">
            <a-checkbox @change="Music" class="text" v-model="status.bgm"><span>开启背景音乐</span></a-checkbox>
            <router-link to="/" class="back-menu">返回主菜单</router-link>
        </MessageBox>
        <!-- 左侧卡片 -->
        <LeftCard :visable="gameStatus.cardVisable"></LeftCard>
        <!-- 自然阳光掉落 -->
        <div class="sun" v-show="gameStatus.sunEcptoma" @click="sunClose"
            :style="{ left: gameStatus.sunPosition.x, top: gameStatus.sunPosition.y || '-78px' }">
        </div>
        <!-- 关卡草坪 -->
        <div class="grass" v-if="gameStatus.cardVisable">
            <!-- 生成僵尸 -->
            <template v-if="gameStatus.entrance[0]">
                <div class="corpse" v-for="i in gameStatus.entrance" :key="i.identifier"
                    :style="{ left: i.x + 'px', top: i.y + 'px', background: `url(${getImageUrl(i.standPath)})` }"></div>
            </template>
        </div>
        <!-- 关卡失败提示语 -->
        <div @click="gameback" class="fail" v-if="gameStatus.success == false">

        </div>
    </div>
</template>

<script setup>
import ChooseCard from "../components/ChooseCard.vue"
import LeftCard from "../components/LeftCard.vue";
import { ref, onMounted, reactive } from "vue"
import MessageBox from "../components/MessageBox.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useStore } from "../stores/counter"
import * as _ from 'lodash'
const router = useRouter();//路由实例

const store = useStore()//pinia实例
const gameRef = ref()
const status = reactive({
    bgm: false//背景音乐控制
})
const audioGame = ref();//音频实例
const chooseOver = ref(false)//选择卡片完毕
const visable = ref(false)//菜单打开
const tipStart = ref(false)//提示语状态
var sunDown, corpseGo, main;
// 获取随机数整数
const getNumber = (m, n) => {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
const gameStatus = reactive({
    menuVisable: false,//菜单可见
    chooseVisable: false,//选择卡片,出战僵尸可见
    cardVisable: false,//卡片可见
    sunEcptoma: true,//阳光可见
    sunPosition: {
        x: getNumber(820, 200) + 'px',
        Y: null
    },
    entrance: [],//要生成的僵尸
    entranceNumber: 1,//要生成的僵尸数
    wave: 1,//第几波僵尸
    success: null
})

// 关卡失败返回主界面
const gameback = () => {
    router.push("/")
}

// 生成僵尸对应id
const createCorpse = () => {
    let arr = []
    for (let i = 0; i < 10; i++) {
        let corpseId = getNumber(2, 1)
        for (let k in store.corpse) {
            if (store.corpse[k].id == corpseId) {
                arr.push(store.corpse[k])
            }
        }
    }
    return arr
}


const menuOpen = () => {
    visable.value = true
}
const closeCard = setTimeout(() => {
    gameStatus.menuVisable = gameStatus.chooseVisable = true
}, 3000)
const sunClose = () => {
    gameStatus.sunEcptoma = false
    store.sunChange(25)
    gameStatus.sunPosition.x = getNumber(820, 200) + 'px'
    gameStatus.sunPosition.y = null
}
const closeChange = () => {//菜单弹出返回
    visable.value = 0;
};
const Music = () => {//音频开关
    if (status.bgm) {
        audioGame.value.play()
    } else {
        audioGame.value.currentTime = 0;
        audioGame.value.pause();
    }
}
const getImageUrl = (path) => {//获取文件路径
    return new URL(`../assets/${path}`, import.meta.url).href
}
const chooseVisableChange = () => {
    gameStatus.chooseVisable = false
    chooseOver.value = true
    var tipOpen = setTimeout(() => {
        tipStart.value = true
    }, 500)
    const tipclose = setTimeout(() => {
        tipStart.value = false
        gameStatus.cardVisable = true
        sunDown = setInterval(() => {
            gameStatus.sunPosition.y = getNumber(500, 100) + 'px'
            const disappear = setTimeout(() => {
                gameStatus.sunEcptoma = false
                gameStatus.sunPosition.x = getNumber(820, 200) + 'px'
                gameStatus.sunPosition.y = null
                clearTimeout(disappear)
            }, 5000)
            const appear = setTimeout(() => {
                gameStatus.sunEcptoma = true
                clearTimeout(appear)
            }, 7000)
        }, 11000)
        corpseGo = setInterval(() => {
            gameStatus.entranceNumber = Math.ceil(gameStatus.wave / 2)
            gameStatus.wave += 1
            for (let i = 0; i < gameStatus.entranceNumber; i++) {
                let random = getNumber(2, 1)
                for (let i in store.corpse) {
                    if (store.corpse[i].id == random) {
                        gameStatus.entrance.push({ x: 850, y: getNumber(4, 0) * 100 + 10, identifier: _.uniqueId(), ...store.corpse[i] })
                    }
                }
            }
        }, 20000)
        main = setInterval(() => {//游戏运行定时器
            if (gameStatus.entrance[0]) {
                for (let i in gameStatus.entrance) {
                    gameStatus.entrance[i].x -= 1.5
                    if (gameStatus.entrance[i].x <= -50) {
                        gameStatus.success = false
                        clearInterval(main)
                    }
                }
            }
        }, 100);
        clearTimeout(tipOpen, tipclose)
    }, 3500)
}

onBeforeRouteLeave((to, from) => {
    sessionStorage.setItem("bgmStaus", JSON.stringify({ bgm: status.bgm }))
    clearTimeout(closeCard, main)
    clearInterval(main, sunDown, corpseGo)
    store.initializationPlant()
})
onMounted(() => {
    if (sessionStorage.getItem("bgmStaus")) {
        const musicOpen = JSON.parse(sessionStorage.getItem("bgmStaus")).bgm
        status.bgm = musicOpen
        if (musicOpen) {
            audioGame.value.play()
        }
    }
    console.log();
})


</script>
<style scoped>
@keyframes bgc-move {
    0% {
        background: url("../assets/bgc/background1.jpg");
    }

    50% {
        background: url("../assets/bgc/background1.jpg");
    }

    75% {
        background: url("../assets/bgc/background1.jpg") -500px;
    }

    100% {
        background: url("../assets/bgc/background1.jpg") -500px;
    }

}

.text {
    text-align: center;
    font-size: 24px;
    letter-spacing: 5px;
    margin: 130px 100px 20px;
}

.text span {
    color: white;
}

.game {
    position: relative;
    width: 100%;
    height: 100%;
    animation: bgc-move 3s linear;
    background: url("../assets/bgc/background1.jpg") -500px;
}

.game0 {
    background: url("../assets/bgc/background1.jpg") -100px;

}

.game-tip {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.menuOpen {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
    color: #3BB346;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 5px;
    padding-top: 10px;
    padding-left: 38px;
    box-sizing: border-box;
    width: 113px;
    height: 41px;
    background: url("../assets/bgc/button1.png") no-repeat;
}

.back-menu {
    text-decoration: none;
    color: #fdbd5c;
    display: flex;
    justify-content: center;
    font-size: 24px;
    letter-spacing: 5px;
}

.sun {
    width: 78px;
    height: 78px;
    background: url('../assets/product/Sun.gif');
    position: absolute;
    z-index: 5;
    transition: all 3s;
}

.zombie {
    position: absolute;
    left: 500px;
    top: 50px;
    height: 550px;
    width: 400px;
}

.zombiePeople {
    position: absolute;
    width: 166px;
    height: 144px;
    display: inline-block;
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
    transition: all 0.1s;
}

.fail {
    background: url("../assets/bgc/ZombiesWon.png") no-repeat center center;
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
}

</style>