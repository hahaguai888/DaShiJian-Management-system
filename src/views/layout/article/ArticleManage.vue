<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import ClassifySelect from './components/ClassifySelect.vue' //导入下拉框组件
import ArticleDrawer from './components/ArticleDrawer.vue' //导入抽屉组件
import ArticleDetail from './components/ArticleDetail.vue' //导入抽屉文章详情组件
import ArticleDelete from './components/ArticleDelete.vue' //导入删除按钮组件
import { getListService } from '@/api/article'
import { timeFormat } from '@/utils/format' //时间格式化

const loading = ref(false) //loading的状态

//构造获取文章列表的传递参数
const params = ref({
  pagenum: 1, //当前页数
  pagesize: 4, //每页条数
  cate_id: '', //文章分类的id
  state: '' //文章状态
})

//文章的表格数据
const tableData = ref([])
//文章总条数
const total = ref()

//抽屉组件实例
const drawerRef = ref()
//文章详情抽屉组件实例
const detailRef = ref()

//向抽屉组件传递参数，打开抽屉
const openDrawer = (row) => {
  drawerRef.value.open(row)
}

//向文章详情抽屉组件传递参数，打开抽屉
const openDetailDrawer = (row) => {
  detailRef.value.open(row)
}

//获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await getListService(params.value)
  tableData.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

// 首次加载时获取数据
onMounted(() => {
  getArticleList()
})

const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = null
  params.value.state = ''
  getArticleList()
}

//处理下拉框子组件传递的id, 筛选数据, 将选中的分类id赋值给传递参数
const handleSelection = (value) => {
  params.value.cate_id = value.id
}

//分页变更逻辑处理, 当每页总条数变化传递1进去, 当页码变化传递点击当前页的val进去
const handPageChange = async (val) => {
  loading.value = true
  params.value.pagenum = val
  await getArticleList()
  loading.value = false
}

// 添加文章成功跳转页数，跳转到最后一页
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container>
    <template #title>文章管理</template>
    <template #extra>
      <el-button type="primary" @click="openDrawer({})">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="文章分类：">
        <classify-select
          :defaultSelected="params.cate_id"
          @update:selected="handleSelection"
        ></classify-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" placeholder="请选择" clearable>
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; height: 100%"
      size="large"
      :row-style="{ height: '70px' }"
      v-loading="loading"
    >
      <el-table-column prop="title" label="文章标题" width="350">
        <template #default="{ row }">
          <el-link type="primary" @click="openDetailDrawer(row)" :underline="false">{{
            row.title
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <!-- prop="pub_date"不用删除，将作为默认的时间数据显示 -->
        <template #default="{ row }">
          {{ timeFormat(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" @click="openDrawer(scope.row)" :icon="Edit" circle plain />
          <!-- 删除文章分类组件 -->
          <ArticleDelete :scope="scope.row" @reGetList="getArticleList"></ArticleDelete>
        </template>
      </el-table-column>

      <!-- 使用 empty 插槽实现无数据状态 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      size="default"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handPageChange(1)"
      @current-change="handPageChange"
      :style="{ 'margin-top': '20px', 'justify-content': 'flex-end' }"
    />
  </page-container>
  <!-- 抽屉组件 -->
  <article-drawer ref="drawerRef" @success="onSuccess"></article-drawer>
  <article-detail ref="detailRef"></article-detail>
</template>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
