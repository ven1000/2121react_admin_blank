import React, { Component } from 'react'
import { Form,  Input } from 'antd'
import { PropTypes } from 'prop-types'

export default class UpdateFrom extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setinput: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.sendinput(this.addFrom)
  }
  render() {
    const {categoryName, setinput} = this.props
    this.sendinput = setinput
    return (
      <Form
        name="basic"
        ref={c=>{this.addFrom = c}}
      >
        <Form.Item
          label="分类名称"
          name="categoryName"
          rules={[{ required: true, message: '请输入分类名称' }]}>
          <Input placeholder={categoryName}/>
        </Form.Item>
      </Form>
    )
  }
}
