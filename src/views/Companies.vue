<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div class="title-coontainer">
              <h5 class="card-title">Companies ({{ count }})</h5>
              <pager :limit="limit" @onPageChanged="onPageChanged"></pager>
            </div>

            <div class="filters-container">
              <div class="input-group" style="margin-right : 10px">
                <div class="input-group-text" id="btnGroupAddon">
                  Search By Title
                </div>
                <input
                  type="search"
                  class="form-control"
                  placeholder="Enter a keyword here"
                  v-model="keyword"
                  @input="onUpdateKeyword"
                />
              </div>

              <div class="actions">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="search"
                >
                  Search
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="onClickAddNewCompany"
                >
                  Add New
                </button>
              </div>
            </div>

            <table
              class="table table-striped"
              style="height : 300px !important"
            >
              <thead>
                <tr>
                  <th style="width : 5%" scope="col">ID</th>
                  <th style="width : 35%" scope="col">Title</th>
                  <th style="width : 20%" scope="col">Creation Date</th>
                  <th style="width : 40%" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-bind:key="company.id" v-for="company in companies">
                  <th scope="row">{{ company.id }}</th>
                  <td>{{ company.name }}</td>
                  <td>
                    {{
                      moment(company.createdAt).format("MMM D YYYY, h:mm:ss a")
                    }}
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="onClickCompanyDetail(company)"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="onClickUpdateCompany(company)"
                      >
                        Update
                      </button>
                    </div>

                    <div
                      class="btn-group"
                      role="group"
                      style="margin-left : 6px"
                    >
                      <button
                        type="button"
                        class="btn btn-outline-success"
                        @click="onClickAddCompanyUsers(company)"
                      >
                        Add Users
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-success"
                        @click="onClickAddNewJob(company)"
                      >
                        Add Job
                      </button>

                      <button
                        type="button"
                        class="btn btn-outline-success"
                        @click="onClickAddArticle(company)"
                      >
                        Add Article
                      </button>
                    </div>

                    <button
                      style="margin-left : 6px"
                      type="button"
                      class="btn btn-outline-danger"
                      @click="onClickDeleteCompany(company)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <single-item-creation-component
        v-if="showCompanyCreationComponent"
        :schemtics="creationSchemetics"
        @success="companyCreationSuccess"
        @fail="companynCreationFailed"
        @cancel="companyCreationCancelled"
      ></single-item-creation-component>

      <delete-item-modal
        :schemtics="companyDeleteSchemetics"
        v-if="showDeleteCompanyModal"
        @success="onCompanyDeleteSuccess"
        @cancel="onCompanyDeleteCancelled"
      ></delete-item-modal>

      <add-company-users-component
        :model="newUsersCompany"
        v-if="showAddCompanyComponent"
        @success="companyAddUsersSuccess"
        @cancel="companyAddUsersCancelled"
      >
      </add-company-users-component>

      <company-detail-component
        v-if="showCompanyDetail"
        @hide="showCompanyDetail = false"
        :model="companyDetailModel"
      ></company-detail-component>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
