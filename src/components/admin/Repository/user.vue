<template>
    <div>
        <div class="d-flex align-items-center mb-3">
            <i class="d-inline-block mdi mdi-account-multiple cmh-icon"></i>
            <h1 class="d-inline-block cmh-title">USERS</h1>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <b-dropdown right menu-class="dropdown-menu-lg p-0 dropdown-menu-customcls" toggle-class="header-item noti-icon"
                variant="black" style="display: inline; float: right; margin-left: auto;">
                <template v-slot:button-content>
                    <b-button class="puser-btn" variant="primary" size="md">
                        <span>
                            <i class="d-inline-block mdi mdi-bell puser-icon text-white"></i>
                        </span>
                        <span class="noti-dot" v-if="!_.isEmpty(githubUserNotificaion)"></span>
                    </b-button>
                </template>
                <div class="p-3 border-bottom">
                    <div class="row align-items-center">
                        <div class="col">
                            <h6 class="m-0">{{ $t('navbar.dropdown.notification.text') }}</h6>
                        </div>
                    </div>
                </div>
                <div style="height: 250px; overflow: auto;">
                    <simplebar class="cust-simplebar-wrap">
                        <span href class="text-reset notification-item notification-item-customcls"
                            v-for="(data, index) in githubUserNotificaion" :key="index">
                            <div class="media">
                                <!-- <div class="avatar-xs mr-3">
                                <span class="avatar-title bg-primary rounded-circle font-size-16">
                                  <i class="ri-user-add-line"></i>
                                </span>
                              </div> -->
                                <div class="avatar-xs mr-1">
                                    <!-- <span class="avatar-title bg-primary rounded-circle font-size-16"> -->
                                    <img :src="data.avatar_url" height="20" alt="logo" />
                                    <!-- </span> -->
                                </div>
                                <div class="media-body">
                                    <h6 class="mt-0 mb-1">{{ data.login }}</h6>
                                    <div class="font-size-12 text-muted">
                                        <p class="mb-1">Do you want to add User?</p>
                                    </div>
                                </div>
                                <div class="ml-3">
                                    <b-button size="sm" variant="primary"
                                        v-on:click="openAddUserRoleModal(data)">Add</b-button>
                                </div>
                            </div>
                        </span>
                    </simplebar>
                </div>
            </b-dropdown>
        </div>
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
                                        <b-form-input v-model="filter" type="search" placeholder="Search Github Username..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="ProjectUserlist" :fields="colfields" :current-page="currentPage"
                                :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @filtered="onFiltered"
                                :filter-function="filterTable" ref="projectUserTable" stacked="md" show-empty small>
                                <template #cell(githubUsername)="row">
                                    {{ row.value }}
                                </template>

                                <template #cell(userRole)="row">
                                    {{ row.value.join(", ") }}
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div
                                class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <!-- rowcount -->
                                    <span class="py-2"> Total Rows: {{ this.ProjectUserlist.length }}</span>
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
                <b-modal id="modal-standard" ref="addUserRoleModel" title="ADD USER ROLE" title-class="font-18" hide-footer>
                    <div class="row" v-if="optionsUserlist.length === 1">
                        <div class="col-12">
                            <div class="text-center">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mt-1 maintenance-box">
                                            <div class="p-3">
                                                <div class="avatar-sm mx-auto">
                                                    <span class="avatar-title bg-soft-primary rounded-circle">
                                                        <i
                                                            class="mdi mdi-account-off-outline mdi-36px font-size-24 text-primary"></i>
                                                    </span>
                                                </div>
                                                <h3 class="mt-4">Max User Limit Reached</h3>
                                                <h5 class="font-size-15 text-uppercase mt-3">Do you need Support?</h5>
                                                <p class="text-muted mb-0">
                                                    If you want to increase user limit, you need to contact administrator
                                                    using this email..
                                                    <a href="mailto:techsupport@ditaxpresso.com"
                                                        class="text-decoration-underline">techsupport@ditaxpresso.com</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- end row -->
                            </div>
                        </div>
                    </div>
                    <div class="row" v-else>
                        <div class="col-lg-12">
                            <form class="form-horizontal" @submit.prevent="addUserRole" ref="formAddUserRole">
                                <div class="form-group">
                                    <label for="githubUsername">Github Username</label>
                                    <input v-validate="'required'" v-model="addUserRoleFormData.githubUsername"
                                        name="githubUsername" type="text" class="form-control disable-cust-cls"
                                        id="githubUsername" placeholder="Enter Github Username" :class="{
                                            'is-invalid': submitted && $v.githubUsername.$error,
                                        }" disabled />
                                    <p class="text-danger text-sm" v-show="errors.has('githubUsername')">
                                        The Github Username field is required
                                    </p>
                                </div>
                                <div class="form-group" v-if="_.isEmpty(this.userProfile)">
                                    <label for="users">Users</label>
                                    <b-form-select :options="optionsUserlist" v-validate="'required'"
                                        v-model="addUserRoleFormData.seletedUser" name="users" type="text"
                                        class="form-control" id="users" placeholder="selct users" :class="{
                                            'is-invalid': submitted && $v.users.$error,
                                        }"></b-form-select>
                                    <p class="text-danger text-sm" v-show="errors.has('users')">
                                        The users field is required
                                    </p>
                                </div>
                                <div class="form-group" v-else>
                                    <label for="users">Users</label>
                                    <b-form-select :options="optionsUserlistAssignUser" v-validate="'required'"
                                        v-model="addUserRoleFormData.seletedUser" name="users" type="text"
                                        class="form-control" id="users" placeholder="selct users" :class="{
                                            'is-invalid': submitted && $v.users.$error,
                                        }" disabled></b-form-select>
                                    <p class="text-danger text-sm" v-show="errors.has('users')">
                                        The users field is required
                                    </p>
                                </div>
                                <div class="form-group">
                                    <label for="roles">Roles</label>
                                    <b-form-checkbox-group :options="optionsRoles" v-validate="'required'"
                                        v-model="addUserRoleFormData.seletedRole" name="roles" type="text" id="roles"
                                        :class="{
                                            'is-invalid': submitted && $v.roles.$error,
                                        }"></b-form-checkbox-group>
                                    <p class="text-danger text-sm" v-show="errors.has('roles')">
                                        The roles field is required
                                    </p>
                                </div>
                                <div v-if="showDocMigration" class="form-group ">
                                    <label>Select options for DocMigration <span class="text-danger">*</span></label>
                                    <div>
                                        <select v-model="addUserRoleFormData.DocMigrationType" required class="form-control">
                                            <option v-for="(option, index) in DocMigrationOptions" :value="option.value"
                                                :key="'option_' + index">{{
                                                    option.label }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
                                        Submit
                                    </button>
                                    &nbsp;&nbsp;
                                    <b-button class="btn btn-secondry w-md waves-effect waves-light"
                                        v-on:click="closeAddUserRoleModel()">Cancel</b-button>
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
// import axios from 'axios'
import _ from "lodash";
import simplebar from "simplebar-vue";

export default {
    components: { simplebar },
    props: ["projectData"],
    data() {
        return {
            ProjectUserlist: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "published_at",
            sortDesc: true,
            colfields: [
                { key: "githubUsername", label: "Github Username", sortable: false },
                { key: "userRole", label: "Role", sortable: false },
            ],
            githubUsername: "",
            usersList: [
                { id: "1", name: "Select Users" },
                { id: "2", name: "User 01" },
            ],
            optionsUserlist: [{ value: null, text: "Please select an user", disabled: true }],
            optionsUserlistAssignUser: [{ value: null, text: "Please select an user", disabled: true }],
            submitted: false,
            githubUserNotificaion: [],
            addUserRoleFormData: {
                githubUsername: "",
                seletedUser: null,
                seletedRole: [],
                githubUserId: "",
                DocMigrationType:[],
            },
            inactiveUserData: "",
            selected: [], // Must be an array reference!
            options: [
                { text: "Orange", value: "orange" },
                { text: "Apple", value: "apple" },
                { text: "Pineapple", value: "pineapple" },
                { text: "Grape", value: "grape" },
            ],
            DocMigrationOptions: [
                { value: "Word to DITA", label: "Word to DITA" },
            ],
            showDocMigration: false,
            optionsRoles: [],
            appAccess: "",
            projectDataTemp: "",
            userProfile: "",
        };
    },
    created() {
        this.getUserList();
        // this.getUserNotification();
        this.getInactiveUserData();
        this.getOrgDetails();
        this.getProjectDetails();
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.ProjectUserlist.length;
        },
        _() {
            return _;
        },
    },
    watch: {
        'addUserRoleFormData.seletedRole': function (newVal) {
            if (newVal.includes('DocMigration')) {
                this.showDocMigration = true;
            } else {
                this.showDocMigration = false;
            }
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.ProjectUserlist.length;
    },
    methods: {
        /**
         * Search the table data with search input
         */
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
        async getUserList() {
            this.$store.getters.client
                // .get(`/projectuser`)
                .get(`/projectuser/byprojectid?projectId=${this.$route.params.id}`)
                .then((response) => {
                    this.ProjectUserlist = response.data;
                });
        },
        async getUserNotification() {
            this.$store.getters.client
                .post(`/projectuser/project/git/notification?projectId=${this.$route.params.id}`, {
                    repoUser: this.projectDataTemp.owner,
                    repoName: this.projectDataTemp.projectName,
                })
                .then(async (response) => {
                    let filterGithubUserNotificaion = await _.reject(response.data, { login: this.$store.state.Auth.githubUsername });
                    this.githubUserNotificaion = filterGithubUserNotificaion;
                });
        },
        getUserProfile(collaboratorId) {
            this.$store.getters.client
                .get(`orguser/details/bygithubCollaboratorid?collaboratorId=${collaboratorId}`)
                .then((response) => {
                    this.userProfile = response.data;
                    this.addUserRoleFormData.seletedUser = response.data;
                    if (!this._.isEmpty(response.data)) {
                        this.optionsUserlistAssignUser.push({
                            value: response.data.id,
                            text: response.data.username,
                        });
                        this.addUserRoleFormData.seletedUser = response.data.id;
                    }
                })
                .then(async () => {
                    // this.getAllCollaboratorsData();
                });
        },
        openAddUserRoleModal(data) {
            this.getUserProfile(data.id);
            this.addUserRoleFormData.githubUsername = data.login;
            this.addUserRoleFormData.githubUserId = data.id;
            this.$refs["addUserRoleModel"].show();
        },
        closeAddUserRoleModel() {
            this.addUserRoleFormReset();
            this.$refs["addUserRoleModel"].hide();
        },
        addUserRoleFormReset() {
            // Resetting Values
            (this.addUserRoleFormData.githubUsername = ""), (this.addUserRoleFormData.seletedUser = null), (this.addUserRoleFormData.seletedRole = []);
            // this.currentPassword = this.password = this.password_confirmation = "";
            this.$refs.formAddUserRole.reset();
        },
        getInactiveUserData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                .get(`orguser/inactive/profile?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.inactiveUserData = response.data;
                    response.data.forEach((element) => {
                        if (element.isRoleAssign !== true) {
                            this.optionsUserlist.push({
                                value: element.id,
                                text: element.username,
                            });
                        } else {
                            this.optionsUserlist.push({
                                value: element.id,
                                text: element.username,
                                disabled: true,
                            });
                        }
                    });
                    loader.hide();
                })
                .catch((err) => {
                    console.log(err);
                    // this.optionsUserlist= [
                    //   { value: null, text: 'Please select an user', disabled: true }
                    // ]
                    loader.hide();
                });
        },
        // This method is use to Get organization details
        async getOrgDetails() {
            // Try requrest to get organization details
            this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                .then((res) => {
                    this.appAccess = res.data[0];
                    if (res.data[0].docManager) this.optionsRoles.push({ text: "DocManager", value: "DocManager" });
                    if (res.data[0].publisher) this.optionsRoles.push({ text: "DocPublisher", value: "DocPublisher" });
                    if (res.data[0].editor) this.optionsRoles.push({ text: "DocEditor", value: "DocEditor" });
                    if (res.data[0].docMigration) this.optionsRoles.push({ text: "DocMigration", value: "DocMigration" });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        addUserRole() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let filterUser = this._.filter(this.inactiveUserData, { id: this.addUserRoleFormData.seletedUser });
                    let data = {
                        githubProjectId: this.projectDataTemp.projectRepoId,
                        projectId: this.$route.params.id,
                        userId: this.addUserRoleFormData.seletedUser,
                        DocMigrationType: this.addUserRoleFormData.DocMigrationType,
                        githubUsername: this.addUserRoleFormData.githubUsername,
                        githubEmail: !this.userProfile ? filterUser[0].githubEmail : this.userProfile.githubEmail,
                        githubUserId: this.addUserRoleFormData.githubUserId,
                        userRole: this.addUserRoleFormData.seletedRole,
                        acceptInvitation: false,
                        isActive: false,
                        isDeleted: false,
                        projectName: this.projectDataTemp.projectName
                    };
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .post(`projectuser/assigngituser`, data)
                        .then(() => {
                            // Resetting Values
                            this.addUserRoleFormReset();
                            this.messageToast("Success", "success", `User role assign successfully`);
                            loader.hide();
                            this.$refs["addUserRoleModel"].hide();
                            this.getUserNotification();
                            this.getUserList();
                            this.getInactiveUserData();
                        })
                        .catch((error) => {
                            this.messageToast("Error", "danger", error.response.data.message);
                            loader.hide();
                        });
                }
            });
        },
        async getProjectDetails() {
            this.$store.getters.client
                .get(`project/byprojectid?projectId=${this.$route.params.id}`)
                .then((res) => {
                    this.projectDataTemp = res.data[0];
                })
                .then(() => {
                    this.getUserNotification();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        filterTable(row, filter) {
            const filterUpperCase = filter.toUpperCase();
            const hasNameMatch = row.githubUsername.toUpperCase().startsWith(filterUpperCase);
            // const hasNameMatch = row.commit.message.startsWith(filter);
            return hasNameMatch;
        },
    },
};
</script>

<style scoped>
.cmh-title {
    color: #021559;
    font-size: 20px;
    vertical-align: text-bottom;
    padding-left: 10px;
    font-weight: 600;
    margin-bottom: 0px;
}

.cmh-icon {
    color: #021559;
    font-size: 35px;
}

.puser-icon {
    font-size: 25px;
    margin: 0px;
    padding: 0px;
    line-height: 1;
}

.puser-btn {
    padding: 2px 5px;
}

.customcls>.media {
    padding: 0.75rem 1rem;
}

.customcls>.media:hover {
    background-color: unset !important;
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

.disable-cust-cls {
    background: #e7e7e8 !important;
    color: #838588 !important;
}

.custom-select:disabled {
    color: #838588 !important;
    background: #e7e7e8 !important;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
    .cust-simplebar-wrap {
        width: 265px;
    }

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
    .cust-simplebar-wrap {
        width: 265px;
    }

    .row-count-cust-cls ul {
        /* float: right !important; */
        margin-bottom: 10px;
        text-align: left !important;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
    .cust-simplebar-wrap {
        width: auto;
    }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    .cust-simplebar-wrap {
        width: auto;
    }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .cust-simplebar-wrap {
        width: auto;
    }
}
</style>