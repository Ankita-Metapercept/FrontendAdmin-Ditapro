import { unauthClient, apiDefaults, axios } from "@/api/index.js";
import store from "@/state/store";
import { URL } from "@/api/global.env";

const Auth = {
  state: () => ({
    token: localStorage.getItem("token") || null,
    tokensessionStorage: sessionStorage.getItem("tokensessionStorage") || null,
    refresh: localStorage.getItem("refresh") || null,
    sessionId: localStorage.getItem("sessionId") || null,
    adminEmail: localStorage.getItem("adminEmail") || null,
    adminName: localStorage.getItem("adminName") || null,
    unauthClient: unauthClient,
    userId: localStorage.getItem("userId") || null,
    orgId: localStorage.getItem("orgId") || null,
    gitToken: localStorage.getItem("gitToken") || null,
    isChangePassword: localStorage.getItem("isChangePassword") || null,
    name: localStorage.getItem("name") || null,
    githubUsername: localStorage.getItem("githubUsername") || null,
    isActive: localStorage.getItem("isActive") || null,
    isEmailVerified: localStorage.getItem("isEmailVerified") || null,
    endpoints: {
      obtain: "/orgadmin/authenticate",
      obtainGit: '/orgadmin/success'
    }
  }),
  mutations: {
    updateTokens(state, tokens) {
      localStorage.setItem("token", tokens.token);
      sessionStorage.setItem("token", tokens.token);
      localStorage.setItem("adminEmail", tokens.adminEmail);
      localStorage.setItem("adminName", tokens.adminName);
      localStorage.setItem("userId", tokens.userId);
      localStorage.setItem("orgId", tokens.orgId);
      localStorage.setItem("gitToken", tokens.gitToken);
      localStorage.setItem("isChangePassword", tokens.isChangePassword);
      localStorage.setItem("name", tokens.name);
      localStorage.setItem("githubUsername", tokens.githubUsername);
      localStorage.setItem("isActive", tokens.isActive);
      localStorage.setItem("isEmailVerified", tokens.isEmailVerified);
      state.tokensessionStorage = tokens.tokensessionStorage;
      state.token = tokens.token;
      state.adminEmail = tokens.adminEmail;
      state.adminName = tokens.adminName;
      state.refresh = tokens.refresh;
      state.userId = tokens.userId;
      state.orgId = tokens.orgId;
      state.gitToken = tokens.gitToken;
      state.name = tokens.adminName;
      state.githubUsername = tokens.githubUsername;
    },
    updateAccess(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
    },
    updateSessionId(state, sessionId) {
      state.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
    },
    updateGitToken(state, token) {
      localStorage.setItem("gitToken", token.gitToken);
      state.gitToken = token.gitToken;
    },
    updateChangePasswordStatus(state, token) {
      localStorage.setItem("isChangePassword", token.isChangePassword);
      state.isChangePassword = token.isChangePassword;
    },
    updateActiveStatus(state, token) {
      localStorage.setItem("isActive", token.isActive);
      state.isActive = token.isActive;
    },
    updateEmailVerifiedStatus(state, token) {
      localStorage.setItem("isEmailVerified", token.isEmailVerified);
      state.isEmailVerified = token.isEmailVerified;
    },
    removeToken(state) {
      localStorage.setItem("token", null);
      localStorage.setItem('sessionId', null)
      localStorage.setItem("refresh", null);
      localStorage.setItem("adminName", null);
      localStorage.setItem("adminEmail", null);
      localStorage.setItem("userId", null);
      localStorage.setItem("orgId", null);
      localStorage.setItem("gitToken", null);
      localStorage.setItem("isChangePassword", null);
      localStorage.setItem("name", null);
      localStorage.setItem("githubUsername", null);
      localStorage.setItem("isActive", null);
      localStorage.setItem("isEmailVerified", null);
      state.token = null;
      state.sessionId = null;
      state.adminName = null;
      state.adminEmail = null;
      state.userId = null;
      state.orgId = null;
      state.gitToken = null;
      state.isChangePassword = null;
      state.name = null;
      state.githubUsername = null;
      state.isActive = null;
      state.isEmailVerified = null;
    },
  }, 
  getters: {
    client: (state) => {
      const apiClient = axios.create({
        ...apiDefaults,
        headers: {
          Authorization: `Bearer ${state.token}`,
          sessionId: state.sessionId || localStorage.getItem('sessionId'),
          userId: state.userId || localStorage.getItem('userId'),
          orgId: state.orgId || localStorage.getItem('orgId'),
          gitToken : `${state.gitToken}`,

        },
      });
      apiClient.interceptors.response.use(
        (response) => {
          // Return a successful response back to the calling service
          return response;
        },
        (error) => {
          // Return any error which is not due to authentication back to the calling service
          if (error.response.status !== 401) {
            return new Promise((resolve, reject) => {
              reject(error);
            });
          }
          // Logout user if token refresh didn't work or user is disabled
          if (
            error.config.url == `${URL}api/token/refresh/` ||
            error.response.message == "Account is disabled."
          ) {
            // window.location.href = "/";
            return new Promise((reject) => {
              reject(error);
            });
          }
          // Try request again with new token
          return apiClient
            .post(`${URL}accounts/token/refresh/`, {
              refresh: localStorage.getItem("refresh"),
            })
            .then((response) => {
              // New request with new token
              const config = error.config;
              store.commit("updateAccess", {
                token: response.data.token,
              });
              config.headers[
                "Authorization"
              ] = `Bearer ${response.data.token}`;
              return new Promise((resolve, reject) => {
                apiClient
                  .request(config)
                  .then((response) => {
                    resolve(response);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            })
            .catch((error) => {
              Promise.reject(error);
            });
        }
      );
      return apiClient;
    },
  },
  actions: {
    obtainToken(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.obtain, authDetails)
        .then((response) => {
          this.commit("updateTokens", {
            token: response.data.token,
            tokensessionStorage: response.data.token,
            adminEmail: response.data.email,
            adminName: response.data.name,
            userId: response.data.id,
            orgId: response.data.orgId,
            githubUsername: response.data.githubUsername  
          });
          this.commit("updateEmailVerifiedStatus", {
            isEmailVerified: response.data.isEmailVerified
          });
          this.commit("updateActiveStatus", {
            isActive: response.data.isActive
          });
          this.commit("updateChangePasswordStatus", {
            isChangePassword: response.data.isChangePassword
          });
          this.commit("updateGitToken", {
            gitToken: response.data.gitToken,
          });
          
        });
    },
    refreshToken(context) {
      const payload = {
        refresh: context.state.refresh,
      };
      context.state.unauthClient
        .post(context.state.endpoints.refresh, payload)
        .then((response) => {
          this.commit("updateAccess", response.data.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    registerUser(context, authDetails) {
      return context.state.unauthClient
        .post(context.state.endpoints.register, authDetails)
        .then((response) => {
          console.log(response, "response");
        });
    },
  },
};
export default Auth;
