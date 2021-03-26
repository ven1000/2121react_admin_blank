import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {Button, message} from 'antd' // 引入natd样式组件
import Login from './pages/login' // 引入登录页面
import Admin from './pages/admin' // 引入管理主页面


export default class App extends Component {
  handleClick = () => {
    message.success('点击了按钮');
  }
  render() {

    return (
      <BrowserRouter>
        <Switch>
          {/* 注册路由映射 */}
          <Route path='/login' component={Login}/>
          <Route path='/' component={Admin}/>
        </Switch>
      </BrowserRouter>
    )
  }
}
