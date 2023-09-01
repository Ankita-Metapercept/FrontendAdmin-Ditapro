<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import axios from 'axios'

export default {
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      title: "Github Callback",
      items: [
        {
          text: "DITAxPresso"
        },
        {
          text: "Github CallBack",
          active: true
        }
      ]
    };

  },
  mounted() {

  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div>
        <h1>Git CallBack</h1>
        <!-- <a
          class="btn btn-primary w-md waves-effect waves-light"
          href="https://github.com/login/oauth/authorize?client_id=16f5273190aae79447d5&scope=repo"
        >Github</a> -->
    </div>
  </Layout>
</template>