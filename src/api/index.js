/* 
    包含n个接口请求函数的模块
    每个函数返回值是Promise
*/

import ajax from './ajax'

// 引入jsonp第三方库
import jsonp from 'jsonp'

import { message } from 'antd'


// 登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')


// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')
// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')
// 根据分类列表获取一个分类列表
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId })

// 获取商品分类列表
export const reqProduct = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })
/* 搜索商品分页列表（根据商品名称/商品描述）searchType：搜索类型：productName/productDesc */
export const reqSearchProucts = (pageNum, pageSize, searchName, searchType) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})
//商品上架 / 下架处理
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')
// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, 'POST')
// 添加 / 修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')
//更新角色权限
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')
// 添加 / 修改用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')



/* 
    jsonp请求接口请求天气
*/
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, reject) => {
        jsonp(url, {}, (err, data) => {

            if (!err && data.status === 'success') { //请求成功
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else { //失败
                message.error('天气获取失败惹!!!')
            }

        })
    })
}   