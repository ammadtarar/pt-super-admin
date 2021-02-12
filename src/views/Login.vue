<template>
  <section class="container-fluid">
      <div class="row justify-content-center">
          
          <div class="col-lg-3">
              
              <div class="login-panel text-left">

                  <div class="alert alert-primary" role="alert" :style="{opacity :  isAlertShow ? 1 : 0}">
                      Login Successfully. <small>Waiting for redirect.</small>
                      <loading-component width="30"></loading-component>
                  </div>

                  
                  
                <form action="">

                    <h1 class="display-4 font-weight-bold ">PushTalents</h1>  
                    <p class="font-weight-bold ">Super Admin Login</p>

                    <br>
                    <div class="form-group">
                        <label for="email" class="ionput-label ">Email</label>
                        <input type="email" class="form-control" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <label for="password" class="ionput-label ">Password</label>
                        <input type="password" class="form-control" placeholder="Password">
                    </div>
                    <br>
                    <div class="form-group d-flex justify-content-center">
                        <button class="btn btn-primary w-100 font-weight-bold" @click="login" v-if="!isLogginIn">Login</button>
                        <button class="btn btn-primary w-100 justify-content-center" disabled v-if="isLogginIn"><loading-component width="30"></loading-component></button>

                    </div>
                </form>
              </div>    
          </div>
      </div>

  </section>
</template>

<script>
import LoadingComponent from  '../components/LoadingComponent'
import { setTimeout } from 'timers';

export default {
    name : 'login',
    components: {
        LoadingComponent
    },
    data(){
        return {
            isLogginIn : false,
            isAlertShow : false,
            msg : "Hello"
        }
    },
    methods:{
        login(){
            this.isLogginIn = true;
            setTimeout(() => {
                this.isLogginIn = false;
                this.isAlertShow = true;
                setTimeout(() => {
                    this.redirect();
                }, 1000);
            }, 3000);
        },
        redirect(){
            this.$router.push({name : 'home'})
        }
    }
    
}
</script>

<style lang="scss">

    .logo{
        position: absolute;
        top: 30px;
    }

    .widget {
        margin : 0;
        height: unset;
    }
    .login-panel{
        padding: 200px 0;
        position: relative;
        .alert{
            opacity: 0;
            position: absolute;
            top: 100px;
            width: 100%;
            &.alert-primary{
                
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