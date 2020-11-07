import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'

import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'

import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

  state = {
    loading: false, //是否显示加载
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: '0',  //当前需要显示列表的父列表ID
    parentName: '',  //当前需要显示列表的父列表名称
    showStatus: 0,  //显示添加/更新的modal 0：不显示  1：显示添加  2：显示更新
  }

  initCategorys = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        key: 'operation',
        render: (category) => (  //将分类对象从render中传入，若指定dataIndex则传入指定对象
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {
              this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategory(category)}>查看子分类</LinkButton> : null
            }
          </span>),
      }
    ];
  }

  //获取商品 一级 / 二级 列表
  getCategorys = async (parent_id) => {
    this.setState({ loading: true })   //显示加载

    const parentId = parent_id || this.state.parentId
    const result = await reqCategorys(parentId)

    this.setState({ loading: false })  //隐藏加载

    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({ categorys })  //更新一级商品状态
      } else {
        this.setState({ subCategorys: categorys })
      }
    } else {
      message.error('数据获取失败')
    }
  }

  showCategory = () => {  //点击显示一级商品分类
    this.setState({ subCategorys: [], parentId: '0', parentName: '' })  //重置为一级分类状态
  }

  showSubCategory = (category) => {  //点击显示二级商品分类
    this.setState({ parentId: category._id, parentName: category.name }, () => {  //回调函数在重新render之后执行
      this.getCategorys()  //获取二级分类列表
    })
  }

  // 隐藏modal
  handleCancel = () => {
    this.form.current.resetFields()  //重置字段为初始状态
    this.setState({ showStatus: 0 })
  }

  // 显示添加modal
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }

  // 显示更新modal
  showUpdate = (category) => {
    this.category = category  //保存分类对象
    this.setState({ showStatus: 2 })
  }

  // 添加分类
  addCategory = async () => {
    // this.form.current.validateFields(['categoryName'], async (err, values) => {
    //   if (!err) {
    this.setState({ showStatus: 0 })  //关闭modal

    const { parentId, categoryName } = this.form.current.getFieldValue()  //准备数据

    const result = await reqAddCategory(parentId, categoryName)
    if (result.status === 0) {

      if (parentId === this.state.parentId) {  //添加的分类就是当前列表下的分类
        this.getCategorys()  // 重新获取商品列表
      } else if (parentId === '0') {  //在二级分类下添加一级分类，重新获取一级分类列表数据但不需要显示
        this.getCategorys('0')
      }
    }
    this.form.current.resetFields()  //重置字段为初始状态
    //   }
    // })
  }

  // 更新分类
  updateCategory = async () => {
    //validateFields第一个参数为map数组，第二个参数为回调函数,保证表单验证通过后才可以提交
    // this.form.current.validateFields([this.form.current.getFieldValue()], async (err, values) => {
    //   if (!err) {
    this.setState({ showStatus: 0 })  //关闭modal

    // 准备数据 
    const categoryId = this.category._id
    const categoryName = this.form.current.getFieldValue('categoryName')  //等到categoryName的字段内容

    console.log(this.form)

    const result = await reqUpdateCategory(categoryId, categoryName)   //发送ajax请求
    if (result.status === 0) {
      this.getCategorys()  //重新显示商品列表
    }

    this.form.current.resetFields()  //重置字段为初始状态

    //   }
    // })
  }

  //初始化列表
  UNSAFE_componentWillMount() {
    this.initCategorys()
  }

  // 执行异步任务
  componentDidMount() {
    this.getCategorys()
  }

  render() {

    const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
    const category = this.category || {}  //读取保存的category对象如果没有则置为空对象

    // card左侧
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{ marginRight: 10 }} />
        {parentName}
      </span>
    )
    // card右侧
    const extra = (<Button type='primary' onClick={this.showAdd}><PlusOutlined />添加</Button>)

    return (
      <Card title={title} extra={extra} style={{ width: '100%' }}>
        <Table dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          loading={loading}
          rowKey='_id'
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => { this.form = form }} />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
        </Modal>

      </Card>


    )
  }
}