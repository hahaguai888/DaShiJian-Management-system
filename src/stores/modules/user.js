import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userProfileService } from '@/api/user'

export const useUserStore = defineStore(
  'big-Store',
  () => {
    //用户token值
    const token = ref('')
    //用户token赋值
    const setToken = (newVal) => {
      token.value = newVal
    }
    //删除用户token
    const removeToken = () => {
      token.value = ''
    }
    //用户信息获取与储存
    const profile = ref({})
    const getProfile = async () => {
      const res = await userProfileService()
      profile.value = res.data.data
    }
    //用户信息移除
    const removeProfile = () => {
      profile.value = {}
    }
    return {
      token,
      setToken,
      removeToken,
      profile,
      getProfile,
      removeProfile
    }
  },
  {
    persist: true //持久化
  }
)
