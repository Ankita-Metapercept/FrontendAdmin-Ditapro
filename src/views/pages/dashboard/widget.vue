<template>
    <div class="row">
        <div class="col-md-3" v-for="(data, index) in statData" :key="index">
            <div class="card">
                <div class="card-body count-card-body-cust">
                    <div class="media">
                        <div class="media-body overflow-hidden">
                            <p class="text-truncate font-size-14 mb-2 count-title-cust-cls">{{ data.title }}</p>
                            <h4 class="mb-0 count-val-cust-cls" v-if="data.title === 'Users'">
                                {{ activeUserData.length + inactiveUserData.length }}
                            </h4>
                            <h4 class="mb-0 count-val-cust-cls" v-else-if="data.title === 'Projects'">
                                {{ projectsList.length }}
                            </h4>
                            <h4 class="mb-0 count-val-cust-cls" v-else-if="data.title === 'Files'">
                                <div class="loader" v-if="showLoader" style="height: 3vh;">
                                    <div class="spinner-border text-primary spinner-border-sm" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                                <div v-if="!showLoader">{{ filecount }}</div>
                            </h4>
                            <h4 class="mb-0 count-val-cust-cls" v-else>{{ data.value }}</h4>
                        </div>
                        <div class="text-primary">
                            <i :class="`${data.icon} count-icon-cust-cls`"></i>
                        </div>
                    </div>
                </div>
                <div class="card-body border-top py-2">
                    <div class="text-truncate" v-if="data.title === 'Users'">
                        <span class="badge badge-soft-success font-size-11">{{ data.label1 }}</span>
                        <span class="count-cust-cls1">{{ activeUserData.length }}</span>
                        <span class="badge badge-soft-danger font-size-11 ml-2 count-cust-cls2">{{ data.label2 }}</span>
                        <span>{{ inactiveUserData.length }}</span>
                    </div>
                    <div class="text-truncate" v-else-if="data.title === 'Files'">
                        <button @click="refreshGetOrgDetails" class="btn btn-sm btn-primary font-size-11 count-cust-cls2">
                            <i class="fas fa-sync-alt mr-2"></i>Refresh</button>
                    </div>
                    <div class="text-truncate count-body-cust-cls" v-else></div>
                </div>
            </div>
        </div>
    </div>
</template>
  

<script>
import axios from 'axios';
import {URL} from '@/api/global.env.js'
export default {
    data() {
        return {
            statData: [
                {
                    title: "Users",
                    icon: "mdi mdi-account-multiple",
                    value: "25",
                    label1: "Active",
                    value1: "10",
                    label2: "Inactive",
                    value2: "15",
                },
                {
                    title: "Projects",
                    icon: "mdi mdi-text-box-multiple",
                    value: "20",
                },
                {
                    title: "VM's",
                    icon: "mdi mdi-apple-airplay",
                    value: "1",
                },
                {
                    title: "Files",
                    icon: "mdi mdi-file-multiple",
                    value: "0",
                },
            ],
            projectsList: "",
            activeUserData: "",
            inactiveUserData: "",
            filecount: localStorage.getItem('storedFileCount'),
            storedCount: null,
            gitToken: localStorage.getItem('gitToken'),
            orgId: localStorage.getItem('orgId'),
            token: localStorage.getItem('token'),
            apiURL: process.env.VUE_APP_DATABASEURL,
            showLoader: false

        };
    },
    created() {
        this.getProjectDetails();
        this.getActiveUserData();
        if (this.filecount === null || this.filecount === undefined || this.filecount === "null" ||this.filecount === 0 ) {
            this.refreshGetOrgDetails();
        }
    },
    mounted() {
        if (this.filecount === null || this.filecount === undefined || this.filecount === "null" ||this.filecount === 0 ) {
            this.refreshGetOrgDetails();
        }
    },


    methods: {
        // This method is use to Get repo details
        getProjectDetails() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client
                .get(`project/byorgid?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.projectsList = response.data;
                    loader.hide();
                })
                .catch((err) => {
                    // this.apiError(err.response.data.error, this.$store);
                    console.log(err);
                    loader.hide();
                });
        },
        getActiveUserData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client.get(`orguser/active/profile?orgId=${this.$store.state.Auth.orgId}`).then((response) => {
                this.activeUserData = response.data;
                loader.hide();
            })
                .then(() => {
                    this.getInactiveUserData();
                    loader.hide();
                })
                .catch((err) => {
                    console.log("widge err", err);
                    loader.hide();
                })
        },
        getInactiveUserData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client.get(`orguser/inactive/profile?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.inactiveUserData = response.data;
                    loader.hide();
                })
                .catch((err) => {
                    loader.hide();
                    console.log("getInactiveUserData err", err);
                })
        },
        refreshGetOrgDetails() {
            this.getOrgDetails()
        },
        updateFilecount() {
            this.filecount = localStorage.getItem('storedFileCount')
        },
        getOrgDetails() {
            this.showLoader = true
            let gitToken = localStorage.getItem('gitToken');
            let orgId = localStorage.getItem('orgId');
            let token = localStorage.getItem('token');
            axios({
                method: 'get',
                url: `${URL}api/orgadmin/github/projectfilecount?orgId=${orgId}`,
                headers: {
                    gitToken: gitToken,
                    Authorization: `Bearer ${token}`,
                    userId: localStorage.getItem('userId'),
                    orgId: localStorage.getItem('orgId')
                }
            }).then((res) => {
                this.storedCount = res.data.fileCount;
                localStorage.setItem('storedFileCount', this.storedCount);
                console.log("res.data", res.data);
                this.showLoader = false
                this.updateFilecount();

            }).catch((err) => {
                console.log(err);
                this.showLoader = false
            })
        },

    },


}
</script>

<style scoped>
.count-cust-cls1 {
    margin-right: auto;
    margin-left: 5px;
}

.count-cust-cls2 {
    margin-left: auto;
    margin-right: 5px;
}

.count-body-cust-cls {
    padding-bottom: 21px;
}

.count-card-body-cust {
    padding: 0.75rem 1.25rem;
}

.count-icon-cust-cls {
    font-size: 35px;
    color: #021559;
}

.count-title-cust-cls {
    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 20px !important;
    line-height: 22px !important;
    color: #021559 !important;
}

.count-val-cust-cls {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 22px !important;
    color: #000000 !important;
}
</style>