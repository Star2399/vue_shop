<template>
  <el-container class='home-container'>
    <!--  头部区域  -->
    <el-header>
      <div>
        <img src='../assets/heima.png'>
        <span>电商后台管理系统</span>
      </div>
        <el-button type="info" v-on:click="logout">退出</el-button>
    </el-header>
    <!--  页面主体区域  -->
    <el-container>
      <!--  侧边栏    -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class='toggle-button' v-on:click='toggleCollapse'>|||</div>
        <el-menu
          background-color="skyblue"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened=true
          :collapse="isCollapse"
          :collapse-transition='false'
          :router='true'
          :default-active='activePath'
        >
          <el-submenu :index="item.id + ''" v-for='item in menulist' :key='item.id'>
            <template slot="title">
              <!--   图标   -->
              <i :class="iconsObj[item.id]"></i>
              <!--   文本   -->
              <span>{{item.authName}}</span>
              <!--   模板区   -->
            </template>

            <!--二级菜单-->
            <el-menu-item
              :index ="'/' + subitem.path"
              v-for='subitem in item.children'
              :key = "subitem.id"
              v-on:click="saveNacState('/' + subitem.path)"
            >
              <template slot="title">
                <!--   图标   -->
                <i class="el-icon-menu"></i>
                <!--   文本   -->
                <span>{{subitem.authName}}</span>
                <!--   模板区   -->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--   右侧内容路由   -->
<!--      <div>
        <li>
          <router-link class="list-group-item" active-class="active" to="/home/welcome"></router-link>
        </li>
      </div>-->
      <!--   右侧内容主体   -->
      <el-main>
        <!--   路由占位符     -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created(){

    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data:function(){
    return{
      menulist:[],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-marketing',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing'
      },
      isCollapse:false,
      activePath:''
    }
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200)
        return this.$message.error(res.meta.msg)
      this.menulist = res.data

    },
    //切换菜单的折叠和展开
    toggleCollapse(){
      this.isCollapse =!this.isCollapse
    },
    //保存链接的激活状态
    saveNacState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: orange;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display:flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: skyblue ;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
