<script>
// import axios from 'axios'

export default {
  data() {
    return {
      repoReleaseData: [

      ],
      repobranchesdata: [],
      openReleaseFormFlag: false,
      apiURL: process.env.VUE_APP_DATABASEURL,
      form: {
        rtitle: "",
        rttitle: "",
        rdesc: "",
        rbranch: "",
      },
      projectName: '',
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "published_at",
      sortDesc: true,
      orgId: localStorage.getItem('orgId'),
      colfields: [
        { key: "name", label: "Release Title", sortable: false },
        { key: "tag_name", label: "Output format", sortable: false },
        // { key: "published_at", label: "Date Time", sortable: true },
        { key: "target_commitish", label: "Release By", sortable: false },
        // { key: "author.login", label: "	Creater", sortable: true },
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.repoReleaseData.length;
    },
  },
  mounted() {
    this.getProjectDetails()
    // this.getRelease();
    // this.getBranches();
    // Set the initial number of items
    // this.totalRows = this.repoReleaseData.length;
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
    openCreateRelease() {
      this.$refs["createReleaseModel"].show();
    },
    // This method is use to generate error or success message
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true
      })
    },
    getProjectDetails() {
      this.$store.getters.client
        .get(`project/byprojectid?projectId=${this.$route.params.id}`)
        .then((res) => {
          this.projectName = res.data[0].projectName
          this.getrecentlog(this.projectName)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getrecentlog(projectName) {
      this.$store.getters.client
        .get(`/orgadmin/notification/releasedByLastWeek?orgId=${this.orgId}`)
        .then((response) => {
          response.data.forEach((ele) => {
            if (ele.projectName === projectName) {
              this.repoReleaseData.push({
                name: ele.releaseTitle,
                tag_name: ele.outputFormat,
                target_commitish: ele.releasedBy,
                projectName: ele.projectName
              })
            }
          });
        })
        .catch((error) => {
          console.log("error", error)
        })
    },
    getBranches() {
      this.$store.getters.client
        .get(
          `orgadmin/repoBranches?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`
        )
        .then((response) => {
          this.repobranchesdata = response.data;
        });
    },
    getRelease() {
      this.$store.getters.client
        .get(
          `orgadmin/repoRelease?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`
        )
        .then((response) => {
          this.repoReleaseData = response.data;
          this.$refs.releaseTable.refresh();
          this.$refs["releaseTable"].refresh();
        });
    },
    createRelease() {
      console.log(this.$store.state)
      // var username = this.$store.state.Auth.userId;
      var dataObj = {
        tag_name: this.form.rttitle,
        target_commitish: this.form.rbranch,
        name: this.form.rtitle,
        body: this.form.rdesc,
        draft: false,
      };

      this.$store.getters.client
        .post(
          `orgadmin/repocreaterelease?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`,
          dataObj
        )
        .then(() => {
          this.$refs["createReleaseModel"].hide();

          this.getRelease();

          this.form.rtitle = "";
          this.form.rttitle = "";
          this.form.rdesc = "";
          this.form.rbranch = "";

          this.$refs.releaseTable.refresh();
          this.$refs["releaseTable"].refresh();

          this.messageToast("Success", "success", `Release created successfully`)
        })
        .catch(() => {
          this.messageToast("Error", "danger", `Please try again after sometime sever on maintenance`)
        });
    },
    openReleaseForm() {
      if (this.openReleaseFormFlag) {
        this.openReleaseFormFlag = false;
      } else {
        this.openReleaseFormFlag = true;
      }
    },
    filterTable(row, filter) {
      const filterUpperCase = filter.toUpperCase();
      const hasNameMatch = row.name.toUpperCase().startsWith(filterUpperCase);
      // const hasNameMatch = row.commit.message.startsWith(filter);
      return hasNameMatch;
    }
  },
};
</script>

<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <i class="d-inline-block ri-book-mark-fill cmh-icon"></i>
      <h1 class="d-inline-block cmh-title">RELEASE</h1>

      <!-- <b-button
          variant="success"
          size="md"
          style="display: inline; float: right;margin-left: auto;"
          v-on:click="openCreateRelease()"
        >
          <svg style="width:18px;height:18px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>
          Add New
      </b-button> -->
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
                    <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                  </label>
                </div>
              </div>
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input v-model="filter" type="search" placeholder="Search Release Name..."
                      class="form-control form-control-sm ml-2"></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table :items="repoReleaseData" :fields="colfields" responsive="sm" :per-page="perPage"
                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter"
                :filter-included-fields="filterOn" @filtered="onFiltered" :filter-function="filterTable"
                ref="releaseTable" show-empty>
                <template #cell(name)="row">
                  <div class="badge font-size-12">
                    {{ row.item.name }}
                  </div>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                <ul class="pagination pagination-rounded mb-0">
                  <!-- rowcount -->
                  <span class="py-2"> Total Rows: {{ this.repoReleaseData.length }}</span>
                </ul>
              </div>
              <div class="row-pagination-cust-cls">
                <ul class="pagination-rounded mb-0">
                  <!-- pagination -->
                  <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="my-4 text-center">
        <b-modal id="modal-standard" ref="createReleaseModel" title="CREATE NEW RELEASE" title-class="font-18"
          hide-footer>
          <div class="row">
            <div class="col-lg-12">
              <form class="needs-validation" @submit.prevent="createRelease()">
                <div class="row mb-1">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="col-form-label">Release Title</label>
                      <input id="validationCustom01" v-model="form.rtitle" type="text" required class="form-control"
                        placeholder="Release Title" value="Mark" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="col-form-label">Tag Name</label>
                      <input id="validationCustom01" v-model="form.rttitle" required type="text" class="form-control"
                        placeholder="Tag Title" value="Mark" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="col-form-label">Branch</label>
                      <select class="form-control" v-model="form.rbranch" required>
                        <option v-for="data in repobranchesdata" :key="data.id">{{ data.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="col-form-label">Description</label>
                      <textarea id="validationCustom02" v-model="form.rdesc" class="form-control"
                        placeholder="Description" value="Otto" rows="3" />
                    </div>
                  </div>
                </div>
                <div class="text-center" align-v="center">
                  <button class="btn btn-primary" type="submit">Create</button>
                  &nbsp;&nbsp;
                  <b-button class="btn btn-secondry" @click="$bvModal.hide('modal-standard')">Close</b-button>
                </div>
              </form>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<style>
.btn-primary {
  color: #fff;
  background-color: #5664d2 !important;
  border-color: #5664d2;
}

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
