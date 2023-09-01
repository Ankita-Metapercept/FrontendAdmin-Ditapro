<template>
  <div>
    <!-- <div class="d-flex align-items-center mb-3">
            <i class="d-inline-block mdi mdi-domain cmh-icon"></i>
            <h1 class="d-inline-block cmh-title">Organization Details</h1>
        </div> -->
    <PageHeader :icon="'mdi mdi-office-building h3'" :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body" v-if="!_.isEmpty(this.orgDetails)">
            <p><b>Organization Id :</b> {{ this.orgDetails.customId }} </p>
            <p><b>Organization Name : </b>{{ this.orgDetails.name }}</p>
            <p><b>Organization Email Address : </b>{{ this.orgDetails.email }}</p>
            <div role="tablist">
              <b-card no-body class="mb-2 shadow">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a v-b-toggle.accordion-1 class="text-dark" href="javascript: void(0);">Subscription Plan</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <p><b>Plan :</b> {{ this.orgSubscriptionPlanDetails.subscriptionPlanRef[0].title }}</p>
                      <p><b>Subscribed At :</b> {{ getFormattedDatesubscribedAt() }}</p>
                      <p><b>Plan Expiry : </b>{{ getFormattedDate() }}</p>
                      <p><b>Admin : </b>{{ this.orgSubscriptionPlanDetails.subscriptionPlanRef[0].adminCount }}</p>
                      <p><b>Users : </b>{{ this.orgSubscriptionPlanDetails.subscriptionPlanRef[0].userCount }}</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-2 shadow">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a v-b-toggle.accordion-2 class="text-dark" href="javascript: void(0);">User Details</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <p><b>Users :</b> {{ this.orgUserDetails.length }}</p>
                      <p><b>Admin : </b> {{ this.orgAdmin.length }}</p>
                      <p><b>Active Users : </b> {{ this.orgUserActive.length }}</p>
                      <p><b>Inactive Users : </b> {{ this.orgUserInactive.length }}</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-2 shadow">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a v-b-toggle.accordion-3 class="text-dark" href="javascript: void(0);">Vm's Specification</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <p><b>Vm Count : </b> 01</p>
                      <p><b>CPU : </b> 1 vCPU</p>
                      <p><b>Memory : </b> 614 MB</p>
                      <p><b>Basic Charges : </b> 01</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-2 shadow">
                <b-card-header header-tag="header" role="tab">
                  <h6 class="m-0">
                    <a v-b-toggle.accordion-4 class="text-dark" href="javascript: void(0);">Subdomain</a>
                  </h6>
                </b-card-header>
                <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <p><b>Subdomain Name : </b> {{ this.orgDetails.accessURL }}</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Layout from "../../layouts/main";
// import PageHeader from "@/components/page-header";
// import EarningReport from "./earning";
// import RecentActivity from "./recent-activity";
// import RecentPublication from "./recent-publication";
// import ReleaseLog from "./release-log";
import _ from "lodash";
import { mapState } from "vuex";
import PageHeader from "@/components/page-header";
export default {
  components: {
    PageHeader
  },
  data() {
    return {
      title: "Organization",
      items: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "Organization",
          active: true
        }
      ],
      orgDetails: [],
      orgUserDetails: [],
      orgSubscriptionPlanDetails: [],
      orgAdmin: [],
      orgUserActive: [],
      orgUserInactive: []
    };
  },
  computed: {
    ...mapState(["gorgdetails"]),
    _() {
      return _;
    },
  },
  created() {
    this.getorgDetails(),
      this.getOrgUserDetails()
  },
  methods: {
    getFormattedDate() {
      const timestamp = this.orgSubscriptionPlanDetails.planExpiry;
      const dateObject = new Date(timestamp);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();

      return `${year}-${month}-${day}`;
    },
    getFormattedDatesubscribedAt() {
      const timestamp = this.orgSubscriptionPlanDetails.subscribedAt;
      const dateObject = new Date(timestamp);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();

      return `${year}-${month}-${day}`;
    },
    getorgDetails() {
      let OrgID = localStorage.getItem("orgId")
      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client.get(`serveradmin/organization/byorgid?orgId=${OrgID}`)
        .then((response) => {
          this.orgDetails = response.data[0]
          let subscriptionRef = this.orgDetails.subscriptionRef[0]
          this.$store.getters.client.get(`orgadmin/subscriptionDetails?subscriptionId=${subscriptionRef}`)
            .then((response) => {
              loader.hide();
              this.orgSubscriptionPlanDetails = response.data
            })
            .catch((err) => {
              loader.hide();
              this.apiError(err.response.data.error, this.$store)
            })

        })
        .catch((err) => {
          loader.hide();
          this.apiError(err.response.data.error, this.$store)
        })
    },
    getOrgUserDetails() {
      let OrgID = localStorage.getItem("orgId")
      this.$store.getters.client.get(`orguser/byorgid?orgId=${OrgID}`)
        .then((response) => {
          loader.hide();
          this.orgUserDetails = response.data
        })
        .catch((err) => {
          loader.hide();
          this.apiError(err.response.data.error, this.$store)
        })
      this.$store.getters.client.get(`orguser/active/profile?orgId=${OrgID}`)
        .then((response) => {
          loader.hide();

          this.orgUserActive = response.data
        })
        .catch((err) => {
          loader.hide();

          this.apiError(err.response.data.error, this.$store)
        })
      this.$store.getters.client.get(`orguser/inactive/profile?orgId=${OrgID}`)
        .then((response) => {
          loader.hide();
          this.orgUserInactive = response.data
        })
        .catch((err) => {
          loader.hide();
          this.apiError(err.response.data.error, this.$store)
        })

      let loader = this.$loading.show({
        loader: "dots",
      });
      this.$store.getters.client.get(`orgadmin`)
        .then((response) => {
          loader.hide();
          this.orgAdmin = response.data
        })
        .catch((err) => {
          loader.hide();
          this.apiError(err.response.data.error, this.$store)
        })
    },
  }
};
</script>
