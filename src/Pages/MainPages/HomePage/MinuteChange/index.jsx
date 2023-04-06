import React, { useState, useRef } from 'react'
import { Table, Spin, Cascader, Input, Divider } from 'antd'
import { MessageTool } from 'Components/Tools/MessageTool'
import options from '..//WaterQuality/formData/options'
import columns from '../WaterQuality/formData/column'
import RadarChart from '../WaterQuality/charts'
// 引入兄弟传值模块

// 引入时间模块
import { getWaterQualityData } from '../../../../Services/waterQuality'

import * as echarts from 'echarts'
import Common from 'Common'
import 'Assets/css/comm.css'
import './index.css'

const { Search } = Input

function WaterChange() {
  // 计时器
  let ITimer = null
  // let [ITimerResponse,setITimerResponse] = useState(null);
  // 设置响应式图的实例
  // 顶部更多显示栏
  const preIsShowTitle = sessionStorage.getItem('water_isShowTitle')
  const [isShowTitle, setIsShowTitle] = useState(
    preIsShowTitle == 'true' ? preIsShowTitle : false
  )
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false)
  // const [isTableCollapse,setIsTableCollapse] = useState( sessionStorage.getItem("water_isTableCollapse")  == 'true'  ? true : false)
  const [isTableCollapse, setIsTableCollapse] = useState(true)
  // 图表默认数据(series数据)
  // 表格行、列数据（表头）
  //const [columns, setColumns] = useState()
  //setColumns(column)
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
  // useEffect(()=>{
  //     try{
  //         // const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
  //         // setIsShowTitle (preIsShowTitle == 'true' ? preIsShowTitle :false)

  //         // 清除提示
  //         MessageToolClear();
  //         setIsLoading(true)
  //         // 获取平均水位站点数据
  //         typeList1  = Common.waterData
  //         typeList2  = Common.rainData

  //         // // 去除末尾的厂房站雨量
  //         // typeList2 = typeList2.slice(0,typeList2.length-1)

  //         // 首次查询表格数据, 月、 周、日
  //         // onSearch('month',true);
  //         // onSearch('week',true);
  //         onSearch('day',true);

  //         ITimer = setInterval(()=>{
  //             // 查询表格数据
  //             // onSearch(Common.waterData,t_columns.length - 1);
  //             onSearch(radioItem);
  //             // 更新提示
  //             MessageTool("数据已经更新","success")
  //         },Common.refreshDelay)
  //         sessionStorage.setItem('ITimerResponse',ITimer)

  //     }catch(err){
  //         console.log("出现异常",err)
  //         MessageTool('系统出现异常！请刷新重试','error')
  //     }
  //     return ()=>{
  //         //  清除定时器
  //         let ITimerResponse = sessionStorage.getItem('ITimerResponse' )
  //         if(ITimerResponse) clearInterval(ITimerResponse)
  //         if(ITimer) clearInterval(ITimer)
  //         // 取消消息订阅
  //         PubSub.unsubscribe("water_titleMenu");
  //     }
  // },[])
  // 监听页面的尺寸变化
  // useEffect(() => {
  //   // 重新设置表头宽度
  //   window.addEventListener('resize', function () {
  //     resetTableTitleWidth()
  //   })
  //   return () => {
  //     window.removeEventListener('resize', () => {})
  //   }
  // }, [window])
  // 监听时间的变化
  //  useEffect(()=>{
  //     dragTableScroll();
  // },[moment().format("HH"),dataSource.length])

  // 三、功能操作
  // 验证分钟
  // const verifyMinute = (one,two,mode)=>{
  //     if(one == '合计雨量') return true;

  //     let hour1 = parseInt(one.replace(' ','').slice(0,2))
  //     let minute1 = parseInt(one.replace(' ','').slice(3))
  //     let hour2 = parseInt(two.replace(' ','').slice(0,2))
  //     let minute2 = parseInt(two.replace(' ','').slice(3))
  //     if(mode == '>='){
  //         // 15:00       16:01;
  //         if(hour1>hour2 || (hour1 == hour2 && minute1 >= minute2)){
  //             return true;
  //         }
  //     }else if(mode == '<'){
  //         if(hour1<hour2 || (hour1 == hour2 && minute1 < minute2)){
  //             return true;
  //         }
  //     }else if(mode == '<='){
  //         // 15:00       16:01;
  //         if(hour1<hour2 || (hour1 == hour2 && minute1 <= minute2)){
  //             return true;
  //         }
  //     }else if(mode == '>'){
  //         if(hour1>hour2 || (hour1 == hour2 && minute1 > minute2)){
  //             return true;
  //         }
  //     }
  //     return false;
  // }   // 15:40' '15:38' false false
  // // 主动滚动当前滚动条, 传递目标时间
  // const dragTableScroll = () =>{
  //     // 目标滚动容器
  //     var goalNode = document.querySelector('.bottom-top');
  //     if(!goalNode){
  //         console.log("错误！当前无法自动滚动！")
  //         return;
  //     }
  //     // 当前的滚动减少的行数
  //     var declineRow = 3;
  //     // 通过比较当前的时间，来拖动滚动条。
  //     var totalRow = dataSource.length;
  //     // 计算滚动的比例
  //     let turnsRow = 0;

  //     switch(radioItem){
  //         case 'day':
  //             const currentDayTime = moment().format("HH")
  //             // const goalCurrentDayTime = moment().format("YYYY-MM-DD HH时")
  //             const goalCurrentDayTime = moment().format("HH:mm")
  //             let isNotArriveDay = true;
  //             // map是可修改数据
  //             dataSource.map((item,index)=>{
  //                 if(isNotArriveDay){
  //                     turnsRow ++;
  //                     // if(item.tm == goalCurrentDayTime|| item.tm == '*' + goalCurrentDayTime){
  //                     //     isNotArriveDay = false;   2019-02-00 01:01:01
  //                     // }
  //                     if(index!= 0 && index != dataSource.length -1 && verifyMinute(item.tm,goalCurrentDayTime,'<=')
  //                         && verifyMinute(dataSource[index+1].tm,goalCurrentDayTime,'>')){
  //                         isNotArriveDay = false;
  //                     }
  //                 }
  //             })
  //             break;
  //         case 'week':
  //             const currentWeekTime = moment().format("ddd")
  //             const goalCurrentWeekTime = moment().format("ddd")
  //             let isNotArriveWeek = true;
  //             // map是可修改数据
  //             dataSource.map(item=>{
  //                 if(isNotArriveWeek){
  //                     turnsRow ++;
  //                     if(item.tm == goalCurrentWeekTime || item.tm == '*' + goalCurrentWeekTime){
  //                         isNotArriveWeek = false;
  //                     }
  //                 }
  //             })
  //             break;
  //         case 'month':
  //             const currentMonthTime = moment().format("HH")
  //             const goalCurrentMonthTime = currentMonthTime + '日'
  //             let isNotArriveMonth = true;
  //             // map是可修改数据
  //             dataSource.map(item=>{
  //                 if(isNotArriveMonth){
  //                     turnsRow ++;
  //                     if(item.tm == goalCurrentMonthTime || item.tm == '*' + goalCurrentMonthTime){
  //                         isNotArriveMonth = false;
  //                     }
  //                 }
  //             })
  //             break;
  //     }

  //     // 按照比例拖动滚动条
  //     turnsRow -= declineRow
  //     turnsRow = turnsRow > 0 ? turnsRow : 0
  //     goalNode.scrollTop = goalNode.scrollHeight * turnsRow / totalRow
  // }
  // 搜索表格信息,(先获取远程数据，再绘制表格)
  // const onSearch = (t_radioItem=null,isInit = false)=>{
  //     switch(t_radioItem){
  //         case 'day':
  //             getDayData(isInit);
  //             break;
  //     }
  // }

  // 五、获取远程数据
  function onChange(value) {
    console.log(value)
    if (!value) {
      return
    }
    setIsLoading(true)
    getWaterQualityData(Number(value[1]))
      .then((res) => {
        setDataSource(res.tbody)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败', 'error')
      })
  }

  function onSearch(val) {
    setIsLoading(true)
    getWaterQualityData(val)
      .then((res) => {
        setDataSource(res.tbody)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败!', 'error')
      })
  }
  return (
    <div className="waterChange-div homeTable-div commTable-div">
      <div className="body-bottom-div" style={{ background: 'white' }}>
        <div
          className="bottom-top"
          style={{
            height: isTableCollapse ? 'inherit' : '50%',
            position: isTableCollapse ? 'absolute' : 'relative',
          }}>
          <div className="content">
            <Spin
              tip="加载数据中"
              spinning={isLoading}
              style={{ display: isLoading ? 'flex' : 'none'}}></Spin>
            <Cascader
              options={options}
              onChange={onChange}
              size="large"
              className="antdCas"
              placement="bottomLeft"
              placeholder="请选择区域"
              style={{ width: '12vw' }}></Cascader>
            <Search
              placeholder="请输入断面名称"
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={onSearch}
              style={{ width: '30vw', backgroundColor: 'blue' }}
              className="antdSearch"
            />
          </div>
          <div className="table">
            <Divider />
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={true}
              loading={isLoading}
              style={{ width: '100%' }}
              scroll={{ y: 300, x: 400 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterChange
