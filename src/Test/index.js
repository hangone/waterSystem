 let a = '08'

 function setCetl(data){ 
    let arr = data.split(":")
    if(arr.length != 2){
        return null;
    } 
    if(parseInt(arr[1])>=30){
        arr[1] = '30'
    }else{ 
        arr[1] = '00'
    }
    return arr.join(':');
 }

 console.log(setCetl(a))