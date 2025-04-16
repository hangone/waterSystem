import React, {  } from 'react'
import MountMap from '../../../../Components/MapDam'

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
