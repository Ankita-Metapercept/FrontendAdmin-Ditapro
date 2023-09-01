<template >
  <div>
    <PageHeader :icon="'ri-customer-service-fill h3'" :title="title" :items="items" />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-lg-7 card">
          <form @submit.prevent="sendContactEmail()" class="col-md-12">
            <h2 class="h1-responsive font-weight-bold text-center my-4">
              Contact us
            </h2>
            <p class="text-center mx-auto mb-5">
              Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you
              within a matter of hours to help you.
            </p>
            <div class="form-group">
              <label for="name">Organization name <span class="text-danger">*</span></label>
              <input v-validate="'required'" required v-model="formData.name" @keydown.space="preventLeadingSpace"
                name="name" type="text" class="form-control" id="name" placeholder="Enter organization name"
                :class="{ 'is-invalid': submitted && $v.name.$error }" />
              <p class="text-danger text-sm"
                v-show="errors.has('name') && _.find(errors.items, { field: 'name' }).rule == 'required'">
                <span>Organization name field is required</span>
              </p>
            </div>
            <div class="form-group">
              <label for="username">Username<span class="text-danger">*</span></label>
              <input v-validate="'required'" required v-model="formData.username" @keydown.space="preventLeadingSpace"
                name="username" type="text" class="form-control" id="username" placeholder="Enter username"
                :class="{ 'is-invalid': submitted && $v.username.$error }" />
              <p class="text-danger text-sm"
                v-show="errors.has('username') && _.find(errors.items, { field: 'username' }).rule == 'required'">
                <span>Username field is required</span>
              </p>
            </div>
            <div class="form-group">
              <label for="email_body">Write message<span class="text-danger">*</span></label>
              <textarea v-validate="'required'" required v-model="formData.message" @keydown.space="preventLeadingSpace"
                name="message" id="message" class="form-control" rows="4" placeholder="Enter your message here"
                :class="{ 'is-invalid': submitted && $v.message.$error }"></textarea>
              <p class="text-danger text-sm"
                v-show="errors.has('message') && _.find(errors.items, { field: 'message' }).rule == 'required'">
                <span>Message field is required</span>
              </p>
            </div>
            <div class="form-group mb-0 d-flex justify-content-end">
              <div class="text-right">
                <button type="submit" class="btn btn-primary">
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import _ from "lodash";
import PageHeader from "@/components/page-header";
export default {
  components: {
    PageHeader,
  },
  data() {

    return {
      title: "Contact To Support",
      items: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "Contact To Support",
          active: true
        }
      ],
      formData: {
        name: "",
        username: "",
        message: "",
        email_body: "",
        subject: "Contact To Support form",
        to_email: "pranav.c@metapercept.com",
      },
      submitted: false,
      typesubmit: false,
    };
  },
  computed: {
    _() {
      return _;
    },
  },

  methods: {
    preventLeadingSpace(e) {
      // only prevent the keypress if the value is blank
      if (!e.target.value) e.preventDefault();
      // otherwise, if the leading character is a space, remove all leading white-space
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },
    messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
      this.$bvToast.toast(messageToastContent, {
        title: messageToastTitle,
        variant: messageToastVariant,
        solid: true,
      });
    },
    setEmailBody() {
      this.formData.email_body = `
    <html>
      <body>
        <p>Hello,Support Team</p>
        <p>You have received a new message from the contact form on DITAxPressoFrontendAdmin website.</p>

        <p>Details:</p>
        <ul>
          <li><strong>Organization Name:</strong> ${this.formData.name}</li>
          <li><strong>Name of user:</strong> ${this.formData.username}</li>
        </ul>

        <p><strong>Message:</strong>${this.formData.message}</p>

        <p>Please respond to this message as soon as possible.</p>

        <p>Best regards,</p>
        <p>${this.formData.name}</p>
      </body>
    </html>`;
    },
    getOrgUserDetails() {
      let OrgID = localStorage.getItem("orgId");
      this.$store.getters.client
        .get(`serveradmin/organization/byorgid?orgId=${OrgID}`)
        .then((response) => {
          this.formData.name = response.data[0].name;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProfileData() {
      this.$store.getters.client
        .get(`orgadmin/byid?userId=${this.$store.state.Auth.userId}`)
        .then((response) => {
          //   this.userprofile = response.data;
          this.formData.username = response.data[0].name;
        });
    },
    sendContactEmail() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let loader = this.$loading.show({
            loader: "dots",

          });
          this.setEmailBody();
          this.$store.getters.client
            .post("/sendmail", this.formData)
            .then((response) => {
              console.log(response);
              loader.hide();
              this.messageToast(
                "Success",
                "success",
                `Thank you again for contacting us, and we look forward to resolving your issue.
Best regards,
DITAXPRESSO TECHNOLOGY PRIVATE LIMITED Support Team`
              );
              setTimeout(() => {
                this.$router.push("/dashboard");
              }, 1000);
            })
            .catch((err) => {
              loader.hide();
              console.log(err);
            })
        }
      });
    },
  },

  created() {
    this.getOrgUserDetails(), this.getProfileData();
  },
};
</script>
