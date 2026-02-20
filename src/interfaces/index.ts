import axios from "axios";
import type { RegisterUser } from "../pages/Register";
import type { UpdatePassword } from "../pages/UpdatePassword";

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
