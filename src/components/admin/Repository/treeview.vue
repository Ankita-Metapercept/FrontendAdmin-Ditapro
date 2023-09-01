<script>
import Vue from "vue";
import axios from 'axios'
import Swal from "sweetalert2";
export default {
  data() {
    return {
        apiURL: process.env.VUE_APP_DATABASEURL,
        // sha: '',
        treeData: [],
        treeDataArray: [],
        levelsecondArray: [],
        levelthirdArray: [],
        filedata: [],
        filesha: '',
        newPath: '',
        openEdit: false,
        contentComment: '',    
        editablestring: '',
        branchname: "main"
    }
  },
  props: {
    sha: Object
  },
  async mounted() {
    this.getFiles()
  },
  methods:{
    openGroupModal($event){
      console.log($event.target)
    },
    convertToString(code){
      return Buffer.from(code, 'base64').toString('ascii')
    },
    itemClick (node) {
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/repoSHA`, 
        headers: {
          gitToken: gitToken,
          repopath: node.model.path
        }
      }).then((res)=> {
          console.log(res)
          this.newPath = node.model.path
          this.filedata = res.data
          this.filesha = res.data.sha
      }).catch((err)=> {
          console.log(err)
      })
    },
    testItemToggle(node){
      console.log(node.model.sha)
    },
    getSHA(){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      console.log(username)
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
    editContent(code, sha){
      this.editablestring = Buffer.from(code, 'base64').toString('ascii')
      console.log(sha)
      if(this.openEdit){
        this.openEdit = false
      }
      else{
        this.openEdit = true
      }
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
            message: this.contentComment, content: this.editablestring, repopath: cutPath, sha: this.filedata.sha
          }
        }
        else {
          dataObj = {
            message: this.contentComment, 
            content: this.editablestring, 
            repopath: cutPath, 
            sha: this.filedata.sha,
            branch: this.branchname
          }
        }
        axios({
          method: 'put',
          url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/repoContent`, 
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
      }
      else{
        this.commentRequired()
      }
      
    },
    async getFiles(){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      await axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/sha/${this.sha.object.sha}/tree`, 
        headers: {
          gitToken: gitToken
        }
      }).then((res)=> {
        this.treeData = res.data.tree
        this.treeData.forEach(element => {
          var path1 = '/'+element.path
          if(element.type === 'tree'){
            this.levelsecond(element.sha, path1).then((res)=> {
              this.treeDataArray.push({text: element.path, path: path1, selected: false, sha: element.sha, opened: false, children: res})
            }).catch((err)=> {
              console.log(err)
            })
          }else{
            this.treeDataArray.push({text: element.path, path: path1, selected: false, icon: "fa fa-file icon-state-default", sha: element.sha, opened: false})
          }
        });
      }).catch((err)=> {
          console.log(err)
      })
    },
    async levelsecond(sha, path1){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      var levelsecondArray = []
      
      await axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/sha/${sha}/tree`, 
        headers: {
          gitToken: gitToken
        }
      }).then((res)=> {
        res.data.tree.forEach(element => {
          var path2 = path1 + '/' + element.path
          if(element.type === 'tree'){
            this.levelthird(element.sha, path2).then((res1)=> {
              levelsecondArray.push({text: element.path, path: path2,  selected: false, sha: element.sha, opened: false, children: res1})
            }).catch((err)=> {
              console.log(err)
            })
          }else{
            levelsecondArray.push({text: element.path, path: path2, icon: "fa fa-file icon-state-default", selected: false, sha: element.sha, opened: false})
          }
        });
      }).catch((err)=> {
          console.log(err)
      })
      if(levelsecondArray.length != 0){
        return levelsecondArray
      }else {
        return "No"
      }
    },
    async levelthird(sha, path2){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      var levelthirdArray = []
      await axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/sha/${sha}/tree`, 
        headers: {
          gitToken: gitToken
        }
      }).then((res)=> {
        console.log(res)
        res.data.tree.forEach(element => {
          var path3 = path2 + '/' + element.path
          if(element.type === 'tree'){
            this.levelfour(element.sha).then((res1)=> {
              levelthirdArray.push({text: element.path, path: path3,  selected: false, sha: element.sha, opened: false, children: res1})
            }).catch((err)=> {
              console.log(err)
            })
          }else{
            levelthirdArray.push({text: element.path, path: path3, icon: "fa fa-file icon-state-default", selected: false, sha: element.sha, opened: false})
          }
        });
      }).catch((err)=> {
          console.log(err)
      })
       if(levelthirdArray.length != 0){
        return levelthirdArray
      }else {
        return "No"
      }
    },
    async levelfour(sha){
      var username = this.$store.state.Auth.userId
      var gitToken = localStorage.getItem('gitToken')
      var levelfourArray = []
      await axios({
        method: 'get',
        url: `${this.apiURL}/api/${username.login}/${this.$route.params.reponame}/sha/${sha}/tree`, 
        headers: {
          gitToken: gitToken
        }
      }).then((res)=> {
        console.log(res)
        res.data.tree.forEach(element => {
          if(element.type === 'tree'){
            levelfourArray.push({text: element.path, selected: false, sha: element.sha, opened: false, children: [{}]})
          }else{
            levelfourArray.push({text: element.path, icon: "fa fa-file icon-state-default", selected: false, sha: element.sha, opened: false})
          }
        });
      }).catch((err)=> {
          console.log(err)
      })
       if(levelfourArray.length != 0){
        return levelfourArray
      }else {
        return "No"
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-3">
        <div v-if="sha !== ''" style="overflow-x: scroll;">
          <v-jstree :data="treeDataArray" allow-batch whole-row @item-click="itemClick" @item-toggle="testItemToggle" v-on:click="test()"></v-jstree>
        </div>
      </div>
      <div class="col-lg-9">
        <div v-if="filedata.length !== 0">
          <div>{{newPath}}</div>  
          <b-card>
            <h5 slot="header" style="display: inline" class="mb-0">{{$route.params.reponame}}</h5>
            <div slot="header" style="display: inline; float: right; cursor: pointer;" pill variant="info" v-on:click="editContent(filedata.content, filedata.sha)">
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
              <b-card-text>{{convertToString(filedata.content)}}</b-card-text>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
