import axios from 'axios';
class Api {
  static async request(endpoint, paramsOrData = {}, verb = 'get') {
    // paramsOrData._token = localStorage.getItem('token') || 'hardcoded token String'
    console.debug('API Call : ', endpoint, paramsOrData, verb);
    try {
      const res = await axios({
        method : verb,
        url : endpoint,
        [verb === 'get' ? 'params' : 'data'] : paramsOrData
      }).data;
      return res;
    } catch(e) {
      console.error('API Error :', e.response);
      let message = e.response.data.msg;
      throw Array.isArray(message) ? message : [message];
    };
  };
};

export default Api;