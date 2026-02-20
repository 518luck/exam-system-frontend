import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { RegisterUser } from "../pages/Register";
import type { UpdatePassword } from "../pages/UpdatePassword";
import { message } from "antd";
import type { ExamAdd } from "../pages/ExamList/ExamAddModal";

// #region 注册接口和实体
const userServiceInstance = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 3000,
});

// 登录
export async function login(username: string, password: string) {
  return await userServiceInstance.post("/user/login", {
    username,
    password,
  });
}

// 注册验证码
export async function registerCaptcha(email: string) {
  return await userServiceInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

// 注册
export async function register(registerUser: RegisterUser) {
  delete registerUser.confirmPassword;
  return await userServiceInstance.post("/user/register", registerUser);
}

// 更新密码验证码
export async function updatePasswordCaptcha(email: string) {
  return await userServiceInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

// 更新密码
export async function updatePassword(data: UpdatePassword) {
  delete data.confirmPassword;
  return await userServiceInstance.post("/user/update_password", data);
}
// #endregion

// #region exam 接口和实体
const examServiceInstance = axios.create({
  baseURL: "http://localhost:3002/",
  timeout: 3000,
});

// 添加请求拦截器
const requestInterceptor = function (config: InternalAxiosRequestConfig) {
  // 1. 从本地存储拿 Token
  const accessToken = localStorage.getItem("token");

  if (accessToken) {
    // 2. 自动往请求头里塞入 Authorization: Bearer <token>
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
};

//Axios 拦截器（Interceptors）的注册语法。
//interceptors 是一个对象，它包含两个主要的管道：request（请求）和 response（响应）
//通过 .use() 方法，你可以将自定义的函数（逻辑）“插入”到这些管道中。
//注册一个请求拦截器 通常只接收一个函数（即你定义的 requestInterceptor）。
// 逻辑 你的代码逻辑 -> 拦截器 (加上 Token) -> 服务器
examServiceInstance.interceptors.request.use(requestInterceptor);

// 响应拦截器：成功处理
const responseIntercepor = (response: AxiosResponse) => {
  // 3. 检查响应头里有没有新 Token
  const newToken = response.headers["token"];
  // 4. 如果有，更新本地 Token（无感刷新）
  if (newToken) {
    localStorage.setItem("token", newToken);
  }
  return response;
};

// 1. 定义后端返回的数据结构
interface BackendErrorData {
  statusCode: number;
  message: string;
}
//响应拦截器：错误处理
const responseErrorIntercepor = async (error: AxiosError<BackendErrorData>) => {
  if (!error.response) {
    // 处理网络断开等连不上服务器的情况
    return Promise.reject(error);
  }
  const { data } = error.response;

  // 5. 捕获 401 Unauthorized 错误
  if (data.statusCode === 401) {
    message.error(data.message);

    // 6. 强制跳转到登录页
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  } else {
    // 7. 其他错误（如 400, 500）继续抛出，让页面层的 catch 处理
    return Promise.reject(error);
  }
};

examServiceInstance.interceptors.response.use(
  responseIntercepor,
  responseErrorIntercepor,
);

// 获取考试列表
export async function examList() {
  return await examServiceInstance.get("/exam/list");
}

// 新增试卷
export async function examAdd(values: ExamAdd) {
  return await examServiceInstance.post("/exam/add", values);
}

// 发布考试
export async function examPublish(id: number) {
  return await examServiceInstance.get("/exam/publish/" + id);
}

// 取消发布考试
export async function examUnpublish(id: number) {
  return await examServiceInstance.get("/exam/unpublish/" + id);
}
// #endregion
