<template>
    <div>
        <div class="card">
            <div class="card-body publication-card-body-cust-cls">
                <div class="media">
                    <div class="media-body overflow-hidden">
                        <div class="d-flex align-items-center">
                            <i class="d-inline-block mdi mdi-bell cmh-icon"></i>
                            <h1 class="d-inline-block cmh-title">Recent Notification</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body border-top py-3">
                <div data-simplebar style="height: 40vh;">
                    <ul class="list-unstyled activity-wid">
                        <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2"
                            :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
                        <div v-else-if="activityData.length > 0 && !showSpinner">
                            <li class="activity-list publication-list-cust-cls" v-for="(data, index) in activityData"
                                :key="index">
                                <div class="d-flex justify-content-between">
                                    <div class="activity-icon avatar-xs">
                                        <span
                                            class="avatar-title bg-soft-primary text-primary rounded-circle font-size-24 avatar-title-cust-cls">
                                            <i :class="`${data.icon}`"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <div>
                                            <h5 class="font-size-13 ptitle-cust-cls">
                                                {{ data.publication_name
                                                }}
                                            </h5>
                                        </div>
                                        <div>
                                            <p class="text-muted mb-0">{{ data.message }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="text-muted  mb-0 mr-5" style="font-size: smaller;">{{
                                            getTimeAgo(data.releaseAt) }}</p>
                                    </div>
                                </div>
                            </li>
                        </div>
                        <li v-else>
                            <div class="d-flex justify-content-center align-items-center m-0 p-0">
                                <div style="text-align: center;">
                                    <img style="height: 200px;" src="../../../assets/placeholder.png" />
                                    <div style=" color: #666; font-size: 16px; text-align: center;">
                                        There have been no recent notifications in the last 24 hours.
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { handleApiError } from '../../../apiErrorHandler.js';
import {URL} from '@/api/global.env.js'
export default {

    data() {
        return {
            activityData: [
            ],
            showSpinner: true,
            orgId: localStorage.getItem('orgId')
        };
    },
    mounted() {
        this.getNotification()
    },
    methods: {
        getTimeAgo(timestamp) {
            const now = new Date();
            const timeDiff = now.getTime() - new Date(timestamp).getTime();
            const minuteDiff = Math.floor(timeDiff / 60000); // 60000 milliseconds in a minute

            if (minuteDiff < 1) {
                return 'just now';
            } else if (minuteDiff < 60) {
                return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
            } else {
                const hourDiff = Math.floor(minuteDiff / 60);
                if (hourDiff < 24) {
                    return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
                } else {
                    const dayDiff = Math.floor(hourDiff / 24);
                    if (dayDiff < 30) {
                        return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
                    } else {
                        const monthDiff = Math.floor(dayDiff / 30);
                        if (monthDiff < 12) {
                            return `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`;
                        } else {
                            const yearDiff = Math.floor(monthDiff / 12);
                            return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
                        }
                    }
                }
            }
        },
        getNotification() {
            let gitToken = localStorage.getItem('gitToken');
            let orgId = localStorage.getItem('orgId');
            let token = localStorage.getItem('token');
            axios({
                method: 'get',
                url: `${URL}api/orgadmin/notification/24hrsCommit?orgId=${orgId}`,
                headers: {
                    gitToken: gitToken,
                    Authorization: `Bearer ${token}`,
                    userId: localStorage.getItem('orgId'),
                    orgId: localStorage.getItem('orgId')
                }
            }).then((res) => {
                res.data.forEach((ele) => {
                    this.showSpinner = false;
                    this.activityData.push({
                        publication_name: ele.projectName,
                        icon: "ri-price-tag-3-fill",
                        message: ele.message,
                        author: ele.releasedBy,
                        releaseAt: ele.commiter.date,
                    })
                });
            }).catch((error) => {
                handleApiError(error);
                this.showSpinner = false;
                if (error.response.data.message == "Another device has login with your account!") {
                    localStorage.clear()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Another device has logged in with your account!',
                    }).then(() => {
                        window.location.href = '/';
                    });
                }
                if (error.response.data.message == "Invalid Token") {
                    localStorage.clear()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Your session has expired. Please log in again to continue accessing the DITAxPresso. ',
                    }).then(() => {
                        window.location.href = '/';
                    });
                }
                if (error.response.data.message == "The current subscription of your organization has been expired !") {
                    localStorage.clear()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'The current subscription of your organization has been expired. Please ask your organization to renew the subscription plan to use our services again. Thank you!',
                    }).then(() => {
                        window.location.href = '/';
                    });
                }

            })
        },
    }
};
</script>

<style scoped>
.activity-wid .activity-list:before {
    content: none;
}

.text-primary {
    color: #5664d2 !important;
}

.ptitle-cust-cls {
    margin-bottom: 0px;
}

.bg-soft-primary {
    background-color: transparent !important;
}

.publication-card-body-cust-cls {
    padding: 0.25rem 1.25rem !important;
}

.publication-list-cust-cls {
    padding: 0 0 25px 30px !important;
}
</style>