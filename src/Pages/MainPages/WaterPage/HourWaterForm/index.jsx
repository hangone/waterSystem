import React, { useEffect, useState, useRef } from 'react'
import { DatePicker, Button, Empty, Table } from 'antd'
import moment from 'moment'
import {
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { getHourWaterForm } from 'Services/Home/search'
import { MessageTool } from 'Components/Tools/MessageTool'
import { OutputExcel } from 'Components/Tools/OutputExcel'
import { OutputPrint } from 'Components/Tools/OutputPrint'
import MapComponent from '../../../../Components/Map'
import Poi from '../../../../Components/MapSearch'
import MountMap from '../../../../Components/MapDam'
import { Map, Marker, APILoader, InfoWindow } from '@uiw/react-amap'

import Common from 'Common'
import Tools from 'Components/Tools/TablesData'
import { reverseFormatDate2, changeMomentType } from 'Utils'
import './index.less'

function DayWaterForm() {
  return (
    <div className="dayWaterChart-div commTable-div">
      <div
        className="body-bottom-div spaceAlign"
        style={{ background: 'white', height: '80vh' }}>
        {/* <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin> */}
        {/* 加载地图组件 */}
        <MountMap></MountMap>
        {/* <MapComponent></MapComponent> */}
      </div>
      {/* <Poi></Poi> */}
     
    </div>
  )
}

export default DayWaterForm
