// 默认页面
import React, { Component } from 'react'
import {Card, Select, Button, Table, Input, message} from 'antd'
import {
  ArrowRightOutlined,
  PlusOutlined
} from '@ant-design/icons'
// 发送请求的api
import {reqProducts,reqUpdateStatus,reqSearchProducts} from '../../api/index'
import LinkButton from '../../components/linkbutton'

const {Option} = Select

export default class Prudcuthome extends Component {
  state = {
    // 产品数据
    products: [],
    // 商品展示设置
    columns: [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 150,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span style={{marginLeft: '10px'}}>{status===1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 150,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/add', {product})}>修改</LinkButton>
            </span>
          )
        }
      },
    ],
    // 是否在更新数据
    loading: false,
    // 页码
    pageNum: 1,
    // 每页显示数据条数
    pageSize: 10,
    // 总共数据
    total: 0,
    // 搜索关键字
    searchKey: '',
    searchType: 'productName'
  }
  // 添加商品按钮
  showAdd = () => {
    
  }

  // 获取商品数据
  getProudct = async () => {
    // 获取搜索参数
    const {pageNum,pageSize,searchKey,searchType} = this.state
    // 判断是否有搜索关键字
    if(searchKey) {
      const res = await reqSearchProducts(pageNum,pageSize,searchKey,searchType)
      if(res.status === 0) {
        this.setState({
          products: res.data.list,
          total: res.data.total
        })
      }else {
        message.error('获取商品数据失败')
      }
    }else{
      const res = await reqProducts(pageNum,pageSize)
      if(res.status === 0) {
        this.setState({
          products: res.data.list,
          total: res.data.total
        })
        // console.log(res.data);
      }else {
        message.error('获取商品数据失败')
      }
    }

    
  }

  // 更改页码的回调
  changePagenum = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize
    })
    // 获取数据
    this.getProudct()
  }

  // 对商品进行下架，上架处理
  updateStatus = async (id, newStatus) => {
    const res = await reqUpdateStatus(id, newStatus)
    if(res.status === 0) {
      // 更新状态成功，重新获取数据
      this.getProudct()
    }else {
      message.error('状态更新失败')
    }
  }

  // 更改搜索方式
  changeSearchType = (value) => {
    this.setState({
      searchType: value
    })
  }

  // 更改关键字
  changeSearchKey = (e) =>{
    this.setState({
      searchKey: e.target.value
    })
  }

  // 点击添加商品按钮，跳转到添加商品页面
  showAdd = () => {
    this.props.history.push('/product/add')
  }

  componentDidMount =()=> {

    this.getProudct()
  }


  render() {
    const {loading,columns,products,pageSize,pageNum,total } = this.state
    const title = (
      <div>
        <Select style={{width: '150px'}} defaultValue="productName" onChange={this.changeSearchType}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input style={{width: '150px', marginLeft: '15px'}} placeholder="关键字" onChange={this.changeSearchKey}>
        </Input>
        <Button type="primary" style={{marginLeft: '15px'}} onClick={this.getProudct}>搜索</Button>
      </div>
    )
    return (
      <div>
        <Card title={title} bordered={false} 
        style={{ width: '100%' }} 
        extra={<Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加商品
              </Button>}>
          <Table
            bordered
            loading={loading}
            rowKey='_id'
            columns={columns}
            dataSource={products}
            pagination={{
              current: pageNum,
              total,
              pageSize: pageSize,
              showSizeChanger: false,
              showQuickJumper: true,
              onChange: this.changePagenum
            }}
          />
        </Card>
      </div>
    )
  }
}
