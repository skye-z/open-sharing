<template>
  <div>
    <div id="drop-mask" v-show="drop">拖到此处松手即可导入</div>
    <loading v-if="loading" />
    <div>
      <table id="header-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>大小</th>
            <th>权限</th>
            <th>操作</th>
          </tr>
        </thead>
      </table>
      <table id="file-table">
        <tbody>
          <tr
            v-for="(item, index) in list"
            :key="'list_' + index"
            @click="ediRes(item, index)"
          >
            <td>
              <div class="name line-1">
                <span v-if="item.alias">{{ item.alias }}</span>
                <span v-else>{{ item.name }}</span>
              </div>
              <div class="path">{{ item.path }}</div>
            </td>
            <td>
              <span>{{ getType(item.type) }}</span>
              <div class="type">{{ item.type }}</div>
            </td>
            <td>
              <span class="color-gray" v-if="item.type === 'folder'"
                >无法统计</span
              >
              <span v-else-if="item.size">{{ item.size }}</span>
              <span v-else class="color-red">资源失效</span>
            </td>
            <td>
              <span v-if="item.auth === 'all'">公开</span>
              <span v-else-if="item.auth === 'password'">密码</span>
              <div class="type">{{ item.password }}</div>
            </td>
            <td>
              <div>
                <i
                  class="el-icon-copy-document"
                  @click.stop="
                    copy(
                      index,
                      Boolean(item.alias) ? item.alias : item.name,
                      item.auth,
                      item.password
                    )
                  "
                />
                <i
                  class="el-icon-delete"
                  @click.stop="delRes(item.path, item.name)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <res-drawer ref="resDrawer" />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { clipboard } from "electron";
import Config from "../plugins/config";
import Loading from "../components/loading";
import resDrawer from "../components/res-drawer";

export default {
  name: "resources",
  components: { Loading, resDrawer },
  data() {
    return {
      loading: true,
      drop: false,
      edit: {
        state: false,
        info: {},
        more: {},
      },
      list: [],
    };
  },
  methods: {
    loadList() {
      ipcRenderer.send("ServiceGetInfo");
      this.list = Config.getResList();
      this.loading = false;
    },
    getType(txt) {
      let type = {
        folder: "文件夹",
        html: "网页主体",
        js: "网页脚本",
        db: "数据库文件",
        jar: "Java程序",
        sh: "Shell脚本",
        apk: "安卓应用程序",
        ipa: "苹果应用程序",
        css: "网页样式",
        log: "日志",
        class: "二进制类",
        dockerfile: "镜像构建脚本",
      };
      for (let key in type) {
        if (txt === key) return type[key];
      }
      if (txt === "txt" || txt === "doc" || txt === "docx") return "文本文档";
      else if (
        txt === "png" ||
        txt === "jpg" ||
        txt === "jpeg" ||
        txt === "webp" ||
        txt === "gif"
      )
        return "图片";
      else if (txt === "ppt" || txt === "pptx") return "演示文档";
      else if (txt === "xls" || txt === "xlsx") return "办公表格";
      else if (
        txt === "yaml" ||
        txt === "yml" ||
        txt === "xml" ||
        txt === "json"
      )
        return "序列化文档";
      else if (txt === "zip" || txt === "rar" || txt === "7z" || txt === "gz")
        return "压缩包";
      else return "其他";
    },
    delRes(path, name) {
      this.$confirm('确认要从资源库中移除 "' + name + '" 吗?', {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认移除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let msg = Config.delRes(path);
          if (msg === "") {
            this.loadList();
            this.$notify({
              title: "移除成功",
              type: "success",
              duration: 2000,
            });
          } else {
            this.$notify({
              title: "移除失败",
              message: msg,
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((_) => {});
    },
    addRes(files) {
      Config.addRes(files);
      this.loadList();
      this.$notify({
        title: "导入成功",
        type: "success",
        duration: 2000,
      });
    },
    ediRes(file, index) {
      this.$refs.resDrawer.open(index, file, Config.getResInfo(file.path));
    },
    dragStart(e) {
      e.stopPropagation();
      e.preventDefault();
      this.drop = true;
    },
    dragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      this.drop = false;
    },
    dropEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      this.addRes(e.dataTransfer.files);
      this.drop = false;
    },
    copy(index, title, auth, pass) {
      if (this.network.state && this.network.net.length < 1) {
        this.$notify({
          title: "网络无法连接",
          type: "error",
          duration: 2000,
        });
        return false;
      } else {
        let downPath = `/down/${auth}/${index}`;
        let txt = `我给你分享了《${title}》\n下载地址: http://${this.network.net[0]}:${this.network.port}${downPath}`;
        if (pass) txt += `\n访问密码: ${pass}`;
        clipboard.writeText(txt);
        this.$notify({
          title: "复制成功",
          type: "success",
          duration: 2000,
        });
      }
    },
  },
  mounted() {
    ipcRenderer.once("ServiceGetInfoCallback", (event, data) => {
      this.network = data;
    });
    setTimeout(() => this.loadList(), 1000);
    let dropbox = document.getElementById("drop-mask");
    dropbox.addEventListener("dragleave", this.dragEnd);
    dropbox.addEventListener("drop", this.dropEnd, false);
    window.addEventListener("dragenter", this.dragStart);
    window.addEventListener("dragover", this.dragStart);
  },
};
</script>

<style scoped>
#file-table {
  border-collapse: collapse;
  margin: 35px 0 5px 0;
  font-size: 14px;
  width: 100%;
}

#header-table {
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
  background-color: #152f44;
  border-collapse: collapse;
  width: calc(100% - 100px);
  font-size: 14px;
  position: fixed;
  z-index: 7;
  top: 0px;
}

#header-table tr,
#file-table tr {
  text-align: left;
}

#header-table tr th:nth-child(2),
#file-table tr td:nth-child(2) {
  width: 120px;
}

#header-table tr th:nth-child(3),
#file-table tr td:nth-child(3) {
  width: 90px;
}

#header-table tr th:nth-child(4),
#file-table tr td:nth-child(4) {
  width: 75px;
}

#header-table tr th:last-child,
#file-table tr td:last-child {
  text-align: right;
  width: 60px;
}

#file-table tr td:last-child {
  text-align: right;
}

#file-table tr td:last-child > div {
  justify-content: space-around;
  align-items: center;
  font-size: 15px;
  display: flex;
}

#file-table tr td {
  cursor: pointer;
}

#file-table tr td:last-child > div i {
  padding: 5px;
}

#file-table tr td:last-child > div i:hover {
  color: #677c8b;
}

#header-table tr th {
  padding: 7px 10px 3px 10px;
}

#file-table tr td {
  padding: 5px 10px;
}

#file-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

#file-table .path,
#file-table .type {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 12px;
  color: #6b6b6b;
}

#file-table .name {
  max-width: 445px;
}

#file-table .path {
  max-width: 400px;
}

#file-table .type {
  max-width: 120px;
}

#drop-mask {
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(8, 29, 46, 0.7);
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100vh;
  display: flex;
  width: 100vw;
  color: #fff;
  z-index: 99;
  left: 0;
  top: 0;
}
</style>