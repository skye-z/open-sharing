import { exec } from 'child_process';
import logs from './logs'
import fs from 'fs'

const path = {
    res: '/tmp/open-sharing/config/resources.json',
    net: '/tmp/open-sharing/config/network.json',
    sec: '/tmp/open-sharing/config/security.json',
    other: '/tmp/open-sharing/config/other.json'
}

const config = {
    getResList() {
        let data = fs.readFileSync(path.res, 'utf-8')
        if (data) return JSON.parse(data)
        return []
    },
    addRes(files) {
        let list = config.getResList()
        for (let i = 0; i !== files.length; i++) {
            let file = files[i]
            list.push({
                "path": file.path,
                "name": file.name,
                "size": buildSize(file.size),
                "type": buildType(file.name),
                "alias": "",
                "auth": "all"
            })
            logs.add(`Add Resources '${file.name}' From ${file.path}`)
        }
        fs.writeFileSync(path.res, JSON.stringify(list))
    },
    delRes(resPath) {
        let list = config.getResList()
        if (list.length === 0) return "没有可删除的资源"
        let delIndex = -1
        for (let i = 0; i < list.length; i++) {
            let res = list[i]
            if (res.path === resPath) {
                logs.add(`Remove Resources '${res.name}' From ${res.path}`)
                delIndex = i
                break
            }
        }
        if (delIndex < 0) return "没有可删除的资源"
        list.splice(delIndex, 1)
        fs.writeFileSync(path.res, JSON.stringify(list))
        return ""
    },
    ediRes(index,info) {
        let list = this.getResList();
        if(list.length===0) return '资源不存在'
        if(JSON.stringify(info)===JSON.stringify(list[index])) return '没有发现变动'
        list[index] = info;
        fs.writeFileSync(path.res, JSON.stringify(list),'utf-8')
        return '更新成功'
    },
    getResInfo(path) {
        let state = fs.statSync(path, { throwIfNoEntry: false })
        if (state === undefined) return { exist: false };
        return {
            exist: true,
            size: buildSize(state.size),
            lastUpdate: new Date(state.mtime),
            birthtime: new Date(state.birthtime)
        }
    },
    open(path) {
        let data = exec('open ' + path)
        console.log(data)
    }
}

function buildSize(number) {
    if (number >= 1073741824) return parseFloat(number / 1073741824).toFixed(2) + ' GB'
    else if (number >= 1048576) return parseFloat(number / 1048576).toFixed(2) + ' MB'
    else if (number >= 1024) return parseFloat(number / 1024).toFixed(2) + ' KB'
    else return parseFloat(number / 1024).toFixed(2) + ' B'

}

function buildType(name) {
    if (name.lastIndexOf(".") === -1) return 'folder'
    return name.substring(name.lastIndexOf(".") + 1)
}

export default config