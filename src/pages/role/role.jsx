import React, { Component, memo } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'

import AddForm from './add-form'
import UpdateForm from './update-form'

import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'

export default class Role extends Component {

    state = {
        roles: [],  //所有角色列表
        role: {},  //选中的角色
        isShowAdd: false,  // 是否显示添加modal
        isShowAuth: false //是否显示更新modal
    }

    constructor(props) {
        super(props)

        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: create_time => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]

    }

    getRoles = async () => {  //发送请求获取角色列表
        const result = await reqRoles()
        if (result.status === 0) {
            this.setState({ roles: result.data })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({ role })
            }
        }
    }

    // 添加角色
    addRole = async () => {
        this.setState({ isShowAdd: false })  // 隐藏modal

        const { roleName } = this.form.current.getFieldValue()  // 准备数据

        // 发送请求
        const result = await reqAddRole(roleName)

        if (result.status === 0) {
            message.success('角色添加成功!')

            const role = result.data  // 获取返回的角色信息

            this.setState(state => ({ roles: [...state.roles, role] }))  //更新状态显示

        } else {
            message.error('角色添加失败!')
        }
        this.form.current.resetFields()  //重置字段为初始状态

    }
    /* 
        更新角色
    */
    updateRole = async () => {

        this.setState({ isShowAuth: false })

        const role = this.state.role
        // 获取子组件中最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus  //收集要显示的菜单数组
        role.auth_time = Date.now()  // 收集授权时间
        role.auth_name = memoryUtils.user.username  //收集授权人数据


        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            //如果更新的是自己的权限，则强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户权限修改成功，请重新登录')
            } else {
                message.success('设置权限成功')
                this.setState({ roles: [...this.state.roles] })  //更新状态
            }

        } else {
            message.error('设置权限失败')
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()  //初始化表格        
    }

    componentDidMount() {
        this.getRoles()  //获取角色列表
    }

    render() {


        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (   //卡片头
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {  //修复单选钮点击bug
                            this.setState({ role })
                        }
                    }}
                    onRow={this.onRow}
                    columns={this.columns}
                    dataSource={roles}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => { this.setState({ isShowAdd: false }) }}
                >
                    <AddForm setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => { this.setState({ isShowAuth: false }) }}
                >
                    <UpdateForm ref={this.auth} role={role} />
                </Modal>
            </Card >
        )
    }
}