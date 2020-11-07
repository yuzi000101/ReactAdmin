import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'


const Item = Form.Item

export default class UpdateForm extends Component {

    form = React.createRef()   //获取表单数据

    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func.isRequired
    }

    UNSAFE_componentWillMount() {
        this.props.setForm(this.form)  //将form对象传入父组件
    }

    render() {
        const { categoryName } = this.props

        return (
            <Form ref={this.form} onFinish={this.handleSubmit}>  {/* ref设置表单控制域 */}

                <Item
                    name='categoryName'
                    initialValue={categoryName}
                    rules={[{ required: true, message: '商品名称必须输入' }]}>

                    <Input placeholder='请输入商品名称' ></Input>
                    
                </Item>

            </Form>
        )
    }
}