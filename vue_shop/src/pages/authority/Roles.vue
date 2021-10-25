<template>
  <div>
    <!--  面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!--  卡片视图区  -->
    <el-card class="box-card">
      <!--用户列表区-->
      <el-row>
        <el-col>
          <el-button type="primary" round>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="roleList"
        border
        stripe
      >

        <el-table-column
          type='expand'

        >
          <template slot-scope='scope'>

            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              v-for='(item1,i1) in scope.row.children'
              :key='item1.id'
            >
              <!--渲染一级权限-->
              <el-col :span='5'>
                <el-tag
                  closable
                  @close='removeRightById(scope.row,item1.id)'
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!--渲染二级权限-->
              <el-col :span='19'>
                <el-row
                  :class="[i2===0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key='item2.id'
                >
                  <el-col :span='5'>
                    <el-tag
                      type='success'
                      closable
                      @close='removeRightById(scope.row,item2.id)'
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag
                      type='warning'
                      v-for="(item3,i3) in item2.children"
                      :key='item3.id'
                      closable
                      @close='removeRightById(scope.row,item3.id)'
                    >
                      {{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>


        <el-table-column
          type='index'
          label="序号"

        ></el-table-column>

        <el-table-column
          prop='roleName'
          label="角色名称"

        ></el-table-column>
        <el-table-column
          prop='roleDesc'
          label="角色描述"

        ></el-table-column>

        <el-table-column
          label="操作"
          width='300px'
        >

          <template slot-scope='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size='mini'
              @click='showSetRightDialog(scope.row)'
            >分配权限</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close='setRightDialogClosed'
      >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key='id'
        :default-expand-all = true
        :default-checked-keys='defKeys'
        ref='treeRef'
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data:function(){
    return{
      roleList:[],
      setRightDialogVisible:false,
      //所有权限的数据
      rightsList:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[],
      roleId:''
    }
  },
  created(){
    this.getRoleList()
  },
  methods:{
    async getRoleList(){
      const {data:res} = await this.$http.get('roles')
       if(res.meta.status!==200){
         return this.$message.error('展示权限列表失败！')
       }

      this.roleList = res.data
    },
    async removeRightById(role,rightId){
      const confirmResult=await this.$confirm('确认删除该权限吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(confirmResult!=='confirm') {
        return this.$message.info('取消了删除')
      }
      const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status!==200){
        return this.$message.error('删除权限失败！')
      }
      role.children = res.data
    },
    async showSetRightDialog(role){
      this.roleId = role.id
      const {data:res} =await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message.error('获取权限数据失败！')
      }
      this.rightsList=res.data
      console.log(this.rightsList)
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>
        this.getLeafKeys(item,arr)
      )
    },
    //监听对话框关闭
    setRightDialogClosed(){
      this.defKeys=[]
    },
    //点击为角色分配权限
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')

      this.getRoleList()
      this.setRightDialogVisible = false

    },
  },
}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
