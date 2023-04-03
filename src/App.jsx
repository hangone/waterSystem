import {Route,Link} from 'react-router-dom' 
import React,{Suspense} from 'react';
import  DocumentTitle from 'react-document-title' 
import {routerMap} from './Router/index'
import {Spin} from 'antd'
 

function App() {  
  return ( 
      <div className="App">   
         <Suspense fallback={<Spin className='mask-spin'/>}>
           {
             routerMap.map((item,index)=>{
               return (  
                  <Route path={item.path} component={item.component} exact={item.exact} key={index}></Route> 
               )
             })
           }
           </Suspense>
      </div> 
  );
}

export default App;
