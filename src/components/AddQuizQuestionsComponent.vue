<template>
  <div class="modal-mask">
    <div class="user-form-card" style="overflow-y : scroll">
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
              <th style="width : 20%" scope="col">Question</th>
              <th style="width : 21%" scope="col">Option One</th>
              <th style="width : 21%" scope="col">Option Two</th>
              <th style="width : 21%" scope="col">Option Three</th>
              <th style="width : 12%" scope="col">Correct Option</th>
              <th style="width : 2.5%" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-bind:key="index"
              v-for="(question, index) in questions"
            >
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <input
                  class="form-control"
                  v-model.trim="question.question"
                  type="text"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  v-model="question.option_one"
                  type="text"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  v-model="question.option_two"
                  type="text"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  v-model="question.option_three"
                  type="text"
                />
              </td>
              <td>
                <select v-model="question.answer" style="text-transform:capitalize;">
                  <option disabled value="null">Select one type</option>
                  <option
                    v-for="item in options"
                    v-bind:value="item"
                    v-bind:key="item"
                  >
                    {{ item.replace("_", " ")}}
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
  name: "AddQuizQuestionsComponent",
  props: ["model"],
  components: {},
  data() {
    return {
      title: "",
      description: "",
      quiz: null,
      questions: [{}],
      options: ["option_one", "option_two", "option_three"],
    };
  },
  methods: {
    onDeleteItem(index) {
      if (index == 0) {
        return;
      }
      this.questions.splice(index, 1);
    },
    addMore() {
      this.questions.push({});
    },
    save() {
      var isMissingData = false;
      this.questions.forEach((element) => {
        if (
          !element.question ||
          !element.option_one ||
          !element.option_two ||
          !element.option_three ||
          !element.answer
        ) {
          isMissingData = true;
          this.$toast.warning(
            "Missing data. Please make sure you input all fields"
          );
          return;
        }
      });

      if (isMissingData) {
        return;
      }

      console.log(JSON.parse(JSON.stringify(this.questions)));

      NotificationsController.showActivityIndicator();

      HTTP.post(URLS.QUIZ.ADD_QUESTIONS.replace(":id" , this.quiz.id), {
        questions: this.questions,
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
    cancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    if (this.$props.model === null || this.$props.model === undefined) {
      throw new Error("AddQuizQuestionsComponent is missing the model prop");
    }
    this.quiz = this.$props.model;
    this.title = `Add Questions To Quiz : ${this.$props.model.title}`;
    this.description = `You can add multiple questions to the quiz at once. Once you click save`;
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
