<template>
  <div>
    <div class="card">
      <div class="card-body">
        <form class="form-horizontal" @submit.prevent="updateUser" ref="formUpdateUser">
          <div class="form-group">
            <label for="updatef_collaborators">Collaborators <span class="text-danger">*</span></label>
            <b-form-select :options="optionsCollaboratorlist" v-validate="'required'" v-model="selectedCollaborators"
              name="updatef_collaborators" type="text" class="form-control" id="updatef_collaborators"
              placeholder="selct collaborators" :class="{
                'is-invalid': submitted && $v.updatef_collaborators.$error,
              }" disabled></b-form-select>
            <p class="text-danger text-sm" v-show="errors.has('updatef_collaborators')">
              The Collaborators field is required
            </p>
          </div>

          <div class="form-group">
            <label for="updatef_projects">Projects <span class="text-danger">*</span></label>
            <multiselect v-validate="'required'" name="updatef_projects" id="updatef_projects" :class="{
              'is-invalid': submitted && $v.addf_projects.$error,
            }" v-model="seletedProject" tag-placeholder="Add this as new tag" placeholder="Please select an project"
              label="text" track-by="value" :options="optionsProjectlist" :multiple="true"></multiselect>
            <p class="text-danger text-sm" v-show="errors.has('updatef_projects')">
              The projects field is required
            </p>
          </div>
          <div class="form-group">
            <label for="updatef_username">Username <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.username" name="updatef_username" type="text"
              class="form-control" id="updatef_username" placeholder="Enter username" :class="{
                'is-invalid': submitted && $v.updatef_username.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('updatef_username')">
              The username field is required
            </p>
          </div>
          <div class="form-group">
            <label for="updatef_email">Email Address <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.email" name="updatef_email" type="text" class="form-control"
              id="updatef_email" placeholder="Enter email" :class="{
                'is-invalid': submitted && $v.updatef_email.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('updatef_email')">
              The email field is required
            </p>
          </div>
          <div class="form-group">
            <label for="updatef_userrole">User Role <span class="text-danger">*</span></label>
            <b-form-checkbox-group :options="optionsRoles" v-validate="'required'" v-model="formData.userRole"
              name="updatef_userrole" type="text" id="updatef_userrole" value="true" :class="{
                'is-invalid': submitted && $v.updatef_userrole.$error,
              }" :multiple="true"></b-form-checkbox-group>
            <p class="text-danger text-sm" v-show="errors.has('updatef_userrole')">
              The user roles field is required
            </p>
          </div>
          <div v-if="showDocMigration" class="form-group ">
            <label class=" col-form-label">Select options for DocMigration<span class="text-danger">*</span>
            </label>
            <div>
              <select v-model="formData.docMigrationType" required class="form-control">
                <option v-for="(option, index) in DocMigrationOptions" :value="option.value" :key="'option_' + index">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="updatef_githubUsername">Github Username <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.githubUsername" name="updatef_githubUsername" type="text"
              class="form-control disable-cust-cls" id="updatef_githubUsername" placeholder="Enter Github Username"
              :class="{
                'is-invalid': submitted && $v.updatef_githubUsername.$error,
              }" disabled />
            <p class="text-danger text-sm" v-show="errors.has('updatef_githubUsername')">
              The github username field is required
            </p>
          </div>
          <div class="form-group">
            <label for="updatef_githubEmail">Github Email Address <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.githubEmail" name="updatef_githubEmail" type="text"
              class="form-control" id="updatef_githubEmail" placeholder="Enter github email  " :class="{
                'is-invalid': submitted && $v.updatef_githubEmail.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('updatef_githubEmail')">
              The github email address field is required
            </p>
          </div>
          <div class="form-group">
            <label for="updatef_admin">Admin <span class="text-danger">*</span></label>
            <b-form-select :options="optionsAdmins" v-validate="'required'" v-model="selectedAdmin" name="updatef_admin"
              type="text" class="form-control" id="updatef_admin" placeholder="selct admin" :class="{
                'is-invalid': submitted && $v.updatef_admin.$error,
              }"></b-form-select>
            <p class="text-danger text-sm" v-show="errors.has('updatef_admin')">
              The projects field is required
            </p>
          </div>

          <div class="text-center">
            <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
              Save
            </button>
            &nbsp;&nbsp;
            <b-button class="btn btn-secondry w-md waves-effect waves-light"
              v-on:click="closeUpdateUser()">Cancel</b-button>
          </div>
          <div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      projectCollaboratorsList: [{ id: "1", name: "Select Collabrator" }],
      projectList: [{ id: "1", name: "Select Project" }],
      username: "",
      email: "",
      password: "",
      userrole: [],
      githubEmailAddress: "",
      admin: [],
      userProfile: [],
      formData: {
        userRole: [],
        email: "",
        username: "",
        githubEmail: "",
        docMigrationType: [],
        adminId: "",
        id: "",
        docManager: true,
        editor: false,
        publisher: false,
        docMigration: true,
      },
      error: null,
      submitted: false,
      allCollaborators: "",
      optionsCollaboratorlist: [
        { value: null, text: "Please select an collaborators", disabled: true },
      ],
      selectedCollaborators: null,
      activeUserData: "",
      DocMigrationType: [
      ],
      optionsProjectlist: [],
      seletedProject: null,
      optionsRoles: [],

      appAccess: "",
      DocMigrationOptions: [
        { value: "Word to DITA", label: "Word to DITA" },
      ],
      optionsAdmins: [
        { value: null, text: "Please select an admin", disabled: true },
      ],
      selectedAdmin: null,
      seletedRole: null,
      showDocMigration: false,
    };
  },
  mounted() {
    // this.getOrgDetails();
    // this.getUserProfile();
    // this.getAllCollaboratorsData();
    this.getActiveUserData();
    // this.getOrgAdmins();
    // this.getProjectBySeletedCollaborators();
  },
  computed: {
    _() {
      return _;
    },
  },
  watch: {
    "formData.userRole": function (newVal) {
      if (newVal.includes("DocMigration")) {
        this.showDocMigration = true;
      } else {

        this.showDocMigration = false;
      }
    },
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
    getCollabrator() {
      this.$store.getters.client.get(``).then((response) => {
        this.projectCollaboratorsList = response.data;
      });
    },
    getUserProfile() {
      this.$store.getters.client
        .get(`orguser/details?userId=${this.$route.params.id}`)
        .then((response) => {
          this.formData = response.data;
        })
        .then(async () => {
          // this.getAllCollaboratorsData();
          let filterCollaborators = this._.filter(this.allCollaborators, {
            gitUsername: this.formData.githubUsername,
          });
          this.selectedCollaborators = filterCollaborators[0].gitUserId;
          this.getProjectBySeletedCollaborators(
            filterCollaborators[0].gitUserId
          );
          this.getOrgDetails();
          this.getOrgAdmins();
        })
        .catch((err) => {
          console.log("getUserProfile err ", err);
        })
    },
    updateUser() {
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          let userIP = await fetch("https://api.ipify.org?format=json")
            .then((x) => x.json())
            .then(async ({ ip }) => {
              return ip;
            });
          let loader = this.$loading.show({
            loader: "dots",
          });
          let projectArr = [];
          this.seletedProject.forEach((element) => {
            projectArr.push(element.value);
          });
          let data = {
            projects: projectArr,
            userRole: this.formData.userRole,
            orgId: this.$store.state.Auth.orgId,
            email: this.formData.email,
            username: this.formData.username,
            docMigrationType: this.formData.docMigrationType,
            githubCollaboratorId: this.selectedCollaborators,
            githubUsername: this.formData.githubUsername,
            githubEmail: this.formData.githubEmail,
            adminId: this.selectedAdmin,
            lastLoginId: userIP,
            isActive: true,
            isDeleted: false,
            isSuperUser: false,
            isProfileUpdate: true,
            isRoleAssign: true,

          };

          this.$store.getters.client
            .put(`orguser/details?userId=${this.$route.params.id}`, data)
            .then(() => {
              this.messageToast(
                "Success",
                "success",
                `User profile update successfully`
              );
              loader.hide();
              this.$router.push({ path: `/users` });
            })
            .catch((error) => {
              this.messageToast("Error", "danger", error.response.data.message);
              loader.hide();
            });
        }
      });
    },
    consolefunc() {

      console.log(this.seletedProject);
    },
    closeUpdateUser() {
      this.$router.push({ path: `/users` });
    },
    async getAllCollaboratorsData() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client
        .get(
          `orgadmin/github/gitcollaborators?orgId=${this.$store.state.Auth.orgId}`
        )
        .then(async (response) => {
          this.allCollaborators = response.data;
          response.data.forEach((element) => {
            let filterCollaborators = this._.filter(this.activeUserData, {
              githubUsername: element.gitUsername,
            });
            if (filterCollaborators.length === 0) {
              this.optionsCollaboratorlist.push({
                value: element.gitUserId,
                text: element.gitUsername,
              });
            } else {
              this.optionsCollaboratorlist.push({
                value: element.gitUserId,
                text: element.gitUsername,
                disabled: true,
              });
            }
          });
          this.getUserProfile();
          loader.hide();
        })
        .catch((err) => {
          console.log(err);
          // this.optionsCollaboratorlist= [
          //   { value: null, text: 'Please select an collaborators', disabled: true }
          // ]
          loader.hide();
        });
    },
    getProjectBySeletedCollaborators(uid) {
      this.seletedProject = null;
      this.optionsProjectlist = [];
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client
        .get(`project/bygituserid?githubUserId=${uid}`)
        .then((response) => {
          response.data.forEach((element) => {
            this.optionsProjectlist.push({
              value: element.id.toString(),
              text: element.name,
            });
          });
          loader.hide();
        })
        .then(() => {
          let projectArr = [];
          this.formData.projects.forEach((element) => {
            let filterProjects = this._.filter(this.optionsProjectlist, {
              value: element,
            });
            projectArr.push(filterProjects[0]);
          });
          this.seletedProject = projectArr;
        })
        .catch((err) => {
          console.log(err);
          // this.optionsCollaboratorlist= [
          //   { value: null, text: 'Please select an collaborators', disabled: true }
          // ]
          loader.hide();
        });
    },
    async getActiveUserData() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client
        .get(`orguser/active/profile?orgId=${this.$store.state.Auth.orgId}`)
        .then((response) => {
          this.activeUserData = response.data;
          loader.hide();
        })
        .then(() => {
          this.getAllCollaboratorsData();
        })
        .catch((err) => {
          this.messageToast("Error", "danger", err.response.data.message);
          console.log("err in getActiveUserData", err);
          loader.hide();
        });
    },
    // This method is use to Get organization details
    async getOrgDetails() {
      // Try requrest to get organization details
      this.$store.getters.client
        .get(
          `/serveradmin/organization/byorgid?orgId=${this.$store.state.Auth.orgId}`
        )
        .then((res) => {
          this.appAccess = res.data[0];
          console.log(this.appAccess);
          if (res.data[0].docManager)
            this.optionsRoles.push({ text: "DocManager", value: "DocManager" });
          if (res.data[0].publisher)
            this.optionsRoles.push({
              text: "DocPublisher",
              value: "DocPublisher",
            });
          if (res.data[0].editor)
            this.optionsRoles.push({ text: "DocEditor", value: "DocEditor" });
          if (res.data[0].docMigration)
            this.optionsRoles.push({
              text: "DocMigration",
              value: "DocMigration",
            });
          this.seletedRole = this.formData.userRole;
          // this.DocMigrationOptions = res.data[0].docMigrationType
          this.formData.docMigrationType = res.data[0].docMigrationType[0]
        })
        .catch((err) => {
          this.messageToast("Error", "danger", err.response.data.message);
          console.log("err in getOrgDetails", err);
        });
    },
    // This method is use to Get organization details
    async getOrgAdmins() {
      // Try requrest to get organization details
      this.$store.getters.client
        .get(`orgadmin/byorgid?orgId=${this.$store.state.Auth.orgId}`)
        .then((res) => {
          res.data.forEach((element) => {
            this.optionsAdmins.push({
              value: element.id,
              text: element.name,
            });
          });
        })
        .then(() => {
          this.selectedAdmin = this.formData.adminId;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.disable-cust-cls {
  background: #e7e7e8 !important;
  color: #838588 !important;
}
</style>
