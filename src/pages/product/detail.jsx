// prodcut 详情页面
import React, { Component } from 'react'
import {
  Card,
  List
} from 'antd'
import LinkButton from '../../components/linkbutton'
import {reqCategory} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
import { ArrowLeftOutlined } from '@ant-design/icons'

const Item = List.Item

export default class Productdetail extends Component {
  state = {
    cName1: '', // 一级分类名称
    cName2: '' // 二级分类名称
  }
  componentDidMount() {
    this.getProductsCate()
  }

  // 获取商品分类
  getProductsCate = async() =>  {
    // 获取商品分类
    const {pCategoryId, categoryId} = this.props.location.state.product
    if(pCategoryId==='0') { 
      // 一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { 
      // 二级分类下的商品
      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }

  render() {

    // 读取携带过来的state数据
    const {name, desc, price, detail, imgs} = this.props.location.state.product
    const {cName1, cName2} = this.state

    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} 
          onClick={() => this.props.history.goBack()}/>
        </LinkButton>

        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
}