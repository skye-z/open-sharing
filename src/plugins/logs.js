import fs from 'fs'

const path = '/tmp/open-sharing/run.log'

let num = 0

const logs = {
    init() {
        let rootPath = '/tmp/open-sharing/config/'
        if (!fs.existsSync(rootPath)) {
            fs.mkdir(rootPath, { recursive: true }, (err) => {
                if (err) throw err;
                logs.add('Init Log Service')
                logs.add('App Runing')
                initConfig()
            });
        } else logs.add('App Runing')
    },
    add(message) {
        num++
        fs.appendFile(path, '[' + new Date().toLocaleString() + '] ' + message + '\n', 'utf8', (err) => {
            if (err) throw err;
            if (num > 100) logs.check()
        });
    },
    get(line) {
        let data = fs.readFileSync(path, 'utf8');
        let list = data.split("\n");
        if (list.length - 1 < line) return list
        return list.substring(list.length - line)
    },
    check() {
        fs.stat(path, (err, res) => {
            if (err) throw err;
            let size = res.size / 1024
            if (size >= 512) {
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) throw err;
                    fs.writeFile(path, data.substring(data.length / 2), 'utf8', (err) => {
                        if (err) throw err;
                        num = 0
                    });
                })
            }
        });
    }
}

function initConfig() {
    let configPath = {
        res: '/tmp/open-sharing/config/resources.json',
        net: '/tmp/open-sharing/config/network.json',
        sec: '/tmp/open-sharing/config/security.json',
        other: '/tmp/open-sharing/config/other.json'
    }
    if (!fs.existsSync(configPath.res)) fs.writeFileSync(configPath.res, '[]', 'utf8')
    if (!fs.existsSync(configPath.net)) fs.writeFileSync(configPath.net, '{}', 'utf8')
    if (!fs.existsSync(configPath.sec)) fs.writeFileSync(configPath.sec, '{}', 'utf8')
    if (!fs.existsSync(configPath.other)) fs.writeFileSync(configPath.other, '{}', 'utf8')
}

export default logs