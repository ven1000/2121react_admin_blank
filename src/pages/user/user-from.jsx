import React, { Component } from "react";
import {Form, Input, Select} from 'antd'

const { Option } = Select

export default class Userfrom extends Component {

  componentDidMount = ()=> {
    // 将表单对象传递给父组件
    // console.log(this.formRef);
    this.setForm(this.from)
  }



  render() {
    const {setForm, roles, user} = this.props
    this.setForm = setForm
    return (
      <div>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          name="basic"
          initialValues={user}
          ref={c => this.from = c}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input allowClear  />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="请输入密码" allowClear />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: "请输入手机号" }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input allowClear  />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role_id"
          >
            <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
