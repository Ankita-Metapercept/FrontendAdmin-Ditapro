<template>
    <div>
        <div class="d-flex align-items-center mb-3">
            <!-- <i class="d-inline-block mdi mdi-account-circle cmh-icon"></i>
            <h1 class="d-inline-block cmh-title">My Profile</h1> -->
            <b-button class="puser-btn" variant="primary" size="md" style="display: inline; float: right; margin-left: auto;" v-on:click="openChangePasswordModel()">
  <i class="fas fa-lock"></i> Change Password
</b-button>

        </div>

        <div class="card">
            <div class="card-body">
                <simplebar>
                    <span class="text-reset notification-item notification-item-customcls">
                        <div class="media border-bottom">
                            <div class="media-body">
                                <h6 class="mt-0 mb-1">Name</h6>
                                <div class="font-size-14" v-if="editName !== true">
                                    <p class="mb-1">{{uname}}</p>
                                </div>
                                <form class="form-horizontal" @submit.prevent="changeUname" ref="formName" v-if="editName === true">
                                    <div class="form-group">
                                        <input
                                            v-validate="'required'"
                                            v-model="formuname"
                                            name="uname"
                                            type="text"
                                            class="form-control"
                                            id="uname"
                                            placeholder="Enter name"
                                            :class="{
                                                'is-invalid': submitted && $v.uname.$error,
                                            }"
                                        />
                                        <p class="text-danger text-sm" v-show="errors.has('uname')">
                                             Name field is required
                                        </p>
                                    </div>
                                    <div class="text-center">
                                        <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                            Save
                                        </button>
                                        &nbsp;&nbsp;
                                        <b-button class="btn btn-secondry w-md waves-effect waves-light" v-on:click="cancelUname()">Cancel</b-button>
                                    </div>
                                </form>
                            </div>
                            <div class="Smr-3 btn-container" v-if="editName !== true">
                                <b-button size="sm" variant="success" v-on:click="editUname()">
                                    <span>
                                        <i class="d-inline-block mdi mdi-pencil puser-icon"></i>
                                    </span>
                                </b-button>
                            </div>
                        </div>
                    </span>
                    <span href class="text-reset notification-item notification-item-customcls">
                        <div class="media border-bottom">
                            <div class="media-body">
                                <h6 class="mt-0 mb-1">Email Address</h6>
                                <div class="font-size-14">
                                    <p class="mb-1">{{email}}</p>
                                </div>
                            </div>
                        </div>
                    </span>
                    <span href class="text-reset notification-item notification-item-customcls">
                        <div class="media border-bottom">
                            <div class="media-body">
                                <h6 class="mt-0 mb-1">Contact Number</h6>
                                <div class="font-size-14" v-if="editcontactNumber !== true">
                                    <p class="mb-1">{{contactNumber}}</p>
                                </div>
                                <form class="form-horizontal" @submit.prevent="changeContactNumber" ref="formContact" v-if="editcontactNumber === true">
                                    <div class="form-group">
                                        <vue-tel-input
                                            v-validate="'required|validate_contact'"
                                            v-model="formContactNumber"
                                            name="contactNumber"
                                            id="contactNumber"
                                            placeholder="Enter contact number"
                                            :class="{
                                                'is-invalid': submitted && $v.contactNumber.$error,
                                            }"
                                            @input="onInput"
                                            :autoFormat="true"
                                            mode="international"
                                        ></vue-tel-input>
                                        <p class="text-danger text-sm" v-show="errors.has('contactNumber')">
                                            {{errors.has('contactNumber') ? (errors.items[0].rule === 'required'? "Contact number field is required": "The Contact Number is not a valid number") : ""}}
                                        </p>
                                    </div>
                                    <div class="text-center">
                                        <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                            Save
                                        </button>
                                        &nbsp;&nbsp;
                                        <b-button class="btn btn-secondry w-md waves-effect waves-light" v-on:click="cancelContactNumber()">Cancel</b-button>
                                    </div>
                                </form>
                            </div>
                            <div class="Smr-3 btn-container" v-if="editcontactNumber !== true">
                                <b-button size="sm" variant="success" v-on:click="editContactNumber()">
                                    <span>
                                        <i class="d-inline-block mdi mdi-pencil puser-icon"></i>
                                    </span>
                                </b-button>
                            </div>
                        </div>
                    </span>
                </simplebar>
            </div>
        </div>

        <div>
            <div class="my-4 text-center">
                <b-modal id="modal-standard" ref="changePasswordModel" title="Change Password" title-class="font-18" hide-footer>
                    <div class="row">
                        <div class="col-lg-12">
                            <form class="form-horizontal" @submit.prevent="changePassword" ref="form">
                                <div class="form-group">
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
                                <div class="form-group">
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
                                <div class="form-group">
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

                                <div class="text-center">
                                    <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                        Save
                                    </button>
                                    &nbsp;&nbsp;
                                    <b-button class="btn btn-secondry w-md waves-effect waves-light" v-on:click="closeChangePasswordModel()">Cancel</b-button>
                                </div>
                            </form>
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>
    </div>
</template>

