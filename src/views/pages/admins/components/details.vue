<template>
    <div>
        <!-- <div class="d-flex align-items-center mb-3">
            <i class="d-inline-block mdi mdi-account-supervisor cmh-icon"></i>
            <h1 class="d-inline-block cmh-title">Admins ({{ orgName }})</h1>
        </div> -->
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
                                        <b-form-input v-model="filter" type="search" placeholder="Search Name..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="adminData" :fields="colfields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered"
                                :filter-function="filterTable" ref="adminTable" show-empty>
                                <template #cell(isEmailVerified)="row">
                                    <div class="badge font-size-12" :class="{
                                        'badge-soft-danger': `${row.item.isEmailVerified}` === 'false',
                                        'badge-soft-success': `${row.item.isEmailVerified}` === 'true'
                                    }">
                                        {{ row.item.isEmailVerified === true ? "Verified" : "Not Verified" }}
                                    </div>
                                </template>
                                <template #cell(status)="row">
                                    <div class="badge font-size-12" :class="{
                                        'badge-soft-danger': `${row.item.isActive}` === 'false',
                                        'badge-soft-success': `${row.item.isActive}` === 'true'
                                    }">
                                        {{ row.item.isActive === true ? "Active" : "Deactive" }}
                                    </div>
                                </template>
                                <template #cell(createdAt)="row">
                                    {{ moment(row.item.createdAt).format("YYYY-MM-DD") }}
                                </template>
                                <template #cell(action)="row">
                                    <b-dropdown right toggle-class="arrow-none card-drop" class="float-right"
                                        variant="white">
                                        <template v-slot:button-content>
                                            <i class="mdi mdi-dots-vertical"></i>
                                        </template>
                                        <!-- item-->
                                        <b-dropdown-item v-if="row.item.isActive === false" @click="active(row)"
                                            :ref="'btnActiveIna' + row.index">Active</b-dropdown-item>
                                        <!-- item-->
                                        <b-dropdown-item v-else @click="deactive(row)"
                                            :ref="'btnActiveIna' + row.index">De-Active</b-dropdown-item>
                                        <!-- item-->
                                        <b-dropdown-item @click="openChangePasswordModel(row)">Change
                                            Password</b-dropdown-item>
                                    </b-dropdown>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div
                                class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <!-- rowcount -->
                                    <span class="py-2"> Total Rows: {{ this.adminData.length }}</span>
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
                <b-modal id="modal-standard" ref="adminChangePasswordModal" title="Change Password" title-class="font-18"
                    hide-footer>
                    <div class="row">
                        <div class="col-lg-12">
                            <form class="form-horizontal" @submit.prevent="adminchangePassword"
                                ref="formAdminChangePasswords">
                                <div class="form-group">
                                    <label for="admin_password">New Password</label>
                                    <input v-validate="'required|verify_password'" v-model="admin_password"
                                        name="admin_password" type="password" class="form-control" id="admin_password"
                                        placeholder="Enter new password" :class="{
                                            'is-invalid': submitted && $v.admin_password.$error,
                                        }" ref="admin_password" />
                                    <p class="text-danger text-sm"
                                        v-show="errors.has('admin_password') && _.find(errors.items, { field: 'admin_password' }).rule == 'required'">
                                        <span>The password field is required</span>
                                    </p>
                                    <p class="text-danger text-sm"
                                        v-show="errors.has('admin_password') && _.find(errors.items, { field: 'admin_password' }).rule == 'verify_password'">
                                        {{ errors.first("admin_password") }}
                                    </p>
                                </div>
                                <div class="form-group">
                                    <label for="admin_password_confirmation">Confirm Password</label>
                                    <input v-validate="'required|confirmed:admin_password'"
                                        v-model="admin_password_confirmation" name="admin_password_confirmation"
                                        type="password" class="form-control" id="admin_password_confirmation"
                                        placeholder="Enter password" :class="{
                                            'is-invalid': submitted && $v.admin_password_confirmation.$error,
                                        }" />
                                    <p class="text-danger text-sm" v-show="errors.has('admin_password_confirmation')">
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
import moment from "moment";
import VeeValidate from "vee-validate";
import Swal from "sweetalert2";
import _ from "lodash";
export default {
    data() {
        return {
            adminData: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "",
            sortDesc: true,
            colfields: [
                { key: "name", label: "Name", sortable: false },
                { key: "githubUsername", label: "Github Username", sortable: false },
                { key: "email", label: "Email", sortable: false },
                { key: "contact", label: "Contact", sortable: false },
                { key: "isEmailVerified", label: "Email Verified", sortable: false },
                { key: "status", label: "Status", sortable: false },
                { key: "action", label: "", sortable: false },
                // { key: "createdAt", label: "CreatedAt", sortable: false }
            ],
            orgName: "",
            admin_password: null,
            admin_password_confirmation: null,
            error: null,
            submitted: false,
            adminPsswordTempData: "",
        };
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.adminData.length;
        },
        _() {
            return _;
        },
    },
    created() {
        this.getAdminData();
        this.getOrgDetails();
        VeeValidate.Validator.extend("verify_password", {
            getMessage: () => `The password must contain at least: minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
            validate: (value) => {
                var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})");
                return strongRegex.test(value);
            },
        });
    },
    methods: {
        moment,
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
        getAdminData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client.get(`orgadmin/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.adminData = response.data;
                    loader.hide();
                })
                .catch((err) => {
                    loader.hide();
                    console.log(err);
                })
        },
        filterTable(row, filter) {
            const filterUpperCase = filter.toUpperCase();
            const hasNameMatch = row.name.toUpperCase().startsWith(filterUpperCase);
            return hasNameMatch;
        },
        async getOrgDetails() {
            // Try requrest to get organization details
            this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                .then((res) => {
                    this.orgName = res.data[0].name;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // Inactive admin by Id
        deactive(data) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to de-active this admin!",
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
                        .put(`orgadmin/activeinactive/profile`, {
                            orgAdminId: data.item.id,
                            isActive: false,
                        })
                        .then(() => {
                            this.getAdminData();
                            this.$refs.adminTable.refresh();
                            this.$refs["adminTable"].refresh();
                            loader.hide();
                            Swal.fire("De-Active!", "Admin has been de-active.", "success");
                        })
                        .catch((error) => {
                            loader.hide();
                            if (error.response.data.message == "Another device has login with your account!") {
                                localStorage.clear()
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Another device has logged in with your account!',
                                }).then(() => {
                                    window.location.href = '/';
                                });
                            }
                            if (error.response.data.message == "Invalid Token") {
                                localStorage.clear()
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Your session has expired. Please log in again to continue accessing the DITAxPresso. ',
                                }).then(() => {
                                    window.location.href = '/';
                                });
                            }
                            if (error.response.data.message == "The current subscription of your organization has been expired !") {
                                localStorage.clear()
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'The current subscription of your organization has been expired. Please ask your organization to renew the subscription plan to use our services again. Thank you!',
                                }).then(() => {
                                    window.location.href = '/';
                                });
                            }

                        })
                }
            });
        },
        // Active admin by Id
        active(data) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to active this admin!",
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
                        .put(`orgadmin/activeinactive/profile`, {
                            orgAdminId: data.item.id,
                            isActive: true,
                        })
                        .then(() => {
                            this.getAdminData();
                            this.$refs.adminTable.refresh();
                            this.$refs["adminTable"].refresh();
                            loader.hide();
                            Swal.fire("Active!", "Admin has been active.", "success");
                        })
                        .catch(() => {
                            loader.hide();
                        });
                }
            });
        },
        openChangePasswordModel(data) {
            this.adminPsswordTempData = data;
            this.$refs["adminChangePasswordModal"].show();
        },
        closeChangePasswordModel() {
            // Resetting Values
            this.admin_password = this.admin_password_confirmation = "";
            this.$refs.formAdminChangePasswords.reset();
            this.$refs["adminChangePasswordModal"].hide();
        },
        // Change Password By Admin Id
        adminchangePassword() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .put(`/orgadmin/changepassword/byadminid`, {
                            orgAdminId: this.adminPsswordTempData.item.id,
                            password: this.admin_password,
                        })
                        .then((res) => {
                            // Resetting Values
                            this.admin_password = this.admin_password_confirmation = "";
                            this.$refs.formAdminChangePasswords.reset();
                            console.log(res);
                            this.messageToast("Success", "success", `Password reset successfully`);
                            loader.hide();
                            this.$refs["adminChangePasswordModal"].hide();
                            this.this.adminPsswordTempData = "";

                        })
                        .catch((error) => {
                            console.log(error);
                            this.messageToast("Error", "danger", error.response.data.message);
                            this.this.adminPsswordTempData = "";
                            loader.hide();

                        });
                }
            });
        },
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
