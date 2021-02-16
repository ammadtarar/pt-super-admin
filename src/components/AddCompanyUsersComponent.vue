<template>
  <div class="modal-mask">
    <div class="user-form-card">
      <label class="title">{{ title }}</label>
      <label class="description" v-html="description"></label>

      <div class="new-users-container">
        <button
          @click="addMore"
          type="button"
          class="btn btn-link"
          style="width : 100px ; margin-left : auto ; outline : none"
        >
          Add More
        </button>

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
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <input
                  class="form-control"
                  v-model="user.first_name"
                  type="text"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  v-model="user.last_name"
                  type="text"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  v-model="user.position"
                  type="text"
                />
              </td>
              <td>
                <input class="form-control" type="text" v-model="user.email" />
              </td>
              <td>
                <select v-model="user.user_type">
                  <option disabled value="null">Select one type</option>
                  <option
                    v-for="item in userTypes"
                    v-bind:value="item"
                    v-bind:key="item"
                  >
                    {{ item.replace("_", " ").toUpperCase() }}
                  </option>
                </select>
              </td>

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
        <button
          class="btn btn-outline-primary w-100 font-weight-bold"
          @click="cancel"
        >
          Cancel
        </button>
        <button class="btn btn-primary w-100 font-weight-bold" @click="save">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { URLS, HTTP } from "../network/http";
let NotificationsController = require("../components/NotificationsController.js");
export default {
  name: "AddCompanyUsersComponent",
  props: ["model"],
  components: {},
  data() {
    return {
      title: "",
      description: "",
      company: null,
      users: [{}],
      userTypes: ["employee", "hr_admin"],
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
    save() {
      var isMissingData = false;
      this.users.forEach((element) => {
        if (
          !element.first_name ||
          !element.last_name ||
          !element.email ||
          !element.user_type ||
          !element.position
        ) {
          isMissingData = true;
          this.$toast.warning(
            "Missing data. Please make sure you input all fields"
          );
          return;
        } else if (!this.validateEmail(element.email)) {
          isMissingData = true;
          this.$toast.warning(`${element.email} is not a valid email`);
          return;
        } else {
          element.companyId = this.company.id;
          element.user_type = element.user_type.toLowerCase();
        }
      });

      if (isMissingData) {
        return;
      }

      console.log(JSON.parse(JSON.stringify(this.users)));
      //   return;
      NotificationsController.showActivityIndicator();

      HTTP.post(URLS.USER.CREATE, {
        users_list: this.users,
      })
        .then((response) => {
          NotificationsController.hideActivityIndicator();
          this.$toast.success(response.data.message);
          this.$emit("success", response.data);
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
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    let companyProp = this.$props.model;
    if (companyProp === null || companyProp === undefined) {
      throw new Error("AddCompanyUsersComponent is missing the model prop");
    }
    this.company = companyProp;
    this.title = `Add Users To ${this.company.name}`;
    this.description = `You can add multiple users to the company at once. Once you click save , and email and login details will be send to all the users.`;
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

    .new-users-container {
      width: 100%;
      max-height: 500px;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
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
