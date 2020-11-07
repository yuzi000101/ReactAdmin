/* 
    登录路由组件
*/
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom'

import './login-style/login.css'
import logo from '../../assets/images/logo.png'

import { reqLogin } from '../../api'

import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {

    handleSubmit = async (event) => {

        const { username, password } = event

        const result = await reqLogin(username, password)
        if (result.status === 0) {
            message.success('登录成功')

            // 跳转之前，将用户信息保存到memoryUtil和storageUtils中
            memoryUtils.user = result.data
            storageUtils.saveUser(result.data)

            this.props.history.replace('/')
        } else {
            message.error(result.msg)
        }

    }

    render() {

        // 判断用户是否登录，如果登录自动跳转到管理界面
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/' />
        }


        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='logo' />
                    <h2> React 后台管理系统</h2>
                </header>
                <section className='login-section'>
                    <h3>用户登录</h3>

                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.handleSubmit}
                    >
                        <Form.Item
                            name="username"
                            /* 表单校验规则
                                    1. 必须输入
                                    2. 必须大于4位
                                    3. 必须小于12位
                                    4. 必须是字母、数字、下划线
                            */
                            rules={[
                                {
                                    required: true,
                                    message: '用户名不能为空!',
                                },
                                {
                                    min: 4,
                                    message: '用户名长度必须大于4位!',
                                },
                                {
                                    max: 12,
                                    message: '用户名不能超过12位!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名只能由字母、数字、下划线组成!',
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空!',
                                },
                                {
                                    min: 4,
                                    message: '密码长度必须大于4位!',
                                },
                                {
                                    max: 12,
                                    message: '密码不能超过12位!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '密码只能由字母、数字、下划线组成!',
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
                            </Button>
                        </Form.Item>
                    </Form>

                </section>
            </div>
        )

    }
}

/*
    高阶函数
        1). 一类特别的函数
            a. 接收函数类型的参数
            b. 返回值是一个函数
        2). 常见
            a. 定时器： setTimeout() / setInterval()
            b. Promise: Promise(() => {}) then(resolve => {}, reason => {})
            c. 数组遍历相关方法：forEach() / filter() / map() / reduce() / find() / findIndex()

            d. 函数对象方法 bind()
            e. 低版本Form.create()() / getFieldDecorator()()
        3). 高阶函数更新动态，更加具有扩展性
    高阶组件
        1). 本质就是一个函数
        2). 接受一个组件（被包装的组件），返回一个新的组件（包装组件），包装组件会向被包装的组件传入特定属性
        3). 作用：扩展组件的功能
        4). 高阶组件也是高阶函数：接受一个组件函数，返回一个新的组件函数

    async and await
        作用：简化promise对象的使用，不用再使用then（）来指定成功/失败的回调函数，以同步编码（没有回调函数）的实现异步流程
*/