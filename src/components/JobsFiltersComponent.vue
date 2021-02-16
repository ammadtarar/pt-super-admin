<template>
  <div class="modal-mask">
    <div class="card">
      <label class="title">Search & Filter</label>

      <form class="form">
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="ionput-label ">Title</label>
                <input
                  class="form-control"
                  placeholder="Job title"
                  v-model="form.title"
                />
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="ionput-label ">Location</label>
                <input
                  class="form-control"
                  placeholder="Job location"
                  v-model="form.location"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="ionput-label ">Reward Type</label>
                <select v-model="form.referral_success_reward_type">
                  <option disabled value="null">Select one type</option>
                  <option
                    v-for="item in reward_types"
                    v-bind:value="item"
                    v-bind:key="item"
                  >
                    {{ item.replace("_", " ").toUpperCase() }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="ionput-label ">Company</label>
                <select v-model="form.companyId">
                  <option disabled value="null">Select one company</option>
                  <option
                    v-for="item in companies"
                    v-bind:value="item.id"
                    v-bind:key="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="form-group">
            <label class="ionput-label ">URL</label>
            <input
              class="form-control"
              placeholder="Job url"
              v-model="form.url"
            />
          </div>
        </div>
      </form>

      <div class="actions">
        <button
          class="btn btn-outline-primary w-100 font-weight-bold"
          @click="cancel"
        >
          Cancel
        </button>

        <button class="btn btn-primary w-100 font-weight-bold" @click="search">
          Search
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { HTTP, URLS } from "../network/http";
var NotificationsController = require("../components/NotificationsController.js");

export default {
  name: "JobsFiltersComponent",
  props : ['filters'],
  data() {
    return {
      form: {},
      reward_types: ["points", "cash"],
      companies: [],
    };
  },
  methods: {
    getCompanies() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.COMPANY.LSIT_ALL;
      url = url + "?limit=9999999&page=1";
      HTTP.get(url)
        .then((response) => {
          let data = response.data;
          let rows = data.rows;
          this.companies = rows;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
    search(){
        console.log(this.form);
        this.$emit("search" , this.form);
    },
    cancel(){
        this.form = {};
        this.$emit("cancel");
    }
  },
  mounted() {
    this.form = this.$props.filters
    this.getCompanies();
  },
};
</script>
<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    width: 50%;
    max-height: 80%;
    background-color: white;
    border-radius: 4px;
    padding: 20px;

    .title {
      width: 100%;
      line-height: 50px;
      font-size: 20px;
      color: black;
    }

    .description {
      width: 100%;
      font-size: 16px;
      text-align: left;
      color: black;
    }

    .form {
      max-height: calc(100% - 200px);
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
    }

    .actions {
      height: 50px;
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-top: 20px;
    }
  }
}
</style>
