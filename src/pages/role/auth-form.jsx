import React, { Component, Fragment, useState  } from "react";
import { Tree, Form, Input } from "antd";
import menuList from '../../config/menucofig'


export default class AuthForm extends Component {

  state = {
    role: {}, // 设置的角色
    checkedKeys: []
  }

  // 复选款选中的回调
  onCheck = (checkedKeys) => {
    this.checkedKeys = checkedKeys
    this.setState({
      checkedKeys
    })
    
  }

  componentDidMount() {
    this.setTree(this.tree)
    this.getPropstree()
  }

  // 获取父组件传来的内容
  getPropstree = () =>{
    const { role} = this.props
    const {menus} = role

    const dataSource= menus.filter((item)=>{
      return item !== '/order' 
    })
    this.setState({
      checkedKeys: dataSource,
      role
    })
  }

  render() {
    this.setTree = this.props.setTree
    const { role, checkedKeys } = this.state
    
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };
    return (
      <Fragment>
        <Form.Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Form.Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          treeData={menuList}
          ref={c => this.tree = c}
        ></Tree>
      </Fragment>
    );
  }
}
