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
          clearable=""
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
    <div>
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreateUser">新增</el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleBatchDelete">删除</el-button>
      <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImportUser">导入</el-button>
    </div>

    <!-- 用户列表 -->
    <!-- data表示表格数据（与tableData.list绑定），selection-change表示表格的批量操作，sort-change表示表格的排序操作 -->
    <el-table
      :data="tableData.list"
      @selection-change="val => tableData.selection = val"
      @sort-change="handleSortChange"
    >
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
          <el-button type="text" size="small" icon="el-icon-delete" style="color: red;" @click="handleDelete([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- el-pagination分页器 -->
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
    <!-- :current-page.sync默认跳转为第二页 -->
    <!-- :page-sizes=每一页呈现行数 -->
    <!-- :page-size.sync默认每一页呈现行数 -->
    <!-- layout分页器布局 -->
    <!-- total页面总数？？？？？ -->
  </div>
</template>
<script>
export default {
  name: 'Users',
  data() {
    return {
      tableData: {
        name: '',
        minCreateTimer: '',
        maxCreateTime: '',
        list: [{
          id: 1,
          userName: 'zhangsan',
          trueName: '张三',
          roleList: [],
          createTime: '14:15',
          status: true
        },
        {
          id: 2,
          userName: 'lisi',
          trueName: '李四',
          roleList: [],
          createTime: '14:16',
          status: true
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
.data-picker {
  margin-right: 10px;
  width: 160px;
}
</style>
