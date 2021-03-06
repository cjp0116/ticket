import axios from 'axios';


class Api {
  static async request(endpoint, paramsOrData = {}, verb = 'get') {
    paramsOrData._token = localStorage.getItem('token');
    console.debug('API Call : ', endpoint, paramsOrData, verb);
    try {
      const res = await axios({
        method : verb,
        url : endpoint,
        [verb === 'get' ? 'params' : 'data'] : paramsOrData
      });
      return res;
    } catch(e) {
      console.error('API Error :', e.response);
      let errors = e.response.data.errors;
      throw errors;
    };
  };
};

export default Api;