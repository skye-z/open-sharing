import fs from 'fs'

const path = {
    log: '/tmp/open-sharing/run.log',
    res: '/tmp/open-sharing/config/resources.json',
    net: '/tmp/open-sharing/config/network.json',
    sec: '/tmp/open-sharing/config/security.json',
    other: '/tmp/open-sharing/config/other.json'
}

const init = {
    run() {
        let rootPath = '/tmp/open-sharing/config/'
        if (!fs.existsSync(rootPath)) fs.mkdirSync(rootPath, { recursive: true });
        if (!fs.existsSync(path.res)) fs.writeFileSync(path.res, '[]', 'utf8')
        if (!fs.existsSync(path.net)) fs.writeFileSync(path.net, '{}', 'utf8')
        if (!fs.existsSync(path.sec)) fs.writeFileSync(path.sec, '{}', 'utf8')
        if (!fs.existsSync(path.other)) fs.writeFileSync(path.other, '{}', 'utf8')
        return true
    },
}

export default init