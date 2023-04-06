<template>
  <div class="menu" v-show="props.visable">
    <slot></slot>
    <button class="back" @click="closeing">返 回</button>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const props = defineProps({
  visable: Boolean,
});
const emit = defineEmits(["close"]);

const closeing = () => {
  emit("close");
};
</script>

<style scoped>
.menu {
  background: url("../assets/bgc/menu.png") no-repeat;
  width: 412px;
  height: 483px;
  position: absolute;
  z-index: 998;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content{
    margin: 130px 100px 0px;
}
.back {
  background: url("../assets/bgc/button.png") no-repeat;
  background-size: 100% 100%;
  width: 360px;
  height: 90px;
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%);
  border: 0px solid;
  color: #fdbd5c;
  font-size: 30px;
  cursor: pointer;
}
</style>