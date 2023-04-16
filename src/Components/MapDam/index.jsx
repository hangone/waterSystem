import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import { Map, Marker, APILoader, InfoWindow } from '@uiw/react-amap'

const Example = () => {
  const [show, setShow] = useState(false)
  const [winPosition, setWinPosition] = useState()
  const [content, setContent] = useState('<div>高德软件</div>')
  return (
    <>
      <input
        type="text"
        value={content}
        onChange={(evn) => setContent(evn.target.value)}
      />
      <div style={{ width: '100%', height: '300px' }}>
        <Map zoom={12} center={[115.466706, 25.273481]}>
          <Marker
            title="蔡坊水电站"
            position={new window.AMap.LngLat(115.466706, 25.273481)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
                setShow(true)
                setContent('<div>蔡坊水电站</div>')
              } else {
                setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
              }
            }}
          />
          <Marker
            title="黄地水电站"
            position={new window.AMap.LngLat(115.507778, 25.291389)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
                setShow(true)
                setContent('<div>黄地水电站</div>')
              } else {
                setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
              }
            }}
          />
          <Marker
            title="雲山水电站"
            position={new window.AMap.LngLat(115.519444, 25.242222)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.519444, 25.242222))
                setShow(true)
                setContent('<div>雲山水电站</div>')
              } else {
                setWinPosition(new window.AMap.LngLat(115.519444, 25.242222))
              }
            }}
          />
          <Marker
            title="黄沙水电站"
            position={new window.AMap.LngLat(115.503175, 25.242222)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.503175, 25.242222))
                setShow(true)
                setContent('<div>黄沙水电站</div>')
              } else {
                setWinPosition(new window.AMap.LngLat(115.503175, 25.242222))
              }
            }}
          />
          <Marker
            title="九角水电站"
            position={new window.AMap.LngLat(115.467558, 25.28595)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.467558, 25.28595))
                setShow(true)
                setContent('<div>九角水电站</div>')
              } else {
                setWinPosition(new window.AMap.LngLat(115.467558, 25.28595))
              }
            }}
          />
          {winPosition && (
            <InfoWindow
              visiable={show}
              position={winPosition}
              offset={{ x: 0, y: -10 }}
              content={content}
              onClose={(evn) => {
                console.log('evn2', evn, show)
              }}
            />
          )}
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
