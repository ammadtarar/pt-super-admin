<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div class="title-coontainer">
              <h5 class="card-title">Articles ({{ count }})</h5>
              <div class="filters-cont">
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
                  <th style="width : 25%" scope="col">Title</th>
                  <th style="width : 20%" scope="col">Company</th>
                  <th style="width : 25%" scope="col">URL</th>
                  <th style="width : 5%" scope="col">Status</th>
                  <th style="width : 10%" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-bind:key="article.id" v-for="article in articles">
                  <th scope="row">{{ article.id }}</th>
                  <td>
                    {{ moment(article.createdAt).format("MMM D YYYY") }}
                  </td>
                  <td>{{ article.title }}</td>
                  <td>{{ article.company.name }}</td>
                  <td>{{ article.original_url }}</td>
                  <td>{{ article.is_active ? "Active" : "InActive" }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button
                        v-if="!article.is_active"
                        type="button"
                        class="btn btn-outline-success"
                        @click="enableArticle(article)"
                      >
                        Enable
                      </button>
                      <button
                        v-if="article.is_active"
                        type="button"
                        class="btn btn-outline-danger"
                        @click="disableArticle(article)"
                      >
                        Disable
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <item-update-status-component
        :schemtics="articleUpdateSchemetics"
        v-if="showUpdateComponent"
        @success="onUpdateSuccess"
        @cancel="onUpdateCancelled"
      ></item-update-status-component>



      <articles-filters-component
        v-if="showFilters"
        :filters="filters"
        @search="onFiltersUpdated"
        @cancel="showFilters = false"
      ></articles-filters-component>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
import Pager from "../components/Pager";
var NotificationsController = require("../components/NotificationsController.js");

import ItemUpdateStatusComponent from "../components/ItemUpdateStatusComponent.vue";
import ArticlesFiltersComponent from "../components/ArticlesFiltersComponent.vue";

import moment from "moment";

export default {
  name: "articles",
  components: {
    NavBar,
    Pager,
    ItemUpdateStatusComponent,
    ArticlesFiltersComponent,
  },
  data() {
    return {
      keyword: "",
      resultsPerPage: 10,
      count: 0,
      page: 1,
      limit: 0,
      articles: [],
      articleUpdateSchemetics: {},
      showUpdateComponent: false,
      showFilters: false,
      filters: {},
    };
  },
  methods: {
    isFilterEmpty() {
      return Object.keys(this.filters).length != 0;
    },
    clearFilters() {
      this.filters = {};
      this.page = 1;
      this.getArticles();
    },
    onFiltersUpdated(filters) {
      this.filters = filters;
      this.page = 1;
      this.showFilters = false;
      this.getArticles();
    },
    onUpdateCancelled() {
      this.showUpdateComponent = false;
      this.articleUpdateSchemetics = {};
    },
    onUpdateSuccess() {
      this.showUpdateComponent = false;
      this.articleUpdateSchemetics = {};
      this.getArticles();
    },
    enableArticle(article) {
      let url = URLS.ARTICLE.UPDATE_STATUS.replace(":id", article.id);
      this.articleUpdateSchemetics = {
        endpoint: url,
        title: "Enable Article",
        description: `Are you sure you want to mark the article : <b> ${article.title} </b> as active ?`,
        body : {
          is_active : true
        }
      };
      this.showUpdateComponent = true;
    },
    disableArticle(article) {
      let url = URLS.ARTICLE.UPDATE_STATUS.replace(":id", article.id);
      this.articleUpdateSchemetics = {
        endpoint: url,
        title: "Disable Article",
        description: `Are you sure you want to mark the article : <b> ${article.title} </b> as inactive ?`,
        body : {
          is_active : false
        }
      };
      this.showUpdateComponent = true;
    },
    onPageChanged(page) {
      this.page = page;
      this.getArticles();
    },
    getArticles() {
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.ARTICLE.LIST_ALL;
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
          ctx.count = data.count;
          let limit = Math.ceil(data.count / ctx.resultsPerPage);
          ctx.limit = limit;
          ctx.previousEnable = limit > 0;
          ctx.nextEnable = ctx.page < limit;
          ctx.articles = rows;
          NotificationsController.hideActivityIndicator();
        })
        .catch((err) => {
          NotificationsController.hideActivityIndicator();
        });
    },
  },
  mounted() {
    this.getArticles();
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
