import React, { Fragment, useState, useEffect } from 'react';
import {Map, Marker} from 'react-amap';
import PropTypes from 'prop-types';
import { message } from 'antd';

const MAP_KEY = 'a279907eb60fb01990b6f623eba607d2'

const AdvancedMap = ({ position: { lng, lat }, plugins, changePosition, changeAddressName }) => {
  const [mapEvents, setMapEvents] = useState(null);

  useEffect(() => {
    const handleMapEvents = {
      created: () => {
        window.AMap.plugin('AMap.PlaceSearch', () => {
          new window.AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
          });
        })
        window.AMap.plugin('AMap.Geocoder', () =>{
          new window.AMap.Geocoder({
            city: '0816'
          })
        })
      },
      click: (e) => {
        const { lnglat:lnglatObj,lnglat: {lng,lat} } = e;
        const lnglatArr = [lng,lat]
        const geocoder = new window.AMap.Geocoder({
          city: '0816'
        })
        changePosition(lnglatObj)
        geocoder.getAddress(lnglatArr, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            console.log(result,'result');
            const { regeocode :{formattedAddress}} = result;
            changeAddressName(formattedAddress)
            message.success(formattedAddress)
          }
        })
      }
    }
    setMapEvents(handleMapEvents);
  }, [changeAddressName, changePosition]);

  return (
    <Fragment>
      <Map
        amapkey={MAP_KEY}
        plugins={plugins}
        events={mapEvents}
        zoom={15}
        center={[lng,lat]}
        doubleClickZoom={false}
      >
        <Marker position={[lng,lat]} />
      </Map>
    </Fragment>
  );
}

AdvancedMap.propTypes = {
  position:PropTypes.object,
  plugins: PropTypes.array,
};

AdvancedMap.defaultProps = {
  position :{
    lng:115.796127,
    lat:28.647924,
  },
  plugins: ["ToolBar", 'Scale']
};

export default AdvancedMap;

