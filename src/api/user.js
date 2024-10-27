/* eslint-disable prettier/prettier */
import request from '@/utils/request'
// 注册的api封装
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

//登陆的api封装
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

//获取用户信息api封装
export const userProfileService = () => request.get('/my/userinfo')

//更新用户信息api封装
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

//上传头像api封装
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })

//更新密码api封装
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
