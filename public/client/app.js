(function(){
    getList();
})();

function getList(){
    $.get("/api/list",function(res){
        $("#file-table tbody").html('')
        if(res.state){
            for(let index in res.data){
                let item = res.data[index]
                $("#file-table tbody").append(`<tr onclick="${item.auth==='all' ? "postDownload('"+window.location+"down/"+item.auth+"/"+index+"')":"openPass('"+window.location+"down/"+item.auth+"/"+index+"')"}"><td><div class="name line-1">${Boolean(item.alias) ? item.alias:item.name}</div><div class="path">${window.location}down/${item.auth}/${index}</div></td><td><div>${getType(item.type)}</div><div class="type">${item.type}</div></td><td>${item.type==='folder' ? '无法统计':item.size}</td><td>${item.auth==='all' ? '公开':'密码'}</td></tr>`)
            }
        }
    },'json');
}

function getType(txt){
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
}

function openPass(path){
  let pass = prompt("此资源受密码保护,请输入6位数字组成的访问密码.");
  if(pass && pass.length === 6 && /[0-9]{6}/.test(pass)) postDownload(path,pass)
  else alert("访问密码无效")
}

function postDownload(url, pass) {  
  var form = $('<form></form>');  
      form.attr('action', url + "?t=" + Math.random()+(Boolean(pass) ? "&pass="+pass:""));  
      form.attr('method', 'post');  
      form.appendTo('body').submit().remove();  
}