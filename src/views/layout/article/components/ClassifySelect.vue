<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCateService } from '@/api/article'

// 接受父组件下拉框的分类的值，回显下拉框的默认分类
const props = defineProps({
  defaultSelected: {
    type: [Number, String],
    default: null
  }
})

// 下拉框所有下拉选项
const selectedValue = ref([])

// 定义 emits，声明事件
const emit = defineEmits(['update:selected'])

// 下拉框默认选项
const selectedOption = ref(null)

// 初次挂载获取文章分类
onMounted(async () => {
  const res = await getCateService()
  selectedValue.value = res.data.data
  // 根据传入的 id 设置默认选项
  const defaultItem = selectedValue.value.find((item) => item.id === props.defaultSelected)
  if (defaultItem) {
    selectedOption.value = defaultItem.id
    console.log(defaultItem)
  }
})

// 赋值显示到下拉框，同时将 id 传递给父组件
const selected = (value) => {
  selectedOption.value = value

  // 查找选中的选项的对象
  const selectedItem = selectedValue.value.find((item) => item.id === value)
  // 如果找到选中的项，则将其 id 传递出去
  if (selectedItem) {
    emit('update:selected', { id: selectedItem.id })
  }
}

// 监听 props.defaultSelected 的变化，及时更新 selectedOption
watch(
  () => props.defaultSelected,
  (newVal) => {
    const defaultItem = selectedValue.value.find((item) => item.id === newVal)
    if (defaultItem) {
      selectedOption.value = defaultItem.id
    } else {
      selectedOption.value = null
    }
  }
)
</script>

<template>
  <!-- vue3中的v-model等于 :modelValue 和 @update:modelValue -->
  <el-select v-model="selectedOption" placeholder="请选择" @change="selected" clearable>
    <el-option
      v-for="item in selectedValue"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
