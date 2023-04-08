import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const SearchAddress = ({ addressName, changeAddressName, changePosition }) => {
  const [positionList, setPositionList] = useState([]);

  const onSearch = (val) => {
  console.log(val)
  let placeSearch = new window.AMap.PlaceSearch({
    pageSize: 10,
    pageIndex: 1,
    city: '南昌',
  });

  placeSearch.search(val, (status, result) => {
    console.log(val,status,result)
    if (status === 'complete' && result.info === 'OK') {
      const {
        poiList: { pois },
      } = result;
      if (pois && Array.isArray(pois)) {
        setPositionList(pois);
        console.log(pois); // added console.log
      }
    }
  });
};

  const debounce = (fn, time) => {
    let timerId = null;
    return function (val) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      timerId = setTimeout(() => {
        fn.call(this, val);
      }, time);
    };
  };

  const onChange = (id) => {
    for (const item of positionList) {
      const { name: itemName, id: itemId } = item;
      if (itemId === id) {
        const {
          location: { lng, lat },
        } = item;
        const position = { lng, lat };
        changePosition(position);
        changeAddressName(itemName);
      }
    }
  };

  return (
    <div>
      <Select
        value={addressName}
        style={{ width: 400 }}
        showSearch
        placeholder="请输入断面地址"
        onSearch={debounce((val) => onSearch(val), 300)}
        onChange={onChange}
        optionFilterProp="children"
      >
        {positionList.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SearchAddress;
