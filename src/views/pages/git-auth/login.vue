<script>
export default {
  data() {
    return {
      title: "Github ",
      items: [
        {
          text: "DITAxPresso",
        },
        {
          text: "Github Athentication",
          active: true,
        },
      ],
      clientId:
        "https://github.com/login/oauth/authorize?client_id=8d53f7d23e73bb1c6b87&scope=repo",
    };
  },
};
</script>

<template>
  <div>
    <!-- <h1>Git Authentication</h1> -->
    <div class="row">
      <div class="col-lg-4">
        <b-card no-body class="text-center">
          <b-card-body>
            <img
              src="https://raw.github.com/github/media/master/octocats/octocat.png"
              height="200"
            />
            <b-card-title>
              <h4 class="card-title">Connect with github</h4>
            </b-card-title>
            <b-card-text>
              To access the project using github need to login in github
            </b-card-text>
            <a :href="clientId" class="btn btn-primary btn-block">Login</a>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>