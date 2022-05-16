<template>
  <div class="p-2">
    <div class="big-card">
      <div class="big-box">
        <div class="loading" v-if="loading">
          <div class="el-loading-spinner">
            <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
            </svg>
          </div>
        </div>
        <div class="big-btn" :class="{ on: info.state }" @click="switchServer">
          <div>
            <div v-if="info.state">关闭服务</div>
            <div v-else>开启服务</div>
            <div>端口 {{ info.port }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card state">
      <div>访问地址</div>
      <div class="ip-box">
        <div
          class="ip"
          v-for="(item, index) in info.net"
          :key="'net_' + index"
          @click="copy('http://' + item + ':' + info.port)"
        >
          <span>{{ index + 1 }}</span
          >{{ item }}:{{ info.port }} <i class="el-icon-copy-document" />
        </div>
      </div>
    </div>
    <div class="card socket">
      <div class="mb-10">
        <span>在线设备 </span>
        <span v-if="socket.length > 0">({{ socket.length }})</span>
      </div>
      <el-scrollbar :height="175">
        <el-row>
          <el-col
            :md="8"
            v-for="(item, index) in socket"
            :key="'socket_' + index"
            class="socket-box"
          >
            <span class="mr-5">{{ item.ip }}</span>
            <template v-if="item.list === ''">
              <el-tooltip
                :offset="6"
                effect="dark"
                content="加入黑名单"
                placement="top"
              >
                <i
                  class="button el-icon-remove color-red"
                  @click="addList(item.ip, 1)"
                />
              </el-tooltip>
              <el-tooltip
                :offset="6"
                effect="dark"
                content="加入白名单"
                placement="top"
              >
                <i
                  class="button el-icon-circle-plus color-green"
                  @click="addList(item.ip, 2)"
                />
              </el-tooltip>
            </template>
            <template v-else>
              <span class="black-list" v-if="item.list === 'black'"
                >黑名单</span
              >
              <span class="white-list" v-else>白名单</span>
            </template>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { clipboard } from "electron";
import Config from "../plugins/config";

export default {
  name: "network",
  data() {
    return {
      loading: true,
      info: {
        state: true,
        port: 56565,
        net: [],
      },
      update: 0,
      socket: [],
      list: {
        black: [],
        white: [],
      },
    };
  },
  methods: {
    switchServer() {
      this.loading = true;
      if (this.info.state) {
        ipcRenderer.send("ServiceStop");
        ipcRenderer.once("ServiceStopCallback", () => {
          this.stopUpdate();
          setTimeout(() => {
            this.info.state = false;
          }, 1000);
          setTimeout(() => {
            this.loading = false;
          }, 1500);
        });
      } else {
        ipcRenderer.send("ServiceStart");
        ipcRenderer.once("ServiceStartCallback", (event, data) => {
          this.info = data;
          this.startUpdate();
          setTimeout(() => {
            this.info.state = true;
          }, 1000);
          setTimeout(() => {
            this.loading = false;
          }, 1500);
        });
      }
    },
    startUpdate() {
      this.update = setInterval(() => {
        this.getList();
        ipcRenderer.send("ServiceGetSocketList");
      }, 1500);
    },
    stopUpdate() {
      this.socket = [];
      clearInterval(this.update);
    },
    copy(txt) {
      clipboard.writeText(txt);
      this.$notify({
        title: "复制成功",
        type: "success",
        duration: 2000,
      });
    },
    getList() {
      this.list = Config.getSecList();
      if (!this.list.black) this.list.black = [];
      if (!this.list.white) this.list.white = [];
    },
    addList(ip, type) {
      this.$confirm(
        "确认要将 " + ip + " 加入" + (type === 1 ? "黑" : "白") + "名单吗?",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认加入",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let msg = Config.addList(ip, type);
          if (!msg) {
            this.getList();
            ipcRenderer.send("ServiceGetSocketList");
            this.$notify({
              title: "加入成功",
              type: "success",
              duration: 2000,
            });
          } else {
            this.$notify({
              title: "加入失败",
              message: msg,
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((_) => {});
    },
    checkList(ip) {
      if (this.list.black.indexOf(ip) !== -1) return "black";
      if (this.list.white.indexOf(ip) !== -1) return "white";
      return "";
    },
  },
  mounted() {
    this.getList();
    ipcRenderer.once("ServiceGetInfoCallback", (event, data) => {
      this.loading = false;
      this.info = data;
    });
    ipcRenderer.on("ServiceGetSocketListCallback", (event, data) => {
      let socketList = [];
      for (let i in data) {
        socketList.push({
          ip: data[i],
          list: this.checkList(data[i]),
        });
      }
      this.socket = socketList;
    });
    ipcRenderer.send("ServiceGetInfo");
    this.startUpdate();
  },
};
</script>

<style scoped>
.big-card {
  justify-content: center;
  padding: 30px 0;
  display: flex;
}

.big-box {
  background-color: #1a354b;
  border-radius: 200px;
  padding: 10px;
}

.loading,
.big-btn {
  border-radius: 180px;
  height: 180px;
  width: 180px;
}

.loading {
  background-color: rgba(26, 53, 75, 0.8);
  position: absolute;
}

.big-btn {
  box-shadow: 0 2px 10px 0 rgba(20, 168, 20, 0.3);
  transition: all ease-out 0.3s;
  background-color: #14a814;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  display: flex;
}

.big-btn.on {
  box-shadow: 0 2px 10px 0 rgba(255, 0, 0, 0.3);
  background-color: #ec3838;
}

.big-btn:hover {
  background-color: #0e930e;
  box-shadow: none;
}

.big-btn.on:hover {
  background-color: #d92c2c;
}

.big-btn:active {
  box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.5);
}

.big-btn > div {
  text-align: center;
}

.big-btn > div div:first-child {
  font-weight: bold;
  margin-top: 5px;
  font-size: 22px;
}

.ip-box {
  justify-content: space-around;
  margin-top: 10px;
  display: flex;
}

.ip {
  transition: all ease-out 0.3s;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  display: flex;
}

.ip span {
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

.ip i {
  margin-left: 5px;
}

.ip:hover {
  color: #97b0c4;
}

.card.socket {
  margin-bottom: 0;
}

.button {
  cursor: pointer;
}

.socket-box {
  align-items: center;
  display: flex;
}

.black-list {
  background-color: #000;
  border-radius: 10px;
  padding: 1px 3px;
  font-size: 12px;
}

.white-list {
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 1px 3px;
  font-size: 12px;
  color: #333;
}
</style>
