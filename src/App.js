/* 
    应用根组件
*/

import React, { Component } from 'react'
import { message } from 'antd'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'

export default class App extends Component {

    handleClick = () => {
        message.info('提示信息')
    }

    render() {

        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}