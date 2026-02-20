import { createBrowserRouter, type RouteObject } from "react-router";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UpdatePassword } from "../pages/UpdatePassword";
import { ExamList } from "../pages/ExamList";
import { Edit } from "../pages/Edit";

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
  {
    path: "exam/:id",
    Component: Edit,
  },
];
export const router = createBrowserRouter(routes);
