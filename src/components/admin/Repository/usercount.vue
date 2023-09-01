<script>
import axios from 'axios'
import _ from 'lodash';

export default {
  data() {
    return {
      apiURL: process.env.VUE_APP_DATABASEURL,
      appgituser: 0,
      authorrole: [],
      reviewerrole: 0
    }
  },
  props: {
    reponame: String
  },
  mounted() {
    // this.getUserCount()
  },
  methods: {
    getUserCount(){
    axios({
        method: 'get',
        url: `${this.apiURL}/api/projectUserByName/${this.reponame}`
      }).then((res)=> {
          this.appgituser = res.data
          this.authorrole = (_.filter(res.data, (e)=> { return e.userRole === 'Author' && e.acceptInvitation === true }))
          this.reviewerrole = (_.filter(res.data, (e)=> { return e.userRole === 'Reviewer' && e.acceptInvitation === true }))
      }).catch((err)=> {
          console.log(err)
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="text-truncate">
      <span class="text-muted ml-2" style="color: #5664d2 !important">
          Author
      </span>
      <b-badge pill variant="primary">{{authorrole.length}}</b-badge>
        <span class="text-muted ml-2" style="color: #5664d2 !important">
          Reviewer
        </span>
      <b-badge pill variant="primary">{{reviewerrole.length}}</b-badge>
    </div>
  </div>
</template>
