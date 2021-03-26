import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './home'
import Detail from './detail'
import Add from './add'
import './index.less'

export default class Product extends Component {
  render() {
    return (
      <div>
        {/* 创建路由链接 */}
        <Switch>
          <Route path="/product" component={Home} exact/>
          <Route path="/product/detail" component={Detail}/>
          <Route path="/product/add" component={Add}/>
          <Redirect to="/product"/>
        </Switch>
      </div>
    )
  }
}
