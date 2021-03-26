import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const {Option} = Select
 
export default class AddFrom extends Component {
  static propTypes = {
    setfrom : PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }


  componentDidMount() {
    // 将表单对象传递给父组件
    this.setfrom(this.addFrom)
  }

  render() {
    const {categorys, parentId ,setfrom} = this.props
    this.setfrom = setfrom
    return (
      <Form
        name="basic"
        ref={c=>{this.addFrom = c}}
        initialValues={{parentId:parentId}}
      >
        <Form.Item
          label="分类名称"
          name="parentId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map(item=>{
              return <Option key={item._id} value={item._id}>{item.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="品类名称"
          name="categoryName"
          rules={[{ required: true, message: '请输入分类名称' }]}>
          <Input placeholder="请输入分类名称"/>
        </Form.Item>
      </Form>
    )
  }
}
