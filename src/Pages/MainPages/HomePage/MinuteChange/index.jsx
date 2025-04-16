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
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', marginTop: '-10px' }}>
      <iframe
        title="全国水质数据"
        src="https://szzdjc.cnemc.cn:8070/GJZ/Business/Publish/Main.html"
        width="100%"
        height="90vh"
        sandbox="allow-same-origin allow-scripts allow-forms"
        style={{ border: 'none', height: '100vh' }}
      />
      <div style={{ width: '100%', height: '54px', backgroundColor: '#0088BB', position:"absolute" ,top:'0px'}}></div>
      <div />
    </div>
  )
}

export default WaterChange
