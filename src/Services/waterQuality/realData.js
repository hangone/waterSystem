import axios from 'axios';

export const filterData = async () => {
  try {
    const response = await axios.get(`https://water.miraitowa.tk/realtimeData`);
    const data = response.data
    return data;
  } catch (error) {
    throw new Error('获取水质数据失败，请稍后再试');
  }
};
// Call filterData every 10 seconds
//setInterval(filterData, 10000);