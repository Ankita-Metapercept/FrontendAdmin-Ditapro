<template>
  <div>
    <!-- <div class="d-flex align-items-center mb-3">
      <i class="d-inline-block mdi mdi-account-multiple cmh-icon"></i>
      <h1 class="d-inline-block cmh-title">Add User</h1>
    </div> -->
    <div class="card">
      <div class="card-body">
        <form class="form-horizontal" @submit.prevent="addUser" ref="formAddUser">
          <div class="form-group">
            <label for="addf_collaborators">Collaborators <span class="text-danger">*</span></label>
            <b-form-select :options="optionsCollaboratorlist" v-validate="'required'" v-model="selectedCollaborators"
              name="addf_collaborators" type="text" class="form-control" id="addf_collaborators"
              placeholder="selct collaborators" :class="{
                'is-invalid': submitted && $v.addf_collaborators.$error,
              }" @change="onCollaboratorSel"></b-form-select>
            <p class="text-danger text-sm" v-show="errors.has('addf_collaborators')">
              The Collaborators field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_projects">Projects <span class="text-danger">*</span></label>
            <multiselect v-validate="'required'" name="addf_projects" id="addf_projects" :class="{
              'is-invalid': submitted && $v.addf_projects.$error,
            }" v-model="seletedProject" tag-placeholder="Add this as new tag" placeholder="Please select an project"
              label="text" track-by="value" :options="optionsProjectlist" :multiple="true"></multiselect>
            <p class="text-danger text-sm" v-show="errors.has('addf_projects')">
              The projects field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_username">Username <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.username" name="addf_username" type="text"
              class="form-control" id="addf_username" placeholder="Enter username" :class="{
                'is-invalid': submitted && $v.addf_username.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('addf_username')">
              The username field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_email">Email Address <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.email" name="addf_email" type="text" class="form-control"
              id="addf_email" placeholder="Enter email" :class="{
                'is-invalid': submitted && $v.addf_email.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('addf_email')">
              The email field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_password">Password <span class="text-danger">*</span></label>
            <input v-validate="'required|verify_password'" v-model="password" name="addf_password" type="password"
              class="form-control" id="addf_password" placeholder="Enter password" :class="{
                'is-invalid': submitted && $v.addf_password.$error,
              }" ref="addf_password" />
            <!-- <p class="text-danger text-sm" v-show="errors.has('addf_password')">
                            The password field is required
                        </p> -->
            <p class="text-danger text-sm" v-show="errors.has('addf_password') &&
              _.find(errors.items, { field: 'addf_password' }).rule ==
              'required'
              ">
              <span>The password field is required</span>
            </p>
            <p class="text-danger text-sm" v-show="errors.has('addf_password') &&
              _.find(errors.items, { field: 'addf_password' }).rule ==
              'verify_password'
              ">
              {{ errors.first("addf_password") }}
            </p>
          </div>
          <div class="form-group">
            <label for="addf_userrole">User Role <span class="text-danger">*</span></label>
            <b-form-checkbox-group :options="optionsRoles" v-validate="'required'" v-model="formData.userRole"
              name="add_userrole" type="text" value="true" id="addf_userrole" :class="{
                'is-invalid': submitted && $v.addf_userrole.$error,
              }" :multiple="true"></b-form-checkbox-group>
            <p class="text-danger text-sm" v-show="errors.has('addf_userrole')">
              The user roles field is required
            </p>
          </div>
          <div v-if="showDocMigration" class="form-group ">
            <label>Select options for DocMigration <span class="text-danger">*</span></label>
            <div>
              <select v-model="formData.DocMigrationType" required class="form-control">
                <option v-for="(option, index) in DocMigrationOptions" :value="option.value" :key="'option_' + index">{{
                  option.label }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="addf_githubUsername">Github Username <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.githubUsername" name="addf_githubUsername" type="text"
              class="form-control disable-cust-cls" id="addf_githubUsername" placeholder="Enter Github Username" :class="{
                'is-invalid': submitted && $v.addf_githubUsername.$error,
              }" disabled />
            <p class="text-danger text-sm" v-show="errors.has('addf_githubUsername')">
              The github username field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_githubEmail">Github Email Address <span class="text-danger">*</span></label>
            <input v-validate="'required'" v-model="formData.githubEmail" name="addf_githubEmail" type="text"
              class="form-control" id="addf_githubEmail" placeholder="Enter github email address" :class="{
                'is-invalid': submitted && $v.addf_githubEmail.$error,
              }" />
            <p class="text-danger text-sm" v-show="errors.has('addf_githubEmail')">
              The github email field is required
            </p>
          </div>
          <div class="form-group">
            <label for="addf_admin">Admin <span class="text-danger">*</span></label>
            <b-form-select :options="optionsAdmins" v-validate="'required'" v-model="selectedAdmin" name="addf_admin"
              value-field="value" text-field="text" class="form-control" id="addf_admin" placeholder="selct admin" :class="{
                'is-invalid': submitted && $v.addf_admin.$error,
              }"></b-form-select>
            <p class="text-danger text-sm" v-show="errors.has('addf_admin')">
              The projects field is required
            </p>
          </div>
          <div class="text-center">
            <button class="btn btn-primary w-md waves-effect waves-light" type="submit">
              Save
            </button>
            &nbsp;&nbsp;
            <b-button class="btn btn-secondry w-md waves-effect waves-light" v-on:click="closeAddUser()">Cancel</b-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VeeValidate from "vee-validate";
