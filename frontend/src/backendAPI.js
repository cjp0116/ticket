import axios from 'axios';
class Api {
  static async request(endpoint, paramsOrData = {}, verb = 'get') {
    paramsOrData._token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTYxNDQ3OTg3M30.WNsrLrko0IyS_BbZKufu7ddBPzPX0c478fMG80ApLI0'
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
      let message = e.response.data.msg;
      throw Array.isArray(message) ? message : [message];
    };
  };
};

export default Api;