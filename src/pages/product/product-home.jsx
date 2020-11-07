import React, { Component } from 'react'
import { Card, Select, Table, Input, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'


import LinkButton from '../../components/link-button/link-button'

import { reqProduct, reqSearchProucts, reqUpdateStatus } from '../../api'

import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {


    state = {
        loading: false,  // 显示 / 隐藏 loading
        total: 0,  // 商品的总数量
        products: [],  // 商品数组
        searchType: 'productName', //按productName/productDesc搜索
        searchName: ''  //关键字
    }

    // 初始化table列表显示
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => ('￥' + price)  //根据dataIndex传入对应的数据
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const { _id, status } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type='primary' onClick={() => this.handleStatus(_id, newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
                            {status === 1 ? '在售' : '已下架'}
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => (
                    <span>
                        {/* 将product对象使用state传递给目标路由组件 */}
                        <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </span>
                )
            },
        ]
    }

    handleStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('数据更新成功!')
            this.getProducts(this.pageNum)  //更新列表，使用保存在当前组件的页码
        } else {
            message.error('数据更新失败!')
        }
    }

    // 获取指定页面的数据显示（后台分页）
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum，在后面更新上下架商品时使用
        this.setState({ loading: true })  //显示loading

        const { searchName, searchType } = this.state
        let result
        if (searchName) {   //如果searchName有值则根据【关键字】分页，否则常规分页（后台分页）
            result = await reqSearchProucts(pageNum, PAGE_SIZE, searchName, searchType)
        } else {
            result = await reqProduct(pageNum, PAGE_SIZE)
        }


        this.setState({ loading: false })  // 隐藏loading

        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({ total, products: list })  // 将搜索到的内容保存到状态中
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()  //初始化table列
    }

    componentDidMount() {
        this.getProducts(1)  //获取商品
    }

    render() {

        const { loading, products, total, searchName, searchType } = this.state

        // Card左侧
        const title = (
            <span>
                <Select value={searchType} style={{ width: 150 }} onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} onChange={event => this.setState({ searchName: event.target.value })} />
                <Button type='primary' onClick={() => { this.getProducts(1) }}>搜索</Button>
            </span>
        )
        // Card右侧
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}><PlusOutlined />添加商品</Button>
        )

        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,  //修复页码显示bug
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}