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
    <div className="waterChange-div homeTable-div commTable-div" style={{margin:'0 10px'}}>
      {/* <div
        className="body-bottom-div spaceAlign"
        style={{ background: 'white', height: '80vh' }}>
        <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin>
        加载地图组件

        <MapComponent></MapComponent>
      </div> */}
      <Typography className="changeColor">
        <Title className="changeColor">
          基于小水电清理整改的数字孪生监测系统
        </Title>
      <Divider style={{backgroundColor:'white'}}/>
        {/* <Text className="changeColor" style={{fontSize:'16px',fontWeight:'300'}}>
          该系统平台通过数字孪生技术和智能化监测和预警技术的应用，提高小水电站的监管和维护水平，实现对小水电清理整改的精细化管理，促进小水电清理整改工作的顺利实施。
        </Text> */}
        <Title level={2} className='changeColor'>平台背景</Title>
        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
          平台立足于党中央、国务院关于长江经济带“共抓大保护、不搞大开发”的决策部署和小水电清理整改工作要求，以赣州市安远县蔡坊水电站、黄地水电站、雲山水电站、黄沙水电站、九角水电站等5座水电站的清理整改为目标案例构建该平台，实现对小水电站的清理整改工作的精细化管理，促进小水电清理整改工作的顺利实施。
        </Paragraph>
        <Title level={2} className='changeColor'>平台特点：</Title>
        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
          1、Web端平台的自主开发：在Web端平台的前端开发中采用了业内前沿的架构技术，包括Reacti框架、Antd组件库、Axios网络请求库、Echarts数据可视化库等，同时采用数字李生技术，构建小水电水库大坝3D模型，实现对小水电站相关数据的实时监测与评估。后端开发中项目采用Python语言和
          Flask这个轻量级的Python Web框架作为后端的开发支持，小巧、灵活和易于扩展。
        </Paragraph>

        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
          <Text className="changeColor">
            2、智能化监测与预警技术的应用：该系统采集水质数据，并依靠预测算法实现智能预警，一旦监测结果超出阈值，平台将自动发出预警提示，帮助运行管理部门进行快速处置，预防和降低水质问题对生态环境的影响。
          </Text>
        </Paragraph>

        <Paragraph style={{ color: 'white' ,fontSize:'16px',fontWeight:'300'}}>
          <Text className="changeColor">
            3、硬件及云服务的自主开发：在硬件方面使用了基于可编程的嵌入式芯片设计的树莓派和数字传感器设备模块采集数据，采用单总线接口进行数据传输，实现了低功耗、高性能和可靠性强的数据采集功能。同时架设云端服务器网页接口实现数据传输，并整合了CloudflareTunnel技术实现外网访问， 使得该项目具备远程监控的功能。
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
