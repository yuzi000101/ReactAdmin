/* 
    后台管理头部
*/

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';

import './header-style/header.css'

import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'

import { reqWeather } from '../../api'
import menuList from '../../config/menuConfig'

import LinkButton from '../link-button/link-button'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),  //当前时间
        dayPictureUrl: '',  //天气图片
        weather: ''  //天气
    }

    getTime = () => {   // 每个一秒获取一次当前时间
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000);
    }

    getWeather = async () => {  //获取天气参数
        const { dayPictureUrl, weather } = await reqWeather('北京')
        this.setState({ dayPictureUrl, weather })
    }

    getTitle = () => {   // 获取title
        const path = this.props.location.pathname  //获取当前访问路径
        let title

        menuList.forEach(item => {
            if (item.key === path) {  //判断菜单配置列表是否有与之匹配的path
                title = item.title
            } else if (item.children) {  //二级菜单判断
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) { title = cItem.title }  //如果存在则将cItem的title赋值给title
            }
        })
        return title
    }

    logout = () => {  //登出
        Modal.confirm({
            content: '您确定退出么~~~',
            onOk: () => {
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转至登陆界面
                this.props.history.replace('/login')
            }
        })
    }

    // 第一次挂载render()执行，发送ajax请求
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    // 组件卸载时触发
    componentWillUnmount() {
        clearInterval(this.intervalId)  //清除定时器
    }

    render() {

        const { currentTime, dayPictureUrl, weather } = this.state
        const username = memoryUtils.user.username  //获取当前用户昵称
        const title = this.getTitle()

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)