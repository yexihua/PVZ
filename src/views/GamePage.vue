<template>
    <div class="game">

    </div>
</template>
<style scoped>
@keyframes moved {
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
    animation: moved 5s linear forwards;
}
</style>