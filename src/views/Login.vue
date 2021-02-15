<template>
  <div>
    <div class="top">
      <img class="logo" src="../assets/pt-logo.png" alt="" />
    </div>

    <div class="login-panel">
      <form action="">
        <h1 class="display-4 font-weight-bold ">Login</h1>
        <p class="font-weight-bold ">Super Admin</p>

        <br />
        <div class="form-group">
          <label for="email" class="ionput-label ">Email</label>
          <input
            type="email"
            class="form-control"
            placeholder="Email"
            v-model="username"
          />
        </div>
        <div class="form-group">
          <label for="password" class="ionput-label ">Password</label>
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <br />
        <div class="form-group d-flex justify-content-center">
          <button
            class="btn btn-primary w-100 font-weight-bold"
            @click="login"
            v-if="!isLogginIn"
          >
            Login
          </button>
          <button
            class="btn btn-primary w-100 justify-content-center"
            disabled
            v-if="isLogginIn"
          >
            <loading-component width="30"></loading-component>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LoadingComponent from "../components/LoadingComponent";
import { setTimeout } from "timers";
import { HTTP, URLS } from "../network/http";
import axios from "axios";

export default {
  name: "login",
  components: {
    LoadingComponent,
  },
  data() {
    return {
      isLogginIn: false,
      msg: "Hello",
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.isLogginIn = true;
      let ctx = this;
      let data = {
        email: this.username,
        password: this.password,
      };
      HTTP.post(URLS.SUPER_ADMIN.LOGIN, data)
        .then(function(res) {
          const response = res.data.user;
          localStorage.setItem("email", response.email);
          localStorage.setItem("name", response.name);
          localStorage.setItem("id", response.id);
          localStorage.setItem("token", response.token);
          ctx.$toast.success(`Login Successful. Redirecting...`);
          setTimeout(() => {
            ctx.isLogginIn = false;
            ctx.redirect();
          }, 2000);
        })
        .catch(function(error) {
          console.log(" === ERROR ===");
          console.log(error);
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("name");
        });
    },
    redirect() {
        this.$toast.clear()
        if(this.$route.redirectedFrom && this.$route.redirectedFrom.fullPath){
            this.$router.push(this.$route.redirectedFrom.fullPath || '/home')    
        }else{
            this.$router.push('/home')
        }
    },
  },
};
</script>

<style lang="scss">
.top {
  background-color: rgb(24, 44, 64);
  padding: 15px 30px;
  .logo {
    height: 20px;
  }
}

.widget {
  margin: 0;
  height: unset;
}
.login-panel {
  // padding: 200px 0;
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: white;
  padding: 20px;
  .alert {
    opacity: 0;
    position: absolute;
    top: 100px;
    width: 100%;
    &.alert-primary {
    }
    .widget {
      position: absolute;
      right: 5px;
      top: 0;
      margin: 10px;
    }
  }
}
</style>
