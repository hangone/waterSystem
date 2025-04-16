import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Button, Menu, Dropdown, Table, Radio, Spin } from 'antd'
//   import { FloatButton } from 'antd';
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { MessageTool, MessageToolClear } from 'Components/Tools/MessageTool'
import {
  getCapChangeDay,
  getInflowChangeDay,
  getOutflowChangeDay,
} from 'Services/Home'
import {
  changeDataLine,
  stripDayUselessData,
  getDatetimeList,
  reverseFormatDate2,
} from 'Utils'
import { resetTableTitleWidth } from 'Utils/layoutreset'

// 引入兄弟传值模块
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment'
import { realData } from '../../../../Services/waterQuality/realData'
//引入FloatButton

import * as echarts from 'echarts'
import Common from 'Common'
import { formatDate } from 'Utils'
import 'Assets/css/comm.css'
import './index.css'

// 仪表盘，折线图，雷达图的模拟数据
const mockData = {
  gauge: { 
    value: 28,         // 温度值
    name: '实时温度',  // 温度显示
    unit: '℃'         // 添加单位
  },
  line: {
    xData: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    series: [
      { 
        name: 'TDS',   // TDS水质指标
        data: [150, 220, 280, 190, 240, 260] // 典型TDS值范围(100-300)
      }
    ]
  },
  radar: {
    indicator: [
      { name: '稳定性', max: 100 },
      { name: '安全性', max: 100 },
      { name: '响应速度', max: 100 }
    ],
    data: [{ value: [85, 90, 80] }]
  }
};

