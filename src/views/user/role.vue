<template>
  <div class="dashboard-container">
    <!-- 角色查找操作栏 -->
    <el-form :model="tableData" label-width="80px" :inline="true" size="small">
      <!-- :model等价于v-bind:modol，是把父组件的数据传至子组件；v-model是父子组件数据的双向绑定 -->
      <!-- :inline使该form表格在一行内呈现 -->
      <el-form-item label="搜索内容">
        <el-input
          v-model="tableData.name"
          placeholder="请输入搜索内容"
          clearable=""
        />
        <!-- clearable表示一键清楚文本选项 -->
      </el-form-item>
      <el-form-item>
        <!-- 搜素与重置按钮 -->
        <!-- button中type表示按钮类型，icon控制图标 -->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getRoleList">搜素</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreateRole">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 角色列表 -->
    <el-table
      :data="tableData.list"
      stripe
      @sort-change="handleSortChange"
    >
      <!-- data表示表格数据（与tableData.list绑定），selection-change表示表格的批量操作，sort-change表示表格的排序操作，stripe设置样式带斑马纹 -->
      <el-table-column type="index" width="60" />
      <el-table-column prop="name" label="角色名称" sortable="custom" />
      <el-table-column prop="description" label="角色描述" sortable="custom" />
      <el-table-column prop="createTime" label="创建时间" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" sortable="custom" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" style="color: red;" @click="handleDelete([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page.sync="tableData.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="tableData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      @size-change="startPagination"
      @current-change="startPagination"
    />

    <!-- 用户编辑/创建窗口 -->
    <el-dialog class="role-edit-dialog" :title="roleEditForm.id ? ' 新增角色' : ' 角色编辑'" :visible.sync="roleEditDialogVisible" width="50%" top="8vh">
      <el-form
        ref="roleEditForm"
        :model="roleEditForm"
        label-width="80px"
        :rules="roleEditFormRules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleEditForm.Name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleEditForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Roler',
  data() {
    return {
      tableData: {
        searchContent: '',
        list: [{
          id: 1,
          description: '描述',
          createTime: '',
          updateTime: ''
        }],
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      roleEditForm: {
        id: '',
        name: '',
        description: ''
      },
      roleEditFormRules: {
        name: [
          { required: true, trigger: 'blur', validator: this.validateName }
        ]
      },
      roleEditDialogVisible: false
    }
  },
  methods: {
    /**
     * 新增角色
     */
    handleCreateRole() {
      // 使角色编辑窗口的所有内容为空
      for (const key in this.roleEditForm) {
        this.roleEditForm[key] = ''
      }
      // 打开角色编辑窗口
      this.openRoleEditDialog()
    },
    /**
     * 打开角色编辑窗口
     */
    openRoleEditDialog() {
      // 使窗口可见
      this.roleEditDialogVisible = true
      // 清除表单的验证？
      this.$nextTick(() => {
        this.$refs.roleEditForm.clearable()
      })
    },
    /**
     * 删除角色
     * @param {Number} id
     */
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 对接删除用户接口
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    /**
     * 编辑角色
     */
    handleEdit(row) {
      for (const key in this.roleEditForm) {
        this.roleEditForm[key] = row[key]
      }
      this.openRoleEditDialog()
    }
  }
}
</script>

<!-- scoped：当前样式只对本页面生效 -->
<style scoped>
.el-form {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-pagination {
  margin-left: 10px;
}
</style>
