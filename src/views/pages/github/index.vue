<template>
    <div>
        <PageHeader :icon="'mdi mdi-clipboard-multiple h3'" :title="title" :items="items" />
        <!-- Repo List -->
        <div v-if="this.sgitrepodata.status !== 401">
            <div class="text-center mb-3 p-5" v-if="!this.sgitrepodata.slice">
                <b-spinner variant="primary" v-if="isLoading"></b-spinner>
            </div>
            <div v-if="this.sgitrepodata.slice">
                <!-- <div class="row mb-3" v-if="!_.isEmpty(sgitrepodata)">
                    <div class="col-md-4 col-12">
                        <div class="search-box text-right list-inline">
                            <div class="position-relative">
                                <input type="text" class="form-control rounded border-0 cust-input-box" placeholder="Search Projects..." id="myInput" v-model="filter" />
                                <i class="mdi mdi-magnify search-icon"></i>
                            </div>
                        </div>
                    </div>
                </div> -->

                <div class=" mb-3" v-if="!_.isEmpty(sgitrepodata)">
                    <div class="d-flex align-items-center mb-3">
                        <div class="search-box text-right list-inline">
                            <div class="position-relative">
                                <input type="text" class="form-control rounded border-0 cust-input-box"
                                    placeholder="Search Projects..." id="myInput" v-model="filter" />
                                <i class="mdi mdi-magnify search-icon"></i>
                            </div>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <b-button class="puser-btn" variant="primary" size="sm"
                            style="display: inline; float: right; margin-left: auto;" v-on:click="projectSync()">
                            <!-- <i class="mdi mdi-folder-refresh search-icon mdi-24px"></i> Refresh -->
                            <span class="">
                                <i class="mdi mdi-folder-refresh mdi-18px"></i>
                            </span>
                            <span class="font-size-15 ml-2">Refresh</span>
                        </b-button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4" v-for="(data, index) in repoSliceList" :key="index">
                        <a :href="`/github/repo/${data.id}`">
                            <b-card no-body>
                                <b-card-body style="background: #172592; border-radius: 4px 4px 0px 0px;">
                                    <b-card-title>
                                        <h5 class="card-title" style="color: #ffffff;">
                                            <span><i class="mdi mdi-folder pr-1"></i></span>
                                            {{ data.projectName }}
                                        </h5>
                                    </b-card-title>
                                    <b-card-sub-title> </b-card-sub-title>
                                </b-card-body>
                                <b-card-body style="border: 1px solid #081f94; border-radius: 0px 0px 4px 4px;">
                                    <b-card-text class="card-text-project">
                                        <span
                                            class="badge badge-soft-warning badge-soft-warning-project">Collaborators</span>
                                        {{ data.gitCollaboratorsCount }}
                                        <!-- <span class="badge badge-soft-warning badge-soft-warning-project">Collaborators</span> {{ !_.isEmpty(projectList) ? _.filter(projectList, { projecDetails: { id: data.id
                                        } })[0].projectCollaborator[0].length : 10 }} -->
                                        <!-- <span class="badge badge-soft-warning badge-soft-warning-project" v-if="!_.isEmpty(projectList)">Collaborators</span> {{ !_.isEmpty(projectList) ? _.filter(projectList, { projecDetails: { id: data.id
                                        } })[0].projectCollaborator[0]?.length : 10 }} -->
                                    </b-card-text>
                                    <b-card-text class="card-text-project">
                                        <!-- <span class="badge badge-soft-success badge-soft-warning-project">User</span> {{ !_.isEmpty(projectList) ? _.filter(projectList, { projecDetails: { id: data.id }
                                        })[0].projectUsers[0].length : 10 }} -->
                                        <!-- <span class="badge badge-soft-success badge-soft-warning-project" v-if="!_.isEmpty(projectList)">User</span> {{ !_.isEmpty(projectList) ? _.filter(projectList, { projecDetails: { id: data.id }
                                        })[0].projectUsers[0]?.length : 10 }} -->
                                        <span class="badge badge-soft-success badge-soft-warning-project">User</span> {{
                                            data.projectUserCount }}
                                    </b-card-text>
                                    <b-button :href="`/github/repo/${data.id}`" size="sm" class="btn btn-success"
                                        style="float: right;">
                                        Details
                                    </b-button>
                                </b-card-body>
                            </b-card>
                        </a>
                    </div>
                </div>
                <div v-if="!_.isEmpty(sgitrepodata) && repoSliceList.length === 0">
                    <div class="row ">
                        <div class="col-xl-12">
                            <div class="text-center card border border-primary">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mt-1 maintenance-box">
                                            <div class="p-3">
                                                <div class="avatar-sm mx-auto">
                                                    <span class="">
                                                        <i
                                                            class="mdi mdi-magnify-close mdi-36px font-size-24 text-primary"></i>
                                                    </span>
                                                </div>
                                                <h3 class="mt-4">There are no records matching your request</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- end row -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Paginantion -->
                <div class="row" v-if="!_.isEmpty(sgitrepodata)">
                    <div class="col-lg-12">
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
                            class="float-right"></b-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- Apps Card -->
        <div class="row mt-2" v-if="!_.isEmpty(this.appAccess)">
            <div class="col-lg-12">
                <b-card class="pj-action-card" v-if="this.appAccess.docManager">
                    <b-card-title>
                        <div class="float-left">
                            <i class="d-inline-block ri-bookmark-fill cmh-icon"></i>
                        </div>
                        <div class="float-left">
                            <h1 class="d-inline-block rl-title cnt-main-cls1">
                                DocManager
                            </h1>
                            <!-- <p class="rl-subtitle">Web Editor</p> -->
                        </div>
                    </b-card-title>
                </b-card>
                <b-card class="pj-action-card" v-if="this.appAccess.editor">
                    <b-card-title>
                        <div class="float-left">
                            <i class="d-inline-block ri-pencil-fill cmh-icon"></i>
                        </div>
                        <div class="float-left">
                            <h1 class="d-inline-block rl-title">DocEditor</h1>
                            <p class="rl-subtitle">Web Editor</p>
                        </div>
                    </b-card-title>
                </b-card>
                <b-card class="pj-action-card" v-if="this.appAccess.publisher">
                    <b-card-title>
                        <div class="float-left">
                            <i class="d-inline-block mdi mdi-book-open-variant cmh-icon"></i>
                        </div>
                        <div class="float-left cnt-main-cls2">
                            <h1 class="d-inline-block rl-title">DocPublisher</h1>
                            <!-- <p class="rl-subtitle">Web Editor</p> -->
                        </div>
                    </b-card-title>
                </b-card>
            </div>
        </div>
        <!-- Github login modal -->
        <div>
            <div class="my-4 text-center">
                <b-modal id="modal-standard" :no-close-on-backdrop="true" close-disabled="true" ref="modal"
                    title="Github Login" title-class="font-18" hide-footer>
                    <template #modal-header>
                        <h5 class="modal-title font-18">Github Login</h5>
                    </template>
                    <div class="row">
                        <div class="col-lg-12">
                            <b-card no-body class="text-center">
                                <b-card-body>
                                    <img src="@/assets/images/octocat.png" height="200" />
                                    <b-card-title>
                                        <h4 class="card-title">Connect with github</h4>
                                    </b-card-title>
                                    <b-card-text>
                                        To access the project using github need to login in github
                                    </b-card-text>
                                    <a :href="clientId" class="btn btn-primary btn-block">Login</a>
                                </b-card-body>
                            </b-card>
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";
import _ from "lodash";
import axios from 'axios';
import PageHeader from "@/components/page-header";
import { URL } from '@/api/global.env.js'
export default {
    components: {
        PageHeader,
    },
    page: {
        title: "All Repository",
    },
    data() {
        return {
            title: "Project",
            items: [
                {
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "Projects",
                    active: true
                }
            ],
            username: "",
            repocoldata: [],
            gitToken: null,
            apiURL: process.env.VUE_APP_DATABASEURL,
            appgituser: [],
            clientId: `https://github.com/login/oauth/authorize?client_id=8d53f7d23e73bb1c6b87&scope=repo&redirect_uri=${URL}api/orgadmin/github/callback`,
            perPage: 6,
            currentPage: 1,
            orgID: localStorage.getItem("orgId"),
            appAccess: {},
            isLoading: false,
            orgGithubUser: "",
            orgAccessURL: "",
            orgAccessGithubUsername: "",
            projectList: "",
            filter: "",
            userId: localStorage.getItem("userId"),
            gitCode: null,
        };
    },
    computed: {
        ...mapState(["sgitrepodata"]),
        // row count for pagination
        rows() {
            return this.filteredProjects.length;
            // return this.sgitrepodata.length;
        },
        // repo data slice for pagination
        repoSliceList() {
            if (this.filteredProjects) {
                return this.filteredProjects.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
            } else {
                return null;
            }
        },
        _() {
            return _;
        },
        filteredProjects() {
            return this.sgitrepodata.filter((user) => {
                const filter = this.filter.toUpperCase();
                // const hasIdMatch = String(user.id).includes(filter);
                // const hasNameMatch = user.projectName.toUpperCase().startsWith(filter);
                const hasNameMatch = user.projectName.toUpperCase().startsWith(filter);

                return hasNameMatch;
            });
        },
    },
    created() {
        this.gitToken = localStorage.getItem("gitToken");
        this.orgId = localStorage.getItem("orgId");
        this.userId = localStorage.getItem("userId");
        this.userGithubUsername = localStorage.getItem("githubUsername");
        this.getToken();
    },
    mounted() {
        if (this.gitToken === "" || this.gitToken === null || this.gitToken === "null" || this.gitToken === undefined || this.gitToken === "undefined") {
            this.$refs["modal"].show();
        } else {
            this.getGitRepoDetails();
            if (this.repoSliceList.length === 0) {
                this.getProjects()
            }
        }
        // this.getGitRepoDetails();
        this.getOrgDetails();
    },
    methods: {
        ...mapActions({ get: "githubApiRequest" }),
        // This method is use to generate error or success message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        // This method is use to validate get token using github api
        async getToken() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const gitCode = urlParams.get("code");
            this.gitCode = gitCode;
            if (!gitCode) { return; }
            let userIP = await fetch("https://api.ipify.org?format=json")
                .then((x) => x.json())
                .then(async ({ ip }) => {
                    return ip;
                });

            await this.getOrgDetails();
            this.$store.getters.client
                .get(`/orgadmin/success?code=${gitCode}`)
                .then((res) => {
                    if (res.data.userData.login) {
                        let domainVerify = null;
                        let githubUserNameVerify = null;
                        if (res.data.userData.email) {
                            // Split orgGithubURL using a forward slash
                            let gitUrlSplitArr = res.data.userData.email.split("@");
                            // The array github url split initialize on data variable
                            domainVerify = gitUrlSplitArr[1];

                            githubUserNameVerify = res.data.userData.login;
                        }
                        if (domainVerify === this.orgAccessURL && githubUserNameVerify === this.orgAccessGithubUsername) {
                            this.$refs["modal"].hide()
                            if (res.data.access_token !== null || res.data.access_token !== "") {
                                this.gitToken = res.data.access_token;
                                this.username = res.data.userData.login;
                            }
                            if (res.data.access_token !== "") {
                                this.$store.commit("updateGitToken", {
                                    gitToken: res.data.access_token,
                                });
                                let gitAuthObj = {
                                    userId: this.$store.state.Auth.userId,
                                    orgId: this.$store.state.Auth.orgId,
                                    username: res.data.userData.login,
                                    email: res.data.userData.email,
                                    token: res.data.access_token,
                                    refreshToken: res.data.access_token,
                                    lastLoginIpAddress: userIP,
                                };
                                // Add GitToken in database
                                this.$store.getters.client
                                    .post(`/github/authtoken`, gitAuthObj)
                                    .then(() => {
                                        // console.log(res)
                                    })
                                    .catch(() => {
                                        // loading is disabled if error comes on organization details fetch
                                        this.isLoading = false;
                                    });
                                let loader = this.$loading.show({
                                    loader: "dots",
                                });
                                this.getProjects()
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
                        } else {
                            this.messageToast("Invalid Email or Github Username", "danger", `You have to login in github using your organization email or registered github username`);
                        }
                    }
                    return res;
                })
                .then(() => {
                    // if user is already login on github then hide modal or else show
                    if (this.gitToken === "" || this.gitToken === null || this.gitToken === "null" || this.gitToken === undefined || this.gitToken === "undefined") {
                        this.$refs["modal"].show();
                    } else {
                        this.$refs["modal"].hide();
                    }
                    // get project list from github
                    this.$store.getters.client
                        // .get(`project/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                        .get(`orgadmin/project?orgId=${this.$store.state.Auth.orgId}`)
                        .then((response) => {
                            this.$store.commit("setGitRepoDetails", response);
                            if (response.data.status == 401) {
                                this.messageToast("Error", "danger", `Error on get repolist : ${response.data.message}`);
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            this.apiError(err, this.$store);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // This method is use to Get repo details
        getGitRepoDetails() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                // .get(`project/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                .get(`orgadmin/project?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    // let projectListArr = [];
                    // // this is temporary logic api side code is remain to fix once fix remove this code from start temp to end temp comment
                    // // start temp
                    // response.data.forEach((element) => {
                    //     let projectUser = [];
                    //     this.$store.getters.client.get(`/projectuser/byprojectid?projectId=${element.id}`).then((response) => {
                    //         projectUser.push(response.data);
                    //     });
                    //     let projectCollaborators = [];
                    //     this.$store.getters.client.get(`orgadmin/repocollaborators?repoUser=${element.owner}&repoName=${element.projectName}`).then((response) => {
                    //         projectCollaborators.push(response.data);
                    //     });
                    //     projectListArr.push({
                    //         projecDetails: element,
                    //         projectUsers: projectUser,
                    //         projectCollaborator: projectCollaborators,
                    //     });
                    // });
                    // this.projectList = projectListArr;
                    // end temp
                    this.$store.commit("setGitRepoDetails", response);
                    loader.hide();
                    if (response.data.status == 401) {
                        this.messageToast("Error", "danger", `Error on get repolist : ${response.data.message}`);
                    }
                })
                .catch((err) => {
                    // this.apiError(err.response.data.error, this.$store);
                    console.log(err);
                    loader.hide();
                });
        },
        // This method is use to redirect commit page
        redirectToCommit() {
            this.$router.push(this.$route.query.redirectFrom || { name: "repocommit" });
        },
        // This method is use to Get organization details
        async getOrgDetails() {
            // loading is enable till organization details not fetch
            this.isLoading = true;
            // Try requrest to get organization details
            this.$store.getters.client
                .get(`/serveradmin/organization/byorgid?orgId=${this.orgID}`)
                .then((res) => {
                    this.appAccess = res.data[0];
                    // loading is disabled once organization details not fetch
                    this.isLoading = false;
                    var str = res.data[0].orgGithubURL;
                    // Split orgGithubURL using a forward slash
                    let gitUrlSplitArr = str.split("/");
                    // The array github url split initialize on data variable
                    this.orgGithubUser = gitUrlSplitArr[3];
                    this.orgAccessURL = res.data[0].accessURL;
                    // this.orgAccessGithubUsername = res.data[0].orgGithubUser;
                    this.orgAccessGithubUsername = this.$store.state.Auth.githubUsername;
                })
                .catch((err) => {
                    console.log(err);
                    // loading is disabled if error comes on organization details fetch
                    this.isLoading = false;
                });
        },
        getProjects() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            let gitToken = localStorage.getItem('gitToken');
            let orgId = localStorage.getItem('orgId');
            let userId = localStorage.getItem('userId');
            let token = localStorage.getItem('token');
            axios({
                method: 'Post',
                url: `${URL}api/project/repo/sync?orgId=${orgId}&orgAdminId=${userId}`,
                headers: {
                    gitToken: gitToken,
                    Authorization: `Bearer ${token}`,
                    userId: localStorage.getItem('orgId'),
                    orgId: localStorage.getItem('orgId')
                }
            }).then((res) => {
                res
                this.messageToast("Success", "success", "Project Sync Successfully");
                setTimeout(this.getGitRepoDetails(), loader.hide(), 3000);
                loader.hide();
            }).catch((error) => {
                this.messageToast("Error", "danger", error.response.data.message);
                loader.hide();
            })

        },
        async projectSync() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                .post(`project/repo/sync?orgId=${this.orgID}&orgAdminId=${this.userId}`)
                .then((response) => {
                    response
                    this.messageToast("Success", "success", "Project Sync Successfully");
                    loader.hide();
                    setTimeout(this.getGitRepoDetails(), loader.hide(), 3000);
                })
                .catch((error) => {
                    this.messageToast("Error", "danger", error.response.data.message);
                    loader.hide();
                });
        }
    },
};
</script>

<style>
.pj-action-card {
    padding: 20;
}

.card.pj-action-card>.card-body {
    padding: 10px 15px !important;
}

.card.pj-action-card>.card-body>.card-title {
    margin: 0px !important;
}

.rl-title {
    color: #021559;
    font-size: 20px;
    vertical-align: text-bottom;
    padding-left: 10px;
    font-weight: 600;
    margin-bottom: 1px;
}

.rl-subtitle {
    color: #021559;
    padding-left: 12px;
    margin-bottom: 0px;
}

.cnt-main-cls1 {
    padding: 10px 10px;
}

.cnt-main-cls2 {
    padding: 10px 0px;
}

.badge-soft-warning-project {
    background-color: rgba(252, 185, 44, 0.18);
    color: #000 !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
}

.badge-soft-succes-project {
    background-color: rgba(28, 187, 140, 0.18);
    color: #000 !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
}

.card-text-project {
    margin-bottom: 0.5rem;
}

.cust-input-box {
    border: 1px solid #ced4da !important;
    background-color: #ffffff !important;
}
</style>