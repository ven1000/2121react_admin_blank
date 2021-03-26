// product添加页面
import React, { Component } from 'react'
import {Card, Form, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/linkbutton'
import { ArrowLeftOutlined } from '@ant-design/icons'
import PicturesWall from './picturewall'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import RichTextEditor from './rich-text-editor'

const { TextArea } = Input;

export default class Productadd extends Component {
  state = {
    options:  [], // 分类选项
    detail: ''
  }

  // 根据分类信息获取
  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新
    const {isAddPage, product} = this
    const {pCategoryId} = product
    if(!isAddPage && pCategoryId!=='0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    // 更新options状态
    this.setState({
      options
    })
  }

  // 获取分类列表
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }

  // 加载下一级数据
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }

  // submit提交表单
  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.from.validateFields().then(
      async value => {
        const {name, desc, price, categoryIds} = value
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        
        const imgs = this.picwall.state.fileList
        const detail = this.editor.props.detail
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(!this.isAddPage) {
          product._id = this.product._id
        }
        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isAddPage? '添加' : '更新'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isAddPage ? '添加' : '更新'}商品失败!`)
        }
      }
    ).catch(
      error => {
        console.log(error);
      }
    )
  
  }

  // 级联选择框选择完成的回调
  handleChange = (vaule, selectoption) => {
    console.log(vaule, selectoption);
  }

  componentDidMount = () =>{
    this.getCategorys('0')
  }


  render() {
    // console.log(this.props);
    // 判断是显示添加页面还是修改页面
    const isAddPage = this.props.location.state  ? false : true

    // 商品数据，如果没有就设置为空
    const product = isAddPage ? {} : this.props.location.state.product

    const {pCategoryId, categoryId, imgs, detail, name, desc, price} = product
    this.product =product
    this.isAddPage = isAddPage

    // 创建一个接收级联分类ID的数组
    let categoryIds = []

    if(!isAddPage) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const formItemLayout = {
      labelCol: { span: 2 },  // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    const title = (<span>
      <LinkButton>
          <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} 
          onClick={() => this.props.history.goBack()}/>
        </LinkButton>
        <span>{isAddPage ? '添加商品' : '修改商品'}</span>
    </span>)
  
    return (
      <Card title={title} bordered={false} 
        style={{ width: '100%' }}>

          <Form ref={c => this.from = c} {...formItemLayout}>
            <Form.Item initialValue={name}
              label="商品名称"
              name="name"
              rules= {[[
                {required: true, message: '必须输入商品名称'}
              ]]}>
              <Input placeholder='请输入商品名称'/>
            </Form.Item>

            <Form.Item initialValue={desc}
              label="商品描述"
              name="desc"
              rules= {[[
                {required: true, message: '必须输入商品描述'}
              ]]}>
              <TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>

            <Form.Item initialValue={price}
              name="price"
              label="商品价格"
              rules= {[[
                {required: true, message: '必须输入商品价格'}
              ]]}>
              <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
            </Form.Item>

            <Form.Item
              name="categoryIds"
              initialValue={categoryIds}
              label="商品分类">
              <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}  /*需要显示的列表数据数组*/
                  loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                  onChange={this.handleChange}
                />
            </Form.Item>
          </Form>

          <Form.Item label="商品图片">
            <PicturesWall imgs={imgs} ref={c => this.picwall = c}/> 
          </Form.Item>
          
          <Form.Item label="商品详情">
            <RichTextEditor ref={c => this.editor = c} detail={detail}/>
          </Form.Item>

          <Form.Item>
            <Button type='primary' onClick={this.submit}>提交</Button> 
          </Form.Item>

      </Card>
    )
  }
}
