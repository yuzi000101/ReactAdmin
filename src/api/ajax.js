/* 
    发送异步ajax请求的函数模块
    封装axios库
    返回Promise对象

    优化：统一处理请求异常
        外层创建promise对象，内部出错修改外层自定义promise对象为rejected，显示出错信息
    优化2：response返回response.data而不是response本身，从而不用再每次发送请求后读取数据
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {

        let promise

        if (type === 'GET') {
            promise = axios.get(url, { params: data })
        } else {  //POST请求
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错', error.message)
        })
    })
}