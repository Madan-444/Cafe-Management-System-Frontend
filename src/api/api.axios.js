import axios from "axios";
const defaultUrl = "http://localhost:8080";





export const axiosPrivate = axios.create({
  baseURL: defaultUrl,
});