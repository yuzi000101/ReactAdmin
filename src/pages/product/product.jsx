import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './product-home'
import ProductAddUpdate from './product-add-update'
import ProductDetail from './product-detail'

import './product-style/product.css'

export default class Product extends Component {

    render() {

        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact={true}/>  {/* 路径完全匹配，默认为逐层匹配 */}
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Route path='/product/detail' component={ProductDetail} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}