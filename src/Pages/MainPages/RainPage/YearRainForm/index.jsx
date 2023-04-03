import React,{useEffect,useState,useRef} from 'react' ;
import { DatePicker, Button,Empty ,Table } from 'antd';
import moment from 'moment'
import { SearchOutlined,DownloadOutlined,PrinterOutlined } from '@ant-design/icons';
import { getYearRainForm } from 'Services/Home/search';
import { MessageTool } from 'Components/Tools/MessageTool';  
import { OutputExcel } from 'Components/Tools/OutputExcel';  
import { OutputPrint } from 'Components/Tools/OutputPrint';   

import Common from 'Common';
import Tools from 'Components/Tools/TablesData' 
import './index.less';
  

function DayRainForm(){  
    // 端点编码
    let typeList  = []  
    let afterObj =  {stcd:''}
    // 默认后缀
    const afterFix =  '-00-00 00:00:00'
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({
        time:moment().format("YYYY") + afterFix
    })  
    // 默认日期
    const [defaultValue,setDefaultValue] = useState(moment())
    
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
        {month:'最大日雨量'},
        {month:'累计下雨天数'},
        {month:'累计下雨>20mm天'},
        {month:'累计降雨量'},  
        {month:'发生时间'},  
    ]

 
    // 初始化加载
    useEffect(()=>{
        try{ 
            // 获取平均雨量
            let stcdString = ''  
            let t_columns = [
                {
                    title:'月份',
                    dataIndex:'month',
                    key:'month',
                    width:100
                }
            ];
            let t_echartNamesList = []
            let t_colArr = ['月份'] 
            let t_rowArr = ['月份'] 

            // （1.遍历列表头数据
            Common.rainData.forEach((item,index)=>{ 
                if(index == 0){ 
                    stcdString += item.stcd
                }else{ 
                    stcdString =  stcdString  + ',' + item.stcd 
                }
                t_columns.push({
                    title:item.stnm+"(毫米)",
                    dataIndex:item.stcd,
                    key:item.stcd,
                    width:160,
                }) 
                t_colArr.push(item.stnm+"(毫米)")
            })    
            // 平均降雨量
            t_columns.push({
                title:'平均雨量(毫米)',
                dataIndex:'avgmap',
                key:'avgmap',
                width:200,
            }) 
            t_colArr.push('平均雨量(毫米)')

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
            onSelectDate(null,moment().format('YYYY'))
            setSearchTxtObj({
                ...searchTxtObj,
                stcd:stcdString
            }) 
            onSearchTable({
                ...searchTxtObj,
                stcd:stcdString
            })  
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])


    //   搜索按钮
    const onSearchTable = (initData = null)=>{
        if(!searchTxtObj.time && !initData){   
            MessageTool('请选择月份','warning')
            return;
        }  
 
        // 1.温馨提示
        // setTimeout(()=>{
        //     MessageTool("温馨提示:当前数据量大！请耐心等待",'info')
        // },1000)

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
        getYearRainForm(paramsObj).then(res=>{
            // console.log("getYearRainForm返回的数据是",res,res.data)

            // 空值检测
            if(res.data.datas.length == 0){
                setIsLoading(false)
                setDataSource([])
                return;
            }

            let rowLen = Math.floor(res.data.datas.length / 6);
            
            // （2.遍历行表头数据
            let t_rowTitleArr = [];
            for(let i=0;i<rowLen ;i++){
                t_rowTitleArr.push({month:(i+1)+'月'})
            }
            rowTitleArr = [...t_rowTitleArr,...rowTitleArr]
            let t_rowArr = []
            rowTitleArr.forEach(item=>{
                t_rowArr.push(item.month)
            }) 
            setRowArr(t_rowArr)
 
            setIsLoading(false)
            let prefix = paramsObj.time.slice(0,4)
            let t_dataResource = Tools.handleYearRainTableDataY(typeList,res.data,rowLen,7,rowTitleArr,prefix)  
            setDataSource(t_dataResource)
        }).catch(err=>{ 
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        }) 
    }

    // 选择月期
    const onSelectDate = (date,dateString)=>{
        const fixDateString = dateString + afterFix; 
        const params = {
            ...searchTxtObj,
            time:fixDateString
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
        const excelFileName = `山口岩水库年雨量明细报表(${searchTxtObj.time.slice(0,4)} )`;

        // 获取行列表头数据    
        // let rowArr = ['月份','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        // let colArr = ['月份','王狗冲','老庵里','新泉站（雨量）','西江口','张佳坊','闸室','新泉站','厂房']

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
        const appendBottom = '降雨量单位：毫米,查询年份：'+searchTxtObj.time.slice(0,4)+'年'
       
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
                    <div className='date-div'>
                        <span>查询年份：</span>  
                        <DatePicker allowClear={false} inputReadOnly={true} onChange={onSelectDate} defaultValue={defaultValue}  picker="year" placeholder="请选择年份"/>
                    </div>
                    <Button type="default" shape="round"  onClick={onSearchTable}  size='default' icon={<SearchOutlined />}/>
                </div>
                <div className='top-right'>  
                    <div className='top-title'>全年雨量明细报表</div>
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