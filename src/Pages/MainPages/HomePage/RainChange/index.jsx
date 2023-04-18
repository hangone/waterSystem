import React, { useEffect, useState, useRef } from 'react'
import { Button, Menu, Dropdown, Table, Radio, Spin, Descriptions,Divider } from 'antd'
import { MessageTool, MessageToolClear } from 'Components/Tools/MessageTool'
import {
  getRainChangeDay,
  getRainChangeWeek,
  getRainChangeMonth,
} from 'Services/Home'
import {
  changeDataLine2,
  reverseFormatDate,
  stripDayUselessData,
  stripMonthUselessData,
  getDatetimeList,
  reverseFormatDate2,
} from 'Utils'
import { resetTableTitleWidth } from 'Utils/layoutreset'

// 引入兄弟传值模块
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment'

import * as echarts from 'echarts'
import Common from 'Common'
import { formatDate } from 'Utils'
import 'Assets/css/comm.css'
import './index.css'

function RainChange() {
  const [isLoading, setIsLoading] = useState(false)
  const [isShowTitle, setIsShowTitle] = useState(true)
  const [columns, setColumns] = useState([])
  //tableData
  const [dataSource, setDataSource] = useState([])
  return (
    <div className="rainChange-div homeTable-div commTable-div">
      {/* <div
        className="fixTitle-div"
        style={{ display: isShowTitle ? 'flex' : 'none' }}>
        <Radio.Group onChange={onChange} value={radioItem}>
          <Radio value={'day'}>日雨量数据</Radio>
          <Radio value={'week'}>周雨量数据</Radio>
          <Radio value={'month'}>月雨量数据</Radio>
        </Radio.Group>

        <div className="table-mode-div">
          <div>表格模式：</div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => onSelectDropdown('紧缩型')}>
                  <div> 紧缩型 </div>
                </Menu.Item>
                <Menu.Item onClick={() => onSelectDropdown('扩展型')}>
                  <div> 扩展型 </div>
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft">
            <Button type="default">{activeMenuName}</Button>
          </Dropdown>
        </div>
      </div> */}
      <div className="table-div">
        <div className="modelo-wrapper">
          {' '}
          <div
            style={{
              width: '100%',
              paddingBottom: '56.25%',
              position: 'relative',
            }}>
            {' '}
            <div
              style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
              }}>
              {' '}
              <iframe
                src=" https://app.modaiyun.com/embedded/1646168705471160320?viewport=false&autoplay=false&autorotate=false&hideTools=false&showBIM=false&showBBoxSize=false&showKooRender=false&showSettings=false"
                style={{ width: '100%', height: '120%' }}
                frameBorder="0"
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allowFullScreen></iframe>{' '}
            </div>{' '}
          </div>{' '}
        </div>

        <div className="table-wrapper" style={{ color: 'white' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
              borderBottom: '1px solid white',
              borderTop: '1px solid white',
              padding: '10px',
              width: '200px',
              marginLeft: '10px',
            }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              实时数据监测
            </div>
            <div style={{ fontSize: '16px', textAlign: 'center', marginBottom:'20px', }}>
              时间：{moment().format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <Descriptions
              title=""
              column={1}
              size="small"
              labelStyle={{ color: 'white'}}
              contentStyle={{color:'white'}}>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',lineHeight:'24px'}} span={2}>
                37°
              </Descriptions.Item>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item><Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item>
              <Descriptions.Item label="温度" style={{ color: 'white' , borderBottom: '1px solid white',}} span={3}>
                37°
              </Descriptions.Item>
              {/* <Divider style={{backgroundColor:'white' ,height:'1px'}}/> */}
            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RainChange

// <div class='modelo-wrapper'> <div style="width: 100%; padding-bottom: 56.25%; position:
//     relative"> <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;"> <iframe src="
//     https://app.modaiyun.com/embedded/1647987489293078528?viewport=false&autoplay=false&autorotate=true&hideTools=false&showBIM=false&showBBoxSize=false&showKooRender=false&showSettings=false" style="width:100%;height:100%;" frameborder="0" mozallowfullscreen webkitallowfullscreen
//     allowfullscreen ></iframe> </div> </div> </div>
// https://app.modaiyun.com/embedded/1646168705471160320?viewport=false&autoplay=false&autorotate=false&hideTools=false&showBIM=false&showBBoxSize=false&showKooRender=false&showSettings=false