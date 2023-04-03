import React,{useEffect,useState,useRef} from 'react' ;
import { TimePicker  , Button,Empty ,Menu, Dropdown ,Spin , Input, Form} from 'antd';
import moment from 'moment'
import { SearchOutlined,LoadingOutlined} from '@ant-design/icons';
import { getOutflowBlockData,updateOutflowBlockData } from 'Services/Home/reset';
import { MessageTool } from 'Components/Tools/MessageTool';   
import { ceilHalfMinute,changeMomentType} from 'Utils' 
 
import './index.less';
  

const formItemLayout = {
  labelCol: {
      xs: {
      span: 24,
      },
      sm: {
      span: 4,
      },
  },
  wrapperCol: {
      xs: {
      span: 24,
      },
      sm: {
      span: 20,
      },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
      xs: {
      span: 24,
      offset: 0,
      },
      sm: {
      span: 16,
      offset: 8,
      },
  },
};

function DayRainForm(){  
    // 端点编码
    let typeList  = []  
    let afterObj =  {stcd:''}
    // 默认后缀
    const afterFix =  ':00';
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({ })   
    // 默认日期
    // const [defaultStartValue,setDefaultStartValue] = useState(moment(' 00:00:00', 'HH:mm:ss'))
    // const [defaultEndValue,setDefaultEndValue] = useState(moment(moment().format("HH:mm:ss "), 'HH:mm:ss'))
    

    const [defaultStartValue,setDefaultStartValue] = useState(
      moment(ceilHalfMinute(changeMomentType(moment,'HH:mm').subtract(30,'minutes').format("HH:mm")),'HH:mm')
    )
    const [defaultEndValue,setDefaultEndValue] = useState(
      moment(ceilHalfMinute(changeMomentType(moment,'HH:mm').format("HH:mm")),'HH:mm')
    )

  // 表格是否扩展
  const [activeMenuName,setActiveMenuName] = useState('出库流量' ) 

  // 用户信息 
  const [data, setData] = useState([]);
  // 是否显示表格信息
  const [isShowTable,setIsShowTable] = useState(false);
  // 表单信息
  const [form] = Form.useForm(); 
 
 
  // 是否有数据
  const [isHaveData,setIsHaveData] = useState(false)
  const [editDataObj,setEditDataObj] = useState([])
  const [isSubmit,setIsSubmit] = useState(false)
      
    // 初始化加载
    useEffect(()=>{
        try{ 
  
            // // 设置默认日期 ，开启搜索(日期已经有默认值)
            // // YYYY-MM-DD HH:mm:ss
            let startTime = ceilHalfMinute(changeMomentType(moment,'HH:mm').subtract(30,'minutes').format("HH:mm"))+afterFix;
            // 设置成当前具体时间 
            let endTime = ceilHalfMinute(changeMomentType(moment,'HH:mm').format("HH:mm"))+afterFix ;
  
 
            onSelectStartDate(null,startTime)
            onSelectEndDate(null,endTime)

            let paramsObj ={ startTime, endTime  }  
            setSearchTxtObj(paramsObj)

            onSearchTable(null,paramsObj)  
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])
 
    //   搜索按钮
    const onSearchTable = (e, initData = null)=>{
      const data = {
        time:initData ? initData.startTime : searchTxtObj.startTime
      }
      // 指定时间，到当前的
      getOutflowBlockData(data).then(res=>{ 
         setEditDataObj(res.data)
         setIsHaveData(true);
      }).catch(e=>{ 
        setIsHaveData(false);
        MessageTool("获取数据异常!",'error');
        console.log("出现异常",e);
      })
    } 
    // 选择日期
    const onSelectStartDate = (e,dateString )=>{ 
      dateString = dateString && dateString.length > 5 ? dateString.slice(0,5) :dateString
      const fixDateString = dateString ? ceilHalfMinute(dateString ) : dateString; 
      let  startTime = fixDateString+afterFix
      
      // 改变默认的日期  
      setDefaultStartValue(moment(fixDateString,"HH:mm")) 

      // 如果e不为空，则联动数据的修改
      if(e){
          let endTime = moment(fixDateString,"HH:mm").add(30,'minutes').format("HH:mm")+afterFix 
          console.log(endTime)
          onSelectEndDate(null,endTime);
          // 进行数据的请求
          let data = {  startTime ,endTime  } 
          console.log(data)
          setSearchTxtObj(data)

          onSearchTable(null,data);
      }
    }
    const onSelectEndDate = (e,dateString)=>{ 
        dateString = dateString && dateString.length > 5 ? dateString.slice(0,5) :dateString
        const fixDateString = dateString ? ceilHalfMinute(dateString ) : dateString; 
        let endTime = fixDateString+afterFix 

        // 改变默认的日期  
        setDefaultEndValue(moment(fixDateString,"HH:mm")) 

        // 如果e不为空，则联动数据的修改
        if(e){
          let startTime = moment(fixDateString,"HH:mm").subtract(30,'minutes').format("HH:mm")+afterFix 
          console.log(startTime)
          onSelectStartDate(null,startTime);
          // 进行数据的请求
           let data = {  startTime,endTime  } 
           console.log(data)
           setSearchTxtObj(data)
 
           onSearchTable(null,data);
        }
    } 
    // 设置表格扩展类型
    const onSelectDropdown = (name)=>{ 
        // 获取结束日期的时间
        let endTime = searchTxtObj.endTime.slice(0,15)
 
        switch(name){
            case '出库流量': 
                setActiveMenuName("出库流量") 
                // preTime = moment(endTime).subtract(12,'hours').format('YYYY-MM-DD HH')
                // preTime = initTime
                // setDefaultStartValue(moment(preTime)) 
                break; 
            default:
                console.log("选错了") 
                break;
        } 
   }   
  
    //  确认提交（修改的表单信息）
    const onFinish = (values) => {  
      if(isSubmit){
        MessageTool("当前已经在提交表单数据！",'warning')
        return
      }
      setIsSubmit(true)
      let data = Object.keys(values).map(key=>{
        return {
          'id':parseInt(key),
          'flow':values[key]
        }
      }) 

      updateOutflowBlockData({},{data},'post').then(res=>{ 
         if(res.message == '修改成功！'){
           MessageTool('修改数据成功!','success');
         }else{ 
           MessageTool('修改数据失败!','error');
         } 
          setIsSubmit(false)
      }).catch(err=>{ 
          console.log('修改数据出现异常:', err);
          MessageTool('修改数据出现异常!','error');  
          setIsSubmit(false)
      })
    };


    return (
        <div id='current-div' className='dayRainChart-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'>  
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>开始时间：</span> 
                        <TimePicker  allowClear={false} format="HH:mm" inputReadOnly={true}  onChange={onSelectStartDate} picker="day" showTime value={defaultStartValue}   placeholder="请选择"/>
                    </div>     
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>结束时间：</span> 
                        <TimePicker  allowClear={false} format="HH:mm" inputReadOnly={true}  onChange={onSelectEndDate} picker="day" showTime  value={defaultEndValue}   placeholder="请选择"/>
                    </div>              
                    
                    <div className='table-mode-div'> 
                        <div>修改类型：</div>
                        <Dropdown overlay={
                                <Menu>      
                                        <Menu.Item onClick={()=>onSelectDropdown('出库流量')}>
                                            <div > 出库流量 </div>
                                        </Menu.Item>   
                                </Menu>
                                } placement="bottomLeft">
                                    <Button type='default'>{activeMenuName}</Button>
                        </Dropdown>
                    </div>
                    <Button type="default" shape="round"  onClick={onSearchTable}  size='default' icon={<SearchOutlined />}/>
                </div>
                <div className='top-right'>  
                    <div className='top-title'>今日数据修正</div> 
                </div> 
            </div> 
            <div className='body-bottom-div'>   
                 {
                   isHaveData
                   ? <Form id='edit-div' {...formItemLayout} form={form} className="theme-box"
                 name="register" onFinish={onFinish} scrollToFirstError>   
                    {
                      editDataObj.time.map((item,index)=>{ 
                          return   (
                              <Form.Item name={editDataObj.id[index]}  initialValue={editDataObj.flow[index]}  label={editDataObj.time[index]} 
                                className="form-item" key={index} >
                                 <Input autocomplete="new-password" placeholder='请输入数据'/>
                              </Form.Item>
                           ) 
                      }) 
                    }
                     <Form.Item {...tailFormItemLayout} className="submitBtn"> 
                        <Button type="primary" htmlType="submit" disabled={isSubmit}>
                              提交修改 
                              { isSubmit  ? <Spin indicator={ <LoadingOutlined />}/> :''  }
                        </Button>  
                     </Form.Item> 
                     <small style={{'color':'red'}}>注意：只能修改早上8点到当前的时间！！！</small>
                 </Form>
                   : <Empty />
                 }
                
            </div>
        </div>
    )
}

export default DayRainForm;