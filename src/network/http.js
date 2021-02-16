import axios from "axios";

const baseURL = "http://localhost:3001/";
axios.defaults.baseURL = baseURL;

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API,
  responseType: "json",
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

HTTP.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log("INTERCEPTED 401");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      location.reload();
      alert('Session timeout')
      // this.$router.push({ name: "login" });
    }
   
    return error;
  }
);

const URLS = {
  baseURL: baseURL,
  SUPER_ADMIN: {
    LOGIN: "super_admin/login",
  },
  COMPANY: {
    LSIT_ALL: "company/list/all",
    CREATE: "company/create",
    UPDATE: "company/:id/update",
    BY_ID: "company/:id",
  },
  USER: {
    CREATE: "company/user/create",
    LIST_ALL: "company/user/list/all",
    UPDATE_STATUS : "company/user/:id/update/status"
  },
  JOBS : {
    CREATE : "company/job/create",
    LIST_ALL : "company/job/list/all"
  }
};

export { HTTP, URLS };
