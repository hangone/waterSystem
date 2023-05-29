import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Spin } from 'antd'
import { MessageTool, MessageToolClear } from 'Components/Tools/MessageTool'
import {
  getWaterMinute1,
  getWaterMinute2,
  getWaterMinute3,
  getRainMinute1,
  getRainMinute2,
  getRainMinute3,
  getRainMinute4,
  getRainMinute5,
  getCapMinute1,
  getInflowMinute2,
  getOutflowMinute3,
} from 'Services/Home/minute'
import {
  changeDataLine,
  changeDataLine2,
  dateSort,
  judgeListData,
  stripDayUselessData,
  setDomInnerText,
} from 'Utils'
import { resetTableTitleWidth } from 'Utils/layoutreset'
import MapComponent from '../../../../Components/Map'

// 引入兄弟传值模块
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment'

import * as echarts from 'echarts'
import Common from 'Common'
import { formatDate } from 'Utils'
import 'Assets/css/comm.css'
import './index.css'

import bgHome from '../../../../Assets/images/pic/bg-home.png'
import flagWater from '../../../../Assets/images/pic/flag-water.png'
import flagRain from '../../../../Assets/images/pic/flag-rain.png'
import { map } from 'leaflet'
import { Divider, Typography } from 'antd'

function WaterChange() {
  const { Title, Paragraph, Text, Link } = Typography
  return (
    <div
      className="waterChange-div homeTable-div commTable-div"
      style={{ margin: '0 10px' }}>
      {/* <div
        className="body-bottom-div spaceAlign"
        style={{ background: 'white', height: '80vh' }}>
        <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin>
        加载地图组件

        <MapComponent></MapComponent>
      </div> */}
      <Typography className="changeColor">
        <Title className="changeColor">清逸——智慧水系统</Title>
        <Divider style={{ backgroundColor: 'white' }} />
        {/* <Text className="changeColor" style={{fontSize:'16px',fontWeight:'300'}}>
          该系统平台通过数字孪生技术和智能化监测和预警技术的应用，提高小水资源监测点的监管和维护水平，实现对小水电清理整改的精细化管理，促进小水电清理整改工作的顺利实施。
        </Text> */}
        <Title level={2} className="changeColor">
          平台背景
        </Title>
        <Paragraph
          style={{ color: 'white', fontSize: '16px', fontWeight: '300' }}>
          清逸智慧水系统的设计目标是通过物联网、云计算、大数据和人工智能等技术，建立智能化、数字化的水环境监测与管理服务平台，实现水环境的高效布控、智能监测和科学管理，全面提升水环境质量和水资源利用效率。
        </Paragraph>
        <Title level={2} className="changeColor">
          平台特点：
        </Title>
        <Paragraph
          style={{ color: 'white', fontSize: '16px', fontWeight: '300' }}>
          1、在 Web 端平台模块构建方面，我们采用了互联网行业内前沿的 React
          开发框架，同时使用了阿里巴巴旗下蚂蚁集团的开源组件库 Antd、Axios
          网络请求库、百度开源的 Echarts 数据可视化库，高德地图的 React-Amap
          组件库等组件，自主构建出了清逸智慧水系统的 Web
          端平台，并能够根据实际需要进行自定义修改，可满足水环境监测与管理服务的一系列要求。
        </Paragraph>

        <Paragraph
          style={{ color: 'white', fontSize: '16px', fontWeight: '300' }}>
          <Text className="changeColor">
            2、在数字孪生技术模块构建方面，我们采集水质数据，使用 Three.js 等
            Web3D 技术在 Web 端平台的前端开发中构建水资源，河道的 3D
            模型，并实时展示相关数据，可实现智能预警功能，以帮助运行管理部门进行快速处置，预防和降低水质问题对生态环境的影响，同时实现对水资源相关数据的可视化观测。
          </Text>
        </Paragraph>

        <Paragraph
          style={{ color: 'white', fontSize: '16px', fontWeight: '300' }}>
          <Text className="changeColor">
            3、在硬件和云服务模块方面，我们利用了基于可编程的嵌入式芯片设计的树莓派和数字传感器设备模块，以及云端服务器网页接口实现数据传输，并整合了
            Cloudflare Tunnel 技术实现外网访问，并使用 Python 语言和 Flask
            轻量级的 Web
            框架作为后端的开发支持。这些技术的应用使得该项目具备远程监控的功能，并实现了低功耗、高性能和可靠性强的数据采集功能。
          </Text>
        </Paragraph>
        <Paragraph
          style={{ color: 'white', fontSize: '16px', fontWeight: '300' }}>
          <Text className="changeColor">
            4、该模块采用先进的深度学习算法等相关技术，对水资源监测过程中产生的大量数据进行处理和分析，实现对水资源监测过程的实时监测、降低数据分析成本和提高数据的精度和可解释性、增加用户对处理过程的理解，从而真正实现数字化管理、提高处理效率和水环境质量，使该系统的数字化模块成为该系统的重要支撑。这一技术的应用不仅能提高水资源监测过程的精度并可靠，同时也能够有效地解决水资源利用领域中的一些问题。
          </Text>
        </Paragraph>

        {/* <Title level={2}>平台功能：</Title>
        <Paragraph style={{ color: 'white' ,fontSize:'19px',fontWeight:'300'}}>
          <Text className="changeColor">
            1、水质监测：实时监测水库水质数据，包括水温、溶解氧、电导率、PH值、浊度、氨氮
          </Text>
        </Paragraph> */}
        {/* <Title level={2} className="changeColor">联系我们</Title>
        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
          <Text className="changeColor">1、联系电话：17379698326</Text>
          
        </Paragraph>
        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
        <Text className="changeColor">
            2、联系邮箱：wangyuhan@email.ncu.edu.cn
          </Text>
        </Paragraph> */}
      </Typography>
    </div>
  )
}

export default WaterChange
