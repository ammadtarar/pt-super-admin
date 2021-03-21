<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div class="title-coontainer">
              <h5 class="card-title">Jobs ({{ count }})</h5>
              <div class="filters-cont">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="showFilters = true"
                >
                  Search & Filters
                </button>

                <button
                  v-if="isFilterEmpty()"
                  type="button"
                  class="btn btn-outline-danger"
                  @click="clearFilters"
                >
                  Clear Filters
                </button>

                <pager :limit="limit" @onPageChanged="onPageChanged"></pager>
              </div>
            </div>

            <table
              class="table table-striped"
              style="height : 300px !important"
            >
              <thead>
                <tr>
                  <th style="width : 5%" scope="col">ID</th>
                  <th style="width : 10%" scope="col">Creation Date</th>
                  <th style="width : 15%" scope="col">Title</th>
                  <th style="width : 10%" scope="col">Company</th>
                  <th style="width : 10%" scope="col">Location</th>
                  <th style="width : 15%" scope="col">URL</th>
                  <th style="width : 10%" scope="col">Reward Type</th>
                  <th style="width : 10%" scope="col">Reward Value</th>
                  <th style="width : 5%" scope="col">Status</th>
                  <th style="width : 10%" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-bind:key="job.id" v-for="job in jobs">
                  <th scope="row">{{ job.id }}</th>
                  <td>
                    {{ moment(job.createdAt).format("MMM D YYYY") }}
                  </td>
                  <td>{{ job.title }}</td>
                  <td>{{ job.company.name }}</td>
                  <td>{{ job.location }}</td>
                  <td>{{ job.url }}</td>
                  <td style="text-transform:capitalize;">{{ job.referral_success_reward_type }}</td>
                  <td>{{job.cash_reward_currency ? job.cash_reward_currency : ''}}{{ job.referral_success_reward_value }}</td>
                  <td>{{ job.is_active ? "Active" : "InActive" }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button
                        v-if="!job.is_active"
                        type="button"
                        class="btn btn-outline-success"
                        @click="enableJob(job)"
                      >
                        Enable
                      </button>
                      <button
                        v-if="job.is_active"
                        type="button"
                        class="btn btn-outline-danger"
                        @click="disableJob(job)"
                      >
                        Disable
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <item-update-status-component
        :schemtics="jobUpdateSchemetics"
        v-if="showUpdateComponent"
        @success="onUpdateSuccess"
        @cancel="onUpdateCancelled"
      ></item-update-status-component>

      <jobs-filters-component
        v-if="showFilters"
        :filters="filters"
        @search="onFiltersUpdated"
        @cancel="showFilters = false"
      ></jobs-filters-component>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
import Pager from "../components/Pager";
var NotificationsController = require("../components/NotificationsController.js");

import ItemUpdateStatusComponent from "../components/ItemUpdateStatusComponent.vue";
import JobsFiltersComponent from "../components/JobsFiltersComponent.vue";
import moment from "moment";
export default {
  name: "jobs",
  components: {
    NavBar,
    Pager,
    ItemUpdateStatusComponent,
    JobsFiltersComponent,
  },
  data() {
    return {
      keyword: "",
      resultsPerPage: 10,
      count: 0,
      page: 1,
      limit: 0,
      jobs: [],
      jobUpdateSchemetics: {},
      showUpdateComponent: false,
      showFilters: false,
      filters: {},
    };
  },
  methods: {
    isFilterEmpty() {
      return Object.keys(this.filters).length != 0;
    },
    clearFilters() {
      this.filters = {};
      this.page = 1;
      this.getJobs();
    },
    onFiltersUpdated(filters) {
      this.filters = filters;
      this.page = 1;
      this.showFilters = false;
      this.getJobs();
    },
    onUpdateCancelled() {
      this.showUpdateComponent = false;
      this.jobUpdateSchemetics = {};
    },
    onUpdateSuccess() {
      this.showUpdateComponent = false;
      this.jobUpdateSchemetics = {};
      this.getJobs();
    },
    enableJob(job) {
      let url = URLS.JOBS.BY_ID.replace(":id", job.id);
      this.jobUpdateSchemetics = {
        endpoint: url,
        title: "Enable Job",
        description: `Are you sure you want to mark the job : <b> ${job.title} </b> as active ?`,
        body : {
          is_active : true
        }
      };
      this.showUpdateComponent = true;
    },
    disableJob(job) {
      let url = URLS.JOBS.BY_ID.replace(":id", job.id);
      this.jobUpdateSchemetics = {
        endpoint: url,
        title: "Disable Job",
        description: `Are you sure you want to mark the job : <b> ${job.title} </b> as inactive ?`,
        body : {
          is_active : false
        }
      };
      this.showUpdateComponent = true;
    },
    onPageChanged(page) {
      this.page = page;
      this.getJobs();
    },
    getJobs() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.JOBS.LIST_ALL;
      url = url + "?limit=" + this.resultsPerPage;
      url = url + "&page=" + this.page;
      console.log("HELLO");

      Object.keys(this.filters).forEach((element) => {
        console.log("element = ", element);
        if (this.filters[element]) {
          console.log("this.filters[element] = ", this.filters[element]);
          url = `${url}&${element}=${this.filters[element]}`;
        }
      });

      HTTP.get(url)
        .then((response) => {
          let data = response.data;
          let rows = data.rows;
          ctx.count = data.count;
          let limit = Math.ceil(data.count / ctx.resultsPerPage);
          ctx.limit = limit;
          ctx.previousEnable = limit > 0;
          ctx.nextEnable = ctx.page < limit;
          ctx.jobs = rows;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.getJobs();
    this.moment = moment;
  },
};
</script>

<style lang="scss">
.page-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  nav-bar {
    height: 100px;
    width: 100%;
  }

  .page {
    width: 100%;
    height: 90%;
    overflow-y: scroll;
  }

  .title-coontainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    align-items: center;

    .filters-cont {
      display: flex;
      flex-direction: row;
      button {
        margin-right: 10px;
      }
    }
  }
}

.table-card {
  box-shadow: 0px 0px 10px 0px #bdbdbd;
}

.actions {
  button {
    margin-right: 4px;
  }
}
</style>
