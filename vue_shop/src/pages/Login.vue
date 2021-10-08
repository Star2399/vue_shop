<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <el-form-item  prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" v-on:click="login">登录</el-button>
          <el-button type="info" v-on:click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data:function (){
    return{
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6-15位密码', trigger: 'blur' }
        ],
      }
    };

  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async (valid)=>{
        if(!valid)
          return;
        const {data:res} = await this.$http.post('login',this.loginForm)
        if(res.meta.status!==200)
          return this.$message.error('登陆失败！')
        this.$message.success('登陆成功！')
        //存token
        window.sessionStorage.setItem("token",res.data.token)
        //编程式导航跳转页面
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: skyblue;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
