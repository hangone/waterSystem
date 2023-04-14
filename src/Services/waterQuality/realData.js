import axios from 'axios';

export const realData = async () => {
  try {
    const response = await axios.get(`https://water.miraitowa.tk/realtimeData`);
    const data = response.data
    let arr = [];
  for (let i = 0; i < data.length; i++) {
    let obj = {
      update_time: data[i].update_time,
      temperature: data[i].temperature,
    };
    arr.push(obj);
  }
  return arr; 
  } catch (error) {
    throw new Error('获取水质数据失败，请稍后再试');
  }
};


// Call filterData every 10 seconds
// setInterval(realData, 10000);