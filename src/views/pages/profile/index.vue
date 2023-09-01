<template>
  <div>
    <PageHeader :icon="'mdi mdi-account-circle h3'" :title="title" :items="items" />
    <Details />
  </div>
</template>

<script>
import PageHeader from '../../../components/page-header.vue';
import Details from './components/details.vue';

export default {
  components: {
    PageHeader,
    Details
  },
  data() {
    return {
      title: "Profile",
            items: [
                {
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "Profile",
                    active: true
                }
            ],
    };
  },
};
</script>
