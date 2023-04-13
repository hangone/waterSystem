import React, { useEffect, useState, useRef } from 'react'
import { Button, Menu, Dropdown, Table, Radio, Spin } from 'antd'
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
import './index.less'

function RainChange() {
  // 端点编码
  let typeList = []
  // 端点编码
  let typeList1 = []
  let typeList2 = []
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
  // 顶部更多显示栏
  const preIsShowTitle = sessionStorage.getItem('water_isShowTitle')
  const [isShowTitle, setIsShowTitle] = useState(
    preIsShowTitle == 'true' ? preIsShowTitle : false
  )
  // 单选按钮,日、 月、周
  const [radioItem, setRadioItem] = useState('day')
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false)
  const [isShowEchart, setIsShowEchart] = useState(false)
  // 表格是否扩展
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
      week: [
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
    /*  markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
        },*/
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

    // // 线条阴影
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
      // 清除提示
      MessageToolClear()

      setIsLoading(true)
      // 获取平均雨量站点数据
      typeList = Common.rainData
      // 获取平均水位站点数据
      typeList1 = Common.waterData
      typeList2 = Common.rainData

      // 首次查询表格数据, 月、 周、日
      onSearch('month', true)
      onSearch('week', true)
      onSearch('day', true)

      ITimer = setInterval(() => {
        // 查询表格数据
        hideCharts()
        onSearch(radioItem)
        // 更新提示
        MessageTool('数据已经更新', 'success')
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
      PubSub.unsubscribe('rain_titleMenu')
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
              item.tm == '*' + goalCurrentDayTime ||
              item.tm == '合计雨量'
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
              item.tm == '*' + goalCurrentWeekTime ||
              item.tm == '合计雨量'
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
              item.tm == '*' + goalCurrentMonthTime ||
              item.tm == '合计雨量'
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
      case 'week':
        getWeekData(isInit)
        break
      case 'month':
        getMonthData(isInit)
        break
    }
  }
  // 切换表格显示信息
  const onChange = (e) => {
    setIsLoading(true)
    setRadioItem(e.target.value)
    // 重新设置一下数据
    typeList = Common.rainData
    onSearch(e.target.value)
    // 清空原定时器，启动新的定时器
    let ITimerResponse = sessionStorage.getItem('ITimerResponse')
    if (ITimerResponse) clearInterval(ITimerResponse)
    if (ITimer) clearInterval(ITimer)
    ITimer = setInterval(() => {
      hideCharts()
      onSearch(e.target.value)
      MessageTool('数据已经更新', 'success')
    }, Common.refreshDelay)
    sessionStorage.setItem('ITimerResponse', ITimer)
    // 关闭旋转器
    // setTimeout(()=>{
    //     setIsLoading(false)
    // },1000)
  }

  // 五、获取远程数据
  // 获取日数据
  const getDayData = (isInit = false) => {
    getRainChangeDay()
      .then((res) => {
        // console.log("getRainChangeDay返回的数据day是",res)
        let t_columns = [
          {
            title: '时间(时)',
            dataIndex: 'tm',
            key: 'tm',
            align: 'center',
            width: 200,
            // fixed: 'left',
          },
        ]
        typeList.forEach((item) => {
          t_columns.push({
            title: item.stnm + '(毫米)',
            dataIndex: item.stcd + 'drp',
            key: item.stcd + 'drp',
            align: 'center',
            width: 120,
          })
        })
        setColumns(t_columns)

        // // （1.获取图表数据
        var t_res = []
        let t_echartsX = []
        let t_echartsY = []
        const t_subData0 = []
        const t_subData1 = []
        const t_subData2 = []
        const t_subData3 = []
        const t_subData4 = []
        const prefixDate = formatDate(new Date(), 'yyyy-MM-dd')
        let nowTime = parseInt(moment().format('HH'))
        nowTime = nowTime - 8
        if (nowTime < 0) nowTime += 25
        let t_max = 0 // 没有负值
        let t_min = 1000000 // 没有极大值

        // 切割超出的时数据
        res = stripDayUselessData(res)

        // 获取当前的时间列表
        let datetimeList = getDatetimeList()

        res.forEach((subItem, index) => {
          // 表格数据
          t_res.push({
            order: (index == nowTime ? '*' : '') + (index + 1),
            // sttp:subItem[0].sttp == 'PP' ? '雨量站' :'-',
            sttp: '雨量站',
            [subItem[0].stcd]: subItem[0].stcd,
            [subItem[0].stcd + 'drp']: changeDataLine2(subItem[0].drp),
            [subItem[1].stcd]: subItem[1].stcd,
            [subItem[1].stcd + 'drp']: changeDataLine2(subItem[1].drp),
            [subItem[2].stcd]: subItem[2].stcd,
            [subItem[2].stcd + 'drp']: changeDataLine2(subItem[2].drp),
            [subItem[3].stcd]: subItem[3].stcd,
            [subItem[3].stcd + 'drp']: changeDataLine2(subItem[3].drp),
            [subItem[4].stcd]: subItem[4].stcd,
            [subItem[4].stcd + 'drp']: changeDataLine2(subItem[4].drp),
            // 将以下内容替换成时间
            // z: subItem[0].z != null ? subItem[0].z :'-',
            // tm: subItem[0].tm != null ? prefixDate + columnsTimeList[index] :'-',

            // tm:  prefixDate + columnsTimeList[index]  ,
            tm: reverseFormatDate2(datetimeList[index]),
          })
          // 图表数据
          t_echartsX.push(
            (index == nowTime ? '*' : '') + columnsTimeList[index]
          )
          t_subData0.push(changeDataLine2(subItem[0].drp))
          t_subData1.push(changeDataLine2(subItem[1].drp))
          t_subData2.push(changeDataLine2(subItem[2].drp))
          t_subData3.push(changeDataLine2(subItem[3].drp))
          t_subData4.push(changeDataLine2(subItem[4].drp))
          // 计算最大值和最小值
          if (subItem[0].drp || subItem[0].drp == 0) {
            if (subItem[0].drp > t_max) {
              t_max = subItem[0].drp
            }
            if (subItem[0].drp < t_min) {
              t_min = subItem[0].drp
            }
          }

          if (subItem[1].drp || subItem[1].drp == 0) {
            if (subItem[1].drp > t_max) {
              t_max = subItem[1].drp
            }
            if (subItem[1].drp < t_min) {
              t_min = subItem[1].drp
            }
          }

          if (subItem[2].drp || subItem[2].drp == 0) {
            if (subItem[2].drp > t_max) {
              t_max = subItem[2].drp
            }
            if (subItem[2].drp < t_min) {
              t_min = subItem[2].drp
            }
          }

          if (subItem[3].drp || subItem[3].drp == 0) {
            if (subItem[3].drp > t_max) {
              t_max = subItem[3].drp
            }
            if (subItem[3].drp < t_min) {
              t_min = subItem[3].drp
            }
          }

          if (subItem[4].drp || subItem[4].drp == 0) {
            if (subItem[4].drp > t_max) {
              t_max = subItem[4].drp
            }
            if (subItem[4].drp < t_min) {
              t_min = subItem[4].drp
            }
          }
        })

        // 切割数据
        let tt_res = []
        // const currentDayTime = moment().format("HH")
        // // const goalCurrentDayTime = moment().format("YYYY-MM-DD HH时")
        // const goalCurrentDayTime = moment().format("HH:mm")

        const goalCurrentDayTime = moment().format('YYYY-MM-DD HH时')
        let isNotArriveDay = true
        // map是可修改数据
        t_res.map((item, index) => {
          if (isNotArriveDay) {
            // if(item.tm == goalCurrentDayTime|| item.tm == '*' + goalCurrentDayTime){
            //     isNotArriveDay = false;   2019-02-00 01:01:01
            // }
            if (
              item.tm == goalCurrentDayTime ||
              item.tm == '*' + goalCurrentDayTime ||
              item.tm == '合计雨量'
            ) {
              isNotArriveDay = false
            }
            tt_res.push(item)
          }
        })

        // 替换数据
        t_res = tt_res

        // 雨量数据汇总
        let totalDrp0 = 0
        let totalDrp1 = 0
        let totalDrp2 = 0
        let totalDrp3 = 0
        let totalDrp4 = 0
        t_res.forEach((item) => {
          if (
            item[typeList2[0].stcd + 'drp'] &&
            item[typeList2[0].stcd + 'drp'] != '-'
          )
            totalDrp0 += changeDataLine2(item[typeList2[0].stcd + 'drp'])
          if (
            item[typeList2[1].stcd + 'drp'] &&
            item[typeList2[1].stcd + 'drp'] != '-'
          )
            totalDrp1 += changeDataLine2(item[typeList2[1].stcd + 'drp'])
          if (
            item[typeList2[2].stcd + 'drp'] &&
            item[typeList2[2].stcd + 'drp'] != '-'
          )
            totalDrp2 += changeDataLine2(item[typeList2[2].stcd + 'drp'])
          if (
            item[typeList2[3].stcd + 'drp'] &&
            item[typeList2[3].stcd + 'drp'] != '-'
          )
            totalDrp3 += changeDataLine2(item[typeList2[3].stcd + 'drp'])
          if (
            item[typeList2[4].stcd + 'drp'] &&
            item[typeList2[4].stcd + 'drp'] != '-'
          )
            totalDrp4 += changeDataLine2(item[typeList2[4].stcd + 'drp'])
        })
        // 新添加一条数据
        let appendObj = {
          order: t_res.length + 1,
          tm: '合计雨量',
          [typeList1[0].stcd + 'rz']: '-',
          [typeList1[1].stcd + 'rz']: '-',
          [typeList1[2].stcd + 'rz']: '-',

          [typeList2[0].stcd + 'drp']: totalDrp0,
          [typeList2[1].stcd + 'drp']: totalDrp1,
          [typeList2[2].stcd + 'drp']: totalDrp2,
          [typeList2[3].stcd + 'drp']: totalDrp3,
          [typeList2[4].stcd + 'drp']: totalDrp4,

          [typeList1[0].stcd + 'w']: '-',
          [typeList1[1].stcd + 'inflow']: '-',
          [typeList1[2].stcd + 'outflow']: '-',
        }
        t_res.push(appendObj)

        // 设置表体数据
        setDataSource(t_res)

        // 填补图的空数据（表格不填充） 日数据
        let hasLen = t_subData0.length
        let moreNullDataLen = 23 - hasLen
        if (moreNullDataLen > 0) {
          while (moreNullDataLen--) {
            hasLen++
            t_echartsX.push(columnsTimeList[hasLen])
            t_subData0.push(null)
            t_subData1.push(null)
            t_subData2.push(null)
            t_subData3.push(null)
            t_subData4.push(null)
          }
        }

        // (2.计算日数据的最大值 与最小值，确认刻度的区间。
        // if(t_min < 0) t_min = 0 // 可能存放负值
        if (t_max < t_min) {
          t_max = 250
          t_min = 0
        }
        let realAvg = 0
        if ((t_max - t_min) / 10 > myAxisObj.yAxis.avg || t_max == t_min) {
          realAvg = myAxisObj.yAxis.avg
        } else {
          realAvg = (t_max - t_min) / 10
        }
        if (realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值

        t_max = Math.ceil(t_max + realAvg)
        t_min = Math.floor(t_min - realAvg)

        if (t_min < 0) t_min = 0 // 雨量不可能存放负值

        myAxisObj = {
          ...myAxisObj,
          yAxis: {
            ...myAxisObj.yAxis,
            day: { min: t_min, max: t_max },
          },
        }

        // // （3.绘制表格.
        // // 日数据表格
        t_echartsY = [
          {
            ...defaultObj,
            name: typeList[0].stnm,
            data: t_subData0,
            ...myAxisObj.series.day[0],
          },
          {
            ...defaultObj,
            name: typeList[1].stnm,
            data: t_subData1,
            ...myAxisObj.series.day[1],
          },
          {
            ...defaultObj,
            name: typeList[2].stnm,
            data: t_subData2,
            ...myAxisObj.series.day[2],
          },
          {
            ...defaultObj,
            name: typeList[3].stnm,
            data: t_subData3,
            ...myAxisObj.series.day[3],
          },
          {
            ...defaultObj,
            name: typeList[4].stnm,
            data: t_subData4,
            ...myAxisObj.series.day[4],
          },
        ]
        drawContentRightTop({
          xArr: t_echartsX,
          yArr: t_echartsY,
        })

        // 暂停旋转器
        // setIsLoading(false)
        isLeftOk = true
        showCharts()

        // 重新设置表头宽度
        setTimeout(() => {
          resetTableTitleWidth()
        }, 1000)
      })
      .catch((err) => {
        // 暂停旋转器
        setIsLoading(false)

        console.log('请求超时！请重试', err)
        MessageTool('请求超时！请重试', 'error')
      })
  }
  // 获取周数据
  const getWeekData = (isInit = false) => {
    getRainChangeWeek()
      .then((res) => {
        // console.log("getRainChangeWeek返回的week数据是",res,isInit,typeof(isInit))
        // （0.重新获取表头数据
        let t_columns = [
          {
            title: '日期(日)',
            dataIndex: 'tm',
            key: 'tm',
            align: 'center',
            width: 200,
            // fixed: 'left',
          },
        ]
        typeList.forEach((item) => {
          t_columns.push({
            title: item.stnm + '(毫米)',
            dataIndex: item.stcd + 'drp',
            key: item.stcd + 'drp',
            align: 'center',
            width: 120,
          })
        })

        // // // （1.获取图表数据
        var t_res = []
        let t_echartsX = []
        let t_echartsY = []
        const t_subData0 = []
        const t_subData1 = []
        const t_subData2 = []
        const t_subData3 = []
        const t_subData4 = []
        // const prefixDate = formatDate(new Date(),'yyyy-MM-dd')
        const prefixDate = ''
        // 方案一：获取当前月的数据
        const start = parseInt(moment().format('e'))
        const todayDay = parseInt(moment().format('D'))
        // 方案二：获取上一个月的数据
        let dateLen = res.length

        let t_max = 0 // 没有负值
        let t_min = 1000000 // 没有极大值
        let turns = 0
        const turnsList = ['一', '二', '三', '四', '五', '六', '日']

        //  月份初期,填补周数据
        let declineDay = start - todayDay + 1
        if (todayDay < 7 && declineDay > 0) {
          //  4   1    // 5   2    //   6   3    // 0   4  // 1  5    // 2   6   // 3   7
          while (declineDay--) {
            turns += 1
            // 表格数据
            t_res.push({
              tm: '周' + turnsList[turns - 1],
              // tm:reverseFormatDate(newTime),
              [typeList[0].stcd]: typeList[0].stcd,
              [typeList[0].stcd + 'drp']: '-',
              [typeList[1].stcd]: typeList[1].stcd,
              [typeList[1].stcd + 'drp']: '-',
              [typeList[2].stcd]: typeList[2].stcd,
              [typeList[2].stcd + 'drp']: '-',
              [typeList[3].stcd]: typeList[3].stcd,
              [typeList[3].stcd + 'drp']: '-',
              [typeList[4].stcd]: typeList[4].stcd,
              [typeList[4].stcd + 'drp']: '-',
            })
            // 图表数据
            t_echartsX.push('周' + turnsList[turns - 1])

            t_subData0.push(null)
            t_subData1.push(null)
            t_subData2.push(null)
            t_subData3.push(null)
            t_subData4.push(null)
          }
        }

        // 切割超出的数据（每月的日数据）
        res = stripMonthUselessData(res)

        res.some((subItem, index) => {
          // （1.方案一
          //  1            2         3         4      5          6      7    8
          //  //  4   1    // 5   2    //   6   3    // 0   4  // 1  5    // 2   6   // 3   7
          // 1 - 4 <= 1
          // 1 - 4 <= 2
          // 1 - 4 <= 3
          if (todayDay - start <= index + 1 && turns < 7) {
            turns += 1

            // （2.方案二
            // 获取前31日的日期
            // let newTime =  moment().subtract(dateLen,'day').format("YYYY-MM-DD");
            // dateLen -= 1
            // if(dateLen < 7){

            // 表格数据
            t_res.push({
              tm: (turns - 1 == start ? '*' : '') + '周' + turnsList[turns - 1],
              // tm:reverseFormatDate(newTime),
              // sttp:subItem[0].sttp == 'PP' ? '雨量站' :'-',
              // sttp:'雨量站',
              [subItem[0].stcd]: subItem[0].stcd,
              [subItem[0].stcd + 'drp']: changeDataLine2(subItem[0].drp),
              [subItem[1].stcd]: subItem[1].stcd,
              [subItem[1].stcd + 'drp']: changeDataLine2(subItem[1].drp),
              [subItem[2].stcd]: subItem[2].stcd,
              [subItem[2].stcd + 'drp']: changeDataLine2(subItem[2].drp),
              [subItem[3].stcd]: subItem[3].stcd,
              [subItem[3].stcd + 'drp']: changeDataLine2(subItem[3].drp),
              [subItem[4].stcd]: subItem[4].stcd,
              [subItem[4].stcd + 'drp']: changeDataLine2(subItem[4].drp),
            })
            // 图表数据
            t_echartsX.push(
              (turns - 1 == start ? '*' : '') + '周' + turnsList[turns - 1]
            )
            // t_echartsX.push(newTime)

            t_subData0.push(subItem[0].drp)
            t_subData1.push(subItem[1].drp)
            t_subData2.push(subItem[2].drp)
            t_subData3.push(subItem[3].drp)
            t_subData4.push(subItem[4].drp)
            // 计算最大值和最小值

            if (subItem[0].drp || subItem[0].drp == 0) {
              if (subItem[0].drp > t_max) {
                t_max = subItem[0].drp
              }
              if (subItem[0].drp < t_min) {
                t_min = subItem[0].drp
              }
            }

            if (subItem[1].drp || subItem[1].drp == 0) {
              if (subItem[1].drp > t_max) {
                t_max = subItem[1].drp
              }
              if (subItem[1].drp < t_min) {
                t_min = subItem[1].drp
              }
            }

            if (subItem[2].drp || subItem[2].drp == 0) {
              if (subItem[2].drp > t_max) {
                t_max = subItem[2].drp
              }
              if (subItem[2].drp < t_min) {
                t_min = subItem[2].drp
              }
            }

            if (subItem[3].drp || subItem[3].drp == 0) {
              if (subItem[3].drp > t_max) {
                t_max = subItem[3].drp
              }
              if (subItem[3].drp < t_min) {
                t_min = subItem[3].drp
              }
            }

            if (subItem[4].drp || subItem[4].drp == 0) {
              if (subItem[4].drp > t_max) {
                t_max = subItem[4].drp
              }
              if (subItem[4].drp < t_min) {
                t_min = subItem[4].drp
              }
            }
          }
        })

        // 填补图的空数据（表格不填充） 周数据
        let hasLen = t_subData0.length
        let moreNullDataLen = 7 - hasLen
        while (moreNullDataLen--) {
          hasLen++
          t_echartsX.push('周' + turnsList[hasLen - 1])
          t_subData0.push(null)
          t_subData1.push(null)
          t_subData2.push(null)
          t_subData3.push(null)
          t_subData4.push(null)
        }

        // 首次加载时不抢占位置
        if (!isInit) {
          setColumns(t_columns)
          setDataSource(t_res)
        }

        // // (2.计算日数据的最大值 与最小值，确认刻度的区间。

        // if(t_min < 0) t_min = 0 // 可能存放负值
        if (t_max < t_min) {
          t_max = 250
          t_min = 0
        }
        let realAvg = 0
        if ((t_max - t_min) / 10 > myAxisObj.yAxis.avg || t_max == t_min) {
          realAvg = myAxisObj.yAxis.avg
        } else {
          realAvg = (t_max - t_min) / 10
        }

        if (realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值

        t_max = Math.ceil(t_max + realAvg)
        t_min = Math.floor(t_min - realAvg)

        if (t_min < 0) t_min = 0 // 雨量不可能存放负值

        myAxisObj = {
          ...myAxisObj,
          yAxis: {
            ...myAxisObj.yAxis,
            week: { min: t_min, max: t_max },
          },
        }

        // // （3.绘制表格.
        // // 日数据表格
        t_echartsY = [
          {
            ...defaultObj,
            name: typeList[0].stnm,
            data: t_subData0,
            ...myAxisObj.series.week[0],
          },
          {
            ...defaultObj,
            name: typeList[1].stnm,
            data: t_subData1,
            ...myAxisObj.series.week[1],
          },
          {
            ...defaultObj,
            name: typeList[2].stnm,
            data: t_subData2,
            ...myAxisObj.series.week[2],
          },
          {
            ...defaultObj,
            name: typeList[3].stnm,
            data: t_subData3,
            ...myAxisObj.series.week[3],
          },
          {
            ...defaultObj,
            name: typeList[4].stnm,
            data: t_subData4,
            ...myAxisObj.series.week[4],
          },
        ]
        drawContentRightMiddle({
          xArr: t_echartsX,
          yArr: t_echartsY,
        })

        // 暂停旋转器
        // setIsLoading(false)
        isCenterOk = true
        if (isInit == false) {
          showCharts()
        }

        // 重新设置表头宽度
        setTimeout(() => {
          resetTableTitleWidth()
        }, 1000)
      })
      .catch((err) => {
        // 暂停旋转器
        setIsLoading(false)
        console.log('请求超时！请重试', err)
        MessageTool('请求超时！请重试', 'error')
      })
  }
  // 获取月数据
  const getMonthData = (isInit = false) => {
    getRainChangeMonth()
      .then((res) => {
        // console.log("getRainChangeMonth返回的数据month是",res)
        // （0.重新获取表头数据
        let t_columns = [
          {
            title: formatDate(new Date(), 'MM') + '月份(日)',
            dataIndex: 'tm',
            key: 'tm',
            align: 'center',
            width: 200,
            // fixed: 'left',
          },
        ]
        typeList.forEach((item) => {
          t_columns.push({
            title: item.stnm + '(毫米)',
            dataIndex: item.stcd + 'drp',
            key: item.stcd + 'drp',
            align: 'center',
            width: 120,
          })
        })

        // // （1.获取图表数据
        var t_res = []
        let t_echartsX = []
        let t_echartsY = []
        const t_subData0 = []
        const t_subData1 = []
        const t_subData2 = []
        const t_subData3 = []
        const t_subData4 = []
        // 方案一：获取当前月的数据
        const prefixDate = formatDate(new Date(), 'yyyy-MM-')
        // const prefixDate = ''

        // 方案二：获取上一个月的数据
        const nowTime = parseInt(moment().format('DD'))
        let dateLen = res.length

        let t_max = 0 // 没有负值
        let t_min = 1000000 // 没有极大值

        // 切割超出的数据（每月的日数据）
        res = stripMonthUselessData(res)

        res.forEach((subItem, index) => {
          // (1.方案一
          let t = index + 1
          let t_tm = prefixDate + (t < 10 ? '0' + t : t)

          // （2.方案二
          // 表格数据
          // 获取前31日的日期
          // let newTime =  moment().subtract(dateLen,'day').format("YYYY-MM-DD");
          // dateLen -= 1

          t_res.push({
            tm: (index + 1 == nowTime ? '*' : '') + reverseFormatDate(t_tm),
            // tm:reverseFormatDate(newTime),
            // sttp:subItem[0].sttp == 'PP' ? '雨量站' :'-',
            // sttp:'雨量站',
            [subItem[0].stcd]: subItem[0].stcd,
            [subItem[0].stcd + 'drp']: changeDataLine2(subItem[0].drp),
            [subItem[1].stcd]: subItem[1].stcd,
            [subItem[1].stcd + 'drp']: changeDataLine2(subItem[1].drp),
            [subItem[2].stcd]: subItem[2].stcd,
            [subItem[2].stcd + 'drp']: changeDataLine2(subItem[2].drp),
            [subItem[3].stcd]: subItem[3].stcd,
            [subItem[3].stcd + 'drp']: changeDataLine2(subItem[3].drp),
            [subItem[4].stcd]: subItem[4].stcd,
            [subItem[4].stcd + 'drp']: changeDataLine2(subItem[4].drp),
          })
          // 图表数据
          t_echartsX.push((index + 1 == nowTime ? '*' : '') + t_tm)
          // t_echartsX.push(newTime)

          t_subData0.push(subItem[0].drp)
          t_subData1.push(subItem[1].drp)
          t_subData2.push(subItem[2].drp)
          t_subData3.push(subItem[3].drp)
          t_subData4.push(subItem[4].drp)
          // 计算最大值和最小值

          if (subItem[0].drp || subItem[0].drp == 0) {
            if (subItem[0].drp > t_max) {
              t_max = subItem[0].drp
            }
            if (subItem[0].drp < t_min) {
              t_min = subItem[0].drp
            }
          }

          if (subItem[1].drp || subItem[1].drp == 0) {
            if (subItem[1].drp > t_max) {
              t_max = subItem[1].drp
            }
            if (subItem[1].drp < t_min) {
              t_min = subItem[1].drp
            }
          }

          if (subItem[2].drp || subItem[2].drp == 0) {
            if (subItem[2].drp > t_max) {
              t_max = subItem[2].drp
            }
            if (subItem[2].drp < t_min) {
              t_min = subItem[2].drp
            }
          }

          if (subItem[3].drp || subItem[3].drp == 0) {
            if (subItem[3].drp > t_max) {
              t_max = subItem[3].drp
            }
            if (subItem[3].drp < t_min) {
              t_min = subItem[3].drp
            }
          }

          if (subItem[4].drp || subItem[4].drp == 0) {
            if (subItem[4].drp > t_max) {
              t_max = subItem[4].drp
            }
            if (subItem[4].drp < t_min) {
              t_min = subItem[4].drp
            }
          }
        })

        // 填补图的空数据（表格不填充） 周数据
        let hasLen = t_subData0.length
        let monthLen = parseInt(
          moment(moment().format('"YYYY-MM"'), 'YYYY-MM').daysInMonth()
        )
        let moreNullDataLen = monthLen - hasLen

        while (moreNullDataLen--) {
          hasLen++

          let t = hasLen
          let t_tm = prefixDate + (t < 10 ? '0' + t : t)
          t_echartsX.push(t_tm)
          t_subData0.push(null)
          t_subData1.push(null)
          t_subData2.push(null)
          t_subData3.push(null)
          t_subData4.push(null)
        }

        // 首次加载时不抢占位置
        if (!isInit) {
          setColumns(t_columns)
          setDataSource(t_res)
        }

        // (2.计算日数据的最大值 与最小值，确认刻度的区间。
        // if(t_min < 0) t_min = 0 // 可能存放负值
        if (t_max < t_min) {
          t_max = 250
          t_min = 0
        }
        let realAvg = 0
        if ((t_max - t_min) / 10 > myAxisObj.yAxis.avg || t_max == t_min) {
          realAvg = myAxisObj.yAxis.avg
        } else {
          realAvg = (t_max - t_min) / 10
        }

        if (realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值

        t_max = Math.ceil(t_max + realAvg)
        t_min = Math.floor(t_min - realAvg)

        if (t_min < 0) t_min = 0 // 雨量不可能存放负值

        myAxisObj = {
          ...myAxisObj,
          yAxis: {
            ...myAxisObj.yAxis,
            month: { min: t_min, max: t_max },
          },
        }

        // // （3.绘制表格.
        // // 日数据表格
        t_echartsY = [
          {
            ...defaultObj,
            name: typeList[0].stnm,
            data: t_subData0,
            ...myAxisObj.series.month[0],
          },
          {
            ...defaultObj,
            name: typeList[1].stnm,
            data: t_subData1,
            ...myAxisObj.series.month[1],
          },
          {
            ...defaultObj,
            name: typeList[2].stnm,
            data: t_subData2,
            ...myAxisObj.series.month[2],
          },
          {
            ...defaultObj,
            name: typeList[3].stnm,
            data: t_subData3,
            ...myAxisObj.series.month[3],
          },
          {
            ...defaultObj,
            name: typeList[4].stnm,
            data: t_subData4,
            ...myAxisObj.series.month[4],
          },
        ]
        drawContentRightBottom({
          xArr: t_echartsX,
          yArr: t_echartsY,
        })

        // 暂停旋转器
        // setIsLoading(false)
        isRightOk = true
        if (isInit == false) {
          showCharts()
        }

        // 重新设置表头宽度
        setTimeout(() => {
          resetTableTitleWidth()
        }, 1000)
      })
      .catch((err) => {
        // 暂停旋转器
        setIsLoading(false)
        console.log('请求超时！请重试', err)
        MessageTool('请求超时！请重试', 'error')
      })
  }

  // 六、图表显示
  // 显示的图表，顶部
  const drawContentRightTop = async (t_echartList) => {
    // 1.基于准备好的dom，初始化echarts实例
    // 清除已经生成的页面节点
    let parentNodes = document.querySelector('#bottom-echart-top')
    parentNodes.innerHTML = ''
    // 清除原来的实例（但这里没有实际效果）
    if (myChartTop) myChartTop = null
    // 删除原来的实例属性（或者设置为空也行）
    if (parentNodes.hasAttributes('_echarts_instance_'))
      parentNodes.removeAttribute('_echarts_instance_')
    // 注销后，重新创建实例
    myChartTop = echarts.init(
      document.getElementById('bottom-echart-top'),
      'dark'
    )

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '日雨量变化曲线',
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
        data: [
          typeList[0].stnm,
          typeList[1].stnm,
          typeList[2].stnm,
          typeList[3].stnm,
          typeList[4].stnm,
        ],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 20,
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
            interval: 3, //该{}中的data全部显示
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
        name: '雨量(毫米)',
        min: 238,
        max: 230,
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
    }, 1200)
  }
  // 显示的图表，中部
  const drawContentRightMiddle = async (t_echartList) => {
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
    myChartMiddle = echarts.init(
      document.getElementById('bottom-echart-middle'),
      'dark'
    )

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '周雨量变化曲线',
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
        data: [
          typeList[0].stnm,
          typeList[1].stnm,
          typeList[2].stnm,
          typeList[3].stnm,
          typeList[4].stnm,
        ],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 20,
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
          name: '星期',
          min: 0, // 起始值
          max: 6, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 7, //刻度线的长度
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
        {
          type: 'category',
          position: 'bottom',
          min: 0, // 起始值
          max: 6, // 结束值
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
        name: '雨量(毫米)',
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
    // 注销后，重新创建实例
    myChartBottom = echarts.init(
      document.getElementById('bottom-echart-bottom'),
      'dark'
    )

    // 2.指定图表的配置项和数据
    var option = {
      title: {
        text: '月雨量变化曲线',
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
        data: [
          typeList[0].stnm,
          typeList[1].stnm,
          typeList[2].stnm,
          typeList[3].stnm,
          typeList[4].stnm,
        ],
      },
      grid: {
        top: 70,
        bottom: 50,
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 10,
        top: 20,
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
          max: 30, // 结束值
          nameTextStyle: {
            // name标签文字样式
            padding: [0, 0, 0, -10],
          },
          data: t_echartList.xArr,
          axisTick: {
            // 轴线刻度
            length: 7, //刻度线的长度
            interval: 8, //该{}中的data全部显示
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
          max: 30, // 结束值
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
        name: '雨量(毫米)',
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
    // 使用刚指定的配置项和数据显示图表。
    myChartBottom.setOption(option)
    setMyChartBottomRes(myChartBottom)

    // 4.修正位置
    if (echartBottomNodeRef.current) {
      echartBottomNodeRef.current.style.cssText =
        'width:33.3%!important;height:100%!important'
    }
    // 再次修正位置
    if (myChartTop) myChartTop.resize()
    if (myChartMiddle) myChartMiddle.resize()
    if (myChartBottom) myChartBottom.resize()
  }

  // 设置表格扩展类型
  const onSelectDropdown = (name) => {
    // 设置下拉菜单项
    if (name == '紧缩型') {
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
    if (isLeftOk && isCenterOk && isRightOk) {
      document.querySelector('.bottom-bottom').style.opacity = 1
      setIsLoading(false)
    } else {
      // 延时加载
      setTimeout(() => {
        document.querySelector('.bottom-bottom').style.opacity = 1
        setIsLoading(false)
      }, 1000)
    }
  }
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
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              allowFullScreen></iframe>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    </div>
  )
}

export default RainChange
