import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/Login"
import Home from "../pages/Home"


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
      component: Home
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

