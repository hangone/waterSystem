import React, { useEffect } from 'react';
import {AMapLoader,AMap} from '@amap/amap-jsapi-loader';

const MapComponent = () => {
  useEffect(() => {
  AMapLoader.load({
    key: 'a279907eb60fb01990b6f623eba607d2',
    version: '2.0',
    plugins: ['AMap.PlaceSearch'],
  })
    .then((AMap) => {
      let map = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 5,
        center: [105.602725, 37.076636],
      });

      const placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: "", // 兴趣点城市
        citylimit: false,  //是否强制限制在设置的城市内搜索
        map: map, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      });
    })
    .catch((e) => {
      console.log(e);
    });
}, []);

  return <div id="container" className="map" style={{ height: '800px' }}></div>;
};

export default MapComponent;
