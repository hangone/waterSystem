// Here is an example of a basic format for a column component:

import React from 'react'


const Columns = [
  {
    title: '省份',
    dataIndex: 'province',
    width: 100,
    fixed: 'left',
  },
  {
    title: '流域',
    dataIndex: 'basin',
    width: 100,
    //fixed: 'left',
  },
  {
    title: '所在地市',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: '所属河流',
    dataIndex: 'river',
    width: 100,
  },
  {
    title: '断面名称',
    dataIndex: 'section',
    width: 100,
  },
  {
    title: '站点情况',
    dataIndex: 'station_status',
    width: 100,
  },
  {
    title: '监测时间',
    dataIndex: 'time',
    width: 100,
  },
  {
    title: '水质类别',
    dataIndex: 'water_quality',
    width: 100,
  },
]


export default Columns

// This component takes in data as a prop and renders a column chart using the Ant Design Charts library. 
// The xField and yField props specify which fields in the data should be used for the x and y axes, respectively. 
// This is just one example of a basic format for a column component, and there are many ways to customize and extend this component depending on your specific needs.

