<template>
  <el-row class="warp">
    <el-col :span="24"
            class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main"
            v-loading="loading"
            element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24"
              class="toolbar"
              style="padding-bottom: 0px;">
        <el-form :inline="true"
                 :model="filters">
          <el-form-item>
            <el-input v-model="filters.name"
                      placeholder="请输入域账号"
                      @keyup.enter.native="search1">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="search1">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="books"
                style="width: 100%;margin-bottom: 20px;"
                row-key="domain_id"
                border
                lazy
                :tree-props="{children: 'items', hasChildren: 'hasChildren'}">"
        >
        <el-table-column prop="domain_id" label="id" sortable></el-table-column>
        <el-table-column prop="name" label="姓名" sortable></el-table-column>
        <el-table-column prop="domain" label="域账号" sortable></el-table-column>
        <el-table-column prop="email" label="邮箱" sortable></el-table-column>
        <el-table-column prop="phone" label="电话" sortable></el-table-column>
        <el-table-column prop="is_active" label="状态" sortable>
          <template slot-scope="scope">
            {{ scope.row.is_active === true ? '在职' : '离职' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-if="scope.$index,scope.row.domain[1]==='-'" type="success" size="small"
                         @click="showEditDialog(scope.$index,scope.row)">续期
              </el-button>
            </el-button-group>
          </template>

        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import API from '../../api/api_tuser';

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      books: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      sels: [], //列表选中列

      //编辑相关数据
      editFormVisible: false,//编辑界面是否显示
      editFormRules: {
        domain_id: [
          {required: true, message: '请输入id', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        domain: [
          {required: true, message: '请输入域账号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入电话', trigger: 'blur'}
        ]
      },
      editForm: {
        domain_id: 0,
        name: '',
        domain: '',
        email: '',
        phone: '',
        is_active: true
      },
      //新增相关数据
      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        domain_id: [
          {required: true, message: '请输入id', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        domain: [
          {required: true, message: '请输入域账号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入电话', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        author: '',
        publishAt: '',
        description: ''
      }
    }
  },
  methods: {
    search1() {
      if (this.filters.name !== "") {
        this.searchByname();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    searchByname() {
      let that = this;
      API.findById(that.filters.name).then((result) => {
        if (result.detail) {
          that.$message.warning({showClose: true, message: '未查到此用户', duration: 2000});
        } else if (result) {
          that.books = [];
          that.books.push(result);
          console.log(that.books)
        }
      }, function (err) {
        that.$message.error({showClose: true, message: err.toString(), duration: 2000});
      }).catch(function (error) {
        that.loading = false;
        console.log(error);
        that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
      });
    },
    search() {
      let that = this;
      let params = {
        page: that.page,
        limit: 10,
        name: that.filters.name
      };

      that.loading = true;
      API.findList(params).then(function (result) {
        that.loading = false;
        if (result && result.items) {
          console.log(result)
          that.total = result.total;
          that.books = result.items;
        }
      }, function (err) {
        that.loading = false;
        that.$message.error({showClose: true, message: '未查到此用户', duration: 2000});
      }).catch(function (error) {
        that.loading = false;
        console.log(error);
        that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
      });
    },
    //显示编辑界面
    showEditDialog: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
  },
  mounted() {
    this.handleSearch()
  }
}
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>
