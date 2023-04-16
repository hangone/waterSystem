import ReactDOM from 'react-dom';
import React, { useState, useRef } from 'react';
import { Map, Marker, APILoader, InfoWindow } from '@uiw/react-amap';

const MapDam = () => {
  const [show, setShow] = useState(false);
  const [winPosition, setWinPosition] = useState();
  const [content, setContent] = useState('<div>高德软件</div>');
  return (
    <>
      <input type="text" value={content} onChange={(evn) => setContent(evn.target.value)}/>
      <div style={{ width: '100%', height: '300px' }}>
        <Map zoom={14} center={[116.397637, 39.900001]}>
          <Marker
            title="北京市"
            position={new window.AMap.LngLat(116.405285,39.904989)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(116.405285,39.904989));
                setShow(true);
              } else {
                setWinPosition(new window.AMap.LngLat(116.405285,39.904989));
              }
            }}
          />
          <Marker
            title="北京市"
            position={new window.AMap.LngLat(116.415285,39.905589)}
            onClick={(evn) => {
              if (!show) {
                setWinPosition(new window.AMap.LngLat(116.415285,39.905589));
                setShow(true);
              } else {
                setWinPosition(new window.AMap.LngLat(116.415285,39.905589));
              }
            }}
          />
          {winPosition && (
            <InfoWindow
              visiable={show}
              position={winPosition}
              offset={{ x: 0, y: -10}}
              content={content}
              onClose={(evn) => {
                // console.log('evn2', evn, show);
              }}
            />
          )}
        </Map>
      </div>
    </>
  );
}

const Mount = () => (
  <APILoader akey="a7a90e05a37d3f6bf76d4a9032fc9129">
    <MapDam />
  </APILoader>
);

export default MapDam;