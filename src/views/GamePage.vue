<template>
    <div class="game">
        <audio loop ref="audioRef">
            <source src="../assets/music/game-bgc.ogg" type="audio/ogg" />
        </audio>
        <div class="game-tip" v-show="tipStart"></div>
        <div class="menu" @click="menu">菜单</div>
        <!-- <img src="../assets/bgc/Button.png" alt=""> -->
        <!-- <MessageBox></MessageBox> -->
    </div>
</template>

<script setup>
import { useCounterStore } from "../stores/counter"
import { ref, onMounted } from "vue"
import MessageBox from "../components/MessageBox.vue";

const useStores = useCounterStore();//获取pinia导出的实例
const visable = ref(false);//卡片，菜单栏状态
const tipStart = ref(false)//提示语状态
const menu=()=>{
    visable.value=true
}
const tipOpen = setTimeout(() => {
    tipStart.value = true
}, 5500)
const tipclose = setTimeout(() => {
    tipStart.value = false
    visable.value=true
}, 8500)
onbeforeunload = () => {
    clearTimeout(tipOpen, tipOpen)
}
</script>
<style scoped>
@keyframes bgc-move {
    0% {
        background: url("../assets/bgc/background1.jpg");
    }

    20% {
        background: url("../assets/bgc/background1.jpg");
    }

    50% {
        background: url("../assets/bgc/background1.jpg") -500px;
    }

    70% {
        background: url("../assets/bgc/background1.jpg") -500px;
    }

    100% {
        background: url("../assets/bgc/background1.jpg") -100px;
    }
}

.game {
    position: relative;
    width: 100%;
    height: 100%;
    animation: bgc-move 5s linear forwards;
}

.game-tip {
    width: 250px;
    height: 108px;
    background: url("../assets/bgc/game-tip.gif");
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.menu{
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
    background: url("../assets/bgc/Button.png") no-repeat;
}
</style>