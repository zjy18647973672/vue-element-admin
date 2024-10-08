<template>
  <div class="dashboard-container">

    <!-- 用户查找操作栏 -->
    <el-form :model="tableData" label-width="80px" :inline="true" size="small">
      <!-- :model等价于v-bind:modol，是把父组件的数据传至子组件；v-model是父子组件数据的双向绑定 -->
      <!-- :inline使该form表格在一行内呈现 -->
      <el-form-item label="用户名称">
        <el-input
          v-model="tableData.name"
          placeholder="请输入用户名称"
          clearable
        />
        <!-- clearable表示一键清楚文本选项 -->
      </el-form-item>
      <el-form-item label="创建时间">
        <!-- 时间选择器data-picker -->
        <el-date-picker
          v-model="tableData.minCreateTime"
          type="datetime"
          placeholder="起始时间"
          class="data-picker"
        />
        <!-- type="datatime"表示即有日期，也有时间 -->
        <el-date-picker
          v-model="tableData.maxCreateTime"
          type="datetime"
          placeholder="截止时间"
          class="data-picker"
        />
      </el-form-item>
      <el-form-item>
        <!-- 搜素与重置按钮 -->
        <!-- button中type表示按钮类型，icon控制图标 -->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getUserList">搜素</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户增删操作栏 -->
    <div id="div_button">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreateUser">新增</el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleBatchDelete">删除</el-button>
      <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImportUser">导入</el-button>
    </div>

    <!-- 用户列表 -->
    <el-table
      :data="tableData.list"
      stripe
      @selection-change="val => tableData.selection = val"
      @sort-change="handleSortChange"
    >
      <!-- data表示表格数据（与tableData.list绑定），selection-change表示表格的批量操作，sort-change表示表格的排序操作，stripe设置样式带斑马纹 -->
      <el-table-column type="index" width="60" />
      <!-- type="index"显示该行的序号 -->
      <el-table-column type="selection" width="50" />
      <!-- type="selection"显示该行是否被勾选 -->
      <el-table-column width="50">
        <template slot-scope="scope">
          <!-- slot-scope="scope"可以添加相关属性值 -->
          <!-- <img class="table-avatar" :src="scope.row.avatar" /> -->
          <!-- 直接使用:src绑定会导致刷新失败 -->
          <img :id="'avatar-' + scope.row.id" class="table-avatar">
        </template>
      </el-table-column>
      <!-- sortable="custom"使该列可以被排序 -->
      <el-table-column prop="userName" label="用户名" sortable="custom" />
      <el-table-column prop="trueName" label="真实姓名" sortable="custom" />
      <el-table-column prop="roleList" label="角色" sortable="custom" />
      <el-table-column prop="createTime" label="创建时间" sortable="custom" />
      <el-table-column prop="status" label="是否激活" sortable="custom" width="100">
        <template slot-scope="scope">
          <!-- :active-value="1" 默认激活状态为1 -->
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleSwitch(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" style="color: red;" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page.sync="tableData.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="tableData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      @size-change="getUserList"
      @current-change="getUserList"
    />
    <!-- el-pagination分页器 -->
    <!-- :current-page.sync默认跳转为第二页 -->
    <!-- :page-sizes=每一页呈现行数 -->
    <!-- :page-size.sync默认每一页呈现行数 -->
    <!-- layout分页器布局 -->
    <!-- total页面总数 -->

    <!-- 用户编辑/创建窗口 -->
    <el-dialog class="user-edit-dialog" :title="userEditForm.id ? ' 用户编辑' : ' 新增用户'" :visible.sync="userEditDialogVisible" width="50%" top="8vh">
      <!-- :title="userEditForm.id ? '用户编辑' : '新增用户'" 对当前表单的id进行判断，若存在，则为新增用户，否则为用户编辑 -->
      <!-- :visible.sync="userEditDialogVisible"默认用户编辑/创建窗口是否呈现与userEditDialogVisible的真假有关 --><!-- ref获取userEditForm组件的引用 -->
      <el-form
        ref="userEditForm"
        status-icon
        :model="userEditForm"
        label-width="80px"
        :rules="userEditForm.id ? userUpdateRules : usercreateRules"
      >
        <!-- :rules表单的验证规则：编辑用户的规则or新增用户的规则 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userEditForm.userName" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="trueName">
          <el-input v-model="userEditForm.trueName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userEditForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userEditForm.email" />
        </el-form-item>
        <!-- radio-group多选项圆形选择栏 -->
        <el-form-item label="性别">
          <el-radio-group v-model="userEditForm.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="userEditForm.address" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userEditForm.introduction" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userEditForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <!-- select下拉多选框 -->
          <el-select v-model="userEditForm.roleIds" multiple placeholder="请选择角色">
            <el-option v-for="role in allRoles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="file => handleAvatarChange(file)"
          >
            <!-- <img v-if="avatarUploadData.url" :src="avatarUploadData.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
          </el-upload>
          <!-- <el-button v-if="avatarUploadData.raw" size="mini" @click="resetUploadData(false)">重置</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户导入窗口 -->
    <el-dialog class="user-import-dialog" :title="' 导入用户'" :visible.sync="userImportDialogVisible" width="80%" top="8vh">
      <!-- 下载示例文件与上传文件按钮 -->
      <div>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleDownloadModel">下载示例文件</el-button>
        <el-button type="primary" size="mini" @click="handleUploadExcel">点击上传excel</el-button>
      </div>

      <!-- 导入文件内容 -->
      <el-table
        :data="importtableData.list"
        border
      >
        <el-table-column type="selection" width="40" />
        <el-table-column type="id" label="序号" width="70" />
        <el-table-column prop="userName" label="用户名" width="100" />
        <el-table-column prop="trueName" label="真实姓名" width="100" />
        <el-table-column prop="password" label="密码" width="130" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="address" label="地址" width="100" />
        <el-table-column prop="introduction" label="简介" width="150" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="roleIds" label="角色" width="150" />
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="userImportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="importAllUsers">导入全部</el-button>
        <el-button type="primary" @click="importChosenUsers">导入已选择用户</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import * as UserApi from '@/api/user'
import axios from '@/axios'
import md5 from 'js-md5'
export default {
  name: 'Users',
  data() {
    return {
      tableData: {
        name: '',
        minCreateTime: '',
        maxCreateTime: '',
        list: [],
        selection: '',
        pageNum: 1,
        pageSize: 10,
        total: 1
      },
      importtableData: {
        list: []
      },
      userEditForm: {
        id: '',
        userName: '',
        trueName: '',
        password: '',
        email: '',
        gender: '',
        address: '',
        introduction: '',
        phone: '',
        roleIds: []
      },
      userImportForm: {
        id: '',
        index: '',
        userName: '',
        trueName: '',
        password: '',
        email: '',
        gender: '',
        address: '',
        introduction: '',
        phone: '',
        roleIds: []
      },
      userEditDialogVisible: false,
      userImportDialogVisible: false,
      allRoles: [], // 系统内角色列表
      usercreateRules: {
        userName: [{ required: true, trigger: 'blur', validator: this.userNameValidator }],
        password: [{ required: true, trigger: 'change', validator: this.passwordValidator }],
        roleIds: [{ required: true, trigger: 'change', validator: this.roleValidator }]
      },
      userUpdateRules: {
        userName: [{ required: true, trigger: 'blur', validator: this.userNameValidator }],
        password: [{ trigger: 'change', validator: this.passwordValidator }],
        roleIds: [{ required: true, trigger: 'change', validator: this.roleValidator }]
      },
      currentEditRow: null
    }
  },
  mounted() {
    // 打开网页时默认获取用户、角色列表
    this.getUserList()
    this.getAllRoles()
  },
  methods: {
    /**
     *  获取用户列表
     */
    getUserList() {
      // 学姐方法
      // UserApi.getUsers(this.tableData).then(res => {
      //   this.tableData.list = res.data.data.content
      //   this.tableData.total = res.data.data.totalElements
      //   // 更新头像
      //   // this.$nextTick(() => {
      //   //   this.tableData.list.forEach(row => {
      //   //     this.getAvatar(row.id, row)
      //   //   })
      //   // })
      // })
      axios.get('/users/getUserList', {
        params: {
          userName: this.tableData.name, // 指定需要查找的用户名
          minCreateTime: this.tableData.minCreateTime, // 指定需要查找的最小时间
          maxCreateTime: this.tableData.maxCreateTime, // 指定需要查找的最大时间
          pageNum: this.tableData.pageNum, // 指定检索的页码
          pageSize: this.tableData.pageSize // 指定每页数据数
        }
      })
        .then(response => {
          // 连接后端数据，返回列表值，总数，页面数据数，当前页码
          this.tableData.list = response.data.data.records
          this.tableData.total = response.data.data.total
        })
        .catch(error => {
          console.log(error = '从后端获取用户数据失败')
        })
    },
    /**
     * 获取角色列表
     */
    getAllRoles() {
      axios.get('/roles/getRoleList')
        .then(response => {
          // 连接后端数据，返回列表值，总数，页面数据数，当前页码
          this.allRoles = response.data.data
        })
        .catch(error => {
          console.log(error = '从后端获取角色数据失败')
        })
    },
    /**
     * 用户名验证函数
     */
    userNameValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (this.userEditForm.id && value === this.currentEditRow.userName) {
        // 编辑用户情况
        callback()
      } else {
        // 使用接口判断用户名是否重名
        // checkUserName(value).then(res => {
        //   callback(res.data.data ? new Error('用户名已存在') : undefined)
        // })
        axios.get('/users/checkUserName', {
          params: {
            userName: value
          }
        })
          .then(response => {
            callback(response.data.data ? new Error('用户名已存在') : undefined)
          })
          .catch(error => {
            console.log(error = '从后端获取角色数据失败')
          })
      }
    },
    /**
     * 密码验证函数
     */
    passwordValidator(rule, value, callback) {
      if (!value && this.userEditForm.id) {
        callback()
      } else if (!value || value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    },
    /**
     * 角色验证函数
     */
    roleValidator(rule, value, callback) {
      if (!value || value.length === 0) {
        callback(new Error('角色不能为空'))
      } else {
        callback()
      }
    },
    /**
     * 新增用户：使新增用户窗口出现
     */
    handleCreateUser() {
      // 使角色编辑窗口的所有内容为空
      for (const key in this.userEditForm) {
        this.userEditForm[key] = ''
      }
      // 打开角色编辑窗口
      this.openUserEditDialog()
    },
    /**
     * 打开用户编辑窗口
     */
    openUserEditDialog() {
      // 使窗口可见
      this.userEditDialogVisible = true
      // 清除表单的验证？
      this.$nextTick(() => {
        this.$refs.userEditForm.clearValidate() // Clear form validation
      })
    },
    /**
     * 批量删除用户
     */
    handleBatchDelete() {
      if (!this.tableData.selection) {
        this.$message.warning('请选择要删除的用户')
        return // 退出函数，不执行删除操作
      }

      // 将tableData.selection中的id提取出来，传递给handleDelete
      const idList = this.tableData.selection.map(item => item.id).join(',')
      this.$confirm('此操作将永久删除用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 对接删除用户接口
        axios.delete('/users/deleteUsers', {
          params: {
            ids: idList
          }
        })
          .then(response => {
            this.$message.success('删除用户成功')
            console.log('success', response.data)
            this.getUserList()
          })
          .catch(error => {
            this.$message.warning('删除用户失败')
            console.log(error = '删除用户失败')
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    /**
     * 导入用户
     */
    handleImportUser() {
      this.userImportDialogVisible = true
    },
    /**
     * 切换用户账号激活状态
     */
    handleSwitch() {

    },
    /**
     * 编辑用户信息：将当前行的信息传递进来，并进入编辑页面
     */
    handleEdit(row) {
      this.currentEditRow = row
      // 传入当前行信息，即当前用户的信息
      for (const key in this.userEditForm) {
        this.userEditForm[key] = row[key]
      }
      this.userEditForm.roleIds = row.roleList ? row.roleList.map(item => {
        const role = this.allRoles.find(role => role.name === item)
        return role && role.id
      }) : []
      this.userEditForm.roleIds.filter(id => id)
      this.openUserEditDialog()
    },
    /**
     * 删除用户信息（单个）
     */
    handleDelete(userIds) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 对接删除用户接口
        axios.delete('/users/deleteUsers', {
          params: {
            ids: userIds
          }
        })
          .then(response => {
            this.$message.success('删除用户成功')
            console.log('success', response.data)
            this.getUserList()
          })
          .catch(error => {
            this.$message.warning('删除用户失败')
            console.log(error = '删除用户失败')
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    /**
     * 重置查询条件
     */
    resetQuery() {
      this.tableData.name = ''
      this.tableData.minCreateTime = ''
      this.tableData.maxCreateTime = ''
      this.getUserList()
    },
    /**
     * 对列进行排序
     */
    handleSortChange({ prop, order }) {
      // 需添加参数传入指定的列以及排序方式以确定orderBy和orderMethods（注：未成功！！！）
      axios.get('/users/getUserList', {
        params: {
          userName: this.tableData.name, // 指定需要查找的用户名
          minCreateTime: this.tableData.minCreateTime, // 指定需要查找的最小时间
          maxCreateTime: this.tableData.maxCreateTime, // 指定需要查找的最大时间
          orderBy: prop,
          orderMethod: order,
          pageNum: this.tableData.pageNum, // 指定检索的页码
          pageSize: this.tableData.pageSize // 指定每页数据数
        }
      })
        .then(response => {
          // 连接后端数据，返回列表值，总数，页面数据数，当前页码
          this.tableData.list = response.data.data.records
          this.tableData.total = response.data.data.total
        })
        .catch(error => {
          console.log(error = '从后端获取用户数据失败')
        })
    },
    /**
     * 添加或更新用户
     */
    addOrUpdateUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          // 如果验证通过就调用添加或者更新用户的接口
          // 将编辑窗口的数据获取至params
          const params = { ...this.userEditForm }
          // 获取角色Id（注，userEditForm没有roleIdList元素，但user中需要roleIdList元素，故手动添加params的roleIdList元素
          params.roleIdList = params.roleIds
          this.userEditForm.roleIds.filter(id => id)
          // 使用md5加密传输密码（注释掉即为正常密码）
          if (!params.password) {
            delete params.password
          } else {
            params.password = md5(params.password)
          }
          if (this.userEditForm.id) {
            axios.put('/users/updateUserInfo', params)
              .then(response => {
                this.$message.success('更新用户成功')
                console.log('success', response.data)
                this.getUserList()
              })
              .catch(error => {
                this.$message.warning('更新用户失败')
                console.log('Error', error)
              })
          } else {
            axios.post('/users/addOneUser', params)
              .then(response => {
                this.$message.success('添加用户成功')
                console.log('success', response.data)
                this.getUserList()
              })
              .catch(error => {
                this.$message.warning('添加用户失败')
                console.log('Error', error)
              })
          }
          // const tempApi = this.userEditForm.id ? UserApi.updateUser : UserApi.addUser
          this.userEditDialogVisible = false
        }
      })
    },
    importAllUsers() {
      this.$message.info('敬请期待...')
    },
    importChosenUsers() {
      this.$message.info('敬请期待...')
    },
    handleDownloadModel() {
      this.$message.info('敬请期待...')
    },
    handleUploadExcel() {
      this.$message.info('敬请期待...')
    }
  }
}
</script>

<!-- scoped：当前样式只对本页面生效 -->
<style scoped>
.el-form {
  margin-top: 10px;
}
.data-picker {
  margin-right: 10px;
  width: 160px;
}
.el-table {
  margin: 10px 5px;
}
.el-pagination {
  display: flex;
  justify-content: center;
  margin: 10px ;
}
#div_button {
  margin-left: 10px;
}
</style>
