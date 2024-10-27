<script setup>
import { ref } from 'vue'
import { getArticleDetailService } from '@/api/article'
import { timeFormat } from '@/utils/format'
import { baseURL } from '@/utils/request'
const drawer = ref(false)
const time = ref('') // Added ref for time
const dialogImageUrl = ref('')
const ArticleDetail = ref({}) //文章详情的id

// 向父组件提供打开抽屉的方法
const open = async (row) => {
  drawer.value = true
  //获取文章详情
  try {
    const res = await getArticleDetailService(row.id)
    ArticleDetail.value = res.data.data
    dialogImageUrl.value = baseURL + ArticleDetail.value.cover_img
    time.value = timeFormat(ArticleDetail.value.pub_date)
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="drawer" :direction="ltr" size="50%" title="文章预览">
    <template #default>
      <h1>{{ ArticleDetail.title }}</h1>
      <header>
        <div>作者：{{ ArticleDetail.username }}</div>
        <div>发布时间：{{ time }}</div>
        <div>文章分类：{{ ArticleDetail.cate_name }}</div>
      </header>
      <br />
      <img :src="dialogImageUrl" alt="image" />
      <main>
        <p>文章内容：</p>
        <p v-html="ArticleDetail.content"></p>
      </main>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
