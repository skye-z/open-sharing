<template>
  <app-menu v-show="!loading" />
  <div id="content" class="noSelect">
    <el-scrollbar ref="scrollbar">
      <el-config-provider :locale="locale">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-config-provider>
    </el-scrollbar>
  </div>
</template>

<script>
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import AppMenu from "@/components/menu";

export default {
  name: "App",
  components: { AppMenu },
  data() {
    return {
      loading: true,
      locale: zhCn,
    };
  },
  mounted() {
    setTimeout(()=>{
      this.loading = false
    },500)
  }
};
</script>

<style>
#app {
  font-family: Ubuntu, "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-app-region: drag;
  color: #f4f4f4;
  display: flex;
}

#app > div {
  height: 100vh;
}

#content {
  background-color: #081d2e;
  width: 900px;
}

.noDrag,
a,
input,
button,
textarea,
#menu-tools > div,
#content {
  -webkit-app-region: no-drag;
}
.color-red{
  color: rgb(168, 24, 24);
}

.color-green{
  color: rgb(55, 206, 18);
}

.color-gray{
  color: gray;
}

.p-1 {
  padding: 5px;
}

.p-2 {
  padding: 10px;
}

.p-3 {
  padding: 15px;
}

.mb-0{
  margin-bottom: 0 !important;
}

.mb-10{
  margin-bottom: 10px;
}

.ml-10{
  margin-left: 10px;
}

.mr-5{
  margin-right: 5px;
}

.mr-10{
  margin-right: 10px;
}

.line-1{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.float-right{
  float: right;
}

.noSelect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.text-center {
  text-align: center;
}

.card {
  background-color: #1a354b;
  margin-bottom: 15px;
  border-radius: 6px;
  padding: 10px;
}

.el-message-box{
  background-color: #1a354b !important;
  border: none !important;
}

.el-message-box__content{
  color: #fff !important;
}

.el-message-box__btns .el-button--default{
  background-color: #1a354b;
  border: none;
  color: #fff;
}

.el-message-box__btns .el-button--default:hover{
  background-color: #0e2233;
  color: #fff;
}

.el-message-box__btns .el-button--primary{
  background-color: #334756;
}

.el-message-box__btns .el-button--primary:hover{
  background-color: #4b6375;
}

input {
  background-color: #082032;
  border-color: #333333;
  padding: 0 0 0 5px;
  color: #f4f4f4;
  font-size: 18px;
}

.el-input__wrapper {
  background-color: #082032 !important;
}
</style>
