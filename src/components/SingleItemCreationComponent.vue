<template>
  <div class="modal-mask">
    <div class="card">
      <label class="title">{{ title }}</label>

      <label class="descMsg" v-if="description">{{ description }}</label>

      <form class="form">
        <div class="custom-btn-div" v-if="showCustomButton">
          <label class="ionput-label">Auto Fetch Data</label>
          <label class="switch">
            <input type="checkbox" v-model="customEnabled" />
            <span class="slider round"></span>
          </label>
        </div>

        <div v-bind:key="field.key" v-for="field in fields">
          <div
            class="form-group"
            v-if="!field.type && !(customEnabled && field.canAutoDetect)"
          >
            <label class="ionput-label ">{{ field.title }}</label>
            <input
              class="form-control"
              :placeholder="field.placeholder || field.title"
              v-model="field.value"
            />
          </div>
          <div
            class="form-group"
            style="display : flex; flex-direction : column"
            v-if="field.type && field.type === 'single-option'"
          >
            <label class="ionput-label ">{{ field.title }}</label>
            <select v-model="field.value" style="text-transform:capitalize;">
              <option disabled value="null">Select one type</option>
              <option
                v-for="item in field.options"
                v-bind:value="item"
                v-bind:key="item"
              >
                {{ item.replace("_", " ") }}
              </option>
            </select>
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
        <button class="btn btn-primary w-100 font-weight-bold" @click="save">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { HTTP } from "../network/http";
let NotificationsController = require("../components/NotificationsController");

export default {
  name: "SingleItemCreationComponent",
  props: ["schemtics"],
  data() {
    return {
      title: "",
      description: null,
      body: {},
      showCustomButton: false,
      customEnabled: false,
    };
  },
  methods: {
    clear() {
      this.title = "";
      this.fields = [];
      this.endpoint = "";
    },
    save() {
      var missingField = false;
      var body = this.body || {};

      body.custom = this.showCustomButton && this.customEnabled;

      this.fields.forEach((element) => {
        if (!(element.canAutoDetect && this.customEnabled)) {
          if (!element.value) {
            this.$toast.warning(`${element.title} is missing`);
            missingField = true;
            return;
          } else {
            body[element.key] = element.value;
            // element.value = "";
          }
        }
      });

      if (missingField) {
        return;
      }
      NotificationsController.showActivityIndicator();
      HTTP({
        method: this.method,
        url: this.endpoint,
        data: body,
      })
        // HTTP.post(this.endpoint , body)
        .then((response) => {
          this.$toast.success(response.data.message);
          NotificationsController.hideActivityIndicator();
          this.$emit("success", response.data);
          this.clear();
        })
        .catch((err) => {
          var msg = "";
          try {
            msg = err.response.data.message;
          } catch (error) {
            msg = err.message;
          }
          this.$toast.error(msg);
          NotificationsController.hideActivityIndicator();
          if(err.response.status == 432 && this.showCustomButton){
            this.customEnabled = false
          }else{
            this.$emit("fail", err.response);
          }
        });
    },
    cancel() {
      this.$emit("cancel");
      this.clear();
    },
  },
  created() {
    this.clear();
    let schema = this.$props.schemtics;
    if (schema === null || schema === undefined) {
      throw new Error(
        "Single item creation component's schemetics is missing in props"
      );
    }

    if (schema.method === null || schema.method === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the method variable"
      );
    } else {
      this.method = schema.method;
    }

    if (schema.fields === null || schema.fields === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the fields array"
      );
    } else {
      this.fields = schema.fields;
    }

    if (schema.endpoint === null || schema.endpoint === undefined) {
      throw new Error(
        "Single item creation component's schemetics missing the endpoint variable"
      );
    } else {
      this.endpoint = schema.endpoint;
    }

    if (schema.body) {
      this.body = schema.body;
    }
    if (schema.title) {
      this.title = schema.title;
    }
    if (schema.description) {
      this.description = schema.description;
    } else {
      this.description = null;
    }

    if (schema.showCustomButton) {
      this.showCustomButton = true;
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

    .descMsg {
      width: 100%;
      font-size: 16px;
      color: rgb(112, 53, 53);
      margin-top: -20px;
      margin-bottom: 20px;
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

  .custom-btn-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
}
</style>
