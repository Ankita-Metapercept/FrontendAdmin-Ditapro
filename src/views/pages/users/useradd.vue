<template>
    <div>
        <PageHeader :icon="'mdi mdi-account-multiple h3'" :title="title" :items="items" />
        <AddUser />
    </div>
</template>

<script>
    import PageHeader from "../../../components/page-header.vue";
    import AddUser from "./components/addUser.vue";

    export default {
        components: {
            PageHeader,
            AddUser,
        },
        data() {
            return {
                title: "Add User",
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
                    text: "Add User",
                    active: true
                }
            ],
            };
        },
    };
</script>