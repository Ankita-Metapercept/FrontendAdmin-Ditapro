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
                                                <h4 class="font-size-18 mt-4">Welcome !</h4>
                                                <p class="text-muted">
                                                    Verify to continue to DITAxPresso Client Admin.
                                                </p>
                                            </div>
                                            <b-alert v-if="isVerify === false" show variant="danger">
                                                Token expired! If you wish to obtain another link, please contact the
                                                administrator using this email address.
                                                <a href="mailto:techsupport@ditaxpresso.com"
                                                    class="text-decoration-underline">techsupport@ditaxpresso.com</a>
                                            </b-alert>
                                            <b-alert v-else show variant="success">Your account has been successfully
                                                verified, and detailed instructions will be promptly sent to your email
                                                address!</b-alert>

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
    </div>
</template>

<script>
export default {
    data() {
        return {
            isVerify: false,
        };
    },
    created() {
        this.tokenVerify()
    },
    methods: {
        async tokenVerify() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            console.log("github verificaiton token")
            console.log(this.$route.params.token)
            // setTimeout(function () {
            //     loader.hide();
            // }, 500);
            this.$store.getters.client.put(`orgadmin/emailverification?token=${this.$route.params.token}`)
                .then((response) => {
                    console.log("token verication status")
                    console.log(response);
                    this.isVerify = true;
                    loader.hide();
                })
                .catch(() => {
                    this.isVerify = false;
                    loader.hide();
                });
        },
    },
};
</script>

<style></style>