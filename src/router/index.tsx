import { createBrowserRouter, type RouteObject } from "react-router";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UpdatePassword } from "../pages/UpdatePassword";
import { ExamList } from "../pages/ExamList";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: ExamList,
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "register",
    Component: Register,
  },
  {
    path: "update_password",
    Component: UpdatePassword,
  },
];
export const router = createBrowserRouter(routes);
