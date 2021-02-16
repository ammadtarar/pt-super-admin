<template>
  <div id="nav">
    <img src="../assets/pt-logo.png" />
    <router-link to="/home">Home</router-link>
    <router-link to="/companies">Companies</router-link>
    <router-link to="/jobs">Jobs</router-link>
    <router-link to="/quizzes">Quizzes</router-link>
    <router-link to="/articles">Articles</router-link>

    <button
      class="btn btn-primary w-10 font-weight-bold logout"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script>
export default {
  props: [],
  methods: {
    logout() {
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="scss">
#nav {
  // position: fixed;
  // top: 0;
  // left: 0;
  // z-index: 1;
  // width: 100%;
  padding: 15px 30px;
  //   border-bottom: 0.5px solid white;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
  margin-bottom: 10px;
  transition: all 0.25s;

  color: white;
  background-color: rgb(24, 44, 64);

  img {
    height: 20px;
    margin-right: 25px;
    border-right: 1px solid white;
    padding-right: 25px;
  }

  a {
    font-weight: bold;
    color: lightgray;
    margin: 0px 4px;
    font-size: 14px;
    width: 100px;
    text-align: center;
    transition: all 0.25s;

    &.router-link-exact-active {
      color: white;
      font-weight: bolder;
      font-size: 18px;
      padding: 2px 8px;
      transition: all 0.25s;
    }
  }

  .logout {
    margin-left: auto;
  }
}
</style>
