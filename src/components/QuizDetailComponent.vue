<template>
  <div class="modal-mask">
    <div class="user-form-card">
      <label class="title">{{title}}</label>

      <div  style="margin-bottom : 20px">
        <div class="row">
          <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                ID
              </div>
              <label type="search" class="form-control">{{ quiz.id }}</label>
            </div>
          </div>

          <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                Date
              </div>
              <label type="search" class="form-control">
                <!-- {{ moment(company.createdAt).format("MMM D YYYY, h:mm:ss a") }} -->
                {{ quiz.createdAt }}
              </label>
            </div>
          </div>

         

          <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                Level
              </div>
              <label type="search" class="form-control">{{
                quiz.level
              }}</label>
            </div>
          </div>


          <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                Status
              </div>
              <label type="search" class="form-control">{{
                quiz.is_active ? 'Active' : 'InActive'
              }}</label>
            </div>
          </div>



        </div>

        <div class="row">
           <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                Name
              </div>
              <label type="search" class="form-control">{{
                quiz.title
              }}</label>
            </div>
          </div>

          <div class="col">
            <div class="input-group" >
              <div class="input-group-text" id="btnGroupAddon">
                Description
              </div>
              <label type="search" class="form-control">{{
                quiz.description
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <label class="title">Questions</label>

      <div class="new-users-container">
        <table class="table">
          <thead>
            <tr>
              <th style="width : 2.5%" scope="col">#</th>
              <th style="width : 22.5%" scope="col">Question</th>
              <th style="width : 21%" scope="col">Option One</th>
              <th style="width : 21%" scope="col">Option Two</th>
              <th style="width : 21%" scope="col">Option Three</th>
              <th style="width : 12%" scope="col">Correct Option</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="question.id" v-for="question in quiz.questions">
              <th scope="row">{{ question.id }}</th>
              <td>{{ question.question }}</td>
              <td>{{ question.option_one }}</td>
              <td>{{ question.option_two }}</td>
              <td>{{ question.option_three }}</td>
              <td style="text-transform:capitalize;">{{ question.answer.replace("_" , " ") }}</td>

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
import DeleteItemModal from "../components/DeleteItemModal.vue";


export default {
  name: "QuizDetailComponent",
  props: ["model"],
  components: {
    DeleteItemModal
  },
  data() {
    return {
      title: "",
      description: "",
      quiz: {},
      showDeleteComponent: false,
    };
  },
  methods: {
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
    cancel() {
      this.$emit("cancel");
    },
    getQuiz() {
      NotificationsController.showActivityIndicator();
      HTTP.get(URLS.QUIZ.BY_ID.replace(":id", this.quiz.id))
        .then((response) => {
          this.quiz = response.data;
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
    if (this.$props.model === null || this.$props.model === undefined) {
      throw new Error("QuizDetailComponent is missing the model prop");
    }
    this.quiz = this.$props.model;
    this.title = `Quiz Details`;
    this.getQuiz();
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

  .col{
    margin-top: 5px;
  }

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
