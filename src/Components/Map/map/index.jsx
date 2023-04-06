import React, { Component, Fragment } from 'react';
import {Map, Marker} from 'react-amap';
import PropTypes from 'prop-types';
import { message } from 'antd';
//import { MAP_KEY } from '@/utils/Enum';

const MAP_KEY = 'a279907eb60fb01990b6f623eba607d2'

class AdvancedMap extends Component {
  static propTypes = {
    position:PropTypes.object,
    plugins: PropTypes.array,
  };

  static defaultProps = {
    position :{
      lng:104.679127,
      lat:31.467673,
    },
    plugins: ["ToolBar", 'Scale']
  };

  constructor(props) {
    super(props);
    this.handleMapEvents =  {
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
        const { changePosition,changeAddressName } = this.props;
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
  }


  render() {
    const {position: { lng,lat }, plugins} = this.props;
    return (
      <Fragment>
        <Map
          amapkey={MAP_KEY}
          plugins={plugins}
          events={this.handleMapEvents}
          zoom={17}
          center={[lng, lat]}
          doubleClickZoom={false}
        >
          <Marker position={[lng, lat]} />
        </Map>
      </Fragment>
    );
  }
}

export default AdvancedMap;