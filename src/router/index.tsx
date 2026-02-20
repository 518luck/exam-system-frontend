import { createBrowserRouter, type RouteObject } from "react-router";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UpdatePassword } from "../pages/UpdatePassword";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <div>index</div>,
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
