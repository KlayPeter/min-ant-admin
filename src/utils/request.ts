import { message } from "antd";
import axios from "axios";
import { getData, resetDataSync } from "@/store/useData";
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import storage from "./storage";
import { isType } from ".";

interface RequestOptions extends AxiosRequestConfig {
  showError?: boolean;
  raw?: boolean;
  queryType?: "params" | "data";
  ignoreResponseCode?: boolean; // true 表示不需要判断接口返回的code
}

function prepareOptions<T = any>(
  url: string,
  method: Method,
  options: RequestOptions,
  fetchData?: T
) {
  const { queryType, headers = {}, ...restOptions } = options || {};

  // API基础地址配置
  const baseURL = "http://127.0.0.1:8080";
  
  const option = {
    baseURL: url.startsWith('http') ? undefined : baseURL, // 绝对url不加baseURL
    url,
    method,
    ...restOptions,
  } as AxiosRequestConfig<T>;

  option.headers = options.headers || {};

  // 接口添加 Token
  const { token } = getData("global");
  if (token) {
    option.headers.Authorization = token;
  }

  // 添加 menuPath 字段到请求头
  option.headers.menuPath = window.location.pathname;
  if (queryType) {
    option[queryType] = fetchData;
  } else {
    if (method === "get" || method === "delete") {
      option.params = fetchData;
    } else {
      option.data = fetchData;
    }
  }

  return option;
}

const defaultHeaders = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  headers: defaultHeaders,
});

export default function request<T = any, PARAM = any>(
  url: string,
  method: Method = "post",
  options?: RequestOptions
) {
  return (fetchData?: PARAM): Promise<API.Response<T>> => {
    const {
      raw = false,
      showError = true,
      ignoreResponseCode = false,
      ...restOptions
    } = options || {};
    const lowerMethod = method.toLocaleLowerCase() as Method;

    const option = prepareOptions<PARAM>(
      url,
      lowerMethod,
      restOptions,
      fetchData
    );

    return axiosInstance(option)
      .catch((error) => {
        if (error?.response?.status === 401) {
          resetDataSync("global");
          storage.remove("userName");
          window.location.href = "/login";
        }
        if (showError) {
          message.error(error.message);
        }
        throw error;
      })
      .then((response) => {
        if (isType("Blob")(response.data)) {
          return response;
        } else {
          const {
            status,
            data: { data, success, message: desc },
          } = response as AxiosResponse<API.Response<T>, PARAM>;

          if (status === 200 && (ignoreResponseCode || success)) {
            return raw ? (response as unknown) : data;
          } else {
            if (showError) {
              message.error(desc);
            }
            throw new Error(desc);
          }
        }
      }) as unknown as Promise<API.Response<T>>;
  };
}
