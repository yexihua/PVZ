<template>
  <div class="home">
    <img src="../assets/bgc/home-page.jpg" alt="" usemap="#Map0" />
    <map name="Map0" v-if="!visable && !helpAbel">
      <area href="javascript:void(0)" shape="rect" coords="641, 466, 724, 527" @click="ShowOptions" />
      <area href="javascript:void(0)" shape="rect" coords="718, 512, 790, 558" @click="ShowHelp" />
      <area href="javascript:void(0)" shape="rect" coords="800, 495, 879, 548" @click="exit" />
    </map>
    <img src="../assets/bgc/help.png" alt="" v-show="helpAbel" class="helpimg" @click="helpClose">
    <MessageBox :visable="visable != 0 ? true : false" @close="closeChange">

      <div v-show="visable == 1"></div>
      <a-checkbox @change="Music" class="text" v-show="visable == 2"><span>开启背景音乐</span></a-checkbox>
      <div v-show="visable == 3"></div>

    </MessageBox>
    <audio loop ref="audioRef">
      <source src="../assets/music/home.ogg" type="audio/ogg" />
    </audio>
  </div>
</template>

<script setup>
import MessageBox from "../components/MessageBox.vue";
import { onMounted, reactive, ref } from "vue";
import { useCounterStore } from "../stores/counter"

const useStores = useCounterStore();//获取pinia导出的实例
const helpAbel = ref(false);//帮助打开
const visable = ref(0);//菜单栏打开
const audioRef = ref();//音频实例
const ShowOptions = () => { //选项点击
  visable.value = 2;
};
const ShowHelp = () => {//帮助点击
  helpAbel.value = true;
};
const helpClose = () => {//帮助关闭
  helpAbel.value = false;
}
const exit = () => {//退出点击
  visable.value = 3;
};
const closeChange = () => {//菜单弹出返回
  visable.value = 0;
};
const Music = () => {//音频开关
  useStores.bgmChange()
  if (useStores.bgm) {
    audioRef.value.play()
  } else {
    audioRef.value.currentTime = 0;
    audioRef.value.pause();
  }
}
</script>

<style scoped>
.home {
  position: relative;
}

.text {
  text-align: left;
  font-size: 24px;
  letter-spacing: 5px;
  margin: 130px 100px 0px;
}

.text span {
  color: white;

}

.helpimg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>