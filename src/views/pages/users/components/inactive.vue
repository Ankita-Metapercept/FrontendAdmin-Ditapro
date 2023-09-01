<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_length" class="dataTables_length">
                                    <label class="d-inline-flex align-items-center">
                                        Show&nbsp;
                                        <b-form-select v-model="perPage" size="sm"
                                            :options="pageOptions"></b-form-select>&nbsp;entries
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                                    <label class="d-inline-flex align-items-center">
                                        Search:
                                        <b-form-input v-model="filter" type="search" placeholder="Search Username..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="inactiveUserData" :fields="colfields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered"
                                :filter-function="filterTable" ref="inactiveUserTable" show-empty>
                                <template #cell(status)="row">
                                    <div class="badge font-size-12" :class="{
                                        'badge-soft-danger': `${row.item.isActive}` === 'false',
                                        'badge-soft-success': `${row.item.isActive}` === 'true'
                                    }">
                                        {{ row.item.isActive === true ? "Active" : "Deactive" }}
                                    </div>
                                </template>
                                <template #cell(action)="row">
                                    <b-button class="editbtn-cust-cls" size="sm" variant="success" @click="userAdd(row)"
                                        :ref="'btnInactive' + row.index">
                                        <span>
                                            <i class="d-inline-block mdi mdi-pencil puser-icon"></i>
                                        </span>
                                    </b-button>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div
                                class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <!-- rowcount -->
                                    <span class="py-2"> Total Rows: {{ this.inactiveUserData.length }}</span>
                                </ul>
                            </div>
                            <div class="row-pagination-cust-cls">
                                <ul class="pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination v-model="currentPage" :total-rows="rows"
                                        :per-page="perPage"></b-pagination>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            inactiveUserData: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "",
            sortDesc: true,
            colfields: [
                { key: "username", label: "Username", sortable: false },
                // { key: "status", label: "Status", sortable: false },
                { key: "action", label: "", sortable: false },
            ],
            error: null,
            submitted: false,
        };
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.inactiveUserData.length;
        },
    },
    created() {
        this.getInactiveUserData();
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        // This method is use to generate error or success message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getInactiveUserData() {
            let loader = this.$loading.show({
                loader: "dots",
            });
            this.$store.getters.client.get(`orguser/inactive/profile?orgId=${this.$store.state.Auth.orgId}`)
                .then((response) => {
                    this.inactiveUserData = response.data;
                    loader.hide();
                })
                .catch((err) => {
                    this.messageToast("Error", "danger", err.response.data.message);
                    loader.hide();
                });
    },
    userAdd(data) {
        this.$router.push({ path: `/useradd/${data.item.id}` });
    },
    filterTable(row, filter) {
        const filterUpperCase = filter.toUpperCase();
        const hasNameMatch = row.username.toUpperCase().startsWith(filterUpperCase);
        // const hasNameMatch = row.commit.message.startsWith(filter);
        return hasNameMatch;
    }
},
    };
</script>

<style>
.editbtn-cust-cls {
    float: right;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
    .row-count-cust-cls {
        /* float: right !important; */
        margin-bottom: 10px;
    }

    .row-pagination-cust-cls {
        margin-top: 20px;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .row-count-cust-cls ul {
        /* float: right !important; */
        margin-bottom: 10px;
        text-align: left !important;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {}
</style>