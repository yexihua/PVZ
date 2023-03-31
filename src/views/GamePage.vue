<template>
    <div :class="chooseOver == false ? 'game' : 'game game0'" ref="gameRef">
        <audio loop ref="audioGame">
            <source src="../assets/music/game-bgc.ogg" type="audio/ogg" />
        </audio>
        <img src="../assets/bgc/game-tip.gif" alt="" v-if="tipStart" class="game-tip">
        <div class="menuOpen" @click="menuOpen" v-show="gameStatus.menuVisable">菜单</div>
        <ChooseCard :visable="gameStatus.chooseVisable" @choose-close="chooseVisableChange"></ChooseCard>
        <MessageBox :visable="visable" @close="closeChange">
            <a-checkbox @change="Music" class="text" v-model="status.bgm"><span>开启背景音乐</span></a-checkbox>
            <router-link to="/" class="back-menu">返回主菜单</router-link>
        </MessageBox>
        <LeftCard :visable="gameStatus.cardVisable"></LeftCard>
        <div class="sun" v-show="gameStatus.sunEcptoma" @click="sunClose"></div>
    </div>
</template>

<script setup>
import ChooseCard from "../components/ChooseCard.vue"
import LeftCard from "../components/LeftCard.vue";
import { ref, onMounted, reactive } from "vue"
import MessageBox from "../components/MessageBox.vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const gameRef = ref()
const status = reactive({
    bgm: false//背景音乐控制
})
const gameStatus = reactive({
    menuVisable: false,//菜单可见
    chooseVisable: false,//选择卡片可见
    cardVisable: false,//卡片可见
    sunEcptoma: false,
})
const audioGame = ref();//音频实例
const chooseOver = ref(false)//选择卡片完毕
const visable = ref(false)//菜单打开
const tipStart = ref(false)//提示语状态
const menuOpen = () => {
    visable.value = true
}
const closeCard = setTimeout(() => {
    gameStatus.menuVisable = gameStatus.chooseVisable = true
}, 3000)

// 页面跳转或刷新触发
onbeforeunload = () => {
    clearTimeout(closeCard, sunDown)
}
onBeforeRouteLeave((to, from) => {
    sessionStorage.setItem("bgmStaus", JSON.stringify({ bgm: status.bgm }))
})
onMounted(() => {
    if (sessionStorage.getItem("bgmStaus")) {
        const musicOpen = JSON.parse(sessionStorage.getItem("bgmStaus")).bgm
        status.bgm = musicOpen
        if (musicOpen) {
            audioGame.value.play()
        }
    }

})
const sunClose = () => {
    gameStatus.sunEcptoma = false
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
const chooseVisableChange = () => {
    gameStatus.chooseVisable = false
    chooseOver.value = true
    var tipOpen = setTimeout(() => {
        tipStart.value = true
    }, 500)
    const tipclose = setTimeout(() => {
        tipStart.value = false
        gameStatus.cardVisable = true
        clearTimeout(tipOpen, tipclose)
    }, 3500)
}
// 获取随机数整数
const getNumber = (m, n) => {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
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
    background: url('../assets/Sun.gif');
    position: absolute;
}
</style>