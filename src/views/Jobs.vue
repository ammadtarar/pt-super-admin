<template>
  <div class="page-container">
    <nav-bar></nav-bar>
    <div class="page">
      <div class="container-fluid">
        <h1>This is an jobs page</h1>
      </div>
    </div>
  </div>
</template>

<script>


import NavBar from '../components/NavBar';

export default {
  name: 'jobs',
  components: {
    NavBar
  }
}
</script>

<style lang="scss">

.page-container{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  nav-bar{
    height: 100px;
    width: 100%;
  }

  .page{
    width: 100%;
    height: 90%;
  }
}

</style>
