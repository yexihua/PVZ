# 植物大战僵尸v1.0.0（vue）

本项目是基于vue3框架开发的小游戏，少量借助了arco design内的内置组件。由于在实现过程中大量使用了ES6语法进行js逻辑运算，故需要浏览者需要有一定的ES6与js基础

## 已完成功能

○ 主界面交互：关卡选择，退出，帮助以及游戏选项
○ 游戏场景：背景、阳光计分板、植物卡片（用于放置植物）、植物（暂定2种）、僵尸（暂定2种）、菜单
○ 植物和僵尸的攻击判定、死亡判定
○ 阳光自动生成、植物放置需消耗阳光，僵尸随机生成
○ 植物、僵尸各自获胜条件判断
○ 僵尸状态（普通形态、移动形态、攻击形态、濒死形态）

## 游戏调整

制作者的关怀
▲ 初始阳光由50 -> 100

制作者的背刺
▲ 取消小推车（被僵尸偷偷顺走了）
▲ 随着时间流动出场僵尸逐渐增强 -> 不同强度的僵尸将随机出现

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
