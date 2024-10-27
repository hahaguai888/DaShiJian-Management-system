import request from '@/utils/request'

/* 文章分类 */
//获取文章分类api封装
export const getCateService = () => request.get('/my/cate/list')

//添加文章分类api封装
export const addCateService = (data) => request.post('/my/cate/add', data)

//删除文章分类api封装
export const deleteCateService = (id) => request.delete('/my/cate/del', { params: { id } })

//编辑更新文章分类api封装
export const editCateService = (data) => request.put('/my/cate/info', data)

/* 文章管理 */
//获取文章列表api封装
export const getListService = (data) => request.get('/my/article/list', { params: data })

//删除文章api封装
export const deleteArticleService = (id) => request.delete('/my/article/info', { params: { id } })

//发布文章api封装
export const addArticleService = (data) => request.post('/my/article/add', data)

//获取文章详情api封装
export const getArticleDetailService = (id) => request.get('/my/article/info', { params: { id } })

//编辑文章详情api封装
export const editArticleDetailService = (data) => request.put('/my/article/info', data)
