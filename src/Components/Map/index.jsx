import React, { Component } from 'react';
import { Col, Input, Row } from 'antd';

import SearchAddress from './search';
import AdvancedMap from './map';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {
        lng:104.679127,
        lat:31.467673,
      },
      addressName:''
    }
  }

  changePosition = (value) => {
    this.setState({
      position:value
    })
  }

  changeAddressName = (value) => {
    this.setState({
      addressName:value
    })
  }
  
  render() {
    const {position,addressName} = this.state;
    return (
      <div style={{ width: '100%', height: '500px' }}>
        <Row gutter={24}>
          <Col span={8}>
            <SearchAddress
              changePosition={this.changePosition}
              changeAddressName={this.changeAddressName}
              addressName={addressName}
            />
          </Col>
        </Row>
        <br />
        <AdvancedMap
          position={position}
          changePosition={this.changePosition}
          changeAddressName={this.changeAddressName}
        />
      </div>
    );
  }
}

export default Index;