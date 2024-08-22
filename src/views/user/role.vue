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
      @selection-change="val => tableData.selection = val"
      @sort-change="handleSortChange"
    >
      <!-- data表示表格数据（与tableData.list绑定），selection-change表示表格的批量操作，sort-change表示表格的排序操作，stripe设置样式带斑马纹 -->
      <el-table-column type="index" width="60" />
      <el-table-column type="selection" width="50" />
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
        selection: '',
        pageNum: 1,
        pageSize: 10,
        total: 1
      }
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
</style>
