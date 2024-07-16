import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND;

const axios = Axios.create({
  baseURL: BASE_API_ENDPOINT,
});

const responseData = <T extends AxiosResponse<any>>(response: T) =>
  response.data;

const handleError = (error: AxiosError) => {
  console.error("API Error:", error);
  throw error;
};

class CoreAPIService {
  get = async <R>(url: string, params: Record<string, any> = {}) =>
    axios
      .request<R>({
        method: "get",
        url,
        params,
      })
      .then<R>(responseData)
      .catch(handleError);

  post = async <R>(
    url: string,
    data: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ) =>
    axios
      .request<R>({
        method: "post",
        url,
        data,
        ...config,
      })
      .then<R>(responseData)
      .catch(handleError);

  put = async <R>(url: string, data: Record<string, any> = {}) =>
    axios
      .request<R>({
        method: "put",
        url,
        data,
      })
      .then<R>(responseData)
      .catch(handleError);

  patch = async <R>(url: string, data: Record<string, any> = {}) =>
    axios
      .request<R>({
        method: "patch",
        url,
        data,
      })
      .then<R>(responseData)
      .catch(handleError);

  delete = async <R>(url: string, data: Record<string, any> = {}) =>
    axios
      .request<R>({
        method: "delete",
        url,
        data,
      })
      .then<R>(responseData)
      .catch(handleError);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CoreAPIService();
