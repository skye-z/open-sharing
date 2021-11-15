<template>
  <div class="loading">
    <div class="el-loading-spinner">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading"
};
</script>

<style scoped>
.loading {
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(8, 29, 46, 0.7);
  position: fixed;
  height: 100vh;
  z-index: 1000;
  width: 100vw;
  left: 0;
  top: 0;
}
</style>