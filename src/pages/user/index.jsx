import React, { Component } from "react";
import { Card, Button, Table, message, Modal, Popconfirm } from "antd";
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from "../../api"
import formateDate from "../../utils/fromat"
import LinkButton from "../../components/linkbutton"
import UserFrom from "./user-from"

export default class User extends Component {
  state = {
    dataSource: [], //用户数据
    // 表格展示规则
    colums: [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },

      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        key: "role_id",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ],
    roles: [], //角色数组
    // 添加和修改用户对话框显示
    showSatus: false,
  };

  // 根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    // 保存
    this.roleNames = roleNames;
  };

  // 获取用户数据
  getUser = async () => {
    const res = await reqUsers();
    if (res.status === 0) {
      // 初始化角色名称
      this.initRoleNames(res.data.roles);
      // 保存数据到状态
      this.setState({
        dataSource: res.data.users,
        roles: res.data.roles
      })
    } else {
      message.error("获取用户数据失败");
    }
  }

  // 点击创建用户按钮，展示对话框
  showAddUserModal = () => {
    this.from && this.from.setFieldsValue({
      create_time: '',
      email: '',
      password: '',
      phone: '',
      role_id: '',
      username: ''
    })
    this.setState({
      showSatus: true
    })
  }

  // 关闭对话框
  cancelModal = () => {
    // 重置表单
    this.user = {
      create_time: '',
      email: ''
    }
    this.setState({
      showSatus: false
    })
  }

  // 点击修改用户按钮
  showUpdate = (user) => {
    console.log(user);
    this.from && this.from.setFieldsValue(user)
    // 将表单数据填入
    this.user = user

    // 显示对话框
    this.setState({
      showSatus: true
    })
    
  }

  componentDidMount() {
    this.getUser();
  }

  // 将子组件表单对象挂载到父组件实例
  setfrom = (from) => {
    this.from = from
    console.log(this.from);
  }

  // 点击对话框的确认按钮
  addorupdate = ()=> {
    // 验证表单是否合法
    this.from.validateFields().then(
      // 验证通过
      async user => {
        console.log(user);
        // 如果是更新, 需要给user指定_id属性
        if (this.user) {
          user._id = this.user._id
        }
        const response = await reqAddOrUpdateUser(user)
        // 验证通过
        if(response.status === 0) {
          message.success(`${this.user ? '修改' : '添加'}用户成功`)
          this.setState({
            showSatus: false
          })
        }
      }
    ).catch(
      // 验证失败
      error => {
        console.log(error);
        // message.error(error)
      }
    )
  }

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUser()
        }
      }
    })
  }


  render() {
    const title = <Button type="primary" onClick={this.showAddUserModal}>创建用户</Button>
    const user = this.user || {}
    const { showSatus, dataSource, colums, roles } = this.state
    return (
      <Card title={title}>
        <Table
          dataSource={dataSource}
          columns={colums}
        ></Table>
        <Modal
          visible={showSatus}
          style={{width: '50%'}}
          cancelText="取消"
          okText="确定"
          title={user._id ? "修改用户" : "添加用户"}
          onOk={this.addorupdate}
          onCancel={this.cancelModal}
        >
          <UserFrom
            setForm={this.setfrom}
            roles={roles}
            user={user}
          ></UserFrom>
        </Modal>
      </Card>
    );
  }
}
