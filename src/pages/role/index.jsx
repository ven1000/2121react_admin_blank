import React, { Component, Fragment } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import formateDate from '../../utils/fromat'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memmoryutil'


export default class Role extends Component {
  state = {
    roles: [], // 角色数组
    // 角色栏设置
    colums: [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ], 
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  componentDidMount() {
    this.getRoles()
  }

  // 获取角色列表
  getRoles = async() => {
    const res = await reqRoles()
    if(res.status === 0) {
      this.setState({
        roles: res.data
      })
      message.success('获取角色数据成功')
    }else {
      message.error('获取角色数据失败')
    }
  }

  // 点击设置角色权限按钮
  setRoleRight = ()=> {
    this.setState({
      isShowAuth: true
    })
  }

  // 点击创建角色按钮
  createRole = ()=> {
    this.setState({
      isShowAdd: true
    })
  }

  // 添加角色对话框确认按钮
  addRole = () => {
    this.addform.validateFields().then(
      // 验证通过
      async role => {
        const response = await reqAddRole(role)
        console.log(response);
        // 验证通过
        if(response.status === 0) {
          message.success(`添加角色成功`)
          // 重新获取角色
          this.getRoles()
        }
      }
    ).catch(
      // 验证失败
      error => {
        console.log(error);
      }
    )
  }

  // 点击某行，切换到某行
  onRow = (role) => {
    return {
      onClick: event => { // 点击行
        this.setState({
          role
        })
      },
    }
  }

  // 点击设置权限对话框确认按钮
  updateRole = async () => {
    // 获取选中的节点
    const {checkedKeys} = this.tree.state
    const {role} = this.state
    // 设置角色对象
    role.menus = checkedKeys
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // 发送请求
    const res = await reqUpdateRole(role)
    if(res.status === 0) {
      message.success('设置权限成功')
      // 关闭对话框
      this.setState({
        isShowAuth: false
      })
      // 重新获取数据
      this.getRoles()
    }
    
  }

  render() {
    const { roles, colums, role, isShowAdd, isShowAuth } = this.state
    // 设置卡片标题
    const  title = (<Fragment><Button type="primary"  onClick={this.createRole}>创建角色</Button>
    <Button type="primary" style={{marginLeft: '10px'}} disabled={!role.name} onClick={this.setRoleRight}>设置角色权限</Button></Fragment>)
    return (
      <Card title={title}>
        {/* 展示表格 */}
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={colums}
          pagination={{
            showSizeChanger: false,
            showQuickJumper: true,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => { // 选择某个radio时回调
              this.setState({
                role
              })
            }
          }}
          onRow = {this.onRow}
        ></Table>

        {/* 添加角色对话框 */}
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            // this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => this.addform = form}
          />
        </Modal>

          {/* 设置权限对话框 */}
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm setTree={c => this.tree= c } role={role}/>
        </Modal>

      </Card>
    )
  }
}
