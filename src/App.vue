<template>
  <router-view />
  <transition>
    <div class="modal-mask" id="loadingDiv" style=" visibility : hidden">
      <div class="modal-wrapper">
        <div class="loading-card">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

select {
  padding: 0.35rem;
  width: 100%;
  vertical-align: top;
  border: 1px solid #dee2e6;
  color: #495057;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.loading-card {
  width: 100px;
  height: 100px;
  margin: 0px auto;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 10px 1px #212121;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  /* overflow: hidden; */
}

.loader {
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  -webkit-animation: spin 1s linear infinite;
  margin: auto;
  border-radius: 50%;
  background: transparent;
  border: 5px solid #fff;
  border-top: 5px solid #3490dc;
}

@-webkit-keyframes spin {
  to {
    // border-top-color: #fff;
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    // border-top-color: #fff;
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
