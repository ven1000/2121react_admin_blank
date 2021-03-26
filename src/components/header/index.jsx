import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import  './index.less'
import memorydata from '../../utils/memmoryutil'
import localstorageUtil from '../../utils/localstorageUtil'
import menucofig from '../../config/menucofig'
import LInkbutton from '../../components/linkbutton'

const { confirm } = Modal

class Header extends Component {
  state = {
    time: '',
    username: '',
    title: ''
  }
  // 获取当前时间
  getCurrentTime = () =>{
    this.timer = setInterval(()=>{
      let time = new Date().toLocaleString()
      this.setState({
      time: time
    })
    },1000)
  }
  // 获取用户信息
  getuserdata = () =>{
    this.setState({
      username: memorydata.user.username
    })
  }

  // 获取当前路径
  getlocation = ()=>{
    const path = this.props.location.pathname
    let title
    // 对菜单数据进行遍历查找当前的位置
    menucofig.forEach(item=>{
      // 判断每个路径是否有子路径
      if(item.children) {
        // 如果有对childrn遍历
        item.children.forEach(chitem=>{
          if(chitem.key === path) {
            return title = chitem.title
          }
        })
      }else{
        if(item.key === path){
          return title =item.title
        }
      }
    })

    return title
  }

  logout = ()=> {
    let that = this
    // 向用户确认退出
    confirm({
      title: '您确定要退出登录吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      // 用户确认则执行删除
      onOk() {
        // 移除本地数据
        localstorageUtil.deleteUserdat()
        memorydata.user = {}
        // 跳转到登录页面
        that.props.history.replace('/login')
      },
      // 用户取消则取消操作
      onCancel() {
      },
    });
  }

  // 组件实例挂载完成钩子
  componentDidMount () {
    this.getCurrentTime()
    this.getuserdata()
  }

  // 组件将要卸载的钩子
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render() {
    const {username,time,} = this.state

    const title = this.getlocation() || '商品管理'
    return (
      <div className="headnav">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LInkbutton onClick={this.logout}>退出</LInkbutton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {title}
          </div>
          <div className="header-bottom-right">
            <span>{time}</span>
            <img src="" alt="weather"/>
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
