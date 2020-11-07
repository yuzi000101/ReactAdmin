/* 
    后台管理左侧导航栏
*/
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,

    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    BranchesOutlined,
    UserOutlined,
    TrademarkOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined

} from '@ant-design/icons';

import './left-nav-style/left-nav.css'

import logo from '../../assets/images/logo2.png'

import menuList from '../../config/menuConfig'

import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;


class LeftNav extends Component {

    /* 判断当前登录用户对item是否有权限 */
    hasAuth = (item) => {
        const { key, isPublic } = item  //获取当前item的key和isPublic
        const menus = memoryUtils.user.role.menus  //获取当前用户的menus
        const username = memoryUtils.user.username  //获取当前用户的用户名
        /* 
            1.如果当前用户时admin
            2.如果当前的item时公开的
            3.当前用户有此item的权限，key有没有在menus中
        */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { //4.如果当前用户有item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // 根据menuList递归创建组件标签  map()+递归
    getMenuNodes = (menuList) => {
        // return menuList.map(item => {
        //     if (!item.children) {
        //         return (
        //             <Menu.Item key={item.icon} icon={<HomeOutlined />}>
        //                 <Link to={item.key}>{item.title}</Link>
        //             </Menu.Item>
        //         )
        //     } else {
        //         return (
        //             <SubMenu key={item.icon} icon={<MailOutlined />} title={item.title}>
        //                 {this.getMenuNodes(item.children)}  {/* 递归 */}
        //             </SubMenu>
        //         )
        //     }
        // })

        // reduce()+递归
        return menuList.reduce((pre, item) => {
            // 获取当前请求路径
            const path = this.props.location.pathname


            //如果当前用户有item权限才显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={<HomeOutlined />}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找第一个与当前路径匹配的子item，请求子路由的子路由默认打开子路由左侧列表选择
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在，说明当前item的子列表需要展开
                    if (cItem) { this.openKey = item.key }

                    pre.push((
                        <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                            {this.getMenuNodes(item.children)}  {/* 递归 */}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }

    // 在第一次执行render()前执行，为第一次render()准备数据（同步）【为openKey准备数据】
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 得到当前请求路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {  //当前请求的是商品或者是其子路由
            path = '/product'
        }

        // 得到需要展开的菜单路径
        const openKey = this.openKey

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo2" />
                    <h1>后台管理</h1>
                </Link>

                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>

                    {
                        /*   <Menu.Item key="home" icon={<PieChartOutlined />}>
                            <Link to='/home'>首页</Link>
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                            <Menu.Item icon={<PieChartOutlined />} key="category"><Link to='/category'>品类管理</Link></Menu.Item>
                            <Menu.Item icon={<PieChartOutlined />} key="product"><Link to='/product'>商品管理</Link></Menu.Item>
                        </SubMenu>
                        <Menu.Item key="user" icon={<DesktopOutlined />}>
                            <Link to='/user'>用户管理</Link>
                        </Menu.Item>
                        <Menu.Item key="role" icon={<ContainerOutlined />}>
                            <Link to='/role'>角色管理</Link>
                        </Menu.Item>
                        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="图形图表">
                            <Menu.Item icon={<PieChartOutlined />} key="bar"><Link to='/charts/bar'>柱形图</Link></Menu.Item>
                            <Menu.Item icon={<PieChartOutlined />} key="line"><Link to='/charts/line'>折线图</Link></Menu.Item>
                            <Menu.Item icon={<PieChartOutlined />} key="pie"><Link to='/charts/pie'>饼图</Link></Menu.Item>
                        </SubMenu> */
                    }

                    {this.menuNodes}
                </Menu>

            </div>
        )
    }
}

export default withRouter(LeftNav)