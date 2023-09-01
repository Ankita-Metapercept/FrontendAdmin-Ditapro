import Git from "./index";
import Repo from "./repo.vue"
// import middlewares
export default [
  {
    path: "/github",
    component: Git,
    name: "Projects",
  },
  {
    path: '/github/repo/:id',
    name: 'github/repo',
    component: Repo,
  }
];