function DayWaterForm() {
  // 端点编码
  let typeList = []
  // 计时器
  let ITimer = null
  // let [ITimerResponse,setITimerResponse] = useState(null);
  // 图的实例
  let myChartTop = null
  let myChartMiddle = null
  let myChartBottom = null
  // 设置响应式图的实例
  let [myChartTopRes, setMyChartTopRes] = useState(null)
  let [myChartMiddleRes, setMyChartMiddleRes] = useState(null)
  let [myChartBottomRes, setMyChartBottomRes] = useState(null)
  // 图表节点
  const echartTopNodeRef = useRef()
  const echartMiddleNodeRef = useRef()
  const echartBottomNodeRef = useRef()
  const tableRef = useRef(null)
  // 顶部更多显示栏
  const preIsShowTitle = sessionStorage.getItem('water_isShowTitle')
  const [isShowTitle, setIsShowTitle] = useState(
    preIsShowTitle == 'true' ? preIsShowTitle : false
  )
  // 单选按钮,日、 月、周
  const [radioItem, setRadioItem] = useState('day')
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(true)
  const [isShowEchart, setIsShowEchart] = useState(false)
  // 表格是否扩展
  const [activeMenuName1, setActiveMenuName1] = useState('手动更新')
  const [activeMenuName, setActiveMenuName] = useState(
    sessionStorage.getItem('water_isTableCollapse') == 'true'
      ? '扩展型'
      : '紧缩型'
  )
  const [isTableCollapse, setIsTableCollapse] = useState(
    sessionStorage.getItem('water_isTableCollapse') == 'true' ? true : false
  )

  // 用于初始化的标志位
  let isLeftOk = false
  let isCenterOk = false
  let isRightOk = false

  // 刻度数据(y轴的刻度,series的颜色)
  let myAxisObj = {
    yAxis: {
      day: { min: 0, max: 250 },
      week: { min: 0, max: 250 },
      month: { min: 0, max: 250 },
      avg: 5,
    },
    series: {
      day: [
        {
          itemStyle: {
            // 常量颜色 c1
            normal: { color: Common.colorChartArr.c1 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c1 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c2
            normal: { color: Common.colorChartArr.c2 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c2 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c3
            normal: { color: Common.colorChartArr.c3 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c3 },
          },
        },
      ],
      week: [
        {
          itemStyle: {
            // 常量颜色 c3
            normal: { color: Common.colorChartArr.c3 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c3 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c4
            normal: { color: Common.colorChartArr.c4 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c4 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c5
            normal: { color: Common.colorChartArr.c5 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c5 },
          },
        },
      ],
      month: [
        {
          itemStyle: {
            // 常量颜色 c4
            normal: { color: Common.colorChartArr.c4 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c4 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c5
            normal: { color: Common.colorChartArr.c5 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c5 },
          },
        },
        {
          itemStyle: {
            // 常量颜色 c6
            normal: { color: Common.colorChartArr.c6 },
          },
          lineStyle: {
            normal: { width: 1, color: Common.colorChartArr.c6 },
          },
        },
      ],
    },
  }
  // 时间列数据转换(时间)
  let columnsTimeList = [
    ' 08时',
    ' 09时',
    ' 10时',
    ' 11时',
    ' 12时',
    ' 13时',
    ' 14时',
    ' 15时',
    ' 16时',
    ' 17时',
    ' 18时',
    ' 19时',
    ' 20时',
    ' 21时',
    ' 22时',
    ' 23时',
    ' 00时',
    ' 01时',
    ' 02时',
    ' 03时',
    ' 04时',
    ' 05时',
    ' 06时',
    ' 07时',
  ]
  // 图表默认数据(series数据)
  let defaultObj = {
    // type: 'bar',
    type: 'line',
    // markPoint: {
    //     data: [
    //       { type: 'max', name: 'Max' },
    //       { type: 'min', name: 'Min' }
    //     ]
    // },
    smooth: true,
    emphasis: {
      focus: 'series',
    },

    itemStyle: {
      normal: { color: 'rgb(146, 53, 53)' },
    },
    lineStyle: {
      normal: { width: 1, color: 'rgb(146, 53, 53)' },
    },
    // 线条阴影
    // areaStyle: {
    //     normal: {
    //       color: {
    //         x: 0,
    //         y: 0,
    //         x2: 0,
    //         y2: 1,
    //         colorStops: [{
    //             offset: 0,
    //             color: "#dc3881" // 0% 处的颜色
    //           }, {
    //             offset: 0.7,
    //             color: "rgba(220,56,129,0)" // 100% 处的颜色
    //            }],
    //             globalCoord: false // 缺省为 false
    //           }
    //         }
    //   },
  }
  // 表格行、列数据（表头）
  const [columns, setColumns] = useState()
  // 表格行、列数据 （表体）
  const [dataSource, setDataSource] = useState([])
  // // 图表x轴、y轴数据（表头, 数据传递不及时 ）
  // const [echartNamesList,setEchartNamesList] = useState([])
  // // 图表x轴、y轴数据（数据传递不及时 ）
  // const [echartList,setEchartList] = useState({
  //     xArr:[],
  //     yArr:[]
  // })

  // 二、监听数据
  // 初始化加载
  useEffect(() => {
    try {
      //调用realData方法获取数据，并每隔5秒调用一次

      // const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
      // setIsShowTitle (preIsShowTitle == 'true' ? preIsShowTitle :false)

      // 清除提示
      MessageToolClear()

      // MessageTool("温馨提示：当前数据量大！请耐心等待",'warning',null,null,21500)

      // 获取平均水位站点数据
      typeList = Common.waterData

      // 首次查询表格数据, 月、 周、日
      onSearch('month', true)
      onSearch('week', true)
      onSearch('day', true)

      ITimer = setInterval(() => {
        // 查询表格数据
        hideCharts()
        onSearch(radioItem)
        // 更新提示
        // MessageTool('数据已经更新', 'success')
      }, Common.refreshDelay)
      sessionStorage.setItem('ITimerResponse', ITimer)
    } catch (err) {
      console.log('出现异常', err)
      MessageTool('系统出现异常！请刷新重试', 'error')
    }

    return () => {
      //  清除定时器
      let ITimerResponse = sessionStorage.getItem('ITimerResponse')
      if (ITimerResponse) clearInterval(ITimerResponse)
      if (ITimer) clearInterval(ITimer)
      // 取消消息订阅
      PubSub.unsubscribe('water_titleMenu')
    }
  }, [])
  // 监听页面的尺寸变化
  useEffect(() => {
    window.addEventListener('resize', function () {
      // 重新设置表头宽度
      resetTableTitleWidth()

      // 重新设置图的宽高
      if (myChartTop) myChartTop.resize()
      if (myChartMiddle) myChartMiddle.resize()
      if (myChartBottom) myChartBottom.resize()
    })
    return () => {
      window.removeEventListener('resize', () => {})
      if (myChartTop) myChartTop.dispose()
      if (myChartMiddle) myChartMiddle.dispose()
      if (myChartBottom) myChartBottom.dispose()
    }
  }, [window])
  // 监听PubSub.subscribe 的变化
  useEffect(() => {
    PubSub.subscribe('water_titleMenu', (msg, stateObj) => {
      if (stateObj && Object.keys(stateObj)) {
        const show = stateObj.isShowTitle
        setIsShowTitle(show)
        sessionStorage.setItem('water_isShowTitle', show)
      }
    })
    PubSub.subscribe('water_leftcollapsed', (msg, stateObj) => {
      let parentNode1 = document.querySelector('#bottom-echart-top')
      let childrenNode1 = document.querySelector('#bottom-echart-top>div')
      let canvasNode1 = document.querySelector('#bottom-echart-top>div canvas')
      parentNode1.style.cssText = 'width:33.3%!important;height:100%!important'
      childrenNode1.style.cssText =
        'width:100%!important;height:100%!important;display:flex!important;justify-content:center'
      canvasNode1.style.cssText =
        'width:100%!important;height:96%!important;z-index:999'
      if (myChartTopRes) myChartTopRes.resize()

      let parentNode2 = document.querySelector('#bottom-echart-bottom')
      let childrenNode2 = document.querySelector('#bottom-echart-bottom>div')
      let canvasNode2 = document.querySelector(
        '#bottom-echart-bottom>div canvas'
      )
      parentNode2.style.cssText = 'width:33.3%!important;height:100%!important'
      childrenNode2.style.cssText =
        'width:100%!important;height:100%!important;display:flex!important;justify-content:center'
      canvasNode2.style.cssText =
        'width:100%!important;height:96%!important;z-index:999'
      if (myChartBottomRes) myChartBottomRes.resize()

      let parentNode3 = document.querySelector('#bottom-echart-middle')
      let childrenNode3 = document.querySelector('#bottom-echart-middle>div')
      let canvasNode3 = document.querySelector(
        '#bottom-echart-middle>div canvas'
      )
      parentNode3.style.cssText = 'width:33.3%!important;height:100%!important'
      childrenNode3.style.cssText =
        'width:100%!important;height:100%!important;display:flex!important;justify-content:center'
      canvasNode3.style.cssText =
        'width:100%!important;height:96%!important;z-index:999'
      if (myChartMiddleRes) myChartMiddleRes.resize()

      setMyChartTopRes(myChartTopRes)
      setMyChartMiddleRes(myChartMiddleRes)
      setMyChartBottomRes(myChartBottomRes)
    })
    return () => {
      PubSub.unsubscribe('water_titleMenu')
      PubSub.unsubscribe('water_leftcollapsed')
    }
  }, [PubSub.subscrib])
  // 监听图的显示
  useEffect(() => {
    if (echartTopNodeRef.current) {
      echartTopNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    }
    if (echartMiddleNodeRef.current) {
      echartMiddleNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    }
    if (echartBottomNodeRef.current) {
      echartBottomNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    }

    // // 再次修正位置
    if (myChartTop) myChartTop.resize()
    if (myChartMiddle) myChartMiddle.resize()
    if (myChartBottom) myChartBottom.resize()
  }, [isShowEchart])
  // 监听时间的变化
  useEffect(() => {
    dragTableScroll()
  }, [moment().format('HH'), dataSource])
  //   useEffect(() => {
  //     setInterval(() => {

  //         realData().then((result) => {
  //           //console.log('result', result)
  //           setIsLoading(false)
  //           setDataSource(result)
  //           //t_res = result
  //           //console.log('t_res', t_res)
  //           MessageTool('数据已经更新', 'success')
  //         })
  //         //  setIsLoading(true)
  //       }, 10000)
  //     if (tableRef.current) {
  //       tableRef.current.scrollToTop();
  //     }
  //   }, [dataSource]);
  // 三、功能操作
  // 主动滚动当前滚动条, 传递目标时间
  const dragTableScroll = () => {
    // 目标滚动容器
    var goalNode = document.querySelector('.bottom-top')
    if (!goalNode) {
      console.log('错误！当前无法自动滚动！')
      return
    }
    // 当前的滚动减少的行数
    var declineRow = 3
    // 通过比较当前的时间，来拖动滚动条。
    var totalRow = dataSource.length
    // 计算滚动的比例
    let turnsRow = 0
    switch (radioItem) {
      case 'day':
        const currentDayTime = moment().format('HH')
        const goalCurrentDayTime = moment().format('YYYY-MM-DD HH时')
        let isNotArriveDay = true
        // map是可修改数据
        dataSource.map((item) => {
          if (isNotArriveDay) {
            turnsRow++
            if (
              item.tm == goalCurrentDayTime ||
              item.tm == '*' + goalCurrentDayTime
            ) {
              isNotArriveDay = false
            }
          }
        })
        break
      case 'week':
        const currentWeekTime = moment().format('ddd')
        const goalCurrentWeekTime = moment().format('ddd')
        let isNotArriveWeek = true
        // map是可修改数据
        dataSource.map((item) => {
          if (isNotArriveWeek) {
            turnsRow++
            if (
              item.tm == goalCurrentWeekTime ||
              item.tm == '*' + goalCurrentWeekTime
            ) {
              isNotArriveWeek = false
            }
          }
        })
        break
      case 'month':
        const currentMonthTime = moment().format('HH')
        const goalCurrentMonthTime = currentMonthTime + '日'
        let isNotArriveMonth = true
        // map是可修改数据
        dataSource.map((item) => {
          if (isNotArriveMonth) {
            turnsRow++
            if (
              item.tm == goalCurrentMonthTime ||
              item.tm == '*' + goalCurrentMonthTime
            ) {
              isNotArriveMonth = false
            }
          }
        })
        break
    }
    // 按照比例拖动滚动条
    turnsRow -= declineRow
    turnsRow = turnsRow > 0 ? turnsRow : 0
    goalNode.scrollTop = (goalNode.scrollHeight * turnsRow) / totalRow
  }
  // 搜索表格信息,(先获取远程数据，再绘制表格)
  const onSearch = (t_radioItem = null, isInit = false) => {
    switch (t_radioItem) {
      case 'day':
        getDayData(isInit)
        break
    }
  }
  // 切换表格显示信息
  const onChange = (e) => {
    setIsLoading(true)
    setRadioItem(e.target.value)
    // 重新设置一下数据
    typeList = Common.waterData
    onSearch(e.target.value)
    // 清空原定时器，启动新的定时器
    let ITimerResponse = sessionStorage.getItem('ITimerResponse')
    if (ITimerResponse) clearInterval(ITimerResponse)
    if (ITimer) clearInterval(ITimer)
    ITimer = setInterval(() => {
      onSearch(e.target.value)
      //   MessageTool('数据已经更新', 'success')
    }, Common.refreshDelay)
    sessionStorage.setItem('ITimerResponse', ITimer)
    // 关闭旋转器
    // setTimeout(()=>{
    //     setIsLoading(false)
    // },1000)
  }

  // 更新数据
  const autoUpdateData = () => {
    setActiveMenuName1('自动更新')
    setIsLoading(true)
    realData().then((result) => {
      //console.log('result', result)
      setIsLoading(false)
      setDataSource(result)
      //t_res = result
      //console.log('t_res', t_res)
      MessageTool('数据已经更新', 'success')
    })
    setInterval(() => {
      realData().then((result) => {
        //console.log('result', result)
        setIsLoading(false)
        setDataSource(result)
        //t_res = result
        //console.log('t_res', t_res)
        MessageTool('数据已经更新', 'success')
      })
      //  setIsLoading(true)
    }, 10000)
  }
  const updateData = () => {
    setActiveMenuName1('手动更新')
    setIsLoading(true)
    realData().then((result) => {
      //console.log('result', result)
      setIsLoading(false)
      setDataSource(result)
      //t_res = result
      //console.log('t_res', t_res)
      MessageTool('数据已经更新', 'success')
    })
    //  setIsLoading(true)
  }

  // 五、获取远程数据
  // 获取日数据
  const getDayData = async (isInit = false) => {
    try {
      // let paramsObj = {
      //     startTime:moment().subtract(1, 'day').format('YYYY-MM-DD HH:00:00'),
      //     endTime:moment().format('YYYY-MM-DD HH:00:00')
      // }
      // 闸室库容
      // paramsObj = {
      //     ...paramsObj,
      //     stcd:typeList[0].stcd,
      // }
      let dayData1 = await getCapChangeDay()
      // console.log("getCapChangeDay返回的数据day1是",day1)

      // 新泉站入库流量
      // paramsObj = {
      //     ...paramsObj,
      //     stcd:typeList[1].stcd,
      // }
      let dayData2 = await getInflowChangeDay()
      // console.log("getInflowChangeDay返回的数据day2是",day2)

      // 厂房站出库流量
      // paramsObj = {
      //     ...paramsObj,
      //     stcd:typeList[2].stcd,
      // }
      let dayData3 = await getOutflowChangeDay()
      // console.log("getOutflowChangeDay返回的数据day3是",day3)

      // console.log(typeList)
      let t_columns = [
        {
          title: '时间(s)',
          dataIndex: 'update_time',
          key: 'update_time',
          align: 'center',
          width: 150,
          // fixed: 'left',
        },
      ]
      t_columns.push({
        title: '温度(℃)',
        dataIndex: 'temperature',
        key: 'temperature',
        align: 'center',
        width: 150,
      })
      t_columns.push({
        title: 'TDS(mg/L)',
        dataIndex: 'tds',
        key: 'tds',
        align: 'center',
        width: 150,
      })
      // t_columns.push({
      //     title:'入库流量(立方米/秒)',
      //     dataIndex:typeList[1].stcd+'inflow',
      //     key:typeList[1].stcd+'inflow',
      //     align:'center',
      //     width:150,
      // })
      // t_columns.push({
      //     title:'出库流量(立方米/秒)',
      //     dataIndex:typeList[2].stcd+'outflow',
      //     key:typeList[2].stcd+'outflow',
      //     align:'center',
      //     width:150,
      // })
      setColumns(t_columns)

      // // 判断结果是否为空
      // if(!day1.data || !day2.data || !day3.data){
      //     MessageTool("数据为空",'warning')
      //     return;
      // }

      // // 获取列表数据
      // let res = Object.keys(day1.data);
      // let dayData1 = day1.data
      // let dayData2 = day2.data
      // let dayData3 = day3.data

      // // // // （1.获取图表数据
      var t_res = []

      let t_echartsX1 = []
      let t_echartsY1 = []
      let t_echartsX2 = []
      let t_echartsY2 = []
      let t_echartsX3 = []
      let t_echartsY3 = []

      const t_subData0 = []
      const t_subData1 = []
      const t_subData2 = []
      const prefixDate = formatDate(new Date(), 'yyyy-MM-dd')
      let nowTime = parseInt(moment().format('HH'))
      nowTime = nowTime - 8
      if (nowTime < 0) nowTime += 25

      let t_max1 = 0 // 没有负值
      let t_min1 = 1000000 // 没有极大值
      let t_max2 = 0 // 没有负值
      let t_min2 = 1000000 // 没有极大值
      let t_max3 = 0 // 没有负值
      let t_min3 = 1000000 // 没有极大值

      // 切割超出的时数据
      // res = stripDayUselessData(res)

      // 获取当前的时间列表
      let datetimeList = getDatetimeList()

      // // 再次处理时间列表长度：对比获取的时间长度
      datetimeList = datetimeList.slice(0, dayData1.length)

      datetimeList.forEach((item, index) => {
        // 表格数据
        t_res.push({
          order: (index == nowTime ? '*' : '') + (index + 1),
          tm: reverseFormatDate2(item),
          [typeList[0].stcd + 'w']: changeDataLine(dayData1[index].w),
          [typeList[1].stcd + 'inflow']: changeDataLine(dayData2[index].inq),
          [typeList[2].stcd + 'outflow']: changeDataLine(dayData3[index].otq),
        })
        // 图表数据
        t_echartsX1.push(
          (index == nowTime ? '*' : '') + reverseFormatDate2(item).slice(11)
        )
        t_echartsX2.push(
          (index == nowTime ? '*' : '') + reverseFormatDate2(item).slice(11)
        )
        t_echartsX3.push(
          (index == nowTime ? '*' : '') + reverseFormatDate2(item).slice(11)
        )

        t_subData0.push(changeDataLine(dayData1[index].w))
        t_subData1.push(changeDataLine(dayData2[index].inq))
        t_subData2.push(changeDataLine(dayData3[index].otq))

        // 计算最大值和最小值
        if (dayData1[index].w || dayData1[index].w == 0) {
          if (dayData1[index].w > t_max1) {
            t_max1 = dayData1[index].w
          }
          if (dayData1[index].w < t_min1) {
            t_min1 = dayData1[index].w
          }
        }
        if (dayData2[index].inq || dayData2[index].inq == 0) {
          if (dayData2[index].inq > t_max2) {
            t_max2 = dayData2[index].inq
          }
          if (dayData2[index].inq < t_min2) {
            t_min2 = dayData2[index].inq
          }
        }
        if (dayData3[index].otq || dayData3[index].otq == 0) {
          if (dayData3[index].otq > t_max3) {
            t_max3 = dayData3[index].otq
          }
          if (dayData3[index].otq < t_min3) {
            t_min3 = dayData3[index].otq
          }
        }
      })
      //   setDataSource(t_res)

      // 填补图的空数据（表格不填充） 日数据
      let hasLen = t_subData0.length
      let moreNullDataLen = 23 - hasLen

      if (moreNullDataLen > 0) {
        while (moreNullDataLen--) {
          hasLen++
          t_echartsX1.push(columnsTimeList[hasLen])
          t_echartsX2.push(columnsTimeList[hasLen])
          t_echartsX3.push(columnsTimeList[hasLen])
          t_subData0.push(null)
          t_subData1.push(null)
          t_subData2.push(null)
        }
      }

      // 1.绘制库容日数据
      // // (2.计算日数据的最大值 与最小值，确认刻度的区间。
      // if(t_min1 < 0) t_min1 = 0 // 可能存放负值
      if (t_max1 < t_min1) {
        t_max1 = 250
        t_min1 = 0
      }
      let realAvg1 = 0
      if ((t_max1 - t_min1) / 10 > myAxisObj.yAxis.avg || t_max2 == t_min2) {
        realAvg1 = myAxisObj.yAxis.avg
      } else {
        realAvg1 = (t_max1 - t_min1) / 10
      }
      if (realAvg1 < 0) realAvg1 = myAxisObj.yAxis.avg // 可能存放负值

      t_max1 = Math.ceil(t_max1 + realAvg1)
      t_min1 = Math.floor(t_min1 - realAvg1)

      // if(t_min1 < 0) t_min1 = 0  // 可能存放负值
      myAxisObj = {
        ...myAxisObj,
        yAxis: {
          ...myAxisObj.yAxis,
          day: { min: t_min1, max: t_max1 },
        },
      }
      // // // （3.绘制表格.
      // // // 日数据表格
      t_echartsY1 = [
        {
          ...defaultObj,
          name: '库容',
          data: t_subData0,
          ...myAxisObj.series.day[0],
        },
      ]
      drawContentRightTop({
        xArr: t_echartsX1,
        yArr: t_echartsY1,
      })

      // 2.绘制入库流量数据
      // // (2.计算日数据的最大值 与最小值，确认刻度的区间。
      // if(t_min2 < 0) t_min2 = 0  // 可能存放负值
      if (t_max2 < t_min2) {
        t_max2 = 250
        t_min2 = 0
      }
      let realAvg2 = 0
      if ((t_max2 - t_min2) / 10 > myAxisObj.yAxis.avg || t_max2 == t_min2) {
        realAvg2 = myAxisObj.yAxis.avg
      } else {
        realAvg2 = (t_max2 - t_min2) / 10
      }
      if (realAvg2 < 0) realAvg2 = myAxisObj.yAxis.avg // 可能存放负值

      t_max2 = Math.ceil(t_max2 + realAvg2)
      t_min2 = Math.floor(t_min2 - realAvg2)

      // if(t_min2 < 0) t_min2 = 0   // 可能存放负值
      myAxisObj = {
        ...myAxisObj,
        yAxis: {
          ...myAxisObj.yAxis,
          week: { min: t_min2, max: t_max2 },
        },
      }
      // // // （3.绘制表格.
      // // // 日数据表格
      t_echartsY2 = [
        {
          ...defaultObj,
          name: '入库流量',
          data: t_subData1,
          ...myAxisObj.series.day[1],
        },
      ]
      drawContentRightMiddle({
        xArr: t_echartsX2,
        yArr: t_echartsY2,
      })

      // 3.绘制库容日数据
      // // (2.计算日数据的最大值 与最小值，确认刻度的区间。
      // if(t_min3 < 0) t_min3 = 0  // 可能存放负值
      if (t_max3 < t_min3) {
        t_max3 = 250
        t_min3 = 0
      }
      let realAvg3 = 0
      if ((t_max3 - t_min3) / 10 > myAxisObj.yAxis.avg || t_max2 == t_min2) {
        realAvg3 = myAxisObj.yAxis.avg
      } else {
        realAvg3 = (t_max3 - t_min3) / 10
      }

      if (realAvg3 < 0) realAvg3 = myAxisObj.yAxis.avg // 可能存放负值

      t_max3 = Math.ceil(t_max3 + realAvg3)
      t_min3 = Math.floor(t_min3 - realAvg3)

      // if(t_min3 < 0) t_min3 = 0 // 可能存放负值
      myAxisObj = {
        ...myAxisObj,
        yAxis: {
          ...myAxisObj.yAxis,
          month: { min: t_min3, max: t_max3 },
        },
      }
      // // // （3.绘制表格.
      // // // 日数据表格
      t_echartsY3 = [
        {
          ...defaultObj,
          name: '出库流量',
          data: t_subData2,
          ...myAxisObj.series.day[2],
        },
      ]
      drawContentRightBottom({
        xArr: t_echartsX3,
        yArr: t_echartsY3,
      })

      // 暂停旋转器
      setIsLoading(false)
      showCharts()

      // 重新设置表头宽度
      setTimeout(() => {
        resetTableTitleWidth()
      }, 1000)
    } catch (err) {
      // 暂停旋转器
      setIsLoading(false)
      console.log('获取数据异常！', err)
      // MessageTool('获取数据异常！请刷新重试', 'error')
    }
  }

  // 显示的图表，项部
  const drawContentRightTop = (t_echartList) => {
    // 1.基于准备好的dom，初始化echarts实例
    // 清除已经生成的页面节点
    let parentNodes = document.querySelector('#bottom-echart-top')
    parentNodes.innerHTML = ''
    // 清除原来的实例（但这里没有实际效果）
    if (myChartTop) myChartTop = null
    // 删除原来的实例属性（或者设置为空也行）
    if (parentNodes.hasAttributes('_echarts_instance_'))
      parentNodes.removeAttribute('_echarts_instance_')

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '库容变化曲线',
        color: 'white',
        x: 'center',
        y: 'bottom',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      legend: {
        top: 5,
        left: 5,
        data: ['库容'],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 10,
        feature: {
          magicType: {
            //动态类型切换
            show: true, //是否显示该工具
            type: ['line', 'bar'], //启用的动态类型
            title: {
              line: '折线图', // 名称
              bar: '柱状图',
            },
          },
          saveAsImage: { show: true, title: '下载' },
        },
      },
      xAxis: [
        {
          type: 'category',
          position: 'bottom',
          name: '时间',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 7, //刻度线的长度
            interval: 2, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false, // 保持轴线在底部， 非0位置
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
        {
          type: 'category',
          position: 'bottom',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 3, //刻度线的长度
            interval: 0, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false, // 保持轴线在底部， 非0位置
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
      ],
      yAxis: {
        type: 'value',
        name: '库容(万立方米)',
        min: 238,
        max: 230,

        nameTextStyle: {
          // name标签文字样式
          padding: [0, 0, 0, 10],
        },
        // 替换y轴刻度的最大值和最小值
        ...myAxisObj.yAxis.day,
        axisLabel: {
          // 纵轴刻度标签
          formatter: '{value}', //  轴线标签
          align: 'right', // 轴线相对标签的位置
        },
        boundaryGap: false, // 不留白，从原点开始
      },
      series: t_echartList.yArr,
    }
    // 3.使用刚指定的配置项和数据显示图表。
    myChartTop.setOption(option)
    setMyChartTopRes(myChartTop)

    // 4.修正位置
    if (echartTopNodeRef.current)
      echartTopNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    // 再次修正位置
    if (myChartTop) myChartTop.resize()
    if (myChartMiddle) myChartMiddle.resize()
    if (myChartBottom) myChartBottom.resize()
    // 显示图表数据， 而vue可以采用v-show
    setTimeout(() => {
      setIsShowEchart(true)
    }, 1000)
  }
  // 显示的图表，中部
  const drawContentRightMiddle = (t_echartList) => {
    // 1.基于准备好的dom，初始化echarts实例
    // 清除已经生成的页面节点
    let parentNodes = document.querySelector('#bottom-echart-middle')
    parentNodes.innerHTML = ''
    // 清除原来的实例（但这里没有实际效果）
    if (myChartMiddle) myChartMiddle = null
    // 删除原来的实例属性（或者设置为空也行）
    if (parentNodes.hasAttributes('_echarts_instance_'))
      parentNodes.removeAttribute('_echarts_instance_')
    // 注销后，重新创建实例

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '入库流量变化曲线',
        x: 'center',
        y: 'bottom',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      legend: {
        top: 5,
        left: 5,
        data: ['入库流量'],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 10,
        feature: {
          magicType: {
            //动态类型切换
            show: true, //是否显示该工具
            type: ['line', 'bar'], //启用的动态类型
            title: {
              line: '折线图', // 名称
              bar: '柱状图',
            },
          },
          saveAsImage: { show: true, title: '下载' },
        },
      },
      xAxis: [
        {
          type: 'category',
          position: 'bottom',
          name: '时间',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 7, //刻度线的长度
            interval: 2, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false, // 保持轴线在底部， 非0位置
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
        {
          type: 'category',
          position: 'bottom',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 3, //刻度线的长度
            interval: 0, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false, // 保持轴线在底部， 非0位置
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
      ],
      yAxis: {
        type: 'value',
        name: '入库流量(立方米/秒)',
        nameTextStyle: {
          // name标签文字样式
          padding: [0, 0, 0, 40],
        },
        min: 238,
        max: 230,
        // 替换y轴刻度的最大值和最小值
        ...myAxisObj.yAxis.week,
        axisLabel: {
          // 纵轴刻度标签
          formatter: '{value}', //  轴线标签
          align: 'right', // 轴线相对标签的位置
        },
        boundaryGap: false, // 不留白，从原点开始
      },
      series: t_echartList.yArr,
    }
    // 3.使用刚指定的配置项和数据显示图表。
    myChartMiddle.setOption(option)
    setMyChartMiddleRes(myChartMiddle)

    // 4.修正位置
    if (echartMiddleNodeRef.current)
      echartMiddleNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    // 再次修正位置
    if (myChartTop) myChartTop.resize()
    if (myChartMiddle) myChartMiddle.resize()
    if (myChartBottom) myChartBottom.resize()
  }
  // 显示的图表，底部
  const drawContentRightBottom = (t_echartList) => {
    // 1.基于准备好的dom，初始化echarts实例
    // 清除已经生成的页面节点
    let parentNodes = document.querySelector('#bottom-echart-bottom')
    parentNodes.innerHTML = ''
    // 清除原来的实例（但这里没有实际效果）
    if (myChartBottom) myChartBottom = null
    // 删除原来的实例属性（或者设置为空也行）
    if (parentNodes.hasAttributes('_echarts_instance_'))
      parentNodes.removeAttribute('_echarts_instance_')

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '出库流量变化曲线',
        x: 'center',
        y: 'bottom',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      legend: {
        top: 5,
        left: 5,
        data: ['出库流量'],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 10,
        feature: {
          magicType: {
            //动态类型切换
            show: true, //是否显示该工具
            type: ['line', 'bar'], //启用的动态类型
            title: {
              line: '折线图', // 名称
              bar: '柱状图',
            },
          },
          saveAsImage: { show: true, title: '下载' },
        },
      },
      xAxis: [
        {
          type: 'category',
          position: 'bottom', // 保持轴线在底部
          name: '时间',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 7, //刻度线的长度
            interval: 2, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false, // 保持轴线在底部， 非0位置
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
        {
          type: 'category',
          position: 'bottom',
          min: 0, // 起始值
          max: 23, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 3, //刻度线的长度
            interval: 0, //该{}中的data全部显示
            lineStyle: {
              color: '#ccc',
              fontSize: '20px',
            },
          },
          axisLine: {
            // 轴线颜色
            onZero: false,
            symbol: ['none', 'arrow'], //轴线箭头
            symbolSize: [8, 10],
          },
          boundaryGap: false, // 不留白，从原点开始
        },
      ],
      yAxis: {
        type: 'value',
        name: '出库流量(立方米/秒)',
        nameTextStyle: {
          // name标签文字样式
          padding: [0, 0, 0, 40],
        },
        min: 238,
        max: 230,
        // 替换y轴刻度的最大值和最小值
        ...myAxisObj.yAxis.month,
        axisLabel: {
          // 纵轴刻度标签
          formatter: '{value}', //  轴线标签
          align: 'right', // 轴线相对标签的位置
        },
        boundaryGap: false, // 不留白，从原点开始
      },
      series: t_echartList.yArr,
    }
    // 3.使用刚指定的配置项和数据显示图表。
    myChartBottom.setOption(option)
    setMyChartBottomRes(myChartBottom)

    // 4.修正位置
    if (echartBottomNodeRef.current)
      echartBottomNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    // 再次修正位置
    if (myChartTop) myChartTop.resize()
    if (myChartMiddle) myChartMiddle.resize()
    if (myChartBottom) myChartBottom.resize()
  }

  // 设置表格扩展类型
  const onSelectDropdown = (name) => {
    // 设置下拉菜单项
    if (name === '紧缩型') {
      setIsTableCollapse(false)
      setActiveMenuName('紧缩型')
      sessionStorage.setItem('water_isTableCollapse', false)

      // 修正位置
      setIsShowEchart(false)
      if (echartTopNodeRef.current) {
        echartTopNodeRef.current.style.cssText =
          'width:33.3%!important;height:100%!important'
      }
      if (echartMiddleNodeRef.current) {
        echartMiddleNodeRef.current.style.cssText =
          'width:33.3%!important;height:100%!important'
      }
      if (echartBottomNodeRef.current) {
        echartBottomNodeRef.current.style.cssText =
          'width:33.3%!important;height:100%!important'
      }

      // // 再次修正位置
      if (myChartTop) myChartTop.resize()
      if (myChartMiddle) myChartMiddle.resize()
      if (myChartBottom) myChartBottom.resize()
      setTimeout(() => {
        setIsShowEchart(true)
      }, 1000)
    } else {
      setIsTableCollapse(true)
      setActiveMenuName('扩展型')
      sessionStorage.setItem('water_isTableCollapse', true)
    }
  }

  // 展示图表数据
  const hideCharts = () => {
    setIsLoading(true)
  }
  const showCharts = () => {
    document.querySelector('.bottom-bottom').style.opacity = 1
    setIsLoading(false)
  }

  const gaugeRef = useRef(null);
  const lineRef = useRef(null);
  const radarRef = useRef(null);

  // 添加图表初始化逻辑到现有useEffect
  useEffect(() => {
    const initCharts = () => {

      // 仪表盘
      const gaugeChart = echarts.init(gaugeRef.current);
      gaugeChart.setOption({
        series: [{
          type: 'gauge',
          center: ['50%', '60%'],
          progress: { 
            show: true,
            width: 15,
            itemStyle: {
              color: '#e74c3c' // 进度条红色系
            }
          },
          axisLine: { 
            lineStyle: { 
              width: 15,
              color: [
                [0.3, '#2ecc71'], // 绿色安全区
                [0.7, '#f1c40f'], // 黄色警告区
                [1, '#e74c3c']    // 红色危险区
              ]
            } 
          },
          axisTick: { show: false },
          splitLine: { 
            length: 15, 
            lineStyle: { 
              width: 2,
              color: '#95a5a6' // 刻度线颜色
            } 
          },
          detail: {
            valueAnimation: true,
            fontSize: 28,  
            offsetCenter: [0, '65%'],  
            formatter: '{value}℃',
            color: '#e74c3c'
          },
          axisLabel: { 
            distance: 30, 
            fontSize: 14,  
            formatter: (v) => v + '℃'
          },
          radius: '85%', 
          data: [mockData.gauge]
        }]
      });

      // 折线图
      const lineChart = echarts.init(lineRef.current);
      lineChart.setOption({
        xAxis: { 
          type: 'category', 
          data: mockData.line.xData 
        },
        yAxis: {
          type: 'value',
          name: 'TDS (mg/L)',  // 添加水质单位
          nameTextStyle: {
            color: '#2980b9',  // 蓝色系
            fontSize: 12,
            padding: [0, 0, 0, 20] // 调整位置
          },
          axisLabel: {
            color: '#2980b9' // 刻度值颜色
          }
        },
        series: mockData.line.series.map(s => ({
          ...s,
          type: 'line',
          smooth: true,
          areaStyle: { 
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3498db' }, // 渐变起始色
              { offset: 1, color: '#ecf0f1' }  // 渐变结束色
            ])
          },
          lineStyle: {
            width: 2,
            color: '#2980b9' // 线条颜色
          }
        }))
      });

      // 雷达图
      const radarChart = echarts.init(radarRef.current);
      radarChart.setOption({
        radar: { indicator: mockData.radar.indicator },
        series: [{
          type: 'radar',
          data: mockData.radar.data,
          areaStyle: { opacity: 0.3 }
        }]
      });
    };

    initCharts();
    const resizeHandler = () => initCharts();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  useEffect(() => {
    updateData()
  }, [])

  return (
    <div className="dayWaterChart-div commTable-div">
      <div className="body-bottom-div" style={{ background: 'white' ,alignItems:'flex-start',flexDirection:'column'}}>
        <Spin
          tip="加载数据中"
          spinning={isLoading}
          style={{ display: isLoading ? 'flex' : 'none' }}></Spin>
        <div
          className="bottom-top"
          style={{
            height: '50%',
            position: 'relative',
        
          }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={isLoading}
            sticky
            bordered
            ref={tableRef}
            scroll={{ x: 800, y: 300 }}
          />
        </div>
        <Button
          icon={<SyncOutlined />}
          onClick={updateData}
          className="dataUpdateBtn"
          style={{
            display:
              activeMenuName1 === '手动更新'
                ? 'none !important'
                : 'block !important',
          }}
        />

        
        <div
          className="bottom-bottom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '30px', 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'rgba(245,245,245,0.3)',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxWidth: '1400px', // 限制最大宽度
            margin: '30px auto 0', // 居中显示
            width: '95%', // 宽度
          }}>

          {/* 每个图表容器 */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px', 
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            height: '400px' 
          }}>
            <div className="chartTitle" style={{ 
              fontSize: '18px',
              marginBottom: '20px'
            }}>实时温度</div>
            <div ref={gaugeRef} style={{ 
              width: '100%',
              height: '320px'
            }}></div>
          </div>

          <div style={{ 
            flex: 1, 
            minWidth: '300px', 
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '10px',
            padding: '15px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            height: '400px' 
          }}>
            <div className="chartTitle" style={{ 
              fontSize: '18px',
              marginBottom: '20px' 
            }}>TDS数据</div>
            <div ref={lineRef} style={{ 
               width: '100%',
               height: '320px' 
            }}></div>
          </div>

          <div style={{ 
            flex: 1, 
            minWidth: '300px', 
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '10px',
            padding: '15px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            height: '400px' 
          }}>
            <div className="chartTitle" style={{ 
              fontSize: '18px',
              marginBottom: '20px' 
            }}>系统指标</div>
            <div ref={radarRef} style={{ 
              width: '100%',
              height: '320px' 
            }}></div>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default DayWaterForm
