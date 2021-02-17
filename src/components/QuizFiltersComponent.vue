<template>
  <div class="modal-mask">
    <div class="card">
      <label class="title">Search & Filter</label>

      <form class="form">
        <div class="form-group">
          <label class="ionput-label ">Title</label>
          <input
            class="form-control"
            placeholder="Quiz title"
            v-model="form.title"
          />
        </div>

        <div class="form-group">
          <label class="ionput-label ">Description</label>
          <input
            class="form-control"
            placeholder="Quiz description"
            v-model="form.description"
          />
        </div>

        <div class="form-group">
          <label class="ionput-label ">Difficulty Level</label>
          <select v-model="form.level" style="text-transform:capitalize;">
            <option disabled value="null">Select one level</option>
            <option
              v-for="item in levels"
              v-bind:value="item"
              v-bind:key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>


         <div class="form-group">
          <label class="ionput-label ">Is Active</label>
          <select v-model="form.is_active" style="text-transform:capitalize;">
            <option disabled value="null">Select one status</option>
            <option
              v-for="item in statuses"
              v-bind:value="item"
              v-bind:key="item"
            >
              {{ item }}
            </option>
          </select>
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
  name: "QuizFiltersComponent",
  props: ["filters"],
  data() {
    return {
      form: {},
      levels: ['easy' , 'medium' , 'difficult'],
      statuses : ['true' , 'false']
    };
  },
  methods: {
    search() {
      console.log(this.form);
      this.$emit("search", this.form);
    },
    cancel() {
      this.form = {};
      this.$emit("cancel");
    },
  },
  mounted() {
    this.form = this.$props.filters;
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
