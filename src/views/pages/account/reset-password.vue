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
                                                    Reset Password to continue to DITAxPresso Client Admin.
                                                </p>
                                            </div>

                                            <b-alert v-show="isAuthenticate" show dismissible variant="danger">Invalid Credentials!</b-alert>
                                            
                                            <b-alert v-if="isVerify === false" show variant="danger">
                                                Token Expired! If you want to generate new password reset link.. click on
                                                <router-link tag="a" to="/forgot-password" >
                                                    <i class="mdi mdi-lock mr-1"></i> Forgot your password
                                                </router-link>
                                            </b-alert>
                                            
                                            <div v-else class="p-2 mt-5">
                                                <form class="form-horizontal" @submit.prevent="resetPassword" ref="form">
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-lock-2-line auti-custom-input-icon"></i>
                                                        <label for="password">New Password</label>
                                                        <input
                                                            v-validate="'required|verify_password'"
                                                            v-model="password"
                                                            name="password"
                                                            type="password"
                                                            class="form-control"
                                                            id="password"
                                                            placeholder="Enter new password"
                                                            :class="{
                                                              'is-invalid': submitted && $v.password.$error,
                                                            }"
                                                            ref="password"
                                                        />
                                                        <p class="text-danger text-sm" v-show="errors.has('password') && _.find(errors.items, { field: 'password' }).rule == 'required'">
                                                            <span>The new password field is required</span>  
                                                        </p>
                                                        <p class="text-danger text-sm" v-show="errors.has('password') && _.find(errors.items, { field: 'password' }).rule == 'verify_password'">
                                                            {{ errors.first("password") }}
                                                        </p>
                                                    </div>
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-lock-2-line auti-custom-input-icon"></i>
                                                        <label for="confirmPassword">Confirm Password</label>
                                                        <input
                                                            v-validate="'required|confirmed:password'"
                                                            v-model="password_confirmation"
                                                            name="password_confirmation"
                                                            type="password"
                                                            class="form-control"
                                                            id="password_confirmation"
                                                            placeholder="Enter password"
                                                            :class="{
                                                              'is-invalid': submitted && $v.password_confirmation.$error,
                                                            }"
                                                        />
                                                        <p class="text-danger text-sm" v-show="errors.has('password_confirmation')">
                                                            The password confirmation field does not match
                                                        </p>
                                                    </div>
                                                    <div class="mt-4 text-center">
                                                        <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                                            Reset Password
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div class="mt-5 text-center">
                                                <p>
                                                    {{ new Date().getFullYear() }} © ALL RIGHTS RESERVED BY DITAXPRESSO TECHNOLOGY PRIVATE LIMITED
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
    </div>
</template>

<script>
    import VeeValidate from "vee-validate";
    import _ from "lodash";
    export default {
        data() {
            return {
                isAuthenticate: false,
                password: null,
                password_confirmation: null,
                validateCredentials: false,
                error: null,
                submitted: false,
                isVerify: false
            };
        },
        computed: {
            _() {
                return _;
            },
        },
        created() {
            this.verifyResetPassword();
            VeeValidate.Validator.extend('verify_password', {
                getMessage: () => `The password must contain at least: minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
                validate: value => {
                    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})");
                    return strongRegex.test(value);
                }
            });
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
            verifyResetPassword() {
                // if () {
                //     this.$router.push({ name: "login" });
                // }

                console.log("verify token")
                this.$store.getters.client
                    .post(`/orgadmin/forgotPasswordTokenVerify`, {
                        token: this.$route.params.token
                    })
                    .then(res => {
                        console.log('res')
                        console.log(res)
                        if(res)
                        {
                            if(res.data.message == "Token Expired")
                            {
                                this.isVerify = false;
                            }
                            else
                            {
                                this.isVerify = true;
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        // loading is disabled if error comes on organization details fetch
                        this.isLoading = false;
                    });
            },
            resetPassword() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        let loader = this.$loading.show({
                            loader: "dots",
                        });
                        this.$store.getters.client
                            .put(`orgadmin/resetforgotpassword`, {
                                token: this.$route.params.token,
                                newPassword: this.password
                            })
                            .then(res => {
                                if(res)
                                {
                                    if(res.data.message == "Token Expired")
                                    {
                                        loader.hide();
                                        this.messageToast("Error", "danger", `Link Expired`);
                                        setTimeout(() => loader.hide(), 500)
                                        setTimeout(() => this.$router.push({ name: "Login" }), 2000)
                                    }
                                    else{
                                        // Resetting Values
                                        this.password = this.password_confirmation = "";
                                        // this.$refs.form.reset();
                                        this.messageToast("Success", "success", `Password reset successfully`);
                                        // this.$router.push({ name: "Projects" });
                                        loader.hide();
                                        // setTimeout(this.$refs.form.reset(), loader.hide(), this.$router.push({ name: "Login" }), 50000);
                                        setTimeout(() => loader.hide(), 500)
                                        setTimeout(() => this.$refs.form.reset(), 1800)
                                        setTimeout(() => this.$router.push({ name: "Login" }), 2000)
                                    }

                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                this.messageToast("Error", "danger", error.response.data.message);
                                loader.hide();
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