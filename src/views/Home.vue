<template>
  <div>
    <nav-bar></nav-bar>
    <div class="container-fluid">
      <h1>This is an home page</h1>
    </div>
  </div>
</template>

<script>


import NavBar from '../components/NavBar';

export default {
  name: 'home',
  components: {
    NavBar
  }
}
</script>
