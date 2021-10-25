<template>
  <div>
    <!--  面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区  -->
    <el-card class="box-card">
<!-- 卡片头区-->
<!--      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>-->
      <!--   搜索与添加区   -->
     <el-row :gutter='20'>
       <el-col :span='12'>
         <el-input
           placeholder="Please input"
           v-model='queryInfo.query'
           clearable
           @clear='getUserList'
         >
           <el-button slot="append" icon="el-icon-search" v-on:click='getUserList'></el-button>
         </el-input>
       </el-col>
       <el-col :span='4'>
         <el-button type='primary' v-on:click='addDialogVisible = true'>添加用户</el-button>
       </el-col>
     </el-row>
        <!--用户列表区-->
      <el-table
        :data="userList"
        border
        stripe
      >
        <el-table-column
          type='index'
          label="序号"

        >
        </el-table-column>
        <el-table-column
          prop='username'
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop='email'
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop='mobile'
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop='role_name'
          label="角色"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope='scope'>
          <!--   这里用作用域插槽接受了scope，scope.row就代表这一行的数据  -->
          <!--scope.row可以监听状态的变换-->
            <el-switch
              v-model="scope.row.mg_state"
              @change='userStateChanged(scope.row)'
             >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width='160x'
        >
          <template slot-scope='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini' circle v-on:click='showEditDialog(scope.row.id)'></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' circle v-on:click='removeUserById(scope.row.id)'></el-button>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-star-off" size='mini' circle @click='setRole(scope.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

<!--   分页区域   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!--  添加用户的对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addDialogClosed'
      >
      <!--   内容主体区   -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
       <!--   底部按钮区   -->
       <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="addUser">提交</el-button>
       </span>
    </el-dialog>
    <!--  修改用户的对话框  -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="70px"
        @close='editDialogClosed'
      >
        <el-form-item label="用户名" disabled>
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="editUserInfo" >提交</el-button>
      </span>
    </el-dialog>

<!--  分配角色的对话框  -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close='setRoleDialogClosed'
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新的角色：
          <el-select v-model="selectedRoldId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确定</el-button>
  </span>
    </el-dialog>v
  </div>
</template>

<script>
export default {
  name: 'Users',
  data:function(){
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的邮箱'))
     }
      var checkMobile = (rule, value, cb) => {
        const regEmail = /^1[34578]\d{9}$/

        if (regEmail.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))
      }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible:false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        id:0,
        rid:0

      },
      editForm:{},
      addFormRules: {
        username: [
          { required: true, message: '请输用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: '请输邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible:false,
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色的数据列表
      rolesList:[],

      //选中的jueseId
      selectedRoldId:''


    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data:res} = await this.$http.get('users',{
         params:this.queryInfo
      })
      if(res.meta.status !== 200)
        return this.$message.error("获取用户列表失败")
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变事件

    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo){
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status!==200){
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)
          return
        //可以发起添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addForm)

        if(res.meta.status!=201){
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')


        this.addDialogVisible=false

        this.getUserList()
      })
    },
    //弹出修改对话框
    async showEditDialog(id){

      const {data:res} = await this.$http.get(`users/${id}`)

      if(res.meta.status!==200){
        return this.$message.error('展示用户失败！')
      }
      this.editForm = res.data
      this.editDialogVisible=true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){
      //验证表单
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)
          return
        //可以发起添加用户的网络请求
        const {data:res} = await this.$http.put('users/' + this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })

        if(res.meta.status!==200){
          this.$message.error('更新用户信息失败！')
        }
        this.$message.success('更新用户信息成功！')


        this.editDialogVisible=false

        this.getUserList()
      })
    },
    //根据id删除对应用户
    async removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err=>err)

      //如果确认删除，则返回字符串confirm
      //如果取消删除，则返回字符串cancel

      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res}=await this.$http.delete('users/' + id)
      if(res.meta.status!==200){
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
    },
    //设置角色的对话框
    async setRole(userInfo){
      this.userInfo = userInfo
      //获取角色列表
      const {data:res}=await this.$http.get('roles')
      if (res.meta.status!==200){
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo(){
      if(!this.selectedRoldId)
        return this.$message.error('请选择要分配的角色！')
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectedRoldId
      })
      if(res.meta.status!==200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed(){
      this.selectedRoldId=''
      this.userInfo = {}
    }
  }
}
</script>

<style lang='less' scoped>

</style>
