<template>
    <div>
        <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items"  />
        <div class="row">
            <div class="col-xl-12">
                <Stat />
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <ReleaseLog />
            </div>
            <div class="col-lg-6">
                <RecentNotification />
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from "@/components/page-header";
import Stat from "./widget";
import RecentNotification from "./recent-notification";
import ReleaseLog from "./release-log";
export default {
    components: {
        PageHeader,
        Stat,
        RecentNotification,
        ReleaseLog,
    },
    data() {
        return {
            title: "Dashboard",
            items: [
                {
                    text: "Dashboard",
                    active: true,
                },
            ],
        };
    },
};
</script>