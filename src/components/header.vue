<template>
  <div class="header">
    <div class="header-tools">
      <div><i class="el-icon-arrow-left" /></div>
      <div><i class="el-icon-arrow-right" /></div>
    </div>
    <div class="header-address">
      <span class="address-item">/ 根目录</span>
      <span class="address-item">/ 二级文件夹</span>
      <span class="address-item">/ 三级文件夹</span>
    </div>
    <div class="header-add"><i class="el-icon-upload"/> 导入</div>
  </div>
</template>

<script>
export default {
  name: "appHeader",
  data() {
    return {};
  },
};
</script>

<style scoped>
.header {
  background-color: #152f44;
  align-items: center;
  position: fixed;
  display: flex;
  height: 30px;
  width: 100%;
  z-index: 8;
  top: 0;
}

.header-tools {
  align-items: center;
  display: flex;
}

.header-tools > div {
  align-items: center;
  padding: 0 5px;
  display: flex;
  height: 30px;
}

.header-tools > div:hover {
  background-color: #081d2e;
}

.header-address {
  width: calc(100% - 215px);
  align-items: center;
  font-size: 13px;
  display: flex;
}

.header-address .address-division {
  margin: 0 5px;
}

.header-address .address-item {
  margin-left: 5px;
}

.header-address .address-item:hover {
  color: #8b9ead;
}

.header-add{
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  padding: 5px;
}

.header-add i{
  margin-right: 5px;
  font-size: 20px;
}

.header-add:hover{
  background-color: #081d2e;
}
</style>