import Pager from "../components/Pager";
var NotificationsController = require("../components/NotificationsController.js");
import SingleItemCreationComponent from "../components/SingleItemCreationComponent.vue";
import DeleteItemModal from "../components/DeleteItemModal.vue";
import AddCompanyUsersComponent from "../components/AddCompanyUsersComponent.vue";
import CompanyDetailComponent from "../components/CompanyDetailComponent.vue";
import moment from "moment";
export default {
  name: "companies",
  components: {
    NavBar,
    Pager,
    SingleItemCreationComponent,
    DeleteItemModal,
    AddCompanyUsersComponent,
    CompanyDetailComponent,
  },
  data() {
    return {
      keyword: "",
      resultsPerPage: 10,
      count: 0,
      page: 1,
      limit: 0,
      companies: [],
      showCompanyCreationComponent: false,
      companyCreationComponentSchmetics: {},
      companyDeleteSchemetics: {},
      showDeleteCompanyModal: false,
      showAddCompanyComponent: false,
      newUsersCompany: {},
      showCompanyDetail: false,
      companyDetailModel: {},
      creationSchemetics: {},
    };
  },
  methods: {
    onClickAddArticle(company) {
      this.creationSchemetics = {
        title: "Create New Article",
        method: "post",
        endpoint: URLS.ARTICLE.CREATE,
        fields: [
          {
            key: "url",
            title: "URL",
            placeholder: "Enter article URL",
          },
        ],
        body: {
          companyId: company.id,
        },
      };
      this.showCompanyCreationComponent = true;
    },
    onClickAddNewJob(company) {
      this.creationSchemetics = {
        title: "Create New Job",
        method: "post",
        endpoint: URLS.JOBS.CREATE,
        fields: [
          {
            key: "title",
            title: "Title",
            placeholder: "Enter job title here",
          },
          {
            key: "location",
            title: "Location",
            placeholder: "Enter job location here",
          },
          {
            key: "url",
            title: "URL",
            placeholder: "Enter job url here",
          },
          {
            key: "referral_success_reward_type",
            title: "Referral Reward Type",
            placeholder: "Enter job reward points here",
            type: "single-option",
            options: ["points", "cash"],
          },
          {
            key: "referral_success_reward_value",
            title: "Referral Reward Value",
            placeholder: "Enter job reward points here",
          },
        ],
        body: {
          companyId: company.id,
        },
      };
      this.showCompanyCreationComponent = true;
    },
    onClickCompanyDetail(company) {
      this.companyDetailModel = company;
      this.showCompanyDetail = true;
    },
    onClickAddCompanyUsers(company) {
      this.newUsersCompany = company;
      this.showAddCompanyComponent = true;
    },
    companyAddUsersSuccess() {
      this.showAddCompanyComponent = false;
      this.newUsersCompany = {};
      this.getCompanies();
    },
    companyAddUsersCancelled() {
      this.showAddCompanyComponent = false;
      this.newUsersCompany = false;
    },
    onCompanyDeleteCancelled() {
      this.showDeleteCompanyModal = false;
      this.companyDeleteSchemetics = {};
    },
    onCompanyDeleteSuccess() {
      this.showDeleteCompanyModal = false;
      this.companyDeleteSchemetics = {};
      this.getCompanies();
    },
    onClickDeleteCompany(company) {
      let url = URLS.COMPANY.BY_ID.replace(":id", company.id);
      this.companyDeleteSchemetics = {
        endpoint: url,
        title: "Delete Company",
        description: `Are you sure you want to delete <b> ${company.name} </b> from the companies list ?`,
      };
      this.showDeleteCompanyModal = true;
    },
    onClickUpdateCompany(company) {
      let url = URLS.COMPANY.UPDATE.replace(":id", company.id);
      console.log("URL = ", url);

      this.companyCreationComponentSchmetics = {
        title: "Update Company",
        method: "patch",
        endpoint: url,
        fields: [
          {
            key: "name",
            title: "Name",
            placeholder: "Enter company name here",
            value: company.name,
          },
        ],
      };
      this.showCompanyCreationComponent = true;
    },
    onClickAddNewCompany() {
      this.creationSchemetics = {
        title: "Create New Company",
        method: "post",
        endpoint: URLS.COMPANY.CREATE,
        fields: [
          {
            key: "name",
            title: "Name",
            placeholder: "Enter company name here",
          },
        ],
      };
      this.showCompanyCreationComponent = true;
    },
    onUpdateKeyword(val) {
      if (!val.target.value) {
        this.page = 1;
        this.getCompanies();
      }
    },
    search() {
      if (!this.keyword) {
        this.$toast.warning("Please enter a fucking keyword");
        return;
      }
      this.page = 1;
      this.getCompanies();
    },
    companyCreationSuccess(res) {
      this.showCompanyCreationComponent = false;
      this.getCompanies();
    },
    companynCreationFailed(err) {
      //   "custom" : false,
      // "title" : "Something",
      // "thumb_url" : "http://www.google.com"

      if (err.status == 432) {
        this.showCompanyCreationComponent = false;
        setTimeout(() => {
          console.log("in companies");
          console.log(err.status);
          this.creationSchemetics = {
            title: "Create New Article",
            description : `Failed to automatically fetch detail of the article from the URL. Please manually enter the details to proceed`,
            method: "post",
            endpoint: URLS.ARTICLE.CREATE,
            fields: [
              {
                key: "title",
                title: "Title",
                placeholder: "Enter article title manually",
              },
              {
                key: "thumb_url",
                title: "Thumbnail URL",
                placeholder: "Enter article thumbnail image url",
              },
              {
                key: "url",
                title: "URL",
                placeholder: "Enter article URL",
              },
            ],
            body: {
              companyId: this.creationSchemetics.body.companyId,
              custom: true,
            },
          };
          this.showCompanyCreationComponent = true;
        }, 1000);
      }
    },
    companyCreationCancelled() {
      this.showCompanyCreationComponent = false;
    },
    onPageChanged(page) {
      this.page = page;
      this.getCompanies();
    },
    getCompanies() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.COMPANY.LSIT_ALL;
      url = url + "?limit=" + this.resultsPerPage;
      url = url + "&page=" + this.page;
      if (this.keyword) {
        url = url + "&name=" + this.keyword;
      }
      HTTP.get(url)
        .then((response) => {
          let data = response.data;
          let rows = data.rows;
          ctx.count = data.count;
          let limit = Math.ceil(data.count / ctx.resultsPerPage);
          ctx.limit = limit;
          ctx.previousEnable = limit > 0;
          ctx.nextEnable = ctx.page < limit;
          ctx.companies = rows;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.getCompanies();
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
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
  }
}

.table-card {
  box-shadow: 0px 0px 10px 0px #bdbdbd;
}

.filters-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  width: 100%;

  .actions {
    margin-left: auto;
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    button {
      widows: 100px;
    }
  }
  // button{
  //   margin-left: 10px;
  // }
}
.actions {
  button {
    margin-right: 4px;
  }
}
</style>
