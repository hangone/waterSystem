import React, { useState } from 'react'
import { Table, Spin, Cascader, Input, Divider } from 'antd'
import { MessageTool } from 'Components/Tools/MessageTool'
import options from '../../WaterPage/WaterQuality/formData/options'
import columns from '../../../../Components/columns/column'
// 引入兄弟传值模块

import { getWaterQualityData } from '../../../../Services/waterQuality'

import 'Assets/css/comm.css'
import './index.css'

const { Search } = Input

function WaterChange() {
  // 计时器
  let ITimer = null
  const preIsShowTitle = sessionStorage.getItem('water_isShowTitle')
  const [isShowTitle, setIsShowTitle] = useState(
    preIsShowTitle == 'true' ? preIsShowTitle : false
  )
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false)
  const [isTableCollapse, setIsTableCollapse] = useState(true)
  const [dataSource, setDataSource] = useState([])

  // 五、获取远程数据
  function onChange(value) {
    console.log(value)
    if (!value) {
      return
    }
    setIsLoading(true)
    getWaterQualityData(Number(value[1]))
      .then((res) => {
        setDataSource(res.tbody)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败', 'error')
      })
  }

  function onSearch(val) {
    setIsLoading(true)
    getWaterQualityData(val)
      .then((res) => {
        setDataSource(res.tbody)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败!', 'error')
      })
  }
  return (
    <div className="waterChange-div homeTable-div commTable-div">
      <div className="body-bottom-div" style={{ background: 'white' }}>
        <div
          className="bottom-top"
          style={{
            height: isTableCollapse ? 'inherit' : '50%',
            position: isTableCollapse ? 'absolute' : 'relative',
          }}>
          <div className="content">
            <Spin
              tip="加载数据中"
              spinning={isLoading}
              style={{ display: isLoading ? 'flex' : 'none' }}></Spin>
            <Cascader
              options={options}
              onChange={onChange}
              size="large"
              className="antdCas"
              placement="bottomLeft"
              placeholder="请选择区域"
              style={{ width: '12vw' }}></Cascader>
            <Search
              placeholder="请输入断面名称"
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={onSearch}
              style={{ width: '30vw', backgroundColor: 'blue' }}
              className="antdSearch"
            />
          </div>
          <div className="table">
            <Divider />
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={true}
              loading={isLoading}
              bordered
              style={{ width: '400' }}
              scroll={{ y: 800, x: 800 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterChange
