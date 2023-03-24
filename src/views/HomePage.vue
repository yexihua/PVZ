<template>
  <div class="home" @click="startMusic">
    <img src="../assets/bgc/home-page.jpg" alt="" usemap="#Map0" />
    <map name="Map0" v-if="!visable&&!helpAbel">
      <area
        href="javascript:void(0)"
        shape="rect"
        coords="641, 466, 724, 527"
        @click="ShowOptions"
      />
      <area
        href="javascript:void(0)"
        shape="rect"
        coords="718, 512, 790, 558"
        @click="ShowHelp"
      />
      <area
        href="javascript:void(0)"
        shape="rect"
        coords="800, 495, 879, 548"
        @click="exit"
      />
    </map>
    <img src="../assets/bgc/help.png" alt="" v-show="helpAbel" class="helpimg" @click="helpClose">
    <MessageBox :visable="visable" @close="closeChange">
      <div class="text">{{ content }}</div>
    </MessageBox>
    <audio autoplay loop ref="audioRef">
      <source src="../assets/music/home.ogg" type="audio/ogg" />
    </audio>
  </div>
</template>

<script setup>
import MessageBox from "../components/MessageBox.vue";
import { onMounted, reactive, ref } from "vue";

const helpAbel=ref(false);
const visable = ref(false);
const content = ref(null);
const audioRef = ref();
const ShowOptions = () => {
  visable.value = true;
  content.value = "暂无内容.....";
};
const ShowHelp = () => {
  helpAbel.value = true;
};
const helpClose=()=>{
  helpAbel.value = false;
}
const exit = () => {
  visable.value = true;
  content.value = "自己关闭网页 不用我教了吧";
};
const closeChange = () => {
  visable.value = false;
};
const startMusic=()=>{
  audioRef.value.play()
}
</script>

<style scoped>
.home {
  position: relative;
}
.text {
  color: white;
  text-align: center;
  font-size: 24px;
  letter-spacing: 5px;
}
.helpimg{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>