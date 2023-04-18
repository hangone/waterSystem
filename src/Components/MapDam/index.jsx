import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import { Map, Marker, APILoader, InfoWindow } from '@uiw/react-amap'
import { Popover, Button, Drawer } from 'antd'
import './index.css'

const Example = () => {
  const [show, setShow] = useState(false)
  const [winPosition, setWinPosition] = useState()
  const [infoWindowContent, setInfoWindowContent] = useState()
  const [content, setContent] = useState('<div>高德软件</div>')
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const dam1 = ` 蔡坊电站
     地理位置：
    东经115°28'3.21"
   北纬25°17'9.42"
   蔡坊水电站工程开发任务以发电和防洪为主。水库具年调节性能。枢纽建筑物主要由大坝、引水系统、厂房等组成。
   蔡坊水电站工程开发任务以发电和防洪为主。水库坝址集水面积117km2，水库正常蓄水位348.00m（黄海高程，下同），设计洪水位348.22m（设计洪水重现期采用50年），校核洪水位349.17m（校核洪水重现期采用500年），总库容2654万m3，调节库容1938万m3，水库具年调节性能。枢纽建筑物主要由大坝、引水系统、厂房等组成。`
  const dam2 = `黄地水电站
  地理位置
  东经115°30'28"
  北纬25°17'29"
  黄地水电站枢纽工程主要由大坝、溢洪道、发电引水系统及发电厂房建筑物组成。是一座以灌溉、发电为主，结合防洪、养殖等综合利用的小型水利枢纽工程。黄地水电站枢纽工程主要由大坝、溢洪道、发电引水系统及发电厂房建筑物组成。
  
  黄地水电站水库总库容48.7万m3，电站总装机320kW。根据国家《防洪标准》（GB50201--2014）和《水利水电工程等级划分及洪水标准》（SL252--2017），本工程等别为Ⅴ等，永久主要建筑物级别为5级，次要及临时水工建筑物为5级。大坝和溢洪道设计洪水标准采用20年一遇（P=5.0%）洪水，校核洪水标准采用200年一遇（P=0.50%）洪水。`
  const dam3 = `雲山水电站
  地理位置：
  东经115°31′10″
  北纬25°14′32″
  雲山水电站（原石头坪水电站）是一座以发电为主，结合防洪、养殖等综合利用的小型水利水电工程。枢纽建筑物由大坝、溢洪道、发电引水隧洞、电站厂房等组成。
  
  雲山电站主坝水库正常蓄水位529.5m（假设高程，下同），相应库容10.5万m3（复核成果，下同），水库校核洪水位532.26m，相应总库容16.6万m3，其中调洪库容6.1万m3，有效库容16.4万m3，死库容0.2万m3 （死水位518.5m），设计洪水位531.31m，相应库容14.3万m3。以发电为主，结合防洪、养殖等综合利用的小型水利水电工程。枢纽建筑物由大坝、溢洪道、发电引水隧洞、电站厂房等组成。`
  const dam4 = `黄沙电站
  地理位置：
  东经115°30'11.43"
  北纬25°14'45.38"
  黄沙水电站是一座以发电为主，结合防洪、养殖等综合利用的小型水利枢纽工程。该电站也是大脑河流域梯级开发的二级水电站。枢纽主要建筑物由大坝、发电引水系统和电站厂房组成。大坝坝址位于大脑河中上游甲治水汇合口下游约300m处，最大坝高53.5m，溢洪道布置在坝顶中央，无闸控制自由泄流。
  
  黄沙水电站是一座以发电为主，结合防洪、养殖等综合利用的小型水利枢纽工程。该电站也是大脑河流域梯级开发的二级水电站。枢纽主要建筑物由大坝、发电引水系统和电站厂房组成。大坝坝址位于大脑河中上游甲治水汇合口下游约300m处，最大坝高53.5m，溢洪道布置在坝顶中央，无闸控制自由泄流。发电引水隧洞布置在大坝右岸山体内，隧洞进口底板高程394m，隧洞全长1240m，为南北走向，隧洞开挖直径2.8m。进水口布置在大坝上游60m处的右岸山坑口处，为井式进水口，进水口底板高程394m。`
  const dam5 = `九角电站
  地理位置：
  东经115°28'0.14"
  北纬25°16'24.53"。
  九角水电站是一座以发电为主，结合防洪、养殖等综合利用的小型水利枢纽工程。枢纽建筑物由大坝、引水隧洞、压力管道、发电厂房等组成。
  九角水电站取水口位于厂房所在河流上游，建有一座拦河坝，坝型为拱坝，坝址以上控制集雨面积25.10km2，总库容为98.8×104m3。根据《安远县九角水电站工程竣工验收鉴定书》（2014年），九角水电站是一座以发电为主，结合防洪、养殖等综合利用的小型水利枢纽工程。枢纽建筑物由大坝、引水隧洞、压力管道、发电厂房等组成。
`
  return (
    <>
      {/* <input
        type="text"
        value={content}
        onChange={(evn) => setContent(evn.target.value)}
      /> */}
      <div style={{ width: '100%', height: '100%' }}>
        <Map zoom={12} center={[115.466706, 25.273481]}>
          <Marker
            title="蔡坊水电站"
            position={new window.AMap.LngLat(115.466706, 25.273481)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class='info'>
              蔡坊水电站
            </div>`,
              // 设置文本标注方位
              direction: 'right',
            }}
            // content={info.join('')}
            onClick={(evn) => {
              setOpen(true)
              setContent(dam1)
              // if (!show) {
              //   setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
              //   setShow(true)
              //   // setInfoWindowContent('<div>蔡坊水电站</div>')

              // } else {
              //   setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
              // }
            }}
          />

          <Marker
            title="黄地水电站"
            position={new window.AMap.LngLat(115.507778, 25.291389)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class='info'>
              黄地水电站
            </div>`,
              // 设置文本标注方位
              direction: 'right',
            }}
            onClick={(evn) => {
              setOpen(true)
              setContent(dam2)
              // if (!show) {
              //   setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
              //   setShow(true)
              //   setContent('<div>黄地水电站</div>')
              // } else {
              //   setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
              // }
            }}
          />
          <Marker
            title="雲山水电站"
            position={new window.AMap.LngLat(115.519444, 25.242222)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class='info'>
              雲山水电站
            </div>`,

              // 设置文本标注方位
              direction: 'right',
            }}
            onClick={(evn) => {
              setOpen(true)
              setContent(dam3)
              // if (!show) {
              //   setWinPosition(new window.AMap.LngLat(115.519444, 25.242222))
              //   setShow(true)
              //   setContent('<div>雲山水电站</div>')
              // } else {
              //   setWinPosition(new window.AMap.LngLat(115.519444, 25.242222))
              // }
            }}
          />
          <Marker
            title="黄沙水电站"
            position={new window.AMap.LngLat(115.503175, 25.242222)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class='info'>
              黄沙水电站
            </div>`,

              // 设置文本标注方位
              direction: 'left',
            }}
            onClick={(evn) => {
              setOpen(true)
              setContent(dam4)
              // if (!show) {
              //   setWinPosition(new window.AMap.LngLat(115.503175, 25.242222))
              //   setShow(true)
              //   setContent('<div>黄沙水电站</div>')
              // } else {
              //   setWinPosition(new window.AMap.LngLat(115.503175, 25.242222))
              // }
            }}
          />
          <Marker
            title="九角水电站"
            position={new window.AMap.LngLat(115.467558, 25.28595)}
            label={{
              // 设置文本标注偏移量
              // offset: new AMap.Pixel(20, 20),
              // 设置文本标注内容
              content: `<div class='info'>
              九角水电站
            </div>`,
              position: 'right',
            }}
            onClick={(evn) => {
              setOpen(true)
              setContent(dam5)
              // if (!show) {
              //   setWinPosition(new window.AMap.LngLat(115.467558, 25.28595))
              //   setShow(true)
              //   setContent('<div>九角水电站</div>')
              // } else {
              //   setWinPosition(new window.AMap.LngLat(115.467558, 25.28595))
              // }
            }}
          />
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={onClose}
            open={open}>
            <p>{content}</p>
          </Drawer>
          {/* {winPosition && (
            <InfoWindow
              visiable={show}
              position={winPosition}
              offset={{ x: 0, y: -10 }}
              content={info.join('')}
              onClose={(evn) => {
                console.log('evn2', evn, show, content, info.join(''))
              }}
            />
          )} */}
        </Map>
      </div>
    </>
  )
}

const MountMap = () => (
  <APILoader akey="a7a90e05a37d3f6bf76d4a9032fc9129">
    <Example />
  </APILoader>
)

export default MountMap
