import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

    form = React.createRef()   //获取表单数据

    static propTypes = {
        categorys: PropTypes.array.isRequired,  //一级分类数组
        parentId: PropTypes.string.isRequired,  //一级分类父ID
        setForm: PropTypes.func.isRequired   //重置表单
    }

    UNSAFE_componentWillMount() {
        this.props.setForm(this.form)  //将form对象传入父组件
    }

    render() {

        const { categorys, parentId } = this.props

        return (
            <Form ref={this.form}>

                <Item name='parentId' initialValue={parentId}>
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => (<Option key={c._id} value={c._id}>{c.name}</Option>))
                        }

                    </Select>
                </Item>

                <Item name='categoryName' rules={[{ required: true, message: '商品名称必须输入' }]}>
                    <Input placeholder='请输入商品名称'></Input>
                </Item>

            </Form>
        )
    }
}