import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'

import { reqCategorys, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

export default class ProductAddUpdate extends Component {

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器（图片名称）
        this.pw = React.createRef()
        //创建用来保存ref标识的标签对象的容器（富文本html）
        this.editor = React.createRef()
    }

    state = {
        options: [],
    }

    static propTyps = {
        product: PropTypes.object
    }

    /* 加载选中项数组 */
    // async 的返回值是一个新的promise对象，promise 的结果和值由async的结果来决定
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]  // 得到选中项
        /* 得到数据前加载页面的显示 */
        targetOption.loading = true

        // 根据当前分类获取子分类
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false  //隐藏loading

        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => (   //生成子option
                {
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }
            ))
            targetOption.children = childOptions   // 关联到当前的option上

            this.setState({ options: [...this.state.options] })  // 将有子分类的父分类解构，更新状态
        } else {
            targetOption.isLeaf = true  // 说明当前选中没有二级子分类
        }
    }

    /* 
        获取一/二级分类列表，并显示
    */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            // 是一级分类
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {  // 是二级分类
                return categorys
            }

        }
    }

    // 根据获取的categorys生成对应的options
    initOptions = async (categorys) => {
        const options = categorys.map(c => (
            {
                value: c._id,
                label: c.name,
                isLeaf: false,
            }
        ))

        //如果是一个二级分类商品的修改（点击修改时的处理）
        const { isUpdate, product } = this
        const { pCategoryId, categoryId } = product

        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)

            const childOptions = subCategorys.map(c => (
                {
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                }
            ))
            const targetOption = options.find(option => option.value === pCategoryId)  //找到当前商品对应的一级option 
            targetOption.children = childOptions //将二级下拉子菜单关联到当前选择的父菜单上
        }
        this.setState({ options })
    }

    //  处理表单提交
    handleSubmit = async (event) => {

        //收集数据
        const { name, desc, price, categoryIds } = event
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        let pCategoryId, categoryId

        if (categoryIds.length === 1) {   // 说明是一级分类
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {  // 二级分类
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        let product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
        
        //如果是更新商品则增加_id
        if (this.isUpdate) {
            product._id = this.product._id
        }
        //发送请求
        const result = await reqAddOrUpdateProduct(product)
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品成功`)
        }
    }

    UNSAFE_componentWillMount() {  //点击修改时初始化数据
        const product = this.props.location.state  //取出携带的product
        this.isUpdate = !!product  //!!强制转化为布尔型数据,表示是添加商品还是修改商品
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategorys('0')  //初始化显示商品
    }

    render() {

        const { isUpdate, product } = this
        const { detail, imgs } = product

        const categoryIds = []
        if (isUpdate) {
            if (product.pCategoryId === '0') {  //  只有一级分类
                categoryIds.push(product.categoryId)
            } else {  //二级分类
                categoryIds.push(product.pCategoryId)
                categoryIds.push(product.categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton><ArrowLeftOutlined onClick={() => this.props.history.goBack()} /></LinkButton>
                &nbsp;&nbsp;&nbsp;{isUpdate ? '修改商品' : '添加商品'}
            </span>
        )

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 10 },
        }

        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.handleSubmit}>
                    <Item
                        label='商品名称：'
                        name='name'
                        initialValue={product.name}
                        rules={[{ required: true, message: '必须输入商品名称' }]}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item
                        label='商品描述：'
                        name='desc'
                        initialValue={product.desc}
                        rules={[{ required: true, message: '必须输入商品描述' }]}
                    >
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder='请输入商品名称' />
                    </Item>
                    <Item
                        label='商品价格：'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {
                                required: true, message: '必须输入商品价格'
                            },
                            /* 自定义商品价格验证不可以为负值 */
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (value * 1 > 0 || value === undefined) {
                                        return Promise.resolve()
                                    } else {
                                        return Promise.reject('商品价格不可以为负值')
                                    }
                                }
                            }),
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item name='categoryIds' initialValue={categoryIds} label='商品分类：'>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            placeholder='请选择'
                        />
                    </Item>
                    <Item label='商品图片：'>
                        <PictureWall ref={this.pw} imgs={imgs} />  {/* 将PictureWall实例对象置入pw容器中 */}
                    </Item>
                    <Item label='商品详情：' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button style={{ marginLeft: 900 }} type='primary' htmlType='submit'>提交</Button>
                    </Item>

                </Form>
            </Card >
        )
    }
}


/*
    1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件即可调用
    2. 父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（即组件对象），调用其方法
*/