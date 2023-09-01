<template>
    <div>
        <div>
            <!-- <div class="d-flex align-items-center mb-3">
                <i class="d-inline-block mdi mdi-account-multiple cmh-icon"></i>
                <h1 class="d-inline-block cmh-title">Users</h1>
            </div> -->
            <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
                <b-tab active>
                    <template v-slot:title>
                        <span class="d-inline-block d-sm-none" style="font-weight: 900; color: blue;">Active Users</span>
                        <span class="d-none d-sm-inline-block" style="font-weight: 900; color: blue;">Active Users</span>
                    </template>
                    <ActiveUsers />
                </b-tab>
                <b-tab>
                    <template v-slot:title>
                        <span class="d-inline-block d-sm-none" style="font-weight: 900; color: blue;">Inactive Users</span>
                        <span class="d-none d-sm-inline-block" style="font-weight: 900; color: blue;">Inactive Users</span>
                    </template>
                    <InactiveUsers />
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import ActiveUsers from "./active.vue";
    import InactiveUsers from "./inactive.vue";
    export default {
        components: {
            ActiveUsers,
            InactiveUsers
        },
        data() {
            return {};
        },
        created() {},
        methods: {},
    };
</script>

<style></style>