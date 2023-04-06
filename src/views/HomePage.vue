<template>
  <div class="home">
    <img src="../assets/bgc/home-page.jpg" alt="" usemap="#Map0" />
    <map name="Map0" v-if="!visable && !helpAbel">
      <area href="javascript:void(0)" shape="rect" coords="641, 466, 724, 527" @click="ShowOptions" />
      <area href="javascript:void(0)" shape="rect" coords="718, 512, 790, 558" @click="ShowHelp" />
      <area href="javascript:void(0)" shape="rect" coords="800, 495, 879, 548" @click="exit" />
    </map>
    <img src="../assets/bgc/help.png" alt="" v-show="helpAbel" class="helpimg" @click="helpClose">
    <div class="start" @click="startGame"></div>

    <MessageBox :visable="visable != 0 ? true : false" @close="closeChange">
      <div v-show="visable == 1" class="chooseGame">
        第一大关
        <div class="barrier">
          <router-link class="censorship" :to="'/gamePage?id=' + i" v-for="(i, index) in 1" :key="index">
            第{{ i }}关
          </router-link>
        </div>
      </div>

      <a-checkbox @change="Music" class="text" v-show="visable == 2" v-model="status.bgm"><span>开启背景音乐</span></a-checkbox>

      <div v-show="visable == 3" class="gameExit">
        <span>确认要退出么（若退出失败请手动关闭）</span>
        <br>
        <div @click="gameclose" v-show="visable == 3" class="textExit">Yes</div>
      </div>
    </MessageBox>

    <audio loop ref="audioRef">
      <source src="../assets/music/home.ogg" type="audio/ogg" />
    </audio>
  </div>
</template>

<script setup>
import MessageBox from "../components/MessageBox.vue";
import { onMounted, reactive, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
const status = reactive({
  bgm: false//背景音乐控制
})
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
const gameclose = () => {//退出游戏
  open(location, '_self').close();
}
const startGame = () => {//开始游戏
  if (!visable.value) {
    visable.value = 1
  }
}
onMounted(() => {
  if (sessionStorage.getItem("bgmStaus")) {
    const musicOpen = JSON.parse(sessionStorage.getItem("bgmStaus")).bgm
    status.bgm = musicOpen
    if (musicOpen) {
      audioRef.value.play()
    }
  }
})
// 页面跳转
onBeforeRouteLeave((to, from) => {
  sessionStorage.setItem("bgmStaus", JSON.stringify({ bgm: status.bgm }))
})
const Music = () => {//音频开关
  if (status.bgm) {
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
  text-align: center;
  font-size: 24px;
  letter-spacing: 5px;
  margin: 130px 100px 0px;
}

.text span {
  color: white;
}

.gameExit {
  text-align: center;
  font-size: 24px;
  letter-spacing: 5px;
  margin: 180px 100px 0px;
}

.gameExit span {
  color: white;
}

.textExit {
  margin-top: 20px;
  font-size: 16px;
  letter-spacing: 2px;
  cursor: pointer;
  color: #fdbd5c;
}

.helpimg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.start {
  width: 331px;
  height: 146px;
  background: url("../assets/bgc/start.png");
  position: absolute;
  left: 474px;
  top: 80px;
}

.start-over {
  background: url("../assets/bgc/start0.png");
}

.chooseGame {
  margin: 120px 100px 0px;
  color: #fdbd5c;
  text-align: center;
  font-size: 24px;
  letter-spacing: 5px;
}

.barrier {
  margin: 10px 20px 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.censorship {
  font-size: 16px;
  color: white;
  line-height: 40px;
  letter-spacing: 0px;
  width: 60px;
  cursor: pointer;
  text-decoration: none;
}

.chooseText {
  color: #86909c;
}
</style>