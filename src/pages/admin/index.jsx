// 后台管理页面
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Layout } from 'antd'
// 导入用户数据信息
import memorydata from '../../utils/memmoryutil'
// 引入左导航栏组件
import LeftNav from '../../components/left_nav'
// 引入右导航栏组件
import Header from '../../components/header'
import { Route, Switch } from 'react-router-dom'

import Home from '../home'
import Category from '../category'
import Pie from '../charts/pie'
import Prouduct from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'

const {  Content, Footer, Sider } = Layout

export default class Admin extends Component {
  render() {
    // 判断是否获取用户数据
    const user = memorydata.user
    if(!user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}><LeftNav/></Sider>
        <Layout>
        <Layout style={{height: '100%', marginLeft: '200px'}}>
          <Header>header</Header>
            <Content style={{backgroundColor: '#eeeeee', padding: '20px'}}>
              {/* 注册路由映射 */}
              <Switch>             
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/product" component={Prouduct}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Route path="/charts/line" component={Line}/>
                <Redirect path="/" to="/home" />
              </Switch>
            </Content>
            <Footer style={{textAlign: 'center', color: '#aaaaaa'}}>推荐使用谷歌浏览器， 可以获得更佳页面操作体验</Footer>
        </Layout>
     
        </Layout>
      </Layout>
    )
  }
}
