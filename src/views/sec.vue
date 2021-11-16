<template>
  <div class="p-2" style="overflow-y: hidden">
    <el-row :gutter="10">
      <el-col :md="16">
        <div class="card log">
          <div class="mb-10 ml-10 mr-10">
            <div class="float-right" style="display: flex;align-items: center;"><el-switch class="mr-10" v-model="auto" active-color="#13ce66" inactive-color="#081d2e" />锁定底部</div>
            <div>运行日志</div>
          </div>
          <el-scrollbar height="calc(100vh - 60px)">
            <div class="list">
              <div v-for="(item, index) in logs" :key="'logs_' + index">
                {{ item }}
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :md="8">
        <div class="card sec mb-10">
          <el-switch
            class="float-right"
            v-model="config.black"
            active-color="#13ce66"
            inactive-color="#081d2e"
          />
          <div>黑名单</div>
        </div>
        <div class="card sec mb-0">
          <el-switch
            class="float-right"
            v-model="config.white"
            active-color="#13ce66"
            inactive-color="#081d2e"
          />
          <div>白名单</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "security",
  data() {
    return {
      update: 0,
      auto: true,
      config: {
        black: false,
        white: false,
        login: false,
      },
      logs: [],
    };
  },
  methods: {
    startUpdate() {
      this.update = setInterval(() => {
        ipcRenderer.send("LogList");
      }, 1500);
    },
    toBottom() {
      setTimeout(() => {
        let scrollbar = this.$el.querySelector(".el-scrollbar__wrap");
        scrollbar.scrollTop = scrollbar.scrollHeight;
      }, 200);
    },
  },
  mounted() {
    ipcRenderer.on("LogListCallback", (event, data) => {
      this.logs = data;
      if(this.auto) this.toBottom();
    });
    ipcRenderer.send("LogList");
    this.startUpdate();
  },
};
</script>

<style>
.card.log .el-scrollbar__wrap {
  border-radius: 0 0 8px 8px;
}
</style>

<style scoped>
.card.sec {
  height: calc(50vh - 37.5px);
}

.card.log {
  height: calc(100vh - 40px);
  margin-bottom: 0;
  padding: 10px 0 0 0;
}

.card.log .list {
  min-height: calc(100vh - 65px);
  border-radius: 0 0 8px 8px;
  background-color: #000;
  padding: 0 5px 5px 5px;
  font-size: 14px;
}

.card.log .list > div:hover {
  background-color: rgb(46, 46, 46);
}
</style>
