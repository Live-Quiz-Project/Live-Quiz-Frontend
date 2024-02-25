import { logOut, refreshToken } from "@/features/auth/store/slice";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/app/store";

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "",
  withCredentials: true,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${
        store.getState().auth.value.token
      }`;
    }
    return config;
  },
  (err: AxiosError) => Promise.reject(err)
);

http.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    const prevReq = err.config;
    if (err.response?.status === 401 && prevReq) {
      try {
        const { data } = await http.get("/refresh");
        store.dispatch(refreshToken(data.token));
        prevReq.headers["Authorization"] = `Bearer ${data.token}`;
        return http(prevReq);
      } catch (error) {
        await http.get("/logout");
        store.dispatch(logOut());
      }
    }
    return Promise.reject(err);
  }
);

const ws = axios.create({
  baseURL: import.meta.env.VITE_WEBSOCKET_URL || "",
});

export { http, ws };
