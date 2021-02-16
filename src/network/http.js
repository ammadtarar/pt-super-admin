import axios from 'axios';

const baseURL = 'http://localhost:3001/';
axios.defaults.baseURL = baseURL;

const HTTP = axios.create({
    baseURL: process.env.VUE_APP_API,
    responseType: 'json'
});


HTTP.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);



const URLS = {
    baseURL: baseURL,
    SUPER_ADMIN : {
        LOGIN : 'super_admin/login'
    },
    COMPANY : {
        LSIT_ALL : 'company/list/all',
        CREATE : 'company/create',
        UPDATE : 'company/:id/update',
        BY_ID : 'company/:id'
    },
    USER : {
      CREATE : 'company/user/create'
    }
}


export {
  HTTP,
  URLS
}