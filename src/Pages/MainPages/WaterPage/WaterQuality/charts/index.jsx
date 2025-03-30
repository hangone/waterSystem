import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'

function filterData(data) {
  const filteredData = data.map((item) => ({
    pH: item['pH'],
    turbidity: item['turbidity'],
    permanganateIndex: item['permanganate_index'],
    ammoniaNitrogen: item['ammonia_nitrogen'],
    totalPhosphorus: item['total_phosphorus'],
    totalNitrogen: item['total_nitrogen'],
  }))
  return filteredData
}
//目前实现一条河流水质对比，尝试加上多条河流水质对比
export default function RadarChart({ data }) {
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const filteredData = filterData(data)
    setFilteredData(filteredData)
  }, [data])
  useEffect(() => {
    var chartDom = document.getElementById('main')
    var myChart = echarts.getInstanceByDom(chartDom)
    if (!myChart) {
      myChart = echarts.init(chartDom)
    }

    // function changeData(showData) {
    //   option.series.data[0].value = showData
    //   myChart.setOption(option)
    // }
    var option = {
      title: {
        text: 'Basic Radar Chart',
      },
      legend: {
        data: ['河流数据', 'I类水', 'II类水', 'III类水', 'IV类水', 'V类水'],
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'pH', max: 9, min: 5 },
          { name: '浊度', max: 100, min: 1 },
          { name: '高锰酸盐指数', max: 15 },
          { name: '氨氮', max: 4.0 },
          { name: '总磷', max: 0.4 },
          { name: '总氮', max: 4.0 },
        ],
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value:
                filteredData.length > 0
                  ? [
                      filteredData[0].pH,
                      filteredData[0].turbidity,
                      filteredData[0].permanganateIndex,
                      filteredData[0].ammoniaNitrogen,
                      filteredData[0].totalPhosphorus,
                      filteredData[0].totalNitrogen,
                    ]
                  : [],

              name: '河流数据',
            },
            {
              value: [7, 1, 2, 0.15, 0.02, 0.2],
              name: 'I类水',
            },
            {
              value: [7, 5, 4, 0.5, 0.1, 0.5],
              name: 'II类水',
            },
            {
              value: [7, 15, 6, 1.0, 0.2, 1.0],
              name: 'III类水',
            },
            {
              value: [7, 25, 10, 1.5, 0.3, 1.5],
              name: 'IV类水',
            },
            {
              value: [7, 50, 15, 2.0, 0.4, 2.0],
              name: 'V类水',
            },
          ],
        },
      ],
    }
    myChart.setOption(option)
  }, [filteredData])

  return <div id="main" style={{ width: 600, height: 400 }}></div>
}
