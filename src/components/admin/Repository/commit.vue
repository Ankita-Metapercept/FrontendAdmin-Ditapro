<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <i class="d-inline-block ri-pencil-line cmh-icon"></i>
      <h1 class="d-inline-block cmh-title">COMMIT HISTORY</h1>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="">
          <div style="padding: 0px 0px 20px 0px">
              <b-form-select v-model="selected" :options="repobranchesdata" class="drpdwn-cls" v-on:change="getSelectedItem">
                   <template #first>
                    <b-form-select-option :value="null" disabled>Select Branch</b-form-select-option>
                  </template>
              </b-form-select>
          </div>
        </div>
      </div>
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
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search Commit Message..."
                      class="form-control form-control-sm ml-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                :items="repocommitdata"
                :fields="colfields"
                :current-page="currentPage"
                :per-page="perPage"   
                :filter="filter"
                :filter-included-fields="filterOn"             
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                @filtered="onFiltered"
                :filter-function="filterTable"
                ref="commitTable"                
                stacked="md"
                show-empty
                small
              ></b-table>
            </div>
            <div class="row">
                    <div class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                        <ul class="pagination pagination-rounded mb-0">
                            <!-- rowcount -->
                            <span class="py-2"> Total Rows: {{ this.repocommitdata.length}}</span>
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
  </div>
</template>

<script>
import appConfig from "@/app.config";
import moment from "moment";

export default {
  page: {
    title: "DITAxPresso",
    meta: [{ name: "description", content: appConfig.description }],
  },
  // props: ['projectData'],
  data() {
    return {
      title: "Repository Commits",
      items: [
        {
          text: "Repo Commits",
          href: "/",
        },
        {
          text: "Basic",
          active: true,
        },
      ],
      repodata: [],
      repocommitdata: [],
      repobranchesdata: [],
      repobranchcommitdata: [],
      reponamemodal: "",
      apiURL: process.env.VUE_APP_DATABASEURL,
      currentUser: this.$store.state.Auth.userId,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "published_at",
      sortDesc: true,
      colfields: [
        { key: "commit.message", label: "Commit Message", sortable: false },
        { key: "author.login", label: "Committed By", sortable: false },
        { key: "commit.author.date", label: "Date and Time", sortable: false }
      ],
      selected: "main",
      projectData: ""
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.repocommitdata.length;
    },
  },
  mounted() {
    this.getProjectDetails();
    // this.getBranches();
    // this.getCommit();
  },
  methods: {
    moment,
    // Get Selected Branch
    getSelectedItem: function(myarg) {
        // this.getBranchCommit(myarg.name)
        this.getBranchCommit(myarg)
    },
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getBranches() {
      this.$store.getters.client
        .get(
          // `orgadmin/repoBranches?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`
          `orgadmin/repoBranches?repoUser=${this.projectData.owner}&repoName=${this.projectData.projectName}`
        )
        .then((response) => {
          // this.repobranchesdata = response.data;
          response.data.forEach(element => {
            // if(element == "main")
            // {
            //   this.repobranchesdata.push({value: element.name, text: element.name })
            // }
            // else{
              this.repobranchesdata.push({value: element.name, text: element.name })
            // }
          });
        });
    },
    getCommit() {
      let loader = this.$loading.show({
          loader: "dots",
      });
      this.$store.getters.client
        .get(
          // `orgadmin/repoCommit?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`
          `orgadmin/repoCommit?repoUser=${this.projectData.owner}&repoName=${this.projectData.projectName}`
        )
        .then((response) => {
          this.repocommitdata = response.data;
          loader.hide();
        })
        .catch((err)=>{
          loader.hide();
          console.log(err);
        })
    },
    getBranchCommit(branchname) {
      let loader = this.$loading.show({
          loader: "dots",
      });
      this.$store.getters.client
        .get(
          // `orgadmin/repocommit/branch?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}&branchName=${branchname}`
          `orgadmin/repocommit/branch?repoUser=${this.projectData.owner}&repoName=${this.projectData.projectName}&branchName=${branchname}`
        )
        .then((response) => {
          this.repocommitdata = response.data;
          this.$refs.commitTable.refresh();
          this.$refs["commitTable"].refresh();
          loader.hide();
        })
        .catch((err)=>{
          loader.hide();
          console.log(err);
        })
 
    },
    async getProjectDetails(){
        let loader = this.$loading.show({
            loader: "dots",
        });
        this.$store.getters.client
          .get(`project/byprojectid?projectId=${this.$route.params.id}`)
          .then((res) => {
            let projectdata1 = res.data;
            if(projectdata1.length > 0)
            {
              this.projectData = res.data[0];
              this.title = res.data[0].projectName
            }
     
          }).then(() => {
            this.getBranches();
            this.getCommit();
            loader.hide();
          })
          .catch((err) => {
            console.log(err);
            loader.hide();
          });
    },
    filterTable(row, filter) {
        const filterUpperCase = filter.toUpperCase();
        const hasNameMatch = row.commit.message.toUpperCase().startsWith(filterUpperCase);
        // const hasNameMatch = row.commit.message.startsWith(filter);
        return hasNameMatch;
    }
  },
};
</script>

<style>
    .drpdwn-cls {
      /* width: 100%; */
      background: #e0e0e0 !important;
    }

    .drpdwn-cls > button {
      background: #e0e0e0 !important;
      border-color: #e7e7e8;
      /* color: #838588; */
    }

    .drpdwn-cls > button:hover {
      color: #505d69 !important;
      border-color: #e7e7e8 !important;
    }

    .cmh-title{
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

    .drpdwn-cls > .btn-primary:not(:disabled):not(.disabled):active,
    .drpdwn-cls > .btn-primary:not(:disabled):not(.disabled).active,
    .drpdwn-cls.show > .btn-primary.dropdown-toggle {
      background: #e0e0e0 !important;
      border-color: #e7e7e8;
      color: #838588;
    }

    .drpdwn-cls > .btn-primary:focus,
    .drpdwn-cls > .btn-primary.focus {
      color: #838588;
      border-color: #e7e7e8;
    }

    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
        .row-count-cust-cls{
            /* float: right !important; */
            margin-bottom: 10px;
        }
        .row-pagination-cust-cls{
            margin-top: 20px;
        }
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
        .row-count-cust-cls ul{
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
