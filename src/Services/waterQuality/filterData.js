import axios from 'axios';

export const getWaterQualityData = async (query = '') => {
  let areaId = '';
  let riverId = '';
  let searchName = '';
  let page = 1;
  if (typeof query === 'string') {
    searchName = query;
  } else if (typeof query === 'number') {
    areaId = query;
  } else {
    throw new Error('请提供有效的查询数据！');
  }
  try {
    const response = await axios.get(`https://water.miraitowa.tk/data?areaId=${areaId}&riverId=${riverId}&searchName=${searchName}&page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error('获取水质数据失败，请稍后再试');
  }
};
