import axios from "axios";

// const baseURL = "https://dev.api.pushtalents.sawatechnologies.org/";
// const baseURL = "http://localhost:3001/";
// const baseURL = "https://api.2021.pushtalents.com/";
const baseURL = "https://stage.api.pushtalents.com/";
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
      alert("Session timeout");
    }
    throw error;
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
    UPDATE_STATUS: "company/user/:id/update/status",
    BY_ID: "company/user/:id",
  },
  JOBS: {
    CREATE: "company/job/create",
    LIST_ALL: "company/job/list/all",
    BY_ID: "company/job/:id",
  },
  ARTICLE: {
    CREATE: "company/article/create",
    LIST_ALL: "company/article/list/all",
    UPDATE_STATUS: "company/article/:id/update/status",
  },
  QUIZ: {
    CREATE: "company/quiz/create",
    LIST_ALL: "company/quiz/list/all",
    BY_ID: "company/quiz/:id",
    ADD_QUESTIONS: "company/quiz/:id/add/questions",
    QUETION_BY_ID: "company/quiz/question/:id",
  },
  SETTINGS: {
    DETAIL: "settings",
    UPDATE: "settings/update",
  },
};

export { HTTP, URLS };
