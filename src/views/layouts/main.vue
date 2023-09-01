<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";
// import PageHeader from "@/components/page-header";
import Horizontal from "./horizontal";

export default {
  components: { Vertical, Horizontal, 
  // PageHeader 
  },
  data() {
    return {
      title: "",
      items: [],
    };
  },
  computed: {
    ...layoutComputed,
  },
  methods: {
    getRoutes() {
      this.title = this.$route.name;
    },
    verfiyToken() {
      if (
        this.$store.state.Auth.token === "null" ||
        this.$store.state.Auth.token === null ||
        this.$store.state.Auth.token === undefined
      ) {
        this.$router.push({ name: "Login" });
      }
    },
    verifyChangePassword(){
      if(this.$store.state.Auth.isChangePassword === true || 
      this.$store.state.Auth.isChangePassword === "true" 
      ){
        // this.$router.push({ name: "Dashboard" });
      }
      else if(this.$store.state.Auth.isChangePassword !== true){
        this.$router.push({ name: "ChangePassword" });
      }
    }
  },
  mounted() {
    this.getRoutes();
    this.verfiyToken();
    this.verifyChangePassword();
  },
  watch: {
    // add (to, from) in method params if required more details about this
    $route() {
      this.items = [];
      this.items.push({ text: this.$route.name, href: "/" });
      this.title = this.$route.name;
      // console.log(to, "to");
      // console.log(from, "fromn");
      this.show = false;
    },
  },
};
</script>

<template>
  <div>
    <vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <!-- <PageHeader :title="title" :items="items" /> -->
      <slot />
      <router-view />
    </vertical>
    <Horizontal v-if="layoutType === 'horizontal'" :layout="layoutType">
      <slot />
    </Horizontal>
  </div>
</template>
