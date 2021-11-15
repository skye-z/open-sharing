<template>
  <div class="p-2">
    <div class="card">
      <div class="mb-10">版本信息</div>
      <el-row>
        <el-col :md="8">核心服务: v1.0.1 build.3</el-col>
        <el-col :md="8">开放接口: v1.0.4 build.15</el-col>
        <el-col :md="8">外部界面: v1.0.3 build.7</el-col>
      </el-row>
    </div>
    <div class="card">
      <div>基本设置</div>
      <div class="config-item">
        <span class="mr-10">服务自启</span>
        <el-switch
          v-model="config.auto"
          active-color="#13ce66"
          inactive-color="#081d2e"
        />
        <span class="tips">*关闭此项将不会在应用启动时自动启动网络服务</span>
      </div>
      <div class="config-item">
        <span class="mr-10">网络端口</span>
        <el-input
          v-model="config.port"
          type="number"
          min="50000"
          max="65535"
          size="mini"
          placeholder="56565"
          style="width: 100px"
        />
        <span class="tips" style="color: #f8b537"
          >*注意: 端口需在 50000 至 65535 之间</span
        >
      </div>
      <div class="config-item">
        <span class="mr-10">默认权限</span>
        <el-radio-group size="mini" v-model="config.auth" fill="#13ce66">
          <el-radio-button label="all">公开访问</el-radio-button>
          <el-radio-button label="password">密码保护</el-radio-button>
        </el-radio-group>
        <span class="tips">*注意: 独立密码将为每个资源自动生成密码</span>
      </div>
      <div class="config-item">
        <span class="mr-10">自动清除</span>
        <el-switch
          v-model="config.remove"
          active-color="#13ce66"
          inactive-color="#081d2e"
        />
        <span class="tips" style="color: #ec3838"
          >*警告: 开启此项后查看不存在的资源将自动清除资源记录</span
        >
      </div>
    </div>
    <div class="card">
      <div>高级设置</div>
      <div class="config-item">
        <span class="mr-10">开放接口</span>
        <el-switch
          v-model="config.api"
          active-color="#13ce66"
          inactive-color="#081d2e"
        />
        <span class="tips" style="color: #ec3838"
          >*警告: 开启后将激活 App Secret, 凭借 App Secret
          可通过接口直接访问资源</span
        >
      </div>
      <div class="config-item">
        <span class="mr-10">App Secret</span>
        <span class="mr-10">ASD1F789A4EWF89Q1WF78Q1WEF871QEW</span>
        <span class="tips" style="color: #ec3838"
          >*警告: App Secret 非常重要请勿泄露,重新生成后原始的将立即失效</span
        >
      </div>
    </div>
    <div class="card api" v-if="config.api">
      <div class="mb-10">接口文档</div>
      <el-row>
        <el-col :md="24">
          <div class="api-title">
            <span>0</span>
            <div>身份校验</div>
          </div>
          <div class="api-data">
            当
            <el-tag effect="dark" size="mini">GET</el-tag>
            请求时,请将参数"token"附在链接中; 当
            <el-tag effect="dark" type="success" size="mini">POST</el-tag>
            请求时,请将参数"token"附在请求体参数中;
          </div>
          <div class="api-data">
            请注意在
            <el-tag effect="dark" type="success" size="mini">POST</el-tag>
            请求时,请求体需使用"form-data";
          </div>
          <div class="api-data">参数"token"的值为高级设置中的 App Secret.</div>
        </el-col>
        <el-col :md="12">
          <div class="api-title">
            <span>1</span>
            <div>获取资源列表</div>
          </div>
          <div class="api-data">
            <div>
              <el-tag effect="dark" size="mini">GET</el-tag>
              /api/list
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <div class="api-title">
            <span>2</span>
            <div>获取指定资源详情</div>
          </div>
          <div class="api-data">
            <div>
              <el-tag effect="dark" size="mini">GET</el-tag>
              /api/{id}/info
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <div class="api-title">
            <span>3</span>
            <div>下载指定资源</div>
          </div>
          <div class="api-data">
            <div>
              <el-tag effect="dark" size="mini">GET</el-tag>
              /api/{id}/download
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <div class="api-title">
            <span>4</span>
            <div>上传资源</div>
          </div>
          <div class="api-data">
            <div>
              <el-tag effect="dark" type="success" size="mini">POST</el-tag>
              /api/upload
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="foot-bar">
      <div>重置</div>
      <div class="main-btn">保存</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "setup",
  data() {
    return {
      config: {
        auto: true,
        port: 56565,
        auth: "all",
        remove: false,
        api: false,
      },
    };
  },
};
</script>

<style>
.config-item input {
  font-size: 18px;
  padding: 0 0 0 5px;
}

.config-item .el-radio__label {
  color: #8b9ead;
}

.config-item .el-radio {
  margin-right: 10px;
}

.config-item input {
  background-color: #082032;
  border-color: #333333;
  color: #f4f4f4;
}
</style>
<style scoped>
.config-item {
  align-items: center;
  position: relative;
  margin-top: 10px;
  display: flex;
  width: 860px;
}

.config-item .tips {
  position: absolute;
  font-size: 14px;
  color: #8b9ead;
  right: 10px;
}

.api-title {
  margin-bottom: 10px;
  align-items: center;
  display: flex;
}

.api-title span {
  background-color: #082032;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  margin-right: 5px;
  font-size: 18px;
  display: flex;
  height: 25px;
  width: 25px;
}

.api-data {
  padding: 0 0 15px 30px;
}

.foot-bar {
  justify-content: center;
  padding: 10px 0 20px 0;
  align-items: center;
  display: flex;
}

.foot-bar > div {
  transition: all ease-out 0.3s;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  margin: 0 10px;
  display: flex;
  height: 40px;
  width: 70px;
}

.foot-bar > div:hover {
  background-color: #14314b;
}

.foot-bar > div:active {
  background-color: #1d3d5b;
}

.foot-bar .main-btn {
  background-color: #4b6375;
}

.foot-bar .main-btn:hover {
  background-color: #324857;
}

.foot-bar .main-btn:active {
  background-color: #203441;
}
</style>
