import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' //解析 Element Plus 组件库的组件自动导入的工具

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()] //用于自动引入 API 和工具函数，如 ElMessage 或 ElNotification，无需手动 import
    }),
    Components({
      resolvers: [ElementPlusResolver()] //用于自动引入组件，如 <el-button>，无需在代码中手动导入和注册组件
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
