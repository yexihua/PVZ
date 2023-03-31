<template>
    <div v-if="props.visable">
        <div class="left-card">
            <div class="card" v-for="i in usestore.gameCard" :key="i.name" :style="{ backgroundImage: `url(${getImageUrl(i.path)})` }">
                {{ i.consume }}
            </div>        
        </div>
        <div class="Sun">50</div>
    </div>
</template>
<script setup>
import { useStore } from "../stores/counter"
const usestore = useStore()
const props = defineProps({
    visable: Boolean,
});
const getImageUrl = (path) => {
    return new URL(`../assets/${path}`, import.meta.url).href
}
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
}


</style>