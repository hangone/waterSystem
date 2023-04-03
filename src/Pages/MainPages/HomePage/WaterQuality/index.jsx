import React, { useEffect, useState, useRef, Fragment } from 'react'
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool'; 
//import { waterQualitySystemDomain } from 'Config'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Cascader,
  Table,
  Divider,
} from 'antd'
//引入service中的axios模块
import { getWaterQualityData } from '../../../../Services/waterQuality'
import RadarChart from './charts'


import './index.css'
import options from './formData/options'
import Columns from './formData/column'

const { Search } = Input
//const columns = Columns

function BriefIndex() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  function onChange(value) {
    console.log(value)
    if (!value) {
      return
    }
    setLoading(true)
    getWaterQualityData(Number(value[1]))
      .then((res) => {
        setData(res.tbody)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
        setData([])
        MessageTool('数据获取失败', 'error')
      })
  }

  function onSearch(val) {
    setLoading(true)
    getWaterQualityData(val)
      .then((res) => {
        setData(res.tbody)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
        setData([])
        MessageTool('数据获取失败', 'error')
      })
  }

  useEffect(() => {
    if (loading) {
      MessageTool('加载中', 'loading')
    }
  }, [loading])

  return (
    <div id="platform-body">
      <div className="body">
        <div className="top">
          <div style={{ width: '80%', height: '80%' }} className="topLeft">
            <div className="theme-box">
              <div
                style={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}>
                  <iframe
                    src="https://app.modaiyun.com/embedded/1638806643092013056?viewport=false&autoplay=false&autorotate=false&hideTools=false&showBIM=false&showBBoxSize=false&showKooRender=false&showSettings=false"
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allowFullScreen></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="topRight"></div>
        </div>

        <div className="content theme-box">
          <Cascader
            options={options}
            onChange={onChange}
            size="large"
            className="antdCas"
            placement="bottomLeft"
            style={{ width: '8vw' }}></Cascader>
          <Search
            placeholder="请输入断面名称"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={{ width: '30vw' }}
            className="antdSearch"
          />
        </div>
        <div>
          <Divider />

          <Table
            columns={Columns}
            dataSource={data}
            loading={loading}
            style={{ width: '1000px' }}
            scroll={{
              x: 400,
              y: 400,
            }}
          />
          {data.length > 1 ? <RadarChart data={[]}/> : <RadarChart data={data}/>}
        </div>
        
      </div>
    </div>
  )
}

export default BriefIndex
