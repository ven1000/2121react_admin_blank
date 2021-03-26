import React, { Component } from 'react'
import {Card,Table, message,Button, Modal, Form, Input} from 'antd'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api/index'
import LinkButton from '../../components/linkbutton'
import {
  ArrowRightOutlined,
  PlusOutlined
} from '@ant-design/icons'
import './index.less'
import AddFrom from './add-from'
import UpdateFrom from './update-from'

export default class Category extends Component {
  state = {
    categoryarr: [],//一级分类数据
    subCategorys: [], // 二级分类数据
    columns : [
      { title: '分类名称', dataIndex: 'name', key: 'name' },
      { title: '操作', width:300, dataIndex: 'oprate', key: 'age',
        render: (_,cate) => ( // 返回需要显示的界面标签
          <span>
            <LinkButton onClick={()=>{this.showModifyModal(cate)}}>修改分类</LinkButton>
            {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
            {this.state.parentID==='0' ? <LinkButton onClick={()=>{this.showSubCategory(cate)}}>查看子分类</LinkButton> : null}
          </span>
        )
      }
    ],
    parentID: '0', // 当前分类的父分类id
    parentName: '', // 父分类分类名称
    showSatus: 0, // 0 都不显示 ，1 显示添加 ， 2 显示更新
    loading: false, // 是否在加载数据中
    modifyData: {name: '一级分类'} // 当前修改的分类信息
  }
  componentDidMount() {
    // 获取一级分类数据
    this.getcatedata(0)
  }

  // 展式一级分类
  showCategorys = ()=> {
    this.setState({
      parentID: '0'
    }, )
  }

  // 查看子分类数据
  showSubCategory = async(cate) =>{
    this.setState({
      loading: true
    })
    // 获取分类id
    const {_id, name} = cate
    this.setState({
      parentID: _id,
      parentName: name
    })
    const res = await reqCategorys(_id)
    if(res.status === 0) {
      this.setState({ 
        subCategorys: res.data,
        loading: false
      })
    }else{
      message.error('获取分类数据失败')
    }
  }
  // 获取一级分类数据
  getcatedata= async()=>{
    this.setState({
      loading: true
    })
    const res = await reqCategorys(0)
    if(res.status === 0) {
      this.setState({ 
        categoryarr: res.data,
        loading: false
      })
    }else{
      message.error('获取分类数据失败')
    }
  }

  // 添加分类
  showAdd = ()=> {
    // 显示添加分类对话框
    this.setState({
      showSatus: 1
    })
  }

  // 添加分类确定按钮被点击
  addFrom = ()=>{
    // 判断是否通过表单验证
    this.addfrom.validateFields().then(
      // 如果通过验证则发起请求
      async values => {
        // 获取表单数据
        const {parentId, categoryName} = values
        // 发送请求
        const res = await reqAddCategory(parentId, categoryName)
        // 对结果进行判断
        if(res.status === 0) {
          message.success('添加分类成功')
          // 成功则关闭对话框，重置对话框
          this.setState({
            showSatus: 0
          })
          this.addfrom.resetFields()
          // 重新获取数据
          await this.getcatedata()
          // 显示第一级分类数据
          this.setState({
            parentID: '0'
          })
        }else{
          message.error('添加分类失败')
        }
      }
    ).catch(
      error => {
        message.error(error.errorFields[0].errors)
      }
    )

    // 重置表单数据
  }
  // 取消添加分类
  cancelAdd = ()=> {
    // 关闭对话框
    this.setState({
      showSatus: 0
    })
    // 重置表单
    this.addfrom.resetFields()
  }
  // 获取添加子表单组件
  setForm = (from)=>{
    this.addfrom = from
  }

  // 点击修改按钮，显示修改对话框
  showModifyModal = (cate) => {
    // 将分类信息存储到state中,显示修改对话框
    this.setState({
      modifyData: cate,
      showSatus: 2
    })
  }

  // 修改对话框确认按钮
  modifyFromcl = () => {
    this.modifyfrom.validateFields().then(
      // 如果通过验证则发起请求
      async values => {
        // 获取分类数据
        const categoryId = this.state.modifyData._id
        const {categoryName} = values

        // 发送请求
        const res = await reqUpdateCategory(categoryId, categoryName)
        // 对结果进行判断
        if(res.status === 0) {
          message.success('修改分类成功')
          // 成功则关闭对话框，重置对话框
          this.setState({
            showSatus: 0
          })
          // 重新获取数据
          await this.getcatedata()
          // 显示第一级分类数据
          this.setState({
            parentID: '0'
          })
        }else{
          message.error('修改分类失败')
        }
      }
    )
  }

  // 修改对话框取消按钮
  cancelModify = () => {
    this.setState({
      showSatus: 0
    })
  }

  // 获取修改分类对话框组件
  modifyFrom = (from) => {
    this.modifyfrom = from
  }

  render() {
    const {categoryarr,subCategorys, columns, parentID, parentName,loading, showSatus} = this.state

    const title = parentID === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined/>
        <span>{parentName}</span>
      </span>
    )
    return (
      <div className="category">
        <Card title={title} bordered={false} 
        style={{ width: '100%' }} 
        extra={<Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
              </Button>}>
          <Table
            bordered
            loading={loading}
            rowKey='_id'
            columns={columns}
            dataSource={ parentID === '0' ? categoryarr : subCategorys}
            pagination={{defaultPageSize: 8,showQuickJumper: true}}
          />
        </Card>

        {/* 修改分类对话框 */}
        <Modal 
          visible={showSatus === 2}
          cancelText = "取消"
          okText= "确定"
          title="添加分类"
          onOk={this.modifyFromcl}
          onCancel={this.cancelModify}>
            <UpdateFrom 
            categoryName={this.state.modifyData.name}
            setinput={this.modifyFrom}
            />

        </Modal>


        {/* 添加分类对话框 */}
        <Modal 
          visible={showSatus === 1}
          cancelText = "取消"
          okText= "确定"
          title="添加分类"
          onOk={this.addFrom}
          onCancel={this.cancelAdd}>
           <AddFrom 
            categorys={categoryarr}
            parentId={parentID}
            setfrom ={this.setForm}>
           </AddFrom>
        </Modal>
      </div>
    )
  }
}
