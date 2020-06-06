import axios from 'axios';

axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.baseURL = '/api/v1/';

export default axios;
