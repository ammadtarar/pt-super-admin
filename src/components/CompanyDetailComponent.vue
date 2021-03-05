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
                {{ company.createdAt }}
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
        <table class="table">
          <thead>
            <tr>
              <th style="width : 3%" scope="col">#</th>
              <th style="width : 14%" scope="col">First Name</th>
              <th style="width : 14%" scope="col">Last Name</th>
              <th style="width : 11%" scope="col">Position</th>
              <th style="width : 25%" scope="col">Email</th>
              <th style="width : 14%" scope="col">Type</th>
              <th style="width : 9%" scope="col">Status</th>
              <th style="width : 10%" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="index" v-for="(user , index) in users">
              <th scope="row">{{ user.id }}</th>
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.position }}</td>
              <td>{{ user.email }}</td>
              <td style="text-transform:capitalize;">{{ user.user_type.replace("_", " ").replace("_", " ").replace("_", " ") }}</td>
              <td style="text-transform:capitalize;">{{ user.status.replace("_", " ") }}</td>

              <td>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-warning"
                    @click="editUser(user)"
                  >
                    Edit
                  </button>

                  <button
                    v-if="user.status === 'active'"
                    type="button"
                    class="btn btn-outline-danger"
                    @click="disableUser(user)"
                  >
                    Disable
                  </button>

                  <button
                    v-if="user.status === 'archived'"
                    type="button"
                    class="btn btn-outline-success"
                    @click="enableUser(user)"
                  >
                    Enable
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

    <user-status-update-component
      v-if="showDeleteComponent"
      :schemtics="companyDeleteSchemetics"
      @success="onCompanyDeleteSuccess"
      @cancel="onCompanyDeleteCancelled"
    ></user-status-update-component>


     <single-item-creation-component
        v-if="showEditUserComponent"
        :schemtics="editUserScheme"
        @success="onUserUpdateSuccess"
        @fail="onUserUpdateFailed"
        @cancel="onUserUpdateCancelled"
      ></single-item-creation-component>


  </div>
</template>

<script>
import { URLS, HTTP } from "../network/http";
import moment from "moment";
let NotificationsController = require("../components/NotificationsController.js");
import DeleteItemModal from "../components/DeleteItemModal.vue";
import UserStatusUpdateComponent from "../components/UserStatusUpdateComponent.vue";
import SingleItemCreationComponent from "../components/SingleItemCreationComponent.vue";

export default {
  name: "CompanyDetailComponent",
  props: ["model"],
  components: {
    DeleteItemModal,
    UserStatusUpdateComponent,
    SingleItemCreationComponent
  },
  data() {
    return {
      title: "",
      description: "",
      company: {},
      users: [],
      showDeleteComponent: false,
      showEditUserComponent : false,
      editUserScheme : {}
    };
  },
  methods: {
    editUser(user){
      console.log("edit user");
      console.log(user);

      this.editUserScheme = {
        type : 'update',
        title: "Update User",
        method: "patch",
        endpoint: URLS.USER.BY_ID.replace(":id" , user.id),
        fields: [
          {
            key: "first_name",
            title: "First name",
            value : user.first_name,
            placeholder:  user.first_name || "Enter users' first name",
          },
          
          {
            key: "last_name",
            title: "Last name",
            value : user.last_name,
            placeholder:  user.last_name || "Enter users' last name",
          },
          {
            key: "position",
            title: "Position",
            value : user.position,
            placeholder:  user.position || "Enter users' position",
          },
        ],
      };

      this.showEditUserComponent = true;
    },
    onUserUpdateSuccess(){
      this.showEditUserComponent = false;
      this.editUserScheme = {};
      this.getCompany();
    },
    onUserUpdateFailed(){},
    onUserUpdateCancelled(){
      this.showEditUserComponent = false;
      this.editUserScheme = {};
    },
    onCompanyDeleteSuccess() {
      this.showDeleteComponent = false;
      this.getCompany();
    },
    onCompanyDeleteCancelled() {
      this.showDeleteComponent = false;
    },
    enableUser(user) {
      if (user === null || user === undefined) {
        return;
      }
      this.companyDeleteSchemetics = {
        endpoint: URLS.USER.UPDATE_STATUS.replace(':id' , user.id),
        title: "Enable User",
        description: `Are you sure you want to mark user : <b> ${user.first_name} </b>  as active? Once the user is marked as Active , they will be able to use the platform normally`,
        body : {
            status : 'active'
        }
      };
      this.showDeleteComponent = true;
    },
    disableUser(user) {
         if (user === null || user === undefined) {
        return;
      }
      this.companyDeleteSchemetics = {
        endpoint: URLS.USER.UPDATE_STATUS.replace(':id' , user.id),
        title: "Disable User",
        description: `Are you sure you want to mark user : <b> ${user.first_name} </b>  as archived Once the user is marked as Archived , they wont be able to use the platform in any capacity at all, but the user data will be kept on the server`,
        body : {
            status : 'archived'
        }
      };
      this.showDeleteComponent = true;
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
