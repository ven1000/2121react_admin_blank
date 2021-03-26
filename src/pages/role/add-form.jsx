import React, { Component, Fragment } from "react";
import { Form, Input } from "antd";

export default class AddRoleForm extends Component {
  componentDidMount() {
    this.setForm(this.from)
  }
  render() {
    this.setForm = this.props.setForm
    return (
      <Fragment>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          ref={(c) => (this.from = c)}
        >
          <Form.Item
            label="角色名"
            name="roleName"
            rules={[{ required: true, message: "请输入角色名" }]}
          >
            <Input placeholder="请输入角色名" />

          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}
