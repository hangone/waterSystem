import React,{useEffect,useState,useRef, Fragment} from 'react' ;
import { Table,Radio,Spin,Cascader,Input,Divider  } from 'antd'; 
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool'; 
import { getWaterMinute1,getWaterMinute2,getWaterMinute3, 
    getRainMinute1,getRainMinute2,getRainMinute3,getRainMinute4,getRainMinute5,
    getCapMinute1,getInflowMinute2,getOutflowMinute3 } from 'Services/Home/minute';  
import { changeDataLine,changeDataLine2,stripDayUselessData2 } from 'Utils'
import { resetTableTitleWidth} from 'Utils/layoutreset'
import options from '..//WaterQuality/formData/options'

// 引入兄弟传值模块 
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment';
import { getWaterQualityData } from '../../../../Services/waterQuality'

import * as echarts from 'echarts'
import Common from 'Common'; 
import {formatDate} from 'Utils'
import 'Assets/css/comm.css';
import './index.css';
 
const { Search } = Input

function WaterChange(){    
    // 端点编码
    let typeList1  = []  
    let typeList2  = []  
    // 计时器
    let ITimer = null;
    // let [ITimerResponse,setITimerResponse] = useState(null);
    // 图的实例
    let myChartTop = null;
    let myChartMiddle = null;
    let myChartBottom = null;
    // 设置响应式图的实例
    let [myChartTopRes,setMyChartTopRes] = useState(null)
    let [myChartMiddleRes,setMyChartMiddleRes] = useState(null)
    let [myChartBottomRes,setMyChartBottomRes] = useState(null) 
    // 图表节点
    const echartTopNodeRef = useRef();
    const echartMiddleNodeRef = useRef();
    const echartBottomNodeRef = useRef();
    // 顶部更多显示栏 
    const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
    const [isShowTitle,setIsShowTitle] = useState((preIsShowTitle == 'true') ? preIsShowTitle :false)
    // 单选按钮,日、 月、周
    const [radioItem, setRadioItem] = useState('day')
    // 是否正在加载
    const [isLoading,setIsLoading] = useState(false)
    const [isShowEchart,setIsShowEchart] = useState(false)
    // 表格是否扩展
    const [activeMenuName,setActiveMenuName] = useState( sessionStorage.getItem("water_isTableCollapse") == 'true' ?  '扩展型' : '紧缩型'  )
    // const [isTableCollapse,setIsTableCollapse] = useState( sessionStorage.getItem("water_isTableCollapse")  == 'true'  ? true : false)
    const [isTableCollapse,setIsTableCollapse] = useState(true)

    
    // 刻度数据(y轴的刻度,series的颜色)
    let myAxisObj = {
        'yAxis':{ 
            'day':{min:0, max:250},
            'week':{min:0, max:250},
            'month':{min:0, max:250},
            'avg':5
        },
        'series':{ 
            'day':[
                {
                    itemStyle:{ 
                        // 常量颜色 c1
                        normal:{ color: Common.colorChartArr.c1 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c1  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c2
                        normal:{ color: Common.colorChartArr.c2 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c2  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c3
                        normal:{ color: Common.colorChartArr.c3 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c3  } 
                    },
                }
            ],
            'week':[
                {
                    itemStyle:{ 
                        // 常量颜色 c3
                        normal:{ color: Common.colorChartArr.c3 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c3  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c4
                        normal:{ color: Common.colorChartArr.c4 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c4  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c5
                        normal:{ color: Common.colorChartArr.c5 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c5  } 
                    },
                }
            ],
            'month':[
                {
                    itemStyle:{ 
                        // 常量颜色 c4
                        normal:{ color: Common.colorChartArr.c4} 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c4  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c5
                        normal:{ color: Common.colorChartArr.c5 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c5  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c6
                        normal:{ color: Common.colorChartArr.c6 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c6  } 
                    },
                }
            ],
        }
    }
    // 时间列数据转换(时间)
    let columnsTimeList = [
        '08', '09',  '10',  '11', '12',
        '13', '14', '15', '16', '17', '18',
        '19', '20',  '21', '22', '23', '00',
        '01', '02', '03', '04', '05', '06', '07',
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
            focus: 'series'
        },
        
        itemStyle:{ 
            normal:{ color: "rgb(146, 53, 53)" } 
        }, 
        lineStyle:{ 
            normal:{width:1, color: "rgb(146, 53, 53)"  } 
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
        //             color: "rgba(20,56,129,0)" // 100% 处的颜色
        //            }],
        //             globalCoord: false // 缺省为 false
        //           }
        //         }
        //   },
    }
    // 表格行、列数据（表头）
    const [columns,setColumns] = useState()  
    // 表格行、列数据 （表体）
    const [dataSource,setDataSource] = useState([])  
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
    useEffect(() => {    
        // 重新设置表头宽度 
        window.addEventListener("resize", function() {  
            resetTableTitleWidth() 
        });   
        return () => {
            window.removeEventListener("resize",()=>{});
        } 
    }, [window]);  
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
            MessageTool('数据获取失败', 'error')
          })
      }
 // 获取日数据
//  const getDayData = async(isInit=false) =>{ 
//     try{  
//         // 入库流量，出库流量，库容
//         let dayCap1 = await getCapMinute1() 
//         let dayInflow2 = await getInflowMinute2() 
//         let dayOutflow3 = await getOutflowMinute3()  
//         // 水位
//         let dayWater1 = await getWaterMinute1() 
//         let dayWater2 = await getWaterMinute2()
//         let dayWater3 = await getWaterMinute3() 
//         // 雨量
//         let dayRain1 = await getRainMinute1() 
//         let dayRain2 = await getRainMinute2() 
//         let dayRain3 = await getRainMinute3() 
//         let dayRain4 = await getRainMinute4() 
//         let dayRain5 = await getRainMinute5() 
          
     
//         // // （1.获取图表数据
//         var t_res = [] 
//         const prefixDate = moment().format('YYYY-MM-DD ') 
//         let nowTime = parseInt(moment().format("HH"))
//         nowTime  = nowTime - 8
//         if(nowTime<0) nowTime += 25 
//         let t_max = 0; // 没有负值
//         let t_min = 1000000; // 没有极大值 

//         // // // 切割超出的时数据  
//         // dayCap1 = stripDayUselessData2(dayCap1) 

//         let timeTurns = 0;
//         let curMinute = 0;
//         let t_item = 0; 
//         dayCap1.forEach((item,index)=>{ 
//             // 表格数据  
//             timeTurns = Math.floor(index / 12);
//             curMinute = (index % 12 ) * 5;
//             curMinute = curMinute <10  ? '0'+curMinute : curMinute 

//             t_item = prefixDate +  columnsTimeList[timeTurns] + ':'+ curMinute + ':00' 
//             t_res.push( { 
//                 order:(index == nowTime ? '*' : '' )+(index+1),  
//                 [typeList1[0].stcd+'rz']: changeDataLine(dayWater1[index]), 
//                 [typeList1[1].stcd+'rz']: changeDataLine(dayWater2[index]), 
//                 [typeList1[2].stcd+'rz']: changeDataLine(dayWater3[index]), 

//                 [typeList2[0].stcd+'drp']: changeDataLine2(dayRain1[index]), 
//                 [typeList2[1].stcd+'drp']: changeDataLine2(dayRain2[index]),  
//                 [typeList2[2].stcd+'drp']: changeDataLine2(dayRain3[index]),  
//                 [typeList2[3].stcd+'drp']: changeDataLine2(dayRain4[index]),  
//                 [typeList2[4].stcd+'drp']: changeDataLine2(dayRain5[index]), 

//                 [typeList1[0].stcd+'w']:changeDataLine(dayCap1[index] ), 
//                 [typeList1[1].stcd+'inflow']:changeDataLine(dayInflow2[index]  ),
//                 [typeList1[2].stcd+'outflow']:changeDataLine(dayOutflow3[index] ), 
                
//                 tm:  columnsTimeList[timeTurns] + ':'+ curMinute,
//             })    
//         })   

//         // 设置表头数据
//         let t_columns = [
//             {
//               title: '省份',
//               dataIndex: 'province',
//               width: 100,
//               fixed: 'left',
//             },
//             {
//               title: '藻密度(cells/L)',
//               dataIndex: 'algae_density',
//               width: 150,
//             },
//             {
//               title: '氨氮(mg/L)',
//               dataIndex: 'ammonia_nitrogen',
//               width: 150,
//             },
//             {
//               title: '流域',
//               dataIndex: 'basin',
//               width: 150,
//               //fixed: 'left',
//             },
//             {
//               title: '叶绿素α(mg/L)',
//               dataIndex: 'chlorophyll_alpha',
//               width: 150,
//             },
//             {
//               title: '所在地市',
//               dataIndex: 'city',
//               width: 150,
//             },
//             {
//               title: '电导率(μS/cm)',
//               dataIndex: 'conductivity',
//               width: 150,
//             },
//             {
//               title: '溶解氧(mg/L)',
//               dataIndex: 'dissolved_oxygen',
//               width: 150,
//             },
//             {
//               title: 'pH(无量纲)',
//               dataIndex: 'pH',
//               width: 150,
//             },
//             {
//               title: '高锰酸盐指数(mg/L)',
//               dataIndex: 'permanganate_index',
//               width: 150,
//             },
//             {
//               title: '所属河流',
//               dataIndex: 'river',
//               width: 150,
//             },
//             {
//               title: '断面名称',
//               dataIndex: 'section',
//               width: 150,
//             },
//             {
//               title: '站点情况',
//               dataIndex: 'station_status',
//               width: 150,
//             },
//             {
//               title: '监测时间',
//               dataIndex: 'time',
//               width: 150,
//             },
//             {
//               title: '总氮(mg/L)',
//               dataIndex: 'total_nitrogen',
//               width: 150,
//             },
//             {
//               title:'总磷(mg/L)',
//               dataIndex: 'total_phosphorus',
//               width: 150,
//             },
//             {
//               title: '浊度(NTU)',
//               dataIndex: 'turbidity',
//               width: 150,
//             },
//             {
//               title: '水质类别',
//               dataIndex: 'water_quality',
//               width: 150,
//             },
//             {
//               title: '水温(℃)',
//               dataIndex: 'water_temperature',
//               width: 150,
//             },
//           ];
          
//         // typeList1.forEach((item,index)=>{  
//         //     t_columns.push({
//         //         title:item.stnm + '(米)',
//         //         dataIndex:item.stcd+'rz',
//         //         key:item.stcd+'rz',
//         //         align:'center',
//         //         width:60,
//         //     })
            
//         //     // 间隔加入
//         //     switch(index){
//         //         case 0: 
//         //             t_columns.push({
//         //                 title: '库容(万立方米)',
//         //                 dataIndex:typeList1[0].stcd+'w',
//         //                 key:typeList1[0].stcd+'w',
//         //                 align:'center',
//         //                 width:120,
//         //             }) 
//         //             break;
//         //         case 1: 
//         //             t_columns.push({
//         //                 title:'入库流量(立方米/秒)',
//         //                 dataIndex:typeList1[1].stcd+'inflow',
//         //                 key:typeList1[1].stcd+'inflow',
//         //                 align:'center',
//         //                 width:120,
//         //             }) 
//         //             break;
//         //         case 2:       
//         //             t_columns.push({
//         //                 title:'出库流量(立方米/秒)',
//         //                 dataIndex:typeList1[2].stcd+'outflow',
//         //                 key:typeList1[2].stcd+'outflow',
//         //                 align:'center',
//         //                 width:120,
//         //             }) 
//         //             break;
//         //     }
//         // }) 
//         // typeList2.forEach((item,index)=>{  
//         //     t_columns.push({
//         //         title:item.stnm + '(毫米)',
//         //         dataIndex:item.stcd+'drp',
//         //         key:item.stcd+'drp',
//         //         align:'center',
//         //         width:60,
//         //     })
//         // })  
//         setColumns(t_columns) 
          
          
//         // 切割数据
//         let tt_res = []
//         const currentDayTime = moment().format("HH")
//         // const goalCurrentDayTime = moment().format("YYYY-MM-DD HH时") 
//         const goalCurrentDayTime = moment().format("HH:mm") 
//         let isNotArriveDay = true; 
//         // map是可修改数据
//         t_res.map((item,index)=>{  
//             if(isNotArriveDay){  
//                 // if(item.tm == goalCurrentDayTime|| item.tm == '*' + goalCurrentDayTime){
//                 //     isNotArriveDay = false;   2019-02-00 01:01:01
//                 // }    
//                 if(index!= 0 && index != t_res.length - 1 && verifyMinute(item.tm,goalCurrentDayTime,'<=')
//                     && verifyMinute(t_res[index+1].tm,goalCurrentDayTime,'>')){
//                     isNotArriveDay = false;  
//                 }
//                 tt_res.push(item);
//             } 
//         })  

        
//         // 替换数据
//         t_res = tt_res;

        
//         // 雨量数据汇总
//         let totalDrp0 = 0
//         let totalDrp1 = 0
//         let totalDrp2 = 0
//         let totalDrp3 = 0
//         let totalDrp4 = 0
//         t_res.forEach(item=>{  
//             if(item[typeList2[0].stcd+'drp'] &&  item[typeList2[0].stcd+'drp'] != '-')
//                 totalDrp0 += changeDataLine2(item[typeList2[0].stcd+'drp'])
//             if(item[typeList2[1].stcd +'drp'] && item[typeList2[1].stcd +'drp'] != '-') 
//                 totalDrp1 += changeDataLine2(item[typeList2[1].stcd+'drp'])
//             if(item[typeList2[2].stcd+'drp'] && item[typeList2[2].stcd+'drp'] != '-') 
//                 totalDrp2 += changeDataLine2(item[typeList2[2].stcd+'drp'])
//             if(item[typeList2[3].stcd+'drp'] && item[typeList2[3].stcd+'drp'] != '-') 
//                 totalDrp3 += changeDataLine2(item[typeList2[3].stcd+'drp'])
//             if(item[typeList2[4].stcd+'drp'] && item[typeList2[4].stcd+'drp'] != '-') 
//                 totalDrp4 += changeDataLine2(item[typeList2[4].stcd+'drp']) 
//         })
//         // 新添加一条数据 
//         let appendObj = {
//             'order':t_res.length+1,
//             'tm':'合计雨量', 
//             [typeList1[0].stcd+'rz']:'-',
//             [typeList1[1].stcd+'rz']:'-',
//             [typeList1[2].stcd+'rz']:'-',
            
//             [typeList2[0].stcd+'drp']:totalDrp0,
//             [typeList2[1].stcd+'drp']:totalDrp1,
//             [typeList2[2].stcd+'drp']:totalDrp2,
//             [typeList2[3].stcd+'drp']:totalDrp3,
//             [typeList2[4].stcd+'drp']:totalDrp4,

//             [typeList1[0].stcd+'w']:'-',
//             [typeList1[1].stcd+'inflow']:'-',
//             [typeList1[2].stcd+'outflow']:'-',
//         } 
//         t_res.push(appendObj);


//         // 设置表体数据
//         setDataSource(t_res)  
 
//         // 暂停旋转器
//         setIsLoading(false)  

//         // 重新设置表头宽度
//         setTimeout(()=>{ 
//             resetTableTitleWidth()
//         },1000)
//     }catch(err){ 
        
//         // 暂停旋转器
//         setIsLoading(false)  

//         console.log("请求超时！请重试",err)
//         MessageTool('请求超时！请重试','error')
//     }
// }  
    
    // 六、图表显示
    // 显示的图表，顶部
    const drawContentRightTop = (t_echartList ) =>{   
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-top'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartTop)  myChartTop = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartTop = echarts.init(document.getElementById('bottom-echart-top'),'dark');
         
        

        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '日水位变化曲线', 
                color:'white',
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                top:5,
                left:5,
                data:[typeList1[0].stnm,typeList1[1].stnm,typeList1[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis: [
                    { 
                        type: 'category', 
                        position:'bottom',
                        name: '时间',
                        min: 0,   // 起始值
                        max: 23,  // 结束值  
                        nameTextStyle:{   // name标签文字样式
                            padding:[0,0,0,-10],  
                        },
                        data: t_echartList.xArr, 
                        axisTick: {      // 轴线刻度  
                            length: 7,//刻度线的长度
                            interval: 2,  //该{}中的data全部显示
                            lineStyle: { 
                                color: '#ccc',
                                fontSize: '20px'
                            }
                        },
                        axisLine: {       // 轴线颜色 
                            onZero: false,             // 保持轴线在底部， 非0位置
                            symbol:["none","arrow"],    //轴线箭头
                            symbolSize: [8, 10] 
                        },
                        boundaryGap: false       // 不留白，从原点开始
                    },
                    {  
                        type: 'category', 
                        position:'bottom',
                        min: 0,   // 起始值
                        max: 23,  // 结束值  
                        nameTextStyle:{   // name标签文字样式
                            padding:[0,0,0,-10],  
                        },
                        data: t_echartList.xArr, 
                        axisTick: {      // 轴线刻度  
                            length: 3,//刻度线的长度
                            interval: 0,  //该{}中的data全部显示
                            lineStyle: { 
                                color: '#ccc',
                                fontSize: '20px'
                            }
                        },
                        axisLine: {       // 轴线颜色 
                            onZero: false,             // 保持轴线在底部， 非0位置
                            symbol:["none","arrow"],    //轴线箭头
                            symbolSize: [8, 10] 
                        },
                        boundaryGap: false       // 不留白，从原点开始
                    }
            ],
            yAxis:  {
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.day, 
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartTop.setOption(option); 
        setMyChartTopRes(myChartTop)

        // 4.修正位置 
        if(echartTopNodeRef.current) echartTopNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
        // 显示图表，vue中采用v-show
        setTimeout(()=>{ 
            setIsShowEchart(true);
        },1000)
    }
    // 显示的图表，中部
    const drawContentRightMiddle = (t_echartList ) =>{    
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-middle'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartMiddle)  myChartMiddle = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartMiddle = echarts.init(document.getElementById('bottom-echart-middle'),'dark');
       

        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '周水位变化曲线', 
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                top:5,
                left:5,
                data:  [typeList1[0].stnm,typeList1[1].stnm,typeList1[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis:  [
                { 
                    type: 'category', 
                    position:'bottom',
                    name: '星期',
                    min: 0,   // 起始值
                    max: 6,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 7,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                },
                {  
                    type: 'category', 
                    position:'bottom',
                    min: 0,   // 起始值
                    max: 6,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 3,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                }
            ],
            yAxis:  {
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.week,
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartMiddle.setOption(option);
        setMyChartMiddleRes(myChartMiddle)

        // 4.修正位置 
        if(echartMiddleNodeRef.current) echartMiddleNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
    }
    // 显示的图表，底部
    const drawContentRightBottom = (t_echartList ) =>{     
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-bottom'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartBottom)  myChartBottom = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartBottom = echarts.init(document.getElementById('bottom-echart-bottom'),'dark');
 

        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '月水位变化曲线', 
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                top:5,
                left:5,
                data: [typeList1[0].stnm,typeList1[1].stnm,typeList1[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis:  [
                { 
                    type: 'category', 
                    position:'bottom',
                    name: '日期',
                    min: 0,   // 起始值
                    max: 30,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 7,//刻度线的长度
                        interval: 8,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                },
                {  
                    type: 'category', 
                    position:'bottom',
                    min: 0,   // 起始值
                    max: 30,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 3,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                }
            ], 
            yAxis:{
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.month,
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartBottom.setOption(option);
        setMyChartBottomRes(myChartBottom)

        // 4.修正位置 
        if(echartBottomNodeRef.current) echartBottomNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
    }
 
    // 设置表格扩展类型
    const onSelectDropdown = (name)=>{ 

         // 设置下拉菜单项  
         if(name == '紧缩型'){
             setIsTableCollapse(false)
             setActiveMenuName("紧缩型")
             sessionStorage.setItem("water_isTableCollapse",false)

              
            // 修正位置 
            setIsShowEchart(false);
            if(echartTopNodeRef.current){ 
                echartTopNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";  
            }  
            if(echartMiddleNodeRef.current){ 
                echartMiddleNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
            } 
            if(echartBottomNodeRef.current){ 
                echartBottomNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
            }   

            // // 再次修正位置   
            if(myChartTop) myChartTop.resize()
            if(myChartMiddle) myChartMiddle.resize()
            if(myChartBottom) myChartBottom.resize() 
            setTimeout(()=>{ 
                setIsShowEchart(true);
            },1000)
         }else{
            setIsTableCollapse(true)
            setActiveMenuName("扩展型")
            sessionStorage.setItem("water_isTableCollapse",true)
         }
  
    }  

    return (
        <div className='waterChange-div homeTable-div commTable-div'  > 
            {/* <div className='fixTitle-div' style={{display:isShowTitle ? 'flex' : 'none'}}>     
                <Radio.Group onChange={onChange} value={radioItem}>
                    <Radio value={'day'}>日水位数据</Radio>
                    <Radio value={'week'}>周水位数据</Radio>
                    <Radio value={'month'}>月水位数据</Radio>  
                </Radio.Group>
                <div className='table-mode-div'> 
                    <div>表格模式：</div>
                    <Dropdown overlay={
                            <Menu>      
                                    <Menu.Item onClick={()=>onSelectDropdown('紧缩型')}>
                                        <div > 紧缩型 </div>
                                    </Menu.Item>  
                                    <Menu.Item onClick={()=>onSelectDropdown('扩展型')}>
                                        <div > 扩展型 </div>
                                    </Menu.Item>  
                            </Menu>
                            } placement="bottomLeft">
                                <Button type='default'>{activeMenuName}</Button>
                            </Dropdown>
                </div>
            </div> */}
            <div className='body-bottom-div' style={{'background':'white'}}>  
                <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin>

                <div className='bottom-top' style={{height:isTableCollapse ? 'inherit' : '50%',position:isTableCollapse ? 'absolute' : 'relative'}}>
                <div className="content theme-box">
          <Cascader
            options={options}
            onChange={onChange}
            size="large"
            className="antdCas"
            placement="bottomLeft"
            style={{ width: '8vw' }}></Cascader>
          <Search
            placeholder="请输入断面名称"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={{ width: '30vw' }}
            className="antdSearch"
          />
        </div>
          <Divider />     
                    <Table dataSource={dataSource} columns={columns} pagination={false} sticky />
                </div> 
      
                <div className='bottom-bottom'  style={{'visibility':isTableCollapse ? 'hidden' : 'visible'}} >   
                    {/* <div className='mask-div' style={{'display':isShowEchart ?'none' : 'block'}}>  </div> */}
                    <div id='bottom-echart-top' style={{width:'600px',height:'300px'}} ref={echartTopNodeRef}></div>
                    <div id='bottom-echart-middle' style={{width:'600px',height:'300px' }} ref={echartMiddleNodeRef}></div>
                    <div id='bottom-echart-bottom' style={{width:'600px',height:'300px' }} ref={echartBottomNodeRef}></div>            
                 </div>     
            </div>
        </div>
    )
}

export default WaterChange;