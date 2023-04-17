import React, { useEffect, useState, useRef } from 'react'
import { DatePicker, Button, Empty, Table } from 'antd'
import moment from 'moment'
import {
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { getHourFlowForm } from 'Services/Home/search'
import { MessageTool } from 'Components/Tools/MessageTool'
import { OutputExcel } from 'Components/Tools/OutputExcel'
import { OutputPrint } from 'Components/Tools/OutputPrint'
import { reverseFormatDate, changeMomentType } from 'Utils'

import Common from 'Common'
import Tools from 'Components/Tools/TablesData'
import './index.css'

function DayWaterForm() {
  // 端点编码
  let typeList = []
  let afterObj = { stcd: '' }
  // 默认后缀
  const afterFix = ' 00:00:00'
  // 初始化日期
  const [searchTxtObj, setSearchTxtObj] = useState({})
  // 默认日期
  // const [defaultValue,setDefaultValue] = useState(moment())
  const [defaultStartValue, setDefaultStartValue] = useState(
    changeMomentType(moment, 'YYYY-MM-DD HH').subtract(2, 'day')
  )
  const [defaultEndValue, setDefaultEndValue] = useState(moment())

  // 加载中
  const [isLoading, setIsLoading] = useState(false)
  // 表格表头，和行列数据。
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  // 行列表格
  const [colArr, setColArr] = useState([])
  const [rowArr, setRowArr] = useState([])
  // 列数据（不含顶部栏的表头）
  let rowTitleArr = [
    { month: '最高水位' },
    { month: '发生时间' },
    { month: '最低水位' },
    { month: '发生时间' },
    { month: '平均水位' },
  ]

  // 初始化加载
  useEffect(() => {
    try {
      // 获取平均雨量
      let stcdString = ''
      let t_columns = [
        {
          title: '日期',
          dataIndex: 'month',
          key: 'month',
          width: 250,
        },
      ]
      let t_echartNamesList = []
      let t_colArr = ['日期']
      let t_rowArr = ['日期']

      // （1.遍历列表头数据
      Common.waterData.forEach((item, index) => {
        if (index == 0) {
          stcdString += item.stcd
        } else {
          stcdString = stcdString + ',' + item.stcd
        }
        t_columns.push({
          title: item.stnm + '(米)',
          dataIndex: 'water' + item.stcd,
          key: 'water' + item.stcd,
          width: 160,
        })
        t_colArr.push(item.stnm + '(米)')

        // 间隔设置
        if (index == 0) {
          t_columns.push({
            title: '库容(万立方米)',
            dataIndex: 'kurong' + item.stcd,
            key: 'kurong' + item.stcd,
            width: 180,
          })
          t_colArr.push('库容(万立方米)')
        } else if (index == 1) {
          t_columns.push({
            title: '入库流量(立方米/秒)',
            dataIndex: 'inflow' + item.stcd,
            key: 'inflow' + item.stcd,
            width: 180,
          })
          t_colArr.push('入库流量(立方米/秒)')
        } else if (index == 2) {
          t_columns.push({
            title: '出库流量(立方米/秒)',
            dataIndex: 'outflow' + item.stcd,
            key: 'outflow' + item.stcd,
            width: 180,
          })
          t_colArr.push('出库流量(立方米/秒)')
        }
      })

      // （2.遍历行表头数据
      rowTitleArr.forEach((item) => {
        t_rowArr.push(item.month)
      })

      // 默认搜索的站点
      afterObj = {
        stcd: stcdString,
      }
      typeList = Common.waterData

      setColArr(t_colArr)
      setRowArr(t_rowArr)
      setColumns(t_columns)

      // 设置默认日期 ，开启搜索(日期已经有默认值)
      // YYYY-MM-DD HH:mm:ss
      // onSelectDate(null,moment().format('YYYY-MM-DD HH:mm:ss'))
      let startTime =
        changeMomentType(moment, 'YYYY-MM-DD HH')
          .subtract(2, 'day')
          .format('YYYY-MM-DD') + afterFix
      let endTime = moment().format('YYYY-MM-DD') + afterFix

      // 处理1日的数据
      // if(parseInt(moment().format('DD')) == 1){
      //     endTime = moment().format('YYYY-MM-02')+afterFix ;
      // }

      onSelectStartDate(null, startTime)
      onSelectEndDate(null, endTime)

      let paramsObj = { startTime, endTime, stcd: stcdString }
      setSearchTxtObj(paramsObj)
      onSearchTable(null, paramsObj)
    } catch (err) {
      console.log('出现异常', err)
      MessageTool('系统出现异常！请刷新重试', 'error')
    }
  }, [])

  //   搜索按钮
  const onSearchTable = (e, initData = null) => {
    let verifyParams = initData ? initData : searchTxtObj
    if (!verifyParams.startTime || verifyParams.startTime.startsWith(':')) {
      MessageTool('请选择开始日期', 'warning')
      return
    } else if (!verifyParams.endTime || verifyParams.endTime.startsWith(':')) {
      MessageTool('请选择结束日期', 'warning')
      return
    } else if (verifyParams.endTime < verifyParams.startTime) {
      MessageTool('开始日期不能大于结束日期', 'warning')
      return
    }

    // 1.温馨提示
    // setTimeout(()=>{
    //     MessageTool("温馨提示:当前数据量大！请耐心等待",'info')
    // },1000)

    // 2.获取远程数据
    let paramsObj = null
    if (initData) {
      paramsObj = initData
    } else {
      paramsObj = searchTxtObj
    }

    // 3.重新设置一下参数数据
    paramsObj = {
      // stcd:paramsObj.stcd,
      startTime: paramsObj.startTime,
      overTime: paramsObj.endTime,
    }

    // 3.重新设置一下参数数据
    // let prefix = parseInt(paramsObj.time.slice(8,10)) - 1;
    // paramsObj = {
    //     startTime:paramsObj.time.slice(0,8) + prefix + paramsObj.time.slice(10),
    //     overTime: paramsObj.time
    // }

    // 3.选择的时间比返回的数据早1年， 因此提交数据时需要新添加年。
    // let prefix = parseInt(paramsObj.time.slice(0,4)) + 1;
    // paramsObj = {
    //     ...paramsObj,
    //     time:prefix + paramsObj.time.slice(4)
    // }

    // 4.重新设置站点数据
    typeList = Common.waterData

    setIsLoading(true)
    getHourFlowForm(paramsObj)
      .then((res) => {
        // console.log("getHourFlowForm返回的数据是",res)
        setIsLoading(false)

        // 判断是否为空数据
        if (
          !res ||
          !res['data1:'] ||
          !res['data1:'].data ||
          !res['data1:'].data.length
        ) {
          MessageTool('获取数据失败！', 'error')
          return
        }

        // （2.遍历行表头数据
        let new_data1 = res['data1:'].data.sort()
        let t_rowArr = []
        let t_rowTitleArr = []
        new_data1.forEach((item) => {
          t_rowTitleArr.push({ month: reverseFormatDate(item.tm) })
        })
        rowTitleArr = [...t_rowTitleArr, ...rowTitleArr]
        rowTitleArr.forEach((item) => {
          t_rowArr.push(item.month)
        })
        setRowArr(t_rowArr)

        let t_dataResource = Tools.handleHourFlowTableDataY(
          typeList,
          res,
          31,
          10,
          rowTitleArr
        )
        setDataSource(t_dataResource)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log('请求超时！请重试', err)
        MessageTool('请求超时！请重试', 'error')
      })
  }

  // 选择月期
  // const onSelectDate = (date,dateString)=>{
  //     const fixDateString = dateString + afterFix;
  //     const params = {
  //         ...searchTxtObj,
  //         time:fixDateString
  //     }
  //     setSearchTxtObj(params)
  // }
  // 选择日期
  const onSelectStartDate = (date, dateString) => {
    const fixDateString = dateString + afterFix
    const params = {
      ...searchTxtObj,
      startTime: fixDateString,
    }
    setSearchTxtObj(params)
  }
  const onSelectEndDate = (date, dateString) => {
    const fixDateString = dateString + afterFix
    const params = {
      ...searchTxtObj,
      endTime: fixDateString,
    }
    setSearchTxtObj(params)
  }

  // 导出Excel
  const handleOutput = (mode) => {
    if (!dataSource || !dataSource.length) {
      MessageTool('请等待当前数据加载！', 'warning')
      return
    }

    // 表格是隐藏表格（目的是为了良好的用户体验）
    const outputTableId = 'outTable-div'
    const excelFileName = `山口岩水库分日水位明细报表(${searchTxtObj.startTime.slice(
      0,
      4
    )})`

    // 获取行列表头数据
    // let rowArr = ['月份','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    // let colArr = ['月份','王狗冲','老庵里','新泉站（雨量）','西江口','张佳坊','闸室','新泉站','厂房']

    // 删除的行数据, 从1开始
    const deleteRow = null
    const deleteCol = null

    let rLen = rowArr.length
    let cLen = colArr.length
    const rowMergesArr = [
      // {s: {r: rLen - 2, c: 1}, e: {r: rLen - 2, c: 2}},
      // {s: {r: rLen - 2, c: 3}, e: {r: rLen - 2, c: 4}},
      // {s: {r: rLen - 2, c: 5}, e: {r: rLen - 2, c: 6}},
      // {s: {r: rLen, c: 1}, e: {r: rLen, c: 2}},
      // {s: {r: rLen, c: 3}, e: {r: rLen, c: 4}},
      // {s: {r: rLen, c: 5}, e: {r: rLen, c: 6}},
    ]
    const appendBottom =
      '水位单位：米,库容单位：万立方米, 入库/出库流量单位：立方米/秒' +
      ',查询时间：' +
      searchTxtObj.startTime.slice(0, 4) +
      '年' +
      searchTxtObj.startTime.slice(5, 7) +
      '月' +
      searchTxtObj.startTime.slice(8, 10) +
      '日'
    if (mode == 'excel') {
      OutputExcel(
        outputTableId,
        excelFileName,
        rowArr,
        colArr,
        deleteRow,
        deleteCol,
        rowMergesArr,
        appendBottom
      )
    } else {
      OutputPrint(
        outputTableId,
        excelFileName,
        rowArr,
        colArr,
        deleteRow,
        deleteCol,
        rowMergesArr,
        appendBottom
      )
    }
  }

  return (
    <div className="dayWaterChart-div commTable-div">
      <div>
      <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={isLoading}
            sticky
            bordered
          />
      </div>
      <div className="chartGroup">
      <div className="chart1">
    <iframe
      src="https://admin.sovitjs.com/publish_2d/3295793546967121924"
      title="折线图"
      style={{ width: '350px', height: '250px' }}
    ></iframe>
  </div>
  <div className="chart1">
    <iframe
      src="https://admin.sovitjs.com/publish_chart/3295777006116929540"
      title="折线图"
      style={{ width: '300px', height: '300px' }}
    ></iframe>
  </div>
  <div className="chart1">
    <iframe
      src="https://admin.sovitjs.com/publish_chart/3295776862059364361"
      title="折线图"
      style={{ width: '300px', height: '300px' }}
    ></iframe>
  </div>
  
</div>
      
    </div>
  )
}

export default DayWaterForm
