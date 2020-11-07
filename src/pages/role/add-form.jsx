import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form,  Input } from 'antd'

const Item = Form.Item

export default class AddForm extends Component {

    form = React.createRef()   //获取表单数据

    static propTypes = {
        setForm: PropTypes.func.isRequired   //重置表单
    }

    UNSAFE_componentWillMount() {
        this.props.setForm(this.form)  //将form对象传入父组件
    }

    render() {
        /* 
            设置表单左侧文本与右侧输入框布局
        */
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        }

        return (
            <Form ref={this.form}>

                <Item label='角色名称：' {...formItemLayout} name='roleName' rules={[{ required: true, message: '角色名称必须输入' }]}>
                    <Input placeholder='请输入角色名称'></Input>
                </Item>

            </Form>
        )
    }
}