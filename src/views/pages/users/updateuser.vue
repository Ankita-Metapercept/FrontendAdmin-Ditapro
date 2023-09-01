<template>
    <div>
        <PageHeader :icon="'mdi mdi-account-multiple h3'" :title="title" :items="items" />
        <UpdateUser />
    </div>
</template>

<script>
    import PageHeader from "../../../components/page-header.vue";
    import UpdateUser from "./components/updateUser.vue";

    export default {
        components: {
            PageHeader,
            UpdateUser,
        },
        data() {
            return {
                title: "Edit User",
                items: [
                {
                    text: "Dashboard",
                    href: "/"
                },
                {
                    text: "Users",
                    href: "/users"
                },
                {
                    text: "Edit User",
                    active: true
                }
            ],
            };
        },
    };
</script>