<template>
  <div id="menu" class="noSelect">
    <div id="menu-tools">
      <div id="menu-exit" @click="exit"><i class="el-icon-close" /></div>
      <div id="menu-minimize" @click="minimize">
        <i class="el-icon-minus" />
      </div>
    </div>
    <div id="menu-logo">
      <img src="@/assets/menu.png" />
    </div>
    <div
      class="menu-item"
      v-for="(item, index) in list"
      :key="'menu_' + index"
      :class="{ action: action === index, bottom: item.bottom }"
      @click="switchMenu(index)"
    >
      <i :class="item.icon" />
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "appMenu",
  data() {
    return {
      action: 0,
      list: [
        {
          path: "/res",
          icon: "el-icon-receiving",
          name: "资源",
        },
        {
          path: "/net",
          icon: "el-icon-connection",
          name: "网络",
        },
        {
          path: "/sec",
          icon: "el-icon-umbrella",
          name: "安全",
        },
        {
          path: "/set",
          icon: "el-icon-setting",
          name: "设置",
          bottom: true,
        },
      ],
    };
  },
  methods: {
    switchMenu(i) {
      this.action = i;
      let select = this.list[i];
      this.$router.push(select.path);
    },
    exit() {
      ipcRenderer.send("window-close");
    },
    minimize() {
      ipcRenderer.send("window-min");
    },
  },
};
</script>

<style scoped>
#menu {
  box-shadow: 2px 0 10px 0 rgba(0, 0, 0, 0.3);
  background-color: #334756;
  width: 100px;
  z-index: 999;
}

#menu-logo {
  justify-content: center;
  margin-bottom: 10px;
  display: flex;
  width: 100px;
}

#menu-logo img {
  height: 80px;
  width: 80px;
}

.menu-item {
  transition: all ease-out 0.3s;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  display: flex;
  width: 80px;
}

.menu-item:hover,
.menu-item.action {
  border-right: 5px solid #334756;
  border-radius: 0 15px 15px 0;
  background-color: #082032;
  padding-right: 5px;
}

.menu-item > i {
  margin-right: 5px;
  font-size: 20px;
}

.menu-item.bottom {
  position: absolute;
  bottom: 0;
}

#menu-tools {
  align-items: center;
  display: flex;
  padding: 10px;
  height: 10px;
}

#menu-tools > div {
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  display: flex;
  height: 11px;
  width: 11px;
}

#menu-tools i {
  font-weight: bold;
  font-size: 10px;
}

#menu-exit {
  background-color: #ec3838;
  margin-right: 9px;
  color: #ec3838;
}

#menu-minimize {
  background-color: #f8b537;
  color: #f8b537;
}

#menu-tools > div:hover {
  color: rgba(0, 0, 0, 0.6);
}
</style>