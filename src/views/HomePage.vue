<template>
  <div class="home">
    <img src="../assets/bgc/home-page.jpg" alt="" usemap="#Map0" />
    <map name="Map0">
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
    <MessageBox :visable="visable" @close="closeChange">
      <div class="text">{{content}}</div>
    </MessageBox>
  </div>
</template>

<script setup>
import MessageBox from "../components/MessageBox.vue";
import { reactive, ref } from "vue";
const visable=ref(false)
const content=ref(null)
const ShowOptions=()=>{
   visable.value=true
   content.value="暂无内容....."
}
const ShowHelp=()=>{
   visable.value=true
   content.value="点击收集阳光 选择种植植物 保护好你的脑子！"
}
const exit=()=>{
   visable.value=true
   content.value="自己关闭网页 不用我教了吧"
}
const closeChange=()=>{
   visable.value=false
}
</script>

<style scoped>
.home{
   position: relative;
}
.text{
   color: white;
   text-align: center;
   font-size: 24px;
   letter-spacing: 5px;
}

</style>