<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_length" class="dataTables_length">
                                    <label class="d-inline-flex align-items-center">
                                        Show&nbsp;
                                        <b-form-select v-model="perPage" size="sm"
                                            :options="pageOptions"></b-form-select>&nbsp;entries
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                                    <label class="d-inline-flex align-items-center">
                                        Search:
                                        <b-form-input v-model="filter" type="search" placeholder="Search Username..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="activeUserData" :fields="colfields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered"
                                :filter-function="filterTable" ref="activeUserTable" show-empty>
                                <template #cell(status)="row">
                                    <div class="badge font-size-12" :class="{
                                        'badge-soft-danger': `${row.item.isActive}` === 'false',
                                        'badge-soft-success': `${row.item.isActive}` === 'true'
                                    }">
                                        {{ row.item.isActive === true ? "Active" : "Deactive" }}
                                    </div>
                                </template>
                                <template #cell(action)="row">
                                    <b-dropdown right toggle-class="arrow-none card-drop" class="float-right"
                                        variant="white">
                                        <template v-slot:button-content>
                                            <i class="mdi mdi-dots-vertical"></i>
                                        </template>
                                        <!-- item-->
                                        <b-dropdown-item @click="userUpdate(row)"
                                            :ref="'btnActiveEdit' + row.index">Edit</b-dropdown-item>
                                        <!-- item-->
                                        <b-dropdown-item v-if="row.item.isActive === false" @click="active(row)"
                                            :ref="'btnActiveIna' + row.index">Active</b-dropdown-item>
                                        <!-- item-->
                                        <b-dropdown-item v-else @click="deactive(row)"
                                            :ref="'btnActiveIna' + row.index">De-Active</b-dropdown-item>
                                        <!-- item-->
                                        <b-dropdown-item @click="openChangePasswordModel()">Change
                                            Password</b-dropdown-item>
                                    </b-dropdown>
                                </template>
                                <template #cell(role)="row">
                                    {{ row.item.userRole.join(", ") }}
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div
                                class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <!-- rowcount -->
                                    <span class="py-2"> Total Rows: {{ this.activeUserData.length }}</span>
                                </ul>
                            </div>
                            <div class="row-pagination-cust-cls">
                                <ul class="pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination v-model="currentPage" :total-rows="rows"
                                        :per-page="perPage"></b-pagination>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div class="my-4 text-center">
                <b-modal id="modal-standard" ref="activeuserChangePasswordModal" title="Change Password"
                    title-class="font-18" hide-footer>
                    <div class="row">
                        <div class="col-lg-12">
                            <form class="form-horizontal" @submit.prevent="activeuserchangePassword"
                                ref="formActiveuserChangePasswords">
                                <div class="form-group">
                                    <label for="a_user_password">New Password</label>
                                    <input v-validate="'required|verify_password'" v-model="a_user_password"
                                        name="a_user_password" type="password" class="form-control" id="a_user_password"
                                        placeholder="Enter new password" :class="{
                                            'is-invalid': submitted && $v.a_user_password.$error,
                                        }" ref="a_user_password" />
                                    <!-- <p class="text-danger text-sm" v-show="errors.has('a_user_password') && errors.items[0].rule == 'required'">
                                         The new password field is required
                                    </p>
                                    <p class="text-danger text-sm" v-show="errors.has('a_user_password') && errors.items[0].rule == 'verify_password'">
                                        {{ errors.first("a_user_password") }}
                                    </p> -->
                                    <p class="text-danger text-sm"
                                        v-show="errors.has('a_user_password') && _.find(errors.items, { field: 'a_user_password' }).rule == 'required'">
                                        <span>The password field is required</span>
                                    </p>
                                    <p class="text-danger text-sm"
                                        v-show="errors.has('a_user_password') && _.find(errors.items, { field: 'a_user_password' }).rule == 'verify_password'">
                                        {{ errors.first("a_user_password") }}
                                    </p>
                                </div>
                                <div class="form-group">
                                    <label for="a_user_password_confirmation">Confirm Password</label>
                                    <input v-validate="'required|confirmed:a_user_password'"
                                        v-model="a_user_password_confirmation" name="a_user_password_confirmation"
                                        type="password" class="form-control" id="a_user_password_confirmation"
                                        placeholder="Enter password" :class="{
                                            'is-invalid': submitted && $v.a_user_password_confirmation.$error,
                                        }" />
                                    <p class="text-danger text-sm" v-show="errors.has('a_user_password_confirmation')">
                                        The password confirmation field does not match
                                    </p>
                                </div>

                                <div class="text-center">
                                    <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                        Save
                                    </button>
                                    &nbsp;&nbsp;
                                    <b-button class="btn btn-secondry w-md waves-effect waves-light"
                                        v-on:click="closeChangePasswordModel()">Cancel</b-button>
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
import Swal from "sweetalert2";
import { handleApiError } from '../../../../apiErrorHandler.js';
import _ from "lodash";
export default {
    data() {
        return {
            activeUserData: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "",
            sortDesc: true,
            colfields: [
                { key: "username", label: "Username", sortable: false },
                { key: "role", label: "Role", sortable: false },
                { key: "adminName", label: "Admin", sortable: false },
                { key: "status", label: "Status", sortable: false },
                { key: "action", label: "", sortable: false }
            ],
            a_user_password: null,
            a_user_password_confirmation: null,
            error: null,
            submitted: false,
        };
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.activeUserData.length;
        },
        _() {
            return _;
        },
    },
    created() {
        this.getActiveUserData();
        VeeValidate.Validator.extend('verify_password', {
            getMessage: () => `The password must contain at least: minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
            validate: value => {
                var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})");
                return strongRegex.test(value);
            }
        });
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        // This method is use to generate error or success message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getActiveUserData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client.get(`orguser/active/profile?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.activeUserData = response.data;
                    loader.hide();
                })
                .catch((err) => {
                    loader.hide();
                    handleApiError(err); 
                    this.messageToast("Error", "danger", err.response.data.message);
                    console.log("err in getActiveUserData", err);
                })
        },
        openChangePasswordModel() {
            this.$refs["activeuserChangePasswordModal"].show();
        },
        closeChangePasswordModel() {
            // Resetting Values
            this.a_user_password = this.a_user_password_confirmation = "";
            this.$refs.formActiveuserChangePasswords.reset();
            this.$refs["activeuserChangePasswordModal"].hide();
        },
        activeuserchangePassword() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .put(`/orguser/changepassword/byuserid`, {
                            userId: this.$store.state.Auth.userId,
                            password: this.a_user_password,
                        })
                        .then(() => {
                            // Resetting Values
                            this.a_user_password = this.a_user_password_confirmation = "";
                            this.$refs.formActiveuserChangePasswords.reset();
                            this.messageToast("Success", "success", `Password reset successfully`);
                            loader.hide();
                            this.$refs["activeuserChangePasswordModal"].hide();
                        })
                        .catch((error) => {
                            handleApiError(error); 
                            this.messageToast("Error", "danger", error.response.data.message);
                            loader.hide();
                        });
                }
            });
        },
        userUpdate(data) {
            this.$router.push({ path: `/userupdate/${data.item.id}` });
        },
        deactive(data) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to de-active this user!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, de-active it!",
            }).then((result) => {
                if (result.value) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .put(`orguser/activeinactive/profile`, {
                            userId: data.item.id,
                            isActive: false,
                        })
                        .then(() => {
                            this.getActiveUserData();
                            this.$refs.activeUserTable.refresh();
                            this.$refs["activeUserTable"].refresh();
                            loader.hide();
                            Swal.fire("De-Active!", "User has been de-active.", "success");
                        })
                        .catch((error) => {
                            console.log(error);
                            loader.hide();
                        });
                    // console.log(data);
                }
            });
        },
        active(data) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to active this user!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, active it!",
            }).then((result) => {
                if (result.value) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .put(`orguser/activeinactive/profile`, {
                            userId: data.item.id,
                            isActive: true,
                        })
                        .then(() => {
                            this.getActiveUserData();
                            this.$refs.activeUserTable.refresh();
                            this.$refs["activeUserTable"].refresh();
                            loader.hide();
                            Swal.fire("Active!", "User has been active.", "success");
                        })
                        .catch((error) => {
                            console.log(error);
                            // this.messageToast("Error", "danger", error.response.data.message);
                            loader.hide();
                        });
                }
            });
        },
        filterTable(row, filter) {
            const filterUpperCase = filter.toUpperCase();
            const hasNameMatch = row.username.toUpperCase().startsWith(filterUpperCase);
            // const hasNameMatch = row.commit.message.startsWith(filter);
            return hasNameMatch;
        }
    },
};
</script>

<style>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
    .row-count-cust-cls {
        /* float: right !important; */
        margin-bottom: 10px;
    }

    .row-pagination-cust-cls {
        margin-top: 20px;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .row-count-cust-cls ul {
        /* float: right !important; */
        margin-bottom: 10px;
        text-align: left !important;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {}
</style>