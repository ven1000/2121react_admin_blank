import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import { Menu } from 'antd'
import './index.less'
// 引入菜单栏数据
import menudata from '../../config/menucofig'
import {
  ContainerOutlined,
  AppleOutlined
} from '@ant-design/icons'
import logo from '../../assets/images/logo.png'

const { SubMenu } = Menu


class LeftNav extends Component {
  // 点击菜单导航切换组件
  changeSelect = (path) =>{
    return ()=>{
      this.props.history.replace(path)
      this.selectkey = []
      // console.log(this);
    }
  }
  render() {
    // 获取当前路径
    const curentpath = this.props.location.pathname 
    // 对数组遍历找出选中的项目
    menudata.map(item =>{
      if(item.children){
        item.children.map((childrenitem)=>{
          if(childrenitem.key === curentpath){
          
            this.selectkey = [item.title,childrenitem.title]
            this.openKeys = [item.title]
          }
        })
        
      }else{
        if(item.key === curentpath){
          this.selectkey = item.title
        }
      }
    })
    return (
      <div className="left-nav">
        <header>
          <img src={logo} alt="logo"/>
          <h2>硅谷后台</h2>
        </header>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          defaultSelectedKeys = {menudata[0].title}
          selectedKeys={this.selectkey}
          defaultOpenKeys={this.openKeys}
          style={{marginTop: '20px'}}
        >
          {
            menudata.map(item=>{
              if(item.children){
                return (
                  <SubMenu key={item.title} icon={<ContainerOutlined />} title={item.title}>
                    
                    {
                      item.children.map(childitem=>{
                        return <Menu.Item icon={<AppleOutlined />} key={childitem.title} onClick={this.changeSelect(childitem.key)}>{childitem.title}</Menu.Item>
                      })
                    }
                  </SubMenu>
                )
              } else{
                return(
                  <Menu.Item key={item.title} onClick={this.changeSelect(item.key)} icon={<AppleOutlined />}>
                    {item.title}
                  </Menu.Item>
                )
              }
            })
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
