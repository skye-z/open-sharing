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
        <div class="big-btn" :class="{'on':info.state}" @click="switchServer">
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
        <div class="ip" v-for="(item,index) in info.net" :key="'net_'+index" @click="copy('http://'+item+':'+info.port)">
          <span>{{index+1}}</span>{{ item }}:{{ info.port }} <i class="el-icon-copy-document" />
        </div>
      </div>
    </div>
    <div class="card socket">
      <div class="mb-10">
        <span>在线设备 </span>
        <span v-if="socket.length>0">({{socket.length}})</span>
      </div>
      <el-scrollbar :height="175">
        <el-row>
          <el-col :md="8" v-for="(item,index) in socket" :key="'socket_'+index">{{ item }} <i class="el-icon-delete"/> </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from "electron";
import { clipboard } from "electron";

export default {
  name: 'network',
  data() {
    return {
      loading: true,
      info: {
        state: true,
        port: 56565,
        net: []
      },
      update: 0,
      socket:[]
    };
  },
  methods: {
    switchServer() {
      this.loading = true
      if (this.info.state) {
        ipcRenderer.send("ServiceStop");
        ipcRenderer.once("ServiceStopCallback", () => {
          this.stopUpdate()
          setTimeout(() => {
            this.info.state = false
          }, 1000);
          setTimeout(() => {
            this.loading = false
          }, 1500);
        })
      } else {
        ipcRenderer.send("ServiceStart");
        ipcRenderer.once("ServiceStartCallback", (event, data) => {
          this.info = data
          this.startUpdate()
          setTimeout(() => {
            this.info.state = true
          }, 1000);
          setTimeout(() => {
            this.loading = false
          }, 1500);
        })
      }
    },
    startUpdate(){
      this.update = setInterval(()=>{
        ipcRenderer.send("ServiceGetSocketList");
      },1500)
    },
    stopUpdate(){
      this.socket = []
      clearInterval(this.update)
    },
    copy(txt){
      clipboard.writeText(txt)
      this.$notify({
        title: '复制成功',
        type: 'success',
        showClose: false,
        duration: 2000,
      })
    }
  },
  mounted() {
    ipcRenderer.once("ServiceGetInfoCallback", (event, data) => {
      this.loading = false
      this.info = data
    })
    ipcRenderer.on("ServiceGetSocketListCallback", (event, data) => {
      this.socket = data
    })
    ipcRenderer.send("ServiceGetInfo");
    this.startUpdate()
  }
}
</script>

<style scoped>
.big-card{
  justify-content: center;
  padding: 30px 0;
  display: flex;
}

.big-box{
  background-color: #1a354b;
  border-radius: 200px;
  padding: 10px;
}

.loading, .big-btn {
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

.ip-box{
  justify-content: space-between;
  margin-top: 10px;
  display: flex;
}

.ip{
  transition: all ease-out 0.3s;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  display: flex;
}

.ip span{
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

.ip i{
  margin-left: 5px;
}

.ip:hover{
  color: #97b0c4;
}

.card.socket{
  margin-bottom: 0;
}
</style>
