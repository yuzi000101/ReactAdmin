import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item

const treeData = menuList  // 获取权限显示数据

export default class UpdateForm extends Component {

    static propTypes = {
        role: PropTypes.object.isRequired  //当前选中的角色
    }

    constructor(props) {
        super(props)

        /* 根据传入角色menus生成初始状态     */
        const { menus } = this.props.role
        this.state = { checkedKeys: menus }
    }

    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    }

    getMenus = () => {
        return this.state.checkedKeys  //返回父组件需要的menus数组
    }

    /* 
        根据传入的role来更新  checkedKeys 的状态  (解决显示bug)
        在组件被传入最新的属性时自动调用
    */
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { menus } = nextProps.role
        this.setState({ checkedKeys: menus })
    }

    render() {
        /* 
            设置表单左侧文本与右侧输入框布局
        */
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        }

        const { role } = this.props
        const { checkedKeys } = this.state

        return (
            <div>

                <Item label='角色名称：' {...formItemLayout} >
                    <Input value={role.name} disabled></Input>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}/* 所有已经选中项的数组 */
                    onCheck={this.onCheck}
                    treeData={treeData}
                />

            </div >
        )
    }
}