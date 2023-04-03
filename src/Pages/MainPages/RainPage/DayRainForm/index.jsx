import React,{useEffect,useState,useRef} from 'react' ;
import { DatePicker , Button,Empty ,Table } from 'antd';
import moment from 'moment'
import { SearchOutlined,DownloadOutlined,PrinterOutlined } from '@ant-design/icons';
import { getDayRainForm } from 'Services/Home/search';
import { MessageTool } from 'Components/Tools/MessageTool';  
import { OutputExcel } from 'Components/Tools/OutputExcel';  
import { OutputPrint } from 'Components/Tools/OutputPrint';   

import Common from 'Common';
import Tools from 'Components/Tools/TablesData' 
import { changeMomentType} from 'Utils'
import './index.less';
  

function DayRainForm(){  
    // 端点编码
    let typeList  = []  
    let afterObj =  {stcd:''}
    // 默认后缀
    const afterFix =  ' 00:00:00'
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({})   
    // 默认日期
    // const [defaultStartValue,setDefaultStartValue] = useState(moment(' 00:00:00', 'HH:mm:ss'))
    // const [defaultEndValue,setDefaultEndValue] = useState(moment(moment().format("HH:mm:ss "), 'HH:mm:ss'))
    

    const [defaultStartValue,setDefaultStartValue] = useState(changeMomentType(moment,'YYYY-MM-DD HH').subtract(2,'day'))
    const [defaultEndValue,setDefaultEndValue] = useState(moment())

    // 加载中
    const [isLoading,setIsLoading] = useState(false)
    // 表格表头，和行列数据。
    const [columns,setColumns] = useState([])  
    const [dataSource,setDataSource] = useState([])  
    // 行列表格
    const [colArr,setColArr] = useState([])
    const [rowArr,setRowArr] = useState([])
    // 列数据（不含顶部栏的表头）
    let rowTitleArr  =  [ 
        {month:'最大日降雨量'},
        {month:'累计下雨天数'},
        {month:'累计下雨>20mm天'},
        {month:'累计降雨量'},
        {month:'发生时间'}, 
    ]

    // 图表节点
    // const echartNodeRef = useRef();
    // const [isShowCharts,setIsShowCharts] = useState(false)
    // const [echartNamesList,setEchartNamesList] = useState([])
    // const [echartList,setEchartList] = useState({
    //     xArr:[],
    //     yArr:[]
    // }) 
    // const defaultObj = { 
    //     type: 'bar',
    //     markPoint: {
    //         data: [
    //           { type: 'max', name: 'Max' },
    //           { type: 'min', name: 'Min' }
    //         ]
    //     },
    // }
 
      
    // 初始化加载
    useEffect(()=>{
        try{ 
            // 获取平均雨量
            let stcdString = ''  
            let t_columns = [
                {
                    title:'日期',
                    dataIndex:'month',
                    key:'month',
                    width:250
                }
            ];
            let t_echartNamesList = []
            let t_colArr = ['日期'] 
            let t_rowArr = ['日期'] 

            // （1.遍历列表头数据
            Common.rainData.forEach((item,index)=>{ 
                if(index == 0){ 
                    stcdString += item.stcd
                }else{ 
                    stcdString =  stcdString  + ',' + item.stcd 
                }
                t_columns.push({
                    title:item.stnm+'(毫米)',
                    dataIndex:item.stcd,
                    key:item.stcd,
                }) 
                t_colArr.push(item.stnm+'(毫米)')
            })    
            // 闸室水位
            t_columns.push({
                title:'闸室水位(米)',
                dataIndex:'zsrz',
                key:'zsrz',
            }) 
            t_colArr.push('闸室水位(米)')
            // 闸室库容
            t_columns.push({
                title:'库容(万立方米)',
                dataIndex:'zsw',
                key:'zsw',
            }) 
            t_colArr.push('库容(万立方米)')

            // （2.遍历行表头数据
            rowTitleArr.forEach(item=>{
                t_rowArr.push(item.month)
            })

            // 默认搜索的站点
            afterObj = {
                stcd:stcdString
            }
            typeList = Common.rainData
 
            setColArr(t_colArr) 
            setRowArr(t_rowArr) 
            setColumns(t_columns) 

            // 设置默认日期 ，开启搜索(日期已经有默认值)
            // YYYY-MM-DD HH:mm:ss
            let startTime = changeMomentType(moment,'YYYY-MM-DD').subtract(2,'day').format('YYYY-MM-DD')+afterFix;
            let endTime = moment().format('YYYY-MM-DD')+afterFix ;

            // 处理1日的数据
            // if(parseInt(moment().format('DD')) == 1){
            //     endTime = moment().format('YYYY-MM-02')+afterFix ;
            // }
            
            onSelectStartDate(null,startTime)
            onSelectEndDate(null,endTime)

            let paramsObj ={ startTime, endTime, stcd:stcdString }
            setSearchTxtObj(paramsObj) 
            onSearchTable(null, paramsObj)  
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])


    //   搜索按钮
    const onSearchTable = (e, initData = null)=>{
        let verifyParams =  initData ? initData :searchTxtObj 
        if(!verifyParams.startTime || verifyParams.startTime.startsWith(":") ){   
            MessageTool('请选择开始日期','warning')
            return;
        }else if(!verifyParams.endTime || verifyParams.endTime.startsWith(":") ){   
            MessageTool('请选择结束日期','warning')
            return;
        }else if(verifyParams.endTime  < verifyParams.startTime){   
            MessageTool('开始日期不能大于结束日期','warning')
            return;
        }
 
        // 1.温馨提示
        // setTimeout(()=>{
        //     MessageTool("温馨提示:当前数据量大！请耐心等待",'info')
        // },1000)

        // 2.获取远程数据
        let paramsObj = null
        if(  initData){
            paramsObj = initData
        }else{
            paramsObj = searchTxtObj  
        }   
        
        setIsLoading(true)
        getDayRainForm(paramsObj).then(res=>{
            // console.log("getDayRainForm返回的数据是",res,res.data) 

            // 空值检测
            if(res.data.datas.length == 0){
                setIsLoading(false)
                setDataSource([])
                return;
            }
            
             // （2.遍历行表头数据
             let new_data1 = res.data.datas.sort(); 
             let t_rowArr = [];
             let t_t_rowArr = [];
             let t_rowTitleArr = [];
             new_data1.forEach(item=>{
                 var name = item.tm.slice(0,4) +'年' + item.tm.slice(5,7) + '月' + item.tm.slice(8,10) + '日' ;
                t_t_rowArr.push(name);
            })  
            t_t_rowArr = [...new Set(t_t_rowArr)]
            t_t_rowArr = [...new Set(t_t_rowArr)].sort()
            rowTitleArr.forEach(item=>{ 
                t_t_rowArr.push(item.month)
            }) 
            t_t_rowArr.forEach(item=>{
                t_rowTitleArr.push({month:item})
            }) 
            setRowArr(t_t_rowArr)  
            rowTitleArr = t_rowTitleArr
  
            setIsLoading(false)
            // let prefix = paramsObj.startTime.slice(0,4)
            let prefix = ''
            let rowLen = t_rowTitleArr.length;
 
            let t_dataResource = Tools.handleDayRainTableDataY(typeList,res.data,rowLen,10,rowTitleArr,prefix)  
            setDataSource(t_dataResource)
        }).catch(err=>{ 
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        }) 
    }

    // 选择日期
    const onSelectStartDate = (date,dateString)=>{
        const fixDateString = dateString + afterFix; 
        const params = {
            ...searchTxtObj,
            startTime:fixDateString
        }
        setSearchTxtObj(params) 
    }
    const onSelectEndDate = (date,dateString)=>{
        const fixDateString = dateString + afterFix; 
        const params = {
            ...searchTxtObj,
            endTime:fixDateString
        }
        setSearchTxtObj(params) 
    }

    // 导出Excel
    const handleOutput = (mode)=>{ 
        if(!dataSource || !dataSource.length){
            MessageTool("请等待当前数据加载！",'warning')
            return;
        }
  
        // 表格是隐藏表格（目的是为了良好的用户体验）
        const outputTableId = 'outTable-div'
        const excelFileName = `山口岩水库日雨量明细报表((${searchTxtObj.endTime.slice(0,4)}))`;

        // 获取行列表头数据    
        // let rowArr = ['日期','1日','2日','3日','4日','5日','6日','7日','8日','9日','10日','11日','12日']
        // let colArr = ['日期','王狗冲','老庵里','新泉站（雨量）','西江口','张佳坊','闸室','新泉站','厂房']

        // 删除的行数据, 从1开始
        const deleteRow = null
        const deleteCol = null
        
        const rLen = rowArr.length;
        const rowMergesArr =  [
            // {s: {r: rLen - 2, c: 1}, e: {r: rLen - 2, c: 2}}, 
            // {s: {r: rLen - 2, c: 3}, e: {r: rLen - 2, c: 4}}, 
            // {s: {r: rLen - 2, c: 5}, e: {r: rLen - 2, c: 6}}, 

            // {s: {r: rLen, c: 1}, e: {r: rLen, c: 2}}, 
            // {s: {r: rLen, c: 3}, e: {r: rLen, c: 4}}, 
            // {s: {r: rLen, c: 5}, e: {r: rLen, c: 6}}, 
        ] 
        const appendBottom = '降雨量单位：毫米,查询年份：'+searchTxtObj.endTime.slice(0,4)+'年'
       

        if(mode == 'excel'){ 
            OutputExcel(outputTableId,excelFileName,rowArr,colArr,deleteRow,deleteCol,rowMergesArr,appendBottom)
        }else{ 
            OutputPrint(outputTableId,excelFileName,rowArr,colArr,deleteRow,deleteCol,rowMergesArr,appendBottom)
        } 
    }
     


    return (
        <div className='dayRainChart-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'>  
                    <div className='date-div table-div'>
                        <span>开始日期：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true}  onChange={onSelectStartDate} picker="day"   defaultValue={defaultStartValue}  placeholder="请选择" />
                    </div>     
                    <div className='date-div table-div'>
                        <span>结束日期：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true}  onChange={onSelectEndDate} picker="day"   defaultValue={defaultEndValue}  placeholder="请选择"  />
                    </div>              
                    <Button type="default" shape="round"  onClick={onSearchTable}  size='default' icon={<SearchOutlined />}/>
                </div>
                <div className='top-right'>  
                    <div className='top-title'>分日雨量明细报表</div>
                    <Button type="default" onClick={()=>handleOutput("excel")} shape="round" size='default' icon={<DownloadOutlined  />}>导出Excel</Button>
                    <Button type="default" onClick={()=>handleOutput("print")} shape="round" size='default' icon={<PrinterOutlined  />}>打印报表</Button>
                </div> 
            </div>
            <div className='body-bottom-div'>  
                <Table dataSource={dataSource} columns={columns} loading={isLoading}   />  
                <Table dataSource={dataSource} columns={columns}  id="outTable-div" pagination={false} style={{'display':"none"}}/>  
                {/* <img src={bgEmpty} className="empty-img-div" style={{display:isLoading ? 'block' : 'none'}} /> */}
            </div>
        </div>
    )
}

export default DayRainForm;