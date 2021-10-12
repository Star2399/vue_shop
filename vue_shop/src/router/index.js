import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/Login"
import Home from "../pages/Home"
import Welcome from "../pages/Welcome"
import Users from "../pages/user/Users"
import Rights from "../pages/authority/Rights"
import Roles from "../pages/authority/Roles"
import Categories from "../pages/commodity_management/Categories"
import Goods from "../pages/commodity_management/Goods"
import Params from "../pages/commodity_management/Params"
import Reports from "../pages/data/Reports"
import Orders from "../pages/order/Orders"
Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/reports',
          component: Reports
        },
        {
          path: '/orders',
          component: Orders
        }
      ]
    }
  ]
})
//路由导航首位
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    return next()
  }else{
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr){
      return next('/login')
    }
    next()
  }
})

export default router

