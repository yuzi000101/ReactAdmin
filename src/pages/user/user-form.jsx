import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class UserForm extends Component {

    form = React.createRef()   //获取表单数据

    static propTypes = {
        setForm: PropTypes.func.isRequired,   //重置表单
        roles: PropTypes.array.isRequired,  //所有角色列表
        user: PropTypes.object // 当前选中的用户
    }

    UNSAFE_componentWillMount() {
        this.props.setForm(this.form)  //将form对象传入父组件
    }

    componentWillUnmount(){  //组件卸载时触发
        this.form.current.resetFields()  //重置表单数据
    }

    render() {
        /* 
            设置表单左侧文本与右侧输入框布局
        */
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        }

        const { roles, user } = this.props

        return (
            <Form ref={this.form} {...formItemLayout}>

                <Item label='用户名：' name='username' initialValue={user.username} rules={[{ required: true, message: '用户名必须输入' }]}>
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码：' name='password' initialValue={user.password} rules={[{ required: true, message: '密码必须输入' }]}>
                            <Input placeholder='请输入角色名称'></Input>
                        </Item>
                    )
                }

                <Item label='手机号：' name='phone' initialValue={user.phone} rules={[{ required: true, message: '手机号必须输入' }]}>
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
                <Item label='邮箱：' name='email' initialValue={user.email} rules={[{ required: true, message: '邮箱必须输入' }]}>
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
                <Item label='角色：' name='role_id' initialValue={user.role_id} >
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>

            </Form>
        )
    }
}