<template>
  <div class="p-2">
    <el-row gutter="10">
      <el-col :md="8">
        <div class="card">
          <el-switch class="float-right" v-model="config.black" active-color="#13ce66" inactive-color="#081d2e" />
          <div>黑名单</div>
        </div>
      </el-col>
      <el-col :md="8">
        <div class="card">
          <el-switch class="float-right" v-model="config.white" active-color="#13ce66" inactive-color="#081d2e" />
          <div>白名单</div>
        </div>
      </el-col>
      <el-col :md="8">
        <div class="card">
          <el-switch class="float-right" v-model="config.login" active-color="#13ce66" inactive-color="#081d2e" />
          <div>账户验证</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'security',
  data() {
    return {
      config:{
        black: false,
        white: false,
        login: false
      }
    };
  },
}
</script>

<style scoped>
.card{
  height: calc(100vh - 40px);
  margin-bottom: 0;
}
</style>
