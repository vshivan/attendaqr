import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

API.interceptors.request.use(req=>{
  const t = localStorage.getItem("token");
  if(t) req.headers.Authorization = t;
  return req;
});

export default API;
