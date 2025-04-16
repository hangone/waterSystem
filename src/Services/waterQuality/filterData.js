import axios from 'axios';

export const filterData = async () => {
  try {
    const response = await axios.get(`https://water-api.hangyi.top/waterpub_filter`);
    const data = response.data;
    const result = {};
    for (const key in data) {
      const item = data[key];
      for (const subKey in item) {
        const subItem = item[subKey];
        if (typeof subItem === 'object' && subItem !== null) {
          for (const subSubKey in subItem) {
            if (subSubKey === 'location') {
              const location = subItem[subSubKey];
              if (!result.hasOwnProperty(location)) {
                result[location] = {};
              }
            } else if (subSubKey === 'ph值') {
              const location = subItem['provincech'] + subItem['citych'] + subItem['rivername'];
              if (!result.hasOwnProperty(location)) {
                result[location] = {};
              }
              result[location]['pH值'] = {
                'location': location,
                'data': subItem[subSubKey]
              };
            } else if (subSubKey === '五日生化需氧量') {
              const location = subItem['provincech'] + subItem['citych'] + subItem['rivername'];
              if (!result.hasOwnProperty(location)) {
                result[location] = {};
              }
              result[location]['五日生化需氧量'] = {
                'location': location,
                'data': subItem[subSubKey]
              };
            }
          }
        }
      }
    }
    return result;
  } catch (error) {
    throw new Error('获取水质数据失败，请稍后再试');
  }
};