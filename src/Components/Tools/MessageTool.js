

import {message} from 'antd';

export const MessageTool = (msg,type,key=null,icon=null,duration=1500)=>{ 
    message.destroy()
    if(type == 'success'){ 
        message.success({content:msg,key,icon,duration})
    }else if(type == 'error'){  
        message.error({content:msg,key,icon,duration})
    }else if(type == 'warning'){  
        message.warning({content:msg,key,icon,duration})
    }else if(type == 'info'){  
        message.info({content:msg,key,icon,duration})
    }else if(type == 'loading'){  
        message.loading({content:msg,key,icon,duration})
    }
    setTimeout(()=>{ 
        message.destroy() 
    },duration)   
}

export const MessageToolClear= ()=>{ 
    message.destroy()
}