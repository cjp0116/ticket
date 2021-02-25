import { useState, useEffect } from 'react';

const useLocalStorage = (key, initVal = null) => {
  const initialValue = localStorage.getItem(key) || initVal;
  const [item, setItem] = useState(initialValue);
  useEffect(() => {
    if(!item) {
      localStorage.removeItem(item)
    } else {
      localStorage.setItem(key, item)
    }
  }, [key, item]);
  return [item, setItem]
};

export default useLocalStorage;