<script>
import Vue from "vue";
import appConfig from "@/app.config";
import axios from 'axios'
import Swal from "sweetalert2";
import treeview from './treeview.vue';

export default {
  components: { treeview },
  page: {
    title: "Repository",
    meta: [{ name: "description", content: appConfig.description }]
  },
  data() {
    return {
      title: "Repository Content",
      items: [
        {
          text: "Repo Content",
          href: "/"
        },
        {
          text: "Basic",
          active: true
        }
      ],
      repodata: [],
      repocommitdata: [],
      repobranchesdata: [],
      repobranchcommitdata: [],
      reposha: [],
      reponame: '',
      reponamemodal: '',
      oldPath: '',
      newPath: '',
      filesha: '',
      editablestring: '',
      apiURL: process.env.VUE_APP_DATABASEURL,
      openEdit: false,
      contentComment: '',
      branchname: '',
      currentUser: this.$store.state.Auth.userId,
      sha: {}
    };
  },
  mounted() {
    this.getFile()
    this.getBranches()
    this.getSHA()
  },
  methods: {
    getFile() {
      this.reponame = ''
      this.newPath = ''
      this.oldPath = ''
      var username = this.$store.state.Auth.userId
      // var gitToken = localStorage.getItem('gitToken')
      this.reponame = this.$route.params.reponame
      this.newPath = this.oldPath+this.newPath
      this.oldPath = this.newPath

      this.$store.getters.client
        .get(`${username.login}/${this.$route.params.reponame}/repoSHA`)
        .then((res) => {
          this.repocoldata = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // axios({
      //   method: 'get',
      //   url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/repoSHA`, 
      //   headers: {
      //     gitToken: gitToken,
      //     repopath: this.newPath
      //   }
      // }).then((res)=> {
      //     this.reposha = res.data
      // }).catch((err)=> {
      //     console.log(err)
      // })
    },
    getSHA(){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/branch/main/sha`, 
        headers: {
          gitToken: gitToken
        }
      }).then((res)=> {
        this.sha = res.data
      }).catch((err)=> {
          console.log(err)
      })
    },
    getBranches(){
      this.$store.getters.client
          .get(`orgadmin/repoBranches?repoUser=${this.$route.params.githubuser}&repoName=${this.$route.params.reponame}`)
          .then((response) => {
            this.repobranchesdata = response.data
          });
    },
    getBranchCommit(branchname) {
      this.reponame = ''
      this.newPath = ''
      this.oldPath = ''
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      this.reponame = this.$route.params.reponame
      this.newPath = this.oldPath+this.newPath
      this.oldPath = this.newPath
      console.log(this.newPath)
      axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/branch/${branchname}/repoContent`,
        headers: {
          gitToken: gitToken,
          repopath: this.newPath
        }
      }).then((res)=> {
          this.reposha = res.data
          this.branchname = branchname
      }).catch((err)=> {
          console.log(err)
      })
    },
    commentRequired() {
      Swal.fire("Comment Required", "Need to add comment for your latest commit", "warning");
    },
    addChangesSuccess() {
      Vue.swal({
        position: "top-end",
        icon: "success",
        title: "Changes Added Successfully",
        showConfirmButton: false,
        timer: 1500
      });
    },
    postDataFile() {
      if(this.contentComment !== ''){
        var username = this.$store.state.Auth.userId
        var gitToken = localStorage.getItem('gitToken')
        var dataObj = {}
        var cutPath = this.newPath.substring(1)
        if(this.branchname === ''){
          dataObj = {
            message: this.contentComment, content: this.editablestring, repopath: cutPath, sha: this.filesha
          }
        }
        else {
          dataObj = {
            message: this.contentComment, 
            content: this.editablestring, 
            repopath: cutPath, 
            sha: this.filesha,
            branch: this.branchname
          }
        }
        axios({
          method: 'put',
          url: `${this.apiURL}/api/${username.login}/${this.reponame}/repoContent`, 
          headers: {
            gitToken: gitToken
          },
          data: dataObj
        }).then((res)=> {
          console.log(res)
          this.addChangesSuccess()
        }).catch((err)=> {
          console.log(err)
        })
      }else{
        this.commentRequired()
      }
      
    },
    getFolderFile(reponame) {
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      this.newPath = this.oldPath+"/"+reponame
      this.oldPath = this.newPath
      axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.reponame}/repoSHA`, 
        headers: {
          gitToken: gitToken,
          repopath: this.newPath
        }
      }).then((res)=> {
          this.reposha = res.data
      }).catch((err)=> {
          console.log(err)
      })
    },
    getFolderFileBranch(reponame) {
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      this.newPath = this.oldPath+"/"+reponame
      this.oldPath = this.newPath
      axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.reponame}/branch/${this.branchname}/repoSHA`, 
        headers: {
          gitToken: gitToken,
          repopath: this.newPath
        }
      }).then((res)=> {
        this.reposha = res.data
      }).catch((err)=> {
        console.log(err)
      })
    },
    convertToString(code){
      return Buffer.from(code, 'base64').toString('ascii')
    },
    editContent(code, sha){
      this.editablestring = Buffer.from(code, 'base64').toString('ascii')
      this.filesha = sha
      if(this.openEdit){
        this.openEdit = false
      }
      else{
        this.openEdit = true
      }
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col-lg-12" v-if="Object.keys(sha).length !== 0">
      <treeview :sha="sha"/>
    </div>
    <div class="col-lg-12">
      <div style="padding: 10px 0px 20px 0px">
        <b-dropdown variant="primary">
          <template v-slot:button-content>
            Select Branch
            <i class="mdi mdi-chevron-down"></i>
          </template>
          <div v-for="data in repobranchesdata" :key="data.id">
            <b-dropdown-item v-on:click="getBranchCommit(data.name)" href="javascript: void(0);">{{data.name}}</b-dropdown-item>
          </div>
        </b-dropdown>
      </div>
      <div class="table-responsive" v-if="Array.isArray(reposha)">
        <div>{{newPath}}</div>
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th>User Name</th>
              <th>Date</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in reposha" :key="data.id">
              <th scope="row" v-if="branchname === ''" v-on:click="getFolderFile(data.name)">{{data.name}}</th>
              <th v-else scope="row" v-on:click="getFolderFileBranch(data.name)">{{data.name}}</th>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <div>
          <div>{{newPath}}</div>  
          <b-card>
            <h5 slot="header" style="display: inline" class="mb-0">{{$route.params.reponame}}</h5>
            <div slot="header" style="display: inline; float: right; cursor: pointer;" pill variant="info" v-on:click="editContent(reposha.content, reposha.sha)">
              <i>
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="#0000FF" d="M4 19H10V21H4C2.89 21 2 20.1 2 19V5C2 3.9 2.89 3 4 3H16L20 7V9.12L18 11.12V7.83L15.17 5H4V19M14 10V6H5V10H14M20.42 12.3C20.31 12.19 20.18 12.13 20.04 12.13C19.9 12.13 19.76 12.19 19.65 12.3L18.65 13.3L20.7 15.35L21.7 14.35C21.92 14.14 21.92 13.79 21.7 13.58L20.42 12.3M12 19.94V22H14.06L20.12 15.93L18.07 13.88L12 19.94M14 15C14 13.34 12.66 12 11 12S8 13.34 8 15 9.34 18 11 18C11.04 18 11.08 18 11.13 18L14 15.13C14 15.09 14 15.05 14 15" />
                </svg>
              </i>
            </div>
            <div v-if="openEdit">
              <textarea style="height: 200px" class="form-control" type="text" v-model="editablestring"></textarea>
              <br>
              <input placeholder="Add Comment" class="form-control" type="text" v-model="contentComment">
              <br>
              <b-button href="javascript: void(0);" v-on:click="postDataFile()" variant="primary">Save</b-button>
            </div>
            <div v-else>
              <b-card-text>{{convertToString(reposha.content)}}</b-card-text>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
