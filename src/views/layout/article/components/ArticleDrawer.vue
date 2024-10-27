<script setup>
import { ref } from 'vue'
import ClassifySelect from './ClassifySelect.vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill' // 导入富文本编辑器
import '@vueup/vue-quill/dist/vue-quill.snow.css' //导入富文本编辑器主题样式
import { addArticleService, getArticleDetailService, editArticleDetailService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const dialogImageUrl = ref('') // 文件的url, 可用于判断上传框的关闭和图片的显示状态
const dialogVisible = ref(false) // 控制抽屉组件的弹出和关闭状态
const PreviewImg = ref(false) // 预览图片的状态
const hover = ref(false) // 控制悬停状态

// 默认的表单数据, 用于清除表单数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}

const originalData = ref(null) // 用于存储原始数据

// 表单数据
const formModel = ref({ ...defaultForm })

//提交之前检查数据是否修改
const isModified = () => {
  return JSON.stringify(formModel.value) !== JSON.stringify(originalData.value)
}

// 向父组件提供打开抽屉的方法
const open = async (row) => {
  dialogVisible.value = true
  if (row.id) {
    console.log('编辑回显')
    //获取文章详情
    const { data } = await getArticleDetailService(row.id)
    formModel.value = data.data
    // 存储初始数据, 进行深拷贝
    originalData.value = JSON.parse(JSON.stringify(data.data))
    console.log(originalData.value)

    //连接图片地址
    dialogImageUrl.value = baseURL + formModel.value.cover_img

    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(
      dialogImageUrl.value,
      formModel.value.cover_img
    )
    console.log(formModel.value.cover_img)
  } else {
    console.log('添加功能')
    formModel.value = { ...defaultForm }
    // 存储初始数据
    originalData.value = JSON.parse(JSON.stringify(defaultForm))
    console.log(originalData.value)
  }
}

//封装一个函数，基于 axios， 网络图片地址，转 file 对象
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

//抽屉组件关闭清除表单数据
const handleClose = () => {
  dialogImageUrl.value = ''
  formModel.value = { ...defaultForm }
  dialogVisible.value = false
}

//图片上传
const onUploadFile = (uploadFile) => {
  console.log('上传文件:', uploadFile) // 调试信息
  if (uploadFile.raw && uploadFile.raw.type.startsWith('image/')) {
    dialogImageUrl.value = URL.createObjectURL(uploadFile.raw)
    formModel.value.cover_img = uploadFile.raw //是一个file对象
    console.log('生成的图片URL:', dialogImageUrl.value) // 调试信息
  } else {
    ElMessage({ message: '请上传一个有效的图片文件。', type: 'error' })
  }
}

// 处理文件删除
const handleRemove = () => {
  console.log('删除文件') // 调试信息
  dialogImageUrl.value = '' // 清空URL，重新显示加号按钮
}

//处理下拉框子组件传递的id, 筛选数据, 将选中的分类id赋值给传递参数
const handleSelection = (value) => {
  formModel.value.cate_id = value.id
}

//文章提交
const emit = defineEmits(['success'])
const submit = async (state) => {
  // 判断是否修改
  if (!isModified()) {
    ElMessage({
      message: formModel.value.id
        ? '未检测到修改内容，请修改后再提交。'
        : '未检测到新增内容，请新增后再提交。',
      type: 'info'
    })
    return
  }

  // 将已发布还是草稿状态，存入 state
  formModel.value.state = state

  // 转换 formData 数据
  const formData = new FormData()
  for (let key in formModel.value) {
    formData.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    console.log('编辑操作')
    // 发送请求
    try {
      await editArticleDetailService(formData)
      ElMessage({
        message: `${state === '草稿' ? '草稿保存成功' : '文章编辑成功'}`,
        type: 'success'
      })
      // 关闭弹窗
      dialogVisible.value = false
      // 重置表单数据
      formModel.value = { ...defaultForm }
      dialogImageUrl.value = ''
      emit('success', 'edit')
    } catch (error) {
      ElMessage({ message: `提交失败: ${error.message}`, type: 'error' })
    }
  } else {
    // 发送请求
    try {
      await addArticleService(formData)
      ElMessage({
        message: `${state === '草稿' ? '草稿保存成功' : '文章发布成功'}`,
        type: 'success'
      })
      // 关闭弹窗
      dialogVisible.value = false
      // 重置表单数据
      formModel.value = { ...defaultForm }
      dialogImageUrl.value = ''
      emit('success', 'add')
    } catch (error) {
      ElMessage({
        message: `提交失败: ${error.message}`,
        type: 'error'
      })
    }
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="dialogVisible"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    :direction="ltr"
    size="50%"
    :before-close="handleClose"
  >
    <el-form :model="formModel" label-width="100px">
      <!-- 文章标题 -->
      <el-form-item label="文章标题">
        <el-input v-model="formModel.title" placeholder="请输入文章标题" />
      </el-form-item>

      <!-- 文章分类 -->
      <el-form-item label="文章分类">
        <classify-select
          :defaultSelected="formModel.cate_id"
          @update:selected="handleSelection"
          :key="dialogVisible"
        ></classify-select>
      </el-form-item>

      <!-- 文章封面上传 -->
      <el-form-item label="文章封面">
        <!-- 限制只能上传一张图片 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUploadFile"
          :on-remove="handleRemove"
          :disabled="!!dialogImageUrl"
          ><!-- 图片上传后禁用上传功能 -->

          <!-- 上传按钮，当上传图片后销毁 -->
          <template v-if="!dialogImageUrl">
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </template>
        </el-upload>

        <!-- 上传图片后显示上传的图片，并提供删除和预览功能 -->
        <template v-if="dialogImageUrl">
          <div class="image-container" @mouseenter="hover = true" @mouseleave="hover = false">
            <img
              class="avatar"
              :src="dialogImageUrl"
              alt="Uploaded Image"
              height="100%"
              width="100%"
              :style="{ borderRadius: '6px' }"
            />
            <!-- 覆盖在图片上的操作图标，当鼠标悬停时显示 -->
            <div v-if="hover" class="image-actions">
              <span class="action-icon" @click="PreviewImg.value = true">
                <el-icon><ZoomIn /></el-icon>
              </span>
              <span class="action-icon" @click="handleRemove">
                <el-icon><Delete /></el-icon>
              </span>
            </div>
          </div>
        </template>

        <!-- 图片预览对话框 -->
        <el-dialog v-model="PreviewImg">
          <img class="full-image" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <!-- 文章内容 -->
      <el-form-item label="文章内容">
        <QuillEditor
          :key="dialogVisible"
          v-model:content="formModel.content"
          contentType="html"
          theme="snow"
        />
      </el-form-item>

      <!-- 提交 -->
      <el-form-item>
        <el-button type="primary" @click="submit('已发布')">提交</el-button>
        <el-button type="info" @click="submit('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast); //按钮外面的虚线动画
    }
    .el-upload:hover {
      border-color: var(--el-color-primary); //按钮外面的虚线动画，变蓝
    }
    //图片上传按钮的样式
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }
  }
}

.image-container {
  position: relative;
  display: inline-block;
  width: 178px;
  height: 178px;
}

//鼠标悬停时的蒙层
.image-actions {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  align-items: center;
  opacity: 0;
  transition: opacity 0.5s;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.image-container:hover .image-actions {
  opacity: 1;
}

.action-icon {
  color: white;
  cursor: pointer;
  font-size: 24px;
}

.full-image {
  width: 100%;
}

//富文本编辑器
:deep() {
  .ql-container.ql-snow {
    width: 100%;
    height: 200px;
  }
  .ql-toolbar.ql-snow {
    width: 100%;
  }
}
</style>
