// Here is an example of a basic format for a column component:

import React from 'react'


const Columns = [
  {
    title: '省份',
    dataIndex: 'province',
    width: 100,
    // fixed: 'left',
  },
  {
    title: '藻密度(cells/L)',
    dataIndex: 'algae_density',
    width: 150,
  },
  {
    title: '氨氮(mg/L)',
    dataIndex: 'ammonia_nitrogen',
    width: 150,
  },
  {
    title: '流域',
    dataIndex: 'basin',
    width: 150,
    //fixed: 'left',
  },
  {
    title: '叶绿素α(mg/L)',
    dataIndex: 'chlorophyll_alpha',
    width: 150,
  },
  {
    title: '所在地市',
    dataIndex: 'city',
    width: 150,
  },
  {
    title: '电导率(μS/cm)',
    dataIndex: 'conductivity',
    width: 150,
  },
  {
    title: '溶解氧(mg/L)',
    dataIndex: 'dissolved_oxygen',
    width: 150,
  },
  {
    title: 'pH(无量纲)',
    dataIndex: 'pH',
    width: 150,
  },
  {
    title: '高锰酸盐指数(mg/L)',
    dataIndex: 'permanganate_index',
    width: 150,
  },
  {
    title: '所属河流',
    dataIndex: 'river',
    width: 150,
  },
  {
    title: '断面名称',
    dataIndex: 'section',
    width: 150,
  },
  {
    title: '站点情况',
    dataIndex: 'station_status',
    width: 150,
  },
  {
    title: '监测时间',
    dataIndex: 'time',
    width: 150,
  },
  {
    title: '总氮(mg/L)',
    dataIndex: 'total_nitrogen',
    width: 150,
  },
  {
    title: '总磷(mg/L)',
    dataIndex: 'total_phosphorus',
    width: 150,
  },
  {
    title: '浊度(NTU)',
    dataIndex: 'turbidity',
    width: 150,
  },
  {
    title: '水质类别',
    dataIndex: 'water_quality',
    width: 150,
  },
  {
    title: '水温(℃)',
    dataIndex: 'water_temperature',
    width: 150,
  },
]


export default Columns

// This component takes in data as a prop and renders a column chart using the Ant Design Charts library. 
// The xField and yField props specify which fields in the data should be used for the x and y axes, respectively. 
// This is just one example of a basic format for a column component, and there are many ways to customize and extend this component depending on your specific needs.
