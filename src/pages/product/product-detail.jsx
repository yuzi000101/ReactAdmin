import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button/link-button'

import { BASE_IMG_URL } from '../../utils/constants'

import { reqCategory } from '../../api'

import './product-style/product.css'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1: '',  // 一级分类名称
        cName2: ''   // 二级分类名称
    }

    async componentDidMount() {

        const { pCategoryId, categoryId } = this.props.location.state
        if (pCategoryId === '0') {  //说明为一级分类
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {  //二级分类
            // 使用Promise.all一次发送两个请求，优化发送请求，
            // 相较于定义连个result1/2而言，要等到第一个await请求成功之后才可以发送第二个Promise请求
            const results = await Promise.all(reqCategory(pCategoryId), reqCategory(categoryId))
            console.log(results)
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({ cName1, cName2 })
        }
    }

    render() {

        const { name, desc, price, imgs, detail } = this.props.location.state
        const { cName1, cName2 } = this.state
        console.log(this.props.location.state)

        const title = (
            <span><LinkButton><ArrowLeftOutlined onClick={() => this.props.history.goback()} /></LinkButton>&nbsp;&nbsp;&nbsp;商品详情</span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span className='right'>{price + '元    '}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        {
                            imgs.map((img, index) => (
                                <img style={{ width: 80, height: 60 }} key={index} className='imgs' src={BASE_IMG_URL + img} alt="image" />
                            ))
                        }
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span className='right'>{cName1}{cName2 ? '--->' + cName2 : null}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span className='right' dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}