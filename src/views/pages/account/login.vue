<template>
    <div>
        <div class="home-btn d-none d-sm-block">
            <a href="/">
                <i class="mdi mdi-home-variant h2 text-white"></i>
            </a>
        </div>
        <div>
            <div class="container-fluid p-0">
                <div class="row no-gutters">
                    <div class="col-lg-4">
                        <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                            <div class="w-100">
                                <div class="row justify-content-center">
                                    <div class="col-lg-9">
                                        <div>
                                            <div class="text-center">
                                                <h4 class="font-size-18 mt-4">Welcome Back !</h4>
                                                <p class="text-muted">
                                                    Sign in to continue to DITAxPresso Client Admin.
                                                </p>
                                            </div>
                                            <b-alert v-show="isAuthenticate" show dismissible variant="danger">Invalid
                                                Credentials!</b-alert>
                                            <div class="p-2 mt-5">
                                                <form class="form-horizontal" @submit.prevent="login">
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-mail-line auti-custom-input-icon"></i>
                                                        <label for="email">Email</label>
                                                        <input v-model="email" class="form-control" id="email"
                                                            v-validate="'required|email'" name="email"
                                                            placeholder="Enter email" :class="{
                                                                'is-invalid': submitted && $v.email.$error,
                                                            }" />
                                                        <p class="text-danger text-sm" v-show="errors.has('email')">
                                                            {{ errors.first("email") }}
                                                        </p>
                                                        <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                                                            <span v-if="!$v.email.required">Email is required.</span>
                                                            <span v-if="!$v.email.email">Please enter valid email.</span>
                                                        </div>
                                                    </div>
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-lock-2-line auti-custom-input-icon"></i>
                                                        <label for="userpassword">Password</label>
                                                        <input v-validate="'required'" v-model="password" name="password"
                                                            type="password" class="form-control" id="userpassword"
                                                            placeholder="Enter password" :class="{
                                                                'is-invalid': submitted && $v.password.$error,
                                                            }" />
                                                        <p class="text-danger text-sm" v-show="errors.has('password')">
                                                            {{ errors.first("password") }}
                                                        </p>
                                                    </div>
                                                    <div class="form-group">
                                                        <b-form-group>
                                                            <b-form-checkbox-group v-validate="'required'"
                                                                v-model="seletedPolicy" name="policy" type="text"
                                                                id="policy" :class="{
                                                                    'is-invalid': submitted && $v.policy.$error,
                                                                }">
                                                                <b-form-checkbox value="true">
                                                                    I agree to the <b-link
                                                                        v-b-modal.terms-and-conditions>Terms &
                                                                        Conditions</b-link> and <b-link
                                                                        v-b-modal.privacy-policy>Privacy Policy</b-link>
                                                                </b-form-checkbox>
                                                            </b-form-checkbox-group>
                                                        </b-form-group>
                                                        <p class="text-danger text-sm" v-show="errors.has('policy')">
                                                            You must accept before continuing
                                                        </p>
                                                    </div>
                                                    <div class="mt-4 text-center">
                                                        <button class="btn btn-primary w-md waves-effect waves-light"
                                                            type="submit">
                                                            Log In
                                                        </button>
                                                    </div>
                                                    <div class="mt-4 text-center">
                                                        <router-link tag="a" to="/forgot-password" class="text-muted"> <i
                                                                class="mdi mdi-lock mr-1"></i> Forgot your password?
                                                        </router-link>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="mt-5 text-center">
                                                <p>
                                                    {{ new Date().getFullYear() }} © ALL RIGHTS RESERVED BY DITAXPRESSO
                                                    TECHNOLOGY PRIVATE LIMITED
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="authentication-bg">
                            <div class="bg-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="terms-and-conditions" scrollable title="Terms & Conditions">
            <p class="my-4" v-for="i in 20" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu ex eget odio auctor tristique. Ut
                sollicitudin, velit vel tincidunt lacinia, tortor massa aliquet libero, id viverra justo turpis ut lorem.
                Integer et mauris
                vitae nulla rhoncus dapibus ac quis nisl. Etiam vehicula sem id lacinia dignissim. In convallis fringilla
                lacus, non vehicula metus. Cras lacinia justo quis malesuada elementum. In sit amet iaculis diam, sit amet
                lobortis
                libero. Fusce tincidunt ullamcorper ex, ut tincidunt nulla rutrum quis.
            </p>
        </b-modal>
        <b-modal id="privacy-policy" scrollable title="Privacy Policy">
            <p class="my-4" v-for="i in 20" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu ex eget odio auctor tristique. Ut
                sollicitudin, velit vel tincidunt lacinia, tortor massa aliquet libero, id viverra justo turpis ut lorem.
                Integer et mauris
                vitae nulla rhoncus dapibus ac quis nisl. Etiam vehicula sem id lacinia dignissim. In convallis fringilla
                lacus, non vehicula metus. Cras lacinia justo quis malesuada elementum. In sit amet iaculis diam, sit amet
                lobortis
                libero. Fusce tincidunt ullamcorper ex, ut tincidunt nulla rutrum quis.
            </p>
        </b-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isAuthenticate: false,
            email: null,
            password: null,
            validateCredentials: false,
            error: null,
            submitted: false,
            seletedPolicy: [],
        };
    },
    methods: {
        // This method is use to generate error or success message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getsessionid(){
      this.$store.getters.client
          .get("/generateSessionId", {
            headers: {
              userId : localStorage.getItem('userId')
            },
          })
          .then((res) => {
            console.log("sessionToken res", res.data.message);
            localStorage.setItem('sessionId', res.data.message)
            this.$store.commit('updateSessionId', res.data.message);
            this.$router.push({ name: "Dashboard" });
          })
          .catch((err) => {
            console.log("sessionToken err", err);
          });
    },
        login() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store
                        .dispatch("obtainToken", {
                            email: this.email,
                            password: this.password,
                        })
                        .then(() => {
                            loader.hide();
                            if (this.$store.state.Auth.isEmailVerified == true) {
                                if (this.$store.state.Auth.isActive == true) {
                                    if (this.$store.state.Auth.gitToken) {
                                        this.$store.getters.client
                                            .get(`project/repo/sync?orgId=${this.$store.state.Auth.orgId}`)
                                            .then(() => {
                                                loader.hide();
                                            })
                                            .catch(() => {
                                                loader.hide();
                                            });
                                        this.$store.getters.client
                                            .post(`orgadmin/github/gitcollaborators?orgId=${this.$store.state.Auth.orgId}`)
                                            .then(() => {
                                                loader.hide();
                                            })
                                            .catch((error) => {
                                                this.messageToast("Error", "danger", error.response.data.message);
                                                loader.hide();
                                            });
                                    }
                                    this.getsessionid()
                                    this.$router.push({ name: "Dashboard" });
                                    localStorage.setItem('storedFileCount', null)
                                } else {
                                    this.messageToast("Error", "danger", "Your account is inactive! please contact your admin to active your account.");
                                }
                            } else {
                                this.messageToast("Error", "danger", "Email is not verified! please verify your email first to login into DITAxPresso.");
                            }
                        })
                        .catch((error) => {
                            this.error = error.response.data;
                            loader.hide();
                            this.isAuthenticate = true;
                            this.validateCredentials = true;
                        });
                }
            });
        },
    },
};
</script>

<style scoped>
.auth-form-group-custom .auti-custom-input-icon {
    top: 30px;
}
</style>