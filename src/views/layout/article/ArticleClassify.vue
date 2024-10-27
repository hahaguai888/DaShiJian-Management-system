<script setup>
import { Edit } from '@element-plus/icons-vue'
import { getCateService } from '@/api/article'
import { ref, onMounted } from 'vue'
import ArticleDialog from './components/ArticleDialog.vue'
import ArticleDelete from './components/ArticleDelete.vue'

const tableData = ref([]) //列表数据储存
const loading = ref(false) //加载框状态判断
const dialog = ref() //获取弹框实例

//获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await getCateService()
  tableData.value = res.data.data
  loading.value = false
}

// 首次加载时获取数据
onMounted(() => {
  getArticleList()
})

//打开弹窗, 向弹窗小组件提供数据
const onChangeChannel = (row) => {
  dialog.value.open(row)
}
</script>

<template>
  <page-container>
    <template #title>文章分类</template>
    <template #extra>
      <el-button type="primary" @click="onChangeChannel({})">添加分类</el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%; height: 100%"
      size="large"
      :row-style="{ height: '70px' }"
      reserve-selection="false"
    >
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" @click="onChangeChannel(scope.row)" :icon="Edit" circle plain />
          <!-- 删除文章分类组件 -->
          <ArticleDelete :scope="scope.row" @reGetList="getArticleList"></ArticleDelete>
        </template>
      </el-table-column>

      <!-- 使用 empty 插槽实现无数据状态 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>
  <!-- 弹窗 -->
  <ArticleDialog ref="dialog" @reGetList="getArticleList"></ArticleDialog>
</template>
