import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html

  state: {
    sgitrepodata: [],
  },
  mutations: {
    setGitRepoDetails: (state, e) => (state.sgitrepodata = e.data),
    removeRepoData(state) {
      state.sgitrepodata = [];
    }
  },
  actions: {
    async githubApiRequest({ commit, state }, payload) {
      try {
        console.log(commit);
        console.log(state);
        let gitToken = localStorage.getItem("gitToken");
        let apptoken = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.VUE_APP_DATABASEURL}/${payload}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apptoken}`,
              gitToken: `${gitToken}`,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  strict: process.env.NODE_ENV !== 'production',
})

export default store

