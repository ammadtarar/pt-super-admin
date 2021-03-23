<template>
  <div class="modal-mask">
    <div class="user-form-card" style="overflow-y : scroll">
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
              <th style="width : 20.5%" scope="col">Question</th>
              <th style="width : 20%" scope="col">Option One</th>
              <th style="width : 20%" scope="col">Option Two</th>
              <th style="width : 20%" scope="col">Option Three</th>
              <th style="width : 12%" scope="col">Correct Option</th>
              <th style="width : 5%" scope="col">Action</th>
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

              <td>
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="editQuestion(question)"
                      >
                        Edit
                      </button>

                        <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="onClickDeleteQuestion(question)"
                      >
                        Delete
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

    <single-item-creation-component
        v-if="showQuestionUpdateComponent"
        :schemtics="updateSchemetics"
        @success="questionUpdateSuccess"
        @fail="quesitonUpdateFailed"
        @cancel="questionUpdateCancelled"
      ></single-item-creation-component>


      <delete-item-modal
        :schemtics="questionDeleteSchemetics"
        v-if="showDeleteModal"
        @success="onQuestionDeleteSuccess"
        @cancel="onQuestionDeleteCancel"
      ></delete-item-modal>

  </div>
</template>

<script>
import { URLS, HTTP } from "../network/http";
import moment from "moment";
let NotificationsController = require("../components/NotificationsController.js");

import SingleItemCreationComponent from "../components/SingleItemCreationComponent";
import DeleteItemModal from "./DeleteItemModal";

export default {
  name: "QuizDetailComponent",
  props: ["model"],
  components: {
    SingleItemCreationComponent,
    DeleteItemModal
  },
  data() {
    return {
      title: "",
      description: "",
      quiz: {},
      showQuestionUpdateComponent : false,
      updateSchemetics : {},
      showDeleteModal : false,
      questionDeleteSchemetics : {}
    };
  },
  methods: {
    onClickDeleteQuestion(question){
      console.log("onClickDeleteQuestion");
      let url = URLS.QUIZ.QUETION_BY_ID.replace(":id", question.id);
      this.questionDeleteSchemetics = {
        endpoint: url,
        title: "Delete Quesstion",
        description: `Are you sure you want to delete <b> ${question.question} </b> from the this quiz ?`,
      };
      console.log("questionDeleteSchemetics = " , this.questionDeleteSchemetics);
      this.showDeleteModal = true;
    },
    onQuestionDeleteSuccess(){
      this.showDeleteModal = false
      this.questionDeleteSchemetics = {};
      this.getQuiz();
    },
    onQuestionDeleteCancel(){
      this.showDeleteModal = false
      this.questionDeleteSchemetics = {};
    },
    editQuestion(question){
      console.log(question);
      this.updateSchemetics = {
        type : 'update',
        title: "Update Question",
        method: "patch",
        endpoint: URLS.QUIZ.QUETION_BY_ID.replace(":id" , question.id),
        fields: [
          {
            key: "question",
            title: "Question",
            value : question.question,
            placeholder:  question.question || "Enter question",
          },
          
          {
            key: "option_one",
            title: "Option One",
            value : question.option_one,
            placeholder:  question.option_one || "Enter option one",
          },
          {
            key: "option_two",
            title: "Option Two",
            value : question.option_two,
            placeholder:  question.option_one || "Enter option two",
          },
          {
            key: "option_three",
            title: "Option Three",
            value : question.option_three,
            placeholder:  question.option_three || "Enter option three",
          },

          {
            key: "answer",
            title: "Answer",
            value : question.answer,
            placeholder: "Select one option",
            type: "single-option",
            options: ["option_one", "option_two" , "option_three"],
          },
        ],
      };
      this.showQuestionUpdateComponent = true
    },
    questionUpdateSuccess(){
      this.showQuestionUpdateComponent = false;
      this.updateSchemetics = {};
      this.getQuiz();
    },
    quesitonUpdateFailed(){

    },
    questionUpdateCancelled(){
      this.showQuestionUpdateComponent = false;
      this.updateSchemetics = {}
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
