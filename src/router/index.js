import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/index.vue'
import ComponentNav from '../components/index.vue'
const routes = [
  {
    path: '/',
    name: 'componentnav',
    component: ComponentNav,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: '/scenic',
        name: 'scenic',
        component: () => import('../views/Scenic/index.vue'),
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('../views/Goods/index.vue'),
      },
      {
        path: '/traffic',
        name: 'traffic',
        component: () => import('../views/Traffic/index.vue'),
      },
      {
        path: '/national',
        name: 'national',
        component: () => import('../views/National/index.vue'),
      },
      {
        path: '/seasons',
        name: 'seasons',
        component: () => import('../views/Seasons/index.vue'),
      },
      {
        path: '/adventure',
        name: 'adventure',
        component: () => import('../views/Adventure/index.vue'),
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/Activity/index.vue'),
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About/index.vue'),
  },
  {
    path: '/desc',
    name: 'desc',
    component: () => import('../views/Desc/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register/index.vue'),
  },
  {
    path: '/goods/all',
    name: 'allgoods',
    component: () => import('../views/Goods/components/AllGoods.vue'),
  },
  {
    path: '/goods/detail',
    name: 'gooddetail',
    component: () => import('../views/Goods/components/GoodsDetail.vue'),
  },
  {
    path: '/scenic/detail/:id',
    name: 'scenicdetail',
    component: () => import('../views/Scenic/components/ScenicDetail.vue'),
  },
  {
    path: '/scenic/wayplan',
    name: 'wayplan',
    component: () => import('../views/Scenic/components/Wayplan.vue'),
  },
  {
    path: '/scenic/vrstep',
    name: 'vrstep',
    component: () => import('../views/Scenic/components/Vrstep.vue'),
  },
  {
    path: '/scenic/vrview',
    name: 'vrview',
    component: () => import('../views/Scenic/components/Vrviews.vue'),
  },
  {
    path: '/scenic/evaluation',
    name: 'evaluation',
    component: () => import('../views/Scenic/components/Evaluation.vue'),
  },
  {
    path: '/national/clothes',
    name: 'clothes',
    component: () => import('../views/National/components/Clothes.vue'),
  },
  {
    path: '/national/festival',
    name: 'festival',
    component: () => import('../views/National/components/Festival.vue'),
  },
  {
    path: '/national/perform',
    name: 'perform',
    component: () => import('../views/National/components/Perform.vue'),
  },
  {
    path: '/national/history',
    name: 'history',
    component: () => import('../views/National/components/History.vue'),
  },
  {
    path: '/traffic/plan',
    name: 'plan',
    component: () => import('../views/Traffic/componemts/MakePlan.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
