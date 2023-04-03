import axios from 'axios'; 
import Common from 'Common'  
import qs from 'querystring' 
import { getLogout } from 'Services/User/user'; 
 
const baseURL1 = Common.defaultDomain.domain;


// 设置超时时间 
const timeout1 = 5*60*1000; 
//  设置headers
const headers = {
  'Content-Type': 'application/json',

  // 因为后端的没有制作完整的jwt方案，因此用不上
  'token':localStorage.getItem("water_token") ? localStorage.getItem("water_token") :''
}

// 没有设置拦截器， 可以直接使用axios的请求方法
// export const api = (data={})=>{
//   return axios.create({
//       baseURL ,
//       timeout , 
//       headers ,
//       data,
//       responseType: 'json', 
//   });
// }  

// 设置拦截器，在请求前将config添加headers
export const request = (config,baseURL=baseURL1,timeout=timeout1)=>{
   const instance = axios.create({
     baseURL,
     timeout
   })

   // 请求拦截器
   instance.interceptors.request.use(config=>{

      let water_token = window.localStorage.getItem("water_token")
      // 如果 water_token在2秒内有数据，就会重新发起请求
      if(!water_token){ 
         setTimeout(()=>{ 
            water_token =  window.localStorage.getItem("water_token");
            config.headers.token = water_token
            if(!water_token) console.log("当前没有token");
            return config
         },2000)
      }else{  
         config.headers.token = water_token;
         return config
      }   
       
   },err=>{
       console.log("请求出错啦！",err)
   })

    // 响应拦截器
    instance.interceptors.response.use(res=>{  

      let pre_data = res.data ? res.data : res;
      if(pre_data.state != undefined &&  pre_data.state == false){ 
         // getLogout();
         // setTimeout(()=>{
         //    // window.location.href = "/login" 
         // },500)

         // 清空当前域的token
         getLogout(); 
         // 向parent的iframe传递token;
         window.parent.postMessage('token失效','*') 
      }

      return res.data ? res.data : res;
    },err=>{  

       console.log("响应出错啦！",err)
    })

    return instance(config)
}
 
// 封装axios,添加原生的axios请求
// 可以直接使用默认的方法，一般用于传递列表使用
export const http = (options,baseURL = baseURL1)=>{
  const url = options.url ? options.url : ''
  const data = options.data ? options.data : {}
  let method = options.method ? options.method : 'post'
  method = method.toLowerCase()
  let axiosObj = null
  if(method == 'post'){
     axiosObj = axios.post(baseURL + url,headers,data) 
  }else if(method == 'post'){
  axiosObj = axios.post(baseURL + url,headers,data) 
  }else if(method == 'get'){
     axiosObj = axios.post(baseURL + url,headers,data) 
  }else if(method == 'put'){
     axiosObj = axios.post(baseURL + url,headers,data) 
  }else if(method == 'putch'){
      axiosObj = axios.post(baseURL + url,headers,data) 
  }else if(method == 'delete'){
      axiosObj = axios.post(baseURL + url,headers,data) 
  }else  {
      console.log("http出错")
  }
  return axiosObj;
}
