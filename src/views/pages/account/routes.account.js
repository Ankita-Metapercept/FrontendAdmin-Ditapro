import Login from "./login";
import ChangePassword from "./changepassword";
import VerifyAccount from "./verify-account";
import ForgotPassword from "./forgot-password";
import ResetPassword from "./reset-password";

export default [
  {
    path: "/",
    component: Login,
    name: "Login",
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        next('/dashboard'); // Redirect to dashboard if the user has a token
      } else {
        next(); // Allow navigation to the login page
      }
    }
  },
  {
    path: "/changepassword",
    component: ChangePassword,
    name: "ChangePassword",
  },
  {
    path: "/verify/:token",
    component: VerifyAccount,
    name: "VerifyAccount",
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    name: "forgot-password",
  },
  {
    path: "/reset-password/:token",
    component: ResetPassword,
    name: "reset-password",
  }
];