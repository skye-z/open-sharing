'use strict'

import {ipcMain, app, protocol, BrowserWindow, Tray, Menu, nativeImage} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import Service from "./plugins/service"
import Config from "./plugins/config"
import Logs from "./plugins/logs"
let tray;
let win;

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false,
        center: true,
        resizable: false,
        transparent: true,
        maximizable: false,
        fullscreenable: false,
        backgroundColor: '#082032',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        },
        icon: nativeImage.createFromPath('src/assets/logo.png')
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        win.loadURL('app://./index.html')
    }

    ipcMain.on('window-min', function () {
        win.minimize();
    })

    ipcMain.on('window-close', function () {
        win.hide();
    })

    // 获取服务信息
    ipcMain.on('ServiceGetInfo', function (event) {
        event.sender.send("ServiceGetInfoCallback", Service.getInfo())
    })
    // 获取本机网络信息
    ipcMain.on('ServiceGetNetwork', function (event) {
        event.sender.send("ServiceGetNetworkCallback", Service.getNetwork())
    })
    // 获取连接信息
    ipcMain.on('ServiceGetSocketList', function (event) {
        event.sender.send("ServiceGetSocketListCallback", Service.getSocketList())
    })
    // 开启服务
    ipcMain.on('ServiceStart', function (event) {
        Service.start()
        event.sender.send("ServiceStartCallback", Service.getInfo())
    })
    // 关闭服务
    ipcMain.on('ServiceStop', function (event) {
        Service.stop()
        event.sender.send("ServiceStopCallback")
    })
    // 获取资源列表
    ipcMain.on('ConfigResList', function (event) {
        event.sender.send("ConfigResListCallback",Config.getResList())
    })
    // 获取日志列表
    ipcMain.on('LogList', function (event) {
        event.sender.send("LogListCallback",Logs.get(100))
    })

    Service.init.server()
}

// 关闭所有窗口后
// app.on('window-all-closed', () => {
//     app.quit()
// })

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 应用就绪
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue 开放工具加载失败:', e.toString())
        }
    }
    initMenu()
    createWindow()
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

function initMenu() {
    // MacOS
    if (process.platform === 'darwin') {
        // 加载Dock菜单
        app.dock.setMenu(Menu.buildFromTemplate([{label: '导入文件'}, {label: '导入文件夹'}]))

        // 加载主菜单
        Menu.setApplicationMenu(Menu.buildFromTemplate([
            {
                label: 'Open Sharing',
                role: 'appMenu',
                submenu: [
                    {label: '关于 Open Sharing', role: 'about'},
                    {label: '检查更新'},
                    {type: 'separator'},
                    {label: '服务', role: 'services'},
                    {type: 'separator'},
                    {label: '隐藏 Open Sharing', role: 'hide'},
                    {label: '隐藏其他应用', role: 'hideOthers'},
                    {label: '显示全部', role: 'unhide'},
                    {type: 'separator'},
                    {label: '退出 Open Sharing', role: 'quit'}
                ]
            },
            {
                label: '管理',
                submenu: [
                    {
                        label: '导入...',
                        submenu: [
                            {label: '导入文件'}, {label: '导入文件夹'}
                        ]
                    },
                    {type: 'separator'},
                    {label: '开启网络服务', type: 'checkbox'},
                    {
                        label: '安全防护',
                        submenu: [
                            {label: '开启白名单', type: 'checkbox'},
                            {label: '开启黑名单', type: 'checkbox'},
                            {type: 'separator'},
                            {label: '开启密码验证', type: 'checkbox'},
                            {label: '开启账户验证', type: 'checkbox'},
                        ]
                    },
                ]
            },
            {
                label: '帮助',
                role: 'help',
                submenu: [
                    {label: '报告问题...'},
                    {label: '使用帮助'}
                ]
            }
        ]))
    }

    // 加载任务栏
    tray = new Tray(nativeImage.createFromPath('src/assets/tray.png'))
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: '显示窗口', click: () => {
                win.show()
            }
        },
        {type: 'separator'},
        {label: '开启网络服务', type: 'checkbox'},
        {
            label: '访问地址',
            submenu: [
                {label: '点击地址即可复制', enabled: false},
                {label: '192.168.1.160:56565'},
            ]
        },
        {
            label: '导入...', submenu: [
                {label: '导入文件'}, {label: '导入文件夹'}
            ]
        },
        {type: 'separator'},
        {
            label: '退出', click: () => {
                app.quit()
            }
        },
    ]))
    tray.setToolTip('OpenSharing')
}