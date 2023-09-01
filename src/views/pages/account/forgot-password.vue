<template>
    <div>
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
                                                <h4 class="font-size-18 mt-4">Reset Password</h4>
                                                <p class="text-muted">Reset your password to DITAxPresso.</p>
                                            </div>

                                            <b-alert v-if="isEmailSend === true" show variant="danger">
                                                Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.
                                                <br/>
                                               
                                                <div class="mt-4 text-center">
                                                    <router-link tag="a" to="/" class="btn btn-primary w-md waves-effect waves-light">
                                                         Log In
                                                    </router-link>
                                                </div>
                                            </b-alert>

                                            <div v-else class="p-2 mt-5">
                                                <b-alert
                                                v-model="isResetError"
                                                class="mb-4"
                                                variant="danger"
                                                dismissible
                                                >{{error}}</b-alert>

                                                <form class="form-horizontal" @submit.prevent="forgotpassword">
                                                    <div
                                                    class="alert alert-success mb-4"
                                                    role="alert"
                                                    >Enter your Email and instructions will be sent to you!</div>
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-mail-line auti-custom-input-icon"></i>
                                                        <label for="email">Email</label>
                                                        <input
                                                            v-model="email"
                                                            class="form-control"
                                                            id="email"
                                                            v-validate="'required|email'"
                                                            name="email"
                                                            placeholder="Enter email"
                                                            :class="{
                                                              'is-invalid': submitted && $v.email.$error,
                                                            }"
                                                        />
                                                        <p class="text-danger text-sm" v-show="errors.has('email')">
                                                            {{ errors.first("email") }}
                                                        </p>

                                                        <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                                                            <span v-if="!$v.email.required">Email is required.</span>
                                                            <span v-if="!$v.email.email">Please enter valid email.</span>
                                                        </div>
                                                    </div>

                                                    <div class="mt-4 text-center">
                                                        <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                                            Send password reset email
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
    export default {
        data() {
            return {
                isVerify: false,
                email: "",
                submitted: false,
                error: null,
                tryingToReset: false,
                isResetError: false,
                isEmailSend: false
            };
        },
        created() {
        },
        methods: {
            forgotpassword() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        console.log(this.email)
                        let loader = this.$loading.show({
                            loader: "dots",
                        });
                        this.$store.getters.client
                            .post(`/orgadmin/forgotpassword`, {
                                email: this.email
                            })
                            .then(res => {
                                loader.hide();
                                console.log(res)
                                if(res)
                                {
                                    if(res.data.message == "success"){
                                        this.isEmailSend = true;
                                    }
                                    else{
                                        this.isEmailSend = false;
                                    }
                                }
                                
                            })
                            .catch(() => {
                                // loading is disabled if error comes on organization details fetch
                                this.isLoading = false;
                                loader.hide();
                            });

                        // this.$store.getters.client
                        //     .post(`/github/authtoken`, {
                        //         email: this.email
                        //     })
                        //     .then(() => {
                        //         // console.log(res)
                        //     })
                        //     .catch(() => {
                        //         // loading is disabled if error comes on organization details fetch
                        //         this.isLoading = false;
                        //     });
                        // let loader = this.$loading.show({
                        //     loader: "dots",
                        // });
                        // this.$store
                        //     .dispatch("obtainToken", {
                        //         email: this.email,
                        //         password: this.password,
                        //     })
                        //     .then(() => {
                        //         loader.hide();
                        //         // this.$router.push({ name: "Dashboard" });
                        //     })
                        //     .catch((error) => {
                        //         this.error = error.response.data;
                        //         this.isResetError = true;
                        //         loader.hide();
                        //     });
                    }
                });
            }
        },
    };
</script>

<style scoped>
.auth-form-group-custom .auti-custom-input-icon {
    top: 30px;
}
</style>