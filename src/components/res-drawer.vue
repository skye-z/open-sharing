<template>
  <el-drawer
    :size="310"
    :z-index="998"
    :withHeader="false"
    v-model="state"
    modal-class="edit-mask"
    custom-class="edit-custom"
    @close="save"
  >
    <div class="name line-1">{{ info.name }}</div>
    <div class="path line-1">{{ info.path }}</div>
    <div class="item">
      <span class="mr-10">别名</span>
      <el-input v-model="info.alias" size="mini" style="width: 210px" />
    </div>
    <div class="item">
      <span class="mr-10">权限</span>
      <el-radio-group size="mini" v-model="info.auth" fill="#13ce66" @change="changeAuth">
        <el-radio-button label="all">公开访问</el-radio-button>
        <el-radio-button label="password">密码保护</el-radio-button>
      </el-radio-group>
    </div>
    <div class="item" v-if="info.auth === 'password'">
      <span class="mr-10">密码</span>
      <el-input
        v-model="info.password"
        size="mini"
        style="width: 150px; margin-right: 10px"
      />
      <div class="btn" @click="buildPass">生成</div>
    </div>
    <template v-if="more.exist">
      <div class="item">
        <span class="mr-10">时间</span>
        <div>创建 {{ more.birthtime.toLocaleString() }}</div>
      </div>
      <div class="item">
        <span style="margin-right: 42px"></span>
        <div>更新 {{ more.lastUpdate.toLocaleString() }}</div>
      </div>
      <div class="item">
        <span class="mr-10">大小</span>
        <div>{{ more.size }}</div>
      </div>
      <div class="item" style="margin-top: 0px">
        <span class="mr-10">查看</span>
        <div>
          <el-button type="text" @click="openDir(info.path)"
            ><i class="el-icon-folder-opened" />打开目录</el-button
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div class="item">
        <span class="mr-10">清除</span>
        <div>
          <el-switch
            v-model="remove"
            active-color="#13ce66"
            inactive-color="#081d2e"
          />
        </div>
        <span class="tips">*自动清除无效资源</span>
      </div>
      <el-alert
        style="margin-top: 20px"
        :closable="false"
        title="资源不存在"
        type="error"
        description="资源可能已经被删除或移动位置"
        show-icon
        effect="dark"
      />
    </template>
  </el-drawer>
</template>

<script>
import Config from "../plugins/config";
export default {
  name: "resDrawer",
  data() {
    return {
      remove: false,
      state: false,
      index: 0,
      info: {},
      more: {},
    };
  },
  methods: {
    open(index, file, more) {
      this.index = index;
      this.info = file;
      this.more = more;
      this.state = true;
      this.remove = false;
    },
    openDir(path) {
      Config.open(path.substring(0, path.lastIndexOf("/")));
    },
    changeAuth(auth){
      if(auth==='password') this.buildPass();
    },
    save() {
      if (this.remove) {
        Config.delRes(this.info.path);
        this.$parent.loadList();
        this.$notify({
          title: "失效资源已清除",
          type: "success",
          duration: 2000,
        });
      } else {
        this.info.size = this.more.size;
        if (this.info.auth !== "password") delete this.info.password;
        let state = Config.ediRes(this.index, this.info);
      }
    },
    buildPass(){
      this.info.password = Math.floor(Math.random()*(999999-100000+1)+100000);
    }
  },
};
</script>

<style>
.edit-mask {
  backdrop-filter: saturate(180%) blur(4px);
}

.edit-custom {
  background-color: #334756;
}

.edit-custom input {
  font-size: 18px;
  padding: 0 0 0 5px;
}

.edit-custom .el-radio__label {
  color: #8b9ead;
}

.edit-custom input{
    background-color: #082032;
    border-color: #333333;
    color: #f4f4f4;
}
</style>

<style scoped>
.edit-custom .name {
  font-weight: bold;
}

.edit-custom .path {
  word-wrap: break-word;
  margin-bottom: 20px;
  font-size: 12px;
  color: #a7a7a7;
}

.edit-custom .item {
  align-items: center;
  position: relative;
  margin-top: 10px;
  display: flex;
}

.edit-custom .tips {
  position: absolute;
  font-size: 14px;
  color: #8b9ead;
  right: 10px;
}

.edit-custom .btn {
  transition: all ease-out 0.3s;
  background-color: #082032;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  height: 30px;
  width: 55px;
}

.edit-custom .btn:hover {
  background-color: #113048;
}

.edit-custom .btn:active {
  background-color: #061a28;
}
</style>