import Multiselect from "vue-multiselect";
import _ from "lodash";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      projectCollaboratorsList: [{ id: "1", name: "Select Collabrator" }],
      projectList: [{ id: "1", name: "Select Project" }],
      password: "",
      formData: {
        userRole: [],
        selectedCollaborators: null,
        seletedProject: null,
        DocMigrationType: [],
        email: "",
        seletedRole: [],
        username: "",
        githubUsername: "",
        githubEmail: "",
        adminId: "",
        id: "",
        password: "",
      },
      selectedCollaborators: null,
      seletedProject: null,
      selectedAdmin: null,
      error: null,
      selectedMigrationOption: null,
      submitted: false,
      optionsCollaboratorlist: [
        { value: null, text: "Please select an collaborators", disabled: true },
      ],
      optionsProjectlist: [],
      optionsRoles: [],
      appAccess: "",
      optionsAdmins: [
        { value: null, text: "Please select an admin", disabled: true },
      ],
      DocMigrationOptions: [
        { value: "Word to DITA", label: "Word to DITA" },
      ],
      allCollaborators: "",
      activeUserData: "",
      inactiveUserData: "",
      showDocMigration: false,
    };
  },
  mounted() {
    this.getUserProfile();
    // this.getAllCollaboratorsData();
    this.getOrgDetails();
    this.getOrgAdmins();
    this.getActiveUserData();
  },
  computed: {
    _() {
      return _;
    },
  },
  watch: {
    'formData.userRole': function (newVal) {
      if (newVal.includes('DocMigration')) {
        this.showDocMigration = true;
      } else {
        this.showDocMigration = false;
      }
    }
  },

  created() {
    VeeValidate.Validator.extend("verify_password", {
      getMessage: () =>
        `The password must contain at least: minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
      validate: (value) => {
        var strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})"
        );
        return strongRegex.test(value);
      },
    });
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
    getUserProfile() {
      this.$store.getters.client
        .get(`orguser/details?userId=${this.$route.params.id}`)
        .then((response) => {
          this.formData = response.data;
        })
        .then(() => {
          let filterCollaborators = this._.filter(this.allCollaborators, {
            gitUsername: this.formData.githubUsername,
          });
          this.selectedCollaborators = filterCollaborators[0].gitUserId;
          this.getProjectBySeletedCollaborators(
            filterCollaborators[0].gitUserId
          );
        })
        .catch((err) => {
          this.messageToast("Error", "danger", err.response.data.message);
          console.log("err in getUserProfile", err);
        })
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
        .catch((err) => {
          console.log(err);
          // this.optionsCollaboratorlist= [
          //   { value: null, text: 'Please select an collaborators', disabled: true }
          // ]
          this.messageToast("Error", "danger", err.response.data.message);
          console.log("err in getProjectBySeletedCollaborators", err);
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
          loader.hide();
        })
        .catch((err) => {
          console.log(err);
          // this.optionsCollaboratorlist= [
          //   { value: null, text: 'Please select an collaborators', disabled: true }
          // ]
          this.messageToast("Error", "danger", err.response.data.message);
          console.log("err in getProjectBySeletedCollaborators", err);
          loader.hide();
        });
    },

    async addUser() {
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          let userIP = await fetch("https://api.ipify.org?format=json")
            .then((x) => x.json())
            .then(async ({ ip }) => {
              return ip;
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
            password: this.password,
            githubCollaboratorId: this.selectedCollaborators,
            githubUsername: this.formData.githubUsername,
            githubEmail: this.formData.githubEmail,
            adminId: this.selectedAdmin,
            lastLoginId: userIP,
            isActive: true,
            isDeleted: false,
            isSuperUser: false,
          };
          let loader = this.$loading.show({
            loader: "dots",
          });
          this.$store.getters.client
            .put(`orguser/profileupdate?userId=${this.$route.params.id}`, data)
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
            let filterCollaborators2 = this._.filter(this.inactiveUserData, {
              githubUsername: element.gitUsername,
            });
            // console.log("filterCollaborators2")
            // console.log(filterCollaborators2);
            // console.log(this.inactiveUserData)
            if (
              filterCollaborators.length === 0 &&
              filterCollaborators2.length === 0
            ) {
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
          loader.hide();
          console.log("err in getAllCollaboratorsData ", err);
          // this.optionsCollaboratorlist= [
          //   { value: null, text: 'Please select an collaborators', disabled: true }
          // ]
          loader.hide();
        });
    },
    onCollaboratorSel(uid) {
      this.seletedProject = null;
      let filterCollaborators = this._.filter(this.allCollaborators, {
        gitUserId: this.selectedCollaborators,
      });
      this.formData.githubUsername = filterCollaborators[0].gitUsername;
      this.optionsProjectlist = [];
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client
        .get(`project/bygituserid?githubUserId=${uid}`)
        .then((response) => {
          response.data.forEach((element) => {
            this.optionsProjectlist.push({
              value: element.id,
              text: element.name,
            });
          });
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
    closeAddUser() {
      this.$router.push({ path: `/users` });
    },

    // This method is use to Get organization details
    getOrgDetails() {
      // Try requrest to get organization details
      this.$store.getters.client
        .get(
          `/serveradmin/organization/byorgid?orgId=${this.$store.state.Auth.orgId}`
        )
        .then((res) => {
          this.appAccess = res.data[0];
          console.log(this.appAccess)
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
            this.optionsRoles.push({ text: "DocMigration", value: "DocMigration" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // This method is use to Get organization details
    getOrgAdmins() {
      // Try requrest to get organization details
      this.$store.getters.client
        .get(`orgadmin/byorgid?orgId=${this.$store.state.Auth.orgId}`)
        .then((res) => {
          console.log("res data admin ", res);
          res.data.forEach((element) => {
            this.optionsAdmins.push({
              value: element.id,
              text: element.name,
            });
          });
          console.log("res data admin ", this.optionsAdmins);
        })
        .catch((err) => {
          console.log(err);

        });
    },

    addUseFormReset() {
      // Resetting Values
      (this.selectedCollaborators = null),
        (this.selectedCollaborators = null),
        (this.seletedRole = []),
        (this.selectedAdmin = null),
        (this.formData.username = ""),
        (this.formData.email = ""),
        (this.password = ""),
        (this.formData.githubEmail = "");
      this.$refs.formAddUser.reset();
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

          this.getInactiveUserData();
        })
        .then(() => {
          loader.hide();
          // this.getAllCollaboratorsData();
        })
        .catch((err) => {
          loader.hide();
          console.log("err in getActiveUserData", err);
        });
    },
    
    async getInactiveUserData() {
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client
        .get(`orguser/inactive/profile?orgId=${this.$store.state.Auth.orgId}`)
        .then((response) => {
          this.inactiveUserData = response.data;
          loader.hide();
          this.getAllCollaboratorsData();
        })
        .catch((err) => {
          loader.hide();
          console.log("err in getInactiveUserData ", err);
        });

    },
  },
};
</script>

<style>
option:disabled {
  /* color: red; */
  /* background: #e7e7e8 !important; */
  color: #b6b6be !important;
}

.disable-cust-cls {
  background: #e7e7e8 !important;
  color: #838588 !important;
}
</style>
