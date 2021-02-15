<template>
  <div class="modal-mask">
    <div class="card">
      <label class="title">{{ title }}</label>
      <label class="description" v-html="description"></label>
      <div class="actions">
        <button
          class="btn btn-outline-primary w-100 font-weight-bold"
          @click="cancel"
        >
          Cancel
        </button>
        <button class="btn btn-danger w-100 font-weight-bold" @click="save">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { HTTP } from "../network/http";
let NotificationsController = require("../components/NotificationsController");

export default {
  name: "DeleteItemModel",
  props: ["schemtics"],
  data() {
    return {
      title: "",
    };
  },
  methods: {
    save() {
      NotificationsController.showActivityIndicator();
      HTTP({
        method: 'delete',
        url: this.endpoint
      })
        // HTTP.post(this.endpoint , body)
        .then((response) => {
          this.$toast.success(response.data.message);
          NotificationsController.hideActivityIndicator();
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
  created() {
    console.log("Component created");
    let schema = this.$props.schemtics;
    console.log(schema);
    if (schema === null || schema === undefined) {
      throw new Error(
        "Delete item component's schemetics is missing in props"
      );
    }


    if (schema.endpoint === null || schema.endpoint === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the endpoint variable"
      );
    } else {
      this.endpoint = schema.endpoint;
    }

    if (schema.title === null || schema.title === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the title variable"
      );
    } else {
      this.title = schema.title;
    }

    if (schema.description === null || schema.description === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the description variable"
      );
    } else {
      this.description = schema.description;
    }
    
  },
  mounted() {},
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
