<template>
    <div class="choose-card" v-if="props.visable"> 选择你的植物
        <div class="all-card">
            <span class="card" v-for="i in usestore.has" :key="i.name" @click="chooseChange(i.name)"
                :style="i.choose == false ? { backgroundImage: `url(${getImageUrl(i.path)})` } : { backgroundImage: `url(${getImageUrl(i.choosePath)})` }">{{ i.consume
                }}</span>
        </div>
        <button class="go" v-show="usestore.start" @click="goStart">Go!</button>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
import { useStore } from "../stores/counter"
const usestore = useStore()
const props = defineProps({
    visable: Boolean
})
const emit=defineEmits(['chooseClose'])
const getImageUrl = (path) => {
    return new URL(`../assets/${path}`, import.meta.url).href
}
const chooseChange = (e) => {
    usestore.chooseChange(e)
}
const goStart=()=>{
    emit("chooseClose");
}
</script>
<style scoped>
.choose-card {
    position: relative;
    background: url("../assets/bgc/SeedChooser_Background.png");
    width: 465px;
    height: 555px;
    margin-left: 100px;
    color: #fdbd5c;
    text-align: center;
    font-size: 16px;
    letter-spacing: 2px;
    line-height: 32px;
}

.go {
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translate(-50%);
    color: #fdbd5c;
    width: 100px;
    background-color: #783400;
}

.all-card {
    width: 420px;
    height: 400px;
    display: flex;
    margin: 8px 13px;
}

.card {
    display: inline-block;
    width: 70px;
    height: 40px;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding-left: 30px;
    padding-top: 18px;
    margin: 2px;
    color: black;
    letter-spacing: 0px;
    font-size: 12px;
}
</style>