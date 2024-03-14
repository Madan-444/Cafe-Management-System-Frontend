import { useEffect } from "react";

import { axiosPrivate } from "../api/api.axios";
// import { useNavigate } from "react-router";

const useAxiosPrivate = () => {
  const parsedToken = localStorage.getItem("token");
  // const history = useNavigate()
  axiosPrivate.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"] && parsedToken) {
        config.headers["Authorization"] = `Bearer ${parsedToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {

      if(error.code == "ERR_NETWORK") {
        // history("/network-error")
      }
      if (error?.response?.status === 403) {
        window.location.replace('/login')

      }
      return Promise.reject(error);
    }
  );

  return axiosPrivate;
};

export default useAxiosPrivate;