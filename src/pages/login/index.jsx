import React, { Component } from "react"
import { Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from '../../api/ajax' // 封装的axios请求
import "./index.less" // 页面样式
import logo from "../../assets/images/logo.png" 
import memorydata from '../../utils/memmoryutil' // 本地用户数据仓库 
import localUtils from '../../utils/localstorageUtil' // 操作本地存储用户数据方法 


export default class Login extends Component {
  // 处理表单提交
  onFinish = async (e)=>{
    // 发送ajax请求登录
    const res = await axios('/login', e, 'post')
    // 如果登录成功,则保存用户数据
    if(res.status === 0) {
      // 提示用户登录成功
      message.success('登录成功')
      // 保存用户数据到内存
      memorydata.user = res.data
      // 保存到用户数据到本地
      localUtils.saveUserdata(res.data)
      // 跳转到主页面
      this.props.history.replace('/')
    }else {
      // 提示用户登录失败
      message.error(res.msg)
    }
  }

  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React 项目: 后台管理系统</h1>
        </header>

        <section className="login-content">
          <h2>用户登录</h2>
          <Form onFinish={this.onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名" },
                {min: 4, message: '用户名必须大于 4 位'}, 
                {max: 12, message: '用户名必须小于 12 位'}, 
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线 组成'}
              ]}
              onSubmit={this.handlesubmit}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                {min: 4, message: '用户名必须大于 4 位'}, 
                {max: 12, message: '用户名必须小于 12 位'}
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
                autoComplete="on"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
