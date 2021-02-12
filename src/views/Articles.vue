<template>
  <div>
    <nav-bar></nav-bar>
    <div class="container-fluid">
      <h1>This is an articles page</h1>
    </div>
  </div>
</template>

<script>


import NavBar from '../components/NavBar';

export default {
  name: 'articles',
  components: {
    NavBar
  }
}
</script>
