<template>
  <div>
    <nav-bar></nav-bar>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Companies</h5>

          <div class="filters-container">
            <div class="input-group" style="margin-right : 10px">
              <div class="input-group-text" id="btnGroupAddon">
                Search By Title
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Input group example"
                aria-label="Input group example"
                aria-describedby="btnGroupAddon"
              />
            </div>

            <div class="actions">
              <button type="button" class="btn btn-outline-primary">
                Search
              </button>
              <button type="button" class="btn btn-primary">
                Add New
              </button>
            </div>
          </div>

          <table class="table table-striped">
            <thead>
              <tr>
                <th style="width : 5%" scope="col">ID</th>
                <th style="width : 45%" scope="col">Title</th>
                <th style="width : 20%" scope="col">Creation Date</th>
                <th style="width : 30%" scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-bind:key="company.id" v-for="company in companies">
                <th scope="row">{{ company.id }}</th>
                <td>{{ company.name }}</td>
                <td>{{ company.createdAt }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary">
                      Details
                    </button>
                    <button type="button" class="btn btn-outline-primary">
                      Add Users
                    </button>
                    <button type="button" class="btn btn-outline-primary">
                      Update
                    </button>
                    <button type="button" class="btn btn-outline-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>



          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">

              
              <pager :limit="limit" @onPageChanged="onPageChanged"></pager>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { HTTP, URLS } from "../network/http";
import Pager from "../components/Pager";
var NotificationsController = require("../components/NotificationsController.js");
export default {
  name: "companies",
  components: {
    NavBar,
    Pager
  },
  data() {
    return {
      resultsPerPage : 25,
      page : 1,
      limit : 0,
      companies: [],
    };
  },
  methods : {
    onPageChanged(page){
      this.page = page;
      this.getCompanies();
    },
    getCompanies(){
      NotificationsController.showActivityIndicator();
      const ctx = this;
      var url = URLS.COMPANY.LSIT_ALL;
      url = url + "?limit=" + this.resultsPerPage;
			url = url + "&page=" + this.page;
      HTTP.get(url)
      .then((response)=>{
        let data = response.data;
        let rows = data.rows;
        let limit = Math.ceil(data.count/ctx.resultsPerPage);
        ctx.limit = limit;
        ctx.previousEnable = limit > 0;
        ctx.nextEnable = ctx.page < limit
        console.log(rows);
        ctx.companies = rows;
        console.log("ctx.limit = " ,ctx.limit);
        console.log("ctx.page = " ,ctx.page);
        console.log("hello");
        console.log("nextEnable = " , ctx.nextEnable);
        NotificationsController.hideActivityIndicator();
      })
      .catch((err)=>{
          NotificationsController.hideActivityIndicator();
      });
    }
  },
  mounted() {
    console.log("mounted");
    this.getCompanies();
  }
};
</script>

<style lang="scss">
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