<script>
    import VeeValidate from "vee-validate";
    import _ from "lodash";
    import simplebar from "simplebar-vue";
    export default {
        components: { simplebar },
        data() {
            return {
                isAuthenticate: false,
                currentPassword: null,
                password: null,
                password_confirmation: null,
                validateCredentials: false,
                error: null,
                submitted: false,
                name: "",
                editName: false,
                formuname: "",
                uname: "",
                email: "",
                editcontactNumber: false,
                contactNumber: "",
                formContactNumber: "",
                phoneError: "",
                phoneNumber: "",
            };
        },
        created() {
            this.getProfileData();
            VeeValidate.Validator.extend("validate_contact", {
                getMessage: (field) => `The ${field} is not a valid number.`,
                validate: (value) =>
                    new Promise((resolve) => {
                        // console.log(this.phoneError)
                        // console.log(this.phoneNumber)
                        // console.log(this.isNumeric(this.phoneNumber))
                        // console.log(/^[0-9 ()+-]+$/.test(value))
                        resolve({
                            valid: value && this.phoneError.valid && /^[0-9 ()+-]+$/.test(value),
                        });
                    }),
            });
            VeeValidate.Validator.extend('verify_password', {
                getMessage: () => `The password must contain at least: minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
                validate: value => {
                    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})");
                    return strongRegex.test(value);
                }
            });
        },
        computed: {
            _() {
                return _;
            },
        },
        beforeDestroy() {
            this.$validator.resume();
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
            isNumeric(str) {
                // console.log("check is numeric")
                // console.log(str)
                // typeof str
                // console.log(str)
                // console.log("regex test result")
                // console.log(/^[0-9 ()+-]+$/.test(str))
                // let regexpattern = ("[^a-zA-Z0-9]+");
                // console.log(regexpattern.test(str))x
                if (typeof str != "string" || /^[0-9 ()+-]+$/.test(str)) return false; // we only process strings!
                return (
                    !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                ); // ...and ensure strings of whitespace fail
            },
            getProfileData() {
                let loader = this.$loading.show({
                    loader: "dots",
                });
                this.$store.getters.client.get(`orgadmin/byid?userId=${this.$store.state.Auth.userId}`)
                .then((response) => {
                    //   this.userprofile = response.data;
                    this.uname = response.data[0].name;
                    this.formuname = response.data[0].name;
                    this.email = response.data[0].email;
                    this.contactNumber = response.data[0].contact;
                    this.formContactNumber = response.data[0].contact;
                    loader.hide();
                })
                .catch((err)=>{
          loader.hide();
          console.log(err);
        })
            },
            openChangePasswordModel() {
                this.$refs["changePasswordModel"].show();
            },
            closeChangePasswordModel() {
                // Resetting Values
                this.currentPassword = this.password = this.password_confirmation = "";
                this.$refs.form.reset();
                this.$refs["changePasswordModel"].hide();
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
                                loader.hide();
                                this.$refs["changePasswordModel"].hide();
                            })
                            .catch((error) => {
                                this.messageToast("Error", "danger", error.response.data.message);
                                loader.hide();
                            });
                    }
                });
            },
            editUname() {
                this.$validator.resume();
                if (this.editName !== true) this.editName = true;
            },
            cancelUname() {
                this.$validator.pause();
                this.editName = false;
                this.formuname = this.uname;
            },
            changeUname() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        let loader = this.$loading.show({
                            loader: "dots",
                        });
                        this.$store.getters.client
                            .put(`orgadmin?orgAdminId=${this.$store.state.Auth.userId}`, {
                                name: this.formuname,
                            })
                            .then(() => {
                                this.messageToast("Success", "success", `Name update successfully`);
                                this.editName = false;
                                this.getProfileData();
                                loader.hide();
                            })
                            .catch((error) => {
                                this.messageToast("Error", "danger", error.response.data.message);
                                loader.hide();
                            });
                    }
                });
            },
            editContactNumber() {
                this.$validator.resume();
                if (this.editcontactNumber !== true) this.editcontactNumber = true;
            },
            cancelContactNumber() {
                this.$validator.pause();
                this.editcontactNumber = false;
                this.formContactNumber = this.contactNumber;
            },
            changeContactNumber() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        let loader = this.$loading.show({
                            loader: "dots",
                        });
                        this.$store.getters.client
                            .put(`orgadmin?orgAdminId=${this.$store.state.Auth.userId}`, {
                                contact: this.formContactNumber,
                            })
                            .then(() => {
                                this.messageToast("Success", "success", `Contact number update successfully`);
                                this.editcontactNumber = false;
                                this.getProfileData();
                                loader.hide();
                            })
                            .catch((error) => {
                                this.messageToast("Error", "danger", error.response.data.message);
                                loader.hide();
                            });
                    }
                });
            },
            // this method call on input tel number
            onInput(number, phoneObject) {
                this.phoneError = phoneObject;
                this.phoneNumber = number;
            },
        },
    };
</script>

<style>
    .btn-primary {
        background: #021559 !important;
        border: #021559 !important;
    }
    .notification-item .media:hover {
        background-color: unset;
    }
    .notification-item-customcls .media:hover {
        background-color: unset !important;
    }
    .notification-item-customcls .media {
        border-bottom: #f1f5f7 2px solid;
    }
    .notification-item-customcls:last-child .media {
        border-bottom: none;
    }
    .btn-container {
        margin: auto;
    }
    .custcls-input {
        padding-left: 0px !important;
    }
</style>