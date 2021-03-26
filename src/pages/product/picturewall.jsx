// 定义照片墙组件
import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {reqDeleteImg} from '../../api'


export default class PictureWall extends Component {
  state = {
    // 预览图片是否显示
    previewVisible: false,
    // 预览图片路径
    previewImage: '',
    // 预览图片名称
    previewTitle: '',
    // 照片文件
    fileList: []
  }

  componentDidMount = () => {

  }

  getpropsimgs = () => {
    // 判断是否传递图片数据
    const {imgs} = this.props
    let fileList
    if(imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: 'http://120.55.193.14:5000' + img
      }))
    }
    this.setState({fileList})
  }

  // 预览图片
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 更改图片
  handleChange = async ({file, fileList}) => {
    // 一旦上传成功, 将当前上传的file的信息修正(name, url)
    if(file.status==='done') {
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if(result.status===0) {
        message.success('上传图片成功!')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status==='removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }

    this.setState({ fileList })
  }

  // 关闭预览对话框
  handleCancel = ()=> {
    this.setState({
      previewVisible: false
    })
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="http://120.55.193.14:5000/manage/img/upload"
          accept= 'image/*'
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
