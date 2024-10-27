<script setup>
import { ref } from 'vue'
import { addCateService, editCateService } from '@/api/article'

const dialogVisible = ref(false) //弹框状态
const fromEl = ref() //表单实例
//表单数据
const form = ref({
  cate_name: '',
  cate_alias: ''
})

//记录初始值
const oldform = ref({
  Cate_name: '',
  Cate_alias: ''
})

//触发自定义事件，让父组件重新获取文章列表
const emit = defineEmits(['reGetList'])

//打开弹窗，同时通过传入{}和row数据判断弹框数据是否回显
const open = async (row) => {
  dialogVisible.value = true
  form.value = { ...row } // 使用浅拷贝创建新对象
  oldform.value = { ...row } // 记录初始值
}

//按取消,给输入框复制一开始打开输入框的内容,数据复原
const cancelEvent = () => {
  dialogVisible.value = false
  form.value = { ...oldform.value }
}

//文章分类提交
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      //判断是添加还是编辑,id存在就是编辑，不存在就是添加
      if (form.value.id) {
        //验证输入框内容是否有修改
        if (
          form.value.cate_name === oldform.value.cate_name &&
          form.value.cate_alias === oldform.value.cate_alias
        ) {
          ElMessage.warning('未做修改')
          return
        } else {
          editCateService(form.value).then((res) => {
            if (res.data.code === 0) {
              ElMessage.success('编辑成功')
              dialogVisible.value = false
              emit('reGetList')
            } else {
              ElMessage.error(`error submit! ${JSON.stringify(res.data.message)}`)
            }
          })
        }
      } else {
        //添加分类提交
        addCateService(form.value).then((res) => {
          if (res.data.code === 0) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            form.value = {
              cate_name: '',
              cate_alias: ''
            }
            emit('reGetList')
          } else {
            ElMessage.error(`error submit! ${JSON.stringify(res.data.message)}`)
          }
        })
      }
    } else {
      ElMessage.error('error submit!')
    }
  })
}

//输入框表单验证
const rules = ref({
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^[\S]{1,8}$/, message: '长度在 1 到 8 个字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '长度在 1 到 10 个字符',
      trigger: 'blur'
    }
  ]
})

//暴露open函数供父组件调用
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="form.id ? '编辑分类' : '添加分类'" width="30%">
    <div>
      <el-form
        ref="fromEl"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
        status-icon
      >
        <el-form-item prop="cate_name" label="分类名称">
          <el-input
            v-model="form.cate_name"
            placeholder="请输入分类名称"
            maxlength="8"
            show-word-limit
          />
        </el-form-item>
        <el-form-item prop="cate_alias" label="分类别名">
          <el-input
            v-model="form.cate_alias"
            placeholder="请输入分类别名"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="submitForm(fromEl)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
