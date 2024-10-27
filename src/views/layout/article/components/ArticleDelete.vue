<template>
  <el-popconfirm
    confirm-button-text="Yes"
    cancel-button-text="No"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="确认删除该分类吗?"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
    <template #reference>
      <el-button type="danger" :icon="Delete" circle plain />
    </template>
  </el-popconfirm>
</template>

<script setup>
import { InfoFilled, Delete } from '@element-plus/icons-vue'
import { deleteCateService } from '@/api/article' //导入删除文章分类api
import { deleteArticleService } from '@/api/article' //导入删除文章api

//接受删除行所在id
const props = defineProps({
  scope: Object
})

//触发自定义事件，让父组件重新获取文章列表
const emit = defineEmits(['reGetList'])

// 封装删除操作
const deleteItem = async (deleteService, id) => {
  try {
    const res = await deleteService(String(id))
    if (res.data.code === 0) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 删除事件提交
const confirmEvent = async () => {
  const { id, title } = props.scope
  const deleteService = title ? deleteArticleService : deleteCateService
  await deleteItem(deleteService, id)
  // 重新获取文章列表
  emit('reGetList')
}
</script>
