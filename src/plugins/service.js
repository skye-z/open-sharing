import archiver from 'archiver'
import express from 'express'
import config from './config'
import http from 'http'
import path from 'path'
import os from 'os'
import fs from 'fs'

let Server
let Sockets = []

const service = {
    port: 56565,
    state: false,
    init: {
        server: (port) => {
            if (port) service.port = port
            outLog('Service Init On Port ' + service.port)
            service.start()
        },
        processor: () => initApp()
    },
    start: () => {
        Server = http.createServer(service.init.processor()).listen(service.port, () => {
            outLog('Service Running')
            service.state = true
        })
        Server.on("connection", function (socket) {
            Sockets.push(socket);
            socket.once("close", function () {
                Sockets.splice(Sockets.indexOf(socket), 1);
            });
        });
    },
    stop: () => {
        outLog('Service Shutdown In Progress')
        outLog('End ' + Sockets.length + ' Connections')
        Sockets.forEach(function (socket) {
            socket.destroy();
        });
        Server.close(() => {
            outLog('Service Stop')
            service.state = true
            Sockets = []
            Server = {}
        });
    },
    getInfo: () => {
        return {
            state: service.state,
            port: service.port,
            net: service.getNetwork()
        }
    },
    getSocketList: () => {
        let list = []
        Sockets.forEach(function (socket) {
            if (socket.remoteAddress === '::1') list.push("127.0.0.1")
            else list.push(socket.remoteAddress.indexOf("::ffff:") === -1 ? socket.remoteAddress : socket.remoteAddress.replace("::ffff:", ""))
        });
        return Array.from(new Set(list))
    },
    getNetwork: () => {
        let networkList = []
        let interfacesMap = os.networkInterfaces()
        for (let key in interfacesMap) {
            interfacesMap[key].forEach(function (network) {
                if (!network.internal && network.family === 'IPv4') networkList.push(network.address)
            });
        }
        return networkList
    }
}

function outLog(msg) {
    console.log('[Backstage] ' + msg);
}

function returnError(msg,res) {
    res.setHeader("Content-Type", "application/json")
    res.send({ state: false, message: msg })
    return false
}

function downFile(type, path, res) {
    let err = true
    let state = fs.statSync(path, { throwIfNoEntry: false })
    if (state === undefined) return err;
    if (type === 'folder') {
        let state = fs.statSync(path + '.zip', { throwIfNoEntry: false })
        if (state === undefined) {
            outLog('Folder Compression...')
            let output = fs.createWriteStream(path + '.zip');
            let archive = archiver('zip', {
                zlib: { level: 9 }
            });
            archive.pipe(output);
            archive.directory(path, false);
            archive.finalize();
            archive.on("finish", function () {
                state = fs.statSync(path + '.zip', { throwIfNoEntry: false })
                if (state === undefined) {
                    res.setHeader("Content-Type", "application/json")
                    res.send({ state: false, message: '文件夹打包出错' })
                }
                else res.download(path + '.zip')
            });
        } else res.download(path + '.zip')
        outLog('Download Folder ' + path)
        err = false
    } else {
        outLog('Download File ' + path)
        res.download(path)
        err = false
    }
    return err;
}

function initApp() {
    let app = express()
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client', 'index.html'))
    })
    app.get('/app.css', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client', 'app.css'))
    })
    app.get('/app.js', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client', 'app.js'))
    })
    app.get('/jquery.js', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client', 'jquery.js'))
    })
    app.get('/font/**', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/font', req.path.replace("font/", "")))
    })
    app.post('/down/*/*', (req, res) => {
        let err = true
        let parameter = req.path.substring(6).split('/')
        if (parameter.length === 2) {
            let index = parseInt(parameter[1])
            if (parameter[0] === 'password') {
                if (!Boolean(req.query.pass)) err = returnError('请提供访问密码',res)
                else {
                    let resList = config.getResList()
                    if (resList.length >= index + 1 && resList[index].auth === 'password') {
                        console.log(resList[index].password)
                        console.log(req.query.pass)
                        if (resList[index].password+'' !== req.query.pass+'') err = returnError('访问密码错误',res)
                        else err = downFile(resList[index].type, resList[index].path, res)
                    }
                }
            } else if (parameter[0] === 'all') {
                let resList = config.getResList()
                if (resList.length >= index + 1 && resList[index].auth === 'all') err = downFile(resList[index].type, resList[index].path, res)
            }
        }
        if (err) returnError('资源不存在',res)
    })
    app.get('/api/list', (req, res) => {
        let data = config.getResList()
        let retData = []
        for (let index in data) {
            retData.push({
                alias: data[index].alias,
                auth: data[index].auth,
                name: data[index].name,
                size: data[index].size,
                type: data[index].type
            })
        }
        res.setHeader("Content-Type", "application/json")
        res.send({ state: true, data: retData })
    })
    return app
}

export default service