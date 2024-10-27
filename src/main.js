import '@/assets/main.scss'
import { createApp } from 'vue'
import pinia from '@/stores/index'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(pinia)
app.use(router)

//element的中文配置
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')
