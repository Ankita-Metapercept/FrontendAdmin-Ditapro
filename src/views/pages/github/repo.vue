<template>
    <div>
        <PageHeader :title="title" :icon="'mdi mdi-clipboard-multiple h2'" :items="items" />
        <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
            <b-tab active>
                <template v-slot:title>
                    <span class="d-inline-block d-sm-none" style="font-weight: 900; color: blue;">Users</span>
                    <span class="d-none d-sm-inline-block" style="font-weight: 900; color: blue;">Users</span>
                </template>
                <userRole :projectData="projectData" />
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <span class="d-inline-block d-sm-none" style="font-weight: 900; color: blue;">Commit</span>
                    <span class="d-none d-sm-inline-block" style="font-weight: 900; color: blue;">Commit</span>
                </template>
                <committ :projectData="projectData" />
            </b-tab>
            <b-tab>
                <template v-slot:title ,>
                    <span class="d-inline-block d-sm-none" style="font-weight: 900; color: blue;">Release</span>
                    <span class="d-none d-sm-inline-block" style="font-weight: 900; color: blue;">Release</span>
                </template>
                <release />
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import committ from "@/components/admin/Repository/commit.vue";
import userRole from "@/components/admin/Repository/user.vue";
import release from "@/components/admin/Repository/release.vue";
import PageHeader from "@/components/page-header";
export default {
    components: {
        committ,
        userRole,
        release,
        PageHeader,
    },
    data() {
        return {
            title: "",
            items: [
                {
                    text: "Project",
                    href: `/github`
                },
                
            ],
            repodata: [],
            username: "",
            repocoldata: [],
            apiURL: process.env.VUE_APP_DATABASEURL,
            submitted: false,
            submitform: false,
            submit: false,
            typesubmit: false,
            repousername: "",
            repouseremail: "",
            projectData: "test",
        };
    },
    created() {
        this.getProjectDetails();
    },
    mounted() { },
    methods: {
        getProjectDetails() {
            this.$store.getters.client
                .get(`project/byprojectid?projectId=${this.$route.params.id}`)
                .then((res) => {
                    this.projectData = res.data[0];
                    this.title = res.data[0].projectName;
                    this.items.push({
                        text: res.data[0].projectName,
                        active: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style scoped>
.User_Role_submit_btn {
    margin-right: 10px;
    background: #1b2a49;
}

.UserRole_Form_buttons {
    text-align: center;
}

.Cancel_btn {
    background: #738598;
}
</style>