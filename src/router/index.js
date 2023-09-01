import Vue from "vue";
import Router from "vue-router";

// routes
import Login from "@/views/pages/account/routes.account/";
import Dashboard from "@/views/pages/dashboard/routes.dashboard/";
import Git from "@/views/pages/github/routes.projects/";
import Profile from "@/views/pages/profile/routes.profile/";
import Organization from "@/views/pages/organization/routes.organization/";
import Users from "@/views/pages/users/routes.users/";
import Admins from "@/views/pages/admins/routes.admins/";
import Contact from "../views/pages/contactToSupport/routes.contactToSupport"


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,

  scrollBehavior() {
    return { x: 0, y: 0 };
  },

  routes: [
    ...Login,
    {
      path: "/dashboard",
      component: () => import("@/views/layouts/main/"),
      children: [...Dashboard, ...Git, ...Profile, ...Organization, ...Users, ...Admins ,...Contact],
    },

    // Redirect to 404 page, if no match found
    // {
    //   path: "/not-found",
    //   component: () => import(/* webpackChunkName: "404" */ "@/views/Error404"),
    // },
    // { path: "*", redirect: "/not-found" },
  ],
});

router.afterEach(() => {
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
