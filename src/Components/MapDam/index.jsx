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
        <Map zoom={14} center={[115.466706, 25.273481]}>
          <Marker
            title="北京市"
            position={new window.AMap.LngLat(115.466706, 25.273481)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
                setShow(true)
              } else {
                setWinPosition(new window.AMap.LngLat(115.466706, 25.273481))
              }
            }}
          />
          <Marker
            title="北京市"
            position={new window.AMap.LngLat(115.507778, 25.291389)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
                setShow(true)
              } else {
                setWinPosition(new window.AMap.LngLat(115.507778, 25.291389))
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
