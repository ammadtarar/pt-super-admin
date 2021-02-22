<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div class="title-coontainer">
              <h5 class="card-title">Quizzes ({{ count }})</h5>
              <div class="filters-cont">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="onClickAddNewQuiz"
                >
                  Add New
                </button>

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
                  <th style="width : 20%" scope="col">Title</th>
                  <th style="width : 25%" scope="col">Description</th>
                  <th style="width : 10%" scope="col">Level</th>
                  <th style="width : 10%" scope="col">Status</th>
                  <th style="width : 20%" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-bind:key="quiz.id" v-for="quiz in quizzes">
                  <th scope="row">{{ quiz.id }}</th>
                  <td>
                    {{ moment(quiz.createdAt).format("MMM D YYYY") }}
                  </td>
                  <td>{{ quiz.title }}</td>
                  <td>{{ quiz.description }}</td>
                  <td style="text-transform:capitalize;">{{ quiz.level }}</td>
                  <td>{{ quiz.is_active ? "Active" : "InActive" }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="onClickShowQuizDetails(quiz)"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="onClickUpdate(quiz)"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="onClickAddQuestions(quiz)"
                      >
                        Add Questions
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <quiz-filters-component
        v-if="showFilters"
        :filters="filters"
        @search="onFiltersUpdated"
        @cancel="showFilters = false"
      ></quiz-filters-component>

      <single-item-creation-component
        v-if="showQuizCreationComponent"
        :schemtics="creationSchemetics"
        @success="quizCreationSuccess"
        @fail="quizCreationFailed"
        @cancel="quizCreationCancelled"
      ></single-item-creation-component>

      <add-quiz-questions-component
        v-if="showAddQuestionsComponent"
        :model="quizToAddQuestionsTo"
        @success="questionsAddSuccess"
        @cancel="questionsAddCancelled"
      ></add-quiz-questions-component>

      <quiz-detail-component
        v-if="showQuizDetails"
        :model="quizToShowDetailOf"
        @hide="showQuizDetails = false"
        ></quiz-detail-component>

    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
import Pager from "../components/Pager";
var NotificationsController = require("../components/NotificationsController.js");


import QuizFiltersComponent from "../components/QuizFiltersComponent.vue";
import SingleItemCreationComponent from "../components/SingleItemCreationComponent.vue";
import AddQuizQuestionsComponent from "../components/AddQuizQuestionsComponent.vue";
import QuizDetailComponent from "../components/QuizDetailComponent.vue";

import moment from "moment";

export default {
  name: "quizzes",
  components: {
    NavBar,
    Pager,
    SingleItemCreationComponent,
    QuizFiltersComponent,
    AddQuizQuestionsComponent,
    QuizDetailComponent
  },
  data() {
    return {
      keyword: "",
      resultsPerPage: 10,
      count: 0,
      page: 1,
      limit: 0,
      quizzes: [],
      showFilters: false,
      filters: {},
      showQuizCreationComponent: false,
      creationSchemetics: {},
      showAddQuestionsComponent : false,
      quizToAddQuestionsTo : {},
      showQuizDetails : false,
      quizToShowDetailOf : {}
    };
  },
  methods: {
    onClickShowQuizDetails(quiz){
      this.quizToShowDetailOf = quiz;
      this.showQuizDetails = true
    },
    onClickAddQuestions(quiz){
      this.quizToAddQuestionsTo = quiz;
      this.showAddQuestionsComponent = true;
    },
    questionsAddSuccess(){
      this.showAddQuestionsComponent = false;
    },
    questionsAddCancelled(){
      console.log("inside questionsAddCancelled - wtf");
      this.quizToAddQuestionsTo = {};
      this.showAddQuestionsComponent = false;
    },
    onClickUpdate(quiz){
      this.creationSchemetics = {
        type : 'update',
        title: "Update Quiz",
        method: "post",
        endpoint: URLS.QUIZ.BY_ID.replace(":id" , quiz.id),
        fields: [
          {
            key: "title",
            title: "Title",
            value : quiz.title,
            placeholder:  quiz.title || "Enter quiz title",
          },
          {
            key: "description",
            title: "Description",
            value : quiz.description,
            placeholder: quiz.description || "Enter quiz description",
          },
          {
            key: "level",
            title: "Difficulty Level",
            placeholder: "Select difficulty level",
            value : quiz.level,
            type: "single-option",
            options: ["easy", "medium", "difficult"],
          },
          {
            key: "is_active",
            title: "Is Active",
            value : quiz.is_active,
            placeholder: "Select one status",
            type: "single-option",
            options: ["true", "false"],
          },
        ],
      };
      this.showQuizCreationComponent = true;
    },
    onClickAddNewQuiz() {
      this.creationSchemetics = {
        title: "Create New Quiz",
        method: "post",
        endpoint: URLS.QUIZ.CREATE,
        fields: [
          {
            key: "title",
            title: "Title",
            placeholder: "Enter quiz title",
          },
          {
            key: "description",
            title: "Description",
            placeholder: "Enter quiz description",
          },
          {
            key: "level",
            title: "Difficulty Level",
            placeholder: "Select difficulty level",
            type: "single-option",
            options: ["easy", "medium", "difficult"],
          },
        ],
        body: {
          is_active: true,
        },
      };
      this.showQuizCreationComponent = true;
    },
    quizCreationSuccess() {
      this.showQuizCreationComponent = false;
      this.creationSchemetics = {};
      this.getQuizzes();
    },
    quizCreationFailed() {},
    quizCreationCancelled() {
      this.showQuizCreationComponent = false;
      this.creationSchemetics = {};
    },
    isFilterEmpty() {
      return Object.keys(this.filters).length != 0;
    },
    clearFilters() {
      this.filters = {};
      this.page = 1;
      this.getQuizzes();
    },
    onFiltersUpdated(filters) {
      this.filters = filters;
      this.page = 1;
      this.showFilters = false;
      this.getQuizzes();
    },
    onPageChanged(page) {
      this.page = page;
      this.getQuizzes();
    },
    getQuizzes() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.QUIZ.LIST_ALL;
      url = url + "?limit=" + this.resultsPerPage;
      url = url + "&page=" + this.page;

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
          this.count = data.count;
          let limit = Math.ceil(data.count / ctx.resultsPerPage);
          this.limit = limit;
          this.previousEnable = limit > 0;
          this.nextEnable = this.page < limit;
          this.quizzes = rows;
          console.log(this.quizzes);
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.getQuizzes();
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
