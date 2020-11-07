import React, { Component } from 'react'
import { Card, Table, Modal, Button, message } from 'antd'

import { formateDate } from '../../utils/dateUtils'

import LinkButton from '../../components/link-button/link-button'

import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api'

import UserForm from './user-form'

export default class User extends Component {

    state = {
        users: [],  //用户列表
        roles: [],  //所有角色列表
        isShow: false, //是否显示modal
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    /* 获取所有用户列表 */
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data

            this.initRoleNames(roles)  //初始化一个 角色ID：角色名 对象方便查找

            this.setState({ users, roles })
        }
    }

    /* 根据roles数组生成包含所有角色的对象（属性名为id值） */
    initRoleNames = (roles) => {
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
    }

    /* 添加 / 修改用户 */
    addOrUpdateUser = async () => {
        this.setState({ isShow: false })
        console.log('this.user()', this.user)

        const user = this.form.current.getFieldValue()

        // 如果时更新用户则指定_id否则不指定
        if (this.user && this.user._id) {
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
            this.getUsers()
            message.success(`${this.user._id ? '修改' : '添加'}用户成功`)
        } else {
            message.error(`${this.user._id ? '修改' : '添加'}用户失败`)
        }
        this.form.current.resetFields()  // 重置表单数据

    }

    /* 显示添加界面 */
    showAdd = () => {
        this.user = {}
        this.setState({ isShow: true })
    }

    /* 显示修改界面 */
    showUpdate = (user) => {
        this.user = user  //保存当前的user
        this.setState({ isShow: true })
    }

    /* 删除用户 */
    deleteUser = (user) => {
        Modal.confirm({
            title: `确定要删除${user.username}用户吗`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                } else {
                    message.error('删除用户失败!')
                }
            }
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {

        const title = <Button type='primary' onClick={this.showAdd}> 创建用户</ Button>
        const { users, isShow, roles } = this.state
        const user = this.user || {}

        return (
            <Card title={title}>
                <Table dataSource={users}
                    columns={this.columns}
                    bordered
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    rowKey='role_id'
                />

                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false })
                        this.form.current.resetFields()  // 重置form表单
                    }}
                >
                    <UserForm setForm={(form) => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}