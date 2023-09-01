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
                                                    Change Password to continue to DITAxPresso Client Admin.
                                                </p>
                                            </div>

                                            <b-alert v-show="isAuthenticate" show dismissible variant="danger">Invalid Credentials!</b-alert>

                                            <div class="p-2 mt-5">
                                                <form class="form-horizontal" @submit.prevent="changePassword" ref="form">
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-lock-2-line auti-custom-input-icon"></i>
                                                        <label for="currentPassword">Current Password</label>
                                                        <input
                                                            v-validate="'required'"
                                                            v-model="currentPassword"
                                                            name="currentPassword"
                                                            type="password"
                                                            class="form-control"
                                                            id="currentPassword"
                                                            placeholder="Enter current password"
                                                            :class="{
                                                              'is-invalid': submitted && $v.currentPassword.$error,
                                                            }"
                                                        />
                                                        <p class="text-danger text-sm" v-show="errors.has('currentPassword')">
                                                            The current password field is required
                                                        </p>
                                                    </div>
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
                                                            Change Password
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
                currentPassword: null,
                password: null,
                password_confirmation: null,
                validateCredentials: false,
                error: null,
                submitted: false,
            };
        },
        computed: {
            _() {
                return _;
            },
        },
        created() {
            this.verifyChangePassword();
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
            verifyChangePassword() {
                if (this.$store.state.Auth.isChangePassword === true || this.$store.state.Auth.isChangePassword === "true") {
                    this.$router.push({ name: "Dashboard" });
                }
            },
            changePassword() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        let loader = this.$loading.show({
                            loader: "dots",
                        });
                        this.$store.getters.client
                            .put(`orgadmin/changepassword`, {
                                userId: this.$store.state.Auth.userId,
                                currentPassword: this.currentPassword,
                                newPassword: this.password,
                            })
                            .then(() => {
                                // Resetting Values
                                this.currentPassword = this.password = this.password_confirmation = "";
                                this.$refs.form.reset();
                                this.messageToast("Success", "success", `Password reset successfully`);
                                this.$store.commit("updateChangePasswordStatus", {
                                    isChangePassword: true,
                                });
                                this.$router.push({ name: "Projects" });
                                loader.hide();
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