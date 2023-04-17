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
  const info = []
  info.push(
    '<div class=\'input-card content-window-card\'><div><img style="float:left;width:67px;height:16px;" src=" https://webapi.amap.com/images/autonavi.png "/></div> '
  )
  info.push('<div style="padding:7px 0px 0px 0px;"><h4>高德软件</h4>')
  info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>")
  info.push(
    "<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>"
  )
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
              setContent('<div>蔡坊水电站</div>')
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
              setContent('<div>黄地水电站</div>')
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
              setContent('<div>雲山水电站</div>')
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
              setContent('<div>黄沙水电站</div>')
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
              setContent('<div>九角水电站</div>')
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
