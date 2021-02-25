<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div class="title-coontainer">
              <h5 class="card-title">Settings</h5>
              <div class="filters-cont">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="onClickEdit"
                >
                  Edit
                </button>
              </div>
            </div>

            <div class="row" style="margin-top : 50px">
              <div class="col">
                <div class="input-group">
                  <div class="input-group-text" id="btnGroupAddon">
                    Points For One Article View
                  </div>
                  <label type="search" class="form-control">{{
                    settings.points_for_article_view
                  }}</label>
                </div>
              </div>

              <div class="col">
                <div class="input-group">
                  <div class="input-group-text" id="btnGroupAddon">
                    Points For Job Referral
                  </div>
                  <label type="search" class="form-control">{{
                    settings.points_for_job_referral
                  }}</label>
                </div>
              </div>
            </div>

            <div class="row" style="margin-top : 20px">
              <div class="col">
                <div class="input-group">
                  <div class="input-group-text" id="btnGroupAddon">
                    Points When Job Application is Recieved
                  </div>
                  <label type="search" class="form-control">{{
                    settings.points_for_job_application_received
                  }}</label>
                </div>
              </div>

              <div class="col">
                <div class="input-group">
                  <div class="input-group-text" id="btnGroupAddon">
                    Point When Candidate is in Interview
                  </div>
                  <label type="search" class="form-control">{{
                    settings.points_for_job_candidate_interview_inprogress
                  }}</label>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <single-item-creation-component
        v-if="showUpdateComponent"
        :schemtics="updateSchemetics"
        @success="updateSuccess"
        @fail="updateFailed"
        @cancel="updateCancelled"
      ></single-item-creation-component>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
var NotificationsController = require("../components/NotificationsController.js");
import SingleItemCreationComponent from "../components/SingleItemCreationComponent.vue";

export default {
  name: "settings",
  components: {
    NavBar,
    SingleItemCreationComponent,
  },
  data() {
    return {
      settings: {},
      showUpdateComponent: false,
      updateSchemetics: {},
    };
  },
  methods: {
    updateSuccess() {
      this.showUpdateComponent = false;
      this.updateSchemetics = {};
      this.getSettings();
    },
    updateFailed() {},
    updateCancelled() {
      this.showUpdateComponent = false;
      this.updateSchemetics = {};
    },
    onClickEdit() {
      this.updateSchemetics = {
        type: "update",
        title: "Update Settings",
        method: "patch",
        endpoint: URLS.SETTINGS.UPDATE,
        fields: [
          {
            key: "points_for_article_view",
            title: "Points for one article view",
            value: this.settings.points_for_article_view,
            placeholder:
              this.settings.points_for_article_view || "Enter quiz title",
          },
          {
            key: "points_for_job_referral",
            title: "Points for job referral",
            value: this.settings.points_for_job_referral,
            placeholder:
              this.settings.points_for_job_referral || "Enter quiz description",
          },
          {
            key: "points_for_job_application_received",
            title: "Points when job application is recieved",
            value: this.settings.points_for_job_application_received,
            placeholder:
              this.settings.points_for_job_application_received ||
              "Enter quiz description",
          },
          {
            key: "points_for_job_candidate_interview_inprogress",
            title: "Point when candidate is in interview",
            value: this.settings.points_for_job_candidate_interview_inprogress,
            placeholder:
              this.settings.points_for_job_candidate_interview_inprogress ||
              "Enter quiz description",
          },
        ],
      };
      this.showUpdateComponent = true;
    },
    getSettings() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      HTTP.get(URLS.SETTINGS.DETAIL)
        .then((response) => {
          this.settings = response.data;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.getSettings();
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
