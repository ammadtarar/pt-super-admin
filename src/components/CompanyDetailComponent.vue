<template>
  <div class="modal-mask">
    <div class="user-form-card">
      <label class="title">Company Details</label>

      <div class="container" style="margin-left : -18px ; margin-bottom : 20px">
        <div class="row">
          <div class="col-md-auto">
            <div class="input-group" style="margin-right : 10px">
              <div class="input-group-text" id="btnGroupAddon">
                ID
              </div>
              <label type="search" class="form-control">{{ company.id }}</label>
            </div>
          </div>

          <div class="col-md-auto">
            <div class="input-group" style="margin-right : 10px">
              <div class="input-group-text" id="btnGroupAddon">
                Date
              </div>
              <label type="search" class="form-control">
                <!-- {{ moment(company.createdAt).format("MMM D YYYY, h:mm:ss a") }} -->
                {{company.createdAt}}
              </label>
            </div>
          </div>

          <div class="col-md-auto">
            <div class="input-group" style="margin-right : 10px">
              <div class="input-group-text" id="btnGroupAddon">
                Name
              </div>
              <label type="search" class="form-control">{{
                company.name
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <label class="title">Users List</label>

      <div class="new-users-container">
        <table class="table" style="text-align : center">
          <thead>
            <tr>
              <th style="width : 2.5%" scope="col">#</th>
              <th style="width : 15%" scope="col">First Name</th>
              <th style="width : 15%" scope="col">Last Name</th>
              <th style="width : 17.5%" scope="col">Position</th>
              <th style="width : 30%" scope="col">Email</th>
              <th style="width : 17.5%" scope="col">Type</th>
              <th style="width : 2.5%" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="user.first_name" v-for="(user, index) in users">
              <th scope="row">{{ user.id }}</th>
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.position }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.user_type.replace('_' , ' ').toUpperCase() }}</td>

              <td>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="onDeleteItem(index)"
                  >
                    X
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="actions">
        <button class="btn btn-primary w-100 font-weight-bold" @click="dismiss">
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { URLS, HTTP } from "../network/http";
import moment from "moment";

let NotificationsController = require("../components/NotificationsController.js");
export default {
  name: "CompanyDetailComponent",
  props: ["model"],
  components: {},
  data() {
    return {
      title: "",
      description: "",
      company: {},
      users: [],
    };
  },
  methods: {
    onDeleteItem(index) {
      if (index == 0) {
        return;
      }
      this.users.splice(index, 1);
    },
    addMore() {
      this.users.push({});
    },
    dismiss() {
      this.$emit("hide");
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    cancel() {
      this.$emit("cancel");
    },
    getCompany() {
      NotificationsController.showActivityIndicator();
      HTTP.get(`${URLS.COMPANY.BY_ID.replace(":id", this.company.id)}`)
        .then((response) => {
          console.log("sdoasidosad ==");
          console.log(response.data.users);
          this.users = response.data.users;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          var msg = "";
          try {
            msg = err.response.data.message;
          } catch (error) {
            msg = err.message;
          }
          this.$toast.error(msg);
          this.$emit("fail", err.response);
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.moment = moment;
    let companyProp = this.$props.model;
    if (companyProp === null || companyProp === undefined) {
      throw new Error("AddCompanyUsersComponent is missing the model prop");
    }
    this.company = companyProp;
    this.title = `Company Details`;
    this.getCompany();
  },
};
</script>
<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
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

  .user-form-card {
    width: 90%;
    max-height: 90%;
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

    .new-users-container {
      width: 100%;
      max-height: 500px;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;

      select {
        padding: 0.35rem;
        width: 100%;
        vertical-align: top;
        border: 1px solid #dee2e6;
        color: #495057;
      }
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
