import React,{useEffect,useState,useRef} from 'react' ;
import moment from 'moment'
import { DatePicker, Button,Empty ,Spin} from 'antd';
import { SearchOutlined  } from '@ant-design/icons';
import { getYearRainChart } from 'Services/Home/search';
import { MessageTool } from 'Components/Tools/MessageTool'; 
import * as echarts from 'echarts'
import Common from 'Common';
import Tools from 'Components/Tools/ChartsData' 
import { changeDataLine} from 'Utils'
import './index.css';
 
// 引入兄弟传值模块 
import PubSub from 'pubsub-js'

function WhouseChange(){   
    // 端点编码
    let typeList  = []  
    // 默认后缀
    const afterFix =  '-00-00 00:00:00'
    let afterObj =  {stcd:''}
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({
        time:moment().format("YYYY") + afterFix
    })  
    // 默认日期
    const [defaultValue,setDefaultValue] = useState(moment())
    // 加载器
    const [isLoading,setIsLoading] = useState(false)   
    // 图表节点
    const echartTopNodeRef = useRef();
    let [myChartTopRes,setMyChartTopRes] = useState(null)
    // 图的实例
    let myChartTop = null; 

    // const [columns,setColumns] = useState([])  
    // const [dataSource,setDataSource] = useState([])  

    // 图表信息
    const [isShowCharts,setIsShowCharts] = useState(false) 

    let defaultObj = { 
        'yAxis':{
            avg:5,
            line:{ 
                min:0,
                max:250, 
            }
        },
        'series':[
            {
                'line1':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s1.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s1.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s1.color,
                        color: Common.shapeChartArr.s1.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }
            }, 
            {
                'line2':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s2.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s2.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s2.color,
                        color: Common.shapeChartArr.s2.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line3':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s3.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s3.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s3.color,
                        color: Common.shapeChartArr.s3.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line4':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s4.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s4.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s4.color,
                        color: Common.shapeChartArr.s4.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line5':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s5.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s5.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s5.color,
                        color: Common.shapeChartArr.s5.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line6':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s6.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s6.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s6.color,
                        color: Common.shapeChartArr.s6.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line7':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s7.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s7.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s7.color,
                        color: Common.shapeChartArr.s7.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line8':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s8.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s8.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s8.color,
                        color: Common.shapeChartArr.s8.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            },  
        ]

        // markPoint: {
        //     data: [
        //       { type: 'max', name: 'Max' },
        //       { type: 'min', name: 'Min' }
        //     ]
        // },
    }
 
      
    // 初始化加载
    useEffect(()=>{
        try{ 
            // 获取平均雨量
            let stcdString = ''  
            let t_columns = [
                {
                    title:'月份',
                    dataIndex:'year',
                    key:'year',
                }
            ];  

            Common.rainData.forEach((item,index)=>{ 
                if(index == 0){ 
                    stcdString += item.stcd
                }else{ 
                    stcdString =  stcdString  + ',' + item.stcd 
                }
                t_columns.push({
                    title:item.stnm,
                    dataIndex:item.stcd,
                    key:item.stcd,
                }) 
            })  
            t_columns.push({
                title:'平均雨量',
                dataIndex:'avg',
                key:'avg',
            })

            
            // 默认搜索的站点
            afterObj = {
                stcd:stcdString
            }
            typeList = Common.rainData

            // 图表内容 
            setSearchTxtObj({
                stcd:stcdString
            })  
 
            // 设置默认日期 ，开启搜索(日期已经有默认值)
            // YYYY-MM-DD HH:mm:ss
            onSelectDate(null,moment().format('YYYY'))
            setSearchTxtObj({
                ...searchTxtObj,
                stcd:stcdString
            })  
            onSearchChart({
                ...searchTxtObj,
                stcd:stcdString
            }) 
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])

    
    // 监听页面的尺寸变化 
    useEffect(() => { 
        window.addEventListener("resize", function() { 
            if(myChartTop) myChartTop.resize() 
        });  
        return () => {
            window.removeEventListener("resize",()=>{});
            if(myChartTop) myChartTop.dispose() 
        };
    }, [window]);

    // 监听PubSub.subscribe 的变化
    useEffect(()=>{  
        PubSub.subscribe("water_leftcollapsed",(msg,stateObj)=>{     

            let parentNode1 = document.querySelector("#bottom-echart-top")
            let childrenNode1 = document.querySelector("#bottom-echart-top>div")
            let canvasNode1 = document.querySelector("#bottom-echart-top>div canvas")
            parentNode1.style.cssText = "width:100%!important;height:100%!important"; 
            childrenNode1.style.cssText = "width:100%!important;height:100%!important;display:flex!important;justify-content:center";  
            canvasNode1.style.cssText = "width:100%!important;height:96%!important;z-index:999"; 
            if(myChartTopRes) myChartTopRes.resize() 
           
            setMyChartTopRes(myChartTopRes) 
        })   
        return ()=>{ 
            PubSub.unsubscribe("water_leftcollapsed")
        }
    },[PubSub.subscrib ])

    //   搜索按钮
    const onSearchChart = (initData = null)=>{
        if(!searchTxtObj.time && !initData){   
            MessageTool('请选择月份','warning')
            return;
        }
        
        // 1.清除目标节点下的旧内容 
        const preNode = document.querySelector(".body-bottom-div")
        const curNode = document.querySelector('#bottom-echart') 
        const newNode = document.createElement('div')
        newNode.setAttribute('id','bottom-echart')
        // newNode.style.cssText="position:relative;right:0;bottom:0;width:calc(100vw - 15vw);height:calc(100vh - 15vh)"
        // style={{width:'1200px',height:'500px'}} 
        newNode.style.cssText=" width:1200px;height:500px"
        if(curNode){           
            preNode.removeChild(curNode)
            preNode.appendChild(newNode)
        }

        // 2.获取远程数据
        let paramsObj = null
        if(Object.keys(initData) && Object.keys(initData).length ==2){
            paramsObj = initData
        }else{
            paramsObj = searchTxtObj  
        } 

        
        // 3.选择的时间比返回的数据早1年， 因此提交数据时需要新添加年。
        let prefix = parseInt(paramsObj.time.slice(0,4)) + 1; 
        paramsObj = {
            ...paramsObj,
            time:prefix + paramsObj.time.slice(4)
        }

        // 4.重新设置站点数据
        typeList = Common.rainData
         
        setIsLoading(true) 
        getYearRainChart(paramsObj).then(res=>{
            // console.log("getYearRainChart返回的数据是",res,res.data)

            let beforeData = res.data


            let lines = {}; 
            let lines1 = {}  // 平均雨量
            Object.keys(beforeData).map(item=>{
                if(item.startsWith('avg')){
                    lines1[item.replace('avg','')] = beforeData[item]
                }else{
                    return lines[item] = beforeData[item]
                }
            }) 

            // 切割超出的日期数据 
            let lines_t = {} 
            let searchTime = paramsObj.time.slice(0,4);
            let curTime = moment().format("YYYY");
 
            let prefix = moment(searchTime,"YYYY").format("YYYY-")
 
            // 如果是当月的，则以当前的日期计算，如果不是，则以整个月计算
            let judge1 = moment(searchTime,"YYYY").format("Y")
            let judge2 = moment(curTime,"YYYY").format("Y")

            // 日期纠正;
            judge1 = parseInt(judge1) - 1;
            judge2 = parseInt(judge2) 
            let dayLen = 0;  
            if(judge1 == judge2){
                dayLen = parseInt(moment().format("MM"))
            }else if(judge1>judge2){
                // 超出年份
                prefix = ''
                dayLen = 0; 
            } else{
                dayLen = 12
            }    
 
            // 日期纠正;
            prefix = (parseInt(prefix) - 1) + "-"; 
            Object.keys(lines).sort().forEach((item,index)=>{ 
                let t_index = (index + 1) < 10 ? '0' + (index + 1) : index + 1
                if(item.startsWith(prefix + t_index) && index <= dayLen){
                    lines_t[item] = lines[item] 
                } 
            })
            lines = lines_t 
  
            let xArr =  Tools.handleChartsDataX(lines1)
            let yArr =  Tools.handleChartsDataY(lines,'drp')  

            // 补充y轴数据
            if(yArr && yArr.length < 12){
                let yArr1 =  yArr.map(item=>{
                    let t_data = [...item.data];
                    for(let i=0;i< 12 - item.data.length;i++){
                        t_data.push(null);
                    }

                    return {...item,data:t_data}
                })
                yArr = yArr1;
            } 
  

            // // 1.修改数据,名称
            let t_xArr = []  
            let t_yArr = []
            let t_echartNamesList = []
            // 获取名称 
            typeList.forEach(item=>{
                t_echartNamesList.push(item.stnm)
            })
            t_echartNamesList = [...t_echartNamesList,'平均降雨量']



            // 2.获取图表x轴、y轴数据 
            // 补充x轴数据 
            for(let i=0;i< 12 ;i++){
                t_xArr.push(( i+1)+'月')
            }  

            // (1.替换原数据名称
            let turns = 0;
            yArr.forEach((item)=>{ 
                typeList.some((subItem)=>{ 
                    if(subItem.stcd == item.name){ 
                        t_yArr.push({
                            ...defaultObj.series[turns]["line"+(turns+1)],
                            name:subItem.stnm,
                            data:item.data
                        }) 
                        turns += 1
                        return false;
                    }
                }) 
            })  
            // （2.平均降雨量
            let t_avgdrp = Object.keys(lines1).sort().map((item,index)=>{
                if(index < dayLen){ 
                    let t = changeDataLine(lines1[item])
                    if(t == '-') t = null 
                    return  t;
               }else{
                   return null;
               } 
            })
            t_yArr.push({
                ...defaultObj.series[turns]["line"+(turns+1)],
                name:'平均降雨量',
                data:t_avgdrp
            }) 
            // turns+=1; 
            // // （3.闸室水位
            // let t_zsrz = Object.keys(lines1).map(item=>{
            //     return lines1[item]
            // })
            // t_yArr.push({
            //     ...defaultObj.series[turns]["line"+(turns+1)],
            //     name:'闸室水位',
            //     yAxisIndex: 1,  // (水位坐标轴)
            //     data:t_zsrz
            // })
            // turns+=1;


            // // 3.计算雨量的最大值与最小值
            let t_min = 100000;
            let t_max = 0;
            t_yArr.forEach(item=>{
                let max = item.data.reduce((sum,item)=>{
                    return Math.max(sum,item)
                },t_max)
                let min = item.data.reduce((sum,item)=>{
                    return Math.min(sum,item)
                },t_min) 
                if(max > t_max){
                    t_max = max
                }
                if(min < t_min){
                    t_min = min
                }
            })
            t_min = Math.floor(t_min - defaultObj.yAxis.avg)
            t_max = Math.ceil(t_max + defaultObj.yAxis.avg)
            if(t_min == 100000 - defaultObj.yAxis.avg ) t_min = 0
            if(t_min<0) t_min = 0
            if(t_max<=5) t_max = 250
            if(t_max <= t_min){
                t_max = 250;
                t_min = 0;
            } 
            defaultObj = {
                ...defaultObj.series,
                'yAxis':{
                    ...defaultObj.yAxis.avg,
                    line:{ 
                        max:t_max,
                        min:t_min
                    }
                }
            }

            const t_echartList = { 
                xArr:t_xArr,
                yArr:t_yArr
            }   

            // 相对来说, react的组件内部的状态是异步的。并不能立即执行
            // 表示图表 
            setIsShowCharts(true)
            drawContentRight(t_echartList,t_echartNamesList); 
            setIsLoading(false)
        }).catch(err=>{  
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        })
    }

    // 选择日期
    const onSelectDate = (date,dateString)=>{

        const fixDateString = dateString  + afterFix;

        const params = {
            ...searchTxtObj,
            time:fixDateString
        }
        setSearchTxtObj(params) 
    }

    
    // 显示的图表
    const drawContentRight = (t_echartList,echartNamesList ) =>{
                
    // 基于准备好的dom，初始化echarts实例
        let mode = 'light' 
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-top'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartTop)  myChartTop = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartTop = echarts.init(document.getElementById('bottom-echart-top'),'light');
          

        const colors = ['#5470C6', '#91CC75', '#EE6666'];
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '各站点年雨量明细图', 
                left:'center',
                top: 0,
                // 文字颜色
                textStyle: {
                    color: '#b8b8b8'
                    // ...
                },
            },
            tooltip: { 
                // axios | none 
                axisPointer: {
                    type: 'line' 
                },
                trigger: 'axis',
                // formatter: function(params){    // 垂直排列
                //     let newParams = [];
                //     let tooltipString = [];
                //     newParams = [...params];
                //     newParams.sort((a,b) => {return b.value - a.value});
                //     newParams.forEach((p) => {
                //         const cont = p.marker + ' ' + p.seriesName + ': ' + p.value + '<br/>';
                //         tooltipString.push(cont);
                //     });
                //     return tooltipString.join('');
                // }
            },
            legend: {
                orient:'vertical',
                top:'center',
                right:0,
                data: echartNamesList,
                // 文字颜色
                textStyle: {
                    color: '#b8b8b8'
                    // ...
                },
            },
            // 背景色
            // backgroundColor: {
            //     type: 'radial', 
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: '#112041'
            //       },
            //     //   {
            //     //     offset: 1,
            //     //     color: '#cdd0d5'
            //     //   }
            //     ]
            //   },
            grid: {
                top: 30,
                bottom: 20,
                left:60,
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',   
                right: 100,
                top: -7,  
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
            calculable: true,
            xAxis: {
                    type: 'category', 
                    position:'bottom',
                    min:0,
                    max:12,
                    name: '日期', 
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,0],  
                     },
                    data: t_echartList.xArr,
                    
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    }, 
    	            boundaryGap: false // 不留白，从原点开始
            },
            yAxis:[
                {
                    type: 'value',
                    splitLine:{
                        show:true,
                        color:'#6E7079',
                    },   // 去除分割线
                    min:0,
                    max:250,
                    ...defaultObj.yAxis.line,
                    name: '降水量(/毫米)',
                    position: 'left',             // 纵轴线
                     
                    axisLine: {
                        show: true,  
                        symbol:["none","arrow"],    //轴线箭头
                        symbolOffset:[0,18],
                        lineStyle:{ 
                          color:'#6E7079',
                          shadowOffsetY:-18,	//利用阴影进行延长 ！！！
                          shadowColor:'#6E7079'
                        } 
                    },  
                    axisTick: { 
                        // alignWithLabel: false,   // 清除刻度线
                        length: 8,//刻度线的长度
                        interval: 1,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },  
                    axisLabel: {             // 纵轴刻度标签
                        interval: 0,
                        show: true,
                        textStyle: { 
                            fontFamily: "微软雅黑",
                            fontSize: 12
                        },
                        formatter: '{value}'
                    },   
    	            boundaryGap: false // 不留白，从原点开始
                },
                // {
                //     type: 'value',
                //     min:0,
                //     max:250,
                //     ...defaultObj.yAxis.line,
                //     name:"水位(/米)",
                //     position: 'right',
                //     alignTicks: true,
                //     axisLine: {
                //         show: true,
                //         lineStyle: {
                //         color: colors[0]
                //         }
                //     },
                //     axisLabel: {
                //         formatter: '{value}'
                //     }
                // }
            ],
            series: t_echartList.yArr 
        };  
 
        // 使用刚指定的配置项和数据显示图表。
        myChartTop.setOption(option); 
        setMyChartTopRes(myChartTop)
        
        // 修正位置 
        if(echartTopNodeRef.current){ 
            echartTopNodeRef.current.style.cssText = "width:90%!important;height:90%!important";
        }  
        if(myChartTop) myChartTop.resize()
    }


    return (
        <div className='dayRainChart1-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'> 
                    <div className='date-div'>
                        <span>查询年份：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true} onChange={onSelectDate} defaultValue={defaultValue}  picker="year" placeholder="请选择日期"/>
                    </div> 
                    <Button type="default" shape="round"  onClick={onSearchChart}  size='default' icon={<SearchOutlined />}/>
                </div>
                <div className='top-right'>  
                    <div className='top-title'>年雨量明细图</div>
                </div>
                 
            </div>
            <div className='body-bottom-div'>   
                <Spin spinning={isLoading} style={{display:isLoading ? "flex" : 'none'}}> </Spin>
                {/* <Table dataSource={dataSource} columns={columns} />; */}
                {
                    !isShowCharts
                    ?<Empty  style={{zIndex:1}}/>
                    :<div id='bottom-echart-top' style={{width:'1200px',height:'500px'}} ref={echartTopNodeRef}></div>
                } 
            </div>
        </div>
    )
}

export default WhouseChange;