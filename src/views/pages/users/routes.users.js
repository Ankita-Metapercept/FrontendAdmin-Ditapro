import User from "./index";
import Useradd from "./useradd";
import Userupdate from "./updateuser";

// import middlewares
export default [
  {
    path: "/users",
    component: User,
    name: "Users",
  },
  {
    path: "/useradd/:id",
    component: Useradd,
    name: "Useradd",
  },
  {
    path: "/userupdate/:id",
    component: Userupdate,
    name: "Userupdate",
  },
];