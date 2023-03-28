import { createRouter, createWebHistory } from 'vue-router'
// import { useStore } from "../stores/counter"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("../views/HomePage.vue")
    },
    {
      path: '/gamePage',
      component: () => import("../views/GamePage.vue")
    },
    {
      // path: '/about',
      // name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   const useStores = useStore();//获取pinia导出的实例
//   useStores.setBgm(sessionStorage.getItem("bgmStaus"))
//   next()
// })
export default router
